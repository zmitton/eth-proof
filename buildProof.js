const Trie = require('merkle-patricia-tree')
const Rlp = require('rlp')
const sha3 = require('js-sha3').keccak_256

const async = require('async')

const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
// console.log('EthereumTx', EthereumTx)
const EthereumBlock = require('ethereumjs-block/from-rpc')
const levelup = require('levelup')

const BN = require('bn.js')

const {promisfy, _} = require('promisfy')


class BuildProof{
  constructor(web3Provider = "http://localhost:8545"){
    this.web3 = new Web3(web3Provider)
  }

  async getProof(address, storageSlots = [], blockNumberOrHash = "latest"){
    let blockResponse = await this.web3.eth.getBlock(blockNumberOrHash)

    let prfResponse = await promisfy(
      this.web3.currentProvider.send,
      this.web3.currentProvider
    )({
      jsonrpc: "2.0",
      method: "eth_getProof",
      params: [address, storageSlots, "0x" + blockResponse.number.toString(16)],
      id: 0
    })

    let output = {}

    output.block = blockResponse
    for (var i = 0; i < Object.keys(prfResponse.result).length; i++) {
      output[Object.keys(prfResponse.result)[i]] = prfResponse.result[Object.keys(prfResponse.result)[i]]
    }
    output.addressBytes = BuildProof._strToBuf(output.address)
    output.accountBytes = Rlp.encode([
      BuildProof._strToBuf(output.nonce),
      BuildProof._strToBuf(output.balance),
      BuildProof._strToBuf(output.storageHash),
      BuildProof._strToBuf(output.codeHash)
    ])
    output.branchBytes = BuildProof._getAccountNodesBytes(prfResponse.result.accountProof)
    output.headerBytes = BuildProof._getHeaderBytes(blockResponse)
    output.blockHashBytes = BuildProof._strToBuf(blockResponse.hash)

    return output
  }

  async getAccountProof(address, blockNumberOrHash = "latest"){
    return await this.getProof(address, [], blockNumberOrHash)
  }
  // not yet tested for multi-dimentional mappings
  async getStorageProof(address, storageSlots = [], blockNumberOrHash = "latest"){
    return  await this.getProof(address, storageSlots, blockNumberOrHash)
  }

  async getTransactionProof(txHash){
    var transaction = await promisfy(this.web3.eth.getTransaction)(txHash)
    if(!transaction){ throw new Error("transaction not found")}
    // console.log("PROMISE", transaction)
    var block = await promisfy(this.web3.eth.getBlock)(transaction.blockHash, true)
    // console.log("PROMISE", block)
    var txTrie = new Trie();

    await Promise.all(block.transactions.map((siblingTx) => {
      var path = Rlp.encode(siblingTx.transactionIndex)
      var rawSignedSiblingTx = BuildProof._serializeTx(siblingTx)
      return promisfy(txTrie.put, txTrie)(path, rawSignedSiblingTx) 
    }))
    // console.log("ROOT", txTrie.root)
    let path = Rlp.encode(transaction.transactionIndex)

    return new Promise((accept, reject) => {
      txTrie.findPath(path, (e,rawTxNode,remainder,stack) => {
        if(e){
          reject(e)
        }else{
          accept({
            blockHash: BuildProof._strToBuf(transaction.blockHash),
            header:    BuildProof._getHeaderBytes(block),
            branch: BuildProof._rawStack(stack),
            path: Rlp.encode(transaction.transactionIndex),
            value: rawTxNode.value
          })
        }
      })
    })
  }

  async getReceiptProof(txHash){ //WIP
    var receipt = await promisfy(this.web3.eth.getTransactionReceipt)(txHash)
    if(!receipt){ throw new Error("receipt not found")}
    var block = await promisfy(this.web3.eth.getBlock)(receipt.blockHash, false)
    // console.log("BLOCK", block)
    var trie = new Trie();

    var receipts = await Promise.all(block.transactions.map((siblingTxHash) => {
      return promisfy(this.web3.eth.getTransactionReceipt)(siblingTxHash)
    }))
      // var path = Rlp.encode(siblingTxHash.transactionIndex)
      // var rawSignedSiblingTx = BuildProof._serializeTx(siblingTxHash)
      // return promisfy(trie.put, trie)(path, rawSignedSiblingTx) 
    // console.log("RECEIPTS ", receipts)

    await Promise.all(receipts.map((siblingReceipt, index) => {
      var path = Rlp.encode(index)
      var rawReceipt = BuildProof._serializeReceipt(siblingReceipt)

      return promisfy(trie.put, trie)(path, rawReceipt)
    }))
    // console.log("BLOCK.receiptsRoot", block.receiptsRoot)
    // console.log("TRIE_ROOT           ", trie.root.toString('hex'))
    // 0x84aea4a7aad5c5899bd5cfc7f309cc379009d30179316a2a7baa4a2ea4a438ac
    // receiptsTrie.put(rlp.encode(path), rawReceipt, function (error) {
    //   error != null ? cb2(error, null) : cb2(error, true)
    // })


    // let path = Rlp.encode(receipt.transactionIndex)
    // var [rawReceiptNode,_,stack] = await promisfy(trie.findPath, trie)(path)
    // console.log("zac", [rawReceiptNode,_,stack])
    return new Promise((accept, reject)=>{
      trie.findPath(Rlp.encode(receipt.transactionIndex), function(e,rawReceiptNode,remainder,stack){
        if(e){ return reject(e) }
        var prf = {
          path:      Rlp.encode(receipt.transactionIndex),
          value:     rawReceiptNode.value,
          branch:     BuildProof._rawStack(stack),
          header:    BuildProof._getHeaderBytes(block),
          blockHash: BuildProof._strToBuf(receipt.blockHash)
        }
        return accept(prf)
      })
    })

    // return {
    //   blockHash: BuildProof._strToBuf(receipt.blockHash),
    //   header:    BuildProof._getHeaderBytes(block),
    //   branch:     BuildProof._rawStack(stack),
    //   path:      Rlp.encode(receipt.transactionIndex),
    //   value:     Rlp.decode(rawReceiptNode.value)
    // }
    // return [a,b,c]

  }

  static _serializeReceipt(siblingReceipt){//need siblings to rebuild trie
    var cummulativeGas = BuildProof._numToBuf(siblingReceipt.cumulativeGasUsed)
    var bloomFilter = BuildProof._strToBuf(siblingReceipt.logsBloom)
    var setOfLogs = BuildProof._encodeLogs(siblingReceipt.logs)
    
    if(siblingReceipt.status != undefined && siblingReceipt.status != null){
      // var status = BuildProof._strToBuf(siblingReceipt.status)
      // This is to fix the edge case for passing integers as defined - https://github.com/ethereum/wiki/wiki/RLP
      if (siblingReceipt.status == "1" 
        || siblingReceipt.status == 1 
        || siblingReceipt.status == true
        || siblingReceipt.status == "true"
      ){
        var rawReceipt = Rlp.encode([1,cummulativeGas,bloomFilter,setOfLogs])
      } else {
        var rawReceipt = Rlp.encode([0,cummulativeGas,bloomFilter,setOfLogs])
      }
    }else{
      var postTransactionState = BuildProof._strToBuf(siblingReceipt.root)
      var rawReceipt = Rlp.encode([postTransactionState,cummulativeGas,bloomFilter,setOfLogs])
    }
    return rawReceipt

  }
  static _encodeLogs(input){
    var logs = []
    for (var i = 0; i < input.length; i++) {
      var address = BuildProof._strToBuf(input[i].address);
      var topics = input[i].topics.map(BuildProof._strToBuf)
      var data = BuildProof._strToBuf(input[i].data)
      logs.push([address, topics, data])
    }
    return logs
  }

  // getReceiptProof(txHash){
  //   self = BuildProof;
  //   // let self = BuildProof;
  //   return new Promise ((accept, reject) => {
  //     self.web3.eth.getTransactionReceipt(txHash, function(e,receipt){
  //       if(e || !receipt){ return reject("receipt not found")}
  //       self.web3.eth.getBlock(receipt.blockHash, false, function(e,block){
  //         if(e || !block){ return reject("block not found")}
  //         var receiptsTrie = new Trie();
  //         async.map(block.transactions,function(siblingTxHash, cb2){
  //           self.web3.eth.getTransactionReceipt(siblingTxHash, function(e,siblingReceipt){
  //             BuildProof._putReceipt(siblingReceipt, receiptsTrie, block.number, cb2)
  //           })
  //         }, function(e,r){
  //           receiptsTrie.findPath(Rlp.encode(receipt.transactionIndex), function(e,rawReceiptNode,remainder,stack){
  //             var prf = {
  //               blockHash: BuildProof._strToBuf(receipt.blockHash),
  //               header:    BuildProof._getHeaderBytes(block),
  //               branch:     BuildProof._rawStack(stack),
  //               path:      Rlp.encode(receipt.transactionIndex),
  //               value:     Rlp.decode(rawReceiptNode.value)
  //             }
  //             return accept(prf)
  //           })
  //         });
  //       })
  //     })
  //   })
  // }



  getLogProof(txHash, logIndex){
    self = BuildProof
    // let self = BuildProof
    return BuildProof.getReceiptProof(txHash).then((receiptProof)=>{
      return new Promise((accept, reject) => {
        // if(e || !code){reject(e || 'no code found')}
        var receipt = receiptProof.value
        var logs = receipt[3]
        var value = logs[logIndex]
        var prf = {
          blockHash: receiptProof.blockHash,
          header: receiptProof.header,
          branch: receiptProof.branch,
          path: receiptProof.path,
          logIndex: logIndex,
          value: value
        }
        accept(prf)
      })
    })
  }
//private methods
  static _rawStack(input){
    let output = []
    for (var i = 0; i < input.length; i++) {
      output.push(input[i].raw)
    }
    return Rlp.encode(output)
  }
  static _getHeaderBytes(_block) {
    _block.difficulty = '0x' + parseInt(_block.difficulty).toString(16)
    var block = new EthereumBlock(_block)
    return Rlp.encode(block.header.raw)
  }
  static _getAccountNodesBytes(accountNodes){
    let rawAccountNodes = []
    for (var i = 0; i < accountNodes.length; i++) {
      rawAccountNodes.push(BuildProof._strToBuf(accountNodes[i]))
    }
    return Rlp.encode(rawAccountNodes)
  }

  static _serializeTx(r){
    let rpcTx = r
    rpcTx.gasPrice = '0x' + new BN(rpcTx.gasPrice).toString(16)
    rpcTx.value = '0x' + new BN(rpcTx.value).toString(16)
    let tx = new EthereumTx(rpcTx).serialize()

    // console.log("rpcTx.hash ", rpcTx.hash)
    // console.log("sha3(tx)!  ", "0x"+sha3(tx), "\n")

    // if(rpcTx.hash == "0x213b50ce067f9e21d0291b1ff81054778b9ec24c2942006143b20853f208977f"){
    //   console.log("r() ", r )
    //   console.log("rpctx() ", rpcTx )
    //   console.log("rlptx", Rlp.decode(tx)) 
    // //   // console.log("tx.serialize()sha ", sha3(tx.serialize()))
    // }
    return tx
  }
  static _strToBuf(input){ 
    // if(!input.slice){ console.log("AAAAA", input)}
    if(input.slice(0,2) == "0x"){
      return Buffer.from(BuildProof._byteable(input.slice(2)), "hex")
    }else{
      return Buffer.from(BuildProof._byteable(input), "hex") 
    }
  }
  static _numToBuf(input){ return Buffer.from(BuildProof._byteable(input.toString(16)), "hex") }

  static _byteable(input){ 
    if(input.length % 2 == 0){
      return input
    }else if(input[0] != 0){
      return "0" + input 
    }else{
      return input.slice(1)
    }
  }

}

module.exports = BuildProof

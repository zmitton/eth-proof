const Trie = require('merkle-patricia-tree')
const Rlp = require('rlp')
const sha3 = require('js-sha3').keccak_256

const async = require('async')

const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const EthereumBlock = require('ethereumjs-block/from-rpc')
const levelup = require('levelup')

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

  getTransactionProof(txHash){
    let self = this;
    return new Promise((accept, reject) => {
      self.web3.eth.getTransaction(txHash, function(e,transaction){
        if(e || !transaction){ return reject(e || "transaction not found")}
        self.web3.eth.getBlock(transaction.blockHash, true, function(e,block){
          if(e || !block){ return reject(e || "block not found")}
          var txTrie = new Trie();
          let b = block;
          // console.log("transactionsRoot",block.transactionsRoot)
          async.map(block.transactions, function(siblingTx, cb2){//need siblings to rebuild trie
            var path = Rlp.encode(siblingTx.transactionIndex)
            var rawSignedSiblingTx = BuildProof._serializeTx(siblingTx)
            txTrie.put(path, rawSignedSiblingTx, function (error) {
              if(error != null){ cb2(error, null); }else{ cb2(null, true) }
            })
          }, function(e,r){
            //might need work. lookup old version!
            console.log("txTrie.root",txTrie.root)
            txTrie.findPath(Rlp.encode(transaction.transactionIndex), function(e,rawTxNode,remainder,stack){
              var prf = {
                blockHash: BuildProof._strToBuf(transaction.blockHash),
                header:    BuildProof._getHeaderBytes(block),
                branch: BuildProof._rawStack(stack),
                path: Rlp.encode(transaction.transactionIndex),
                value: rawTxNode.value
              }
              return accept(prf)
            })
          });
        })
      })
    })
  }

  getReceiptProof(txHash){
    self = this;
    // let self = this;
    return new Promise ((accept, reject) => {
      self.web3.eth.getTransactionReceipt(txHash, function(e,receipt){
        if(e || !receipt){ return reject("receipt not found")}
        self.web3.eth.getBlock(receipt.blockHash, false, function(e,block){
          if(e || !block){ return reject("block not found")}
          var receiptsTrie = new Trie();
          async.map(block.transactions,function(siblingTxHash, cb2){
            self.web3.eth.getTransactionReceipt(siblingTxHash, function(e,siblingReceipt){
              BuildProof._putReceipt(siblingReceipt, receiptsTrie, block.number, cb2)
            })
          }, function(e,r){
            receiptsTrie.findPath(Rlp.encode(receipt.transactionIndex), function(e,rawReceiptNode,remainder,stack){
              var prf = {
                blockHash: BuildProof._strToBuf(receipt.blockHash),
                header:    BuildProof._getHeaderBytes(block),
                branch:     BuildProof._rawStack(stack),
                path:      Rlp.encode(receipt.transactionIndex),
                value:     Rlp.decode(rawReceiptNode.value)
              }
              return accept(prf)
            })
          });
        })
      })
    })
  }

  getLogProof(txHash, logIndex){
    self = this
    // let self = this
    return this.getReceiptProof(txHash).then((receiptProof)=>{
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

  static _serializeTx(rpcTx){
    rpcTx.gasPrice = '0x' + parseInt(rpcTx.gasPrice).toString(16)
    rpcTx.value = '0x' + parseInt(rpcTx.value).toString(16)
    let tx = new EthereumTx(rpcTx)
    //this could be wrong
    // if(rpcTx.hash == "0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de"){
      // console.log("rpctx() ", rpcTx )
      // console.log("tx.hash!!() ", sha3(tx.serialize()) )
      // console.log("tx.serialize() ", tx.serialize().toString("hex")) 
      // console.log("tx.serialize() ", tx.serialize()) 
      // console.log("tx.serialize()sha ", sha3(tx.serialize()))
      // console.log("tx.serialize.rlp() ", Rlp.decode(tx.serialize()))
    // }
    return tx.serialize();
  }
  static _strToBuf(input){ 
    if(input.slice(0,2) == "0x"){
      return Buffer.from(this._byteable(input.slice(2)), "hex")
    }else{
      return Buffer.from(this._byteable(input), "hex") 
    }
  }
  static _numToBuf(input){ return Buffer.from(this._byteable(input.toString(16)), "hex") }

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

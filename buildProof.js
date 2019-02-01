const Trie = require('merkle-patricia-tree')
const Web3 = require('web3')
const Rpc  = require('./iso-rpc')

const Transaction    = require('ethereumjs-tx')
const Account    = require('ethereumjs-account')
const Block = require('ethereumjs-block/from-rpc')


const U = require('ethereumjs-util')

// const sha3 = require('js-sha3').keccak_256
// const async = require('async')
// console.log('Transaction', Transaction)
// const levelup = require('levelup')
// const BN = require('bn.js')

const {promisfy, _} = require('promisfy')


class BuildProof{
  constructor(rpcProvider = "http://localhost:8545"){
    this.web3 = new Web3(rpcProvider)
    this.rpc = new Rpc(rpcProvider)
  }

  async getProof(address, storageAddresses = [], blockNumberOrHash = "latest"){
    // let blockFromRpc = await this.web3.eth.getBlock(blockNumberOrHash)
    let blockFromRpc = await this.rpc.eth_getBlockByNumber(blockNumberOrHash, false)
    // storageAddresses = storageAddresses.map((storageAddress)=>{
    //   return U.bufferToHex(BuildProof.toWord(storageAddress))
    // })

// console.log("----->\n",[address, storageAddresses, blockFromRpc.number])
    // let prfResponse = await promisfy(
    //   this.web3.currentProvider.send,
    //   this.web3.currentProvider
    // )({
    //   jsonrpc: "2.0",
    //   method: "eth_getProof",
    //   // params: [address, storageAddresses, "0x" + blockFromRpc.number.toString(16)],
    //   params: [address, storageAddresses, blockFromRpc.number],
    //   id: 0
    // })
    let merkleProofFromRpc = await this.rpc.eth_getProof(address, storageAddresses, blockFromRpc.number)
    
    merkleProofFromRpc.block = blockFromRpc

    BuildProof.sanitizeResponse(
      merkleProofFromRpc,
      address,
      storageAddresses,
      blockNumberOrHash
    )

    // if(prfResponse.error){ throw new Error(prfResponse.error.message) }
    // let output = {}
// console.log("prf.result----->\n",prfResponse)

    // for (var i = 0; i < Object.keys(merkleProofFromRpc).length; i++) {
    //   output[Object.keys(merkleProofFromRpc)[i]] = merkleProofFromRpc[Object.keys(merkleProofFromRpc)[i]]
    // }

    // output.address = BuildProof._strToBuf(output.address)
    // output.account =     new Account(output)
    // console.log()
    // output.accountBytes = U.rlp.encode([
    //   BuildProof._strToBuf(output.nonce),
    //   BuildProof._strToBuf(output.balance),
    //   BuildProof._strToBuf(output.storageHash),
    //   BuildProof._strToBuf(output.codeHash)
    // ])
    // output.accountBranch = BuildProof._getBranchBytes(merkleProofFromRpc.accountProof)
    // output.headerBytes = BuildProof._getHeaderBytes(blockFromRpc)
    output.blockHashBytes = BuildProof._strToBuf(blockFromRpc.hash)


    // output.storageAddressBytes = U.toBuffer(merkleProofFromRpc.storageProof[0].key)
    // output.storageValueBytes = U.toBuffer(merkleProofFromRpc.storageProof[0].value)
    // output.storageBranchBytes = BuildProof._getBranchBytes(merkleProofFromRpc.storageProof[0].proof)

    return output
  }

  async getAccountProof(address, blockNumberOrHash = "latest"){
    return await this.getStorageProof(address, [], blockNumberOrHash)
  }
  // todo: test multi-dimensional mappings
  async getStorageProof(address, storageAddresses = [], blockNumberOrHash = "latest"){
    if(!Array.isArray(storageAddresses)){ storageAddresses = [storageAddresses] }
    // storageAddresses = storageAddresses.map((storageSlot)=>{ return storageSlot.toString(16) })
    return await this.getProof(address, storageAddresses, blockNumberOrHash)
  }

  async getTransactionProof(txHash){
    var transaction = await promisfy(this.web3.eth.getTransaction)(txHash)
    if(!transaction){ throw new Error("Tx not found. Use archive node")}

    var block = await promisfy(this.web3.eth.getBlock)(transaction.blockHash, true)

    var trie = new Trie();

    await Promise.all(block.transactions.map((siblingTx) => {
      var path = U.rlp.encode(siblingTx.transactionIndex)
      var rawSignedSiblingTx = BuildProof._serializeTx(siblingTx)
      return promisfy(trie.put, trie)(path, rawSignedSiblingTx) 
    }))

    let path = U.rlp.encode(transaction.transactionIndex)

    var [rawTxNode,_,stack] = await promisfy(trie.findPath, trie)(path)

    return {
      blockHash: BuildProof._strToBuf(transaction.blockHash),
      header:    BuildProof._getHeaderBytes(block),
      branch: BuildProof._rawStack(stack),
      path: U.rlp.encode(transaction.transactionIndex),
      value: rawTxNode.value
    }
  }

  async getReceiptProof(txHash){ //WIP
    var receipt = await promisfy(this.web3.eth.getTransactionReceipt)(txHash)
    if(!receipt){ throw new Error("txhash/receipt not found. (use Archive node)")}
    
    var block = await promisfy(this.web3.eth.getBlock)(receipt.blockHash, false)
  // console.log("BLOCK: ",block)

    var trie = new Trie();

    var receipts = await Promise.all(block.transactions.map((siblingTxHash) => {
      return promisfy(this.web3.eth.getTransactionReceipt)(siblingTxHash)
    }))

    await Promise.all(receipts.map((siblingReceipt, index) => {
      var path = U.rlp.encode(index)
      var rawReceipt = BuildProof._serializeReceipt(siblingReceipt)

      return promisfy(trie.put, trie)(path, rawReceipt)
    }))

    let path = U.rlp.encode(receipt.transactionIndex)
    var [rawReceiptNode,_,stack] = await promisfy(trie.findPath, trie)(path)

    return {
      path:      U.rlp.encode(receipt.transactionIndex),
      value:     rawReceiptNode.value,
      branch:     BuildProof._rawStack(stack),
      header:    BuildProof._getHeaderBytes(block),
      blockHash: BuildProof._strToBuf(receipt.blockHash)
    }
  }

  async getLogProof(txHash, logIndex){
    let receiptProof = await this.getReceiptProof(txHash)
    return {
      rlpLogIndex: U.rlp.encode(logIndex),
      value: U.rlp.encode(U.rlp.decode(receiptProof.value)[3][logIndex]),
      rlpTxIndex: receiptProof.path,
      receipt: receiptProof.value,
      branch: receiptProof.branch,
      header: receiptProof.header,
      blockHash: receiptProof.blockHash,
    }
  }

  static mappingAt(...keys){ // first key is mapping's position
    keys[0] = BuildProof.toWord(keys[0])
    return keys.reduce((positionAccumulator, key)=>{
      return U.keccak(Buffer.concat([BuildProof.toWord(key) ,positionAccumulator]))
    })
  }

  static toWord(input){
    return U.setLengthLeft(U.toBuffer(U.addHexPrefix(input)), 32)
  }
    // if(_mappingKeys.length > 0){
    //   for(var i = 0 ; i < _mappingKeys.length ; i++){
    //     bufMappings.push(Buffer.from(leftPad(_mappingKeys[i]),'hex'))
    //     pathBuilder = Buffer.concat([bufMappings[i], pathBuilder])
    //   }
    //   pathBuilder = Buffer.from(sha3(pathBuilder),'hex')
    // }

    // var storagePath = Buffer.from(sha3(pathBuilder),'hex') //not going this far cause RPC doesnt expect it

//private methods
  static _serializeReceipt(receipt){
    var cummulativeGas = BuildProof._numToBuf(receipt.cumulativeGasUsed)
    var bloomFilter = BuildProof._strToBuf(receipt.logsBloom)
    var setOfLogs = BuildProof._encodeLogs(receipt.logs)
    
    if(receipt.status != undefined && receipt.status != null){
      // var status = BuildProof._strToBuf(receipt.status)
      // This is to fix the edge case for passing integers as defined - https://github.com/ethereum/wiki/wiki/RLP
      if (receipt.status == "1" 
        || receipt.status == 1 
        || receipt.status == true
        || receipt.status == "true"
      ){
        var rawReceipt = U.rlp.encode([1,cummulativeGas,bloomFilter,setOfLogs])
      } else {
        var rawReceipt = U.rlp.encode([0,cummulativeGas,bloomFilter,setOfLogs])
      }
    }else{
      var postTransactionState = BuildProof._strToBuf(receipt.root)
      var rawReceipt = U.rlp.encode([postTransactionState,cummulativeGas,bloomFilter,setOfLogs])
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
  static _rawStack(input){
    let output = []
    for (var i = 0; i < input.length; i++) {
      output.push(input[i].raw)
    }
    return U.rlp.encode(output)
  }
  static _getHeaderBytes(_block) {
    if(typeof _block.difficulty == "string" && _block.difficulty.slice(0,2) != "0x"){
      _block.difficulty = '0x' + new U.BN(_block.difficulty).toString(16)
    }
    var block = new Block(_block)
    return U.rlp.encode(block.header.raw)
  }
  static _getBranchBytes(branchNodes){
    let rawbranchNodes = []
    for (var i = 0; i < branchNodes.length; i++) {
      rawbranchNodes.push(U.rlp.decode(BuildProof._strToBuf(branchNodes[i])))
    }
    return U.rlp.encode(rawbranchNodes)
  }

  static _getStorageAddressBytes(storageProof){
    return storageProof.key
  }
  static _getStorageValueBytes(storageProof){
    return 
  }
  static _getStorageBranchBytes(storageProof){
    return 
  }

  static _serializeTx(r){
    let rpcTx = r
    rpcTx.gasPrice = U.addHexPrefix(new U.BN(rpcTx.gasPrice).toString(16))
    rpcTx.value = U.addHexPrefix(new U.BN(rpcTx.value).toString(16))
    let tx = new Transaction(rpcTx).serialize()
    return tx
  }
  static _strToBuf(input){
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

  static sanitizeResponse(merkleProofFromRpc, address, storageAddresses, blockNumberOrHash){
    // make sure the response corresponds to the data they requested
    console.assert(merkleProofFromRpc.address == address)
    console.assert(merkleProofFromRpc.block.hash == blockNumberOrHash
      || merkleProofFromRpc.block.number == blockNumberOrHash
      || blockNumberOrHash == 'latest'
      || blockNumberOrHash == 'earliest'
      || blockNumberOrHash == 'pending')
    
    for (var i = 0; i < storageAddresses.length; i++) {
      console.assert(merkleProofFromRpc.storageProof[i].key == U.keccak(storageAddresses[i]))
      merkleProofFromRpc.storageProof[i].key = BuildProof.toWord(merkleProofFromRpc.storageProof[i].key)
    }
  }
}

module.exports = BuildProof

// flock team: agaron 1
// aragon 1 blog
// aragon forum


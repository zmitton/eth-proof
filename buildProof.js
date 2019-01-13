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

    var block = await promisfy(this.web3.eth.getBlock)(transaction.blockHash, true)

    var trie = new Trie();

    await Promise.all(block.transactions.map((siblingTx) => {
      var path = Rlp.encode(siblingTx.transactionIndex)
      var rawSignedSiblingTx = BuildProof._serializeTx(siblingTx)
      return promisfy(trie.put, trie)(path, rawSignedSiblingTx) 
    }))

    let path = Rlp.encode(transaction.transactionIndex)

    var [rawTxNode,_,stack] = await promisfy(trie.findPath, trie)(path)

    return {
      blockHash: BuildProof._strToBuf(transaction.blockHash),
      header:    BuildProof._getHeaderBytes(block),
      branch: BuildProof._rawStack(stack),
      path: Rlp.encode(transaction.transactionIndex),
      value: rawTxNode.value
    }
  }

  async getReceiptProof(txHash){ //WIP
    var receipt = await promisfy(this.web3.eth.getTransactionReceipt)(txHash)
    if(!receipt){ throw new Error("txhash/receipt not found")}
    
    var block = await promisfy(this.web3.eth.getBlock)(receipt.blockHash, false)

    var trie = new Trie();

    var receipts = await Promise.all(block.transactions.map((siblingTxHash) => {
      return promisfy(this.web3.eth.getTransactionReceipt)(siblingTxHash)
    }))

    await Promise.all(receipts.map((siblingReceipt, index) => {
      var path = Rlp.encode(index)
      var rawReceipt = BuildProof._serializeReceipt(siblingReceipt)

      return promisfy(trie.put, trie)(path, rawReceipt)
    }))

    let path = Rlp.encode(receipt.transactionIndex)
    var [rawReceiptNode,_,stack] = await promisfy(trie.findPath, trie)(path)

    return {
      path:      Rlp.encode(receipt.transactionIndex),
      value:     rawReceiptNode.value,
      branch:     BuildProof._rawStack(stack),
      header:    BuildProof._getHeaderBytes(block),
      blockHash: BuildProof._strToBuf(receipt.blockHash)
    }
  }

  async getLogProof(txHash, logIndex){
    let receiptProof = await this.getReceiptProof(txHash)

    return {
      rlpLogIndex: Rlp.encode(logIndex),
      value: Rlp.encode(Rlp.decode(receiptProof.value)[3][logIndex]),
      rlpTxIndex: receiptProof.path,
      receipt: receiptProof.value,
      branch: receiptProof.branch,
      header: receiptProof.header,
      blockHash: receiptProof.blockHash,
    }
  }
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
        var rawReceipt = Rlp.encode([1,cummulativeGas,bloomFilter,setOfLogs])
      } else {
        var rawReceipt = Rlp.encode([0,cummulativeGas,bloomFilter,setOfLogs])
      }
    }else{
      var postTransactionState = BuildProof._strToBuf(receipt.root)
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

}

module.exports = BuildProof

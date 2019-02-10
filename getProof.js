const Trie = require('merkle-patricia-tree')
const Rpc  = require('./iso-rpc')
const Verify = require('./verify')
const Get = require('./getProof')

const Transaction    = require('ethereumjs-tx') //remove for dependency
const Account    = require('./account')
const Branch = require('./branch')
const Header = require('./header')
const Receipt = require('./receipt')

const { keccak, encode, decode, toBuffer, toHex, toWord, mappingAt } = require('./ethUtils')
const { promisfy } = require('promisfy')

module.exports = class GetProof{
  constructor(rpcProvider = "http://localhost:8545"){
    this.rpc = new Rpc(rpcProvider)
  }

  async transactionProof(txHash){
    var targetTx = await this.rpc.eth_getTransactionByHash(txHash)
    if(!targetTx){ throw new Error("Tx not found. Use archive node")}

    var block = await this.rpc.eth_getBlockByHash(targetTx.blockHash, true)

    var trie = new Trie();

    await Promise.all(block.transactions.map((siblingTx, index) => {
      var siblingPath = encode(index)
      var serializedSiblingTx = new Transaction(siblingTx).serialize()
      return promisfy(trie.put, trie)(siblingPath, serializedSiblingTx) 
    }))

    let [_,__,stack] = await promisfy(trie.findPath, trie)(encode(targetTx.transactionIndex))

    return {
      header:  Header.fromRpc(block),
      branch:  Branch.fromStack(stack),
      txIndex: targetTx.transactionIndex,
      tx:      new Transaction(targetTx).raw,
    }
  }
  async receiptProof(txHash){
    let targetReceipt = await this.rpc.eth_getTransactionReceipt(txHash)
    if(!targetReceipt){ throw new Error("txhash/targetReceipt not found. (use Archive node)")}

    let block = await this.rpc.eth_getBlockByHash(targetReceipt.blockHash, false)

    let receipts = await Promise.all(block.transactions.map((siblingTxHash) => {
      return this.rpc.eth_getTransactionReceipt(siblingTxHash)
    }))

    let trie = new Trie();

    await Promise.all(receipts.map((siblingReceipt, index) => {
      let siblingPath = encode(index)
      let serializedReceipt = Receipt.fromRpc(siblingReceipt).serialize()
      return promisfy(trie.put, trie)(siblingPath, serializedReceipt)
    }))

    let [_,__,stack] = await promisfy(trie.findPath, trie)(encode(targetReceipt.transactionIndex))

    return {
      header:  Header.fromRpc(block),
      branch:  Branch.fromStack(stack),
      txIndex: targetReceipt.transactionIndex,
      receipt: Receipt.fromRpc(targetReceipt)
    }
  }
  async accountProof(address, storageAddresses = [], blockHash = null){
    let rpcBlock, rpcProof
    if(blockHash){//function overloading
      rpcBlock = await this.rpc.eth_getBlockByHash(blockHash, false)
    }else{
      rpcBlock = await this.rpc.eth_getBlockByNumber('latest', false)
    }
    rpcProof = await this.rpc.eth_getProof(address, storageAddresses, rpcBlock.number)

    return {
      header: Header.fromRpc(rpcBlock),
      accountBranch: Branch.fromRpc(rpcProof.accountProof),
      account: Account.fromRpc(rpcProof)
    }
  }
  async storageProof(address, storageAddresses = [], blockHash = null){
    let rpcBlock, rpcProof
    if(blockHash){
      rpcBlock = await this.rpc.eth_getBlockByHash(blockHash, false)
    }else{
      rpcBlock = await this.rpc.eth_getBlockByNumber('latest', false)
    }
    rpcProof = await this.rpc.eth_getProof(address, storageAddresses, rpcBlock.number)

    return {
      header: Header.fromRpc(rpcBlock), //new Block(rpcBlock).header.raw,
      accountBranch: Branch.fromRpc(rpcProof.accountProof),
      account: Account.fromRpc(rpcProof),
      storageBranch: Branch.fromRpc(rpcProof.storageProof[0].proof),
      storage: toBuffer(rpcProof.storageProof[0].value),
    }
  }
}

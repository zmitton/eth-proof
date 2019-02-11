const { promisfy } = require('promisfy')
const Tree = require('merkle-patricia-tree')

const Rpc  = require('isomorphic-rpc')
const Verify = require('./verify')
const Get = require('./getProof')

const Transaction    = require('ethereumjs-tx') //to do: remove dependency
const Account    = require('./account')
const Branch = require('./branch')
const Header = require('./header')
const Receipt = require('./receipt')

const { encode, toBuffer } = require('./ethUtils')

module.exports = class GetProof{
  constructor(rpcProvider = "http://localhost:8545"){
    this.rpc = new Rpc(rpcProvider)
    this.eth_getProof = this.rpc.eth_getProof
  }

  async transactionProof(txHash){
    var targetTx = await this.rpc.eth_getTransactionByHash(txHash)
    if(!targetTx){ throw new Error("Tx not found. Use archive node")}

    var block = await this.rpc.eth_getBlockByHash(targetTx.blockHash, true)

    var tree = new Tree();

    await Promise.all(block.transactions.map((siblingTx, index) => {
      var siblingPath = encode(index)
      var serializedSiblingTx = new Transaction(siblingTx).serialize()
      return promisfy(tree.put, tree)(siblingPath, serializedSiblingTx) 
    }))

    let [_,__,stack] = await promisfy(tree.findPath, tree)(encode(targetTx.transactionIndex))

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

    let tree = new Tree();

    await Promise.all(receipts.map((siblingReceipt, index) => {
      let siblingPath = encode(index)
      let serializedReceipt = Receipt.fromRpc(siblingReceipt).serialize()
      return promisfy(tree.put, tree)(siblingPath, serializedReceipt)
    }))

    let [_,__,stack] = await promisfy(tree.findPath, tree)(encode(targetReceipt.transactionIndex))

    return {
      header:  Header.fromRpc(block),
      branch:  Branch.fromStack(stack),
      txIndex: targetReceipt.transactionIndex,
      receipt: Receipt.fromRpc(targetReceipt)
    }
  }
  async accountProof(address, blockHash = null){
    let rpcBlock, rpcProof
    if(blockHash){
      rpcBlock = await this.rpc.eth_getBlockByHash(blockHash, false)
    }else{
      rpcBlock = await this.rpc.eth_getBlockByNumber('latest', false)
    }
    rpcProof = await this.eth_getProof(address, [], rpcBlock.number)

    return {
      header: Header.fromRpc(rpcBlock),
      accountBranch: Branch.fromRpc(rpcProof.accountProof),
      account: Account.fromRpc(rpcProof)
    }
  }
  async storageProof(address, storageAddress, blockHash = null){
    let rpcBlock, rpcProof
    if(blockHash){
      rpcBlock = await this.rpc.eth_getBlockByHash(blockHash, false)
    }else{
      rpcBlock = await this.rpc.eth_getBlockByNumber('latest', false)
    }
    rpcProof = await this.eth_getProof(address, [storageAddress], rpcBlock.number)

    return {
      header: Header.fromRpc(rpcBlock),
      accountBranch: Branch.fromRpc(rpcProof.accountProof),
      account: Account.fromRpc(rpcProof),
      storageBranch: Branch.fromRpc(rpcProof.storageProof[0].proof),
      storage: toBuffer(rpcProof.storageProof[0].value),
    }
  }
}

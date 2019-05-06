const { encode } = require('eth-util-lite')
const { promisfy } = require('promisfy')

const Tree = require('merkle-patricia-tree')

const Rpc  = require('isomorphic-rpc')

const { Header, Proof, Receipt, Transaction } = require('eth-object')


module.exports = class GetProof{
  constructor(rpcProvider = "https://mainnet.infura.io"){
    this.rpc = new Rpc(rpcProvider)
    this.eth_getProof = this.rpc.eth_getProof
  }

  async transactionProof(txHash){
    let targetTx = await this.rpc.eth_getTransactionByHash(txHash)
    if(!targetTx){ throw new Error("Tx not found. Use archive node")}

    let rpcBlock = await this.rpc.eth_getBlockByHash(targetTx.blockHash, true)

    let tree = new Tree();

    await Promise.all(rpcBlock.transactions.map((siblingTx, index) => {
      let siblingPath = encode(index)
      let serializedSiblingTx = Transaction.fromRpc(siblingTx).serialize()
      return promisfy(tree.put, tree)(siblingPath, serializedSiblingTx) 
    }))

    let [_,__,stack] = await promisfy(tree.findPath, tree)(encode(targetTx.transactionIndex))

    return {
      header:  Header.fromRpc(rpcBlock),
      txProof:  Proof.fromStack(stack),
      txIndex: targetTx.transactionIndex,
    }
  }
  async receiptProof(txHash){
    let targetReceipt = await this.rpc.eth_getTransactionReceipt(txHash)
    if(!targetReceipt){ throw new Error("txhash/targetReceipt not found. (use Archive node)")}

    let rpcBlock = await this.rpc.eth_getBlockByHash(targetReceipt.blockHash, false)

    let receipts = await Promise.all(rpcBlock.transactions.map((siblingTxHash) => {
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
      header:  Header.fromRpc(rpcBlock),
      receiptProof:  Proof.fromStack(stack),
      txIndex: targetReceipt.transactionIndex,
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
      accountProof: Proof.fromRpc(rpcProof.accountProof),
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
      accountProof: Proof.fromRpc(rpcProof.accountProof),
      storageProof: Proof.fromRpc(rpcProof.storageProof[0].proof),
    }
  }
}

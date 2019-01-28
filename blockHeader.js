const U = require('ethereumjs-util')

class BlockHeader{
  constructor(rpcResult){
    this.parentHash = rpcResult.parentHash
    this.sha3Uncles = rpcResult.sha3Uncles
    this.miner = rpcResult.miner
    this.stateRoot = rpcResult.stateRoot
    this.transactionsRoot = rpcResult.transactionsRoot
    // this.receiptsRoot = rpcResult.receiptsRoot
    this.receiptsRoot = rpcResult.receiptRoot || rpcResult.receiptsRoot || U.SHA3_NULL
    this.logsBloom = rpcResult.logsBloom
    this.difficulty = rpcResult.difficulty
    this.number = rpcResult.number
    this.gasLimit = rpcResult.gasLimit
    this.gasUsed = rpcResult.gasUsed
    this.timestamp = rpcResult.timestamp
    this.extraData = rpcResult.extraData
    this.mixHash = rpcResult.mixHash
    this.nonce = rpcResult.nonce
  }
  raw(){
    let self = this
    return Object.keys(self).map(function (key) {
      return U.toBuffer(self[key])
    })
  }
  hash(){
    U.keccak(U.rlp.encode(this.raw())).toString('hex')
  }
}

module.exports = BlockHeader

const U = require('ethereumjs-util')

class EthObj{
  static raw(){
    let self = this
    return Object.keys(self).map((key)=>{
      return U.toBuffer(self[key])
    })
  }
}

class BlockHeader extends Array{
  constructor(decoded){ super(decoded) }
  fromRaw(decoded){ return new Blockheader(decoded) }
  fromRpc(rpcResult = {}){
    let raw = Blockheader.fields.map((field)=>{ return field })
    return Blockheader.fromRaw(raw)
  }



    return new Blockheader([
      rpcResult.parentHash,
      rpcResult.sha3Uncles || U.KECCAK256_RLP_ARRAY,
      rpcResult.miner,
      rpcResult.stateRoot || U.SHA3_NULL,
      rpcResult.transactionsRoot || U.SHA3_NULL,
      rpcResult.receiptRoot || rpcResult.receiptsRoot || U.SHA3_NULL,
      rpcResult.logsBloom,
      rpcResult.difficulty,
      rpcResult.number,
      rpcResult.gasLimit,
      rpcResult.gasUsed,
      rpcResult.timestamp,
      rpcResult.extraData,
      rpcResult.mixHash,
      rpcResult.nonce,
    ])
  }

  fromSerialized(encoded){ }

  hash(){
    return U.keccak(U.rlp.encode(this.raw())).toString('hex') //untested
  }

  get NULL(){
    return new BlockHeader()
  }

}

module.exports = BlockHeader

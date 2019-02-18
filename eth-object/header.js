const { keccak, encode, decode, toBuffer, toHex } = require('./../ethUtils')

class Header extends Array{

  static get PARENT_HASH_INDEX(){ return 0 }
  static get SHA_3_UNCLES_INDEX(){ return 1 }
  static get MINER_INDEX(){ return 2 }
  static get STATE_ROOT_INDEX(){ return 3 }
  static get TRANSACTIONS_ROOT_INDEX(){ return 4 }
  static get RECEIPTS_ROOT_INDEX(){ return 5 }
  static get LOGS_BLOOM_INDEX(){ return 6 }
  static get DIFFICULTY_INDEX(){ return 7 }
  static get NUMBER_INDEX(){ return 8 }
  static get GAS_LIMIT_INDEX(){ return 9 }
  static get GAS_USED_INDEX(){ return 10 }
  static get TIMESTAMP_INDEX(){ return 11 }
  static get EXTRA_DATA_INDEX(){ return 12 }
  static get MIX_HASH_INDEX(){ return 13 }
  static get NONCE_INDEX(){ return 14 }
  // static get NULL(){return [toBuffer(), toBuffer(), keccak(encode()), keccak()]}

  constructor(raw = []){
    console.assert(raw.length === 15, 'Invalid construction arguments')
    super(...raw)
      this.parentHash = this[Header.PARENT_HASH_INDEX]
      this.sha3Uncles = this[Header.SHA_3_UNCLES_INDEX]
      this.miner = this[Header.MINER_INDEX]
      this.stateRoot = this[Header.STATE_ROOT_INDEX]
      this.transactionsRoot = this[Header.TRANSACTIONS_ROOT_INDEX]
      this.receiptRoot = this[Header.RECEIPTS_ROOT_INDEX]
      this.logsBloom = this[Header.LOGS_BLOOM_INDEX]
      this.difficulty = this[Header.DIFFICULTY_INDEX]
      this.number = this[Header.NUMBER_INDEX]
      this.gasLimit = this[Header.GAS_LIMIT_INDEX]
      this.gasUsed = this[Header.GAS_USED_INDEX]
      this.timestamp = this[Header.TIMESTAMP_INDEX]
      this.extraData = this[Header.EXTRA_DATA_INDEX]
      this.mixHash = this[Header.MIX_HASH_INDEX]
      this.nonce = this[Header.NONCE_INDEX]
  }

  static fromRpc(rpcBlk){ 
    let arrayofStringsHeader = [
      rpcBlk.parentHash,
      rpcBlk.sha3Uncles || U.KECCAK256_RLP_ARRAY,
      rpcBlk.miner,
      rpcBlk.stateRoot || U.SHA3_NULL,
      rpcBlk.transactionsRoot || U.SHA3_NULL,
      rpcBlk.receiptsRoot || rpcBlk.receiptRoot || U.SHA3_NULL,
      rpcBlk.logsBloom,
      rpcBlk.difficulty,
      rpcBlk.number,
      rpcBlk.gasLimit,
      rpcBlk.gasUsed,
      rpcBlk.timestamp,
      rpcBlk.extraData,
      rpcBlk.mixHash,
      rpcBlk.nonce
    ]
    let arrayofBytesHeader = arrayofStringsHeader.map((strElem)=>{ return toBuffer(strElem) })
    return new Header(arrayofBytesHeader)
  }
  static fromObject(obj){ return this.fromRpc(obj) }

  static fromHex(hexString){ return new Header(decode(hexString)) }
  static fromBuffer(buf){ return new Header(decode(buf)) }
  static fromRaw(raw){ return new Header(raw) }

  raw(){ // a generic 15-item array without the methods
    let output = []
    for (let i = 0; i < this.length; i++) { output[i] = this[i] }
    return output
  }
  serialize(){ return encode(this.raw()) } // a single byte-array
  toBuffer() { return this.serialize()} //alias
  toHex(){ return toHex(this.serialize())} // a hex-string of all the bytes

  toObject(){ // a generic js-object with the 15 header properties
    return {
      parentHash: toHex(this.parentHash),
      sha3Uncles: toHex(this.sha3Uncles),
      miner: toHex(this.miner),
      stateRoot: toHex(this.stateRoot),
      transactionsRoot: toHex(this.transactionsRoot),
      receiptRoot: toHex(this.receiptRoot),
      logsBloom: toHex(this.logsBloom),
      difficulty: toHex(this.difficulty),
      number: toHex(this.number),
      gasLimit: toHex(this.gasLimit),
      gasUsed: toHex(this.gasUsed),
      timestamp: toHex(this.timestamp),
      extraData: toHex(this.extraData),
      mixHash: toHex(this.mixHash),
      nonce: toHex(this.nonce)
    }
  }

  toJson(){ return JSON.stringify(this.toObject()) } // the object above as a string
  toString(){ return this.toJson() } // alias

}

module.exports = Header











//   //   return new Receipt([
//   //     rpcResult.parentHash,
//   //     rpcResult.sha3Uncles || U.KECCAK256_RLP_ARRAY,
//   //     rpcResult.miner,
//   //     rpcResult.stateRoot || U.SHA3_NULL,
//   //     rpcResult.transactionsRoot || U.SHA3_NULL,
//   //     rpcResult.receiptRoot || rpcResult.receiptsRoot || U.SHA3_NULL,
//   //     rpcResult.logsBloom,
//   //     rpcResult.difficulty,
//   //     rpcResult.number,
//   //     rpcResult.gasLimit,
//   //     rpcResult.gasUsed,
//   //     rpcResult.timestamp,
//   //     rpcResult.extraData,
//   //     rpcResult.mixHash,
//   //     rpcResult.nonce,
//   //   ])
//   // }
// const U = require('ethereumjs-util')

// class EthObj{
//   static raw(){
//     let self = this
//     return Object.keys(self).map((key)=>{
//       return U.toBuffer(self[key])
//     })
//   }
// }

// class Log extends Array{
//   constructor(decoded){ super(decoded) }
//   fromRaw(decoded){ return new Log(decoded) }
//   fromRpc(rpcResult = {}){
//     let raw = Receipt.fields.map((field)=>{ return U.toBuffer(rpcResult[field]) })
//     return Receipt.fromRaw(raw)
//   }

//   static get fields(){
//     return [
//       "ng1",
//       "rgffdg",
//       "asdfdasf"
//     ]
//   }


// }

// class Receipt extends Array{
//   constructor(decoded){ super(decoded) }
//   fromRaw(decoded){ return new Receipt(decoded) }
//   fromRpc(rpcResult = {}){
//     let raw = Receipt.fields.map((field)=>{ return U.toBuffer(rpcResult[field]) })
//     return Receipt.fromRaw(raw)
//   }

//   static get fields(){
//     return [
//       "thing1",
//       "thing3"
//     ]
//   }


//   fromSerialized(encoded){ }

//   hash(){
//     return U.keccak(U.rlp.encode(this.raw())).toString('hex') //untested
//   }

//   get NULL(){
//     return new BlockHeader()
//   }

// }














// module.exports = BlockHeader

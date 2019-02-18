const { keccak, encode, decode, toBuffer, toHex } = require('./../ethUtils')

class Transaction extends Array{

  static get NONCE_INDEX(){ return 0 }
  static get GAS_PRICE_INDEX(){ return 1 }
  static get GAS_LIMIT_INDEX(){ return 2 }
  static get TO_INDEX(){ return 3 }
  static get VALUE_INDEX(){ return 4 }
  static get DATA_INDEX(){ return 5 }
  static get V_INDEX(){ return 6 }
  static get R_INDEX(){ return 7 }
  static get S_INDEX(){ return 8 }
  static get NULL(){ return [...Array(toBuffer())] }

  constructor(raw){
    super(...raw)
    // Object.defineMethod()
    // this.nonce = this[Transaction.SET_OF_LOGS_INDEX]
  }

  static fromObject(rpcResponse){ 
    return new Transaction([
      toBuffer(rpcResponse.nonce),
      toBuffer(rpcResponse.gasPrice),
      toBuffer(rpcResponse.gas || rpcResponse.gasLimit),
      toBuffer(rpcResponse.to),
      toBuffer(rpcResponse.value),
      toBuffer(rpcResponse.input || rpcResponse.data),
      toBuffer(rpcResponse.v),
      toBuffer(rpcResponse.r),
      toBuffer(rpcResponse.s)
    ])
  }
  static fromRpc(rpcResponse){ return Transaction.fromObject(rpcResponse) }
  static fromHex(hexString){ return new Transaction(decode(hexString)) }
  static fromBuffer(buf){ return new Transaction(decode(buf)) }
  static fromRaw(raw){ return new Transaction(raw) }

  raw(){ // a generic 4-item array without the methods
    let output = []
    for (let i = 0; i < this.length; i++) { output[i] = this[i] }
    return output
  }
  serialize(){ return encode(this.raw()) } // a single byte-array
  toBuffer() { return this.serialize()} //alias
  toHex(){ return toHex(this.serialize())} // a hex-string of the bytes

  // toObject(){ // a generic js-object with the 4 properties
  //   let obj = {
  //     cumulativeGasUsed: toHex(this.cumulativeGasUsed),
  //     bloomFilter: toHex(this.bloomFilter),
  //     setOfLogs: []
  //   }

  //   return obj
  // }
  // toJson(){ return JSON.stringify(this.toObject()) } // the object above as a string
  // toString(){ return this.toJson() } // alias

}

module.exports = Transaction




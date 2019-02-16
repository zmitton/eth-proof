const { keccak, encode, decode, toBuffer, toHex } = require('./../ethUtils')
const Log = require('./log')

class Receipt extends Array{

  static get POST_TRANSACTION_STATE_INDEX(){ return 0 }
  static get STATUS_INDEX(){ return 0 }
  static get CUMULATIVE_GAS_USED_INDEX(){ return 1 }
  static get BLOOM_FILTER_INDEX(){ return 2 }
  static get SET_OF_LOGS_INDEX(){ return 3 }

  // static get NULL(){return [toBuffer(), toBuffer(), keccak(encode()), keccak()]}

  constructor(raw){
    super(...raw)
    if(this[0].length === 64){
      this.postTransactionState = this[Receipt.POST_TRANSACTION_STATE_INDEX]
    }else{
      this.status = this[Receipt.STATUS_INDEX]
    }
    this.cumulativeGasUsed = this[Receipt.CUMULATIVE_GAS_USED_INDEX]
    this.bloomFilter       = this[Receipt.BLOOM_FILTER_INDEX]
    this.setOfLogs         = this[Receipt.SET_OF_LOGS_INDEX]
  }

  static fromObject(rpcResponse){ 
    let logs = []
    for (var i = 0; i < rpcResponse.logs.length; i++) {
       logs.push(Log.fromRpc(rpcResponse.logs[i]))
    }
    return new Receipt([
      toBuffer(rpcResponse.status || rpcResponse.root),
      toBuffer(rpcResponse.cumulativeGasUsed),
      toBuffer(rpcResponse.logsBloom),
      logs
    ])
  }
  static fromRpc(rpcResponse){ return Receipt.fromObject(rpcResponse) }
  static fromHexString(hexString){ return new Receipt(decode(hexString)) }
  static fromBuffer(buf){ return new Receipt(decode(buf)) }
  static fromRaw(raw){ return new Receipt(raw) }


  raw(){ // a generic 4-item array without the methods
    let output = []
    for (let i = 0; i < this.length; i++) {
      if(this[i] instanceof Buffer){
        output.push(this[i])
      }else if(this[i] instanceof Array){
        let rawLogs = []
        for (var j = 0; j < this[i].length; j++) {
          rawLogs.push(this[i][j].raw())
        }
        output.push(rawLogs)
      }
    }
    return output
  }
  serialize(){ return encode(this.raw()) } // a single byte-array
  toBuffer() { return this.serialize()} //alias
  toHex(){ return toHex(this.serialize())} // a hex-string of the bytes

  toObject(){ // a generic js-object with the 4 properties
    let obj = {
      cumulativeGasUsed: toHex(this.cumulativeGasUsed),
      bloomFilter: toHex(this.bloomFilter),
      setOfLogs: []
    }
    for (var i = 0; i < this.logs.length; i++) {
      obj.setOfLogs.push(this.logs[i].toObject())
    }
    if(this[0].length == 64){
      obj.postTransactionState = toHex(this[0])
    }else{
      obj.status = toHex(this[0])
    }
    return obj
  }
  toJson(){ return JSON.stringify(this.toObject()) } // the object above as a string
  toString(){ return this.toJson() } // alias

}

module.exports = Receipt




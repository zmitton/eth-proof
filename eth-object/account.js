const { keccak, encode, decode, toBuffer, toHex } = require('./../ethUtils')

class Account extends Array{

  static get NONCE_INDEX(){ return 0 }
  static get BALANCE_INDEX(){ return 1 }
  static get STORAGE_ROOT_INDEX(){ return 2 }
  static get CODE_HASH_INDEX(){ return 3 }
  static get NULL(){return new Account([toBuffer(), toBuffer(), keccak(encode()), keccak()]) }

  constructor(raw = Account.NULL){
    super(...raw)
    this.nonce = this[Account.NONCE_INDEX] 
    this.balance =  this[Account.BALANCE_INDEX] 
    this.storageRoot = this[Account.STORAGE_ROOT_INDEX] 
    this.codeHash = this[Account.CODE_HASH_INDEX] 
  }

  static fromObject(rpcResponse){
    if(rpcResponse){
      return new Account([
        toBuffer(rpcResponse.nonce),
        toBuffer(rpcResponse.balance), //deal with zero problem
        toBuffer(rpcResponse.storageHash || rpcResponse.storageRoot || keccak(encode())),
        toBuffer(rpcResponse.codeHash || rpcResponse.codeRoot || keccak())
      ])
    }else{
      return new Account()
    }
  }
  static fromRpc(rpcResponse){ return Account.fromObject(rpcResponse) }
  static fromHex(hex){ return hex ? new Account(decode(hex)) : new Account() }
  static fromBuffer(buf){ return buf ? new Account(decode(buf)) : new Account() }
  static fromRaw(raw){ return new Account(raw) }



  raw(){ // a generic 4-item array without the methods
    let output = []
    for (let i = 0; i < this.length; i++) { output[i] = this[i] }
    return output
  }
  serialize(){ return encode(this.raw()) } // a single byte-array
  toBuffer() { return this.serialize()} //alias
  toHex(){ return toHex(this.serialize())} // a hex-string of the bytes

  toObject(){ // a generic js-object with the 4 account properties
    return {
      nonce: toHex(this.nonce),
      balance: toHex(this.balance),
      storageRoot: toHex(this.storageRoot),
      codeHash: toHex(this.codeHash)
    }
  }
  toJson(){ return JSON.stringify(this.toObject()) } // the object above as a string
  toString(){ return this.toJson() } // alias

}

module.exports = Account




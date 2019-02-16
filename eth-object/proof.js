const { keccak, encode, decode, toBuffer, toHex } = require('./../ethUtils')


class Proof extends Array{

  constructor(raw = []){
    super(...raw)
  }

  static fromObject(obj){ return this.fromRpc(obj)}
  static fromRpc(rpcResponseProof){ 
    let arrayProof = rpcResponseProof.map((stringNode)=>{ return decode(stringNode) })
    return new Proof(arrayProof)
  }
  static fromHexString(hexString){ return new Proof(decode(hexString)) }
  static fromBuffer(buf){ return new Proof(decode(buf)) }
  static fromRaw(raw){ return new Proof(raw) }
  static fromStack(stack){ 
    let arrayProof = stack.map((trieNode)=>{ return trieNode.raw })
    return new Proof(arrayProof)
  }
  static root(arrayLikeThing){ return keccak(encode(arrayLikeThing[0])) }

  raw(){ // a generic 4-item array without the methods
    let output = []
    for (let i = 0; i < this.length; i++) { output[i] = this[i] }
    return output
  }
  serialize(){ return encode(this.raw()) } // a single byte-array
  toBuffer() { return this.serialize()} //alias
  toHex(){ return toHex(this.serialize())} // a hex-string of the bytes
  toObject(){ // a generic js-object with the 4 account properties
    let obj = {}
    this.forEach((bufNode)=>{
      let key = keccak(encode(bufNode))
      obj[key] = toHex(bufNode)
    })
    return obj
  }
  toJson(){ return JSON.stringify(this.toObject()) } // the object above as a string
  toString(){ return this.toJson() } // alias
}

module.exports = Proof




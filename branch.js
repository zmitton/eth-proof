const { keccak, encode, decode, toBuffer, toHex } = require('./ethUtils')


class Branch extends Array{

  constructor(raw = []){
    super(...raw)
  }

  static fromObject(obj){ return this.fromRpc(obj)}
  static fromRpc(rpcResponseBranch){ 
    let arrayBranch = rpcResponseBranch.map((strNode)=>{ return decode(strNode) })
    return new Branch(arrayBranch)
  }
  static fromHexString(hexString){ return new Branch(decode(hexString)) }
  static fromBuffer(buf){ return new Branch(decode(buf)) }
  static fromRaw(raw){ return new Branch(raw) }
  static fromStack(stack){ 
    let arrayBranch = stack.map((trieNode)=>{ return trieNode.raw })
    return new Branch(arrayBranch)
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

module.exports = Branch




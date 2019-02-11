const { keccak, encode, decode, toBuffer, toHex } = require('./ethUtils')

class Log extends Array{
  constructor(raw){
    super(...raw)
    this.address = this[0]
    this.topics = this[1]
    this.data = this[2]
  }
  static fromRpc(rpcResponse){
    let topics = []
    for (var i = 0; i < rpcResponse.topics.length; i++) {
      topics.push(toBuffer(rpcResponse.topics[i]))
    }
    return new Log([
      toBuffer(rpcResponse.address),
      topics,
      toBuffer(rpcResponse.data)
    ])
  }
  raw(){
    let output = []
    for (let i = 0; i < this.length; i++) { output[i] = this[i] }
    return output
  }
  serialize(){ return encode(this.raw()) } // a single byte-array
  toBuffer() { return this.serialize()} //alias
  toHex(){ return toHex(this.serialize())} // a hex-string of the bytes
  toObject(){ // a generic js-object with the 15 header properties
    let obj = {
      address: toHex(this.address),
      topics: [],
      data: toHex(this.data),
    }
    for (var i = 0; i < this.topics.length; i++) {
      obj.topics.push(toHex(this.topics[i]))
    }
    return obj
  }
  toJson(){ return JSON.stringify(this.toObject()) } // the object above as a string
  toString(){ return this.toJson() } // alias
  // static fromObject(rpcResponse){ return this.fromRpc(rpcResponse)}
}

module.exports = Log

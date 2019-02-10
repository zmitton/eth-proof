const Util = require('ethereumjs-util')

const keccak =   Util.keccak
const encode =   (input)=>{
  return input === "0x0" ? Util.rlp.encode(Buffer.from([])) : Util.rlp.encode(input)
}
const decode =   Util.rlp.decode
const toBuffer = (input)=>{ 
  return input === "0x0" ? Buffer.from([]) : Util.toBuffer(input) 
}
const toHex = Util.bufferToHex

module.exports = [keccak, encode, decode, toBuffer, toHex]

const THRESHOLD     = 0x37//maximum length that can be encoded in a single byte
const STRING_OFFSET = 0x80
const LIST_OFFSET   = 0xc0

var encode = (input)=>{
  switch(true){
    case input instanceof Buffer: // string
      var length = input.length
      if(length === 1 && input[0] < STRING_OFFSET){ return input
      }else{ return Buffer.concat([encodeLength(length, STRING_OFFSET), input]) }
    case input instanceof Array: // list
      var output = new Buffer('')
      for (var i = 0; i < input.length; i++) {
        output = Buffer.concat([output, encode(input[i])])
      }
      return Buffer.concat([encodeLength(output.length, LIST_OFFSET), output])
    case typeof input == "string": return encode(new Buffer(input, "ascii"))//extra
    case typeof input == "number": return encode(numToBuf(input))//extra type handling
  }
}
var encodeLength = (length, OFFSET)=>{
  if(length <= THRESHOLD){ 
    return numToBuf(length + OFFSET)
  }else{ 
    var lenlen = numToBuf(numToBuf(length).length + OFFSET + THRESHOLD)
    return Buffer.concat([lenlen, numToBuf(length)]) }
}
var numToBuf = (input)=>{ return new Buffer(byteable(input.toString(16)), "hex") }
var byteable = (input)=>{ return input.length % 2 == 0 ? input : "0" + input }


var decode = (input)=>{
  return decodeOne(input).body
}
var decodeOne = (input)=>{ // empty buffer not valid
  if(input[0] < STRING_OFFSET){
    return {body: input.slice(0,1), pointer: 1}
  }else if(input[0] < STRING_OFFSET+THRESHOLD){
    return {body: input.slice(1,1+input[0]-STRING_OFFSET), pointer: 1+input[0]-STRING_OFFSET}
  }else if(input[0] < LIST_OFFSET){
    var lenlen = input[0] - STRING_OFFSET - THRESHOLD
    var len = input.readUIntBE(1, lenlen)
    return {body: input.slice(1+lenlen, 1+lenlen+len), pointer: 1+lenlen+len}
  }else if(input[0] < LIST_OFFSET+THRESHOLD){
    return {body: decodeMany(input.slice(1,1+input[0]-LIST_OFFSET)), pointer: 1+input[0]-LIST_OFFSET}
  }else{
    var lenlen = input[0] - LIST_OFFSET - THRESHOLD
    var len = input.readUIntBE(1, lenlen)
    return {body: decodeMany(input.slice(1+lenlen, 1+lenlen+len)), pointer: 1+lenlen+len}
  }
}
var decodeMany = (input)=>{
  var output = []
  var pointer = 0
  while(pointer < input.length){
    next = decodeOne(input.slice(pointer, input.length))
    output.push(next.body)
    pointer += next.pointer
  }
  return output
}

module.exports = {encode, decode, numToBuf, byteable}



// rlp.encode(["this is a very long list", "you long it is", "indu is log", "go"])
// rlp.encode(["this is a very long list", "you long it is", "indu is log", "goo"])
// rlp.encode("This sentence is less than 55 bytes long, I know this .") 
// rlp.encode("This sentence is more than 55 bytes long, I know this l.")



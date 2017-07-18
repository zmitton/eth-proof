// sha3 = require('js-sha3').keccak_256
// ethUtil = require('ethereumjs-util')
EP  = require('./ethProof')
EV = require('./ethVerify')


eP = new EP(new Web3.providers.HttpProvider("https://gmainnet.infura.io"))


// // reciepts w no logs and only 1 tx in its block. these work!
eP.getReceiptProof('0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef').then((result)=>{
  // console.log("RESULT", result.stack)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

eP.getReceiptProof('0xfd7f67e10bb48c641743108096eb7aa750d17afb8ac95560d93ebcd347e74443').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})
eP.getReceiptProof('0xc1080d2eaf1f3e866a4c12298a0be47647665a120d8ee681520eb440a6e06f99').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// only two transactions in the block. THESE WORK too!
eP.getReceiptProof('0xe6a37c02c198f9e4c8e7831a1b6a0e6711bf372a301147da339e2f61117f58a1').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})
eP.getReceiptProof('0x7392ee6d4bea6a0c8018de116fd2d6bf5678fdc0faae53240e7a22ab57db22d0').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// has 1 tx with 1 log, but its new enough that infura HAS these logs
// AND IT WORKS!!
eP.getReceiptProof('0xacb81623523bbabccb1638a907686bc2f3229c70e3ab51777bef0a635f3ac03f').then((result)=>{
  // console.log("result", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// 2 txs both have logs. They are exactly the same log.
eP.getReceiptProof('0x84e86114ea47d97e882411db029b5c42e7e25395f279636e4a277ec44dce23a4').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// 4 tx, 2 have logs
eP.getReceiptProof('0x8d0da05c3256da94a4213149de3e17fae7d1fd1b86fd4e57557527325ba87adc').then((result)=>{
  // console.log("RESULT", result.stack)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// this block has 3 txs (works!)
eP.getReceiptProof('0xe6c0c5e61a52b2226f7730d915e4c1baf606f34719dcfbda7164266cce111ae3').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// block has 4 txs
eP.getReceiptProof('0x1e1a818d63fd4d03c6125ea4f5e99a27255728a2bad195f858635543a95f1c3f').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// from another block with 4 txs
eP.getReceiptProof('0x598bf980dead5d96ca0e2325f2dbc884ada041ca2e05f8c9bdac1c60926764e0').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// // block with 5.
eP.getReceiptProof('0xed2903beb85ffce50cec37050313951920d997199ff4a4d7b8fbc0b45ca44c84').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// lots of tx, no logs. 
eP.getReceiptProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9').then((result)=>{
  // console.log(result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})



// have uncles
eP.getReceiptProof('0x6afb931aa1008783dedf5c66dc41b1fc8f01bf34ebc183b37110a7a77523e15c').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})
eP.getReceiptProof('0xc12e727125b5733a90555a1438ec48b27ffa928b84d39775923afeb229ba1a60').then((result)=>{
  // console.log("RESULT", result)
  console.log("proof =>", EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})


// not a tx hash. 
eP.getReceiptProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
  console.log("FAIL, should return error because this isnt a tx")
}).catch((e)=>{ console.log("PASS")})




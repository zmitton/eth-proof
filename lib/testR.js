// sha3 = require('js-sha3').keccak_256
// ethUtil = require('ethereumjs-util')
EthProof  = require('./ethProof')
EthVerify = require('./ethVerify')


ethProof = new EthProof(new Web3.providers.HttpProvider("https://mainnet.infura.io"))


// // reciepts w no logs and only 1 tx in its block. these work!
ethProof.getReceiptProof('0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef', function(error,result){
  // console.log("RESULT", result)
  // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
})
ethProof.getReceiptProof('0xfd7f67e10bb48c641743108096eb7aa750d17afb8ac95560d93ebcd347e74443', function(error,result){
  // console.log("RESULT", result)
  // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
})
ethProof.getReceiptProof('0xc1080d2eaf1f3e866a4c12298a0be47647665a120d8ee681520eb440a6e06f99', function(error,result){
  // console.log("RESULT", result)
  // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
})


// only two transactions in the block. THESE WORK too!
// ethProof.getReceiptProof('0xe6a37c02c198f9e4c8e7831a1b6a0e6711bf372a301147da339e2f61117f58a1', function(error,result){
//   console.log("RESULT", result)
//   // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })
// ethProof.getReceiptProof('0x7392ee6d4bea6a0c8018de116fd2d6bf5678fdc0faae53240e7a22ab57db22d0', function(error,result){
//   console.log("RESULT", result)
//   // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })

// has 2 but both have logs, but its new enough that infura HAS these logs
// //  hang on...
// ethProof.getReceiptProof('0xa052dc3396ef6fb3064b94d0172037d2a6975fce10ff1d2d6cec0f6d8b605afb', function(error,result){
//   console.log("RESULT", result)
//   // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })


// // this block has 3 txs (works!)
// ethProof.getReceiptProof('0xe6c0c5e61a52b2226f7730d915e4c1baf606f34719dcfbda7164266cce111ae3', function(error,result){
//   console.log("RESULT", result)
//   // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })

// // this one doesnt work :(  (block has 4 txs)
// ethProof.getReceiptProof('0x1e1a818d63fd4d03c6125ea4f5e99a27255728a2bad195f858635543a95f1c3f', function(error,result){
//   console.log("RESULT", result)
//   // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })

// // from another block with 4 txs (doesnt work either)
// ethProof.getReceiptProof('0x598bf980dead5d96ca0e2325f2dbc884ada041ca2e05f8c9bdac1c60926764e0', function(error,result){
//   console.log("RESULT", result)
//   // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })

// // // block with 5. no good :(
// ethProof.getReceiptProof('0xed2903beb85ffce50cec37050313951920d997199ff4a4d7b8fbc0b45ca44c84', function(error,result){
//   console.log("RESULT", result)
//   // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })

// lots of tx, no logs. but doesnt work
// ethProof.getReceiptProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9', function(error,result){
//   // console.log(result)
//   console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })



// causes weird error
// ethProof.getReceiptProof('0x6afb931aa1008783dedf5c66dc41b1fc8f01bf34ebc183b37110a7a77523e15c', function(error,result){
//   console.log("RESULT", result)
//   // console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })





// not a tx hash. use to test error handling 
// ethProof.getTxProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3', function(error,result){
//   console.log("E",error)
//   console.log("proof3 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })





// sha3 = require('js-sha3').keccak_256
// ethUtil = require('ethereumjs-util')
EthProof  = require('./ethProof')
EthVerify = require('./ethVerify')


ethProof = new EthProof(new Web3.providers.HttpProvider("https://mainnet.infura.io"))

// ethProof.getTxProof('0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de', function(error,result){
//   // console.log("E",error)
//   console.log("E",result)

//   console.log("proof1 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })

// ethProof.getTxProof('0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef', function(error,result){
//   // console.log(result)
//   console.log("proof2 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })

// the following 3 txs demontrate the txproofs are very tight. they all work all from different huge blocks
ethProof.getTxProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9', function(error,result){
  // console.log(result)
  console.log("proofx299a9 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
})
ethProof.getTxProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb', function(error,result){
  // console.log(result)
  console.log("proof0x4e4b9 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
})
ethProof.getTxProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3', function(error,result){
  // console.log(result)
  console.log("proof2 x74bd=>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
})





// not a tx hash. use to test error handling 
// ethProof.getTxProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3', function(error,result){
//   console.log("E",error)
//   console.log("proof3 =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
// })





// sha3 = require('js-sha3').keccak_256
// ethUtil = require('ethereumjs-util')
EP  = require('./ethProof')
EV = require('./ethVerify')

eP = new EP(new Web3.providers.HttpProvider("https://mainnet.infura.io"))

eP.getTxProof('0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de').then((result)=>{
  // console.log(result)
  return console.log("proof 0xb53f7 => ", EV.tx(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

eP.getTxProof('0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef').then((result)=>{
  return console.log("proof 0xc55e2 => ", EV.tx(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})

// the following 3 txs all work and are all from different huge blocks
eP.getTxProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9').then((result)=>{
  return console.log("proof 0x299a9 => ", EV.tx(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})
eP.getTxProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb').then((result)=>{
  return console.log("proof 0x4e4b9 => ", EV.tx(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})
eP.getTxProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3').then((result)=>{
  return console.log("proof 0x74bdf => ", EV.tx(result.path, result.value, result.stack, result.header, result.blockhash))
}).catch((e)=>{console.log(e)})





// not a tx hash. use to test error handling 
// eP.getTxProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3', function(error,result){
//   console.log("E",error)
//   console.log("proof3 =>", EV.tx(result.path, result.value, result.stack, result.header, result.blockhash))
// })





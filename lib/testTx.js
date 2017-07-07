// sha3 = require('js-sha3').keccak_256
// ethUtil = require('ethereumjs-util')
EthProof  = require('./ethProof')
EthVerify = require('./ethVerify')


ethProof = new EthProof(new Web3.providers.HttpProvider("https://mainnet.infura.io"))

ethProof.getTxProof('0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de', function(error,result){
  console.log("proof =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
})
ethProof.getTxProof('0xc58a8588674ab3f51983b8e7350dfd1a0304e4fff6fa9b0065cda4493427d01e', function(error,result){
  console.log("proof =>", EthVerify.tx(result.path, result.tx, result.stack, result.header, result.blockhash))
})


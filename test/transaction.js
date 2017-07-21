var Web3 = require('web3')
var EP  = require('./../lib/ethProof')
var EV = require('./../lib/ethVerify')
var ep = new EP(new Web3.providers.HttpProvider("https://gmainnet.infura.io"))


describe('getTransactionProof', function () {
  it('should be able to request a proof from web3 and verify it', function (done) {
    ep.getTransactionProof('0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de').then((result)=>{
      EV.tx(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    ep.getTransactionProof('0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef').then((result)=>{
      EV.tx(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });
    // the following 3 txs all work and are all from different huge blocks
  it('should be able to request a proof from web3 and verify it', function (done) {
    ep.getTransactionProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9').then((result)=>{
      EV.tx(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    ep.getTransactionProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb').then((result)=>{
      EV.tx(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    ep.getTransactionProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3').then((result)=>{
      EV.tx(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    ep.getTransactionProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EV.receipt(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true()
      (false).to.be.true("not a tx. `get` should fail")
    }).catch((e)=>{
      done()
    })
  });
});

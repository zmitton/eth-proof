var Web3 = require('web3')
var EP   = require('./../../index')
var eP   = new EP(new Web3.providers.HttpProvider("https://gmainnet.infura.io"))


describe('getLogProof', function () {

    // 4 tx, 2 have logs
  it('should be able to request a log proof from web3 and verify it', function (done) {
    eP.getLogProof('0x8d0da05c3256da94a4213149de3e17fae7d1fd1b86fd4e57557527325ba87adc', 0).then((result)=>{
      EP.log(result.logIndex, result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });

  // it('should be able to request a proof from web3 and verify it', function (done) {
  //   eP.getLogProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
  //     EP.receipt(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
  //     (false).to.be.true("not a tx. `get` should fail")
  //   }).catch((e)=>{
  //     done()
  //   })
  // });
});

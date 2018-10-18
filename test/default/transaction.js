var Web3 = require('web3')
var EP   = require('./../../index')
var eP   = new EP(new Web3.providers.HttpProvider("https://mainnet.infura.io"))


describe('getTransactionProof', function () {
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de').then((result)=>{
      // console.log(result)
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });
    // the following 3 txs all work and are all from different huge blocks
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true(result.path)
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.false()
      (false).to.be.true("not a tx. `get` should fail")
    }).catch((e)=>{
      done()
    })
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x84e86114ea47d97e882411db029b5c42e7e25395f279636e4a277ec44dce23a4').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });
    // 4 tx, 2 have logs
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x8d0da05c3256da94a4213149de3e17fae7d1fd1b86fd4e57557527325ba87adc').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });
    // this block has 3 txs 
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0xe6c0c5e61a52b2226f7730d915e4c1baf606f34719dcfbda7164266cce111ae3').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });
    // block has 4 txs
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x1e1a818d63fd4d03c6125ea4f5e99a27255728a2bad195f858635543a95f1c3f').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });
    // from another block with 4 txs
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x598bf980dead5d96ca0e2325f2dbc884ada041ca2e05f8c9bdac1c60926764e0').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });
    // // block with 5.
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0xed2903beb85ffce50cec37050313951920d997199ff4a4d7b8fbc0b45ca44c84').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });

    // lots of tx, no logs. 
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });
    // have uncles
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x6afb931aa1008783dedf5c66dc41b1fc8f01bf34ebc183b37110a7a77523e15c').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0xc12e727125b5733a90555a1438ec48b27ffa928b84d39775923afeb229ba1a60').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      done()
    }).catch((e)=>{console.log(e)})
  });

  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      (false).to.be.true("not a tx. `get` should fail")
    }).catch((e)=>{
      done()
    })
  });

  // This test is added for the edge case where transactions fail
  it('should be able to request a proof from web3 and verify it', function (done) {
    eP.getTransactionProof('0xdaa2fcc5d94f03348dc26bfacf84828ff563ccc57f6ab8260d2bd35b5d668ef8').then((result)=>{
      EP.transaction(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
      (false).to.be.true("not a tx. `get` should fail")
    }).catch((e)=>{
      done()
    })
  });
});

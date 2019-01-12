const Web3 = require('web3')
const expect = require("chai").expect;

const { BuildProof, VerifyProof } = require('./../index')
const buildProof = new BuildProof("https://mainnet.infura.io")


describe('getTransactionProof', () => {
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0xc55e2b90 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)
    // console.log("ver",ver)
    ver.should.be.true()
    // (false).should.be.true("false. should fail")//temp
  });

  it('should be able to request a proof for 0x299a93ac and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });
  it('should be able to request a proof for 0x4e4b9cd3 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });
  it('should be able to request a proof for 0x74bdf545 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0x4914025a and verify it', async () => {
    await buildProof.getTransactionProof('0x1234').should.be.rejectedWith(Error)
    await buildProof.getTransactionProof('0x1234025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').should.be.rejectedWith(Error)
  });

  it('should be able to request a proof for 0xdaa2fcc5 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0xdaa2fcc5d94f03348dc26bfacf84828ff563ccc57f6ab8260d2bd35b5d668ef8')

    expect(()=>{VerifyProof.transaction(Buffer.from('80','hex'), prf.value, prf.branch, prf.header, prf.blockHash)}).to.throw()

  });

  it('should be able to request a proof for 0x84e86114 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x84e86114ea47d97e882411db029b5c42e7e25395f279636e4a277ec44dce23a4')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0x8d0da05c and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x8d0da05c3256da94a4213149de3e17fae7d1fd1b86fd4e57557527325ba87adc')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0xe6c0c5e6 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0xe6c0c5e61a52b2226f7730d915e4c1baf606f34719dcfbda7164266cce111ae3')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0x1e1a818d and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x1e1a818d63fd4d03c6125ea4f5e99a27255728a2bad195f858635543a95f1c3f')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0x598bf980 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x598bf980dead5d96ca0e2325f2dbc884ada041ca2e05f8c9bdac1c60926764e0')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0xed2903be and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0xed2903beb85ffce50cec37050313951920d997199ff4a4d7b8fbc0b45ca44c84')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0x299a93ac and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0x6afb931a and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0x6afb931aa1008783dedf5c66dc41b1fc8f01bf34ebc183b37110a7a77523e15c')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0xc12e7271 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0xc12e727125b5733a90555a1438ec48b27ffa928b84d39775923afeb229ba1a60')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });

  it('should be able to request a proof for 0xdaa2fcc5 and verify it', async () => {
    let prf = await buildProof.getTransactionProof('0xdaa2fcc5d94f03348dc26bfacf84828ff563ccc57f6ab8260d2bd35b5d668ef8')

    let ver = VerifyProof.transaction(prf.path, prf.value, prf.branch, prf.header, prf.blockHash)

    ver.should.be.true()
  });
});

const Web3 = require('web3')
const expect = require("chai").expect;

const { BuildProof, VerifyProof } = require('./../index')
const buildProof = new BuildProof("https://mainnet.infura.io")


describe('getLogProof', () => {

  it('should be able to request a log proof from web3 and verify it', async () => {
    let prf = await buildProof.getLogProof('0x8d0da05c3256da94a4213149de3e17fae7d1fd1b86fd4e57557527325ba87adc', 0)
    VerifyProof.log(prf.rlpLogIndex, prf.value, prf.rlpTxIndex, prf.receipt, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('requesting proof from non-existant tx should throw error', async () => {
    await buildProof.getTransactionProof('0x1234').should.be.rejectedWith(Error)
    await buildProof.getTransactionProof('0x12345678a9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').should.be.rejectedWith(Error)
  });

});

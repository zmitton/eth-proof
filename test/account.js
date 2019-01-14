const Web3 = require('web3')
const expect = require("chai").expect;

const { BuildProof, VerifyProof } = require('./../index')
const buildProof = new BuildProof("http://localhost:8545")


describe('account proofs', () => {
  it('can verify proof', async () => {
    let prf = await buildProof.getAccountProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57", 0)
    // console.log("PRF", prf)
    VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  });

  it('can disprove invalid proof (invalid address)', async () => {
    let prf = await buildProof.getAccountProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")
    expect(()=>{ VerifyProof.account(new Buffer('01','hex'), prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes) }).to.throw()
  });

  it('can verify absence', async () => {
    let prf = await buildProof.getStorageProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")
    // console.log("THINGS3 ", prf)
    VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  });

  // it('can disprove invalid absence proof', async () => {
  //   let buildProof = new BuildProof()
  //   let prf = await buildProof.getStorageProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")

  //   console.log("THINGS3 ", prf)
  //   console.log("VVVVVV", VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  // });
});

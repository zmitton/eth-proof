
const chai = require("chai");
// const chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const assert = chai.assert;
// const expect = chai.assert;

const Trie = require('merkle-patricia-tree')
const rlp = require('rlp')//todo remove


// var EthProof = require('./../ethProof')
const { BuildProof, VerifyProof } = require('./../index')
// var EthProof = require('./../EthProof');
// var BuildProof = require('./../buildProof');



describe('account proofs', () => {
  it('can verify proof', async () => {
    let buildproof = new BuildProof()
    let prf = await buildproof.getStorageProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")
console.log("PROOF", prf)
    VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  });

  it('can disprove invalid proof (invalid address)', async () => {
    let buildproof = new BuildProof()
    let prf = await buildproof.getStorageProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")

    // assert.throws(function(){ VerifyProof.account(new Buffer('01','hex'), prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)})

  });

  // it('can verify absence', async () => {
  //   let buildproof = new BuildProof()
  //   let prf = await buildproof.getStorageProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")

  //   console.log("THINGS3 ", prf)
  //   console.log("VVVVVV", EthProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  // });

  // it('can disprove invalid absence proof', async () => {
  //   let buildproof = new BuildProof()
  //   let prf = await buildproof.getStorageProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")

  //   console.log("THINGS3 ", prf)
  //   console.log("VVVVVV", EthProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  // });
});

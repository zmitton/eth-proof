
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

const Trie = require('merkle-patricia-tree')
const rlp = require('rlp')//todo remove


var EthProof = require('./../index')
var VerifyProof = require('./../verifyProof');
var BuildProof = require('./../buildProof');


// const sha3 = require('js-sha3').keccak_256
// const sha3 = require('ethereumjs-util').sha3
// const rlp = require('rlp');



describe('account proofs', () => {
  it('can verify proof', async () => {
    let ethproof = new EthProof()
    let prf = await ethproof.getStorageProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")
    // console.log("THINGS2 ", prf)
    // console.log("sdfg",prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)

    // let verification = await VerifyProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)

    // assert.equal(verification, true);

    return assert.becomes(VerifyProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes), true)
  });

  // it('can disprove invalid proof (invalid address)', async () => {
  //   let ethproof = new EthProof()
  //   let prf = await ethproof.getStorageProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")

  //   // let verification = await VerifyProof.verifyAccount(new Buffer('01','hex'), prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)

  //   return assert.isRejected(VerifyProof.verifyAccount(new Buffer('01','hex'), prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  // });

  // it('can verify absence', async () => {
  //   let ethproof = new EthProof()
  //   let prf = await ethproof.getStorageProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")

  //   console.log("THINGS3 ", prf)
  //   console.log("VVVVVV", EthProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  // });

  // it('can disprove invalid absence proof', async () => {
  //   let ethproof = new EthProof()
  //   let prf = await ethproof.getStorageProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")

  //   console.log("THINGS3 ", prf)
  //   console.log("VVVVVV", EthProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  // });
});

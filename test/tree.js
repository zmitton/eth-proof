// const expect = require("chai").expect;
// const { keccak, encode, toBuffer } = require('./../utils')
// const { Account, Header, Log, Proof, Receipt, Transaction } = require('eth-object')
// const { GetAndVerify, GetProof, VerifyProof } = require('./../index')

// const getAndVerify = new GetAndVerify("http://localhost:8545")

// describe('Account GetAndVerify Against BlockHash', () => {


// const Verify = require('./../verifyProof')
//   it('can verify an account is in a state tree with a specific stateRoot', async () => {
//     let address = "0x9cc9bf39a84998089050a90087e597c26758685d"
//     let prf = await getAndVerify.getAccountProof(address)
// // console.log(prf.account)
//     Verify.rootContainsBranch(Branch.root(prf.accountBranch), prf.accountBranch).should.be.true()
//     Verify.accountBranchContainsAccountAt(prf.accountBranch, prf.account, address).should.be.true()
//   });
// });

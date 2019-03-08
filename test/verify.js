// const expect = require("chai").expect;
// const { keccak, encode, toBuffer } = require('./../utils')
// const { Account, Header, Log, Proof, Receipt, Transaction } = require('eth-object')
// const { GetAndVerify, GetProof, VerifyProof } = require('./../index')

// const getAndVerify = new GetAndVerify("http://localhost:8545")

// describe('Account GetAndVerify Against BlockHash', () => {


// const Verify = require('./../verifyProof')
// const Branch = require('./../branch')
//   it('can verify an account is in a state tree with a specific stateRoot', async () => {
//     let address = "0x9cc9bf39a84998089050a90087e597c26758685d"
//     let prf = await getAndVerify.getAccountProof(address)
// // console.log(prf.account)
//     Verify.rootContainsBranch(Branch.root(prf.accountBranch), prf.accountBranch).should.be.true()
//     Verify.accountBranchContainsAccountAt(prf.accountBranch, prf.account, address).should.be.true()
//   });
//   it('can verify an account is in a state tree with a specific stateRoot', async () => {
//     let address1 = "0x9cc9bf39a84998089050a90087e597c26758685d"
//     let address2 = "0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57"
//     let prf1 = await getAndVerify.getAccountProof(address1)
//     let prf2 = await getAndVerify.getAccountProof(address2)
// // console.log(prf.account)
//     expect(()=>{ Verify.accountBranchContainsAccountAt(prf2.accountBranch, prf1.account, address1) }).to.throw()
//     expect(()=>{ Verify.accountBranchContainsAccountAt(prf2.accountBranch, prf1.account, address2) }).to.throw()
//     expect(()=>{ Verify.accountBranchContainsAccountAt(prf2.accountBranch, prf2.account, address1) }).to.throw()
//   });

  // it('can verify proof from address and blockHash', async () => {
  //   let address = "0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57"
    
  //   let prf = await getAndVerify.getAccountProof(address)

  //   Verify.headerContainsStateRoot(prf.blockheader, prf.accountBranch).should.be.true()
  //   Verify.rootContainsBranch()
  //   // Verify.blockheaderContainsAccountBranch(prf.blockheader, prf.accountBranch).should.be.true()
  //   Verify.accountBranchContainsAccountAtAddress(prf.accountBranch, prf.account, address).should.be.true()
    
  //   expect(()=>{ 
  //     let unrelatedBlockHash = "0x0a90e277f1c1e7738783d5a56c721730d71dc2d41d5bc234ceefad538ca69c87"
  //     Verify.blockHashContainsBlockheader(unrelatedBlockHash, prf.blockheader) 
  //   }).to.throw()
  // });

  // it('can verify proof from address and blockHash', async () => {
  //   let address = "0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57"
  //   let blockHash = "0x0a90e277f1c1e7738783d5a56c721730d71dc2d41d5bc234ceefad538ca69c87"

  //   let prf = await getAndVerify.getAccountProof(address, blockHash)

  //   Verify.blockHashContainsBlockheader(blockHash, prf.blockheader).should.be.true()
  //   Verify.blockheaderContainsAccountBranch(prf.blockheader, prf.accountBranch).should.be.true()
  //   Verify.accountBranchContainsAccountAtAddress(prf.accountBranch, prf.account, address).should.be.true()
  // });

//more accounts

//   it('can verify proof', async () => {
//     // let prf = await newPromise.reject().should.be.rejectedWith(Error)
// // throw new Error()
//   //   expect(()=>{Verify.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)}).to.throw()
//   //   prf     = await getAndVerify.getAccountProof("0x1234").should.be.rejectedWith(Error)
//   //   expect(()=>{Verify.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)}).to.throw()
//   });

//more accounts

  // it('can disprove invalid proof (invalid address)', async () => {
  //   let prf = await getAndVerify.getAccountProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")
  //   expect(()=>{ Verify.account(new Buffer('01','hex'), prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes) }).to.throw()
  // });

  // it('can disprove invalid proof (invalid address)', async () => {
  //   let prf = await getAndVerify.getAccountProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")
  //   let otherPrf = await getAndVerify.getAccountProof("0x9cc9bf39a84998089050a90087e597c26758685d")
  //   expect(()=>{ Verify.account(otherPrf.accountBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes) }).to.throw()
  // });

  // it('can verify absence', async () => {
  //   let prf = await getAndVerify.getAccountProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")
  //   Verify.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can disprove invalid absence proof', async () => {
  //   let prf = await getAndVerify.getAccountProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")
  //   let otherPrf = await getAndVerify.getAccountProof("0x9cc9bf39a84998089050a90087e597c26758685d")

  //               Verify.account(     prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  //   expect(()=>{Verify.account(otherPrf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes) }).to.throw()
  // });

//RECEIPT
  // it('requesting invalid tx hash should throw error', async () => {
  //   await getAndVerify.getReceiptProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').should.be.rejectedWith(Error)
  //   await getAndVerify.getReceiptProof('0x1234').should.be.rejectedWith(Error)
  // });

  // it('verifying a modified or different proof should throw an error', async () => {
  //   let prf = await getAndVerify.getReceiptProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb')
  //   let otherPrf = await getAndVerify.getReceiptProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3')

  //   expect(()=>{VerifyProof.receipt(Buffer.from('80','hex'), prf.value, prf.branch, prf.header, prf.blockHash)}).to.throw()
  //   expect(()=>{VerifyProof.receipt(encode(prf.txIndex), otherPrf.value, prf.branch, prf.header, prf.blockHash)}).to.throw()
  //   expect(()=>{VerifyProof.receipt(otherPrf.path, prf.value, otherPrf.branch, otherPrf.header, otherPrf.blockHash)}).to.throw()
  // });

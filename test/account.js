const { keccak, encode, toBuffer } = require('./../ethUtils')
const { GetAndVerify, GetProof, VerifyProof } = require('./../index')
const getAndVerify = new GetAndVerify("http://localhost:8545")
const expect = require("chai").expect;
const Account = require('./../eth-object/account')


describe('Account GetAndVerify Against BlockHash', () => {

// // bring these first 2 tests to other file
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

  // todo: testing:
  // using getProof to test different pieces of each of the getAndVerify functions. i.e the
  // functions that they themselves call. This goes for accounts, storage, txs, and receipts
  // test each combinations. lots of proofs of throw. Maybe create a whole other test file
  // for all both accounts and storage funcs testing null

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

  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0xb7964f87a97582605af695710ad252afa018a97384ba9438cf24e42fa9f0efc9'
    let accountAddress = '0x9cc9bf39a84998089050a90087e597c26758685d'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(prf)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x9cc9bf39a84998089050a90087e597c26758685d'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(prf)
  });
  it('should be able to prove an account does not exist', async () => {
    let blockHashBlockZero = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    let emptyAccountAddress = '0x0000000000000000000000000000000000000000'
    let account = await getAndVerify.accountAgainstBlockHash(emptyAccountAddress, blockHashBlockZero)
    // console.log(prf)
  });
//standard accounts validated by random legitimate blockhash
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(prf)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(prf)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(prf)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x0087194a367D4D508D9a97846264f69d81e419ca'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(prf)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x0d8775f648430679a709e98d2b0cb6250d2887ef'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(prf)
  });

//   it('can verify proof', async () => {
//     // let prf = await newPromise.reject().should.be.rejectedWith(Error)
// // throw new Error()
//   //   expect(()=>{Verify.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)}).to.throw()
//   //   prf     = await getAndVerify.getAccountProof("0x1234").should.be.rejectedWith(Error)
//   //   expect(()=>{Verify.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)}).to.throw()
//   });

  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(prf)
  });

  it('should be able to prove an account did not exist at a given time', async () => {
    // proof of absence : the following account didnt exist durring block 0
    let blockHashBlockZero = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    let accountAddress = '0x9cc9bf39a84998089050a90087e597c26758685d'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHashBlockZero)
    // console.log(prf)
    encode(account).equals(Account.NULL.toBuffer()).should.be.true()

  });
  it('should be able to prove an account did not exist at a given time', async () => {
    // proof of absence : the following account didnt exist durring block 0
    let blockHashBlockZero = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    let accountAddress = '0xdeadbeef00123456789012345678901234567890'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHashBlockZero)
    // console.log(prf)
    encode(account).equals(Account.NULL.toBuffer()).should.be.true()
    // account[0].equals(toBuffer()).should.be.true()
    // account[1].equals(toBuffer()).should.be.true()
    // account[2].equals(keccak(encode())).should.be.true()
    // account[3].equals(keccak()).should.be.true()
  });

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
});

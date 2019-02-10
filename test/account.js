const Web3 = require('web3')
const expect = require("chai").expect;
const [keccak, encode, decode, toBuffer, toHex] = require('./../ethUtils')

const Verify = require('./../verify')

const { BuildProof, VerifyProof } = require('./../index')
const buildProof = new BuildProof("http://localhost:8545")


describe('account proofs', () => {

  it('can verify an account is a state tree with a specific stateRoot', async () => {
    let address = "0x9cc9bf39a84998089050a90087e597c26758685d"
    let prf = await buildProof.getAccountProof(address)

    Verify.rootContainsBranch(prf.accountBranch.root(), prf.accountBranch)
    Verify.accountBranchContainsAccountAtAddress(prf.accountBranch, prf.account, address).should.be.true()

  });

  it('can verify proof from address and blockHash', async () => {
    let address = "0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57"
    
    let prf = await buildProof.getAccountProof(address)

    Verify.blockheaderContainsAccountBranch(prf.blockheader, prf.accountBranch).should.be.true()
    Verify.accountBranchContainsAccountAtAddress(prf.accountBranch, prf.account, address).should.be.true()
    
    expect(()=>{ 
      let unrelatedBlockHash = "0x0a90e277f1c1e7738783d5a56c721730d71dc2d41d5bc234ceefad538ca69c87"
      Verify.blockHashContainsBlockheader(unrelatedBlockHash, prf.blockheader) 
    }).to.throw()
  });

  it('can verify proof from address and blockHash', async () => {
    let address = "0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57"
    let blockHash = "0x0a90e277f1c1e7738783d5a56c721730d71dc2d41d5bc234ceefad538ca69c87"

    let prf = await buildProof.getAccountProof(address, blockHash)

    Verify.blockHashContainsBlockheader(blockHash, prf.blockheader).should.be.true()
    Verify.blockheaderContainsAccountBranch(prf.blockheader, prf.accountBranch).should.be.true()
    Verify.accountBranchContainsAccountAtAddress(prf.accountBranch, prf.account, address).should.be.true()
  });


  // it('can verify proof', async () => {
  //   let prf = await buildProof.getAccountProof("0x9cc9bf39a84998089050a90087e597c26758685d", "0x0")
  //   // console.log(prf.accountBytes)
  //   VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can verify proof', async () => {
  //   let prf = await buildProof.getAccountProof("0x2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4")
  //   VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can verify proof', async () => {
  //   let prf = await buildProof.getAccountProof("0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A")
  //   VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can verify proof', async () => {
  //   let prf = await buildProof.getAccountProof("0x0087194a367D4D508D9a97846264f69d81e419ca")
  //   VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can verify proof', async () => {
  //   let prf = await buildProof.getAccountProof("0x0d8775f648430679a709e98d2b0cb6250d2887ef")
  //   VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can verify proof', async () => {
  //   let prf = await buildProof.getAccountProof("0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3").should.be.rejectedWith(Error)
  //   expect(()=>{VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)}).to.throw()
  //   prf     = await buildProof.getAccountProof("0x1234").should.be.rejectedWith(Error)
  //   expect(()=>{VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes)}).to.throw()
  // });

  // it('can disprove invalid proof (invalid address)', async () => {
  //   let prf = await buildProof.getAccountProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")
  //   expect(()=>{ VerifyProof.account(new Buffer('01','hex'), prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes) }).to.throw()
  // });

  // it('can disprove invalid proof (invalid address)', async () => {
  //   let prf = await buildProof.getAccountProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")
  //   let otherPrf = await buildProof.getAccountProof("0x9cc9bf39a84998089050a90087e597c26758685d")
  //   expect(()=>{ VerifyProof.account(otherPrf.accountBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes) }).to.throw()
  // });

  // it('can verify absence', async () => {
  //   let prf = await buildProof.getAccountProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")
  //   VerifyProof.account(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can disprove invalid absence proof', async () => {
  //   let prf = await buildProof.getAccountProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")
  //   let otherPrf = await buildProof.getAccountProof("0x9cc9bf39a84998089050a90087e597c26758685d")

  //               VerifyProof.account(     prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  //   expect(()=>{VerifyProof.account(otherPrf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes) }).to.throw()
  // });
});

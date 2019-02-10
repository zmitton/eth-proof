/***************************************************************************
The contract deployed on mainnet used for these tests:
https://etherscan.io/address/0x92fd2d727ff572d0aa56493a0ebc9b9e24d15295#code

  pragma solidity ^0.5.3;
  contract Storage {
      uint public pos0;
      mapping(address => uint) public pos1;
      mapping(uint => mapping(uint => uint)) public pos2;
      bytes32 public pos3;

      constructor() public{
          pos0 = 0x1234;

          pos1[0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A] = 0x5678;
          pos1[0x1234567890123456789012345678901234567890] = 0x8765;

          pos2[0x111][0x222] = 0x9101112;
          pos2[0x333][0x444] = 0x13141516;

          pos3 = keccak256(abi.encode());
      }
  }
**************************************************************************/
const [keccak, encode, decode, toBuffer, toHex] = require('./../ethUtils')



const Web3 = require('web3')
const expect = require("chai").expect;

const { BuildProof, VerifyProof } = require('./../index')
const buildProof = new BuildProof("http://localhost:8545")

describe('storage proofs', () => {

  it('can handle a storage word', async () => {
    let prf = await buildProof.getStorageProof("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295", "0x00")
    prf.storageProof[0].value.should.equal("0x1234")

    prf = await buildProof.getStorageProof("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295", "0x00")
    prf.storageProof[0].value.should.equal("0x1234")

    // prf = await buildProof.getStorageProof("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295", 0x0)
    // prf.storageProof[0].value.should.equal("0x1234")

    // prf = await buildProof.getStorageProof("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295", "0")
    // prf.storageProof[0].value.should.equal("0x1234")

    VerifyProof.storage(toBuffer("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295"), encode(prf.storage), prf.storageBranchBytes, prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
    // VerifyProof.storage(prf.storageAddressBytes, prf.storageValueBytes, prf.storageBranchBytes, prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
    // should NOT pass
  });

  // it('can prove a mapping storage type', async () => {
  //   let prf = await buildProof.getStorageProof("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295", BuildProof.mappingAt("0x01", "0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A"))
  //   prf.storageProof[0].value.should.equal("0x5678")

  //   VerifyProof.storage(prf.storageAddressBytes, prf.storageValueBytes, prf.storageBranchBytes, prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can prove a mapping storage type', async () => {
  //   let prf = await buildProof.getStorageProof("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295", BuildProof.mappingAt("0x01", "0x1234567890123456789012345678901234567890"))
  //   prf.storageProof[0].value.should.equal("0x8765")

  //   VerifyProof.storage(prf.storageAddressBytes, prf.storageValueBytes, prf.storageBranchBytes, prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can prove a double mapping storage type', async () => {
  //   let prf = await buildProof.getStorageProof("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295", BuildProof.mappingAt("0x02", "0x111", "0x222"))
  //   prf.storageProof[0].value.should.equal("0x9101112")
  //   // console.log(prf.storageProof[0].value)

  //   VerifyProof.storage(prf.storageAddressBytes, prf.storageValueBytes, prf.storageBranchBytes, prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });

  // it('can prove a double mapping storage type', async () => {
  //   let prf = await buildProof.getStorageProof("0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295", BuildProof.mappingAt("0x03"))
  //   prf.storageProof[0].value.should.equal("0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470")
  //   // console.log(prf.storageProof[0].value)

  //   VerifyProof.storage(prf.storageAddressBytes, prf.storageValueBytes, prf.storageBranchBytes, prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes).should.be.true()
  // });



















//   it('can request a storage proof of storageIndex 0 uint from local chaindata', function (done) {
//     eP.getStorageProof('9cc9bf39a84998089050a90087e597c26758685d', '00').then((result)=>{
//       // 0x04d2
//       EP.storageAtIndex(
//         result.storageIndex,
//         Buffer.from('04d2','hex'),
//         result.storageParentNodes,
//         result.address,
//         result.accountParentNodes,
//         result.header,
//       result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a storage proof from storageIndex 0 uint local chaindata', function (done) {
//     eP.getStorageProof('10fbc306e84ee530856098cc490216bd5e9fa52e', '00').then((result)=>{
//       // 0x01
//       EP.storageAtIndex(
//         result.storageIndex, 
//         Buffer.from('01','hex'),
//         result.storageParentNodes, 
//         result.address, 
//         result.accountParentNodes, 
//         result.header, 
//       result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a storage proof from storageIndex 1 address local chaindata', function (done) {
//     eP.getStorageProof('10fbc306e84ee530856098cc490216bd5e9fa52e', '01').then((result)=>{
//       EP.storageAtIndex(
//         result.storageIndex, 
//         Buffer.from('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4','hex'),
//         result.storageParentNodes, 
//         result.address, 
//         result.accountParentNodes, 
//         result.header, 
//       result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a storage proof from local chaindata', function (done) {
//     eP.getStorageProof('10fbc306e84ee530856098cc490216bd5e9fa52e', '02').then((result)=>{
//       EP.storageAtIndex(
//         result.storageIndex, 
//         Buffer.from('1f4e7db8514ec4e99467a8d2ee3a63094a904e7a','hex'),
//         result.storageParentNodes, 
//         result.address, 
//         result.accountParentNodes, 
//         result.header, 
//       result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

// ///to do : make sure this stuff is right. Im not buyin it yet. UNTESTED FOR MULTI-D-MAPPING
//   it('can request a storage proof from a mapping local chaindata', function (done) {
//     eP.getStorageProof('9cc9bf39a84998089050a90087e597c26758685d', '1','1f4e7db8514ec4e99467a8d2ee3a63094a904e7a').then((result)=>{
//       EP.storageMapping(
//         result.storageIndex,
//         result.mappings,
//         result.value, 
//         result.storageParentNodes, 
//         result.address, 
//         result.accountParentNodes, 
//         result.header, 
//       result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a storage proof from local chaindata', function (done) {
//     eP.getStorageProof('9cc9bf39a84998089050a90087e597c26758685d', '1','1f4e7db8514ec4e99467a8d2ee3a63094a904e7a').then((result)=>{
//       EP.storageMapping(
//         result.storageIndex,
//         result.mappings,
//         result.value, 
//         result.storageParentNodes, 
//         result.address, 
//         result.accountParentNodes, 
//         result.header, 
//       result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });
});

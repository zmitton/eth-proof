// var Web3 = require('web3');
// var EP  = require('./../../index')

// describe('storage proof', function () {
//   var eP
//   before(function(){
//     var chainDataPath = '/Users/zacharymitton/Library/Ethereum/geth/chaindata'
//     var recentBlockHash = 'c7b427ed2e0fcc24474437e676625186abefb4328d0807c2c36edb78c2d54082'
//     console.log("USING CHAIN DATA PATH:", chainDataPath, "YOU CAN NOT JUST USE MY PATH!!!")
//     eP = new EP(
//       new Web3.providers.HttpProvider("https://mainnet.infura.io"),
//       recentBlockHash,
//       chainDataPath
//     )
//   })

//   after(function(){ eP.db.close() })


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
// });

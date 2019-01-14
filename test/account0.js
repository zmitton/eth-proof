// var Web3 = require('web3');
// var EP  = require('./../../index')

// describe('account state proof/verify full account [nonce, balance, storageRoot, codeHash]', function () {
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

//   // some accounts are contracts
//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getAccountProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
//       EP.account(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getAccountProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
//       EP.account(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getAccountProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
//       EP.account(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getAccountProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
//       EP.account(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getAccountProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
//       EP.account(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getAccountProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
//       EP.account(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       new Error("not a tx. `get` should fail")
//       (false).should.be.true("not a tx. `get` should fail")
//       done()
//     }).catch((e)=>{
//       done()
//     })
//   });


//   // some accounts are contracts
//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getNonceProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
//       EP.accountNonce(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getNonceProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
//       EP.accountNonce(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getNonceProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
//       EP.accountNonce(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getNonceProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
//       EP.accountNonce(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getNonceProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
//       EP.accountNonce(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getNonceProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
//       EP.account(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       new Error("not a tx. `get` should fail")
//       (false).should.be.true("not a tx. `get` should fail")
//       done()
//     }).catch((e)=>{
//       done()
//     })
//   });


//   // some accounts are contracts
//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getBalanceProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
//       EP.balance(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getBalanceProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
//       EP.balance(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getBalanceProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
//       EP.balance(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getBalanceProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
//       EP.balance(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getBalanceProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
//       EP.balance(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getBalanceProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
//       EP.balance(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       new Error("not a tx. `get` should fail")
//       (false).should.be.true("not a tx. `get` should fail")
//       done()
//     }).catch((e)=>{
//       done()
//     })
//   });


//   // some accounts are contracts
//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getStorageRootProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
//       EP.storageRoot(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getStorageRootProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
//       EP.storageRoot(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getStorageRootProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
//       EP.storageRoot(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getStorageRootProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
//       EP.storageRoot(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getStorageRootProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
//       EP.storageRoot(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getStorageRootProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
//       EP.storageRoot(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       new Error("not a tx. `get` should fail")
//       (false).should.be.true("not a tx. `get` should fail")
//       done()
//     }).catch((e)=>{
//       done()
//     })
//   });


//   // some accounts are contracts
//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getCodeHashProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
//       EP.codeHash(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getCodeHashProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
//       EP.codeHash(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getCodeHashProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
//       EP.codeHash(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getCodeHashProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
//       EP.codeHash(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getCodeHashProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
//       EP.codeHash(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getCodeHashProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
//       EP.codeHash(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       new Error("not a tx. `get` should fail")
//       (false).should.be.true("not a tx. `get` should fail")
//       done()
//     }).catch((e)=>{
//       done()
//     })
//   });


//   // some accounts are contracts
//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getCodeProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
//       EP.code(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a contract proof from local chaindata', function (done) {
//     eP.getCodeProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
//       EP.code(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getCodeProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
//       EP.code(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getCodeProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
//       EP.code(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getCodeProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
//       EP.code(result.address, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       done()
//     }).catch((e) => {console.log(e)})
//   });

//   it('can request a proof from local chaindata', function (done) {
//     eP.getCodeProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
//       EP.code(result.path, result.value, result.parentNodes, result.header, result.blockHash).should.be.true()
//       new Error("not a tx. `get` should fail")
//       (false).should.be.true("not a tx. `get` should fail")
//       done()
//     }).catch((e)=>{
//       done()
//     })
//   });
// });


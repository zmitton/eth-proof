var Web3 = require('web3');
var EP  = require('./../lib/ethProof')
var EV = require('./../lib/ethVerify')
var eP = new EP(new Web3.providers.HttpProvider("https://gmainnet.infura.io"))

var eP = new EP(
  new Web3.providers.HttpProvider("https://gmainnet.infura.io"),
  'a61b780b1c2f6a79d052e4b58234dc126fd7fdc9338705983d6068965ba8384b',
  '/Users/zacharymitton/Library/Ethereum/geth/chaindata'
)

describe('account state proof/verify [nonce, balance, storageRoot, codeHash]', function () {
  // some accounts are contracts
  it('can request a contract proof from local chaindata', function (done) {
    eP.getAccountProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
      EV.account(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a contract proof from local chaindata', function (done) {
    eP.getAccountProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
      EV.account(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getAccountProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
      EV.account(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getAccountProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
      EV.account(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getAccountProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
      EV.account(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getAccountProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EV.account(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true()
      new Error("not a tx. `get` should fail")
      (false).should.be.true("not a tx. `get` should fail")
      done()
    }).catch((e)=>{
      done()
    })
  });
});

describe('account nonce proof/verify', function () {
  // some accounts are contracts
  it('can request a contract proof from local chaindata', function (done) {
    eP.getNonceProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
      EV.accountNonce(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a contract proof from local chaindata', function (done) {
    eP.getNonceProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
      EV.accountNonce(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getNonceProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
      EV.accountNonce(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getNonceProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
      EV.accountNonce(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getNonceProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
      EV.accountNonce(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getNonceProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EV.account(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true()
      new Error("not a tx. `get` should fail")
      (false).should.be.true("not a tx. `get` should fail")
      done()
    }).catch((e)=>{
      done()
    })
  });
});

describe('account state: [nonce, balance, storageRoot, codeHash], and code proofs', function () {
  // some accounts are contracts
  it('can request a contract proof from local chaindata', function (done) {
    eP.getBalanceProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
      EV.balance(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a contract proof from local chaindata', function (done) {
    eP.getBalanceProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
      EV.balance(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getBalanceProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
      EV.balance(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getBalanceProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
      EV.balance(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getBalanceProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
      EV.balance(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getBalanceProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EV.balance(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true()
      new Error("not a tx. `get` should fail")
      (false).should.be.true("not a tx. `get` should fail")
      done()
    }).catch((e)=>{
      done()
    })
  });
});

describe('account state: [nonce, balance, storageRoot, codeHash], and code proofs', function () {
  // some accounts are contracts
  it('can request a contract proof from local chaindata', function (done) {
    eP.getStorageRootProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
      EV.storageRoot(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a contract proof from local chaindata', function (done) {
    eP.getStorageRootProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
      EV.storageRoot(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getStorageRootProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
      EV.storageRoot(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getStorageRootProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
      EV.storageRoot(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getStorageRootProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
      EV.storageRoot(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getStorageRootProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EV.storageRoot(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true()
      new Error("not a tx. `get` should fail")
      (false).should.be.true("not a tx. `get` should fail")
      done()
    }).catch((e)=>{
      done()
    })
  });
});

describe('account state: [nonce, balance, storageRoot, codeHash], and code proofs', function () {
  // some accounts are contracts
  it('can request a contract proof from local chaindata', function (done) {
    eP.getCodeHashProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
      EV.codeHash(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a contract proof from local chaindata', function (done) {
    eP.getCodeHashProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
      EV.codeHash(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getCodeHashProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
      EV.codeHash(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getCodeHashProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
      EV.codeHash(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getCodeHashProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
      EV.codeHash(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getCodeHashProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EV.codeHash(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true()
      new Error("not a tx. `get` should fail")
      (false).should.be.true("not a tx. `get` should fail")
      done()
    }).catch((e)=>{
      done()
    })
  });
});

describe('account state: [nonce, balance, storageRoot, codeHash], and code proofs', function () {
  // some accounts are contracts
  it('can request a contract proof from local chaindata', function (done) {
    eP.getCodeProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
      EV.code(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a contract proof from local chaindata', function (done) {
    eP.getCodeProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4').then((result)=>{
      EV.code(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getCodeProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A').then((result)=>{
      EV.code(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getCodeProof('0087194a367D4D508D9a97846264f69d81e419ca').then((result)=>{
      EV.code(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getCodeProof('0d8775f648430679a709e98d2b0cb6250d2887ef').then((result)=>{
      EV.code(result.address, result.value, result.stack, result.header, result.blockhash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });

  it('can request a proof from local chaindata', function (done) {
    eP.getCodeProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').then((result)=>{
      EV.code(result.path, result.value, result.stack, result.header, result.blockhash).should.be.true()
      new Error("not a tx. `get` should fail")
      (false).should.be.true("not a tx. `get` should fail")
      done()
    }).catch((e)=>{
      done()
    })
  });
});



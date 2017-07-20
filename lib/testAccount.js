// Trie = require('merkle-patricia-tree');
// rlp = require('rlp');
// levelup = require('levelup');
// db = levelup('/Users/zacharymitton/Library/Ethereum/geth/chaindata');
// sha3 = require('js-sha3').keccak_256

Web3 = require('web3');
EP  = require('./ethProof')
EV = require('./ethVerify')


ep = new EP(
  new Web3.providers.HttpProvider("https://gmainnet.infura.io"),
  'a61b780b1c2f6a79d052e4b58234dc126fd7fdc9338705983d6068965ba8384b',
  '/Users/zacharymitton/Library/Ethereum/geth/chaindata'
)


// web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"))


// proxy contract at:
// getStorage('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4') //=>
// [ <Buffer 20 29 0d ec d9 54 8b 62 a8 d6 03 45 a9 88 38 6f c8 4b a6 bc 95 48 40 08 f6 36 2f 93 16 0e f3 e5 63>,
//   <Buffer 94 10 fb c3 06 e8 4e e5 30 85 60 98 cc 49 02 16 bd 5e 9f a5 2e> ]

// contract at:
ep.getAccountProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
  console.log("proof  => ",result.address, EV.account(result.address, result.value, result.stack, result.header, result.blockhash))
  return ep.getAccountProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4')
}).then((result) => {
  console.log("proof  => ",result.address, EV.account(result.address, result.value, result.stack, result.header, result.blockhash))
  return ep.getAccountProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.account(result.address, result.value, result.stack, result.header, result.blockhash))
  return ep.getAccountProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.account(result.address, result.value, result.stack, result.header, result.blockhash))
  return ep.getAccountProof('0087194a367D4D508D9a97846264f69d81e419ca')
}).then((result)=>{
  // console.log(result.value)
  console.log("proof  => ",result.address, EV.account(result.address, result.value, result.stack, result.header, result.blockhash))
  return ep.getAccountProof('0d8775f648430679a709e98d2b0cb6250d2887ef')//bat
}).catch((e)=>{console.log(e)})


ep.getNonceProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
  console.log(EV.accountNonce(result.address, result.nonce, result.value, result.stack, result.header, result.blockhash))
  return ep.getNonceProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4')
}).then((result) => {
  console.log("proof  => ",result.address, EV.accountNonce(result.address, result.nonce, result.value, result.stack, result.header, result.blockhash))
  return ep.getNonceProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.accountNonce(result.address, result.nonce, result.value, result.stack, result.header, result.blockhash))
  return ep.getNonceProof('0087194a367D4D508D9a97846264f69d81e419ca')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.accountNonce(result.address, result.nonce, result.value, result.stack, result.header, result.blockhash))
  return ep.getNonceProof('0d8775f648430679a709e98d2b0cb6250d2887ef')//bat
}).catch((e)=>{console.log(e)})

ep.getBalanceProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
  console.log(EV.balance(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getBalanceProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4')
}).then((result) => {
  console.log("proof  => ",result.address, EV.balance(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getBalanceProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.balance(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getBalanceProof('0087194a367D4D508D9a97846264f69d81e419ca')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.balance(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getBalanceProof('0d8775f648430679a709e98d2b0cb6250d2887ef')//bat
}).catch((e)=>{console.log(e)})


ep.getStorageRootProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
  console.log(EV.storageRoot(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getStorageRootProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4')
}).then((result) => {
  console.log("proof  => ",result.address, EV.storageRoot(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getStorageRootProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.storageRoot(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getStorageRootProof('0087194a367D4D508D9a97846264f69d81e419ca')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.storageRoot(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getStorageRootProof('0d8775f648430679a709e98d2b0cb6250d2887ef')//bat
}).catch((e)=>{console.log(e)})

ep.getCodeHashProof('9cc9bf39a84998089050a90087e597c26758685d').then((result)=>{
  console.log(EV.codeHash(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getCodeHashProof('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4')
}).then((result) => {
  console.log("proof  => ",result.address, EV.codeHash(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getCodeHashProof('1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.codeHash(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getCodeHashProof('0087194a367D4D508D9a97846264f69d81e419ca')
}).then((result)=>{
  console.log("proof  => ",result.address, EV.codeHash(result.address, result.balance, result.value, result.stack, result.header, result.blockhash))
  return ep.getCodeHashProof('0d8775f648430679a709e98d2b0cb6250d2887ef')//bat
}).catch((e)=>{console.log(e)})



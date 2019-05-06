const { keccak, encode, toBuffer } = require('eth-util-lite')
const { Account } = require('eth-object')
const { GetAndVerify } = require('./../index')

const getAndVerify = new GetAndVerify("https://mainnet.infura.io")

describe('Account GetAndVerify Against BlockHash', () => {

  it.only('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0xb7964f87a97582605af695710ad252afa018a97384ba9438cf24e42fa9f0efc9'
    let accountAddress = '0x9cc9bf39a84998089050a90087e597c26758685d'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    console.log("\nONLY ONE TEST IS CURRENTLY ENABLED. PLEASE SELECT ONE TEST AT A TIME\n")
    console.log("\nPLAIN:\n", account)
    console.log("\nRAW:\n", account.raw)
    console.log("\nOBJECT:\n", account.object)
    console.log("\nHEX:\n", account.hex)
    console.log("\nBUFFER:\n", account.buffer)
    console.log("\nJSON:\n", account.json)
    console.log("\nSERIALIZE():\n", account.serialize())
    console.log("\nTOBUFFER():\n", account.toBuffer())
    console.log("\nTOHEX():\n", account.toHex())
    console.log("\nTOOBJECT():\n", account.toObject())
    console.log("\nTOSTRING():\n", account.toString())
    console.log("\nTOJSON():\n", account.toJson())
    console.log("\nULEs():\n", Account.fields)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x9cc9bf39a84998089050a90087e597c26758685d'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
  });
  it('should be able to prove an account does not exist', async () => {
    let blockHashBlockZero = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    let emptyAccountAddress = '0x0000000000000000000000000000000000000000'
    let account = await getAndVerify.accountAgainstBlockHash(emptyAccountAddress, blockHashBlockZero)
    // console.log(account)
  });
//standard accounts validated by random legitimate blockhash
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(account)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(account)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(account)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x0087194a367D4D508D9a97846264f69d81e419ca'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(account)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0x0d8775f648430679a709e98d2b0cb6250d2887ef'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(account)
  });

  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0x7315156cc8347cf9bfac8a4cd1db6f5d4727b06b3fe14feba62381335b2d14d5'
    let accountAddress = '0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHash)
    // console.log(account)
  });

  it('should be able to prove an account did not exist at a given time', async () => {
    // proof of absence : the following account didnt exist durring block 0
    let blockHashBlockZero = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    let accountAddress = '0x9cc9bf39a84998089050a90087e597c26758685d'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHashBlockZero)
    // console.log(account)
    encode(account).equals(Account.NULL.toBuffer()).should.be.true()

  });
  it('should be able to prove an account did not exist at a given time', async () => {
    let blockHashBlockZero = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    let accountAddress = '0xdeadbeef00123456789012345678901234567890'
    let account = await getAndVerify.accountAgainstBlockHash(accountAddress, blockHashBlockZero)
    // console.log(account)
    encode(account).equals(Account.NULL.toBuffer()).should.be.true()

    account[0].equals(toBuffer()).should.be.true()
    account[1].equals(toBuffer()).should.be.true()
    account[2].equals(keccak(encode())).should.be.true()
    account[3].equals(keccak()).should.be.true()
  });
});

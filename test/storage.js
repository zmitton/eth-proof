/***************************************************************************
The contracts deployed on mainnet used for these tests:
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

https://etherscan.io/address/0x9cc9bf39a84998089050a90087e597c26758685d#code
contract Storage {
    uint pos0;
    mapping(address => uint) pos1;
    function Storage() {
        pos0 = 1234;
        pos1[0x1f4e7db8514ec4e99467a8d2ee3a63094a904e7a] = 5678;
    }
}
**************************************************************************/
const { keccak, encode, decode, toBuffer, toHex, toWord, mappingAt } = require('./../utils')

// const expect = require("chai").expect;

const { GetAndVerify, GetProof, VerifyProof } = require('./../index')

const getAndVerify = new GetAndVerify("http://localhost:8545")

describe('Storage GetAndVerify Against BlockHash', () => {
  // add test for the contract itself (account proof) and assert against known values for the code/storageRoot/value
  // add test like above that checks a null account for all its values

  it('should get and verify "pos0 = 0x1234;"', async () => {
    let blockHash       = '0xb7964f87a97582605af695710ad252afa018a97384ba9438cf24e42fa9f0efc9'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = '0x0'
    
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)
    storageValue.equals(toBuffer("0x1234")).should.be.true()
    storageValue.equals(toBuffer("0x9999")).should.be.false()
  });
  it('should get and verify "pos0 = 0x1234;" against other blockHash', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = '0x0'
    
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x1234")).should.be.true()
  });
  it('should get and verify "pos1[0x1F4E7D...] = 0x5678;"', async () => {
    let blockHash       = '0xb7964f87a97582605af695710ad252afa018a97384ba9438cf24e42fa9f0efc9'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = mappingAt('0x1', '0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A')
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x5678")).should.be.true()
  });
  it('should get and verify "pos1[0x1F4E7D...] = 0x5678;" against other blockHash', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = mappingAt('0x1', '0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A')
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x5678")).should.be.true()
  });
  it('should get and verify "pos1[0x123456...] = 0x8765;" against blockHash', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = mappingAt('0x1', '0x1234567890123456789012345678901234567890')
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x8765")).should.be.true()
  });
  it('should get and verify "pos2[0x111][0x222] = 0x9101112;" against blockHash', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = mappingAt('0x2', '0x111', '0x222')
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x9101112")).should.be.true()
  });
  it('should get and verify "pos2[0x333][0x444] = 0x13141516;" against blockHash', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = mappingAt('0x2', '0x333', '0x444')
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x13141516")).should.be.true()
  });
  it('should get and verify "pos3 = abi.encode();" against blockHash', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = '0x3'
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(keccak()).should.be.true()
  });
  it('should get and verify some older contract data', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x9cc9bf39a84998089050a90087e597c26758685d'
    let position        = '0x'
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x04d2")).should.be.true()
  });
  it('should get and verify some older contract data', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x10fbc306e84ee530856098cc490216bd5e9fa52e'
    let position        = '0x'
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x01")).should.be.true()
  });
  it('should get and verify some older contract data', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x10fbc306e84ee530856098cc490216bd5e9fa52e'
    let position        = '0x01'
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer("0x2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4")).should.be.true()
  });

  it('should get and verify some older contract data', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x9cc9bf39a84998089050a90087e597c26758685d'
    let position        = mappingAt('0x1','0x1f4e7db8514ec4e99467a8d2ee3a63094a904e7a')
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer(5678)).should.be.true()
  });

// prove absence
  it('should get and verify that an undefined storage value is in fact null', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    // let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let accountAddress  = '0xdeadbeef00000000000046283746191046394857' //non-existant account
    let position        = '0x0' // <== an unset storage position
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer()).should.be.true()
    storageValue.equals(toBuffer("0x1234")).should.be.false()
  });
  it('should get and verify that an undefined storage value is in fact null', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = '0xff' // <== an unset storage position
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer()).should.be.true()
    storageValue.equals(toBuffer("0x1234")).should.be.false()
  });
  it('should get and verify a storage slot is empty in a real contract', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f'
    let accountAddress  = '0x92fd2D727ff572d0AA56493a0Ebc9b9e24d15295'
    let position        = '0x4' // <== an unset storage position
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)

    storageValue.equals(toBuffer()).should.be.true()
  });
  it('should get and verify a mapping slot is empty in a real mapping', async () => {
    let blockHash       = '0x5de2488ca9ea618d5cdd095b4abf4e0b69c2fb2b3c83b7a26e383cb6e77dfc5f' 
    let accountAddress  = '0x9cc9bf39a84998089050a90087e597c26758685d' 
    let position        = mappingAt('0x1','0x1111111111111111111111111111111111111111') //nothing here
    let storageValue = await getAndVerify.storageAgainstBlockHash(accountAddress, position, blockHash)
    storageValue.equals(toBuffer()).should.be.true()
  });

});

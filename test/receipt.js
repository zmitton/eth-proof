// const Web3 = require('web3')
const expect = require("chai").expect;

const { BuildProof, VerifyProof } = require('./../index')
const buildProof = new BuildProof("https://mainnet.infura.io")
// const buildProof = new BuildProof("http://localhost:8545")
const [keccak, encode, decode, toBuffer, toHex] = require('./../ethUtils')


describe('getReceiptProof', () => {
// 0x499a8636c52111a37e074c20c6133ff7af662ffd728cf5222822099fea077b4e
// 0x7371ea9eae773f03c6bd886295a82e419bdc18a5899b5ecc0d6186d0ebbd2b36



  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de')
    // console.log(prf)
    VerifyProof.receipt(prf.path, prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });
  it('should be able to request a proof for 0xdaa2fcc5 and verify it', async () => {
    // 296 transactions in this block! so the request takes a while 
    // and may even fail (if it takes over 10 seconds)
    var prf = await buildProof.getReceiptProof('0xdaa2fcc5d94f03348dc26bfacf84828ff563ccc57f6ab8260d2bd35b5d668ef8')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x7371ea9eae773f03c6bd886295a82e419bdc18a5899b5ecc0d6186d0ebbd2b36')
    // console.log(prf)
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0xc32470c2459fd607246412e23b4b4d19781c1fa24a603d47a5bc066be3b5c0af'
    let txHash    = '0xacb81623523bbabccb1638a907686bc2f3229c70e3ab51777bef0a635f3ac03f'
    let tx = await buildProof.txAgainstBlockHash(txHash, blockHash)
    // console.log(prf)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0xf82990de9b368d810ce4b858c45717737245aa965771565f8a41df4c75acc171'
    let txHash    = '0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de'
    let tx = await buildProof.txAgainstBlockHash(txHash, blockHash)
    // console.log(prf)
  });
  it('should be able to request a proof for 0xc55e2b90 and verify it', async () => {
    let blockHash = '0xc0f4906fea23cf6f3cce98cb44e8e1449e455b28d684dfa9ff65426495584de6'
    let txHash    = '0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef'
    let tx = await buildProof.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });




  it('should be able to request a proof for 0xc55e2b90 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0x299a93ac and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0x4e4b9cd3 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0x74bdf545 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0x84e86114 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x84e86114ea47d97e882411db029b5c42e7e25395f279636e4a277ec44dce23a4')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });


  it('should be able to request a proof for 0x8d0da05c and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x8d0da05c3256da94a4213149de3e17fae7d1fd1b86fd4e57557527325ba87adc')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });


  it('should be able to request a proof for 0xe6c0c5e6 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xe6c0c5e61a52b2226f7730d915e4c1baf606f34719dcfbda7164266cce111ae3')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });


  it('should be able to request a proof for 0x1e1a818d and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x1e1a818d63fd4d03c6125ea4f5e99a27255728a2bad195f858635543a95f1c3f')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });


  it('should be able to request a proof for 0x598bf980 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x598bf980dead5d96ca0e2325f2dbc884ada041ca2e05f8c9bdac1c60926764e0')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0xed2903be and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xed2903beb85ffce50cec37050313951920d997199ff4a4d7b8fbc0b45ca44c84')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0x6afb931a and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x6afb931aa1008783dedf5c66dc41b1fc8f01bf34ebc183b37110a7a77523e15c')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0xc12e7271 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xc12e727125b5733a90555a1438ec48b27ffa928b84d39775923afeb229ba1a60')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0xfd7f67e1 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xfd7f67e10bb48c641743108096eb7aa750d17afb8ac95560d93ebcd347e74443')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0xc1080d2e and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xc1080d2eaf1f3e866a4c12298a0be47647665a120d8ee681520eb440a6e06f99')
     VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0xe6a37c02 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xe6a37c02c198f9e4c8e7831a1b6a0e6711bf372a301147da339e2f61117f58a1')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0x7392ee6d and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0x7392ee6d4bea6a0c8018de116fd2d6bf5678fdc0faae53240e7a22ab57db22d0')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('should be able to request a proof for 0xacb81623 and verify it', async () => {
    var prf = await buildProof.getReceiptProof('0xacb81623523bbabccb1638a907686bc2f3229c70e3ab51777bef0a635f3ac03f')
    VerifyProof.receipt(encode(prf.txIndex), prf.value, prf.branch, prf.header, prf.blockHash).should.be.true()
  });

  it('requesting invalid tx hash should throw error', async () => {
    await buildProof.getReceiptProof('0x4914025aa9ea9f274b174205adde3243eec74589bef9a0e78a433763b2f8caa3').should.be.rejectedWith(Error)
    await buildProof.getReceiptProof('0x1234').should.be.rejectedWith(Error)
  });

  it('verifying a modified or different proof should throw an error', async () => {
    let prf = await buildProof.getReceiptProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb')
    let otherPrf = await buildProof.getReceiptProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3')

    expect(()=>{VerifyProof.receipt(Buffer.from('80','hex'), prf.value, prf.branch, prf.header, prf.blockHash)}).to.throw()
    expect(()=>{VerifyProof.receipt(encode(prf.txIndex), otherPrf.value, prf.branch, prf.header, prf.blockHash)}).to.throw()
    expect(()=>{VerifyProof.receipt(otherPrf.path, prf.value, otherPrf.branch, otherPrf.header, otherPrf.blockHash)}).to.throw()
  });
});

const expect = require("chai").expect;
const { GetAndVerify, GetProof, VerifyProof } = require('./../index')
// const { keccak, encode, decode, toBuffer, toHex } = require('./../ethUtils')
const getAndVerify = new GetAndVerify("https://mainnet.infura.io")

//should need utils to check results

describe('Transaction GetAndVerify Against blockHash', () => {
//take a look at 155 (new tx). compare with pre-dao format
//should be 9 elements instead of 6 or whatever idk
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0xc32470c2459fd607246412e23b4b4d19781c1fa24a603d47a5bc066be3b5c0af'
    let txHash    = '0xacb81623523bbabccb1638a907686bc2f3229c70e3ab51777bef0a635f3ac03f'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log(tx)
    // console.log(tx.hex)
  });
  it('should be able to request a proof for 0xb53f7522 and verify it', async () => {
    let blockHash = '0xf82990de9b368d810ce4b858c45717737245aa965771565f8a41df4c75acc171'
    let txHash    = '0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log(prf)
  });

  it('should be able to request a proof for 0xc55e2b90 and verify it', async () => {
    let blockHash = '0xc0f4906fea23cf6f3cce98cb44e8e1449e455b28d684dfa9ff65426495584de6'
    let txHash    = '0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });
  it('should be able to request a proof for 0xc55e2b90 and verify it', async () => {
    let blockHash = '0x06aaa18961661ff572a8ef7314871affad8d85de6b8a6b724a137041fbb0dfea'
    let txHash    = '0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for 0xc55e2b90 and verify it', async () => {
    let blockHash = '0x06aaa18961661ff572a8ef7314871affad8d85de6b8a6b724a137041fbb0dfea'
    let txHash    = '0x299a93acf5b100336455ef6ecda39e22329fb750e6264c8ee44f579947349de9'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0x66534add4c3ed6de5dfecbc03c6275dfc3f3d01c99b65f4030c397bf3290cc02'
    let txHash    = '0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });


it('should be able to request a proof for ', async () => {
    let blockHash = '0xfb981a97ad4ce5475df40b1d10da2f0d53f292b4fd52c498b92da7b11713b546'
    let txHash    = '0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });


  it('should be able to request a proof for ', async () => {
    let blockHash = '0xcd1b584875df23199133c6aa9644676e1055ecb0c67328d9ca897e66bad154b0'
    let txHash    = '0x84e86114ea47d97e882411db029b5c42e7e25395f279636e4a277ec44dce23a4'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0x9390b1bf8d81984b38dfa677128026fab1a5622bab07e67086818e7db16060d8'
    let txHash    = '0x8d0da05c3256da94a4213149de3e17fae7d1fd1b86fd4e57557527325ba87adc'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0x5edf99fd6efe492b8297fd43c603ae7820efa8d2e00900ecaa38c67a3b879348'
    let txHash    = '0xe6c0c5e61a52b2226f7730d915e4c1baf606f34719dcfbda7164266cce111ae3'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0xb2fb12f6ba24958b50c20e330d96a4d28474594bef89cd65a33cf968278e6dc4'
    let txHash    = '0x1e1a818d63fd4d03c6125ea4f5e99a27255728a2bad195f858635543a95f1c3f'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0xf0604916b9ce1543671c1309c52bedbe4689c67da9a571e5301b717d31d37a7d'
    let txHash    = '0x598bf980dead5d96ca0e2325f2dbc884ada041ca2e05f8c9bdac1c60926764e0'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0xd39e271f8f898847ba586ec1a1b7d9a089865344c214e51f2e3e1ddc2fb48848'
    let txHash    = '0xed2903beb85ffce50cec37050313951920d997199ff4a4d7b8fbc0b45ca44c84'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0x1410f41c3b6ff435a50e2ccc24dc55544c287e41184eb1923e4bfb63edd1b101'
    let txHash    = '0x6afb931aa1008783dedf5c66dc41b1fc8f01bf34ebc183b37110a7a77523e15c'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0xea50140910517f7c489d4a853585214fbec50ba4fc54c58acce712efae07e25f'
    let txHash    = '0xc12e727125b5733a90555a1438ec48b27ffa928b84d39775923afeb229ba1a60'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0x43340a6d232532c328211d8a8c0fa84af658dbff1f4906ab7a7d4e41f82fe3a3'
    let txHash    = '0xdaa2fcc5d94f03348dc26bfacf84828ff563ccc57f6ab8260d2bd35b5d668ef8'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0x24bacc6e41d1a583dae370573f03d35c67b421f602af6882ca164cc8763342d6'
    let txHash    = '0xfd7f67e10bb48c641743108096eb7aa750d17afb8ac95560d93ebcd347e74443'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0xcec8db0c358cda6512f4bfd22fcc7287d0bb08aa89e1e704e334d2d967d3b1b7'
    let txHash    = '0xc1080d2eaf1f3e866a4c12298a0be47647665a120d8ee681520eb440a6e06f99'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0xcbc584929eed97b692a6e5c498559b60e924c6f194b1be070d3d12bee73cd2a6'
    let txHash    = '0xe6a37c02c198f9e4c8e7831a1b6a0e6711bf372a301147da339e2f61117f58a1'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0xcbc584929eed97b692a6e5c498559b60e924c6f194b1be070d3d12bee73cd2a6'
    let txHash    = '0x7392ee6d4bea6a0c8018de116fd2d6bf5678fdc0faae53240e7a22ab57db22d0'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('should be able to request a proof for ', async () => {
    let blockHash = '0xc32470c2459fd607246412e23b4b4d19781c1fa24a603d47a5bc066be3b5c0af'
    let txHash    = '0xacb81623523bbabccb1638a907686bc2f3229c70e3ab51777bef0a635f3ac03f'
    let tx = await getAndVerify.txAgainstBlockHash(txHash, blockHash)
    // console.log("TX ", tx)
  });

  it('requesting invalid tx hash should throw error', async () => {
    let blockHash = '0xc32470c2459fd607246412e23b4b4d19781c1fa24a603d47a5bc066be3b5c0af'    
    await getAndVerify.txAgainstBlockHash("0x1234", blockHash).should.be.rejectedWith(Error)
    await getAndVerify.txAgainstBlockHash("0x1111111111222222222233333333334444444444555555555566666666667777", blockHash).should.be.rejectedWith(Error)
  });

  it('should throw when attempting to prove against the wrong blockHash', async () => {
    let blockHashFromBlockNum4012371 = '0xc32470c2459fd607246412e23b4b4d19781c1fa24a603d47a5bc066be3b5c0af'
    let txFromBlockNum1008398 = '0xfd7f67e10bb48c641743108096eb7aa750d17afb8ac95560d93ebcd347e74443'
    await getAndVerify.txAgainstBlockHash(txFromBlockNum1008398, blockHashFromBlockNum4012371).should.be.rejectedWith(Error)
    // console.log("TX ", tx)
  });
  // it('verifying a modified or different proof should throw an error', async () => {
  //   let prf = await getAndVerify.getTransactionProof('0x4e4b9cd37d9b5bb38941983a34d1539e4930572bdaf41d1aa54ddc738630b1bb')
  //   let otherPrf = await getAndVerify.getTransactionProof('0x74bdf5450025b8806d55cfbb9b393dce630232f5bf87832ae6b675db9d286ac3')
    
  //   expect(()=>{VerifyProof.transaction(Buffer.from('80','hex'), prf.value, prf.branch, prf.header, prf.blockHash)}).to.throw()
  //   expect(()=>{VerifyProof.transaction(encode(prf.txIndex), otherPrf.value, prf.branch, prf.header, prf.blockHash)}).to.throw()
  //   expect(()=>{VerifyProof.transaction(otherPrf.path, prf.value, otherPrf.branch, otherPrf.header, otherPrf.blockHash)}).to.throw()
  // });
});

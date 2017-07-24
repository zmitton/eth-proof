const Web3 = require('web3');

const EP  = require('./../../index')
const chainDataPath = '/Users/zacharymitton/Library/Ethereum/geth/chaindata'
const eP = new EP(
  new Web3.providers.HttpProvider("https://gmainnet.infura.io"),
  'a61b780b1c2f6a79d052e4b58234dc126fd7fdc9338705983d6068965ba8384b',
  chainDataPath
)

console.log("USING CHAIN DATA PATH:", chainDataPath, "YOU CAN NOT JUST USE MY PATH!!!")
describe('storage proof', function () {
  // some accounts are contracts
  it('can request a contract proof from local chaindata', function (done) {
    eP.getStorageProof('9cc9bf39a84998089050a90087e597c26758685d', '00').then((result)=>{
      EP.storageAtIndex(
        result.storageIndex, 
        result.value, 
        result.storageParentNodes, 
        result.address, 
        result.accountParentNodes, 
        result.header, 
      result.blockHash).should.be.true()
      done()
    }).catch((e) => {console.log(e)})
  });
});

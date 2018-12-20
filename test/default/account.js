const Trie = require('merkle-patricia-tree')
const assert = require('assert')
const EthProof = require('./../../index')
const rlp = require('rlp')//todo remove

// const sha3 = require('js-sha3').keccak_256
// const sha3 = require('ethereumjs-util').sha3
// const rlp = require('rlp');

// function stubBuildProof1(){ 
//   return new Promise((resolve, reject)=> { 
//     var stateRoot = "0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544"
//     var rpcR = {
//       "address": "0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57",
//       "accountProof": [
//         "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
//         "0xf90211a0e45a9e85cab1b6eb18b30df2c6acc448bbac6a30d81646823b31223e16e5063ea033bd7171d556b981f6849064eb09412b24fedc0812127db936067043f53db1b9a0ca56945f074da4f15587404593faf3a50d17ea0e21a418ad6ec99bdf4bf3f914a0da23e9004f782df128eea1adff77952dc85f91b7f7ca4893aac5f21d24c3a1c9a0ba5ec61fa780ee02af19db99677c37560fc4f0df5c278d9dfa2837f30f72bc6ba08310ad91625c2e3429a74066b7e2e0c958325e4e7fa3ec486b73b7c8300cfef7a0732e5c103bf4d5adfef83773026809d9405539b67e93293a02342e83ad2fb766a030d14ff0c2aab57d1fbaf498ab14519b4e9d94f149a3dc15f0eec5adf8df25e1a038f4db0ccaf2e3ecefec2c38e903dfc52033806102d36fd2b9aa21ef56811155a05a43bd92e55aa78df60e70b6b53b6366c4080fd6a5bdd7b533b46aff4a75f6f2a0a0c410aa59efe416b1213166fab680ce330bd46c3ebf877ff14609ee6a383600a02f41e918786e557293068b1eda9b3f9f86ed4e65a6a5363ee3262109f6e08b17a001f42a40f02f6f24bb97b09c4d3934e8b03be7cfbb902acc1c8fd67a7a5abacea00acbdce2787a6ea177209bd13bfc9d0779d7e2b5249e0211a2974164e14312f5a0dadbe113e4132e0c0c3cd4867e0a2044d0e5a3d44b350677ed42fc9244d004d4a0aa7441fefc17d76aedfcaf692fe71014b94c1547b6d129562b34fc5995ca0d1a80",
//         "0xf90211a0c47c059a0be8406cd5974800af8f2c4c20bc20f768a8c470d420cac74548f7b9a007b6b3d47d599095120d2d7d94dd7658dbcd7f9359f5af19c503f9d239973f74a0cf0dcd8580162b4f0f21be3da01de72876915956f0d9d4f84175992fd97b6964a0bb2577b2e8cf1dba795185586c248a05e1b5a0eaa46f2e89e73521262c6ae085a0351e820d1f7fdbb8ad63d4ba146d152d0949fc868770f7754766cdfce638ebf9a0df7cc93025372caadeedffb4bac7c08f741824c8218784f1df9fad4b9bd9b466a049a1ab97c2847a29524ff324e9b840a037805fbae58a9aea03093bf678214f7aa0e7fdd7b4770e9d3cce646efc3dbb43c7fdaf6bebf2b208afc272b380f18d965ca05596f461ff09269352d48ab73e1e7e86b44e862be1bd60cd8b82e5efe32e5ba9a0df6fa6462e8941385655f8b770be3df24a872329048a47090244bf88671c6583a09d75507a5239ecc19c96134f6ecd555b1844e2453f09ba1253be2355c067cacfa06dd8f5e13717693c3be42386dc3a6b7e1f56e8501d712f423e827e87349c13f3a01d1535b3ebeaf9e223182e3c7e48cd375b683ffa498e6489f4980c09e1e9af24a03b7a50fcce4204262a5e02475bbe115c6b047e26fc494243d9ec3723315029f5a055821b347d297e74f92004f62914767cadc6bd56885ce4e373e3601121b3e974a06bee6fc884d594231867eaac329fae5b422f8caf4a90afa890f65829d8860a4780",
//         "0xf8b1a08d692cd4d0242bf7707efa92b3ba7d3d81d134c3474c0f99df426e3bd28e68ba8080a020596ed1bae1f684f42434a663421f559f7cc5785d0070d0bd870f7d84f5d2a38080a01870bea6114545eb36c659aafd664a889054d1f538c44b96b030a30ca10234458080808080a08d640da3fb1211164e8fab2a248825c30fc5cb9c0bfc82666384665bf8c5f35a8080a0408e213f92141d2c5ac4e372ae89c8944cf0dbcfc4df94e1866781ddf051381a80",
//         "0xf8729f2066114afa6ead62dfcfddef7d820c9467564e60380b1829d3f67ba84e4282b850f84e808a014542ba12a337c00000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
//       ],
//       "balance": "0x14542ba12a337c00000",
//       "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
//       "nonce": "0x0",
//       "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
//       "storageProof": []
//     }
//   })
// }

describe('account proofs', () => {
  it('can verify proof', async () => {
    let ethproof = new EthProof()
    let prf = await ethproof.getStorageProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")
    // console.log("THINGS2 ", prf)
    console.log("aaaaaa", EthProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))

  });

  it('can disprove invalid proof (invalid address)', async () => {
    let ethproof = new EthProof()
    let prf = await ethproof.getStorageProof("0xc1cdc601f89c0428b31302d187e0dc08ad7d1c57")

    prf.addressBytes[0] = new Buffer('01','hex')
    console.log("THINGS4aaaaaa", EthProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  });

  it('can verify absence', async () => {
    let ethproof = new EthProof()
    let prf = await ethproof.getStorageProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")

    console.log("THINGS3 ", prf)
    console.log("VVVVVV", EthProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  });

  it('can disprove invalid absence proof', async () => {
    let ethproof = new EthProof()
    let prf = await ethproof.getStorageProof("0x00000001f89c0428b31302d187e0dc08ad7d1c57")

    console.log("THINGS3 ", prf)
    console.log("VVVVVV", EthProof.verifyAccount(prf.addressBytes, prf.accountBytes, prf.branchBytes, prf.headerBytes, prf.blockHashBytes))
  });
});

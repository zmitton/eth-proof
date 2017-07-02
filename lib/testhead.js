Trie = require('merkle-patricia-tree');
rlp = require('./rlp');
levelup = require('levelup');
db = levelup('/Users/zacharymitton/Library/Ethereum/geth/chaindata');
sha3 = require('js-sha3').keccak_256

numToBuf = (input)=>{ return new Buffer(byteable(input.toString(16)), "hex") }
stringToBuf = (input)=>{ return new Buffer(byteable(input.slice(2)), "hex") }
byteable = (input)=>{ return input.length % 2 == 0 ? input : "0" + input }



b = {  
  "difficulty":"0x2",
  "extraData":"0xd783010607846765746887676f312e372e33856c696e7578000000000000000095dfadba901e40820a943f377b19fc7e9104160aaef7dc817902267fed61178e071423b6bb0a4e94510b8a8054863d69a58b4e8c19f1c78be8ac219362579f6f00",
  "gasLimit":"0x47e7bf",
  "gasUsed":"0x1dfc2",
  "hash":"0x8645f39ba3aec313c9d5ddd828275c8e0252653b2f57468642bc7986a55bc56d",
  "logsBloom":"0x004000400400400100000000000000000000000100000000000000000000000000000000000000000000800000000000000000000000008000002800000000040000000000002000000000000000000000000000000000000000000a0000002000000000000000000000000000000020000000000204000002000000000000000080000000000000400000000000400180200000000000000000000000000000000000000000000000000000000000000809000000000000000000000000080000000000000000000000000000044000020000000000002100000000000000001000000400000000000000000000040000000000020000000000000000000000",
  "miner":"0x0000000000000000000000000000000000000000",
  "mixHash":"0x0000000000000000000000000000000000000000000000000000000000000000",
  "nonce":"0x0000000000000000",
  "number":"0x6c6c3",
  "parentHash":"0x6f7c788b90078720262235ba0aa131a14ba63d3b89bdb31e0deb82979b8b51a8",
  "receiptsRoot":"0x8363f49c42c2bb31242bd0e5895fffec8194a977de5c4d05efc475ab49767fcf",
  "sha3Uncles":"0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  "size":"0x501",
  "stateRoot":"0x17c210e76a232c73abd26ffc078ebef63c5d98a28a85c9ef539edf5417651c08",
  "timestamp":"0x5953eead",
  "totalDifficulty":"0xd15f2",
  "transactions":[  
    {  
      "blockHash":"0x8645f39ba3aec313c9d5ddd828275c8e0252653b2f57468642bc7986a55bc56d",
      "blockNumber":"0x6c6c3",
      "from":"0x9e3d69305da51f34ee29bfb52721e3a824d59e69",
      "gas":"0x3d0900",
      "gasPrice":"0x4a817c800",
      "hash":"0x5973bea6f876344f04fe571f3fc8c13415ff8ca2bb92858ad9864955fece8d38",
      "input":"0x82ab890a0000000000000000000000000000000000000000000000000000000000002c0a",
      "nonce":"0x4f20",
      "to":"0xaca0cc3a6bf9552f2866ccc67801d4e6aa6a70f2",
      "transactionIndex":"0x0",
      "value":"0x0",
      "v":"0x1b",
      "r":"0x16d4490d54f566f6bc91fe1ebdf6680d12ca64ddac1ca1d3362f61f20916a790",
      "s":"0x4530a50f5d2b7244979b9909b406034dcee53c0f21b375eb5ac963e5f388c01f"
    },
    {  
      "blockHash":"0x8645f39ba3aec313c9d5ddd828275c8e0252653b2f57468642bc7986a55bc56d",
      "blockNumber":"0x6c6c3",
      "from":"0xfecf173d626acf0ca4d6b61a8b7bf6811d43fcfe",
      "gas":"0x2dc6c0",
      "gasPrice":"0x4a817c800",
      "hash":"0x22a48fb43fc9747218d99d8fa2346ed0a4a51657a00a51f9f665a9762ea6ff5e",
      "input":"0xd7f31eb90000000000000000000000000271300f2890360ae8989785d7a8ca986a92d4c9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000104d7f31eb90000000000000000000000002cc31912b2b0f3075a87b3640923d45a26cef3ee000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064d79d8e6c75506f727450726f66696c654950465331323230000000000000000000000000000000000000000000000000122bd1a75ae8c741f7e2ab0a28bd30b8dbb1a67e8ebacdb7c2039ea441445fb27612d6abda3a429d0e64d244295b4542990ad9760000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "nonce":"0x5",
      "to":"0xb525eace21bd1a7b6da3934ea3bb030d8e8f388c",
      "transactionIndex":"0x1",
      "value":"0x0",
      "v":"0x1b",
      "r":"0x95b3bbafa85890ac10cea75df22142ebbb5b703120ecbf177731190c7b59b8d5",
      "s":"0x1adad3ca3533592571cf93a86fe8691337d1b2b276f7d6bacb34a9724c354396"
    }
  ],
  "transactionsRoot":"0xbe473877467a837b676a7f94ef034e4e7daa733ed1152d0c8d399a193311076a",
  "uncles":[]
}

//no transactions => "transactionsRoot":"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
//1 transaction =>
// "transactionsRoot":"0x4269cc35ce441c0b7574c4c2028b5d69eeda801d3ecbb675c9924831a4a6fb24"

// "transactions":[{
//   "blockHash":"0x4bc1f712c62e2b799e4bce190535b914a46a57f9e321ebf4c7c4819afb66b091",
//   "blockNumber":"0x5af37",
//   "from":"0xec8d53b9a6498433a6d675623c564aa3257c128a",
//   "gas":"0x478de2",
//   "gasPrice":"0x4a817c800",
//   "hash":"0x34e7814f002c012112136d878e297a520a310dd51c249e5aac0715ec2165df7a",
//   "input":"0x7f6715c90000000000000000000000000000000000000000000000000000000000000003",
//   "nonce":"0x28e","to":"0xa6ae7c17bbbd41636381e76830f902872aaea9f9",
//   "transactionIndex":"0x0",
//   "value":"0x0",
//   "v":"0x1b",
//   "r":"0x582f163129f537fce70e1a500fee8f85e777185b6ee94010edaba870d80ad70d",
//   "s":"0x871ce3c40fd822b24f1e0f7827c374198bec8f91879d9a82c7246a4ebc265ce"}]

// another rinkeby block with only 1 tx below
// rawsignedtx = f86b01850df8475800825208941f4e7db8514ec4e99467a8d2ee3a63094a904e7a8727147114878000802ba0a3979536559de41c32fccfeadb067a270877e0db4a091dbd6b849fcfc2d83c66a0019fef106dece528ced299ad26da57061e72208ba081b5761faee20e8521375e
// txhash = "3020771151af5fbada08586a6f2d1be4cf0c59c6abbcd6891f796bdebe3c4c62"
// transactions = [{"blockHash":"0xf3c96c423b25316d7d46d8670bd45bebd5ebd3d9976183f43b32078024d10852","blockNumber":"0x6e001","from":"0x9bee04ec5cc9890dae29780421874b85b0a20c99","gas":"0x5208","gasPrice":"0xdf8475800","hash":"0x3020771151af5fbada08586a6f2d1be4cf0c59c6abbcd6891f796bdebe3c4c62","input":"0x","nonce":"0x1","to":"0x1f4e7db8514ec4e99467a8d2ee3a63094a904e7a","transactionIndex":"0x0","value":"0x27147114878000","v":"0x2b","r":"0xa3979536559de41c32fccfeadb067a270877e0db4a091dbd6b849fcfc2d83c66","s":"0x19fef106dece528ced299ad26da57061e72208ba081b5761faee20e8521375e"}]
// transactionsRoot:"0xec19e58128436bfc51933ba31b8a82e65fa742531e352015b6da81436426ad16"



blockHeader = (block)=>{
  return [
    stringToBuf(block.parentHash),
    stringToBuf(block.sha3Uncles),
    stringToBuf(block.miner),
    stringToBuf(block.stateRoot),
    stringToBuf(block.transactionsRoot),
    stringToBuf(block.receiptsRoot),
    stringToBuf(block.logsBloom),
    stringToBuf(block.difficulty),
    stringToBuf(block.number),
    stringToBuf(block.gasLimit),
    stringToBuf(block.gasUsed),
    stringToBuf(block.timestamp),
    stringToBuf(block.extraData),
    stringToBuf(block.mixHash),
    stringToBuf(block.nonce)
  ]
}

blockHash = (block)=>{
  return sha3(rlp.encode(blockHeader(block)))
}

transactionsRoot = (transactions)=>{
  // txsA = [];
  // txsB = [];
  // txsC = new Buffer('')
  // txsD = new Buffer('')
  // // txsE = []
  // // txsF = []
  // txsG = new Buffer('')
  // txsH = new Buffer('')


  for (var i = 0; i < transactions.length; i++) {
    trie.put(rlp.encode(i), , function (err, value) {

    }
    // txsA.push(stringToBuf(transactions[i].hash));
    // txsE.push(sha3(stringToBuf(transactions[i].hash)));
    // txsC = Buffer.concat([txsC, stringToBuf(stringToBuf(transactions[i].hash))]);
    // txsG = Buffer.concat([txsC, stringToBuf(sha3(stringToBuf(transactions[i].hash)))]);
  }
  // for (var i = transactions.length-1; i >= 0; i--) {
  //   // txsB.push(stringToBuf(transactions[i].hash));
  //   // txsF.push(sha3(stringToBuf(transactions[i].hash)));
  //   txsD = Buffer.concat([txsD, stringToBuf(stringToBuf(transactions[i].hash))]);
  //   txsH = Buffer.concat([txsD, stringToBuf(sha3(stringToBuf(transactions[i].hash)))]);
  // }

  all = [txsC, txsD, txsG, txsH]
  x = "0xbe473877467a837b676a7f94ef034e4e7daa733ed1152d0c8d399a193311076a".slice(2)

  for (var i = 0; i < all.length; i++) {
    console.log(i);
    // console.log("sha():                \t",sha3(all[i]), " ", x == sha3(all[i]));
    // console.log("sha(sha()):           \t",sha3(sha3(all[i])), " ", x == sha3(sha3(all[i])));
    // console.log("sha(sha(sha())):      \t",sha3(sha3(sha3(all[i]))), " ", x == sha3(sha3(sha3(all[i]))));

    // console.log("rlp(sha()):           \t",rlp.encode(sha3(all[i])), " ", x == rlp.encode(sha3(all[i])));
    // console.log("sha(rlp(sha())):      \t",sha3(rlp.encode(sha3(all[i]))), " ", x == sha3(rlp.encode(sha3(all[i]))));

    console.log("sha(rlp()):           \t",sha3(rlp.encode(all[i])), " ", x == sha3(rlp.encode(all[i])));
    // console.log("sha(sha(rlp())):      \t",sha3(sha3(rlp.encode(all[i]))), " ", x == sha3(sha3(rlp.encode(all[i]))));
    // console.log("sha(sha(sha(rlp()))): \t",sha3(sha3(sha3(rlp.encode(all[i])))), " ", x == sha3(sha3(sha3(rlp.encode(all[i])))));
  }

  // console.log(" : ", sha3(sha3(rlp.encode(transactionHashes))))
  // return sha3(sha3(transactionHashes))
}


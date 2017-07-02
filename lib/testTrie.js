rlp = require('rlp');
sha3 = require('js-sha3').keccak_256


Web3 = require('web3'),
Trie = require('merkle-patricia-tree'),
levelup = require('levelup'),
db = levelup('./testdb'),
trie = new Trie(db); 

// trie.put('test', 'one', function () {
//   trie.get('test', function (err, value) {
//     if(value) console.log(value.toString())
//   });
// }); 


// another rinkeby block with only 1 tx below
// transactions = [{"blockHash":"0xf3c96c423b25316d7d46d8670bd45bebd5ebd3d9976183f43b32078024d10852","blockNumber":"0x6e001","from":"0x9bee04ec5cc9890dae29780421874b85b0a20c99","gas":"0x5208","gasPrice":"0xdf8475800","hash":"0x3020771151af5fbada08586a6f2d1be4cf0c59c6abbcd6891f796bdebe3c4c62","input":"0x","nonce":"0x1","to":"0x1f4e7db8514ec4e99467a8d2ee3a63094a904e7a","transactionIndex":"0x0","value":"0x27147114878000","v":"0x2b","r":"0xa3979536559de41c32fccfeadb067a270877e0db4a091dbd6b849fcfc2d83c66","s":"0x19fef106dece528ced299ad26da57061e72208ba081b5761faee20e8521375e"}]
// transactionsRoot:"0xec19e58128436bfc51933ba31b8a82e65fa742531e352015b6da81436426ad16"

th = new Buffer("3020771151af5fbada08586a6f2d1be4cf0c59c6abbcd6891f796bdebe3c4c62", "hex")
t  = new Buffer("f86b01850df8475800825208941f4e7db8514ec4e99467a8d2ee3a63094a904e7a8727147114878000802ba0a3979536559de41c32fccfeadb067a270877e0db4a091dbd6b849fcfc2d83c66a0019fef106dece528ced299ad26da57061e72208ba081b5761faee20e8521375e", "hex")
// trie.put(th, t, function () {})
// trie.get(th, function (err, value) {console.log(err,value)})

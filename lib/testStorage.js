Trie = require('merkle-patricia-tree');
rlp = require('rlp');
levelup = require('levelup');
db = levelup('/Users/zacharymitton/Library/Ethereum/geth/chaindata');
sha3 = require('js-sha3').keccak_256

leftPad = (str) => {
  return ("0000000000000000000000000000000000000000000000000000000000000000"+str).substring(str.length)
}

var stateRoot = new Buffer('ec1bbf0d28213ca28daf0e67f050c8bebbd37520880a25fc6464063739984d83', 'hex')
trie = new Trie(db, stateRoot);

getStorage = (address, position) => {
  var path = new Buffer(sha3(new Buffer(address,'hex')),'hex')
    console.log(address)
    console.log(path)

  trie.findPath(path, (e,accountNode,r,stack) => {
    thing = rlp.decode(accountNode.value)
    console.log(thing)
    // console.log(e,accountNode.value())
    // console.log(e,rlp.decode(accountNode[1]))
    // account = rlp.decode(accountNode)
    // strgRoot = account[2]
    // strgTrie = new Trie(db, strgRoot);

    // strgTrie.get(path, (e,r)=>{
    //   pos = rlp.decode(r)
    //   console.log(e,pos)
    // })
  })
}





// path = Buffer.from(sha3(Buffer.concat([Buffer.from(XXzeros + '1f4e7db8514ec4e99467a8d2ee3a63094a904e7a','hex'),Buffer.from(LXzeros + '0001','hex')])),'hex')

// proxy contract at:
// getStorage('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4') //=>
// [ <Buffer 20 29 0d ec d9 54 8b 62 a8 d6 03 45 a9 88 38 6f c8 4b a6 bc 95 48 40 08 f6 36 2f 93 16 0e f3 e5 63>,
//   <Buffer 94 10 fb c3 06 e8 4e e5 30 85 60 98 cc 49 02 16 bd 5e 9f a5 2e> ]



path0 = new Buffer(sha3(new Buffer(leftPad('0000'),'hex')),'hex')
pos = Buffer.from(leftPad('0001'),'hex')
key = Buffer.from(leftPad('1f4e7db8514ec4e99467a8d2ee3a63094a904e7a'),'hex')
concat = Buffer.concat([key, pos])
path = Buffer.from(sha3(concat),'hex')
sha3Path = Buffer.from(sha3(path),'hex')
//storage contract at:
getStorage('9cc9bf39a84998089050a90087e597c26758685d', path0) 
// getStorage('9cc9bf39a84998089050a90087e597c26758685d', sha3Path) 
// contract Storage {
//     uint pos0;
//     mapping(address => uint) pos1;
//     function Storage() {
//         pos0 = 1234;
//         pos1[0x1f4e7db8514ec4e99467a8d2ee3a63094a904e7a] = 5678;
//     }
// }










// get = function(remainingAddressString, nodeKey){
//   if(typeof nodeKey == 'undefined'){
//     nodeKey = new Buffer('5b2681d1595542e199877a07fecb6194a1f5a95fc5a9a23924746e305c3ac6e2', 'hex')
//     remainingAddressString = sha3(new Buffer(remainingAddressString, 'hex'))
//   }
//   console.log("\n\nREMAINING_ADDRESS_STRING:", remainingAddressString)
//   index       = parseInt(remainingAddressString.slice(0,1), 16);
//   remainingAddressString = remainingAddressString.slice(1);


//   db.get(nodeKey, {encoding: 'binary'}, function (err, value) {

//     var val = rlp.decode(value);
//     console.log("NEXT_INDEX:              ", index);
//     console.log("NODE_KEY:                ", sha3(value));
//     console.log("NODE_VALUE:\n", value.toString('hex'));
//     console.log("SHA3_NODE_VALUE:\n", sha3(value));
//     console.log("SHA3_DECODED_NODE_VALUE:\n", sha3(val));
//     console.log("DECODED_NODE_VALUE:\n", val);
//     // console.log("LENGTH:   \n", val.length);
    
//     //branch node
//     if(val.length == 17){
//       if(val[index].length == 32){ //hash for next lookup
//         get(remainingAddressString, val[index])
//       }else{                       //data itself
//         console.log("HERE!")
//         // console.log("INDEX_LENGTH:\n",val[index].length)
//         // console.log("VAL[INDEX]:\n",val[index])
//         // console.log("LEFTOVER_INDEX:\n", remainingAddressString);
//         // console.log("DECODED:\n", val);

//       }
//     }else{
//       // console.log("DECODED:         \n", val);
//       // console.log("LEFTOVER_INDEX:  \n", remainingAddressString);
//       console.log("LEFTOVER_KEY:    \n", val[0]);
//       console.log("LEFTOVER_KEY_LENGTH:\n", val[0].length)
//       // console.log("LEFTOVER_KEY_length:    \n", val[0].length);
//       // console.log("LENGTH:        \n", val[1].length);
//       var account = rlp.decode(val[1])
//       console.log("ACCOUNT_LENGTH: \n", account.length);
//       console.log("ACCOUNT: \n", account, "\n\n");
//       console.log("NONCE:          \n", parseInt(account[0].toString('hex'), 16));
//       console.log("BALANCE:        \n", parseInt(account[1].toString('hex'), 16));
//       console.log("STORAGE_ROOTQ:   \n", account[2]);

//         db.get(account[2], {encoding: 'binary'}, function (err, value) {
//           storage = rlp.decode(value)
//           p = storage[0].slice(1)
//           v = rlp.decode(storage[1])
//           console.log("STORAGE_level1:   \n", err, rlp.decode(value));
// // <Buffer 20 290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563>
//         })

//       console.log("CODE_HASH:      \n", account[3]);
//       if(account[3].toString() != new Buffer(sha3(''), 'hex').toString()){
//         console.log("CONTRACT!!!", account[3])
//       }
//       return account;
//     }

//   });
// }






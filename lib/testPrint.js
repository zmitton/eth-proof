// Trie = require('merkle-patricia-tree');
rlp = require('./rlp');
levelup = require('levelup');
db = levelup('/Users/zacharymitton/Library/Ethereum/geth/chaindata');
sha3 = require('js-sha3').keccak_256

get = function(remainingAddressString, nodeKey){
  if(typeof nodeKey == 'undefined'){
    nodeKey = new Buffer('e441e01f1db98d535445b71f9799cdbed6655c316d5c5718ab0313d554cc5d37', 'hex')
    remainingAddressString = sha3(new Buffer(remainingAddressString, 'hex'))
  }
  console.log("\n\nREMAINING_ADDRESS_STRING:", remainingAddressString)
  index       = parseInt(remainingAddressString.slice(0,1), 16);
  remainingAddressString = remainingAddressString.slice(1);


  db.get(nodeKey, {encoding: 'binary'}, function (err, value) {

    var val = rlp.decode(value);
    console.log("NEXT_INDEX:              ", index);
    console.log("NODE_KEY:                ", sha3(value));
    console.log("NODE_VALUE:\n", value.toString('hex'));
    console.log("SHA3_NODE_VALUE:\n", sha3(value));
    console.log("SHA3_DECODED_NODE_VALUE:\n", sha3(val));
    console.log("DECODED_NODE_VALUE:\n", val);
    // console.log("LENGTH:   \n", val.length);
    
    //branch node
    if(val.length == 17){
      if(val[index].length == 32){ //hash for next lookup
        get(remainingAddressString, val[index])
      }else{                       //data itself
        console.log("HERE!")
        // console.log("INDEX_LENGTH:\n",val[index].length)
        // console.log("VAL[INDEX]:\n",val[index])
        // console.log("LEFTOVER_INDEX:\n", remainingAddressString);
        // console.log("DECODED:\n", val);

      }
    }else{
      // console.log("DECODED:         \n", val);
      // console.log("LEFTOVER_INDEX:  \n", remainingAddressString);
      console.log("LEFTOVER_KEY:    \n", val[0]);
      console.log("LEFTOVER_KEY_LENGTH:\n", val[0].length)
      // console.log("LEFTOVER_KEY_length:    \n", val[0].length);
      // console.log("LENGTH:        \n", val[1].length);
      var account = rlp.decode(val[1])
      console.log("ACCOUNT_LENGTH: \n", account.length);
      console.log("ACCOUNT: \n", account, "\n\n");
      console.log("NONCE:          \n", parseInt(account[0].toString('hex'), 16));
      console.log("BALANCE:        \n", parseInt(account[1].toString('hex'), 16));
      console.log("STORAGE_ROOT:   \n", account[2]);
      console.log("CODE_HASH:      \n", account[3]);
      if(account[3].toString() != new Buffer(sha3(''), 'hex').toString()){
        console.log("CONTRACT!!!", account[3])
      }
      return account;
    }

  });
}

// get('1f4e7db851')
// get('1f4e7db8514ec4e99467a8d2ee3a63094a904e7a')
// get('d64c56ac1cef800904f448db8e96b8b36b7d96f7')
// get('8aa1aa593e63e9acf36ec341bdac61b9566c5f32')
// get('82ab1649f370ccf9f2a5006130c4fca28db2587e')
// get('bcdfbc152580593e9643318c32129d624025ab59')
// get('36eaf0157ebe256088a779c12e96a3dc6f53426c')
// get('dffd772b61fae4343f142feba0fa58868dbda85c')
get('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4')
// get('10fbc306e84ee530856098cc490216bd5e9fa52e')
// z = get('fd1cbcef65be25eb835e73808228ef6f8925d089')
// get('0', new Buffer('1f0be27327dc23294bc4cc6c8f9ad6a92566ff4a1f57996607a8f8376787087a', 'hex'))
// how to get an account var: sha3(new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
// db.get(new Buffer('1f0be27327dc23294bc4cc6c8f9ad6a92566ff4a1f57996607a8f8376787087a', 'hex'), {encoding: 'binary'}, function (err, value) {
// db.get(new Buffer('0788df3e4ac8c89fd0663a3133f624982b9e33e71a7edfd1e978183ce7822600', 'hex'), {encoding: 'binary'}, function (err, value) {
//   console.log('value', value);
//   console.log('value', rlp.decode(value));
// })
// db.get(new Buffer(mroot, 'hex'), {
//   encoding: 'binary'
// }, function (err, value) {
//   console.log("DECODED:  \n", val);
//   console.log("LENGTH:   \n", rlp.decode(value).length);
//   console.log("VAL_AT_0: \n", rlp.decode(value)[0]);
//   db.get(rlp.decode(value)[0], {
//     encoding: 'binary'
//   }, function (err, value) {
//     console.log("DECODED:  \n", rlp.decode(value));
//   });
// });

// trie = new Trie(db,  new Buffer('e441e01f1db98d535445b71f9799cdbed6655c316d5c5718ab0313d554cc5d37', 'hex'));


// gav = sha3(new Buffer('1f4e7db8514ec4e99467a8d2ee3a63094a904e7a', 'hex'));
// // console.log(gav)
// trie.get(gav, function (err, val) {
//   console.log("VAL:    \t", val);
//   // decoded = rlp.decode(val);
//   // console.log("DECODED:\t", decoded);
//   // console.log("LENGTH: \t", decoded.length);
// });

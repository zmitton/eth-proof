rlp     = require('rlp');
db      = require('levelup')('/Users/zacharymitton/Library/Ethereum/geth/chaindata');
sha3    = require('js-sha3').keccak_256

stateRoot = new Buffer('e441e01f1db98d535445b71f9799cdbed6655c316d5c5718ab0313d554cc5d37', 'hex')

addressToPath = function(address){
  var sha3Address = sha3(new Buffer(address, 'hex'));
  return hashToPath(sha3Address)
}

hashToPath = function(sha3Address){
  var hexArray  = sha3Address.split('');
  var decArray = [];
  for (var i = 0; i < hexArray.length; i++) {
    decArray[i] = parseInt(hexArray[i],16);
  }
  return decArray;
}

getAccount = function(address, cb){
  traverse(addressToPath(address), stateRoot, cb);
}

getContractStorage = function(address, cb){
  getAccount(address, getContractStorageFromAccount)
}
getContractStorageFromAccount = function(encodedAccount, cb){
  console.log("GETTING CONTRACT STORAGE");
  // traverse(hashToPath(storageRoot),)
  var account = rlp.decode(encodedAccount)
  var storageRoot = account[2]
   db.get(storageRoot, {encoding: 'binary'}, function (err, value) {
    console.log("VALUE--: ", value)
    console.log(rlp.decode(value))
   })
}
printStorage = function(encodedAccount){}
printRaw = function(data){ console.log("DATA: ", data) }
printAccount = function(encodedAccount){
  console.log("ENCODED_ACCOUNT: ", encodedAccount)
  var account = rlp.decode(encodedAccount)
  if(account[3].toString() != new Buffer(sha3(''), 'hex').toString()){
    console.log("CONTRACT:")
  }else{
    console.log("REGULAR_ACCOUNT:")
    console.log("NONCE:          \n", parseInt(account[0].toString('hex'), 16));
  }
  console.log("BALANCE:        \n", parseInt(account[1].toString('hex'), 16));
  console.log("STORAGE_ROOT:   \n", account[2]);
  console.log("CODE_HASH:      \n", account[3]);
}

traverse = function(path, root, cb){

  db.get(root, {encoding: 'binary'}, function (err, value) {

    var val = rlp.decode(value);
    
    // node types: blank, leaf, extension, and branch
    if(val.length == 17){
      var targetIndex = path.shift()
      if(val[targetIndex].length == 32){       //branch node
        traverse(path, val[targetIndex], cb)
      }else if(val[targetIndex].length == 0){  //blank  node
        console.log("BLANK NODE")
      }else{
        console.log("ERROR 1")
      }
    }else if(val.length == 2){
      // console.log("NODE: ", val)
      if(terminates(val)){
          cb(val[1]);
      }else{
        console.log("FAST_FORWARD") //untested
        path = fastForward(path)
        var targetIndex = path.shift()
        traverse(path, val[targetIndex], cb)
      }
    }else{
      console.log("ERROR 2")
    }

  });
}
var terminates = function(){
  return true; //starts with 20 or 3
}

var fastForward = function(path){
  return path;
}
var address = '1f4e7db8514ec4e99467a8d2ee3a63094a904e7a';

// getAccount(address, printAccount)



Trie = require('merkle-patricia-tree');
trie = new Trie(db,  stateRoot);

// address = sha3(new Buffer(address, 'hex'));
trie.get(address, function (err, val) {
  console.log("VAL:    \t", val);
  console.log("ERR:    \t", err);
  // decoded = rlp.decode(val);
  // console.log("DECODED:\t", decoded);
  // console.log("LENGTH: \t", decoded.length);
});

// getAccount('d64c56ac1cef800904f448db8e96b8b36b7d96f7', printAccount)
// getAccount('8aa1aa593e63e9acf36ec341bdac61b9566c5f32', printAccount)
// getAccount('bcdfbc152580593e9643318c32129d624025ab59', printAccount)
// getAccount('36eaf0157ebe256088a779c12e96a3dc6f53426c', printAccount)
// getAccount('dffd772b61fae4343f142feba0fa58868dbda85c', printAccount)
// getAccount('10fbc306e84ee530856098cc490216bd5e9fa52e', printAccount)
// getAccount('fd1cbcef65be25eb835e73808228ef6f8925d089', printAccount)
// getAccount('82ab1649f370ccf9f2a5006130c4fca28db2587e', printAccount)
// getAccount('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4', printAccount)
// getContractStorage('10fbc306e84ee530856098cc490216bd5e9fa52e', printStorage)
// console.log(sha3(new Buffer('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4', 'hex')))
// console.log(sha3(new Buffer('1f4e7db8514ec4e99467a8d2ee3a63094a904e7a', 'hex')))
// console.log(sha3(new Buffer('145002de55f7b8bcdc864369350e3524536f3e85', 'hex')))
// console.log(sha3(new Buffer('0000000000000000000000000000000000000000', 'hex')))
// console.log(sha3(new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex')))



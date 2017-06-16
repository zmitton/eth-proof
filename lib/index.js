rlp = require('./rlp');
sha3 = require('js-sha3').keccak_256
db = require('levelup')('/Users/zacharymitton/Library/Ethereum/geth/chaindata');

get = function(remainingAddressString, nodeKey){
  if(typeof nodeKey == 'undefined'){
    nodeKey = new Buffer('d203032ed354066261610cb65b86447feac53d3f0dae5a8e486597d6f03d8c9d', 'hex')
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

const Account = function(address, keyNode){
  this.address = address
  this.key = ()=>{return sha3(new Buffer(this.address, 'hex'))}
  // this.constructor = (input)=>{this.extra = input}
  // this.constructor(input);
  // console.log("sdkfjhdkljfh");
}
const Account.prototype.get = function(address, keyNode){

}


module.exports = Account


// get('1f4e7db8514ec4e99467a8d2ee3a63094a904e7a')
// get('d64c56ac1cef800904f448db8e96b8b36b7d96f7')
// get('dffd772b61fae4343f142feba0fa58868dbda85c')
get('2a956e2fdcf3e338d0e925c68bcb73e7c8bb86c4')
// get('10fbc306e84ee530856098cc490216bd5e9fa52e')

/*

cb0dbbedb5ec5363e39be9fc43f56f321e1572cfcf304d26fc67cb6ea2e49fafbdf8c9bdf076d6aff0292a1c9448691d2ae283f2ce41b045355e2c8cb8e85ef2

bdf8c9bdf076d6aff0292a1c9448691d2ae283f2ce41b045355e2c8cb8e85ef2cb0dbbedb5ec5363e39be9fc43f56f321e1572cfcf304d26fc67cb6ea2e49faf




*/




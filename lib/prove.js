// design decisions
// main API should prove against a blockhash
// including *some* repetitive data. each array to be hashed will already include the
// hash from the previous step (in it). This will eliminate the need to inject the 
// previous hash into the array, and shift all the elements

// for solidity, should we send rlpObjects or arrays. former must be decoded, latter
// must be encoded. I think encoding is easier

// library has 2 main functions.
//   1- generating a proof (requires blockchain data)
//   2- checking a proof against a blockhash

// it should probably extend web3 methods to return a proof instead of just the data



[
  [
    account, //address
    stateRoot
  ],
  [

    [
      leftoverkey,

    ]
  ]
]


tx = {

}


//true if tx was included in txsRoot
Proove.header = (prf, blockHash) =>{
  return sha3(prf.header) == blockHash;
}

Proove.txsRoot = (prf, blockHash) =>{
  if(Proove.header(prf, blockHash)){
    if(prf.header[4] == prf.txsRoot){
      return true;
    }
  }
  return false;
}

Proove.tx = (prf, blockHash) =>{
  if(Proove.header(prf, blockHash)){
    if(Proove.txsRoot(prf, blockhash)){
      if(rlp(prf.tx) == prf.trieNodes[0]){
        try{
          var ptr;
          //txTrieNode is an array (not encoded)
          for(var i = 0 ; i < prf.trieNodes ; i++){
            if(prf.trieNodes[i].length == 17){
            sha3(rlp(prf.trieNodes[i]))

            }else if(prf.trieNodes[i].length == 2){
              Proove.consumeHexSequence(ptr, prf.hexSequence)

            }else{ return false } //malformed trie
          }
        }catch(e){
          console.log(e);
          return false
        }
        return true

      }

    }
  }
  return false;
}

Proove.consumeHexSequence = (ptr, hexSequence) =>{

}


Proove.tx = (prf, blockHash) =>{
  if(prf.header.[prf.tx.i] sha3(prf.tx))
  return sha3(header) == blockHash;
}

proveTransaction = (prf, blockHash) => {
  proveHeader(prf.header blockHash)
  


  return true
}
proveHeader = (blockHeader blockHash) => {
  blockHeader.txsRoot
}


proveAccount = (proof, stateRoot) => {
  return true
}
proveNonce = (proof, account) => {
  return true
}
proveBalance = (proof, account) => {
  return true
}
proveEVMCode = (proof, account) => {
  return true
}


prove = (proof, root) => {

}
proveStorage = (proof, storageRoot) => {
  return true
}


// proveRLP = (RLPproof, root) => {
//   return true
// }

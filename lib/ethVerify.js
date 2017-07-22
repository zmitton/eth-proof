sha3 = require('js-sha3').keccak_256
rlp = require('rlp');

// for solidity, should we send rlpObjects or arrays. former must be decoded, latter
// must be encoded. I think encoding is easier

// use a try catch for strictness (wont work for evm implementation tho)


// it should probably extend web3 methods to return a proof instead of just the data


// The EV public API checks proofs against a specified blockHash.
// Establishing trust of a blockHash is a separate issue. It relies on trust
// of a chain, which should ultimately rely on a set of heuristics involving
// expected total work at the current moment in time

// EVENTUAL BLOCKER
// state proofs: construction of stateProofs will require direct access to the
// leveldb database, because we cannot reconstruct the entire trie from RPC calls
// like we can with both the transactions trie and the receipts trie. Its simply 
// too big (>20GB). 
// solutions:
// 1 Run our own servers which allow access to these levelDB functions
// (or ask infura to run them, but we should define/build them)
// 2 Eventually modify geth/parity and expand the standard RPC to returns data with 
// its proof. name the methods after standard RPC methods with maybe the word 
// `proof` concatenated on them, and have them take 1 extra `blockHash` param.



EV = () => {}
// public methods all prove commitment to a blockHash
// all args must be Buffers
//to do: they should all only take one proofNodes array merge header into parentNodes 

EV.header = (header, blockHash) => {
  try{
    return new Buffer(sha3(rlp.encode(header)),'hex').equals(blockHash);
  }catch(e){ console.log(e) }
  return false
}

EV.headerValue = (index, value, header, blockHash) => {
  try{
    if(header[index].equals(value)){
      return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
    }
  }catch(e){ console.log(e) }
  return false
}

EV.accountNonce = (address, nonce, parentNodes, header, blockHash) => {
  return EV._accountElement(0, address, nonce, parentNodes, header, blockHash)
}
EV.balance = (address, balance, parentNodes, header, blockHash) => {
  return EV._accountElement(1, address, balance, parentNodes, header, blockHash)
}
EV.storageRoot = (address, storageRoot, parentNodes, header, blockHash) => {
  return EV._accountElement(2, address, storageRoot, parentNodes, header, blockHash)
}
EV.codeHash = (address, codeHash, parentNodes, header, blockHash) => {
  return EV._accountElement(3, address, codeHash, parentNodes, header, blockHash)
}
EV.code = (address, code, parentNodes, header, blockHash) => {
  try{
    var account = EV.valueFrom(parentNodes)
    if(Buffer.from(sha3(code),'hex').equals(account[3])){
      return EV.codeHash(address, account[3], parentNodes, header, blockHash)
    }
  }catch(e){ console.log(e) }
  return false
}

//to do: this should only take one ParentNodes array. merge the 2
EV.storage = (storageIndex, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
  try{
    var account = EV.valueFrom(accountParentNodes)
    if(EV.storageRoot(address, account[2], accountParentNodes, header, blockHash)){
      if(EV.account(address, account, accountParentNodes, header, blockHash)){

        return EV.trieValue(path, value, parentNodes, trieRoot)
      }
    }
  }catch(e){ console.log(e) }
  return false
}



EV._accountElement = (accountIndex, address, targetValue, parentNodes, header, blockHash) => {
  try{
    var account = EV.valueFrom(parentNodes) // decoded last last
    if(EV.account(address, account, parentNodes, header, blockHash)){
      return account[accountIndex].equals(targetValue)
    }
  }catch(e){ console.log(e) }
  return false
}

// EV.storage = () => {/* to do */}
EV.log = () => {/* to do */}
EV.logBloom = () => {/* probably dont care. Arent these just for fast lookups? */}


// account can be a contract or 
EV.account = (address, account, parentNodes, header, blockHash) => {
  var sha3OfAddress = Buffer.from(sha3(address),'hex')
  return EV._valueInTrieIndex(3, sha3OfAddress, account, parentNodes, header, blockHash)
}
EV.transaction = (path, tx, parentNodes, header, blockHash) => {
  return EV._valueInTrieIndex(4, path, tx, parentNodes, header, blockHash)
}
EV.receipt = (path, receipt, parentNodes, header, blockHash) => {
  return EV._valueInTrieIndex(5, path, receipt, parentNodes, header, blockHash)
}
EV._valueInTrieIndex = (trieIndex, path, value, parentNodes, header, blockHash) => {
  try{
    var trieRoot = EV.rootFrom(parentNodes)
    if(EV.headerValue(trieIndex, trieRoot, header, blockHash)){
      // console.log("THERE",path, value, parentNodes, trieRoot)
      return EV.trieValue(path, value, parentNodes, trieRoot)
    }
  }catch(e){ console.log(e) }
  return false;
}


// proves commitment to its root only (not a blockHash). I should almost make this 
// private although its very fundamental so i wont.
EV.trieValue = (path, value, parentNodes, root) => {
  try{
    var currentNode;
    var len = parentNodes.length;
    var rlpTxFromPrf = parentNodes[len - 1][parentNodes[len - 1].length - 1];
    var nodeKey = root;
    var pathPtr = 0;

    path = path.toString('hex')

    for (var i = 0 ; i < len ; i++) {
      currentNode = parentNodes[i];
      if(!nodeKey.equals( new Buffer(sha3(rlp.encode(currentNode)),'hex'))){
        console.log("nodeKey != sha3(rlp.encode(currentNode)): ", nodeKey, new Buffer(sha3(rlp.encode(currentNode)),'hex'))
        return false;
      }
      if(pathPtr > path.length){
        console.log("pathPtr >= path.length ", pathPtr,  path.length)
        return false
      }

      switch(currentNode.length){
        case 17://branch node
          if(pathPtr == path.length){
            if(currentNode[16] == rlp.encode(value)){
              return true;
            }else{
              console.log('currentNode[16],rlp.encode(value): ', currentNode[16], rlp.encode(value))
              return false
            }
          }
          nodeKey = currentNode[parseInt(path[pathPtr],16)] //must == sha3(rlp.encode(currentNode[path[pathptr]]))
          pathPtr += 1
          // console.log(nodeKey, pathPtr, path[pathPtr])
          break;
        case 2:
          // console.log(currentNode[0].toString('hex'), path, pathPtr)
          pathPtr += EV.nibblesToTraverse(currentNode[0].toString('hex'), path, pathPtr)
          if(pathPtr == path.length){//leaf node
            if(currentNode[1].equals(rlp.encode(value))){
              return true
            }else{
              console.log("currentNode[1] == rlp.encode(value) ", currentNode[1], rlp.encode(value))
              return false
            }
          }else{//extension node
            nodeKey = currentNode[1]
          }
          break;
        default:
          console.log("all nodes must be length 17 or 2");
          return false
      }
    }
  }catch(e){ console.log(e); return false }
  return false
}


EV.nibblesToTraverse = (encodedPartialPath, path, pathPtr) => { 
  if(encodedPartialPath[0] == 0 || encodedPartialPath[0] == 2){
    var partialPath = encodedPartialPath.slice(2)
  }else{
    var partialPath = encodedPartialPath.slice(1)
  }

  if(partialPath == path.slice(pathPtr, pathPtr + partialPath.length)){
    return partialPath.length
  }else{
    throw new Error("path was wrong")
  }
}

EV.valueFrom = (parentNodes) => {
  // last last item decoded
  return rlp.decode(parentNodes[parentNodes.length - 1][parentNodes[parentNodes.length - 1].length - 1])
}
EV.rootFrom = (parentNodes) => {
  return Buffer.from(sha3(rlp.encode(parentNodes[0])),'hex')
}

module.exports = EV




// EV.HeadIndex = {
//   parenthash: 0,
//   sha3Uncles: 1,
//   miner: 2,
//   stateRoot: 3,
//   transactionsRoot: 4,
//   receiptsRoot: 5,
//   logsBloom: 6,
//   difficulty: 7,
//   blockNumber: 8,
//   gasLimit: 9,
//   gasUsed: 10,
//   timeStamp: 11,
//   extraData: 12,
//   mixHash: 13,
//   nonce: 14
// }

// EV._txsRoot = (txsRoot, header) => {
//   try{
//     if(txsRoot.equals(header[4])){
//       return true;  
//     }
//   }catch(e){ console.log(e) }
//   return false
// }


// EV._tx = (path, tx, parentNodes, txRoot) => {
//   try{
//     return EV.trieValue(path, tx, parentNodes, txRoot)
//   }catch(e){ return false }
// }


// path = "abcdef0123456789"
// pathPtr = 2
// partialPath = "cde"
// moveRight = (str, numSpaces = 1) => {
//   if(numSpaces > str.length){ numSpaces = str.length}
//   return str.slice(0,str.length - numSpaces)
// }
// moveLeft = (str, numSpaces = 1) => {
//   if(numSpaces > str.length){ numSpaces = str.length}
//   return str.slice(0 + numSpaces, str.length)
// }
// proveRLP = (RLPproof, root) => {
//   return true
// }
// rotateRight = (str, numSpaces = 1) => {
//   numSpaces %= str.length
//   return str.slice(str.length - numSpaces, str.length) + str.slice(0,str.length - numSpaces)
// }
// rotateLeft = (str, numSpaces = 1) => {
//   numSpaces %= str.length
//   return rotateRight (str, str.length - numSpaces)
// }
// nodeTypeOf = (node) => {
//   // if(partialPath > path){ return false }
//   if(node.length == 17){ return 'branch'}
//   if(node.length == 2){
//     if(node.raw[0])
//   }
//   if(partialPath == path.slice(path.length - partialPath.length)){
//     return partialPath - length
//   }
//   throw new Error("path was wrong")
// }

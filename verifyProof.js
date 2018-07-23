const sha3 = require('js-sha3').keccak_256
const rlp = require('rlp');

// public methods all prove commitment to a blockHash
// all args currently expect Buffers
//to do: they should all only take one proofNodes array merge header into parentNodes 
VerifyProof = () => {}
VerifyProof.header = (header, blockHash) => {
  try{
    return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
  }catch(e){ console.log(e) }
  return false
}
VerifyProof.headerElement = (index, value, header, blockHash) => {
  try{
    if(value.equals(header[index])){
      return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
    }
  }catch(e){ console.log(e) }
  return false
}

VerifyProof.accountNonce = (address, nonce, parentNodes, header, blockHash) => {
  return VerifyProof._accountElement(0, address, nonce, parentNodes, header, blockHash)
}
VerifyProof.balance = (address, balance, parentNodes, header, blockHash) => {
  return VerifyProof._accountElement(1, address, balance, parentNodes, header, blockHash)
}
VerifyProof.storageRoot = (address, storageRoot, parentNodes, header, blockHash) => {
  return VerifyProof._accountElement(2, address, storageRoot, parentNodes, header, blockHash)
}
VerifyProof.codeHash = (address, codeHash, parentNodes, header, blockHash) => {
  return VerifyProof._accountElement(3, address, codeHash, parentNodes, header, blockHash)
}
VerifyProof.code = (address, code, parentNodes, header, blockHash) => {
  try{
    var account = valueFrom(parentNodes)
    if(Buffer.from(sha3(code),'hex').equals(account[3])){
      return VerifyProof.codeHash(address, account[3], parentNodes, header, blockHash)
    }
  }catch(e){ console.log(e) }
  return false
}
VerifyProof._accountElement = (accountIndex, address, targetValue, parentNodes, header, blockHash) => {
  try{
    var account = valueFrom(parentNodes) // decoded last last
    if(VerifyProof.account(address, account, parentNodes, header, blockHash)){
      return account[accountIndex].equals(targetValue)
    }
  }catch(e){ console.log(e) }
  return false
}
VerifyProof.storageAtIndex = (storageIndex, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
  try{
    var storagePath = Buffer.from(sha3(Buffer.from(leftPad(storageIndex.toString('hex')),'hex')),'hex')
    return VerifyProof.storage(storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash)
  }catch(e){ console.log(e) }
  return false
}

// untested for multi dimensional mappings
VerifyProof.storageMapping = (storageIndex, mappings, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
  try{
    var pathBuilder = Buffer.from(leftPad(storageIndex.toString('hex')),'hex')
    
    for(var i = 0 ; i < mappings.length ; i++){
      pathBuilder = Buffer.concat([Buffer.from(leftPad(mappings[i].toString('hex')),'hex'), pathBuilder])
    }
    pathBuilder = Buffer.from(sha3(pathBuilder),'hex')

    var storagePath = Buffer.from(sha3(pathBuilder),'hex')
    return VerifyProof.storage(storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash)
  }catch(e){ console.log(e) }
  return false
}

VerifyProof.storage = (storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
  try{
    var storageTrieRoot = valueFrom(accountParentNodes)[2]
    if(VerifyProof.storageRoot(address, storageTrieRoot, accountParentNodes, header, blockHash)){
      //account is already proven during `storageRoot`

      return VerifyProof.trieValue(storagePath, storageValue, storageParentNodes, storageTrieRoot)
    }
  }catch(e){ console.log(e) }
  return false
}

// VerifyProof.logBloom = () => {/* probably dont care. Arent these just for fast lookups? */}
// VerifyProof.postTransactionState = () => { }
// VerifyProof.cummulativeGas = () => { }
VerifyProof.log = (logIndex, txPath, log, parentNodes, header, blockHash) => {
  try{
    var receipt = valueFrom(parentNodes)
    if(VerifyProof.receipt(txPath, receipt, parentNodes, header, blockHash)){
      if(receipt[3][logIndex][0].equals(log[0]) && receipt[3][logIndex][2].equals(log[2])){
        return receipt[3][logIndex][1].every((elem, i)=>{
          return elem.equals(log[1][i])
        })
      }
    }
  }catch(e){ console.log(e) }
}
// VerifyProof._receiptElement = (receiptIndex, path, targetValue, parentNodes, header, blockHash) => {
// }


// account can be a contract 
VerifyProof.account = (address, account, parentNodes, header, blockHash) => {
  var sha3OfAddress = Buffer.from(sha3(address),'hex')
  return VerifyProof._valueInTrieIndex(3, sha3OfAddress, account, parentNodes, header, blockHash)
}
VerifyProof.transaction = (path, tx, parentNodes, header, blockHash) => {
  return VerifyProof._valueInTrieIndex(4, path, tx, parentNodes, header, blockHash)
}
VerifyProof.receipt = (path, receipt, parentNodes, header, blockHash) => {
  return VerifyProof._valueInTrieIndex(5, path, receipt, parentNodes, header, blockHash)
}
VerifyProof._valueInTrieIndex = (trieIndex, path, value, parentNodes, header, blockHash) => {
  try{
    var trieRoot = header[trieIndex]
    if(VerifyProof.headerElement(trieIndex, trieRoot, header, blockHash)){
      return VerifyProof.trieValue(path, value, parentNodes, trieRoot)
    }
  }catch(e){ console.log(e) }
  return false;
}

// proves commitment to its root only (not a blockHash). I should almost make this 
// private although its very fundamental so i wont. 
VerifyProof.trieValue = (path, value, parentNodes, root) => {
  try{
    var currentNode;
    var len = parentNodes.length;
    var rlpTxFromPrf = parentNodes[len - 1][parentNodes[len - 1].length - 1];
    var nodeKey = root;
    var pathPtr = 0;

    path = path.toString('hex')

    console.log("PATH = 0x" + path);

    for (var i = 0 ; i < len ; i++) {
      currentNode = parentNodes[i];
      console.log("RLP ENCODED NODE = 0x" + rlp.encode(currentNode).toString('hex'));
      console.log("HASHED NODE = 0x" + sha3(rlp.encode(currentNode)).toString('hex'));
      if(!nodeKey.equals( Buffer.from(sha3(rlp.encode(currentNode)),'hex'))){
        console.log("nodeKey != sha3(rlp.encode(currentNode)): ", nodeKey, Buffer.from(sha3(rlp.encode(currentNode)),'hex'))
        return false;
      }
      if(pathPtr > path.length){
        console.log("pathPtr >= path.length ", pathPtr,  path.length)
        return false
      }

      switch(currentNode.length){
        case 17://branch node
        console.log("BRANCH NODE WITH PATHPTR = " + pathPtr.toString());
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
          pathPtr += nibblesToTraverse(currentNode[0].toString('hex'), path, pathPtr)
          console.log("EXTENSION NODE WITH PATHPTR = " + pathPtr.toString());
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


var nibblesToTraverse = (encodedPartialPath, path, pathPtr) => { 
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
var valueFrom = (parentNodes) => { // last last item decoded
  return rlp.decode(parentNodes[parentNodes.length - 1][parentNodes[parentNodes.length - 1].length - 1])
}

var leftPad = (str) => {
  return ("0000000000000000000000000000000000000000000000000000000000000000"+str).substring(str.length)
}

module.exports = VerifyProof

const Trie = require('merkle-patricia-tree')
const sha3 = require('js-sha3').keccak_256
const rlp = require('rlp');

// public methods all prove commitment to a blockHash
// all args currently expect Buffers
//to do: they should all only take one proofNodes array merge header into branch 
VerifyProof = () => {}
VerifyProof.verifyHeader = (header, blockHash) => {
  try{
    return Buffer.from(sha3(header),'hex').equals(blockHash);
    // return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
  }catch(e){ console.log(e) }
  return false
}
VerifyProof.verifyHeaderElement = (index, value, header, blockHash) => {
  try{
    if(value.equals(header[index])){
      console.log("HETE ", Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash))
      return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
    }
  }catch(e){ console.log(e) }
  return false
}

VerifyProof.verifyNonce = (address, nonce, branch, header, blockHash) => {
  return VerifyProof._verifyAccountElement(0, address, nonce, branch, header, blockHash)
}
VerifyProof.verifyBalance = (address, balance, branch, header, blockHash) => {
  return VerifyProof._verifyAccountElement(1, address, balance, branch, header, blockHash)
}
VerifyProof.verifyStorageRoot = (address, storageRoot, branch, header, blockHash) => {
  return VerifyProof._verifyAccountElement(2, address, storageRoot, branch, header, blockHash)
}
VerifyProof.verifyCodeHash = (address, codeHash, branch, header, blockHash) => {
  return VerifyProof._verifyAccountElement(3, address, codeHash, branch, header, blockHash)
}
VerifyProof.verifyCode = (address, code, branch, header, blockHash) => {
  try{
    var account = valueFrom(branch)
    if(Buffer.from(sha3(code),'hex').equals(account[3])){
      return VerifyProof.verifyCodeHash(address, account[3], branch, header, blockHash)
    }
  }catch(e){ console.log(e) }
  return false
}
VerifyProof._verifyAccountElement = (accountIndex, address, targetValue, branch, header, blockHash) => {
  try{
    var account = valueFrom(branch) // decoded last last
    if(VerifyProof.verifyAccount(address, account, branch, header, blockHash)){
      return account[accountIndex].equals(targetValue)
    }
  }catch(e){ console.log(e) }
  return false
}
VerifyProof.verifyStorageAtIndex = (storageIndex, storageValue, storagebranch, address, accountbranch, header, blockHash) => {
  try{
    var storagePath = Buffer.from(sha3(Buffer.from(leftPad(storageIndex.toString('hex')),'hex')),'hex')
    return VerifyProof.verifyStorage(storagePath, storageValue, storagebranch, address, accountbranch, header, blockHash)
  }catch(e){ console.log(e) }
  return false
}

// untested for multi dimensional mappings
VerifyProof.verifyStorageMapping = (storageIndex, mappings, storageValue, storagebranch, address, accountbranch, header, blockHash) => {
  try{
    var pathBuilder = Buffer.from(leftPad(storageIndex.toString('hex')),'hex')
    
    for(var i = 0 ; i < mappings.length ; i++){
      pathBuilder = Buffer.concat([Buffer.from(leftPad(mappings[i].toString('hex')),'hex'), pathBuilder])
    }
    pathBuilder = Buffer.from(sha3(pathBuilder),'hex')

    var storagePath = Buffer.from(sha3(pathBuilder),'hex')
    return VerifyProof.verifyStorage(storagePath, storageValue, storagebranch, address, accountbranch, header, blockHash)
  }catch(e){ console.log(e) }
  return false
}

VerifyProof.verifyStorage = (storagePath, storageValue, storagebranch, address, accountbranch, header, blockHash) => {
  try{
    var storageTrieRoot = valueFrom(accountbranch)[2]
    if(VerifyProof.verifyStorageRoot(address, storageTrieRoot, accountbranch, header, blockHash)){
      //account is already proven during `storageRoot`

      return VerifyProof.verifyTrieValue(storagePath, storageValue, storagebranch, storageTrieRoot)
    }
  }catch(e){ console.log(e) }
  return false
}

// VerifyProof.verifyLogBloom = () => {/* probably dont care. Arent these just for fast lookups? */}
// VerifyProof.verifyostTransactionState = () => { }
// VerifyProof.verifyCummulativeGas = () => { }
VerifyProof.verifyLog = (logIndex, txPath, log, branch, header, blockHash) => {
  try{
    var receipt = valueFrom(branch)
    if(VerifyProof.verifyReceipt(txPath, receipt, branch, header, blockHash)){
      if(receipt[3][logIndex][0].equals(log[0]) && receipt[3][logIndex][2].equals(log[2])){
        return receipt[3][logIndex][1].every((elem, i)=>{
          return elem.equals(log[1][i])
        })
      }
    }
  }catch(e){ console.log(e) }
}
// VerifyProof.verify receiptElement = (receiptIndex, path, targetValue, branch, header, blockHash) => {
// }


// account or contract 
VerifyProof.verifyAccount = (address, account, branch, header, blockHash) => {
  if(VerifyProof.verifyHeader(header, blockHash)){
    let stateRoot = rlp.decode(header)[3]
    return VerifyProof._verifyAccount(address, account, branch, stateRoot)
    // console.log("stateRoot1", stateRoot)
    // if(VerifyProof._verifyValueInTrieIndex(3, sha3OfAddress, account, branch, header, blockHash)){
    // }
  }
}
VerifyProof._verifyAccount = (address, account, branch, stateRoot) => {
  var sha3OfAddress = Buffer.from(sha3(address),'hex')
  console.log("sha3OfAddress",sha3OfAddress)
  return VerifyProof.verifyTrieValue(sha3OfAddress, account, branch, stateRoot)
  // return VerifyProof._verifyValueInTrieIndex(3, sha3OfAddress, account, branch, header, blockHash)
}

VerifyProof.verifyTransaction = (path, tx, branch, header, blockHash) => {
  return VerifyProof._verifyValueInTrieIndex(4, path, tx, branch, header, blockHash)
}
VerifyProof.verifyReceipt = (path, receipt, branch, header, blockHash) => {
  return VerifyProof._verifyValueInTrieIndex(5, path, receipt, branch, header, blockHash)
}
VerifyProof._verifyValueInTrieIndex = (trieIndex, path, value, branch, header, blockHash) => {
  try{
    var trieRoot = header[trieIndex]
    if(VerifyProof.verifyHeaderElement(trieIndex, trieRoot, header, blockHash)){
      return VerifyProof.verifyTrieValue(path, value, branch, trieRoot)
    }
  }catch(e){ console.log(e) }
  return false;
}

// proves commitment to its root only (not a blockHash). I should almost make this 
// private although its very fundamental so i wont. 
function test(proof){
  thing = []
  for (var i = 0; i < proof.length; i++) {
    thing[i] = proof[i].toString('hex')
  }
  return thing
}

VerifyProof.verifyTrieValue = (path, value, branch, root) => {
  // console.log("zpath ", path)
  // console.log("zvalue ", rlp.decode(value))
  // console.log("zbranch ", branch)
  // console.log("zbranchdecodeLast ", rlp.decode(rlp.decode(branch)[rlp.decode(branch).length-1]))
  // console.log("zbranchvalueAccount ", rlp.decode(rlp.decode(rlp.decode(branch)[rlp.decode(branch).length-1])[1]))
  // console.log()
  let complete, response, error = undefined

  function cb(e,r){
      console.log("zzzzzza", e)
      console.log("zzzzzza", r)
    try{
      complete = true
      error = e
      response = r
    }catch(e){
    }
  }

  var accountNodes = []
  var branchArr = rlp.decode(branch)
  for (var i = 0; i < branchArr.length; i++) {
    accountNodes.push('0x'+branchArr[i].toString('hex'))
  }
  // console.log("QQQQQ", '0x'+root.toString('hex'), '0x'+path.toString('hex'), accountNodes)

  console.log("zzzzzz", value.toString('hex'))
   try{
    Trie.verifyProof('0x'+root.toString('hex'), path, accountNodes, cb)
     while(!complete){  }
   }catch(e){
    console.log("ooooooooo")
   }

  console.log("zzzzzz", response.toString('hex'))
  // console.log("zzzzzz", value.toString('hex'))
  console.log("")
  if(error){
    if(error == 'Key does not match with the proof one (extention|leaf)'){
      return false
    }else{
      return false
    }
  }else{
    return true//response.equals(value) ;
  }

  // try{
  //   var branchArr = rlp.decode(branchArrBytes)
  //   // console.log("BBBB", branchArr)
  //   var currentNode;
  //   var len = branchArr.length;
  //   var rlpTxFromPrf = branchArr[len - 1][branchArr[len - 1].length - 1];
  //   var nodeKey = root;
  //   var pathPtr = 0;

  //   path = path.toString('hex')

  //   for (var i = 0 ; i < len ; i++) {
  //     currentNode = rlp.decode(branchArr[i]);
  //     if(!nodeKey.equals( Buffer.from(sha3(rlp.encode(currentNode)),'hex'))){
  //       console.log("nodeKey != sha3(rlp.encode(currentNode)): ", nodeKey, Buffer.from(sha3(currentNode),'hex'), "currentNode", currentNode.toString('hex') )
  //       return false;
  //     }
  //     if(pathPtr > path.length){
  //       console.log("pathPtr >= path.length ", pathPtr,  path.length)

  //       return false
  //     }

  //     switch(currentNode.length){
  //       case 17://branchArr node
  //         if(pathPtr == path.length){
  //           if(currentNode[16] == rlp.encode(value)){
  //             return true;
  //           }else{
  //             console.log('currentNode[16],rlp.encode(value): ', currentNode[16], rlp.encode(value))
  //             return false
  //           }
  //         }
  //         nodeKey = currentNode[parseInt(path[pathPtr],16)] //must == sha3(rlp.encode(currentNode[path[pathptr]]))
  //         pathPtr += 1
  //         console.log(nodeKey, pathPtr, path[pathPtr])
  //         break;
  //       case 2:
  //         pathPtr += nibblesToTraverse(currentNode[0].toString('hex'), path, pathPtr)
  //         if(pathPtr == path.length){//leaf node
  //           if(currentNode[1].equals(rlp.encode(value))){
  //             return true
  //           }else{
  //             console.log("currentNode[1] == rlp.encode(value) ", currentNode[1], rlp.encode(value))
  //             return false
  //           }
  //         }else{//extension node
  //           nodeKey = currentNode[1]
  //         }
  //         break;
  //       default:
  //         console.log("all nodes must be length 17 or 2");
  //         return false
  //     }
  //   }
  // }catch(e){ console.log(e); return false }
  // return false
}


// var nibblesToTraverse = (encodedPartialPath, path, pathPtr) => { 
//   if(encodedPartialPath[0] == 0 || encodedPartialPath[0] == 2){
//     var partialPath = encodedPartialPath.slice(2)
//   }else{
//     var partialPath = encodedPartialPath.slice(1)
//   }

//   if(partialPath == path.slice(pathPtr, pathPtr + partialPath.length)){
//     return partialPath.length
//   }else{
//     throw new Error("path was wrong")
//   }
// }
var valueFrom = (branch) => { // last last item decoded
  branch = rlp.decode(branch)
  return rlp.decode(branch[branch.length - 1][branch[branch.length - 1].length - 1])
}

var leftPad = (str) => {
  return ("0000000000000000000000000000000000000000000000000000000000000000"+str).substring(str.length)
}

module.exports = VerifyProof

const Trie = require('merkle-patricia-tree')
const sha3 = require('js-sha3').keccak_256
const rlp = require('rlp');

// public methods all prove commitment to a blockHash
// all args currently expect Buffers
//to do: they should all only take one proofNodes array merge header into branch 

class VerifyProof{
  static async verifyHeader(header, blockHash){
    // try{
      return Buffer.from(sha3(header),'hex').equals(blockHash);
    // }catch(e){
    //   return Promise.reject(new Error("Invalid header proof"))
    // }
  }

  static async verifyAccount(address, account, branch, header, blockHash){
    // try{
      let headerVer = await VerifyProof.verifyHeader(header, blockHash)
      let stateRoot = rlp.decode(header)[3]
      let hashedAddress = Buffer.from(sha3(address),'hex')
      let accountVer = await VerifyProof.verifyTrieValue(hashedAddress, account, branch, stateRoot)
      // throw new Error("asdf")
      return headerVer && accountVer
    // }catch(e){
    //   return Promise.reject(e + new Error("Invalid header or account proof"))
    // }
  }
  static async verifyTransaction(txIndex, tx, branch, header, blockHash) {
    // try{
      let headerVer = await VerifyProof.verifyHeader(header, blockHash)
      let txRoot = rlp.decode(header)[4]
      let txVer = await VerifyProof.verifyTrieValue(txIndex, tx, branch, txRoot)
      return headerVer && txVer
    // }catch(e){
    //   return Promise.reject(new Error("Invalid header or tx proof"))
    // }
  }
  static async verifyReceipt(txIndex, receipt, branch, header, blockHash) {
    try{
      let headerVer = await VerifyProof.verifyHeader(header, blockHash)
      let receiptsRoot = rlp.decode(header)[5]
      let receiptVer = await VerifyProof.verifyTrieValue(txIndex, receipt, branch, receiptsRoot)
      return headerVer && receiptVer
    }catch(e){
      return Promise.reject(new Error("Invalid header or receipt proof"))
    }
  }

  //getting the storage index: 
  //https://github.com/ethereum/wiki/wiki/JSON-RPC#example-14
  //its unclear if zero is implemented as <>, <00>, or <80>
  static async verifyStorage(storagePath, storageValue, storageBranch, address, account, branch, header, blockHash){
    // try{
      let accountVer = await VerifyProof.verifyAccount(address, account, branch, header, blockHash)
      let storageHash = rlp.decode(account)[2] //STORAGEROOTINDEX = 2
      let storageVer = await VerifyProof.verifyTrieValue(storagePath, storageValue, storageBranch, storageHash)
      return accountVer && storageVer
    // }catch(e){ 
    //   return Promise.reject(new Error("Invalid storage proof"))
    // }
  }
  //todo: functions for verifying solidity?
  static async verifyByteCode(address, byteCode, account, branch, header, blockHash){
    // try{
      let accountVer = await VerifyProof.verifyAccount(address, account, branch, header, blockHash)
      let codeVer = Buffer.from(sha3(byteCode),'hex').equals(rlp.decode(account)[3])
      return codeVer && accountVer
    // }catch(e){ 
    //   return Promise.reject(new Error("Invalid byteCode proof"))
    // }
  }
  static async verifyLog(logIndex, log, txIndex, receipt, branch, header, blockHash){
    // try{
      let receiptVer = await VerifyProof.verifyReceipt(txIndex, receipt, branch, header, blockHash)
      let logVer = rlp.encode(rlp.decode(receipt)[3][logIndex]).equals(log)
      return receiptVer && logVer
    // }catch(e){
    //   return Promise.reject(new Error("Invalid log proof"))
    // }
  }

  static async verifyTrieValue(path, value, branch, root){
    return new Promise((accept, reject) => {
      console.log("thing",'0x'+root.toString('hex'), "path", rlp.decode(branch))
      Trie.verifyProof('0x'+root.toString('hex'), "path", rlp.decode(branch), function(e,r){
        if(e || r != value){
          return reject(e)
        }else{
          return accept(true)
        }
      })
    })
  }
}


// VerifyProof.verifyHeader = (header, blockHash) => {
//   try{
//     return Buffer.from(sha3(header),'hex').equals(blockHash);
//     // return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
//   }catch(e){ console.log(e) }
//   return false
// }
// VerifyProof.verifyHeaderElement = (index, value, header, blockHash) => {
//   try{
//     if(value.equals(header[index])){
//       console.log("HETE ", Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash))
//       return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
//     }
//   }catch(e){ console.log(e) }
//   return false
// }

// VerifyProof.verifyNonce = (address, nonce, branch, header, blockHash) => {
//   return VerifyProof._verifyAccountElement(0, address, nonce, branch, header, blockHash)
// }
// VerifyProof.verifyBalance = (address, balance, branch, header, blockHash) => {
//   return VerifyProof._verifyAccountElement(1, address, balance, branch, header, blockHash)
// }
// VerifyProof.verifyStorageHash = (address, storageHash, branch, header, blockHash) => {
//   return VerifyProof._verifyAccountElement(2, address, storageHash, branch, header, blockHash)
// }
// VerifyProof.verifyCodeHash = (address, codeHash, branch, header, blockHash) => {
//   return VerifyProof._verifyAccountElement(3, address, codeHash, branch, header, blockHash)
// }

// VerifyProof._verifyAccountElement = (accountIndex, address, targetValue, branch, header, blockHash) => {
//   try{
//     var account = valueFrom(branch) // decoded last last
//     if(VerifyProof.verifyAccount(address, account, branch, header, blockHash)){
//       return account[accountIndex].equals(targetValue)
//     }
//   }catch(e){ console.log(e) }
//   return false
// }

// VerifyProof.verifyStorageAtIndex = (storageIndex, storageValue, storagebranch, address, accountbranch, header, blockHash) => {
//   try{
//     var storagePath = Buffer.from(sha3(Buffer.from(leftPad(storageIndex.toString('hex')),'hex')),'hex')
//     return VerifyProof.verifyStorage(storagePath, storageValue, storagebranch, address, accountbranch, header, blockHash)
//   }catch(e){ console.log(e) }
//   return false
// }

// untested for multi dimensional mappings
// VerifyProof.verifyStorageMapping = (storageIndex, mappings, storageValue, storagebranch, address, accountbranch, header, blockHash) => {
//   try{
//     var pathBuilder = Buffer.from(leftPad(storageIndex.toString('hex')),'hex')
    
//     for(var i = 0 ; i < mappings.length ; i++){
//       pathBuilder = Buffer.concat([Buffer.from(leftPad(mappings[i].toString('hex')),'hex'), pathBuilder])
//     }
//     pathBuilder = Buffer.from(sha3(pathBuilder),'hex')

//     var storagePath = Buffer.from(sha3(pathBuilder),'hex')
//     return VerifyProof.verifyStorage(storagePath, storageValue, storagebranch, address, accountbranch, header, blockHash)
//   }catch(e){ console.log(e) }
//   return false
// }



// VerifyProof.verifyLogBloom = () => {/* probably dont care. Arent these just for fast lookups? */}
// VerifyProof.verifyostTransactionState = () => { }
// VerifyProof.verifyCummulativeGas = () => { }

// VerifyProof.verify receiptElement = (receiptIndex, path, targetValue, branch, header, blockHash) => {
// }


// account or contract 
// VerifyProof.verifyAccount = async function(address, account, branch, header, blockHash){
//   try{
//     let stateRoot = rlp.decode(header)[3]
//     let headerVer = await VerifyProof.verifyHeader(header, blockHash) //add await
//     let accountVer = await VerifyProof._verifyAccount(address, account, branch, stateRoot)
//     return headerVer && accountVer
//   }catch(e){
//     return Promise.reject(e || new Error("Proof invalid"))
//   }
// }
// VerifyProof._verifyAccount = (address, account, branch, stateRoot) => {
//   var sha3OfAddress = Buffer.from(sha3(address),'hex')
//   console.log("sha3OfAddress",sha3OfAddress)
//   return VerifyProof.verifyTrieValue(sha3OfAddress, account, branch, stateRoot)
//   // return VerifyProof._verifyValueInTrieIndex(3, sha3OfAddress, account, branch, header, blockHash)
// }





VerifyProof.verifyTrieVal = (path, value, branch, root) => {
  // console.log("zpath ", path)
  // console.log("zvalue ", rlp.decode(value))
  // console.log("zbranch ", branch)
  // console.log("zbranchdecodeLast ", rlp.decode(rlp.decode(branch)[rlp.decode(branch).length-1]))
  // console.log("zbranchvalueAccount ", rlp.decode(rlp.decode(rlp.decode(branch)[rlp.decode(branch).length-1])[1]))
  // console.log()

  let complete, response, error = undefined

  function cb(e,r){
    complete = true
    error = e
    response = r
    console.log("ERROR/RESPONSE", e, r)
  }

  var accountNodes = []
  var branchArr = rlp.decode(branch)
  for (var i = 0; i < branchArr.length; i++) {
    accountNodes.push('0x'+branchArr[i].toString('hex'))
  }
  // console.log("QQQQQ", '0x'+root.toString('hex'), '0x'+path.toString('hex'), accountNodes)

  // console.log("zzzzzz", value.toString('hex'))

  Trie.verifyProof('0x'+root.toString('hex'), path, accountNodes, cb)
  while(!complete){  }

  // console.log("qwer", response.toString('hex'))
  return !!response
  // console.log("zzzzzze", error.toString('hex'))


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

// let valueFrom = (branch) => { // last last item decoded
//   branch = rlp.decode(branch)
//   return rlp.decode(branch[branch.length - 1][branch[branch.length - 1].length - 1])
// }

// let leftPad = (str) => {
//   return ("0000000000000000000000000000000000000000000000000000000000000000"+str).substring(str.length)
// }

// var deepEquals = (a, b)=>{ return rlp.encode(a).equals(rlp.encode(b)) }

module.exports = VerifyProof


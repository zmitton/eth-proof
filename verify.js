// const sha3 = require('js-sha3').keccak_256
// const rlp = require('rlp');

// // for solidity, should we send rlpObjects or arrays. former must be decoded, latter
// // must be encoded. I think encoding is easier

// // use a try catch for strictness (wont work for evm implementation tho)


// // it should probably extend web3 methods to return a proof instead of just the data


// // The EV public API checks proofs against a specified blockHash.
// // Establishing trust of a blockHash is a separate issue. It relies on trust
// // of a chain, which should ultimately rely on a set of heuristics involving
// // expected total work at the current moment in time

// // EVENTUAL BLOCKER
// // state proofs: construction of stateProofs will require direct access to the
// // leveldb database, because we cannot reconstruct the entire trie from RPC calls
// // like we can with both the transactions trie and the receipts trie. Its simply 
// // too big (>20GB). 
// // solutions:
// // 1 Run our own servers which allow access to these levelDB functions
// // (or ask infura to run them, but we should define/build them)
// // 2 Eventually modify geth/parity and expand the standard RPC to returns data with 
// // its proof. name the methods after standard RPC methods with maybe the word 
// // `proof` concatenated on them, and have them take 1 extra `blockHash` param.



// // public methods all prove commitment to a blockHash
// // all args must be Buffers
// //to do: they should all only take one proofNodes array merge header into parentNodes 
// // EthProof = () => {}
// EthProof.header = (header, blockHash) => {
//   try{
//     return new Buffer(sha3(rlp.encode(header)),'hex').equals(blockHash);
//   }catch(e){ console.log(e) }
//   return false
// }
// EthProof.headerElement = (index, value, header, blockHash) => {
//   try{
//     if(header[index].equals(value)){
//       return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
//     }
//   }catch(e){ console.log(e) }
//   return false
// }

// EthProof.accountNonce = (address, nonce, parentNodes, header, blockHash) => {
//   return EthProof._accountElement(0, address, nonce, parentNodes, header, blockHash)
// }
// EthProof.balance = (address, balance, parentNodes, header, blockHash) => {
//   return EthProof._accountElement(1, address, balance, parentNodes, header, blockHash)
// }
// EthProof.storageRoot = (address, storageRoot, parentNodes, header, blockHash) => {
//   return EthProof._accountElement(2, address, storageRoot, parentNodes, header, blockHash)
// }
// EthProof.codeHash = (address, codeHash, parentNodes, header, blockHash) => {
//   return EthProof._accountElement(3, address, codeHash, parentNodes, header, blockHash)
// }
// EthProof.code = (address, code, parentNodes, header, blockHash) => {
//   try{
//     var account = EthProof._valueFrom(parentNodes)
//     if(Buffer.from(sha3(code),'hex').equals(account[3])){
//       return EthProof.codeHash(address, account[3], parentNodes, header, blockHash)
//     }
//   }catch(e){ console.log(e) }
//   return false
// }
// EthProof._accountElement = (accountIndex, address, targetValue, parentNodes, header, blockHash) => {
//   try{
//     var account = EthProof._valueFrom(parentNodes) // decoded last last
//     if(EthProof.account(address, account, parentNodes, header, blockHash)){
//       return account[accountIndex].equals(targetValue)
//     }
//   }catch(e){ console.log(e) }
//   return false
// }

// //to do: this should probably only take one ParentNodes array arg. merge the 2
// EthProof.storageAtIndex = (storageIndex, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
//   try{
//     var storagePath = Buffer.from(sha3(rlp.encode(storageIndex)))
//     return EthProof.storage(storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash)
//   }catch(e){ console.log(e) }
//   return false
// }
// // EthProof.storageMapping = (storageIndex, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
// //   try{
// //     var storagePath = Buffer.from(sha3(rlp.encode(storageIndex)))
// //     return EthProof.storage(storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash)
// //   }catch(e){ console.log(e) }
// //   return false
// // }
// EthProof.storage = (storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
//   try{
//     var storageTrieRoot = EthProof._valueFrom(accountParentNodes)[2]
//     if(EthProof.storageRoot(address, storageTrieRoot, accountParentNodes, header, blockHash)){
//       // if(EthProof.account(address, account, accountParentNodes, header, blockHash)){
//       //account is already also proven during `storageRoot`
//       return EthProof.trieValue(rlp.encode(storagePath), storageValue, storageParentNodes, storageTrieRoot)
//       // }
//     }
//   }catch(e){ console.log(e) }
//   return false
// }

// // EthProof.storage = () => {/* to do */}
// EthProof.log = () => {/* to do */}
// EthProof.logBloom = () => {/* probably dont care. Arent these just for fast lookups? */}


// // account can be a contract or 
// EthProof.account = (address, account, parentNodes, header, blockHash) => {
//   var sha3OfAddress = Buffer.from(sha3(address),'hex')
//   return EthProof._valueInTrieIndex(3, sha3OfAddress, account, parentNodes, header, blockHash)
// }
// EthProof.transaction = (path, tx, parentNodes, header, blockHash) => {
//   return EthProof._valueInTrieIndex(4, path, tx, parentNodes, header, blockHash)
// }
// EthProof.receipt = (path, receipt, parentNodes, header, blockHash) => {
//   return EthProof._valueInTrieIndex(5, path, receipt, parentNodes, header, blockHash)
// }
// EthProof._valueInTrieIndex = (trieIndex, path, value, parentNodes, header, blockHash) => {
//   try{
//     var trieRoot = EthProof._rootFrom(parentNodes) // why not header[trieIndex] ?
//     console.log("XX", header[trieIndex], trieRoot)
//     if(EthProof.headerElement(trieIndex, trieRoot, header, blockHash)){
//       return EthProof.trieValue(path, value, parentNodes, trieRoot)
//     }
//   }catch(e){ console.log(e) }
//   return false;
// }

// // proves commitment to its root only (not a blockHash). I should almost make this 
// // private although its very fundamental so i wont. 
// EthProof.trieValue = (path, value, parentNodes, root) => {
//   try{
//     var currentNode;
//     var len = parentNodes.length;
//     var rlpTxFromPrf = parentNodes[len - 1][parentNodes[len - 1].length - 1];
//     var nodeKey = root;
//     var pathPtr = 0;

//     path = path.toString('hex')

//     for (var i = 0 ; i < len ; i++) {
//       currentNode = parentNodes[i];
//       if(!nodeKey.equals( new Buffer(sha3(rlp.encode(currentNode)),'hex'))){
//         console.log("nodeKey != sha3(rlp.encode(currentNode)): ", nodeKey, new Buffer(sha3(rlp.encode(currentNode)),'hex'))
//         return false;
//       }
//       if(pathPtr > path.length){
//         console.log("pathPtr >= path.length ", pathPtr,  path.length)
//         return false
//       }

//       switch(currentNode.length){
//         case 17://branch node
//           if(pathPtr == path.length){
//             if(currentNode[16] == rlp.encode(value)){
//               return true;
//             }else{
//               console.log('currentNode[16],rlp.encode(value): ', currentNode[16], rlp.encode(value))
//               return false
//             }
//           }
//           nodeKey = currentNode[parseInt(path[pathPtr],16)] //must == sha3(rlp.encode(currentNode[path[pathptr]]))
//           pathPtr += 1
//           // console.log(nodeKey, pathPtr, path[pathPtr])
//           break;
//         case 2:
//           // console.log(currentNode[0].toString('hex'), path, pathPtr)
//           pathPtr += EthProof._nibblesToTraverse(currentNode[0].toString('hex'), path, pathPtr)
//           if(pathPtr == path.length){//leaf node
//             if(currentNode[1].equals(rlp.encode(value))){
//               return true
//             }else{
//               console.log("currentNode[1] == rlp.encode(value) ", currentNode[1], rlp.encode(value))
//               return false
//             }
//           }else{//extension node
//             nodeKey = currentNode[1]
//           }
//           break;
//         default:
//           console.log("all nodes must be length 17 or 2");
//           return false
//       }
//     }
//   }catch(e){ console.log(e); return false }
//   return false
// }


// EthProof._nibblesToTraverse = (encodedPartialPath, path, pathPtr) => { 
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
// EthProof._valueFrom = (parentNodes) => {
//   // last last item decoded
//   return rlp.decode(parentNodes[parentNodes.length - 1][parentNodes[parentNodes.length - 1].length - 1])
// }
// EthProof._rootFrom = (parentNodes) => {
//   return Buffer.from(sha3(rlp.encode(parentNodes[0])),'hex')
// }


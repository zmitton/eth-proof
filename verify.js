//CLASSES: Branch,Tx,Receipt,Blockheader,Account extend Array
const Trie = require('merkle-patricia-tree')
const Util = require('ethereumjs-util')
const [keccak, encode, decode, toBuffer, toHex] = require('./ethUtils')


// const keccak =   Util.keccak
// const encode =   Util.rlp.encode
// const decode =   Util.rlp.decode
// const toBuf  =   Util.toBuffer
// const bufToHex = Util.bufferToHex

const ACCOUNTS_ROOT_INDEX = 3
const TXS_ROOT_INDEX      = 4
const RECEIPTS_ROOT_INDEX = 5

const STORAGE_ROOT_INDEX = 2


// blockHashContainsBlockheader(blockHash, prf.header)
// headerContainsAccountBranch(prf.header, prf.branch)
// accountBranchContainsAccountAtAddress(prf.branch, prf.account, address)
// accountContainsStorageBranch(prf.account, prf.storageBranch)
// storageBranchContainsStorageAtPosition(prf.account, prf.storageBranch, position)







class Verify{
  static chainContainsBlockHash(chain, blockHash){ throw new Error("feature not available") }
  // once header "has a" tree (which has a canonicalChain) the object will have methods for:
  // get workBeforeCreation, workAfterCreation
  // static blockHashOf(header){ 
  //   return keccak(encode(header))
  // }
  static rootContainsBranch(rootHash, branch){
    console.assert(keccak(encode(branch[0])).equals(rootHash))
    return true
  }
  static blockhashContainsHeader(blockhash, header){
    console.assert(keccak(encode(header)).equals(blockhash))
    return true
  }

  // static rootOf(branch){
  //   return keccak(encode(branch[0]))
  // }
  static headerContainsHashAt(header, hash, indexOfRoot){
    console.assert(toBuffer(hash).equals(header[indexOfRoot]))
    return true
  }
  static headerContainsStateRoot(header, stateRoot){
    return this.headerContainsHashAt(header, stateRoot, ACCOUNTS_ROOT_INDEX)
  }
  static accountBranchContainsAccountAtAddress(branch, account, address){
    return this.branchContainsValue(keccak(address), branch, encode(account))
  }
  static accountContainsStorageBranch(account, branch){
    console.assert(account[STORAGE_ROOT_INDEX].equals(keccak(encode(branch[0]))))
    return true
  }
  static storageBranchContainsStorage(key, branch, value){
    return this.branchContainsValue(keccak(key), branch, encode(value)) || Account.NULL
  }

  static headerContainsTxsRoot(header, txRoot){
    return this.headerContainsHashAt(header, txRoot, TXS_ROOT_INDEX)
  }
  static txsBranchContainsTxAt(branch, tx, indexOfTx){
    return this.branchContainsValueAt(branch, encode(tx), encode(indexOfTx))
    // null proofs here are pretty useless because you can only prove something like:
    // tx <X> was NOT confirmed [in block <Y> at index <Z>]
  }
  // static txContainsPublicationsBranch(tx, branch){   }
  // static publicationsBranchContainsPublications(branch, publication){
  //   return this.branchContainsValue(keccak(publication), branch, encode(publication))
  // } 
  static headerContainsReceiptsRoot(header, receiptsRoot){
    return this.headerContainsHashAt(header, receiptsRoot, RECEIPTS_ROOT_INDEX)
  }
  static receiptsBranchContainsReceiptAt(branch, receipt, indexOfTx){
    return this.branchContainsValueAt(branch, encode(receipt), keccak(indexOfTx))
  }
  static receiptContainsLog(indexOfLog, receipt, log){
    console.assert(receipt[indexOfLog].equals(log))
    return true
  }
  static branchContainsValueAt(branch, value, path){
    console.assert(this.branchContains(path, branch).equals(value))
    return true
  }

  static branchContains(path, branch){
    let complete, error, response = false
    let encodedBranch = []
    for (let i = 0; i < branch.length; i++) { encodedBranch.push(toHex(encode(branch[i]))) }

    // console.log("PATH", path)
    // console.log("PROOF ", U.rlp.decode(branch))
    // console.log("VALUE ", U.rlp.decode(value))
    // console.log("ROOOT",  keccak(encode(branch[0])))
    // console.log("BRANCH",  branch)
    // console.log("ENCODED BRANCH",  encodedBranch)
    // console.log("BLOOM ", U.rlp.decode(value)[2].toString('hex'))

    Trie.verifyProof(toHex(keccak(encode(branch[0]))) , path, encodedBranch, (e,r)=>{
      error = e
      response = r
      complete = true
    })

    // console.log("here", path, value, branch, root)
    // let complete, error, response = false
    // let encodedBranch = []
    // let branchArr = U.rlp.decode(branch)
    // for (let i = 0; i < branchArr.length; i++) {
    //   encodedBranch.push('0x' + U.rlp.encode(branchArr[i]).toString('hex'))
    // }

    // Trie.verifyProof('0x'+root.toString('hex'), path, encodedBranch, (e,r)=>{
    //   error = e
    //   response = r
    //   complete = true
    // })

    while(!complete){/*wait*/}

    if(error){
      throw Error(error)
    }else{
      return response
    }
  }
}
module.exports = Verify

// fetch.storage(storageKey, accountAddress) => Proof:{storage, storageTrie, account, accountTrie}
// fetch.storage(storageKey, accountAddress, blockHash) => Proof:{storage, storageTrie, account, accountTrie, header}

// fetch.account(accountAddress) => Proof:{account, accountTrie}
// fetch.account(accountAddress, blockHash) => Proof:{account, accountTrie, header}

// fetch.tx(txHash) => Proof:{tx, txTrie}
// fetch.tx(txHash, blockHash) => Proof:{tx, txTrie, header}

// fetch.receipt(txHash) => Proof:{receipt, receiptsTrie}
// fetch.receipt(txHash, blockHash) => Proof:{receipt, receiptsTrie, header}

// ===================================================================================

// //assuming not well formed, add fetch args to beginning; throw if false
    
//         Verify.storageIsInTrie()

// Verify.storageIsInAccount(proof, storageKey, accountAddress) => storageValueFromAccount
//     return Verify.storageHashIsInAccount(proof, storageKey, proof.storageBranch) => 
//         return Verify.storageIsInStorageTree(storageKey, proof.storageBranch) => storageValueFromTree
//             return Verify.valueIsInTree(sha3(storageKey), branch) => valueFromTree

// Verify.storageIsInBlock(proof, storageKey, accountAddress, blockHash) => storageValueFromBlock
//     return 


// Verify.storage(proof, storageKey, accountAddress, blockHash, workChain) => storageValue //might include metedata object

// proof.storageBranch.get(storageKey) => storageValue //storage is in tree

// console.assert proof.account.get(storageHash) == storageHash

// Account.getStorageRoot(storageBranch.root)



// This is the main API. You should be able to do most data proofs from 
// it unless you are doing more complex things with for instance 
// side chains / state channels / plasma

// In that case, you should still be able to do everthing you need using
// the lower level <x> methods that prove individual pieces are linked
// to their direct neighbors in the architecture diagram . You can combine
// these individual proof pieces to make the connections you need.

// then my months of pondering were all in vein and you need to tell me 
// about it so i can suffer an ego death and move on as a better person

// MAIN API EXPOSED:
// GetAndVerify.txAgainstTxRoot(txHash, txRoot) => tx
// GetAndVerify.txAgainstBlockHash(txHash, blockHash) => tx
// GetAndVerify.txAgainstWorkChain(txHash, workChain) => tx

// GetAndVerify.receiptAgainstReceiptsRoot(txHash, receiptsRoot) => receipt
// GetAndVerify.receiptAgainstBlockHash(txHash blockHash) => receipt
// GetAndVerify.receiptAgainstWorkChain(txHash, workChain) => receipt

// GetAndVerify.accountAgainstStateRoot(accountAddress, stateRoot) => account
// GetAndVerify.accountAgainstBlockHash(accountAddress, blockHash) => account
// GetAndVerify.accountAgainstWorkChain(accountAddress, workChain) => account

// GetAndVerify.storageAgainstStorageRoot(accountAddress, storageAddress, storageRoot) => storage
// GetAndVerify.storageAgainstBlockHash(accountAddress, storageAddress, blockHash) => storage
// GetAndVerify.storageAgainstWorkChain(accountAddress, storageAddress, workChain) => storage

// stretch goal API
// GetAndVerify.codeAgainstBlockHash(solString, solVersion, optimizer, contractAddress, blockHash)  
// GetAndVerify.codeAgainstWorkChain(solString, solVersion, optimizer, contractAddress, workChain)


// let x = await get.account(address, hash) //uses as blockHash or stateRoot
// let x = await get.tx(txId, hash) // uses as blockHash or txRoot
// let x = await get.receipt(txId, hash) // uses as blockHash or receipRoot

// let x = await get.storage(address, position, hash) // uses as blockHash or stateRoot or storageRoot
// let x = await get.log(txId, hash) // uses as blockHash or receipRoot
// let x = await get.log(address, hash) // uses as blockHash or receipRoot




// main API will not involve proving the tx/receipt index. SO make sure to have 
// low level func availbable for this


// Verify.get('account').atAddress(address).from('header')
// Verify.Account.from('BlockHash').withProof(prf)
// Verify.account.from.blockHash(trustedBlockHash)

// Verify.xFromY('Account','BlockHash','Address')
// let account = await buildAdVerifyAccountByBlcokash()


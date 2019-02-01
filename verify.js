//CLASSES: Branch,Tx,Receipt,Blockheader,Account extend Array
const Util = require('ethereumjs-util')

const keccak =   Util.keccak
const encode =   Util.rlp.encode
const decode =   Util.rlp.decode
const toBuf  =   Util.toBuffer
const bufToHex = Util.bufferToHex

const ACCOUNTS_ROOT_INDEX = 3
const TXS_ROOT_INDEX      = 4
const RECEIPTS_ROOT_INDEX = 5

const STORAGE_ROOT_INDEX = 2


class Verify{
  static chainContainsBlockhash(chain, blockhash){ throw new Error("feature not available") }
  // once blockheader "has a" tree (which has a canonicalChain) the object will have methods for:
  // get workBeforeCreation, workAfterCreation
  static blockHashContainsBlockheader(blockhash, blockheader){ 
    console.assert(toBuf(blockhash).equals(keccak(blockheader)))
    return true
  }

  static blockheaderContainsBranchAt(blockheader, branch, indexOfRoot){
    console.assert(blockheader[indexOfRoot].equals(branch.root()))
    return true
  }
  static blockheaderContainsAccountBranch(blockheader, branch){
    return this.blockheaderContainsBranchAt(blockheader, branch, ACCOUNTS_ROOT_INDEX)
  }
  static accountBranchContainsAccount(address, branch, account){
    return this.branchContainsValue(keccak(address), branch, encode(account))
  }
  static accountContainsStorageBranch(account, branch){
    console.assert(account[STORAGE_ROOT_INDEX].equals(branch.root()))
    return true
  }
  static StorageBranchContainsStorage(key, branch, value){
    return this.branchContainsValue(keccak(key), branch, encode(value)) || Account.NULL
  }

  static blockheaderContainsTxsBranch(blockheader, branch){
    return this.blockheaderContainsBranchAt(blockheader, branch, TXS_ROOT_INDEX)
  }
  static txsBranchContainsTx(indexOfTx, branch, tx){
    return this.branchContainsValue(keccak(indexOfTx), branch, encode(tx))
  }
  // static txContainsPublicationsBranch(tx, branch){   }
  // static publicationsBranchContainsPublications(branch, publication){
  //   return this.branchContainsValue(keccak(publication), branch, encode(publication))
  // } 
  static blockheaderContainsReceiptsBranch(blockheader, branch){
    return this.blockheaderContainsBranchAt(blockheader, branch, RECEIPTS_ROOT_INDEX)
  }
  static receiptsBranchContainsReceipt(indexOfTx, branch, receipt){
    return this.branchContainsValue(keccak(indexOfTx), branch, encode(receipt))
  }
  static receiptContainsLog(indexOfLog, receipt, log){
    console.assert(receipt[indexOfLog].equals(log))
    return true
  }
  static branchContainsValue(path, branch, value){
    console.assert(this.branchContains(path, branch).equals(value))
    return true
  }

  static branchContains(path, branch){
    let complete, error, response = false

    let encodedBranch = branch.map((node)=>{
      return bufToHex(encode(node))
    })

    Trie.verifyProof(keccak(branch[0]), toBuf(path), encodedBranch, (e,r)=>{
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


fetch.storage(storageKey, accountAddress) => Proof:{storage, storageTrie, account, accountTrie}
fetch.storage(storageKey, accountAddress, blockHash) => Proof:{storage, storageTrie, account, accountTrie, blockheader}

fetch.account(accountAddress) => Proof:{account, accountTrie}
fetch.account(accountAddress, blockHash) => Proof:{account, accountTrie, blockheader}

fetch.tx(txHash) => Proof:{tx, txTrie}
fetch.tx(txHash, blockhash) => Proof:{tx, txTrie, blockheader}

fetch.receipt(txHash) => Proof:{receipt, receiptsTrie}
fetch.receipt(txHash, blockhash) => Proof:{receipt, receiptsTrie, blockheader}

===================================================================================

//assuming not well formed, add fetch args to beginning; throw if false
    
        Verify.storageIsInTrie()

Verify.storageIsInAccount(proof, storageKey, accountAddress) => storageValueFromAccount
    return Verify.storageHashIsInAccount(proof, storageKey, proof.storageBranch) => 
        return Verify.storageIsInStorageTree(storageKey, proof.storageBranch) => storageValueFromTree
            return Verify.valueIsInTree(sha3(storageKey), branch) => valueFromTree

Verify.storageIsInBlock(proof, storageKey, accountAddress, blockhash) => storageValueFromBlock
    return 


Verify.storage(proof, storageKey, accountAddress, blockhash, workChain) => storageValue //might include metedata object

proof.storageBranch.get(storageKey) => storageValue //storage is in tree

console.assert proof.account.get(storageHash) == storageHash

Account.getStorageRoot(storageBranch.root)

Verify.account(proof, accountAddress) => account
Verify.account(proof, accountAddress, blockHash) => account
Verify.account(proof, accountAddress, blockHash, workChain) => account



Verify.tx(proof, txHash, index) => tx
Verify.tx(proof, txHash, index, blockhash) => tx
Verify.tx(proof, txHash, index, blockhash, workChain) => tx


Verify.receipt(proof, txHash, index) => receipt
Verify.receipt(proof, txHash, index, blockhash) => receipt
Verify.receipt(proof, txHash, index, blockhash, workChain) => receipt








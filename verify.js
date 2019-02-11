const { keccak, encode, decode, toBuffer, toHex, toWord, mappingAt } = require('./ethUtils')

const Trie = require('merkle-patricia-tree')

const ACCOUNTS_ROOT_INDEX = 3
const TXS_ROOT_INDEX      = 4
const RECEIPTS_ROOT_INDEX = 5
const STORAGE_ROOT_INDEX = 2
const SET_OF_LOGS_INDEX = 3
const NULL_BUFFER = toBuffer()
const ENCODED_NULL_STORAGE = encode()
const ENCODED_NULL_ACCOUNT = encode([NULL_BUFFER, NULL_BUFFER, keccak(encode()), keccak()])


class Verify{
  static chainContainsBlockHash(chain, blockHash){ throw new Error("feature not yet available") }
  // once header "has a" tree (which has a canonicalChain) the object will have methods for:
  // get workBeforeCreation, workAfterCreation
  static branchRootOf(branch){ return keccak(encode(branch[0])) }
  static rootContainsBranch(rootHash, branch){
    console.assert(this.branchRootOf(branch).equals(rootHash))
    return true
  }
  static accountContainsStorageRoot(account, storageRoot){
    console.assert(account[STORAGE_ROOT_INDEX].equals(storageRoot))
    return true
  }

  static blockhashContainsHeader(blockhash, header){
    console.assert(keccak(encode(header)).equals(blockhash))
    return true
  }
  static headerContainsHashAt(header, hash, indexOfRoot){
    console.assert(toBuffer(hash).equals(header[indexOfRoot]))
    return true
  }
  static headerContainsStateRoot(header, stateRoot){
    return this.headerContainsHashAt(header, stateRoot, ACCOUNTS_ROOT_INDEX)
  }
  static accountBranchContainsAccountAt(branch, account, address){
    let fromBranch = this.branchContains(keccak(address), branch)
    console.assert(fromBranch.equals(encode(account)) ||
      (fromBranch.equals(NULL_BUFFER) && encode(account).equals(ENCODED_NULL_ACCOUNT)))
    return true
  }
  // static accountContainsStorageBranch(account, branch){
  //   console.assert(account[STORAGE_ROOT_INDEX].equals(this.branchRootOf(branch)))
  //   return true
  // }
  static storageBranchContainsStorageAt(branch, storageValue, position){
    let fromBranch = this.branchContains(keccak(toWord(position)), branch)
    console.assert(fromBranch.equals(encode(storageValue)) ||
      (fromBranch.equals(NULL_BUFFER) && encode(storageValue).equals(ENCODED_NULL_STORAGE)))
    return true
  }

  static headerContainsTxsRoot(header, txRoot){
    return this.headerContainsHashAt(header, txRoot, TXS_ROOT_INDEX)
  }
  static txsBranchContainsTxAt(branch, tx, indexOfTx){
    return this.branchContainsValueAt(branch, encode(tx), encode(indexOfTx))
  }
  static headerContainsReceiptsRoot(header, receiptsRoot){
    return this.headerContainsHashAt(header, receiptsRoot, RECEIPTS_ROOT_INDEX)
  }
  static receiptsBranchContainsReceiptAt(branch, receipt, indexOfTx){
    return this.branchContainsValueAt(branch, encode(receipt), encode(indexOfTx))
  }
  static receiptContainsLogAt(receipt, log, indexOfLog){
    console.assert(encode(receipt[SET_OF_LOGS_INDEX][indexOfLog]).equals(encode(log)))
    return true
  }
  static branchContainsValueAt(branch, value, path){
    console.assert(this.branchContains(path, branch).equals(value))
    return true
  }


    // the proper way to deal with proof-of-absence, is to update 
    // the merkle-patricia-tree library. This is the next step.
    // correct behavior of get() for undefined key should to return <buffer 80>
    // because it returns rlp encoded values, and that represents <buffer >
    // which is how the EVM represents null
  static branchContains(path, branch){
    // console.log(path, branch)
    let complete, error, response = false
    let encodedBranch = []
    for (let i = 0; i < branch.length; i++) {
      encodedBranch.push(toHex(encode(branch[i])))
    }

    Trie.verifyProof(toHex(this.branchRootOf(branch)) , path, encodedBranch, (e,r)=>{
      error = e
      response = r
      complete = true
    })

    while(!complete){/*wait*/}

    if(error){
      throw Error(error)
    }else{
      return response
    }
  }
}

module.exports = Verify

const { keccak, encode, decode, toBuffer, toWord } = require('./ethUtils')
const Tree = require('merkle-patricia-tree')

const Account = require('./eth-object/account')

const ACCOUNTS_ROOT_INDEX = 3
const TXS_ROOT_INDEX      = 4
const RECEIPTS_ROOT_INDEX = 5
const SET_OF_LOGS_INDEX = 3

class Verify{
  static chainContainsBlockHash(chain, blockHash){ throw new Error("feature not yet available") }
  static getRootFromProof(proof){ return keccak(encode(proof[0])) } //move to util

  // static assertRootContainsProof(rootHash, proof){
  //   console.assert(this.getRootFromProof(proof).equals(rootHash))
  //   return true
  // }


  static accountContainsStorageRoot(account){
    // console.log(account, storageRoot)
    return account[Account.STORAGE_ROOT_INDEX]
    // console.assert(account[Account.STORAGE_ROOT_INDEX].equals(storageRoot))
    // return true
  }
  static getBlockHashFromHeader(header){
    return keccak(encode(header))
    // console.assert(keccak(encode(header)).equals(blockhash))
    // return true
  }
  static getElemFromHeaderAt(header, indexOfRoot){
    return header[indexOfRoot]
  }
  static getStateRootFromHeader(header){
    return this.getElemFromHeaderAt(header, ACCOUNTS_ROOT_INDEX)
  }
  static getTxsRootFromHeader(header){
    return this.getElemFromHeaderAt(header, TXS_ROOT_INDEX)
  }
  static getReceiptsRootFromHeader(header){
    return this.getElemFromHeaderAt(header, RECEIPTS_ROOT_INDEX)
  }
  static receiptContainsLogAt(receipt, indexOfLog){
    return receipt[SET_OF_LOGS_INDEX][indexOfLog]
  }

  static async getStorageFromStorageProofAt(proof, position){
    let fromProof = await this.proofContainValueAt(proof, keccak(toWord(position)))
    if(!fromProof || fromProof.equals(toBuffer())){
      return toBuffer() // null returned as <buffer >
    }else{
      return decode(fromProof)
    }
    // let valueFromProof = await this.proofContainValueAt(proof, keccak(toWord(position)))
    // if(valueFromProof){
    //   console.assert(valueFromProof.equals(encode(storageValue)))
    // }else{
    //   console.assert(encode(storageValue).equals(ENCODED_NULL_STORAGE))
    // }
    // return true
  }
  static async getAccountFromProofAt(proof, address){
    let fromProof = await this.proofContainValueAt(proof, keccak(address))
    // console.log("ACCOUNT", Account.fromBuffer(fromProof))
    return Account.fromBuffer(fromProof)
    // let valueFromProof = await this.proofContainValueAt(proof,keccak(address), proof)
    // if(valueFromProof){
    //   console.assert(valueFromProof.equals(encode(account)))
    // }else{
    //   console.assert(encode(account).equals(ENCODED_NULL_ACCOUNT))
    // }
    return true
  }
  static async getTxFromTxProofAt(proof, indexOfTx){
    return this.proofContainValueAt(proof, encode(indexOfTx))
    // return this.doesProofContainValueAt(proof, encode(tx), encode(indexOfTx))
  }
  static async getReceiptFromReceiptProofAt(proof, indexOfTx){
    return this.proofContainValueAt(proof, encode(indexOfTx))
    // return this.doesProofContainValueAt(proof, encode(receipt), encode(indexOfTx))
  }
  // static async doesProofContainValueAt(proof, value, path){
  //   let valueFromProof = await this.proofContainValueAt(proof, path)
  //   console.assert(valueFromProof.equals(value))
  //   return true
  // }
  static async proofContainValueAt(proof, path){
    return new Promise((accept, reject) => {
      let encodedProof = []
      for (let i = 0; i < proof.length; i++) {
        encodedProof.push(encode(proof[i]))
      }

      Tree.verifyProof(toBuffer(this.getRootFromProof(proof)) , path, encodedProof, (e,r)=>{
        if(e){
          return reject(e)
        }else{
          return accept(r)
        }
      })
    })
  }
}

module.exports = Verify

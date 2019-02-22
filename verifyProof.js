const { keccak, encode, decode, toBuffer, toWord } = require('./ethUtils')
const Tree = require('merkle-patricia-tree')

const Account = require('./eth-object/account')

const ACCOUNTS_ROOT_INDEX = 3
const TXS_ROOT_INDEX      = 4
const RECEIPTS_ROOT_INDEX = 5
const SET_OF_LOGS_INDEX = 3

class Verify{
  static chainContainsBlockHash(chain, blockHash){ throw new Error("feature not yet available") }
  static getRootFromProof(proof){ return keccak(encode(proof[0])) } //todo: move to util

  static accountContainsStorageRoot(account){
    return account[Account.STORAGE_ROOT_INDEX]
  }
  static getBlockHashFromHeader(header){
    return keccak(encode(header))
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
    let fromProof = await this.proofContainsValueAt(proof, keccak(toWord(position)))
    if(!fromProof || fromProof.equals(toBuffer())){
      return toBuffer() // null returned as <buffer >
    }else{
      return decode(fromProof)
    }
  }
  static async getAccountFromProofAt(proof, address){
    let fromProof = await this.proofContainsValueAt(proof, keccak(address))
    return Account.fromBuffer(fromProof) // null returned as Account.NULL
  }
  static async getTxFromTxProofAt(proof, indexOfTx){
    return this.proofContainsValueAt(proof, encode(indexOfTx))
  }
  static async getReceiptFromReceiptProofAt(proof, indexOfTx){
    return this.proofContainsValueAt(proof, encode(indexOfTx))
  }

  static async proofContainsValueAt(proof, path){
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

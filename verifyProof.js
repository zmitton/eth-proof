const { keccak, encode, decode, toBuffer, toWord } = require('eth-util-lite')

const Tree = require('merkle-patricia-tree')

const { Account, Receipt, Transaction } = require('eth-object')

const ACCOUNTS_ROOT_INDEX = 3 // within header
const TXS_ROOT_INDEX      = 4 // within header
const RECEIPTS_ROOT_INDEX = 5 // within header

const STORAGE_ROOT_INDEX  = 2 // within account
const SET_OF_LOGS_INDEX   = 3 // within receipt

class Verify{

  static chainContainsBlockHash(_chain, _blockHash){ throw new Error("Feature not yet available") }

  static getRootFromProof(proof){ return keccak(encode(proof[0])) }

  static accountContainsStorageRoot(account){
    return account[STORAGE_ROOT_INDEX]
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
    let accountBuffer = await this.proofContainsValueAt(proof, keccak(address))
    return Account.fromBuffer(accountBuffer) // null returned as Account.NULL
  }
  static async getTxFromTxProofAt(proof, indexOfTx){
    let txBuffer = await this.proofContainsValueAt(proof, encode(indexOfTx))
    return Transaction.fromBuffer(txBuffer)
  }
  static async getReceiptFromReceiptProofAt(proof, indexOfTx){
    let receiptBuffer = await this.proofContainsValueAt(proof, encode(indexOfTx))
    return Receipt.fromBuffer(receiptBuffer)
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

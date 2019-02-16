const { promisfy } = require('promisfy')

const GetProof = require('./getProof')
const VerifyProof = require('./verifyProof')
const { toBuffer, decode } = require('./ethUtils')

class GetAndVerify{
  constructor(rpcProvider = "http://localhost:8545"){
    this.get = new GetProof(rpcProvider)
  }

  async txAgainstBlockHash(txHash, trustedBlockHash){
    let resp = await this.get.transactionProof(txHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    console.assert(toBuffer(trustedBlockHash).equals(blockHashFromHeader))
    let txRootFromHeader = VerifyProof.getTxsRootFromHeader(resp.header)
    let txRootFromProof = VerifyProof.getRootFromProof(resp.txProof)
    console.assert(txRootFromHeader.equals(txRootFromProof))
    let tx = await VerifyProof.getTxFromTxProofAt(resp.txProof, resp.txIndex)
    return tx
  }
  async receiptAgainstBlockHash(txHash, trustedBlockHash){
    let resp = await this.get.receiptProof(txHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    console.assert(toBuffer(trustedBlockHash).equals(blockHashFromHeader))
    let receiptsRoot = VerifyProof.getReceiptsRootFromHeader(resp.header)
    let receiptsRootFromProof = VerifyProof.getRootFromProof(resp.receiptProof)
    console.assert(receiptsRoot.equals(receiptsRootFromProof))
    let receipt = await VerifyProof.getReceiptFromReceiptProofAt(resp.receiptProof, resp.txIndex)
    return receipt
  }
  async accountAgainstBlockHash(accountAddress, trustedBlockHash){
    let resp = await this.get.accountProof(accountAddress, trustedBlockHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    console.assert(toBuffer(trustedBlockHash).equals(blockHashFromHeader))
    let stateRoot = VerifyProof.getStateRootFromHeader(resp.header)
    let stateRootFromProof = VerifyProof.getRootFromProof(resp.accountProof)
    console.assert(stateRoot.equals(stateRootFromProof))
    let account = await VerifyProof.getAccountFromProofAt(resp.accountProof, accountAddress)
    return account
  }
  async storageAgainstBlockHash(accountAddress, position, trustedBlockHash){
    let resp = await this.get.storageProof(accountAddress, position, trustedBlockHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    console.assert(toBuffer(trustedBlockHash).equals(blockHashFromHeader))
    let stateRoot = VerifyProof.getStateRootFromHeader(resp.header)
    let stateRootFromProof = VerifyProof.getRootFromProof(resp.accountProof)
    console.assert(stateRoot.equals(stateRootFromProof))
    let account = await VerifyProof.getAccountFromProofAt(resp.accountProof, accountAddress)
    let storageRoot = VerifyProof.accountContainsStorageRoot(account)
    let storageRootFromProof = VerifyProof.getRootFromProof(resp.storageProof)
    console.assert(storageRoot.equals(storageRootFromProof))
    let storage = await VerifyProof.getStorageFromStorageProofAt(resp.storageProof, position)
    return storage
  }

  async _logAgainstBlockHash(txHash, indexOfLog, trustedBlockHash){
    // untested as of yet
    let resp = await this.get.receiptProof(txHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    console.assert(toBuffer(trustedBlockHash).equals(blockHashFromHeader))
    let receiptsRoot = VerifyProof.getReceiptsRootFromHeader(resp.header)
    let receiptsRootFromProof = VerifyProof.getRootFromProof(resp.receiptProof)
    console.assert(receiptsRoot.equals(receiptsRootFromProof))
    let receipt = await VerifyProof.getReceiptFromReceiptProofAt(resp.receiptProof, resp.txIndex)
    let log = await VerifyProof.receiptContainsLogAt(receipt, indexOfLog)
    return log
  }
}

module.exports = GetAndVerify

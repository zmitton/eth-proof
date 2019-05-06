const GetProof = require('./getProof')
const VerifyProof = require('./verifyProof')
const { toBuffer } = require('eth-util-lite')

class GetAndVerify{
  constructor(rpcProvider = "https://mainnet.infura.io"){
    this.get = new GetProof(rpcProvider)
  }

  async txAgainstBlockHash(txHash, trustedBlockHash){
    let resp = await this.get.transactionProof(txHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    if(!toBuffer(trustedBlockHash).equals(blockHashFromHeader)) throw new Error('BlockHash mismatch')
    let txRootFromHeader = VerifyProof.getTxsRootFromHeader(resp.header)
    let txRootFromProof = VerifyProof.getRootFromProof(resp.txProof)
    if(!txRootFromHeader.equals(txRootFromProof)) throw new Error('TxRoot mismatch')
    return VerifyProof.getTxFromTxProofAt(resp.txProof, resp.txIndex)
  }
  async receiptAgainstBlockHash(txHash, trustedBlockHash){
    let resp = await this.get.receiptProof(txHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    if(!toBuffer(trustedBlockHash).equals(blockHashFromHeader)) throw new Error('BlockHash mismatch')
    let receiptsRoot = VerifyProof.getReceiptsRootFromHeader(resp.header)
    let receiptsRootFromProof = VerifyProof.getRootFromProof(resp.receiptProof)
    if(!receiptsRoot.equals(receiptsRootFromProof)) throw new Error('ReceiptsRoot mismatch')
    return VerifyProof.getReceiptFromReceiptProofAt(resp.receiptProof, resp.txIndex)
  }
  async accountAgainstBlockHash(accountAddress, trustedBlockHash){
    let resp = await this.get.accountProof(accountAddress, trustedBlockHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    if(!toBuffer(trustedBlockHash).equals(blockHashFromHeader)) throw new Error('BlockHash mismatch')
    let stateRoot = VerifyProof.getStateRootFromHeader(resp.header)
    let stateRootFromProof = VerifyProof.getRootFromProof(resp.accountProof)
    if(!stateRoot.equals(stateRootFromProof)) throw new Error('StateRoot mismatch')
    return VerifyProof.getAccountFromProofAt(resp.accountProof, accountAddress)
  }
  async storageAgainstBlockHash(accountAddress, position, trustedBlockHash){
    let resp = await this.get.storageProof(accountAddress, position, trustedBlockHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    if(!toBuffer(trustedBlockHash).equals(blockHashFromHeader)) throw new Error('BlockHash mismatch')
    let stateRoot = VerifyProof.getStateRootFromHeader(resp.header)
    let stateRootFromProof = VerifyProof.getRootFromProof(resp.accountProof)
    if(!stateRoot.equals(stateRootFromProof)) throw new Error('StateRoot mismatch')
    let account = await VerifyProof.getAccountFromProofAt(resp.accountProof, accountAddress)
    let storageRoot = VerifyProof.accountContainsStorageRoot(account)
    let storageRootFromProof = VerifyProof.getRootFromProof(resp.storageProof)
    if(!storageRoot.equals(storageRootFromProof)) throw new Error('StorageRoot mismatch')
    return VerifyProof.getStorageFromStorageProofAt(resp.storageProof, position)
  }

  async _logAgainstBlockHash(txHash, indexOfLog, trustedBlockHash){
    // untested as of yet
    let resp = await this.get.receiptProof(txHash)
    let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(resp.header)
    if(!toBuffer(trustedBlockHash).equals(blockHashFromHeader)) throw new Error('BlockHash mismatch')
    let receiptsRoot = VerifyProof.getReceiptsRootFromHeader(resp.header)
    let receiptsRootFromProof = VerifyProof.getRootFromProof(resp.receiptProof)
    if(!receiptsRoot.equals(receiptsRootFromProof)) throw new Error('ReceiptsRoot mismatch')
    let receipt = await VerifyProof.getReceiptFromReceiptProofAt(resp.receiptProof, resp.txIndex)
    return VerifyProof.receiptContainsLogAt(receipt, indexOfLog)
  }
}

module.exports = GetAndVerify

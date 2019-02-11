const VerifyProof = require('./verify')
const GetProof = require('./getProof')

const Branch = require('./branch') //put this in utils instead

const { keccak, encode, decode, toBuffer, toHex, toWord, mappingAt } = require('./ethUtils')

const { promisfy } = require('promisfy')


class GetAndVerify{
  constructor(rpcProvider = "http://localhost:8545"){
    this.get = new GetProof(rpcProvider)
  }

  async txAgainstBlockHash(txHash, blockHash){
    let prf = await this.get.transactionProof(txHash)
    VerifyProof.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    VerifyProof.headerContainsTxsRoot(prf.header, Branch.root(prf.branch))
    VerifyProof.rootContainsBranch(Branch.root(prf.branch), prf.branch)
    VerifyProof.txsBranchContainsTxAt(prf.branch, prf.tx, prf.txIndex)
    return prf.tx
  }
  async receiptAgainstBlockHash(txHash, blockHash){
    let prf = await this.get.receiptProof(txHash)
    VerifyProof.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    VerifyProof.headerContainsReceiptsRoot(prf.header, Branch.root(prf.branch))
    VerifyProof.rootContainsBranch(Branch.root(prf.branch), prf.branch)
    VerifyProof.receiptsBranchContainsReceiptAt(prf.branch, prf.receipt, prf.txIndex)
    return prf.receipt
  }
  async accountAgainstBlockHash(accountAddress, blockHash){
    let prf = await this.get.accountProof(accountAddress, blockHash)
    VerifyProof.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    VerifyProof.headerContainsStateRoot(prf.header, Branch.root(prf.accountBranch))
    VerifyProof.rootContainsBranch(Branch.root(prf.accountBranch), prf.accountBranch)
    VerifyProof.accountBranchContainsAccountAt(prf.accountBranch, prf.account, accountAddress)
    return prf.account
  }
  async storageAgainstBlockHash(accountAddress, position, blockHash){
    let prf = await this.get.storageProof(accountAddress, position, blockHash)
    VerifyProof.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    VerifyProof.headerContainsStateRoot(prf.header, Branch.root(prf.accountBranch))
    VerifyProof.rootContainsBranch(Branch.root(prf.accountBranch), prf.accountBranch)
    VerifyProof.accountBranchContainsAccountAt(prf.accountBranch, prf.account, accountAddress)
    VerifyProof.accountContainsStorageRoot(prf.account, Branch.root(prf.storageBranch))
    VerifyProof.rootContainsBranch(Branch.root(prf.storageBranch), prf.storageBranch)
    VerifyProof.storageBranchContainsStorageAt(prf.storageBranch, prf.storage, position)
    return prf.storage
  }

  async _logAgainstBlockHash(txHash, indexOfLog, blockHash){
    // this is untested as of yet
    let prf = await this.get.receiptProof(txHash)
    VerifyProof.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    VerifyProof.headerContainsReceiptsRoot(prf.header, Branch.root(prf.branch))
    VerifyProof.rootContainsBranch(Branch.root(prf.branch), prf.branch)
    VerifyProof.receiptsBranchContainsReceiptAt(prf.branch, prf.receipt, prf.txIndex)
    let log = prf.receipt.logs[indexOfLog]
    VerifyProof.receiptContainsLogAt(prf.receipt, log, indexOfLog)
    return log
  }
}

module.exports = GetAndVerify




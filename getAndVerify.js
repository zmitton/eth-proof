// const Trie = require('merkle-patricia-tree')
// const Rpc  = require('./iso-rpc')
const Verify = require('./verify')
const GetProof = require('./getProof')

// const Transaction    = require('ethereumjs-tx') //remove for dependency
// const Account    = require('./account')
const Branch = require('./branch')
// const Header = require('./header')
// const Receipt = require('./receipt')

const { keccak, encode, decode, toBuffer, toHex, toWord, mappingAt } = require('./ethUtils')

const { promisfy } = require('promisfy')


class GetAndVerify{
  constructor(rpcProvider = "http://localhost:8545"){
    this.get = new GetProof(rpcProvider)
  }

  async txAgainstBlockHash(txHash, blockHash){
    let prf = await this.get.transactionProof(txHash)
    Verify.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    Verify.headerContainsTxsRoot(prf.header, Branch.root(prf.branch))
    Verify.rootContainsBranch(Branch.root(prf.branch), prf.branch)
    Verify.txsBranchContainsTxAt(prf.branch, prf.tx, prf.txIndex)
    return prf.tx
  }
  async receiptAgainstBlockHash(txHash, blockHash){
    let prf = await this.get.receiptProof(txHash)
    Verify.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    Verify.headerContainsReceiptsRoot(prf.header, Branch.root(prf.branch))
    Verify.rootContainsBranch(Branch.root(prf.branch), prf.branch)
    Verify.receiptsBranchContainsReceiptAt(prf.branch, prf.receipt, prf.txIndex)
    return prf.receipt
  }
  async accountAgainstBlockHash(accountAddress, blockHash){
    let prf = await this.get.accountProof(accountAddress, [], blockHash)
    Verify.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    Verify.headerContainsStateRoot(prf.header, Branch.root(prf.accountBranch))
    Verify.rootContainsBranch(Branch.root(prf.accountBranch), prf.accountBranch)
    Verify.accountBranchContainsAccountAt(prf.accountBranch, prf.account, accountAddress)
    return prf.account
  }
  async storageAgainstBlockHash(accountAddress, position, blockHash){
    let prf = await this.get.storageProof(accountAddress, [position], blockHash)
    Verify.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    Verify.headerContainsStateRoot(prf.header, Branch.root(prf.accountBranch))
    Verify.rootContainsBranch(Branch.root(prf.accountBranch), prf.accountBranch)
    Verify.accountBranchContainsAccountAt(prf.accountBranch, prf.account, accountAddress)
    Verify.accountContainsStorageRoot(prf.account, Branch.root(prf.storageBranch))
    Verify.rootContainsBranch(Branch.root(prf.storageBranch), prf.storageBranch)
    Verify.storageBranchContainsStorageAt(prf.storageBranch, prf.storage, position)
    return prf.storage
  }

  async LogAgainstBlockHash(txHash, indexOfLog, blockHash){
    //test all this part
    let prf = await this.get.receiptProof(txHash)
    Verify.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    Verify.headerContainsReceiptsRoot(prf.header, Branch.root(prf.branch))
    Verify.rootContainsBranch(Branch.root(prf.branch), prf.branch)
    Verify.receiptsBranchContainsReceiptAt(prf.branch, prf.receipt, prf.txIndex)
    let log = prf.receipt.logs[indexOfLog]
    Verify.receiptContainsLogAt(prf.receipt, log, indexOfLog)
    return log
  }
}

module.exports = GetAndVerify




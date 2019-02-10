const Trie = require('merkle-patricia-tree')
const Rpc  = require('./iso-rpc')

const Transaction    = require('ethereumjs-tx')
const Account    = require('./account')
const Block = require('ethereumjs-block/from-rpc')
const Branch = require('./branch')
const Header = require('./header')
const Verify = require('./verify')
const Receipt = require('./receipt')

const U = require('ethereumjs-util')
const [keccak, encode, decode, toBuffer, toHex] = require('./ethUtils')


const {promisfy, _} = require('promisfy')


class BuildProof{
  constructor(rpcProvider = "http://localhost:8545"){
    this.rpc = new Rpc(rpcProvider)
  }

      // blockHash: U.toBuffer(transaction.blockHash),
      // header:    BuildProof._getHeaderBytes(block),
      // branch: BuildProof._rawStack(stack),
      // // path: targetPath,
      // // value: rawTxNode.value


  async txAgainstTxRoot(txHash, txRoot){
    let prf = await this.getTransactionProof(txHash)
    Verify.rootContainsBranch(prf.branch.root(), prf.branch)
    Verify.txsBranchContainsTxAt(prf.branch, prf.tx, prf.txIndex)
    return prf.tx
  }
  async txAgainstBlockHash(txHash, blockHash){
    let prf = await this.getTransactionProof(txHash)
    Verify.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    Verify.headerContainsTxsRoot(prf.header, prf.branch.root())
    Verify.rootContainsBranch(prf.branch.root(), prf.branch)
    Verify.txsBranchContainsTxAt(prf.branch, prf.tx, prf.txIndex)
    return prf.tx
  }
  //  async txAgainstWorkChain(txHash, workChain) => tx

   async receiptAgainstReceiptsRoot(txHash, receiptsRoot){
    let prf = await this.getReceiptProof(txHash)
    Verify.rootContainsBranch(prf.branch.root(), prf.branch)
    Verify.receiptsBranchContainsReceiptAt(prf.branch, prf.receipt, prf.txIndex)
    return prf.receipt
   }
   async receiptAgainstBlockHash(txHash, blockHash){
    let prf = await this.getReceiptProof(txHash)
    Verify.blockhashContainsHeader(toBuffer(blockHash), prf.header)
    Verify.headerContainsReceiptsRoot(prf.header, prf.branch.root())
    Verify.rootContainsBranch(prf.branch.root(), prf.branch)
    Verify.receiptsBranchContainsReceiptAt(prf.branch, prf.receipt, prf.txIndex)
    return prf.receipt
   }
  //  async receiptAgainstWorkChain(txHash, workChain) => receipt

  //  async accountAgainstStateRoot(accountAddress, stateRoot) => account
  //  async accountAgainstBlockHash(accountAddress, blockHash) => account
  //  async accountAgainstWorkChain(accountAddress, workChain) => account

  //  async storageAgainstStorageRoot(accountAddress, storageAddress, storageRoot) => storage
  //  async storageAgainstBlockHash(accountAddress, storageAddress, blockHash) => storage
  //  async storageAgainstWorkChain(accountAddress, storageAddress, workChain) => storage










  async getProof(address, storageAddresses, blockHash){
    let rpcBlock, rpcProof
    if(blockHash){//function overloading
      rpcBlock = await this.rpc.eth_getBlockByHash(blockHash, false)
    }else{
      rpcBlock = await this.rpc.eth_getBlockByNumber('latest', false)
    }
    rpcProof = await this.rpc.eth_getProof(address, storageAddresses, rpcBlock.number)

    return {
      header: new Block(rpcBlock).header.raw,
      accountBranch: Branch.fromRpc(rpcProof.accountProof),
      account: Account.fromRpc(rpcProof)
    }
  }


  async _getProofWithBlockHash(address, storageAddresses, blockHash){

    // let header = new Block(rpcBlock).header
    // let accountBranch = Branch.fromRpc(rpcProof.accountProof)
    // let account = Account.fromRpc(rpcProof)



    // console.log(header)
    // console.log(decode(BuildProof._getHeaderBytes(rpcBlock)))
    // console.log("HEREEEEEEEE", new Block(rpcBlock).header.hash())
    // console.log("HEREEEEEEEE", rpcBlock)
    // storageAddresses = storageAddresses.map((storageAddress)=>{
    //   return U.bufferToHex(BuildProof.toWord(storageAddress))
    // })

// console.log("----->\n",[address, storageAddresses, rpcBlock.number])
    // let prfResponse = await promisfy(
    //   this.web3.currentProvider.send,
    //   this.web3.currentProvider
    // )({
    //   jsonrpc: "2.0",
    //   method: "eth_getProof",
    //   // params: [address, storageAddresses, "0x" + rpcBlock.number.toString(16)],
    //   params: [address, storageAddresses, rpcBlock.number],
    //   id: 0
    // })


    // merkleProofFromRpc.block = rpcBlock

    // BuildProof.sanitizeResponse(
    //   merkleProofFromRpc,
    //   address,
    //   storageAddresses,
    //   blockNumber
    // )

    // if(prfResponse.error){ throw new Error(prfResponse.error.message) }
// console.log("prf.result----->\n",prfResponse)

    // for (var i = 0; i < Object.keys(merkleProofFromRpc).length; i++) {
    //   output[Object.keys(merkleProofFromRpc)[i]] = merkleProofFromRpc[Object.keys(merkleProofFromRpc)[i]]
    // }

    // output.address = U.toBuffer(output.address)
    // console.log("AAAAAAAA", output)
    // output.account =     Account.fromRpc(merkleProofFromRpc)
    // console.log("BBBBBBBBB", output.account)
    // output.accountBytes = U.rlp.encode([
    //   U.toBuffer(output.nonce),
    //   U.toBuffer(output.balance),
    //   U.toBuffer(output.storageHash),
    //   U.toBuffer(output.codeHash)
    // ])
    // // output.accountBranch = BuildProof._getBranchBytes(merkleProofFromRpc.accountProof)
    // // output.headerBytes = BuildProof._getHeaderBytes(rpcBlock)
    // output.blockHashBytes = U.toBuffer(rpcBlock.hash)


    // // output.storageAddressBytes = U.toBuffer(merkleProofFromRpc.storageProof[0].key)
    // // output.storageValueBytes = U.toBuffer(merkleProofFromRpc.storageProof[0].value)
    // // output.storageBranchBytes = BuildProof._getBranchBytes(merkleProofFromRpc.storageProof[0].proof)

    // return output
  }

  async getAccountProof(address, blockHash){
    return await this.getProof(address, [], blockHash)
  }
  // todo: test multi-dimensional mappings
  async getStorageProof(address, storagePosition, blockHash){
    return await this.getProof(address, [storagePosition], blockHash)
  }
  async getStorageMappingProof(address, blockHash, ...keys){//first key is position of variable
    let key = BuildProof.mappingAt(keys)
    return await this.getProof(address, [key], blockHash)
  }

  async getTransactionProof(txHash){
    var targetTx = await this.rpc.eth_getTransactionByHash(txHash)
    // console.log(targetTx)
    if(!targetTx){ throw new Error("Tx not found. Use archive node")}

    var block = await this.rpc.eth_getBlockByHash(targetTx.blockHash, true)

    var trie = new Trie();

    await Promise.all(block.transactions.map((siblingTx, index) => {
      var siblingPath = U.rlp.encode(index)
    // let siblingPath = siblingTx.transactionIndex === "0x0" ? U.rlp.encode(0) : U.rlp.encode(siblingTx.transactionIndex)
      var serializedSiblingTx = new Transaction(siblingTx).serialize()
      // console.log("HHHHHHH", serializedSiblingTx)
      return promisfy(trie.put, trie)(siblingPath, serializedSiblingTx) 
    }))

    // console.log("INDEX: ",targetTx.transactionIndex)
    let targetPath = encode(targetTx.transactionIndex)
    var [rawTxNode,_,stack] = await promisfy(trie.findPath, trie)(targetPath)
// console.log("CCCCC ", trie.root)
    return {
      blockHash: U.toBuffer(targetTx.blockHash),
      header:    Header.fromRpc(block),//BuildProof._getHeaderBytes(block),
      branch: BuildProof._rawStack(stack),
      txIndex: targetTx.transactionIndex,
      // path: targetPath,
      value: rawTxNode.value,
      tx: new Transaction(targetTx).raw,
    }
  }

  async getReceiptProof(txHash){ //WIP
    var targetReceipt = await this.rpc.eth_getTransactionReceipt(txHash)
console.log("TTTTTT", targetReceipt.logs)
    if(!targetReceipt){ throw new Error("txhash/targetReceipt not found. (use Archive node)")}
let thing = Receipt.fromRpc(targetReceipt)
console.log("\nTHING\n", thing.raw(), "\nTHING\n")

    var block = await this.rpc.eth_getBlockByHash(targetReceipt.blockHash, false)

    var trie = new Trie();

    var receipts = await Promise.all(block.transactions.map((siblingTxHash) => {
      return this.rpc.eth_getTransactionReceipt(siblingTxHash)
    }))

    await Promise.all(receipts.map((siblingReceipt, index) => {
      var siblingPath = U.rlp.encode(index)
      // var rawReceipt = BuildProof._serializeReceipt(siblingReceipt)
      // if(siblingReceipt.logs.length > 2){console.log(siblingReceipt)}
      var rawReceipt = BuildProof._serializeReceipt(siblingReceipt)
if(siblingReceipt.transactionHash == txHash){
  // console.log("RRRRRR", rawReceipt)
  // console.log("\nDDDDDD\n", decode(rawReceipt))
}

      return promisfy(trie.put, trie)(siblingPath, rawReceipt)
    }))
    
// console.log("HHHHH ", targetReceipt, U.rlp.decode(BuildProof._serializeReceipt(targetReceipt)) ,"*********\n\n\n")
    let targetPath = encode(targetReceipt.transactionIndex)
    var [rawReceiptNode,_,stack] = await promisfy(trie.findPath, trie)(targetPath)
// if(!rawReceiptNode){ console.log("NNNNNN ", targetPath, targetReceipt.transactionIndex)}
    return {
      path:      targetPath,
      txIndex:   targetReceipt.transactionIndex,
      value:     rawReceiptNode.value,
      branch:    BuildProof._rawStack(stack),
      header:    BuildProof._getHeaderBytes(block),
      blockHash: U.toBuffer(targetReceipt.blockHash)
    }
    // return {
    //   // path:      targetPath,
    //   txIndex: targetReceipt.transactionIndex,
    //   value:     rawReceiptNode.value,
    //   branch:     BuildProof._rawStack(stack),
    //   header:    BuildProof._getHeaderBytes(block),
    //   blockHash: U.toBuffer(targetReceipt.blockHash)
    // }
  }

  async getLogProof(txHash, logIndex){
    let receiptProof = await this.getReceiptProof(txHash)
    return {
      rlpLogIndex: U.rlp.encode(logIndex),
      value: U.rlp.encode(U.rlp.decode(receiptProof.value)[3][logIndex]),
      rlpTxIndex: receiptProof.path,
      receipt: receiptProof.value,
      branch: receiptProof.branch,
      header: receiptProof.header,
      blockHash: receiptProof.blockHash,
    }
  }

  static mappingAt(...keys){ // first key is mapping's position
    keys[0] = BuildProof.toWord(keys[0])
    return keys.reduce((positionAccumulator, key)=>{
      return U.keccak(Buffer.concat([BuildProof.toWord(key) ,positionAccumulator]))
    })
  }

  static toWord(input){
    return U.setLengthLeft(U.toBuffer(U.addHexPrefix(input)), 32)
  }
    // if(_mappingKeys.length > 0){
    //   for(var i = 0 ; i < _mappingKeys.length ; i++){
    //     bufMappings.push(Buffer.from(leftPad(_mappingKeys[i]),'hex'))
    //     pathBuilder = Buffer.concat([bufMappings[i], pathBuilder])
    //   }
    //   pathBuilder = Buffer.from(sha3(pathBuilder),'hex')
    // }

    // var storagePath = Buffer.from(sha3(pathBuilder),'hex') //not going this far cause RPC doesnt expect it

//private methods
  static _serializeReceipt(receipt){
    var cumulativeGas = U.toBuffer(receipt.cumulativeGasUsed)
// console.log("cumulativeGas=== ", cumulativeGas, receipt.cumulativeGasUsed)
    var bloomFilter = U.toBuffer(receipt.logsBloom)
    var setOfLogs = BuildProof._rawLogs(receipt.logs)
    
    if(receipt.status != undefined && receipt.status != null){
      // var status = U.toBuffer(receipt.status)
      // This is to fix the edge case for passing integers as defined - https://github.com/ethereum/wiki/wiki/RLP
      if (receipt.status == "1" 
        || receipt.status == 1 
        || receipt.status == true
        || receipt.status == "true"
      ){
        var rawReceipt = [1,cumulativeGas,bloomFilter,setOfLogs]
      } else {
        var rawReceipt = [0,cumulativeGas,bloomFilter,setOfLogs]
      }
    }else{
      var postTransactionState = U.toBuffer(receipt.root)
      var rawReceipt = [postTransactionState,cumulativeGas,bloomFilter,setOfLogs]
    }
    return U.rlp.encode(rawReceipt)

  }
  static _rawLogs(input){
    var logs = []
    for (var i = 0; i < input.length; i++) {
      var address = U.toBuffer(input[i].address);
      var topics = input[i].topics.map(U.toBuffer)
      var data = U.toBuffer(input[i].data)
      logs.push([address, topics, data])
    }
    return logs
  }
  static _rawStack(input){
    let output = []
    for (var i = 0; i < input.length; i++) {
      output.push(input[i].raw)
    }
    return new Branch(output)
  }
  static _getHeaderBytes(_block) {
    if(typeof _block.difficulty == "string" && _block.difficulty.slice(0,2) != "0x"){
      console.log("suprised to be HERE  E&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
      _block.difficulty = '0x' + new U.BN(_block.difficulty).toString(16)
    }
    var block = new Block(_block)
    return U.rlp.encode(block.header.raw)
  }
  static _getBranchBytes(branchNodes){
    let rawbranchNodes = []
    for (var i = 0; i < branchNodes.length; i++) {
      rawbranchNodes.push(U.rlp.decode(U.toBuffer(branchNodes[i])))
    }
    return U.rlp.encode(rawbranchNodes)
  }

  static _getStorageAddressBytes(storageProof){
    return storageProof.key
  }
  static _getStorageValueBytes(storageProof){
    return 
  }
  static _getStorageBranchBytes(storageProof){
    return 
  }

  // static _serializeTx(r){
  //   let rpcTx = r
  //   rpcTx.gasPrice = U.addHexPrefix(new U.BN(rpcTx.gasPrice).toString(16))
  //   rpcTx.value = U.addHexPrefix(new U.BN(rpcTx.value).toString(16))
  //   let tx = new Transaction(rpcTx).serialize()
  //   return tx
  // }
  static _strToBuf(input){
    if(input.slice(0,2) == "0x"){
      return Buffer.from(BuildProof._byteable(input.slice(2)), "hex")
    }else{
      return Buffer.from(BuildProof._byteable(input), "hex") 
    }
  }
  static _numToBuf(input){ return Buffer.from(BuildProof._byteable(input.toString(16)), "hex") }

  static _byteable(input){ 
console.log("PPPPPPPPP", input)
    if(input.length % 2 == 0){
      return input
    }else if(input[0] != 0){
      return "0" + input 
    }else{
      return input.slice(1)
    }
  }

  static sanitizeResponse(merkleProofFromRpc, address, storageAddresses, blockNumberOrHash){
    // make sure the response corresponds to the data they requested
    console.assert(merkleProofFromRpc.address == address)
    console.assert(merkleProofFromRpc.block.hash == blockNumberOrHash
      || merkleProofFromRpc.block.number == blockNumberOrHash
      || blockNumberOrHash == 'latest'
      || blockNumberOrHash == 'earliest'
      || blockNumberOrHash == 'pending')
    
    for (var i = 0; i < storageAddresses.length; i++) {
      console.assert(merkleProofFromRpc.storageProof[i].key == U.keccak(storageAddresses[i]))
      merkleProofFromRpc.storageProof[i].key = BuildProof.toWord(merkleProofFromRpc.storageProof[i].key)
    }
  }
}

module.exports = BuildProof

// flock team: agaron 1
// aragon 1 blog
// aragon forum


// const Trie = require('merkle-patricia-tree')
// const sha3 = require('js-sha3').keccak_256
// const rlp = require('rlp');

// const Web3 = require('web3');
// const EthereumTx = require('ethereumjs-tx');
// const EthereumBlock = require('ethereumjs-block/from-rpc')

// const {promisfy, waitFor} = require('promisfy');

// // public methods all prove commitment to a blockHash
// // ideally they should prove against a hash*chain* but nobody has built that yet
// // all args currently expect Buffers
// // ToDo: they should all only take one proofNodes array merge header into branch 

// class EthProof{
//   constructor(){ throw new Error("Directly use static functions for verification") }

//   static verifyHeader(header, blockHash){
//     if(Buffer.from(sha3(header),'hex').equals(blockHash)){
//       return true
//     }else{
//       throw new Error("invalid header/blockhash")
//     }
//   }

//   static verifyAccount(address, account, branch, header, blockHash){
//     let stateRoot = rlp.decode(header)[3]
//     let hashedAddress = Buffer.from(sha3(address),'hex')

//     let headerVer = this.verifyHeader(header, blockHash)
//     let accountVer = this.verifyTrieValue(hashedAddress, account, branch, stateRoot)
//     return headerVer && accountVer
//   }
//   static verifyTransaction(txIndex, tx, branch, header, blockHash) {
//     let txRoot = rlp.decode(header)[4]

//     let headerVer = this.verifyHeader(header, blockHash)
//     let txVer = this.verifyTrieValue(txIndex, tx, branch, txRoot)
//     return headerVer && txVer
//   }
//   static verifyReceipt(txIndex, receipt, branch, header, blockHash) {
//     let receiptsRoot = rlp.decode(header)[5]

//     let headerVer = this.verifyHeader(header, blockHash)
//     let receiptVer = this.verifyTrieValue(txIndex, receipt, branch, receiptsRoot)
//     return headerVer && receiptVer
//   }

//   //getting the storage index: 
//   //https://github.com/ethereum/wiki/wiki/JSON-RPC#example-14
//   //its unclear if zero is implemented as <>, <00>, or <80>
//   //untested!
//   static verifyStorage(storagePath, storageValue, storageBranch, address, account, branch, header, blockHash){
//     let storageHash = rlp.decode(account)[2] //STORAGEROOTINDEX = 2
//     let accountVer = this.verifyAccount(address, account, branch, header, blockHash)
//     let storageVer = this.verifyTrieValue(storagePath, storageValue, storageBranch, storageHash)
//     return accountVer && storageVer
//   }
//   //todo: functions for verifying solidity?
//   static verifyByteCode(address, byteCode, account, branch, header, blockHash){
//     let accountVer = this.verifyAccount(address, account, branch, header, blockHash)
//     if(Buffer.from(sha3(byteCode),'hex').equals(rlp.decode(account)[3])){
//       return true
//     }else{
//       throw new Error("invalid bytecode or proof given")
//     }
//   }
//   static verifyLog(logIndex, log, txIndex, receipt, branch, header, blockHash){
//     let receiptVer = this.verifyReceipt(txIndex, receipt, branch, header, blockHash)
//     if(rlp.encode(rlp.decode(receipt)[3][logIndex]).equals(log)){
//       return true
//     }else{
//       throw new Error("invalid bytecode or proof given")
//     }
//   }

//   static verifyTrieValue(path, value, branch, root){
//     let complete, error = false

//     branch = this._encodeBranch(branch)

//     Trie.verifyProof('0x'+root.toString('hex'), path, branch, (e,r)=>{
//       complete = true
//       error = e
//     })
//     while(!complete){/*wait*/}
    
//     if(error){
//       throw Error(e)
//     }else{
//       return true
//     }
//   }
// //private
//   static _encodeBranch(inputBranch){
//     var encodedBranch = []
//     var branchArr = rlp.decode(inputBranch)
//     for (var i = 0; i < branchArr.length; i++) {
//       encodedBranch.push('0x'+branchArr[i].toString('hex'))
//     }
//     return encodedBranch
//   }
//   static _putReceipt(siblingReceipt,eceiptsTrie, blockNum, cb2){//need siblings to rebuild trie
//     var path = siblingReceipt.transactionIndex
//     var cummulativeGas = EthProof._numToBuf(siblingReceipt.cumulativeGasUsed)
//     var bloomFilter = EthProof._strToBuf(siblingReceipt.logsBloom)
//     var setOfLogs = this._encodeLogs(siblingReceipt.logs)
    
//     if(siblingReceipt.status != undefined && siblingReceipt.status != null){
//       var status = EthProof._strToBuf(siblingReceipt.status)
//       // This is to fix the edge case for passing integers as defined - https://github.com/ethereum/wiki/wiki/RLP
//       if (status.toString('hex') == 1) {
//         var rawReceipt = rlp.encode([1,cummulativeGas,bloomFilter,setOfLogs])
//       } else {
//         var rawReceipt = rlp.encode([0,cummulativeGas,bloomFilter,setOfLogs])
//       }
//     }else{
//       var postTransactionState = EthProof._strToBuf(siblingReceipt.root)
//       var rawReceipt = rlp.encode([postTransactionState,cummulativeGas,bloomFilter,setOfLogs])
//     }

//     receiptsTrie.put(rlp.encode(path), rawReceipt, function (error) {
//       error != null ? cb2(error, null) : cb2(error, true)
//     })
//   }
//   static _encodeLogs(input){
//     var logs = []
//     for (var i = 0; i < input.length; i++) {
//       var address = EthProof._strToBuf(input[i].address);
//       var topics = input[i].topics.map(EthProof._strToBuf)
//       var data = EthProof._strToBuf(input[i].data)
//       logs.push([address, topics, data])
//     }
//     return logs
//   }
//   static _rawStack(input){
//     output = []
//     for (var i = 0; i < input.length; i++) {
//       output.push(input[i].raw)
//     }
//     return rlp.encode(output)
//   }
//   // static headString(block){
//   //   return "0x"+rlp.encode(EthProof._getHeaderBytes(block)).toString('hex')
//   // }

//   static _getHeaderBytes(_block) {
//     _block.difficulty = '0x' + parseInt(_block.difficulty).toString(16)
//     var block = new EthereumBlock(_block)
//     return rlp.encode(block.header.raw)
//   }
//   static _getAccountNodesBytes(accountNodes){
//     let rawAccountNodes = []
//     for (var i = 0; i < accountNodes.length; i++) {
//       rawAccountNodes.push(EthProof._strToBuf(accountNodes[i]))
//     }
//     return rlp.encode(rawAccountNodes)
//   }

//   static _squanchTx(rpcTx){
//     tx = new EthereumTx(squanchTx(rpcTx))
//     tx.gasPrice = '0x' + tx.gasPrice.toString(16)
//     tx.value = '0x' + tx.value.toString(16)
//     return tx.serialize();
//   }
//   static _strToBuf(input){ 
//     if(input.slice(0,2) == "0x"){
//       return Buffer.from(this._byteable(input.slice(2)), "hex")
//     }else{
//       return Buffer.from(this._byteable(input), "hex") 
//     }
//   }
//   static _numToBuf(input){ return Buffer.from(this._byteable(input.toString(16)), "hex") }

//   static _byteable(input){ 
//     if(input.length % 2 == 0){
//       return input
//     }else if(input[0] != 0){
//       return "0" + input 
//     }else{
//       return input.slice(1)
//     }
//   }
// }


// // VerifyProof.verifyStorageAtIndex = (storageIndex, storageValue, storagebranch, address, accountbranch, header, blockHash) => {
// //   try{
// //     var storagePath = Buffer.from(sha3(Buffer.from(leftPad(storageIndex.toString('hex')),'hex')),'hex')
// //     return VerifyProof.verifyStorage(storagePath, storageValue, storagebranch, address, accountbranch, header, blockHash)
// //   }catch(e){ console.log(e) }
// //   return false
// // }

// // untested for multi dimensional mappings
// // VerifyProof.verifyStorageMapping = (storageIndex, mappings, storageValue, storagebranch, address, accountbranch, header, blockHash) => {
// //   try{
// //     var pathBuilder = Buffer.from(leftPad(storageIndex.toString('hex')),'hex')
    
// //     for(var i = 0 ; i < mappings.length ; i++){
// //       pathBuilder = Buffer.concat([Buffer.from(leftPad(mappings[i].toString('hex')),'hex'), pathBuilder])
// //     }
// //     pathBuilder = Buffer.from(sha3(pathBuilder),'hex')

// //     var storagePath = Buffer.from(sha3(pathBuilder),'hex')
// //     return VerifyProof.verifyStorage(storagePath, storageValue, storagebranch, address, accountbranch, header, blockHash)
// //   }catch(e){ console.log(e) }
// //   return false
// // }


// // VerifyProof.verifyostTransactionState = () => { }
// // VerifyProof.verifyCummulativeGas = () => { }



// // module.exports = BuildProof








// module.exports = EthProof



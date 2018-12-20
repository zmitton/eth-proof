const Trie = require('merkle-patricia-tree');
const rlp = require('rlp');
const Web3 = require('web3');
// const async = require('async')
const EthereumTx = require('ethereumjs-tx');
const EthereumBlock = require('ethereumjs-block/from-rpc')
const levelup = require('levelup');
const sha3 = require('js-sha3').keccak_256

//todo: add getAndProve functions

// class Proof {
//   // basically merges info from 2 rpc requests
//   // and formats data required by verifier
//   constructor(prfResult, blockResult){
//     this.block = blockResult

//     for (var i = 0; i < Object.keys(prfResult).length; i++) {
//       this[Object.keys(prfResult)[i]] = prfResult[Object.keys(prfResult)[i]]
//     }

//     this.addressBytes = strToBuf(this.address)
//     this.accountBytes = rlp.encode([
//       strToBuf(this.nonce),
//       strToBuf(this.balance),
//       strToBuf(this.storageHash),
//       strToBuf(this.codeHash)
//     ])
//     this.branchBytes = getAccountNodesBytes(prfResult.accountProof)
//     this.headerBytes = getHeaderBytes(blockResult)
//     this.blockHashBytes = strToBuf(this.block.hash)
//   }
// }


var BuildProof = function(web3Provider = "http://localhost:8545"){
  this.web3 = new Web3(web3Provider)
  // this.web3.eth.getProof = this.web3.eth.getProof || this.getProof
};

BuildProof.prototype.getProof = async function(address, storageSlots = [], blockNumberOrHash = "latest"){
  let web3 = this.web3

  let blockResponse = await this.web3.eth.getBlock(blockNumberOrHash)

  function send(data) {
    return new Promise(function(resolve, reject) {
      web3.currentProvider.send(data, function(e,r){
        if(e){ reject(e)
        }else{ resolve(r) }
      });
    })
  }

  let prfResponse = await send({
    jsonrpc: "2.0",
    method: "eth_getProof",
    params: [address, storageSlots, "0x" + blockResponse.number.toString(16)],
    id: 0
  })
  // console.log("QQQQQ", block)
  let output = {}

  output.block = blockResponse

  for (var i = 0; i < Object.keys(prfResponse.result).length; i++) {
    output[Object.keys(prfResponse.result)[i]] = prfResponse.result[Object.keys(prfResponse.result)[i]]
  }

  output.addressBytes = strToBuf(output.address)
  output.accountBytes = rlp.encode([
    strToBuf(output.nonce),
    strToBuf(output.balance),
    strToBuf(output.storageHash),
    strToBuf(output.codeHash)
  ])
  output.branchBytes = getAccountNodesBytes(prfResponse.result.accountProof)
  output.headerBytes = getHeaderBytes(blockResponse)
  output.blockHashBytes = strToBuf(output.block.hash)


  console.log("EEEE", output, "eeeee")
  return output
}

BuildProof.prototype.getAccountProof = async function(address, blockNumberOrHash = "latest"){
  try{
    let proof = await this.getProof(address, [], blockNumberOrHash)
    return proof
  }catch(e){ return e }
}
// not yet tested for multi-dimentional mappings
BuildProof.prototype.getStorageProof = async function(address, storageSlots = [], blockNumberOrHash = "latest"){
  try{
    let proof = await this.getProof(address, storageSlots, blockNumberOrHash)
    return(proof)
  }catch(e){ return e }
}
// BuildProof.prototype.getNonceProof = async function(address, blockNumberOrHash = "latest"){
//   return this.getAccountProof(address).then((prf)=>{
//     return new Promise((accept, reject) => {
//         prf.value = prf.value[0]
//         accept(prf)
//     })
//   })
// }
// BuildProof.prototype.getBalanceProof = function(address){
//   return this.getAccountProof(address).then((prf)=>{
//     return new Promise((accept, reject) => {
//         prf.value = prf.value[1]
//         accept(prf)
//     })
//   })
// }
// BuildProof.prototype.getStorageRootProof = function(address){
//   return this.getAccountProof(address).then((prf)=>{
//     return new Promise((accept, reject) => {
//         prf.value = prf.value[2]
//         accept(prf)
//     })
//   })
// }
// BuildProof.prototype.getCodeHashProof = function(address){
//   return this.getAccountProof(address).then((prf)=>{
//     return new Promise((accept, reject) => {
//         prf.value = prf.value[3]
//         accept(prf)
//     })
//   })
// }

// BuildProof.prototype.getCodeProof = function(address){
//   self = this
//   return this.getCodeHashProof(address).then((prf)=>{
//     return new Promise((accept, reject) => {
//       self.web3.eth.getCode(address,'latest', function(e,code){
//         if(e || !code){reject(e || 'no code found')}
//         prf.value = strToBuf(code)
//         accept(prf)
//       })
//     })
//   })
// }

BuildProof.prototype.getTransactionProof = function(txHash){
  self = this;
  return new Promise((accept, reject) => {
    try{
      self.web3.eth.getTransaction(txHash, function(e,transaction){
        if(e || !transaction){ return reject(e || "transaction not found")}
        self.web3.eth.getBlock(transaction.blockHash, true, function(e,block){
          if(e || !block){ return reject(e || "block not found")}
          var txTrie = new Trie();
          b = block;
          async.map(block.transactions, function(siblingTx, cb2){//need siblings to rebuild trie
            var path = rlp.encode(siblingTx.transactionIndex)
            var rawSignedSiblingTx = new EthereumTx(squanchTx(siblingTx)).serialize()
            txTrie.put(path, rawSignedSiblingTx, function (error) {
              if(error != null){ cb2(error, null); }else{ cb2(null, true) }
            })
          }, function(e,r){
            //might need work. lookup old version!
            txTrie.findPath(rlp.encode(transaction.transactionIndex), function(e,rawReceiptNode,remainder,stack){
              var prf = {
                blockHash: strToBuf(transaction.blockHash),
                header:    getHeaderBytes(block),
                parentNodes: rawStack(stack),
                path: rlp.encode(transaction.transactionIndex),
                value: "not used anymore" //rlp.decode(rawTxNode.value)
              }
              return accept(prf)
            })
          });
        })
      })
    }catch(e){ return reject(e)}
  })
}


BuildProof.prototype.getReceiptProof = function(txHash){
  self = this;
  return new Promise ((accept, reject) => {
    self.web3.eth.getTransactionReceipt(txHash, function(e,receipt){
      if(e || !receipt){ return reject("receipt not found")}
      self.web3.eth.getBlock(receipt.blockHash, false, function(e,block){
        if(e || !block){ return reject("block not found")}
        var receiptsTrie = new Trie();
        async.map(block.transactions,function(siblingTxHash, cb2){
          self.web3.eth.getTransactionReceipt(siblingTxHash, function(e,siblingReceipt){
            putReceipt(siblingReceipt, receiptsTrie, block.number, cb2)
          })
        }, function(e,r){
          receiptsTrie.findPath(rlp.encode(receipt.transactionIndex), function(e,rawReceiptNode,remainder,stack){
            var prf = {
              blockHash: strToBuf(receipt.blockHash),
              header:    getHeaderBytes(block),
              parentNodes:     rawStack(stack),
              path:      rlp.encode(receipt.transactionIndex),
              value:     rlp.decode(rawReceiptNode.value)
            }
            return accept(prf)
          })
        });
      })
    })
  })
}

BuildProof.prototype.getLogProof = function(txHash, logIndex){
  self = this
  return this.getReceiptProof(txHash).then((receiptProof)=>{
    return new Promise((accept, reject) => {
      // if(e || !code){reject(e || 'no code found')}
      var receipt = receiptProof.value
      var logs = receipt[3]
      var value = logs[logIndex]
      var prf = {
        blockHash: receiptProof.blockHash,
        header: receiptProof.header,
        parentNodes: receiptProof.parentNodes,
        path: receiptProof.path,
        logIndex: logIndex,
        value: value
      }
      accept(prf)
    })
  })
}


var putReceipt = (siblingReceipt, receiptsTrie, blockNum, cb2) => {//need siblings to rebuild trie
  var path = siblingReceipt.transactionIndex
  var cummulativeGas = numToBuf(siblingReceipt.cumulativeGasUsed)
  var bloomFilter = strToBuf(siblingReceipt.logsBloom)
  var setOfLogs = encodeLogs(siblingReceipt.logs)
  
  if(siblingReceipt.status != undefined && siblingReceipt.status != null){
    var status = strToBuf(siblingReceipt.status)
    // This is to fix the edge case for passing integers as defined - https://github.com/ethereum/wiki/wiki/RLP
    if (status.toString('hex') == 1) {
      var rawReceipt = rlp.encode([1,cummulativeGas,bloomFilter,setOfLogs])
    } else {
      var rawReceipt = rlp.encode([0,cummulativeGas,bloomFilter,setOfLogs])
    }
  }else{
    var postTransactionState = strToBuf(siblingReceipt.root)
    var rawReceipt = rlp.encode([postTransactionState,cummulativeGas,bloomFilter,setOfLogs])
  }

  receiptsTrie.put(rlp.encode(path), rawReceipt, function (error) {
    error != null ? cb2(error, null) : cb2(error, true)
  })
}
var encodeLogs = (input) => {
  var logs = []
  for (var i = 0; i < input.length; i++) {
    var address = strToBuf(input[i].address);
    var topics = input[i].topics.map(strToBuf)
    var data = strToBuf(input[i].data)
    logs.push([address, topics, data])
  }
  return logs
}
var rawStack = (input) => {
  output = []
  for (var i = 0; i < input.length; i++) {
    output.push(input[i].raw)
  }
  return output
}
var headString = (block) =>{
  return "0x"+rlp.encode(getHeaderBytes(block)).toString('hex')
}

var getHeaderBytes = (_block) => {
  _block.difficulty = '0x' + parseInt(_block.difficulty).toString(16)
  var block = new EthereumBlock(_block)
  return rlp.encode(block.header.raw)
}
var getAccountNodesBytes = (accountNodes) => {
  let rawAccountNodes = []
  for (var i = 0; i < accountNodes.length; i++) {
    rawAccountNodes.push(strToBuf(accountNodes[i]))
    console.log(rawAccountNodes[i])
    console.log("nodeSHA", sha3(accountNodes[i]))
  }
  return rlp.encode(rawAccountNodes)
}

var squanchTx = (tx) => {
  tx.gasPrice = '0x' + tx.gasPrice.toString(16)
  tx.value = '0x' + tx.value.toString(16)
  return tx;
}
var strToBuf = (input)=>{ 
  if(input.slice(0,2) == "0x"){
    return Buffer.from(byteable(input.slice(2)), "hex")
  }else{
    return Buffer.from(byteable(input), "hex") 
  }
}
var numToBuf = (input)=>{ return Buffer.from(byteable(input.toString(16)), "hex") }
var byteable = (input)=>{ 
  if(input.length % 2 == 0){
    return input
  }else if(input[0] != 0){
    return "0" + input 
  }else{
    return input.slice(1)
  }
}

module.exports = BuildProof



// var leftPad = (str) => {
//   return ("0000000000000000000000000000000000000000000000000000000000000000"+str).substring(str.length)
// }


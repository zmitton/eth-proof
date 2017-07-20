Trie = require('merkle-patricia-tree');
rlp = require('rlp');
const Web3 = require('web3');
async = require('async')
EthereumTx = require('ethereumjs-tx');
EthereumBlock = require('ethereumjs-block/from-rpc')

// remove
levelup = require('levelup');
sha3 = require('js-sha3').keccak_256
utils = require('ethereumjs-util')


//EthProof
EP = function(web3Provider, blockHash, dbPath /*can I fetch this?*/){
  this.web3 = new Web3(web3Provider)
  if(blockHash != undefined){
    this.blockHash = blockHash
    if(dbPath != undefined){
      this.db = levelup(dbPath); //required for account/state proofs
    }
  }
};


EP.prototype.getOrInitStateTrie = function(){
  var self = this
  return new Promise((accept, reject) => {
    if(self.block){
      accept()
    }else if(self.blockHash !== undefined){
      self.web3.eth.getBlock('0x' + self.blockHash, (e,block)=>{
        if(e || !block){ return reject(e || "block not found")}
        if(self.block === undefined){
          self.block = block
        }
        accept()
      })
    }else{
      reject("must init EthProof with a blockhash to do that")
    }
  })
}

EP.prototype.getAccountProof = function(address){
  self = this
  return self.getOrInitStateTrie().then(()=>{
    return new Promise((accept, reject) => {
        var path = new Buffer(sha3(new Buffer(address,'hex')),'hex')

        var stateTrie = new Trie(self.db, Buffer.from(self.block.stateRoot.slice(2),'hex'))
        stateTrie.findPath(path, (e,accountNode,remainder,stack) => {
          if(e || !accountNode){ return reject(e || "accountNode not found")}
            var prf = {
              blockhash: new Buffer(self.blockHash,'hex'),
              header:    getRawHeader(self.block),
              stack:     rawStack(stack),
              address:   Buffer.from(address,'hex'),
              value:     rlp.decode(accountNode.value)
            }
          accept(prf)
        })
    })
  })
}
EP.prototype.getNonceProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.nonce = prf.value[0]
        accept(prf)
    })
  })
}
EP.prototype.getBalanceProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.balance = prf.value[1]
        accept(prf)
    })
  })
}
EP.prototype.getStorageRootProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.balance = prf.value[2]
        accept(prf)
    })
  })
}
EP.prototype.getCodeHashProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.balance = prf.value[3]
        accept(prf)
    })
  })
}



leftPad = (str) => {
  return ("0000000000000000000000000000000000000000000000000000000000000000"+str).substring(str.length)
}

EP.prototype.getTransactionProof = function(txHash){
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
            txTrie.findPath(rlp.encode(transaction.transactionIndex), function(e,rawTxNode,remainder,stack){
              var prf = {
                blockhash: new Buffer(transaction.blockHash.slice(2),'hex'),
                header:    getRawHeader(block),
                stack:     rawStack(stack),
                path:      rlp.encode(transaction.transactionIndex),
                value:     rlp.decode(rawTxNode.value)
              }
              return accept(prf)
            })
          });
        })
      })
    }catch(e){ return reject(e)}
  })
}

EP.prototype.getReceiptProof = function(txHash){
  self = this;
  return new Promise ((accept, reject) => {
    self.web3.eth.getTransactionReceipt(txHash, function(e,receipt){
      if(e || !receipt){ return reject("receipt not found")}
      self.web3.eth.getBlock(receipt.blockHash, false, function(e,block){
        if(e || !block){ return reject("block not found")}
        var receiptsTrie = new Trie();
        async.map(block.transactions,function(siblingTxHash, cb2){
          self.web3.eth.getTransactionReceipt(siblingTxHash, function(e,siblingReceipt){
            putReceipt(siblingReceipt, receiptsTrie, cb2)
          })
        }, function(e,r){
          receiptsTrie.findPath(rlp.encode(receipt.transactionIndex), function(e,rawReceiptNode,remainder,stack){
            var prf = {
              blockhash: new Buffer(receipt.blockHash.slice(2),'hex'),
              header:    getRawHeader(block),
              stack:     rawStack(stack),
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

var putReceipt = (siblingReceipt, receiptsTrie, cb2) => {//need siblings to rebuild trie
  var path = siblingReceipt.transactionIndex

  var postTransactionState = strToBuf(siblingReceipt.root)
  var cummulativeGas = numToBuf(siblingReceipt.cumulativeGasUsed)
  var bloomFilter = strToBuf(siblingReceipt.logsBloom)
  var setOfLogs = encodeLogs(siblingReceipt.logs)

  var rawReceipt = rlp.encode([postTransactionState,cummulativeGas,bloomFilter,setOfLogs])
  receiptsTrie.put(rlp.encode(path), rawReceipt, function (error) {
    error != null ? cb2(error, null) : cb2(error, true)
  })
}

var encodeLogs = (input) => {
  var logs = []
  for (var i = 0; i < input.length; i++) {
    var address = strToBuf(input[i].address);
    var topics = input[i].topics.map(strToBuf)
    var data = Buffer.from(input[i].data.slice(2),'hex')
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

var getRawHeader = (_block) => {
  if(typeof _block.difficulty != 'string'){
    _block.difficulty = '0x' + _block.difficulty.toString(16)
  }
  var block = new EthereumBlock(_block)
  return block.header.raw
}

var squanchTx = (tx) => {
  tx.gasPrice = '0x' + tx.gasPrice.toString(16)
  tx.value = '0x' + tx.value.toString(16)
  return tx;
}

var strToBuf = (input)=>{ return new Buffer(byteable(input.slice(2)), "hex") }
var numToBuf = (input)=>{ return new Buffer(byteable(input.toString(16)), "hex") }
var byteable = (input)=>{ return input.length % 2 == 0 ? input : "0" + input }

module.exports = EP

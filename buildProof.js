const Trie = require('merkle-patricia-tree');
const rlp = require('rlp');
const Web3 = require('web3');
const async = require('async')
const EthereumTx = require('ethereumjs-tx');
const EthereumBlock = require('ethereumjs-block/from-rpc')
const levelup = require('levelup');
const sha3 = require('js-sha3').keccak_256

var BuildProof = function(web3Provider, blockHash, dbPath /*optional*/){
  this.web3 = new Web3(web3Provider)
  if(blockHash != undefined){
    this.blockHash = blockHash
    if(dbPath != undefined){
      this.db = levelup(dbPath); //required only for account/state proofs
    }
  }
};

BuildProof.prototype.getOrInitStateTrie = function(){
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
      reject("must init BuildProof with a blockHash to do that")
    }
  })
}

BuildProof.prototype.getAccountProof = function(address){
  self = this
  return self.getOrInitStateTrie().then(()=>{
    return new Promise((accept, reject) => {
      var path = Buffer.from(sha3(Buffer.from(address,'hex')),'hex')

      var stateTrie = new Trie(self.db, Buffer.from(self.block.stateRoot.slice(2),'hex'))
      stateTrie.findPath(path, (e,accountNode,remainder,stack) => {
        if(e || !accountNode){ return reject(e || "accountNode not found")}
          var prf = {
            blockHash: Buffer.from(self.blockHash,'hex'),
            header:    getRawHeader(self.block),
            parentNodes:     rawStack(stack),
            address:   Buffer.from(address,'hex'),
            value:     rlp.decode(accountNode.value)
          }
        accept(prf)
      })
    })
  })
}
BuildProof.prototype.getNonceProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.value = prf.value[0]
        accept(prf)
    })
  })
}
BuildProof.prototype.getBalanceProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.value = prf.value[1]
        accept(prf)
    })
  })
}
BuildProof.prototype.getStorageRootProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.value = prf.value[2]
        accept(prf)
    })
  })
}

// not yet tested for multi-dimentional mappings
BuildProof.prototype.getStorageProof = function(address, _storageIndex /*...map1,map2...*/){
  self = this
  var mappings = Array.prototype.slice.call(arguments, 2)
  var bufMappings = []
  return this.getStorageRootProof(address).then((accountPrf)=>{
    return new Promise((accept, reject) => {

      var storageTrie = new Trie(self.db, accountPrf.value)
      var storageIndex = Buffer.from(leftPad(_storageIndex),'hex')
      var pathBuilder = storageIndex
      if(mappings.length > 0){
        for(var i = 0 ; i < mappings.length ; i++){
          bufMappings.push(Buffer.from(leftPad(mappings[i]),'hex'))
          pathBuilder = Buffer.concat([bufMappings[i], pathBuilder])
        }
        pathBuilder = Buffer.from(sha3(pathBuilder),'hex')
      }

      var storagePath = Buffer.from(sha3(pathBuilder),'hex')

      storageTrie.findPath(storagePath, (e,storageNode,remainder,stack) => {
        if(e || !storageNode){ return reject(e || "storageNode not found")}
          var prf = {
            header: accountPrf.header,
            blockHash: accountPrf.blockHash,
            accountParentNodes: accountPrf.parentNodes,
            storageParentNodes: rawStack(stack),
            address: strToBuf(address),
            account: accountPrf.value,
            value: rlp.decode(storageNode.value),
            storageIndex: strToBuf(storageIndex),
            mappings: bufMappings
          }
        accept(prf)
      })


    })
  })
}
BuildProof.prototype.getCodeHashProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.value = prf.value[3]
        accept(prf)
    })
  })
}
BuildProof.prototype.getCodeProof = function(address){
  self = this
  return this.getCodeHashProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
      self.web3.eth.getCode(address,'latest', function(e,code){
        if(e || !code){reject(e || 'no code found')}
        prf.value = Buffer.from(code.slice(2),'hex')
        accept(prf)
      })
    })
  })
}

BuildProof.prototype.getTransactionTrieRoot = function(txHash){
  self = this;
  return new Promise((accept, reject) => {
    try{
      self.web3.eth.getTransaction(txHash, (e,transaction) => {
        if(e || !transaction){ return reject(e || "transaction not found")}
        self.web3.eth.getBlock(transaction.blockHash, true, (e,block) => {
          if(e || !block){ return reject(e || "block not found")}
          var txTrie = new Trie();
          b = block;
          async.map(block.transactions, (siblingTx, cb2) => {//need siblings to rebuild trie
            var path = rlp.encode(siblingTx.transactionIndex)
            var rawSignedSiblingTx = new EthereumTx(squanchTx(siblingTx)).serialize()
            txTrie.put(path, rawSignedSiblingTx, function (error) {
              if(error != null){ cb2(error, null); }else{ cb2(null, true) }
            })
          }, (e,r) => {
            return accept(txTrie._root)
          });
        })
      })
    }catch(e){ return reject(e)}
  })
}

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
            txTrie.findPath(rlp.encode(transaction.transactionIndex), function(e,rawTxNode,remainder,stack){
              var prf = {
                blockHash: Buffer.from(transaction.blockHash.slice(2),'hex'),
                header:    getRawHeader(block),
                parentNodes:     rawStack(stack),
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

BuildProof.prototype.getReceiptTrieRoot = function(txHash){
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
          return accept(receiptsTrie._root)
        });
      })
    })
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
              blockHash: Buffer.from(receipt.blockHash.slice(2),'hex'),
              header:    getRawHeader(block),
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
  
  if(siblingReceipt.status !== undefined && siblingReceipt.status != null){
    var status = strToBuf(siblingReceipt.status)
    var rawReceipt = rlp.encode([status,cummulativeGas,bloomFilter,setOfLogs])
  }else{
    var postTransactionState = strToBuf(siblingReceipt.root)
    var rawReceipt = rlp.encode([postTransactionState, cummulativeGas,bloomFilter,setOfLogs])
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
var strToBuf = (input)=>{ 
  if(input.slice(0,2) == "0x"){
    return Buffer.from(byteable(input.slice(2)), "hex")
  }else{
    return Buffer.from(byteable(input), "hex") 
  }
}
var leftPad = (str) => {
  return ("0000000000000000000000000000000000000000000000000000000000000000"+str).substring(str.length)
}
var numToBuf = (input)=>{ return Buffer.from(byteable(input.toString(16)), "hex") }
var byteable = (input)=>{ return input.length % 2 == 0 ? input : "0" + input }

module.exports = BuildProof

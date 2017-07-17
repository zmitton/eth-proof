Trie = require('merkle-patricia-tree');
rlp = require('rlp');
Web3 = require('web3');
async = require('async')
EthereumTx = require('ethereumjs-tx');
EthereumBlock = require('ethereumjs-block/from-rpc')

sha3 = require('js-sha3').keccak_256
utils = require('ethereumjs-util')

//EthProof
EP = function(web3Provider){
  this.web3 = new Web3(web3Provider)
};
EP.prototype.getTxProof = function(txHash){
  self = this;
  return new Promise((accept, reject) => {
    try{
      self.web3.eth.getTransaction(txHash, function(e,transaction){
        self.web3.eth.getBlock(transaction.blockHash, true, function(e,block){
          var txTrie = new Trie();
          b = block;
          async.map(block.transactions, function(siblingTx, cb2){//need siblings to rebuild trie
            var path = rlp.encode(siblingTx.transactionIndex)
            var rawSignedSiblingTx = new EthereumTx(squanchTx(siblingTx)).serialize()
            txTrie.put(path, rawSignedSiblingTx, function (error) {
              if(error != null){ cb2(error, null); }else{ cb2(null, true) }
            })
          }, function(e,r){
            txTrie._findPath(rlp.encode(transaction.transactionIndex), function(e,rawSignedTx,r,stack){
              var prf = {
                blockhash: new Buffer(transaction.blockHash.slice(2),'hex'),
                header:    getRawHeader(block),
                stack:     rawStack(stack),
                path:      rlp.encode(transaction.transactionIndex),
                value:     rlp.decode(rawSignedTx.value)
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
          receiptsTrie._findPath(rlp.encode(receipt.transactionIndex), function(e,rawReceipt,r,stack){
            var prf = {
              blockhash: new Buffer(receipt.blockHash.slice(2),'hex'),
              header:    getRawHeader(block),
              stack:     rawStack(stack),
              path:      rlp.encode(receipt.transactionIndex),
              value:     rlp.decode(rawReceipt.value)
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
  _block.difficulty = '0x' + _block.difficulty.toString(16)
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

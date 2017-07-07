Trie = require('merkle-patricia-tree');
rlp = require('rlp');
Web3 = require('web3');
EthereumTx = require('ethereumjs-tx');
async = require('async')
EthereumBlock = require('ethereumjs-block/from-rpc')

EthProof = function(web3Provider){
  this.web3 = new Web3(web3Provider)
};
EthProof.prototype.getTxProof = function(txHash, cb){
  self = this;
  self.web3.eth.getTransaction(txHash, function(e,inputTx){
    self.web3.eth.getBlock(inputTx.blockHash, true, function(e,block){
      var txTrie = new Trie();
      b = block;
      async.map(block.transactions, function(siblingTx, cb2){//need siblings to rebuild trie
        var i = siblingTx.transactionIndex
        var rawSignedTx = new EthereumTx(squanchTx(siblingTx)).serialize()
        txTrie.put(rlp.encode(i), rawSignedTx, function (error) {
          if(error != null){ cb2(error, null); }else{ cb2(null, true) }
        })
      }, function(e,r){
        txTrie.get(rlp.encode(inputTx.transactionIndex), function(e,rawSignedTx,stack){
          var prf = {
            blockhash: new Buffer(inputTx.blockHash.slice(2),'hex'),
            header:    getRawHeader(block),
            stack:     rawStack(stack),
            path:      rlp.encode(inputTx.transactionIndex),
            tx:        rlp.decode(rawSignedTx)
          }
          cb(e, prf)
        })
      });
    })
  })
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
  var block = new EthereumBlock(_block, _block.uncles)
  return block.header.raw
}

var squanchTx = (tx) => {
  tx.gasPrice = '0x' + tx.gasPrice.toString(16)
  tx.value = '0x' + tx.value.toString(16)
  return tx;
}

module.exports = EthProof

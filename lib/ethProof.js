Trie = require('merkle-patricia-tree');
rlp = require('rlp');
Web3 = require('web3');
EthereumTx = require('ethereumjs-tx');
async = require('async')
EthereumBlock = require('ethereumjs-block/from-rpc')

EthProof = function(web3Provider){
  this.web3 = new Web3(web3Provider)
};
EthProof.prototype.getTxProof = function(txHashInQuestion, cb){
  self = this;
  temp = txHashInQuestion;
  self.web3.eth.getTransaction(txHashInQuestion, function(e,inputTx){
    self.web3.eth.getBlock(inputTx.blockHash, true, function(e,block){
      var txTrie = new Trie();
      b = block;
      // console.log("BLOCK: ", block)
      async.map(block.transactions, function(tx, cb2){
        var i = tx.transactionIndex
        var rawSignedTx = new EthereumTx(squanchTx(tx)).serialize()
        txTrie.put(rlp.encode(i), rawSignedTx, function (error) {
          if(error != null){ cb2(error); }
          cb2(null, null)//dont really need to save the array of values
        })
      }, function(e,r){
        txTrie.get(rlp.encode(inputTx.transactionIndex), function(e,rawSignedTxInQuestion,_stack){
          stack = formatStack(_stack);
          var prf = {
            blockhash: new Buffer(inputTx.blockHash.slice(2),'hex'),
            header:    getRawHeader(block),
            stack:     stack,
            path:      rlp.encode(inputTx.transactionIndex),
            tx:        rlp.decode(rawSignedTxInQuestion)
          }
          cb(e, prf)
        })
      });
    })
  })
}

formatStack = (input) => {
  output = []
  for (var i = 0; i < input.length; i++) {
    output.push(input[i].raw)
  }
  return output
}

getRawHeader = (_block) => {
  _block.difficulty = '0x' + _block.difficulty.toString(16)
  var block = new EthereumBlock(_block, _block.uncles)
  return block.header.raw
}

squanchTx = (tx) => {
  tx.gasPrice = '0x' + tx.gasPrice.toString(16)
  tx.value = '0x' + tx.value.toString(16)
  return tx;
}

module.exports = EthProof

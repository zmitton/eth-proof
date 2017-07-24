const Trie = require('merkle-patricia-tree');
const rlp = require('rlp');
const Web3 = require('web3');
const async = require('async')
const EthereumTx = require('ethereumjs-tx');
const EthereumBlock = require('ethereumjs-block/from-rpc')
const levelup = require('levelup');
const sha3 = require('js-sha3').keccak_256

//EthProof
var EthProof = function(web3Provider, blockHash, dbPath /*optional*/){
  this.web3 = new Web3(web3Provider)
  if(blockHash != undefined){
    this.blockHash = blockHash
    if(dbPath != undefined){
      this.db = levelup(dbPath); //required only for account/state proofs
    }
  }
};


EthProof.prototype.getOrInitStateTrie = function(){
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
      reject("must init EthProof with a blockHash to do that")
    }
  })
}

EthProof.prototype.getAccountProof = function(address){
  self = this
  return self.getOrInitStateTrie().then(()=>{
    return new Promise((accept, reject) => {
      var path = new Buffer(sha3(new Buffer(address,'hex')),'hex')

      var stateTrie = new Trie(self.db, Buffer.from(self.block.stateRoot.slice(2),'hex'))
      stateTrie.findPath(path, (e,accountNode,remainder,stack) => {
        if(e || !accountNode){ return reject(e || "accountNode not found")}
          var prf = {
            blockHash: new Buffer(self.blockHash,'hex'),
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
EthProof.prototype.getNonceProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.value = prf.value[0]
        accept(prf)
    })
  })
}
EthProof.prototype.getBalanceProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.value = prf.value[1]
        accept(prf)
    })
  })
}
EthProof.prototype.getStorageRootProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.value = prf.value[2]
        accept(prf)
    })
  })
}
EthProof.prototype.getStorageProof = function(address, storageIndex){
  // TO DO
  self = this
  return this.getStorageRootProof(address).then((accountPrf)=>{
    return new Promise((accept, reject) => {

      var storagePath = new Buffer(sha3(new Buffer(leftPad(storageIndex),'hex')),'hex')
      var storageTrie = new Trie(self.db, accountPrf.value)
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
          }
        accept(prf)
      })


    })
  })
}
EthProof.prototype.getCodeHashProof = function(address){
  return this.getAccountProof(address).then((prf)=>{
    return new Promise((accept, reject) => {
        prf.value = prf.value[3]
        accept(prf)
    })
  })
}
EthProof.prototype.getCodeProof = function(address){
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

EthProof.prototype.getTransactionProof = function(txHash){
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
                blockHash: new Buffer(transaction.blockHash.slice(2),'hex'),
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

EthProof.prototype.getReceiptProof = function(txHash){
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
              blockHash: new Buffer(receipt.blockHash.slice(2),'hex'),
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



// public methods all prove commitment to a blockHash
// all args currently expect Buffers
//to do: they should all only take one proofNodes array merge header into parentNodes 
// EthProof = () => {}
EthProof.header = (header, blockHash) => {
  try{
    return new Buffer(sha3(rlp.encode(header)),'hex').equals(blockHash);
  }catch(e){ console.log(e) }
  return false
}
EthProof.headerElement = (index, value, header, blockHash) => {
  try{
    if(value.equals(header[index])){
      return Buffer.from(sha3(rlp.encode(header)),'hex').equals(blockHash);
    }
  }catch(e){ console.log(e) }
  return false
}

EthProof.accountNonce = (address, nonce, parentNodes, header, blockHash) => {
  return EthProof._accountElement(0, address, nonce, parentNodes, header, blockHash)
}
EthProof.balance = (address, balance, parentNodes, header, blockHash) => {
  return EthProof._accountElement(1, address, balance, parentNodes, header, blockHash)
}
EthProof.storageRoot = (address, storageRoot, parentNodes, header, blockHash) => {
  return EthProof._accountElement(2, address, storageRoot, parentNodes, header, blockHash)
}
EthProof.codeHash = (address, codeHash, parentNodes, header, blockHash) => {
  return EthProof._accountElement(3, address, codeHash, parentNodes, header, blockHash)
}
EthProof.code = (address, code, parentNodes, header, blockHash) => {
  try{
    var account = EthProof._valueFrom(parentNodes)
    if(Buffer.from(sha3(code),'hex').equals(account[3])){
      return EthProof.codeHash(address, account[3], parentNodes, header, blockHash)
    }
  }catch(e){ console.log(e) }
  return false
}
EthProof._accountElement = (accountIndex, address, targetValue, parentNodes, header, blockHash) => {
  try{
    var account = EthProof._valueFrom(parentNodes) // decoded last last
    if(EthProof.account(address, account, parentNodes, header, blockHash)){
      return account[accountIndex].equals(targetValue)
    }
  }catch(e){ console.log(e) }
  return false
}
EthProof.storageAtIndex = (storageIndex, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
  try{
    var storagePath = Buffer.from(sha3(Buffer.from(leftPad(storageIndex.toString('hex')),'hex')),'hex')
    return EthProof.storage(storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash)
  }catch(e){ console.log(e) }
  return false
}
// EthProof.storageMapping = (storageIndex, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
//   try{
//     var storagePath = Buffer.from(sha3(Buffer.from(leftPad(storageIndex.toString('hex')),'hex')),'hex')
//     return EthProof.storage(storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash)
//   }catch(e){ console.log(e) }
//   return false
// }

EthProof.storage = (storagePath, storageValue, storageParentNodes, address, accountParentNodes, header, blockHash) => {
  try{
    var storageTrieRoot = EthProof._valueFrom(accountParentNodes)[2]
    if(EthProof.storageRoot(address, storageTrieRoot, accountParentNodes, header, blockHash)){
      //account is already proven during `storageRoot`

      return EthProof.trieValue(storagePath, storageValue, storageParentNodes, storageTrieRoot)
    }
  }catch(e){ console.log(e) }
  return false
}

// EthProof.storage = () => {/* to do */}
EthProof.log = () => {/* to do */}
EthProof.logBloom = () => {/* probably dont care. Arent these just for fast lookups? */}


// account can be a contract 
EthProof.account = (address, account, parentNodes, header, blockHash) => {
  var sha3OfAddress = Buffer.from(sha3(address),'hex')
  return EthProof._valueInTrieIndex(3, sha3OfAddress, account, parentNodes, header, blockHash)
}
EthProof.transaction = (path, tx, parentNodes, header, blockHash) => {
  return EthProof._valueInTrieIndex(4, path, tx, parentNodes, header, blockHash)
}
EthProof.receipt = (path, receipt, parentNodes, header, blockHash) => {
  return EthProof._valueInTrieIndex(5, path, receipt, parentNodes, header, blockHash)
}
EthProof._valueInTrieIndex = (trieIndex, path, value, parentNodes, header, blockHash) => {
  try{
    var trieRoot = header[trieIndex]
    if(EthProof.headerElement(trieIndex, trieRoot, header, blockHash)){
      return EthProof.trieValue(path, value, parentNodes, trieRoot)
    }
  }catch(e){ console.log(e) }
  return false;
}

// proves commitment to its root only (not a blockHash). I should almost make this 
// private although its very fundamental so i wont. 
EthProof.trieValue = (path, value, parentNodes, root) => {
  try{
    var currentNode;
    var len = parentNodes.length;
    var rlpTxFromPrf = parentNodes[len - 1][parentNodes[len - 1].length - 1];
    var nodeKey = root;
    var pathPtr = 0;

    path = path.toString('hex')

    for (var i = 0 ; i < len ; i++) {
      currentNode = parentNodes[i];
      if(!nodeKey.equals( new Buffer(sha3(rlp.encode(currentNode)),'hex'))){
        console.log("nodeKey != sha3(rlp.encode(currentNode)): ", nodeKey, new Buffer(sha3(rlp.encode(currentNode)),'hex'))
        return false;
      }
      if(pathPtr > path.length){
        console.log("pathPtr >= path.length ", pathPtr,  path.length)
        return false
      }

      switch(currentNode.length){
        case 17://branch node
          if(pathPtr == path.length){
            if(currentNode[16] == rlp.encode(value)){
              return true;
            }else{
              console.log('currentNode[16],rlp.encode(value): ', currentNode[16], rlp.encode(value))
              return false
            }
          }
          nodeKey = currentNode[parseInt(path[pathPtr],16)] //must == sha3(rlp.encode(currentNode[path[pathptr]]))
          pathPtr += 1
          // console.log(nodeKey, pathPtr, path[pathPtr])
          break;
        case 2:
          // console.log(currentNode[0].toString('hex'), path, pathPtr)
          pathPtr += EthProof._nibblesToTraverse(currentNode[0].toString('hex'), path, pathPtr)
          if(pathPtr == path.length){//leaf node
            if(currentNode[1].equals(rlp.encode(value))){
              return true
            }else{
              console.log("currentNode[1] == rlp.encode(value) ", currentNode[1], rlp.encode(value))
              return false
            }
          }else{//extension node
            nodeKey = currentNode[1]
          }
          break;
        default:
          console.log("all nodes must be length 17 or 2");
          return false
      }
    }
  }catch(e){ console.log(e); return false }
  return false
}

EthProof._nibblesToTraverse = (encodedPartialPath, path, pathPtr) => { 
  if(encodedPartialPath[0] == 0 || encodedPartialPath[0] == 2){
    var partialPath = encodedPartialPath.slice(2)
  }else{
    var partialPath = encodedPartialPath.slice(1)
  }

  if(partialPath == path.slice(pathPtr, pathPtr + partialPath.length)){
    return partialPath.length
  }else{
    throw new Error("path was wrong")
  }
}
EthProof._valueFrom = (parentNodes) => {
  // last last item decoded
  return rlp.decode(parentNodes[parentNodes.length - 1][parentNodes[parentNodes.length - 1].length - 1])
}
// EthProof._rootFrom = (parentNodes) => {
//   return Buffer.from(sha3(rlp.encode(parentNodes[0])),'hex')
// }








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
var strToBuf = (input)=>{ 
  if(input.slice(0,2) == "0x"){
    return new Buffer(byteable(input.slice(2)), "hex")
  }else{
    return new Buffer(byteable(input), "hex") 
  }
}

var leftPad = (str) => {
  return ("0000000000000000000000000000000000000000000000000000000000000000"+str).substring(str.length)
}

var numToBuf = (input)=>{ return new Buffer(byteable(input.toString(16)), "hex") }
var byteable = (input)=>{ return input.length % 2 == 0 ? input : "0" + input }

module.exports = EthProof

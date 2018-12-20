# Eth Proof

### Version 1 Improvements and Updates!

Version 1 is semantic -> it is not backwards compatible with version 0

Also: Due to recent [EIP 1186](https://github.com/ethereum/EIPs/issues/1186) by  @simon-jentzsch, we can finally get ethereum proofs through standard RPC for *any* Ethereum data (slow clap)

And you should be able to verify them using @wanderer and others' [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/test/proof.js)

###

## General Ethereum Merkle Patricia Trie (tree) Proofs

### Use
---
```
npm install eth-proof
```
```javascript
const Web3 = require('web3')
const EP  = require('eth-proof')
```

### API
------

This library has 2 main functions:
----------------------------------

* Building of a proof - Requests data, so these functions require a web3Provider. They are async using promises.

* Verifying a given proof is correct - Can/should be done locally/client-side. These functions are synchronous and require no connections.

You can initiallize an EP instance with a web3provider to get the *full* API! for proof building (async promises, instance functions):

```javascript
var eP = new EP(new Web3.providers.HttpProvider("https://mainnet.infura.io"))
```

* eP.getTransactionProof(txHash).then((prf)=>{})
* eP.getReceiptProof
* eP.getLogProof //todo

* eP.getAccountProof
* eP.getNonceProof
* eP.getBalanceProof
* eP.getStorageRootProof
* eP.getStorageProof (includes mappings!)
* eP.getCodeHashProof
* eP.getCodeProof


You can *check* that a proof is valid using the class-level functions. They check proofs against a specified blockHash. This is to mitigate developer mistakes. All merkle proofs should be proven *against a blockhash*. Not a blockNumber, not a storageRoot or stateRoot - for these can not be trusted without proving themselves against a blockhash. This does it all in 1 step. 

Establishing trust of a blockHash is a separate issue. It relies on trust of a chain, which should ultimately rely on a set of heuristics involving expected total work at the current moment in time. This tool doesn't deal with that. I will looking into providing some tools for that shortly

API for proof *verifying* (for client-side, synchronous, class-level. Again these are to be run locally so they don't require an httpProvider or internet connection at all). :

* EP.header
* EP.headerElement
* EP.accountNonce
* EP.balance
* EP.storageRoot
* EP.codeHash
* EP.code
* EP.storageAtIndex
* EP.storageMapping
* EP.storage
* EP.log
* EP.account
* EP.transaction
* EP.receipt
* EP.trieValue

Please see the tests for sample uses. run only the file you need with `mocha test/state/storage.js` for example. Its all data currently on mainnet.

```javascript
var txHash = '0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de'
eP.getTransactionProof(txHash).then((result)=>{
  // console.log(result) // I now have a proof object

  // I can now verify the proof against a blockhash I trust.
  var myTrustedBlockHash = Buffer.from('f82990de9b368d810ce4b858c45717737245aa965771565f8a41df4c75acc171','hex')
  var verified = EP.transaction(result.path, result.value, result.parentNodes, result.header, myTrustedBlockHash)
  console.log(verified) // true
}).catch((e)=>{console.log(e)})
```

### Testing
----------
The tests `npm run test` will build tx and receipt proofs by connect to infura, and then verify them.

These tests hit Infura mainnet really hard because every tx or receipt proof requires multiple RPC calls (1 for each tx in the particular block). please be considerate. If you are connecting to a local geth fullnode fagedabadit



Goals
-----

long term goal is a light client that can validate an entire state transition.it would need proofs for all data touched during the state transition (tx).

proving absence:
its possible but must construct the proof with a few amendments to EV.value.

The client can initialize its `state-tree` object using the ParentNodes from the proof, generating an in-memory level-db as `key = sha3(value)` for element in parentNode array. It puts them in this mini state trie, and inits the root. then it can run its EVM implementation directly on this trie as usual. at the end it checks its new root to verify legitimacy. If the evm tries to traverse any data that doesnt exist (even null data must have proof of null), it should return as invalid.

We are also finding it useful to relay ethereum to itself. It sounds weird, but you can later make proofs about any historical information and information not usually available to the EVM can be made available as needed from the relay contract.

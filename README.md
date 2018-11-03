# Eth Proof

### Deprecation Warning
This library is mostly unnecessary now.

see [EIP 1186](https://github.com/ethereum/EIPs/issues/1186) by @simon-jentzsch 

You should be able to do the "build proof" functions by simply using the new RPC calls.

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

You can initiallize an EP instance with a web3provider to get only the limited API for proof building (async promises, instance functions):

```javascript
var eP = new EP(new Web3.providers.HttpProvider("https://mainnet.infura.io"))
```

* eP.getTransactionProof(txHash).then((prf)=>{})
* eP.getReceiptProof
* eP.getLogProof //todo

To access the rest of the functionality you need to have a full node and init the object with all 3 things (`web3Provider`, `blochHash`, `dbPath`). 

```javascript
var chainDataPath = '/Users/zacharymitton/Library/Ethereum/geth/chaindata'
var eP = new EP(
  new Web3.providers.HttpProvider("https://mainnet.infura.io"),
  'a61b780b1c2f6a79d052e4b58234dc126fd7fdc9338705983d6068965ba8384b',
  chainDataPath //can be omitted if you only need TXs and receipts
)
```

Extended API for proof building:

* eP.getAccountProof
* eP.getNonceProof
* eP.getBalanceProof
* eP.getStorageRootProof
* eP.getStorageProof (includes mappings!)
* eP.getCodeHashProof
* eP.getCodeProof

This is because the intermediate state trie data needed for proofs is not available through Ethereum RPC (neither is tx, receipts, or logs but we can hack it using multiple PRC calls). So you need to provide the levelDB path and then it can traverse the trie. The path shown is what works on my macbook's geth data Please let me know if you find out the paths for different systems. Geth cant be running (something about opening the DB twice at the same time).

You can *check* that a proof is valid using the class-level functions. They check proofs against a specified blockHash. Establishing trust of a blockHash is a separate issue. It relies on trust of a chain, which should ultimately rely on a set of heuristics involving expected total work at the current moment in time.

API for proof *verifying* (for client-side, synchronous, class-level):

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

These tests hit Infura mainnet really hard. please be considerate.

If you have a geth full node you can modify `chainDataPath`a and `RecentBlockHash` in `test/state/'... files, and run `npm run extended-test`.



Situation
---------
For txproof building and recieptProof building access to leveldb is not required. we find the relevent block and rebuild the trie (which is a small trie on with tx from that single block). This is why we can use rpc calls for it, so you just give it a `provider`.

For state (accounts, storage, all that stuff) you cant get the proof from rpc calls, because the state trie is a huge trie (>20gb) and there are no RPC calls to get the proof data needed (the data is a bunch of "parent nodes"). Its very easy to get directly from the levelDB however, and theirfore, we will be making an EIP which can hopefully add RPC support for returning it. We can name the methods after standard RPC methods with the word `proof` concatenated on them, and have them take 1 extra `blockHash` param. In the meantime, x-relay can run our own custom ethereum servers which support these proof requests.


Goals
-----

long term goal is a light client that can validate an entire state transition.it would need proofs for all data touched during the state transition (tx).

proving absence:
its possible but must construct the proof with a few amendments to EV.value.

The client can initialize its `state-tree` object using the ParentNodes from the proof, generating an in-memory level-db as `key = sha3(value)` for element in parentNode array. It puts them in this mini state trie, and inits the root. then it can run its EVM implementation directly on this trie as usual. at the end it checks its new root to verify legitimacy. If the evm tries to traverse any data that doesnt exist (even null data must have proof of null), it should return as invalid.

We are also finding it useful to relay ethereum to itself. It sounds weird, but you can later make proofs about any historical information and information not usually available to the EVM can be made available as needed from the relay contract.

Proposed RPC spec (WIP)
-----------------
still thinkin about this

```
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionProof","params":["0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef", "0xbeab0aa2411b7ab17f30a99d3cb9c6ef2fc5426d6ad6fd9e2a26a6aed1d1055b"],"id":1}'

// Result
{
"id":1,
"jsonrpc":"2.0",
"result": {
    "path":"0x80"
    "transaction":{
      "hash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
      "nonce":"0x",
      "blockHash": "0xbeab0aa2411b7ab17f30a99d3cb9c6ef2fc5426d6ad6fd9e2a26a6aed1d1055b",
      "blockNumber": "0x15df", // 5599
      "transactionIndex":  "0x1", // 1
      "from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
      "to":"0x85h43d8a49eeb85d32cf465507dd71d507100c1",
      "value":"0x7f110" // 520464
      "gas": "0x7f110" // 520464
      "gasPrice":"0x09184e72a000",
      "input":"0x603880600c6000396000f300603880600c6000396000f3603880600c6000396000f360",
    },
    "parentNodes": [
      [<TxsRootNode>],
      [<ParentNodeA>],
      [<ParentNodeB>],
      [<ParentNodeC>],
      ...[<valueNodeWithTheTx>]
    ],
    "blockHeader": [parentHash,ommersHash,beneficiary,stateRoot,transactionsRoot,receiptsRoot,logsBloom,,difficulty,number,gasLimit,gasUsed,timestamp,extraData,mixHash,nonce],
    "blockHash":"0xbeab0aa2411b7ab17f30a99d3cb9c6ef2fc5426d6ad6fd9e2a26a6aed1d1055b"
  }
}
```

We could instead use the rlp of the blockheader and/or rlp of transactionTrieNodes response, I dont have a preference yet. I just seems the RPC response are usually made to be human somewhat readable.

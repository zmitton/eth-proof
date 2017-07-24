###WIP big time

//to do before publish
//un globalize vars
//examples
//change the name of all this from merkle-patricia-proof to eth-proof
//can update package.json github dependency as soon as martin publishes

library has 2 main functions
============================
   1. generating a proof (requires blockchain connection): EthProof
   2. verifying a proof against a blockHash (self-evident): EthVerify

To verify use the EthProof class methods. To build a proof, make an instance of EthProof `var eP = new EP(provider)` and call the `eP.get...` functions on that instance. You can only get transaction proofs and receipt proofs using with the standard ethereum API (RPC), so in order to get account proofs(ether balance etc.) and state proofs(any variables within contracts), you have to connect to a ethereum db (a folder on your computer if you are running an ethereum full node) for now. If you have geth, you can use something like the `chaindata` path below.

###Use
===
```javascript
const Web3 = require('web3');

const EP  = require('./../index')
const chainDataPath = '/Users/zacharymitton/Library/Ethereum/geth/chaindata'
const eP = new EP(
  new Web3.providers.HttpProvider("https://gmainnet.infura.io"),
  'a61b780b1c2f6a79d052e4b58234dc126fd7fdc9338705983d6068965ba8384b',
  chainDataPath //can be omitted if you only need TXs and receipts
)
```

The public API functions all check proofs against a specified blockHash.
Establishing trust of a blockHash is a separate issue. It relies on trust
of a chain, which should ultimately rely on a set of heuristics involving
expected total work at the current moment in time

```javascript
var txHash = '0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de'
eP.getTransactionProof(txHash).then((result)=>{
  // console.log(result) // I now have a proof object

  // I can now verify the proof against a blockhash I trust.
  var myTrustedBlockHash = Buffer.from('f82990de9b368d810ce4b858c45717737245aa965771565f8a41df4c75acc171','hex')
  var verified = EP.transaction(result.path, result.value, result.stack, result.header, myTrustedBlockHash)
  console.log(verified) // true
}).catch((e)=>{console.log(e)})
```

###Testing
=======
the tests `npm run test` will build tx and receipt proofs by connect to infura, and then verify them using ethVerify.

If you run a full node you can modify `chainPath` in `test/state` and run `npm run extended-test`.

The tests hit Infura mainnet really hard. please be considerate.


situation
=========
For txproof building and recieptProof building access to leveldb is not required. we find the relevent block and rebuild the trie (which is a small trie on with tx from that single block). This is why we can use rpc calls for it, so you just give it a `provider`.

For state (accounts, storage, all that stuff) you cant get the proof from rpc calls, because the state trie is a huge trie (>20gb) and there are no RPC calls to get the proof data needed (the data is a bunch of "parent nodes"). Its very easy to get directly from the levelDB however, and theirfore, we will be making an EIP which can hopefully add RPC support for returning it. We can name the methods after standard RPC methods with the word `proof` concatenated on them, and have them take 1 extra `blockHash` param. In the meantime, x-relay can run our own custom ethereum servers which support these proof requests.


design reasons
==============
main API should prove against a blockHash


The EV public API checks proofs against a specified blockHash. Establishing trust of a blockHash is a separate issue. It relies on trustof a chain, which should ultimately rely on a set of heuristics involving expected total work at the current moment in time

proving absence:
its possible but must construct the proof with a few amendments to EV.value.

some Long term goals
====================

long term goal is a light client that can validate an entire state transition.it would need proofs for all data touched during the state transition (tx).

The client can initialize its `state-tree` object using the ParentNodes from the proof, generating an in-memory level-db as `key = sha3(value)` for element in parentNode array. It puts them in this mini state trie, and inits the root. then it can run its EVM implementation directly on this trie as usual. at the end it checks its new root to verify legitimacy. If the evm tries to traverse any data that doesnt exist (even null data must have proof of null), it should return as invalid.


Proposed RPC spec:
==================
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
    "transactionTrieNodes": [
      [<TxRootNode>],
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

We could instead use the rlp of the blockheader and/or rlp of transactionTrieNodes response, I dont have a preference.

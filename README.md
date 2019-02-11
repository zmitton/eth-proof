# Eth Proof

### Version 1 Improvements and Updates!

Version 1 is semantic -> it is not at all backwards compatible with version 0

Also: Due to recent [EIP 1186](https://github.com/ethereum/EIPs/issues/1186) by  @simon-jentzsch, we can finally get ethereum proofs through standard RPC for *any* Ethereum data (slow clap)

And you should be able to verify them using @wanderer and others' [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/test/proof.js)

## General Ethereum Merkle Patricia Trie (tree) Proofs
This library now supports state proves which means you can prove _all_ Ethereum contract and account data, as well as transactions, receipts. 

### Use
```
npm install eth-proof
```
```javascript
const { GetAndVerify, GetProof, VerifyProof } = require('eth-proof')
let getAndVerify = new GetAndVerify("https://mainnet.infura.io")
```

### API
This library has 3 main ways you can use it:
1. _Easy_ - `Getandverify` data automatically against a blockHash you trust. This is the main use-case for development of more trustworthy applications that need to request data from a remote node.
2. _harder_ `getProof`s and
3. `verify` individual items against their direct neighbors in the architecture diagram show below. This might be useful for a more complex application like creating a side-chain, or creating custom merkle proof schemes for layer 2 applications.


* `GetProof` builds a proof - these request data from the blockchains so you'll have to instantiate a GetProof object with an rpc endpoint. It's functions are async using promises.

* `Verify`ing that a given proof is correct - Can/should be done locally/client-side. These functions are synchronous and require no connections, so they are class-level functions - no instantiation needed.

```javascript
let foo = async () => {
    let blockHashThatYouTrust = '0xc32470c2459fd607246412e23b4b4d19781c1fa24a603d47a5bc066be3b5c0af'
    let untrustedTxHash       = '0xacb81623523bbabccb1638a907686bc2f3229c70e3ab51777bef0a635f3ac03f'
    let tx = await getAndVerify.transactionAgainstBlockHash(untrustedTxHash, blockHashThatYouTrust)
    console.log(tx)
}
foo()
```

<!-- <show api functions here>
 -->
You can atomically *verify* any relationship between 2 pieces of data that are connected in the architecture diagram. However, all merkle proofs should inevitably be proven *against a blockhash* to prove the cost of counterfeiting it. A centralized service can easily create a fake "proof" that will fool you, if you don't have an anchor (something you trust) that you are comparing it against.

Establishing trust of a blockHash is a separate issue. It relies on trust of a chain, which should ultimately rely on a set of heuristics involving expected total work at the current moment in time. This tool doesn't deal with that. I will looking into providing some tools that will, but proving work has very different properties and will be a separate project of its own.

API for proof *verifying* (for client-side, synchronous, class-level. Again these are to be run locally so they don't require an httpProvider or internet connection at all). :

<!-- * EP.header
 -->

Please see the tests for sample uses. run only the file you are testing with `npm run test test/account.js` for example. Its all data currently on mainnet.

<!-- ```javascript
var txHash = '0xb53f752216120e8cbe18783f41c6d960254ad59fac16229d4eaec5f7591319de'
eP.getTransactionProof(txHash).then((result)=>{
  // console.log(result) // I now have a proof object

  // I can now verify the proof against a blockhash I trust.
  var myTrustedBlockHash = Buffer.from('f82990de9b368d810ce4b858c45717737245aa965771565f8a41df4c75acc171','hex')
  var verified = EP.transaction(result.path, result.value, result.parentNodes, result.header, myTrustedBlockHash)
  console.log(verified) // true
}).catch((e)=>{console.log(e)})
``` -->

### Testing
----------
The tx and receipt tests use infura right now (because I dont have a full node). The account and storage tests point to localhost:8545 because infura doenst yet support the rpc call needed to attain them: `eth_getProof`.

These tests hit Infura mainnet really hard because every tx or receipt proof requires multiple RPC calls (1 for each tx in the particular block). please be considerate. If you have a full archive node, re-point the rpc calls locally.

Goals
-----

long term goal is a light client that can validate an entire state transition.it would need proofs for all data touched during the state transition (tx).

We also would like wallets to display only data that is proven.

To complete the functionality attempted by this tool, a "light-client" tool (that downloads all the hashes and validates the work between the) will have to be built. The output of which will be a "workChain" which can interface with eth-proof to finally begin to leverage some of the really useful security properties of PoW blockchains.

proving absence (or null or undefined):
This is a really cool feature of the state tree. You can prove a key does not exist in the tree. In fact you need this property for certain aplications. Unfortunately I dont have that working yet, but it's the next feature, but its much cleaner to modify merkle-patricia-tree in order to support it. Check back in a few days.

There will be some major changes to the format of `Branch`. I have realized that a `branch` is really just a sparse `tree`. instead of using the array of nodes, I should be putting those nodes in the tree and then doing a regular `tree.get` to pull it back out. If the tree finds it, its verified, if it finds a contradictory node within its path, thats a proof of absence, but if it cant find an individual node by its hash, then the proof is invalid. Once branches are seen as mini trees we can even do the following:

The client can initialize its `state-tree` object using the branch from the proof (or branches, as they will likely just have repeats), generating an in-memory level-db as `key = sha3(value)` for element in parentNode array. It puts them in this mini state trie, and inits the root. then it can run its EVM implementation directly on this trie as usual. at the end it checks its new root to verify legitimacy. If the evm tries to traverse any data that doesnt exist (even null data must have proof of null), it should return as invalid.

We are also finding it useful to relay ethereum to itself. It sounds weird, but you can later make proofs about any historical information and information not usually available to the EVM can be made available as needed from the relay contract.

-------
At time of this writing Infura doesn't support `eth_getProof`, but it should in the very near future.

Try this one liner from the console to see if it's working yet.
```
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getProof","params":["0x9cc9bf39a84998089050a90087e597c26758685d",["","d471a47ea0f50e55ea9fc248daa217279ed7ea3bb54c9c503788b85e674a93d1"],"latest"],"id":1}' -H "Content-type:application/json" https://mainnet.infura.io | jq
```

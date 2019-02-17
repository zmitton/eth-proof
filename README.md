# Eth Proof `2.0.0`

This is a generalized merkle-patricia-proof module that now supports ethereum state proofs. That means you can prove _all_ Ethereum data (including that a path is `null`). If you have a single hash that you trust (i.e. blockHash), you can use this module to succinctly prove exactly what data was or was not contained in the Ethereum blockchain at that snapshot in history.

#### Warnings:

- Version 2 is not compatible with version 0, or 1. Major improvements were made to the API.
- At time of this writing neither Infura nor any RPC provider's support `eth_getProof`, but infura will in the near future. [updates on this](https://github.com/zmitton/eth-proof/issues/9).


## Use

#### Installation 

```
npm install eth-proof
```

Allows you to make proofs in a few different ways:

1. The `Getandverify` class requests and then verifies the response data against a blockHash you trust before returning the vetted data to you. This is the main use-case for development of more trustworthy applications that need to request data from a remote node. These functions work by chaining together granular verification functions of all the connected pieces.
2. For more customized usage you can directly request the proof (`GetProof`) and then 
3. Use the `Verify` class to verify individual connected pieces within it. i.e. That the a `header` contains a specific `stateRoot`, or the `accountBranch` contains a specific `account` at a specific `address`. This class has all the individual methods that `GetAndVerify` is using under the hood. 

While the `GetAndVerify` functions are useful for _dapps / wallets / block explorers_  to validate data before showing it to users, the `Verify` functions may be needed for more complex applications like _side-chains / state-channels / plasma_.


#### Instantiation

The getter classes (`GetProof` and `GetAndVerify`) request data from an RPC provider. So you'll have to instantiate an instance object with the RPC endpoint. 

```javascript
const { GetAndVerify, GetProof, VerifyProof } = require('eth-proof')
let getAndVerify = new GetAndVerify("http://localhost:8545")
```

The instance-functions make asynchronous requests using promises.

```javascript
let blockHashThatITrust = '0xc32470c2459fd607246412e23b4b4d19781c1fa24a603d47a5bc066be3b5c0af'
let untrustedTxHash     = '0xacb81623523bbabccb1638a907686bc2f3229c70e3ab51777bef0a635f3ac03f'

getAndVerify.txAgainstBlockHash(untrustedTxHash, blockHashThatITrust).then((tx)=>{
  console.log(tx)
})
```


## API


#### GetAndVerify

The `GetAndVerify` instance-functions take hex`string`s and return array-like `object`s of `buffer`s or, in the case of storage, simple `buffer`s

-----
- `async txAgainstBlockHash(txHash, blockHash){}`
- `async receiptAgainstBlockHash(txHash, blockHash){}`
- `async accountAgainstBlockHash(accountAddress, blockHash){}`
- `async storageAgainstBlockHash(accountAddress, position, blockHash){}`
-----

They return the bare-bones objects indicated, after verifying everything about it (against a _blockHash you already trust_). The above is likely all you need for most applications. Please see the tests for sample uses. Please run only the file you are testing with `npm run test test/account.js` for example. The tests hit Infura extremely hard. Just one receipt proof for instance makes a separate request for every single receipt in the block from which the receipt resides.

#### GetProof

The `GetProof` instance-functions take hex`string`s and return generic `object`s with the proof information (Note: The different return `object`s have different `attributes`).

-----
- `async transactionProof(txHash){}`
- `async receiptProof(txHash){}`
- `async accountProof(address, blockHash = null){}`
- `async storageProof(address, storageAddress, blockHash = null){}`
-----

Lastly just a helper for the direct RPC call as described [here](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getproof)
- `async eth_getProof(address, storageAddresses, blockNumber){}`

#### Verify

The Verifier class (`Verify`) does everything locally/client-side and doesn't require a connection. So you don't need to initialize an instance of the class, just use it directly. They are all class-functions and they execute _synchronously_.

-----
- `static branchRootOf(branch){}`
- `static rootContainsBranch(rootHash, branch){}`
- `static accountContainsStorageRoot(account, storageRoot){}`
- `static blockhashContainsHeader(blockhash, header){}`
- `static headerContainsHashAt(header, hash, indexOfRoot){}`
- `static headerContainsStateRoot(header, stateRoot){}`
- `static accountBranchContainsAccountAt(branch, account, address){}`
- `static storageBranchContainsStorageAt(branch, storageValue, position){}`
- `static headerContainsTxsRoot(header, txRoot){}`
- `static txsBranchContainsTxAt(branch, tx, indexOfTx){}`
- `static headerContainsReceiptsRoot(header, receiptsRoot){}`
- `static receiptsBranchContainsReceiptAt(branch, receipt, indexOfTx){}`
- `static receiptContainsLogAt(receipt, log, indexOfLog){}`
- `static branchContainsValueAt(branch, value, path){}`
-----

`params :` array-like objects (`raw`) or straight `<buffer>`s

`returns:` `bool`: `true`, or error thrown if false and/or malformed input

- `static branchContains(path, branch){}`

`params :` `path:` `<buffer>` `branch:` array-like object (`raw`)

`returns:` `<buffer>`, or error thrown if false and/or malformed input

<!-- * `GetProof` builds the proof - these request data from the blockchains so you'll have to instantiate a GetProof object with an rpc endpoint. It's functions are async using promises.

* `Verify`ing that a given proof is correct - Can/should be done locally/client-side. These functions are synchronous and require no connections, so they are class-level functions - no instantiation needed. -->


## Details

You can granularly *verify* the relationship between any 2 pieces of data that are connected in the architecture diagram below. However, all merkle proofs should inevitably be proven *against a blockhash* to prove there was a cost of counterfeiting it. A centralized service can easily create a fake "proof" that will fool you, if you don't have an anchor (something you already trust) to compare it against.

<img src="https://raw.githubusercontent.com/zmitton/eth-proof/master/img/architecture-diagram.JPG" width="300">


<!-- ![Architecture Diagram 1](https://raw.githubusercontent.com/zmitton/eth-proof/master/img/architecture-diagram.JPG | width=150) -->

Establishing trust of a blockHash is a whole other issue. It relies on trust of a chain, which should ultimately rely on a set of heuristics involving expected total work at the current moment in time. This tool doesn't deal with that. It will however enable you to prove data against a `workChain` in later version. 

The functions will look something like: `getAndVerify.txAgainstWorkChain(txHash, workChain){}`.

So Proving work on the _"workChain"_ has very different properties and will be a separate project of its own. But _this_ module we be able verify _against_ the workChain (who's trust was establised elsewhere)

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


## Testing


The tx and receipt tests use infura right now (because I dont have a completely full node). The account and storage tests point to localhost:8545 because infura doenst yet support the rpc call needed to attain them `eth_getProof` (from EIP 1186).

Its all data currently on Ethereum Mainnet.

These tests hit Infura really hard because every tx or receipt proof requires multiple RPC calls (1 for each tx in the particular block). please be considerate. If you have a full archive node, re-point the rpc calls locally or comment out all but one tests at a time.

Thanks to @simon-jentzsch, for EIP-1186 to make this data available from Geth and Parity clients.


## Future Tooling

long term goal is are light clients that can validate an entire state transition. It would need proofs for all data touched during the state transition (tx).

We also would like wallets to display only data that is proven.

To complete the functionality attempted by this tool, a "light-client" tool (that downloads all the hashes and validates the work between them) will have to be built. The output of which will be a "workChain" which can interface with eth-proof to finally begin to leverage some of the really useful security properties of PoW blockchains.

proving absence (or null or undefined):
This is a really cool feature of the state tree. You can prove a key does not exist in the tree. In fact this property makes it possible to format the proof `branch` as an instance of `trie`. Null-proofs are currently working in version 2!

There will be some major changes to the format of `proof`. I have realized that a `proof` is really just a sparse `tree`. instead of using the array of nodes, I should be putting those nodes in the tree and then doing a regular `tree.get` to pull it back out. If the tree finds it, its verified, if it finds a contradictory node within its path, thats a proof of absence, but if it cant find an individual node by its hash, then the proof is invalid. Once branches are seen as mini trees we can even do the following:

The client can initialize its `state-tree` object using the branch from the proof (or branches, as they will likely just have repeats), generating an in-memory level-db as `key = sha3(value)` for element in parentNode array. It puts them in this mini state trie, and inits the root. then it can run its EVM implementation directly on this trie as usual. at the end it checks its new root to verify legitimacy. If the EVM tries to traverse any data that doesnt exist (even null data must have proof of null), it should return as an invalid (currently "missing node error").

We are also finding it useful to relay ethereum to itself. It sounds weird, but you can later make proofs about any historical information and information not usually available to the EVM can be made available as needed from the relay contract.

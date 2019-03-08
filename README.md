# Eth Proof `2.0.0`

This is a generalized merkle-patricia-proof module that now supports ethereum state proofs. That means you can prove _all_ Ethereum data (including that a path is `null`). If you have a single hash that you trust (i.e. blockHash), you can use this module to succinctly prove exactly what data was or was not contained in the Ethereum blockchain at that snapshot in history.

## Use

#### Installation 

```
npm install eth-proof
```

Allows you to make proofs in a few different ways:

1. The `Getandverify` class requests and then verifies the response data against a blockHash you trust before returning the vetted data to you. This is the main use-case for development of more trustworthy applications that need to request data from a remote node. These functions work by chaining together granular verification functions of all the connected pieces.
2. For more customized usage you can directly request the proof (`GetProof`) and then 
3. Use the `Verify` class to verify individual connected pieces within it. i.e. That the a `header` contains a specific `stateRoot`, or the `accountProof` contains a specific `account` at a specific `address`. This class has all the individual methods that `GetAndVerify` is using under the hood. 

While the `GetAndVerify` functions are useful for _dapps / wallets / block explorers_  to validate data before showing it to users, the `Verify` functions may be needed for more complex applications like _side-chains / state-channels / plasma_.


#### Instantiation

The getter classes (`GetProof` and `GetAndVerify`) request data from an RPC provider. So you'll have to instantiate an instance object with the RPC endpoint. 

```javascript
const { GetAndVerify, GetProof, VerifyProof } = require('eth-proof')
let getAndVerify = new GetAndVerify("http://localhost:8545")
```


#### Gotchas

For `Transaction`, `Receipt`, and `Log` proofs: Must hit an Ethereum node that is running `--syncmode full`.

For `Account` and `Storage` proofs: Must hit a node that supports `eth_getProof`. This is any geth or parity node upgraded after ~ January 2019. Unfotunately, at time of this writing, neither Infura, nor any known centralized services support `eth_getProof` (Infura plans to in the near future). [updates on this](https://github.com/zmitton/eth-proof/issues/9). So run your own node.

For _historic_ `Account` and `Storage` proofs  (ones who's blockhash is older than "latest"), you'll have  to run your node with `--gcmode archive`, otherwise the state tree throws away old data and you will get "missing node" errors.

```
geth --syncmode full  --gcmode archive
```

Specifically: A node without the `full` flag will be missing historic `transactions` and `receipts`. It will return a missing transaction error if you ask for them. A node without the `archive` flag, will still be able to prove _current_ account and storage values, but it will be missing the nodes needed to prove the account and storage values at historical points in time (at particular blocks). 

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

Lastly just a helper for the direct RPC call as described [here](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getproof). Note that this `proof` is returned in a different format (which I find less directly useful).

- `async eth_getProof(address, storageAddresses, blockNumber){}`

#### Verify

The Verifier class (`Verify`) should always be run locally/client-side so it doesn't require an RPC connection. To impliment more _advanced_ uses of the module use these class-level (static) functions. Some are _synchronous_ while others are _async_ (only because they use the async tree API under the hood. They do not make any remote calls).

## Details

You can granularly *verify* the relationship between any 2 pieces of data that are connected in the architecture diagram below. However, all merkle proofs should inevitably be proven *against a blockhash* to prove there was a cost of counterfeiting it. A centralized service can easily create a fake "proof" that will fool you, if you don't have an anchor (something you already trust) to compare it against.

<img src="https://raw.githubusercontent.com/zmitton/eth-proof/master/img/architecture-diagram.JPG" width="300">

Establishing trust of a blockHash is a whole other issue. It relies on trust of a chain, which should ultimately rely on a set of heuristics involving expected total work at the current moment in time. This tool doesn't deal with that. It will however enable you to prove data against a `workChain` in later version. 

The functions will look something like: `getAndVerify.txAgainstWorkChain(txHash, workChain){}`.

So Proving work on the _"workChain"_ has very different properties and will be a separate project of its own. But _this_ module we be able verify _against_ the workChain (who's trust was establised elsewhere)

This module does not include an on-chain verification of the Merkle Patricia Tree.
However those have been made and can be found [here](https://github.com/ConsenSys/rb-relay/blob/master/contracts/MerklePatriciaProof.sol) and [here](https://github.com/lorenzb/proveth/blob/master/onchain/ProvethVerifier.sol). I can not the current state or security of these other tools.

## Formating

The data formats used/returned are *eth-object*s [documented here](https://github.com/zmitton/eth-object).

They are `account`, `header`, `log`, `proof`, `receipt`, and `transaction`. Eth-objects mimic the native Ethereum format used in RLP. They are _arrays of byteArrays and nested arrays (of the same)_. An account will look something like this:

```
[
  <Buffer 01>,
  <Buffer >,
  <Buffer c1 49 53 a6 4f 69 63 26 19 63 6f bd f3 27 e8 83 43 6b 9f d1 b1 02 52 20 e5 0f b7 0a b7 d2 e2 a8>,
  <Buffer f7 cf 62 32 b8 d6 55 b9 22 68 b3 56 53 25 e8 89 7f 2f 82 d6 5a 4e aa f4 e7 8f ce f0 4e 8f ee 6a>,
]
```

But they can be dug into as arrays _or_ using named helper methods for each expected property:

```javascript
console.log(account[0]) // => <buffer 01>
console.log(account.nonce) // => <buffer 01>
```

They also have helpers to build/convert/view them in many other useful formats:

```
console.log(account.toJson())
// {
//   "nonce":"0x01",
//   "balance":"0x",
//   "storageRoot":"0xc14953a64f69632619636fbdf327e883436b9fd1b1025220e50fb70ab7d2e2a8",
//   "codeHash":"0xf7cf6232b8d655b92268b3565325e8897f2f82d65a4eaaf4e78fcef04e8fee6a"
// }
console.log(account.serialize()) // will give you the rlp encoding
// <Buffer f8 44 01 80 a0 c1 49 53 a6 4f 69 63 26 19 63 6f bd f3 27 e8 83 43 6b 9f d1 b1 02 52 20 e5 0f b7 0a b7 d2 e2 a8 a0 f7 cf 62 32 b8 d6 55 b9 22 68 b3 56 ... >
console.log(account.toHex()) // rlp encoding as a hex string
// "0xf8440180a0c14953a64f69632619636fbdf327e883436b9fd1b1025220e50fb70ab7d2e2a8a0f7cf6232b8d655b92268b3565325e8897f2f82d65a4eaaf4e78fcef04e8fee6a"
```

Can be created from a direct RPC result or any of the above:

```
Account.fromRpc(rpcResponseString)
Account.fromHex(rlpString)
Account.fromBuffer(rlpBuffer)
Account.fromRaw(arrayOfBuffers)
```

## Testing

The tx and receipt tests use infura right now (because I dont have a completely full node). The account and storage tests point to localhost:8545 because infura doenst yet support the rpc call needed to attain them `eth_getProof` (from EIP 1186).

Its all data currently on Ethereum Mainnet.

These tests hit Infura really hard because every tx or receipt proof requires multiple RPC calls (1 for each tx in the particular block). please be considerate. If you have a full archive node, re-point the rpc calls locally or use `it.only` to perform only one tests at a time.

Thanks to @simon-jentzsch, for EIP-1186 to make this data available from Geth and Parity clients.

## How it Works

Binary merkle proofs are explained pretty well in [this video](https://www.youtube.com/watch?v=5WGgoVmfIik&t=283) by Joseph chow. [Ethereum's Merkle Patricia Tree](https://github.com/ethereum/wiki/wiki/Patricia-Tree) is different, but the concept is the same.

Proving absence: This is a really cool feature of Merkle Patricia Trees. You can prove a key is undefined (whether it is non-existent in the tree or is explicitly set to `null`). Null-proofs are currently working in version 2! I don't know of any tools besides this one that support them.

An important design decision I made (and implemented in the [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree/pull/82/files#diff-f2fabd87f37321748a5499f0df52f235R52) module underlaying this one), was to represent the proof as _itself_ a Patricia Tree (a _sparse_ one), in order to verify it. 

The steps:

- 1 create a new tree from scratch
- 2 `put`the nodes from proof into the flat key value DB (at `keccak(value)` -> `value`)
- 3 Set the tree root to the known value
- 4 perform a standard `get` on this tree

This affords a few interesting optimizations: First, it enabled me to recycle the tree-traversal code already being used, eliminating the hardest part, and avoiding have 2 versions of the same logic. Second it enabled null-proofs to be done with a simple amendment to the tree instead of inventing logic that I don't believe had been authored anywhere yet. Third, it allowed proofs to be combined and therefore compressed/optimized. The nodes could now be communicated in an order, eliminating the need to communicate the same nodes twice between different proofs. 

Lastly, This approach seems to extend much farther than I had originally thought: This sparse tree will actually support `put`, which means that it can be used as a drop-in replacement database for the EVM. An O(log(n)) replacement for the entire state database that is

## End Game

To complete the functionality attempted by this tool, a "light-client" tool (that downloads all the hashes and validates the work between them) will have to be built. The output of which might be a "workChain" which can interface with eth-proof to finally begin to leverage some of the really useful security properties of PoW blockchains.

We would like to find the right context to run an EVM implementation directly on a proof tree.

long term goal is are light clients that can validate an entire state transition. It would just need a proof containing all data touched during the state transition (tx). Unfortunately Ethereum removed the `receipt.postTransactioState` root which could have been useful for this :(

We also would like for wallets that only display data that has been verified.

We are finding it useful to relay ethereum to itself. You can make proofs about any historical information and information not usually available to the EVM can be made available. Layer 2 solutions like Truebit and Plasma could greatly benefit from this functionality.

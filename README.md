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
3. Use the `Verify` class to verify individual connected pieces within it. i.e. That the a `header` contains a specific `stateRoot`, or the `accountProof` contains a specific `account` at a specific `address`. This class has all the individual methods that `GetAndVerify` is using under the hood. 

While the `GetAndVerify` functions are useful for _dapps / wallets / block explorers_  to validate data before showing it to users, the `Verify` functions may be needed for more complex applications like _side-chains / state-channels / plasma_.


#### Instantiation

The getter classes (`GetProof` and `GetAndVerify`) request data from an RPC provider. So you'll have to instantiate an instance object with the RPC endpoint. 

```javascript
const { GetAndVerify, GetProof, VerifyProof } = require('eth-proof')
let getAndVerify = new GetAndVerify("http://localhost:8545")
```

Note: you must use a modern client that supports RPC. This might mean running your own full-node right now because infura does not support it yet. Also, if you would like to use historic proofs (ones who's blockhash is older than "latest"), you'll have to run your node with the following options:

```
geth --syncmode full  --gcmode archive
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

The data formats used/returned for account, `header`, `log`, `proof`, `receipt`, and t`ransaction` are my own creation `eth-object`. They mimic the native Ethereum format of being _arrays of byteArrays and nested arrays (of the same)_. An account will look like this:

```
[
  <Buffer 01>,
  <Buffer >,
  <Buffer c1 49 53 a6 4f 69 63 26 19 63 6f bd f3 27 e8 83 43 6b 9f d1 b1 02 52 20 e5 0f b7 0a b7 d2 e2 a8>,
  <Buffer f7 cf 62 32 b8 d6 55 b9 22 68 b3 56 53 25 e8 89 7f 2f 82 d6 5a 4e aa f4 e7 8f ce f0 4e 8f ee 6a>,
  nonce: <Buffer 01>
]
```

But they have helper methods for each expected property:

```javascript
console.log(account[0]) // => <buffer 01>
console.log(account.nonce) // => <buffer 01>
```

They can be converted to other useful formats

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

And they can be created from a direct RPC result or any of the other formats above:

```
Account.fromRPC(rpcResponseString)
Account.fromHex(rlpString)
Account.fromBuffer(rlpBuffer)
Account.fromRaw(arrayOfBuffers)
```

Hopefully this will be abstracted as its own NPM module soon at which point they will be subject to slight modification.

## Testing

The tx and receipt tests use infura right now (because I dont have a completely full node). The account and storage tests point to localhost:8545 because infura doenst yet support the rpc call needed to attain them `eth_getProof` (from EIP 1186).

Its all data currently on Ethereum Mainnet.

These tests hit Infura really hard because every tx or receipt proof requires multiple RPC calls (1 for each tx in the particular block). please be considerate. If you have a full archive node, re-point the rpc calls locally or comment out all but one tests at a time.

Thanks to @simon-jentzsch, for EIP-1186 to make this data available from Geth and Parity clients.


## How it Works

Proving absence: This is a really cool feature of Merkle Patricia Trees. You can prove a key is undefined (whether it is non-existent in the tree or is explicitly set to null). Null-proofs are currently working in version 2!

A `proof` can be structured as a sparse `tree`. The ethereum RPC formats proofs as an array of node values. Eth-proof buids a tree by batching all the node values of the proof into the underlying db at `sha3(value)` -> `value`. The verification takes place by simply using this tree that you built, as if it were the real merkle-patricia-tree. You can do any operations on it that you would normally do to the main one. If at any point during traversal of said tree, it tries to “step in” to a hash value that it cant find in the underlying db, this means the proof is missing pieces and is invalid.

## Future Tooling.

To complete the functionality attempted by this tool, a "light-client" tool (that downloads all the hashes and validates the work between them) will have to be built. The output of which might be a "workChain" which can interface with eth-proof to finally begin to leverage some of the really useful security properties of PoW blockchains.

Because proofs are being modeled as mini trees we can even run an EVM implementation directly on this tree as usual. If the EVM tries to traverse any data that doesn't exist (even null data must have proof of null), it should return as an invalid ("Missing node error").

## End Game

long term goal is are light clients that can validate an entire state transition. It would just need a proof containing all data touched during the state transition (tx). Unfortunately Ethereum removed the `receipt.postTransactioState` root which could have been useful for this :(

We also would like for wallets that only display data that has been verified.

We are also finding it useful to relay ethereum to itself. You can make proofs about any historical information and information not usually available to the EVM can be made available. Layer 2 solutions like Truebit and Plasma could greatly benefit from this functionality.


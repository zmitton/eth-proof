WIP Nothing works yet. "calm down, you're being very un-dude"

messy brain-dump below

library has 2 main functions
============================
   1- generating a proof (requires blockchain connection): EthProof
   2- checking a proof against a blockHash (self-evident): EthVerify

The EV (EthVerify) public API checks proofs against a specified blockHash.
Establishing trust of a blockHash is a separate issue. It relies on trust
of a chain, which should ultimately rely on a set of heuristics involving
expected total work at the current moment in time

Usage
=====
lib/testTx will build a proof from txHash using ethProof.js and connecting to infura, and then verify it using ethVerify

lib/testR will build a receipt proof from txHash using ethProof.js and connecting to infura, so far it works on some reciepts, trying to figure out hhhwhy. The reciept verification is not working yet


plan
====
ProofBuilding Library will depend on web3, and will require a web3 provider to be instantiated. The ProofVerifying Library will need nothing of the sort. it should work entirely client-side, thats the point :)

for txproof building and recieptProof building access to leveldb is not required. we find the relevent block and rebuild the trie (which is a small trie on with tx from that single block). This is why we can use rpc calls for everything, so you just give it a provider.

for state (accounts storage all that stuff) you cant get the proof from rpc calls, because the state trie is a huge trie (>20gb) and there are no RPC calls to get the proof data needed (the data is basically like a bunch of "sibling nodes"). This data is very easy to get directly from the levelDB however, and theirfore, we will be making an EIP which can hopefully support returning it. Maybe name the methods after standard RPC methods with maybe the word `proof` concatenated on them, and have them take 1 extra `blockHash` param. Another solution is for x-relay to run our own custom ethereum servers which support these proof requests.


design decisions
================
main EthVerify API should prove against a blockHash

including *some* repetitive data. each array to be hashed will already include the
hash from the previous step (in it). This will eliminate the need to inject the 
previous hash into the array, and shift all the elements

state absence:
its possible but construct the proof with a few amendments 
to EV.value call it EV.valueAbsence functionality

some Long term goals
====================

long term goal is a light client that can validate an entire state transition.it would need proofs for all data touched during the state transition (tx)with this goal in mind, the proofs would probably be better if they areformatted as a "mini-leveldb". you just have keys pointing to (what I have here as) the stack indecies (nodes). This way you would not have to repeat data shared between each proof (like the first few levels of the trie), plus it should be trivial to run the evm on mini-leveldb rather than this stack thinggy.




const Trie = require('merkle-patricia-tree')
const U = require('ethereumjs-util')

// const Keccak_256 = require('js-sha3').keccak_256
// const rlp = require('rlp');

// public methods all prove commitment to a blockHash
// all args currently expect Buffers

class VerifyProof{

  static header(header, blockHash){
    if(U.keccak(header).equals(blockHash)){
      return true
    }else{
      throw new Error("invalid header/blockhash")
    }
  }

  static account(address, account, branch, header, blockHash){
    let stateRoot = U.rlp.decode(header)[3]

    VerifyProof.header(header, blockHash)
    try{
      VerifyProof.trieValue(U.keccak(address), account, branch, stateRoot)
    }catch(e){
      let _ = Buffer.from([])
      let nullAccount = U.rlp.encode([_, _, U.KECCAK256_RLP, U.KECCAK256_NULL])
      if(e.message == 'Error: Unexpected end of proof' && account.equals(nullAccount)){
        return true //proof of absence 
      }else if(e.message == 'Error: Key does not match with the proof one (extention|leaf)'
        && account.equals(nullAccount)){
        return true //proof of absence // but why?
      }
      else{ 
        throw e
      }
    }
    return true
  }

  static transaction(rlpTxIndex, tx, branch, header, blockHash) {
    let txRoot = U.rlp.decode(header)[4]

    VerifyProof.header(header, blockHash)
    VerifyProof.trieValue(rlpTxIndex, tx, branch, txRoot)
    return true
  }

  static receipt(rlpTxIndex, receipt, branch, header, blockHash) {
    let receiptsRoot = U.rlp.decode(header)[5]

    VerifyProof.header(header, blockHash)
    VerifyProof.trieValue(rlpTxIndex, receipt, branch, receiptsRoot)
    return true
  }

  //getting the storage index: 
  //https://github.com/ethereum/wiki/wiki/JSON-RPC#example-14
  //its unclear if zero is implemented as <>, <00>, or <80>
  //turns out 0 is implemented as <290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563>
  //because this is the hash of 32 bytes of zeros. ahh this seems to be part of EVM design 
  //for same reason as addresses -> to prevent tree easy tree degeneration
  static storage(storageAddress, storageValue, storageBranch, address, account, branch, header, blockHash){
    // console.log("storageAddress, storageValue, storageBranch,", storageAddress, storageValue, storageBranch)
    let storageHash = U.rlp.decode(account)[2] //STORAGEHASH is index 2

    VerifyProof.account(address, account, branch, header, blockHash)
    try{
      VerifyProof.trieValue(U.keccak(storageAddress), U.rlp.encode(storageValue), storageBranch, storageHash)
    }catch(e){
      let NULL_BYTES= Buffer.from([])
      if(e.message == 'Error: Unexpected end of proof' && storageValue.equals(NULL_BYTES)){
        return true //proof of absence 
      }else if(e.message == 'Error: Key does not match with the proof one (extention|leaf)'
        && storageValue.equals(NULL_BYTES)){
        return true //proof of absence //but why?
      }
      else{ 
        throw e
      }
    }

    return true
  }

  // //todo: functions for verifying solidity?
  // static byteCode(address, byteCode, account, branch, header, blockHash){
  //   let accountVer = VerifyProof.account(address, account, branch, header, blockHash)
  //   if(U.keccak(byteCode).equals(U.rlp.decode(account)[3])){
  //     return true
  //   }else{
  //     throw new Error("invalid bytecode or proof given")
  //   }
  // }

  static log(rlpLogIndex, log, rlpTxIndex, receipt, branch, header, blockHash){
    let logIndex = U.bufferToInt(U.rlp.decode(rlpLogIndex))
    let receiptVer = VerifyProof.receipt(rlpTxIndex, receipt, branch, header, blockHash)

    if(U.rlp.encode(U.rlp.decode(receipt)[3][logIndex]).equals(log)){ 
      return true
    }else{
      throw new Error("Mismatched log for receipt given")
    }
  }

  static trieValue(path, value, branch, root){
    console.log("PATH", path)
    console.log("PROOF ", U.rlp.decode(branch))
    console.log("VALUE ", U.rlp.decode(value))
    console.log("BLOOM ", U.rlp.decode(value)[2].toString('hex'))
    console.log("ROOOT", U.keccak(U.rlp.encode(U.rlp.decode(branch)[0])), root)
    let complete, error, response = false
    let encodedBranch = []
    let branchArr = U.rlp.decode(branch)
    for (let i = 0; i < branchArr.length; i++) {
      encodedBranch.push('0x' + U.rlp.encode(branchArr[i]).toString('hex'))
    }

    Trie.verifyProof('0x'+root.toString('hex'), path, encodedBranch, (e,r)=>{
      error = e
      response = r
      complete = true
    })
    // let encodedBranch = branch.map((node)=>{
    //   return bufToHex(encode(node))
    // })

    // Trie.verifyProof(keccak(branch[0]), toBuf(path), encodedBranch, (e,r)=>{
    //   error = e
    //   response = r
    //   complete = true
    // })

    while(!complete){/*wait*/}

    if(error){
      throw Error(error)
    }else if(!value.equals(response)){
      throw new Error('Mismatched value for branch given')
    }else{
      return true
    }
  }
}

module.exports = VerifyProof

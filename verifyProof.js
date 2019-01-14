const Trie = require('merkle-patricia-tree')
const Util = require('ethereumjs-util')

// const Keccak_256 = require('js-sha3').keccak_256
// const rlp = require('rlp');

// public methods all prove commitment to a blockHash
// all args currently expect Buffers

class VerifyProof{

  static header(header, blockHash){
    if(Util.keccak256(header).equals(blockHash)){
      return true
    }else{
      throw new Error("invalid header/blockhash")
    }
  }

  static account(address, account, branch, header, blockHash){
    let stateRoot = Util.rlp.decode(header)[3]
    let hashedAddress = Util.keccak256(address)

    VerifyProof.header(header, blockHash)
    try{
      VerifyProof.trieValue(hashedAddress, account, branch, stateRoot)
    }catch(e){
      let _ = Buffer.from('','hex')// empty buffer
      let nullAccount = Util.rlp.encode([_, _, Util.KECCAK256_RLP, Util.KECCAK256_NULL])
      if(e.message == 'Error: Unexpected end of proof' && account.equals(nullAccount)){
        return true //proof of absence 
      }else{ 
        throw e
      }
    }
    return true
  }

  static transaction(rlpTxIndex, tx, branch, header, blockHash) {
    let txRoot = Util.rlp.decode(header)[4]

    VerifyProof.header(header, blockHash)
    VerifyProof.trieValue(rlpTxIndex, tx, branch, txRoot)
    return true
  }

  static receipt(rlpTxIndex, receipt, branch, header, blockHash) {
    let receiptsRoot = Util.rlp.decode(header)[5]

    VerifyProof.header(header, blockHash)
    VerifyProof.trieValue(rlpTxIndex, receipt, branch, receiptsRoot)
    return true
  }

  // //getting the storage index: 
  // //https://github.com/ethereum/wiki/wiki/JSON-RPC#example-14
  // //its unclear if zero is implemented as <>, <00>, or <80>
  // //untested!
  // static storage(storagePath, storageValue, storageBranch, address, account, branch, header, blockHash){
  //   let storageHash = Util.rlp.decode(account)[2] //STORAGEROOTINDEX = 2
  //   let accountVer = VerifyProof.account(address, account, branch, header, blockHash)
  //   let storageVer = VerifyProof.trieValue(storagePath, storageValue, storageBranch, storageHash)
  //   return accountVer && storageVer
  // }

  // //todo: functions for verifying solidity?
  // static byteCode(address, byteCode, account, branch, header, blockHash){
  //   let accountVer = VerifyProof.account(address, account, branch, header, blockHash)
  //   if(Util.keccak256(byteCode).equals(Util.rlp.decode(account)[3])){
  //     return true
  //   }else{
  //     throw new Error("invalid bytecode or proof given")
  //   }
  // }

  static log(rlpLogIndex, log, rlpTxIndex, receipt, branch, header, blockHash){
    let logIndex = Util.bufferToInt(Util.rlp.decode(rlpLogIndex))
    let receiptVer = VerifyProof.receipt(rlpTxIndex, receipt, branch, header, blockHash)

    if(Util.rlp.encode(Util.rlp.decode(receipt)[3][logIndex]).equals(log)){ 
      return true
    }else{
      throw new Error("Mismatched log for receipt given")
    }
  }

  static trieValue(path, value, branch, root){
    // console.log("zzzz","path",path.toString("hex"), "value",value.toString("hex"), "branch",Util.rlp.decode(branch), "root", root.toString("hex"))
    // console.log("last branch",Util.rlp.decode(branch)[Util.rlp.decode(branch).length-1][1].toString("hex"))
    // console.log("branch0",Util.rlp.decode(Util.rlp.decode(branch)[0]))
    // console.log("all", path, value, branch, root)
    // console.log("branch2",branch)
    let complete, error, response = false
    let encodedBranch = []
    let branchArr = Util.rlp.decode(branch)
    for (let i = 0; i < branchArr.length; i++) {
      encodedBranch.push('0x' + Util.rlp.encode(branchArr[i]).toString('hex'))
    }

    Trie.verifyProof('0x'+root.toString('hex'), path, encodedBranch, (e,r)=>{
      error = e
      response = r
      complete = true
    })

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

const Trie = require('merkle-patricia-tree')
const sha3 = require('js-sha3').keccak_256
const Util = require('ethereumjs-util')
const Rlp = require('rlp');

// public methods all prove commitment to a blockHash
// all args currently expect Buffers
// ToDo: they should all only take one proofNodes array merge header into branch 

class VerifyProof{
  static header(header, blockHash){
    if(Buffer.from(sha3(header),'hex').equals(blockHash)){
      return true
    }else{
      throw new Error("invalid header/blockhash")
    }
  }

  static account(address, account, branch, header, blockHash){
    let stateRoot = Rlp.decode(header)[3]
    let hashedAddress = Buffer.from(sha3(address),'hex')

    let headerVer = VerifyProof.header(header, blockHash)
    let accountVer = VerifyProof.trieValue(hashedAddress, account, branch, stateRoot)
    return headerVer && accountVer
  }
  static transaction(rlpTxIndex, tx, branch, header, blockHash) {
    let txRoot = Rlp.decode(header)[4]

    // console.log("txRoot", Rlp.decode(header))
    // console.log("branch", Rlp.decode(branch))
    // console.log("branch", sha3(Rlp.encode(Rlp.decode(branch)[0])))


    let headerVer = VerifyProof.header(header, blockHash)
    let txVer = VerifyProof.trieValue(rlpTxIndex, tx, branch, txRoot)
    return headerVer && txVer
  }
  static receipt(rlpTxIndex, receipt, branch, header, blockHash) {
    let receiptsRoot = Rlp.decode(header)[5]
// console.log("hhhh",rlpTxIndex, receipt, branch, header, blockHash)
    let headerVer = VerifyProof.header(header, blockHash)
    let receiptVer = VerifyProof.trieValue(rlpTxIndex, receipt, branch, receiptsRoot)
    return headerVer && receiptVer
  }

  //getting the storage index: 
  //https://github.com/ethereum/wiki/wiki/JSON-RPC#example-14
  //its unclear if zero is implemented as <>, <00>, or <80>
  //untested!
  static storage(storagePath, storageValue, storageBranch, address, account, branch, header, blockHash){
    let storageHash = Rlp.decode(account)[2] //STORAGEROOTINDEX = 2
    let accountVer = VerifyProof.account(address, account, branch, header, blockHash)
    let storageVer = VerifyProof.trieValue(storagePath, storageValue, storageBranch, storageHash)
    return accountVer && storageVer
  }
  //todo: functions for ing solidity?
  static byteCode(address, byteCode, account, branch, header, blockHash){
    let accountVer = VerifyProof.account(address, account, branch, header, blockHash)
    if(Buffer.from(sha3(byteCode),'hex').equals(Rlp.decode(account)[3])){
      return true
    }else{
      throw new Error("invalid bytecode or proof given")
    }
  }
  static log(rlpLogIndex, log, rlpTxIndex, receipt, branch, header, blockHash){
    let logIndex = Util.bufferToInt(Rlp.decode(rlpLogIndex))
    let receiptVer = VerifyProof.receipt(rlpTxIndex, receipt, branch, header, blockHash)
    // console.log("LL", rlpLogIndex, "LLL", logIndex)
    // console.log("LLLLL", Rlp.decode(receipt))
    // console.log("LLLLL", parseInt(Rlp.decode(rlpLogIndex)))
    // console.log("LLLLL", Rlp.decode(receipt)[3][Rlp.decode(rlpLogIndex)])
    if(Rlp.encode(Rlp.decode(receipt)[3][logIndex]).equals(log)){ 
      return true
    }else{
      throw new Error("invalid bytecode or proof given")
    }
  }

  static trieValue(path, value, branch, root){
    console.log("zzzz","path",path.toString("hex"), "value",value.toString("hex"), "branch",Rlp.decode(branch), "root", root.toString("hex"))
    // console.log("last branch",Rlp.decode(branch)[Rlp.decode(branch).length-1][1].toString("hex"))
    // console.log("branch",Rlp.decode(branch))
    // console.log("THING",sha3(Rlp.encode(Rlp.decode(branch)[1])))
    // console.log("all", path, value, branch, root)
    let complete, error, response = false
    branch = VerifyProof._encodeBranch(branch)
    // console.log("branch2",branch)

    Trie.verifyProof('0x'+root.toString('hex'), path, branch, (e,r)=>{
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
//private
  static _encodeBranch(inputBranch){
    var encodedBranch = []
    var branchArr = Rlp.decode(inputBranch)
    for (var i = 0; i < branchArr.length; i++) {
      encodedBranch.push('0x' + Rlp.encode(branchArr[i]).toString('hex'))
    }
    return encodedBranch
  }
}

module.exports = VerifyProof

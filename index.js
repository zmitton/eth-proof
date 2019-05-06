const GetAndVerify =  require('./getAndVerify.js')
const GetProof =  require('./getProof.js')
const VerifyProof =  require('./verifyProof.js')
const ProofUtil =  require('eth-util-lite') // maybe remove this in future version

module.exports = { GetAndVerify, GetProof, VerifyProof, ProofUtil}

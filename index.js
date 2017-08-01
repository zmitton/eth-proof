var VerifyProof = require('./verifyProof');
var BuildProof = require('./buildProof');

//merging all functionality 
var EthProof = Object.assign(BuildProof, VerifyProof);

module.exports = EthProof

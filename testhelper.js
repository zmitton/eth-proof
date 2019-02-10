// module.exports = getARandomRecentBlockhash = async (rpc) => {
//   let latestBlk = await rpc.eth_getBlockByNumber("latest")
//   let recentBlkNumber = parseInt(latestBlk.number) - Math.floor(Math.random() * 5)
//   let recentBlk = await  rpc.eth_getBlockByNumber(recentBlkNumber)
//   return recentBlk.number
// }

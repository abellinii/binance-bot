module.exports = {
config:{
	tradingPair: process.env.TARGET_ASSET + process.env.BASE_ASSET,
    profitPercentage: Number(process.env.PROFIT_PERCENTAGE)/100,
    budget: Number(process.env.BUDGET),
    compound: process.env.COMPOUND.toLowerCase() === "true",
    profitLockPercentage: Number(process.env.PROFIT_LOCK_PERCENTAGE)/100,
    stopLimitPercentage: Number(process.env.STOP_LIMIT_PERCENTAGE)/100
},
binance_apikey:process.env.YOUR_BINANCE_API_KEY,
binance_api_secret_key:process.env.YOUR_BINANCE_API_SECRET_KEY,
aws_access_key_id: process.env.YOUR_ACCESS_KEY_ID,
aws_secret_access_key: process.env.YOUR_SECRET_ACCESS_KEY
}

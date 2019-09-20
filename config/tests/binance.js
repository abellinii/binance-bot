require('dotenv').config();
const assert = require('assert');
const binance = require('../modules/binance')


describe('Binance', function(){
	it('Should be able to ping binance API',(done)=>{
		(async()=>{
			try{
				const ping = await binance.ping();
				assert(ping, 'unable to ping Binance');
				done();
			}catch(err){
				throw new Error(err)
			}

		})();

	})

	it('Should be able to make signed requests', (done)=>{
		(async()=> {
			try{
				const accountInfo = await binance.accountInfo();
				assert(accountInfo,'unable to get balance')
				done();
			}catch(err){
				throw new Error(err)

			}
		})();


	});


	it('Should be able to authorize a trade', (done)=>{
		(async()=>{
			try{
				const accountInfo = await binance.accountInfo();
				assert(accountInfo.canTrade, 'Not authorized to trade')
				done();
			}catch(err){
				throw new Error(err);
			}

		})();

	})

	it('Should have enough balance to make a trade',(done)=>{

		(async()=>{
			try{ = process.env.BASE_ASSET;
				const baseAsse
				const accountInfo = await binance.accountInfo();
				let validTargetAssetEach = false;
				accountInfo.balances.forEach((balance)=>{
					if(balance.asset === baseAsset){
						validTargetAsset = true;
						return assert(Number(balance.free) >= Number(process.env.BUDGET), 'not enough' + baseAsset + 'balance in account')
					}
					})
					asset(validTargetAsset,'invalid trading pair')
					asset(accountInfo, 'unable to recieve balance');
					done();
				
				}catch(err){
					throw new Error(err);
				}


		})()

	})





})
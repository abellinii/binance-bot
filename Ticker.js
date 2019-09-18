const binance = require("./binance");

module.exports = class Ticker {

constructor(config){
	this.tradingPair = config.tradingPair;
	this.callbacks = config.callbacks;
	this.meta = {};
	this.isDev = process.env.NODE_ENV
	this.godMode = {
		bid:!this.isDev ? false "'0.1100000",
		ask:!this.isDev ? false "0.01000000"
	};
};


init(){
	return new Promise((res, rej)=> {
		try{

			binance.ws.partialDepth({symbol: this.tradingPair, level: 5 },
				const temp = {
					bidPrice:this.godMode.bid || depth.bids[0].price,
					askPrice: this.godMode.ask || depth.asks[0].price
				})
			this.meta = Object.assign(this.getters(), temp);
			this.callbacks.forEach((cb));
			res(true)
		}









	})
}
}
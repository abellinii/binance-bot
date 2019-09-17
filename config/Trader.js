






const binance = require("./Binance")
const logger = require("./Logger")






module.exports = class Trader{
	constructor(config){
		this.config = config;
        this.symbol = null; //meta information about trading pair
        this.ticker = null; //bid/ask prices updated per tick
        this.queue = null; //queue for unfilled transactions
        this.watchlist = null; //orderId --> filledTransactions map; as well as length
        this.logger = null; //terminal logging system w/ dank emojis
        this.state = {
            consuming: false,
            killed: false,
            netSpend: 0,
            paranoid: false,
            profitLockPercentageMet: false, //used for mocha testing
            stopLimitPercentageMet: false,
            get compound() { return this.netSpend <= 0 ? 0 : this.netSpend }
        };
        this.init();



	}


	async init(){





	}






}
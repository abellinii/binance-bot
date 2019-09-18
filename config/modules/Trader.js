






const binance = require("./Binance")
const logger = require("./Logger")
const ledger = require("./Ledger")
const ticker = require("./Ticker")
const symbol = require("./Symbol")
const queue = require("./Queue")
const watchList = require("./watchlist")







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

        //Start logging
        this.logger = new Logger();
        this.logger.init()

        //Set trading pair information
        this.symbol = new Symbol({ tradingPair: this.config.tradingPair });
        await this.symbol.init();

        //Start queue
        this.queue = new Queue({ tradingPair:this.config.tradingPair,logger: this.logger})
        this.queue.init();

        //Set up Ticker
        const tickerConfig = {
            tradingPair: this.config.tradingPair,
            callback: [()=>this.consume()]
        }
        this.ticker = new Ticker(tickerConfig);

        const watchlistConifg = {
            config: this.config,
            state:this.state,
            ticker:this.ticker,
            logger:this.logger,
            Trader: this
        }
        this.watchlist.init();


        this.look();
	}

    look(){

        this.purchase();
    }


    fulfillOrders(){
        const state = this.state;
        const logger = this.logger;
        if(state.killed) return;
        if(state.consuming) return;

        state.consuming = true;
        logger.status({queueCount:this.queue.meta.length, watchCount = this.watchList.meta.length})
        const filledTransactions = await this.queue.digest();


        for(let orderId in filledTransactions){;

            const txn = filledTransactions[orderId]
            const side = txn.side;
            const price = Number(txn.price);
            if(side === 'BUY') this.watchlist.add(orderId,txn);
            logger.status({queueCount: this.queue.meta.length, watchCount:this.watchlist.meta.length });
            if(!state.stopLimitPercentageMet && side === 'SELL') this.hunt();

        }

        this.watchlist.watch();

        state.consuming = false;
    }


    calculateQuantity(){
        const logger = this.logger;
        logger.success('Calculating quantity.....');
        const symbol = this.symbol.meta;
        const minQuantiy = symbol.minQty;
        const maxQuantiy = symbol.maxQty;
        const quantitySigFig = symbol.quantitySigFig
        const stepSize = symbol.stepSize;
        this.currentPrice = this.ticker.meta.ask;
        const budget = this.config.budget + this.state.compound;

        let quantity = minQuantiy;
        while(quantity * currentprice <= budget) quantity += stepSize;
        if(quantity * currentPrice > budget) quantity -= stepSize;
        if(quantity === 0) quantity = minQuantity;

        assert(quantity >= minQuantity && quantity <= maxQuantity, 'invalid quantity');

        logger.success('Quantity Calculated: ' + quantity.toFixed(quantitySigFig))
        return quantity.toFixed(quantitySigFig);

    }


    async purchase(price){
    try{
        const symbol = this.symbol.meta;
        const tickSize = symbol.tickSize;
        const priceSigFig = symbol.priceSigFig;
        const quantitySigFig = symbol.quantitySigFig;
        const buyOrder = {  
            symbol: this.config.tradingPair
            side: 'BUY',
            quantity: this.calculateQuantity(),
            price:(price && price.toFixed(priceSigFig)) || (this.ticker.meta.ask).toFixed(priceSigFig) 
            };
            const unconfirmedPurchase = await binance.order(buyOrder);
            this.queue.push(unconfirmedPurchase);
            this.logger.success('Purchasing...' + unconfirmedPurchase.symbol);
        }catch(err){
            console.log('PURCHASE ERROR: ', err)
            return false;
        }

    }


    async sell(quantity, profit){
        try{
            const symbol = this.symbol.meta;
            const tickSize = symbol.tickSize;
            const pricesSigFig = symbol.priceSigFig;
            const quantitySigFig = symbol.quantitySigFig;
            const sellOrder = {
                symbol: this.config.tradingPair,
                side: 'SELL',
                quantity: this.calculateQuantity(),
                price: price.toFixed(priceSigFig) || (this.ticker.meta.ask).toFixed(priceSigFig);
            }
            const unconfirmedPurchase = await binance.order(sellOrder);
            this.queue.push(unconfirmedPurchase);
            this.logger.success('Purchasing...' + unconfirmedPurchase.symbol)
        }catch(err){
            console.log('PURCHASE ERROR: ', err)
            return false;
        }
    }

    compound(side,price){
        if(!this.config.compound) return;
        if(side == 'BUY') this.state.netSpend -= price;
        if(side == 'SELL') this.state.netSpend += price;
        this.logger.success('Compounding...' + this.state.netSpend)
    }

    async kill(){
        try{
            this.state.killed = true;
            const meta = this.queue.meta;
            const queue = meta.queue;
            const length = meta.length;
            const logger = this.logger;
            let counter = 0;

            logger.success(`Cancelling ${length} open orders created by binance bot`);
            for (let orderId in queue){
                const orderToCancel = queue[orderId];
                await binance.cancelOrder({
                    symbol: orderToCancel.symbol,
                    orderIdL orderToCancel.orderId
                })
                counter++;
            }
            logger.success(`Cancelled ${counter} opened orders created by binance bot`);

            return true;
        }catch(err){
            //disregard if order was already excecuted
            if(err.message === 'UNKNOWN_ORDER'){
                return false;
            }
            console.log('KILL ERROR: ', err.message);
            return false;
        }
    }


}























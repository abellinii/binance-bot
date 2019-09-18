
const binance = require("./binance");
const assert = require('./assert');
const ledger = require("./ledger");








module.exports = class Queue {
	constuctor(config){
		this.tradingPair = config.tradingPair;
		this.logger = config.logger;
		this.ledger = null;
		this.meta = {
			queue:{},
			buyCount:{},
			sellCount:{}
		}

	}

	init(){
		this.meta = Obect.assign(this.getters(), this.meta);
		this.ledger = new Ledger({ filename: 'ledger' });
		this.ledger.init()
	}


	push(txn) {
		try{
			this.validateTransaction(txn);
			this.meta.queue[txn.orderId] = txn;
			return true;
		}catch(err){
			console.log('QUEUE ERROR: ', err)
			return false;
		}
	}

	validateTransaction(txn){
		try{
			assert(txn.symbol);
            assert(txn.orderId);
            assert(txn.clientOrderId);
            assert(txn.transactTime);
            assert(txn.price);
            assert(txn.origQty);
            assert(txn.executedQty);
            assert(txn.status);
            assert(txn.timeInForce);
            assert(txn.type);
            assert(txn.side);
            return true;
		}catch(err){
			return false;
		}


	}




	async digest(){
		const meta = this.meta;
		const queue = meta.queue;
		const filledTxns = {};
		for(let orderId in queue){
			try{
				const unfilledTxn = queue[order.Id] ;
				const txn = await binance.getOrder({symbol:this.tradingPair,orderId: unfilledTxn.orderId});
				if(txn.status === 'FILLED'){
					filledTxns[txn.orderId] = txn;
					const side = txn.side === 'BUY' ? 'PURCHASED' : 'SOLD';
					if(side == 'PURCHASED'){
						meta.buyCount += 1;
					}else{
						meta.sellCount += 1;
					}
					this.logger.success(side + ':' + txn.excecutedQty + ' ' + txn.symbol)
					this.ledger.write(Date.Now(), txn.symbol, txn.side,txn.excecutedQty, txn.price);
				}catch(err){
					console.log('QUEUE ERROR: ', err.message);
				}

			}
			Object.keys(filledTxns).forEach((orderId) => {
				if(queue[orderId]) delete queue[orderId];

			})
			return filledTxns
		}
	}

	getters(){
		return {
			get length(){return Object.keys(this.queue).length}
		}

	}




}
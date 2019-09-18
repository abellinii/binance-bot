const fs = require('fs');







module.exports = class Ledger {

	constructor(config){
		this.filename = config.filename;
		this.extension = '.csv';
		this.file = this.filename + this.extension;
	}

	init(){
		try{
			if(!this.exists()) fs.appendFileSync(this.file, 'date,pair,side,amount,price,testing\n');
			return true;
		}catch(err){
			console.log('LEDGER ERROR: ', err.message);
			return false;

		}
		}
	

	exists(){
		return fs.existsSync(this.file);
	}

	write(date, pair, side, amount, price){
		const testing = process.env.NODE_ENV === 'dev' ? 'TESTING' : ''
		try{
			if(this.exists()){
				fs.appendFileSync(this.file, `${date} ${pair} ${side} ${amount}, ${price}, ${testing}\n`);

			}else{
	   				fs.appendFileSync(this.file, 'date, pair, side, amount, price, testing\n`);
					fs.appendFileSync(this.file, `${date} ${pair} ${side} ${amount}, ${price}, ${testing}\n`);
			}
			return true;
		}catch(err){
			console.log('LEDGER ERROR WRITE: ' + err)
			return false;
		}

	}


}
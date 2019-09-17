

const ora=require('ora');




module.exports = class Logger{
	constructor(config){
		this.logger = null;
		this.stats = null;
		this.queueCount = 0;
		this.watchCount = 0;


	}

	init(){
		this.logger = ora({text:'Initializing...',color: 'green'}).start();
	}

	status(stats){
		try{
			const newStats = 'Queue: ' + (Number(stats.queueCount) || 0) + ' Watchlist: ' + (Number(stats.watchCount) || 0);
			this.stats = newStats;
			this.logger.text = newStats;
		} catch(err){
			console.log('LOGGER ERROR: ' + err)

		}
	}

	success(message){

		try{
			const logger = this.logger;
			logger.succeed(message);
			logger.start(this.stats);
		} catch(err){
			console.log('LOGGER ERROR:  ' + err);
			return false;
		}
	}


} 
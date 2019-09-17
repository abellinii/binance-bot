
if (process.env.NODE_ENV === 'production') {
module.keys = require('./prod');
} else {
module.keys = require('./dev');
}

const Binance = require('binance-api-node');

const binance = Binance.default({
	apiKey:module.keys.binance_apikey,
	apiSecret:module.keys.binance_api_secret_key

})

module.binance = binance;
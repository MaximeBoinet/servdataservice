module.exports = (api) => {
	api.middlewares = {
		logger: require('./logger'),
		bodyParser: require('body-parser'),
		cache: require('./cache')(api),
		ensureAuthenticated: require('./ensureAuthenticated')(api)
	};
};

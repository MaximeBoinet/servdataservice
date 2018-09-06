const redis = require("redis"),client = redis.createClient();

module.exports = (api) => {
	function get(req, res, next) {
		client.get(req.originalUrl, function(err, reply) {
		if (reply) {
			return res.send(reply);
		}
    	next()
		});
	}

	function set(key, data) {
		client.set(key, data);
	}

	function clean(key) {
		return (req, res, next) => {
			client.del(key);

			next();
		}
	}

	function verifyToken(key) {
		client.get(key, function(err, reply) {
		if (reply) {
			return reply;
		}
    	return null;
		});
	}

	function addToken(key, data) {
		client.set(key, data);
	}

	function delToken(key) {
		client.del(key);
	}


	return {
		get,
		set,
		clean,
		verifyToken,
		addToken,
		delToken
	}
}

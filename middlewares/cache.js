var client;
if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	client = require("redis").createClient(rtg.port, rtg.hostname);

	redis.auth(rtg.auth.split(":")[1]);
} else {
	client = require("redis").createClient();
}

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

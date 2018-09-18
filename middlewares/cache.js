var client;
if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	client = require("redis").createClient(rtg.port, rtg.hostname);

	client.auth(rtg.auth.split(":")[1]);
} else {
	client = require("redis").createClient();
}
const jwt = require('jsonwebtoken');
module.exports = (api) => {
	function get(req, res, next) {
		client.get(req.originalUrl, function(err, reply) {
		if (reply) {
			console.log("cache sended")
			return res.send(reply);
		}
    	next()
		});
	}

	function set(key, data) {
		client.set(key, data, "EX", 60 * 60);
	}

	function clean(key) {
		return (req, res, next) => {
			client.del(key);

			next();
		}
	}

	function verifyToken(key, callback) {
		client.get(key, (err, reply) => {
		if (reply) {
			return callback(reply);
		}
    	return callback();
		});
	}

	function addToken(key, data, callback) {
		client.set(key, data, "EX", 60 * 60 , (err, reply) => {
			return callback(err, reply)
		});
	}

	function delToken(req, id, callback) {
		jwt.verify(req.headers.authorization, api.settings.security.salt, null, (err, decryptedToken) => {
			if (err) {
				return res.status(404).send('token.dont.exists');
			}
			api.middlewares.cache.verifyToken(decryptedToken.tokenId, (val) => {
				if (val) {
					client.del(decryptedToken.tokenId);
				}

				return callback()
			})
		});
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

const redis = require("redis"),client = redis.createClient({host : 'ec2-52-204-102-201.compute-1.amazonaws.com',
	user : 'h',
	port : 24999,
	password : 'pb939c4ea18ea26d76176758a142b9e1a3b6936b1ba018647ddf015d56d5f0e90',
	uri : 'redis://h:pb939c4ea18ea26d76176758a142b9e1a3b6936b1ba018647ddf015d56d5f0e90@ec2-52-204-102-201.compute-1.amazonaws.com:24999'});

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

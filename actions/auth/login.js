const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Client } = require('pg');
const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;

module.exports = (api) => {

	return function login(req, res, next) {
    if (!req.body.mail || !req.body.password) {
        return res.status(401).send('no.credentials');
    } else {
			const client = new Client({
	      connectionString: DATABASE_URL,
	    });
	    client.connect()
				.then(() => client.query("SELECT * FROM myuser WHERE mail = $1::text AND password = $2::text", [req.body.mail, req.body.password]))
        .then(resp => {
					if (!resp.rows[0]) {
						return res.status(403).send('wrong.credential')
					}
					console.log(resp.rows[0]);

					createToken(resp.rows[0], req, res, next)
				})
        .catch(e => res.status(500).send(e.stack))
				.then(() => client.end())
		}
	};

	function createToken(user, req, res, next) {
		let key = sha1(Date.now());
		console.log(user.iduser.toString());
		api.middlewares.cache.addToken(key, user.iduser.toString(), (err, data) => {
			if (err) {
				console.log("err : " + err);
			}
			console.log("data : " + data)
			console.log(key);
			jwt.sign({
					exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 100 * 1000), //100 days
					tokenId: key
				},
				api.settings.security.salt, {}, (err, encryptedToken) => {
					if (err) {
						return res.status(500).send(err.stack);
					}
					req.userId = user.iduser;
					return res.send(encryptedToken);
				}
			);
		});
	}
};

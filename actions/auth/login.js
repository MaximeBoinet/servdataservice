const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const { Client } = require('pg')
const { DATABASE_URL } = process.env;

module.exports = (api) => {

	return function login(req, res, next) {
    if (!req.body.mail || !req.body.password) {
        return res.status(401).send('no.credentials');
    } else {
			client.connect(() => {
				client.query('SELECT * FROM myuser WHERE mail = $1 AND password = $2', [req.body.mail, req.body.password] , (err, user) => {
					client.end(() => {
						if (!user) {
								return res.status(404).send('user.not.found');
						}
						createToken(user, req, next);

						return res.send(err ? err.stack : res.row);
					})

				})
			})
		}
	};

	function createToken(user, res, next) {
		let key = sha1(Date.now());
		api.middlewares.cache.addToken(key, user.id.toString());
		jwt.sign({
				exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 100 * 1000), //100 days
				tokenId: key
			},
			api.settings.security.salt, {}, (err, encryptedToken) => {
				if (err) {
					return res.status(500).send(err);
				}
				console.log(Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 100 * 1000));

				return res.send(encryptedToken);
			}
		);
	}
};

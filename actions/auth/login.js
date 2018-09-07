const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const { Client } = require('pg')
const { DATABASE_URL } = process.env;

module.exports = (api) => {

	return function login(req, res, next) {
		console.log("DATABASE URL" + JSON.stringify(DATABASE_URL))
		const client = new Client({
			connectionString: DATABASE_URL,
		});
    if (!req.body.mail || !req.body.password) {
        return res.status(401).send('no.credentials');
    } else {
			client.connect(() => {
				client.query("SELECT * FROM myuser WHERE mail = $1::text AND password = $2::text", [req.body.mail, req.body.password] , (err, user) => {
					client.end(() => {
						console.log(user)
						if (!user.rows[0]) {
								return res.status(404).send('user.not.found');
						}
						createToken(user.rows[0], res, next);
					})

				})
			})
		}
	};

	function createToken(user, res, next) {
		let key = sha1(Date.now());
		console.log(user)
		api.middlewares.cache.addToken(key, user.iduser.toString(), (err, data) => {
			console.log("backfrom cache")
			jwt.sign({
					exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 100 * 1000), //100 days
					tokenId: key
				},
				api.settings.security.salt, {}, (err, encryptedToken) => {
					if (err) {
						return res.status(500).send(err);
					}
					console.log("Timestamp" + Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 100 * 1000));

					return res.send("Token: "+ encryptedToken);
				}
			);
		});
	}
};

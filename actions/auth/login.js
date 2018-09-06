const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const { Client } = require('pg')
const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;

module.exports = (api) => {

	return function login(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(401).send('no.credentials');
    } else {
			client.connect(() => {
				client.query('INSERT INTO myuser(mail,password,phone,city,genre_idgenre VALUES ($1, $2, $3, $4))', [req.body.mail, req.body.password ,req.body.phone ,req.body.city] , (err, user) => {
					client.end(() => {
						createToken(user, req, next);

						return res.send(err ? err.stack : res.rows[0].message);
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

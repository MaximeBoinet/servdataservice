const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const Promise = require('promise');

module.exports = (api) => {

	return function login(req, res, next) {
    if (!req.body.mail || !req.body.password) {
        return res.status(401).send('no.credentials');
    } else {
			api.middlewares.pool.query("SELECT * FROM myuser WHERE mail = $1::text AND password = $2::text", [req.body.mail, req.body.password])
        .then(resp => {
					if (!resp.rows) {
						res.status(403).send('wrong.credential')
					}
					console.log(resp.rows[0]);

					createToken(resp.rows[0], req, res, next)
				})
        .catch(e => setImmediate(() => { throw e }))
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
						return res.status(500).send(err);
					}
					req.userId = user.iduser;
					return res.send(encryptedToken);
				}
			);
		});
	}
};

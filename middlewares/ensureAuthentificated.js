const jwt = require('jsonwebtoken');

module.exports = (api) => {

	function verifyAuth(req, res, next) {
		if (!req.headers || !req.headers.authorization) {
			return res.status(401).send('authentication.required');
		}

		const encryptedToken = req.headers.authorization;

		jwt.verify(encryptedToken, api.settings.security.salt, null, (err, decryptedToken) => {
			if (err) {
				return res.status(404).send('token.dont.exists');
			}

			api.middlewares.cache.verifyToken(decryptedToken,  function(val) {
				if (val == null) {
					return res.status(401).send('authentication.expired');
				}

				req.userId = val;

				return next();
			})

		});
	}

	return {
		verifyAuth
	};
};

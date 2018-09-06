module.exports = (api) => {

	return function logout(req, res, next) {
		api.middlewares.cache.delToken(req.userId, () => {
			req.userId = null;

			return res.send("disconected");
		});
	};
};

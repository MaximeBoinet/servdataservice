const router = require('express').Router();

module.exports = (api) => {
	router.post('/login',
        api.middlewares.bodyParser.json(),
		api.actions.auth.login);

	router.post('/logout',
		api.middlewares.ensureAuthentificated.verifyAuth,
		api.actions.auth.logout);

	return router;
}

const router = require('express').Router();

module.exports = (api) => {
	router.get('/:id',
    api.middlewares.ensureAuthenticated.verifyAuth,
		api.actions.users.findById);

		router.get('/',
	    api.middlewares.ensureAuthenticated.verifyAuth,
			api.actions.users.getConnected);

	router.get('/games/lendable',
    api.middlewares.ensureAuthenticated.verifyAuth,
		api.actions.users.getMyGames);

	router.get('/games/borrowed',
    api.middlewares.ensureAuthenticated.verifyAuth,
		api.actions.users.getMyBorrowedGame);

	router.post('/',
		api.middlewares.bodyParser.json(),
		api.actions.users.create);

	router.put('/:id/password',
    api.middlewares.ensureAuthenticated.verifyAuth,
		api.middlewares.bodyParser.json(),
		api.actions.users.updatePassword);

	router.put('/',
    api.middlewares.ensureAuthenticated.verifyAuth,
		api.middlewares.bodyParser.json(),
		api.actions.users.update);

	return router;
}

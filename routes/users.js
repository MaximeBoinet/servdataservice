const router = require('express').Router();

module.exports = (api) => {
	router.get('/:id',
    api.middlewares.ensureAuthentificated.verifyAuth,
		api.actions.users.findById);

	router.get('/games/lendable',
    api.middlewares.ensureAuthentificated.verifyAuth,
		api.actions.users.getMyGames);

	router.get('/games/borrowed',
    api.middlewares.ensureAuthentificated.verifyAuth,
		api.actions.users.getMyBorrowedGame);

	router.post('/',
		api.middlewares.bodyParser.json(),
		api.actions.users.create);

	router.put('/:id/password',
    api.middlewares.ensureAuthentificated.verifyAuth,
		api.middlewares.bodyParser.json(),
		api.actions.users.updatePassword);

	router.put('/',
    api.middlewares.ensureAuthentificated.verifyAuth,
		api.middlewares.bodyParser.json(),
		api.actions.users.update);

	return router;
}

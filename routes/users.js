const router = require('express').Router();

module.exports = (api) => {
	router.get('/:id',
    api.middlewares.ensureAuthentificated.verifyAuth,
		api.actions.users.findById);

	/*router.get('/username/:username',
        api.middlewares.ensureAuthentificated,
		api.actions.users.findByUsername);*/

	router.post('/',
		api.middlewares.bodyParser.json(),
		//api.middlewares.cache.clean('User'),
		api.actions.users.create);

	/*router.put('/:id/password',
    api.middlewares.ensureAuthentificated,
		api.middlewares.bodyParser.json(),
		api.actions.users.update);*/

	return router;
}

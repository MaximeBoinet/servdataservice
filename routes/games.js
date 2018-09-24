const router = require('express').Router();

module.exports = (api) => {
  router.get('/genre/:genre',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.middlewares.cache.get,
    api.actions.games.getAllGenre);

  router.get('/word/:word',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.middlewares.cache.get,
    api.actions.games.getAllWord);

  router.get('/users/:id',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.actions.games.getGamesFromUser)

  router.get('/:gameid',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.actions.games.getGameById)

  router.get('/lended/:id',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.actions.games.getLendedGamesFromUser)

  router.put('/lend/:id',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.actions.games.setLend);

  router.post('/',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.actions.games.createGame);

  return router;
}

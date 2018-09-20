const router = require('express').Router();

module.exports = (api) => {
  router.get('/genre/:genre',
    api.middlewares.ensureAuthentificated.verifyAuth,
    api.middlewares.cache.get,
    api.actions.games.getAllGenre);

  router.get('/word/:word',
    api.middlewares.ensureAuthentificated.verifyAuth,
    api.middlewares.cache.get,
    api.actions.games.getAllWord);

  return router;
}

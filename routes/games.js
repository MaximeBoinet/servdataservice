const router = require('express').Router();

module.exports = (api) => {
  router.get('/allgenre/:genre',
    api.middlewares.ensureAuthentificated.verifyAuth,
    api.middlewares.cache.get,
    api.actions.games.getAllGenre);

  router.get('/allword/:word',
    api.middlewares.ensureAuthentificated.verifyAuth,
    api.middlewares.cache.get,
    api.actions.games.getAllWord);

  return router;
}

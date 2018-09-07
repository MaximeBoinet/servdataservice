const router = require('express').Router();

module.exports = (api) => {
  router.get('/all/:genre',
    api.middlewares.cache.get,
    api.actions.games.getAllGenre);

  router.get('/allword/:word',
    api.middlewares.cache.get,
    api.actions.games.getAllWord);

  return router;
}

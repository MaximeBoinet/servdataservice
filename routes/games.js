const router = require('express').Router();

module.exports = (api) => {
  router.get('/all/:genre',
    api.middlewares.cache.get,
    api.actions.games.getAllGenre);

  router.get('/all/:word',
    api.middlewares.cache.get,
    api.actions.games.getAllGenre);

  return router;
}

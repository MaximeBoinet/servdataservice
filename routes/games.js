const router = require('express').Router();

module.exports = (api) => {
  router.get('/all/:genre',
    api.actions.games.getAllGenre);

  return router;
}

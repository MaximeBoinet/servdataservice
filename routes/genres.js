const router = require('express').Router();

module.exports = (api) => {
  router.get('/all',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.actions.genres.getAllGenre)

  router.get('/populate',
    api.actions.genres.populateBDD)

  return router;
}

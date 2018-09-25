const router = require('express').Router();

module.exports = (api) => {
  router.post('/:iduser',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.actions.comment.postComment)

  router.get('/:iduser',
    api.middlewares.ensureAuthenticated.verifyAuth,
    api.actions.comment.getComments)

  return router;
}

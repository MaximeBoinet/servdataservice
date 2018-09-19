module.exports = (api) => {
  function postComment (res, req, next) {
    api.middlewares.pool.query('INSERT INTO comment(mark, review, user_iduser) VALUES ($1, $2, $3) RETURNING *', [req.body.mark, req.body.review, req.body.user_iduser])
      .then(resp => res.send(resp.rows[0]))
      .catch(e => setImmediate(() => { throw e }))
  }

  function  getComments (res, req, next) {
    api.middlewares.pool.query('SELECT * FROM comment WHERE user_iduser = $1', [req.body.iduser])
      .then(resp => res.send(resp.rows[0]))
      .catch(e => setImmediate(() => { throw e }))
  }

  return {
    postComment,
    getComments
  }
}

const http = require('http');
const { Client } = require('pg');
const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;

module.exports = (api) => {

  function postComment (req, res, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect()
      .then(() => client.query('INSERT INTO comment(mark, review, user_iduser) VALUES ($1, $2, $3) RETURNING *', [req.body.mark, req.body.review, req.body.iduser]))
      .then((resp) => res.send(resp.rows[0]))
      .catch((e) => res.send(e))
      .then(() => client.end())
  }

  function  getComments (req, res, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect()
      .then(() => client.query('SELECT * FROM comment WHERE user_iduser = $1', [req.params.iduser]))
      .then((resp) => res.send(resp.rows))
      .catch((e) => res.send(e))
      .then(() => client.end())
  }

  return {
    postComment,
    getComments
  }
}

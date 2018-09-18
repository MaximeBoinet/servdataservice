const { Client } = require('pg')
const { DATABASE_URL } = process.env;

module.exports = (api) => {
  function postComment (res, req, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect((err) => {
      if (err) {
        return res.status(500).send(err.stack)
      }
      client.query('INSERT INTO comment(mail,password,phone,city,genre_idgenre) VALUES ($1, $2, $3, $4, $5)', [req.body.mail, req.body.password ,req.body.phone ,req.body.city, req.body.genre] , (err, resp) => {
        if (err) {
          return res.status(500).send(err.stack)
        }
        //return res.send(err ? err.stack : resp);
        client.end(() => {
          return res.send(err ? err.stack : resp.rows[0]);
        })
      })
    });
  }

  function  getComments (res, req, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect((err) => {
      if (err) {
        return res.status(500).send(err.stack)
      }
      client.query('INSERT INTO myuser(mail,password,phone,city,genre_idgenre) VALUES ($1, $2, $3, $4, $5)', [req.body.mail, req.body.password ,req.body.phone ,req.body.city, req.body.genre] , (err, resp) => {
        if (err) {
          return res.status(500).send(err.stack)
        }
        //return res.send(err ? err.stack : resp);
        client.end(() => {
          return res.send(err ? err.stack : resp.rows[0]);
        })
      })
    });
  }

  return {
    postComment,
    getComments
  }
}

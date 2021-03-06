const sha1 = require('sha1');
const http = require('http');
const { Client } = require('pg');
const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;
module.exports = (api) => {

    function findById(req, res, next) {
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      client.connect()
        .then(() => client.query('SELECT * FROM myuser WHERE iduser = $1', [req.params.userid]))
        .then(resp => {
          if (!resp || !resp.rows) {
            return res.status(404).send("This user doesn't exist")
          }
          res.send(resp.rows[0])
        })
        .catch((e) => res.status(500).send(e.stack))
        .then(() => client.end())
    }

    function getConnected(req, res, next) {
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      client.connect()
        .then(() => client.query('SELECT * FROM myuser WHERE iduser = $1', [req.userId]))
        .then((resp) => {
          if (!resp || !resp.rows) {
            return res.status(404).send("No user found with your token id")
          }
          res.send(resp.rows[0])
        })
        .catch((e) => res.status(500).send(e.stack))
        .then(() => client.end())
    }

    function create(req, res, next) {
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      client.connect()
        .then(() => client.query('INSERT INTO myuser(mail,password,phone,city,genre_idgenre) VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.body.mail, req.body.password ,req.body.phone ,req.body.city, req.body.genre]))
        .then(resp => {
          if (!resp)
          res.send(resp.rows[0])
        })
        .catch((e) => res.status(500).send(e.stack))
        .then(() => client.end())
    }

    function update(req, res, next) {
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      client.connect()
        .then(() => client.query('UPDATE myuser SET mail = $1, phone = $2, city = $3, genre_idgenre = $4 WHERE iduser = $5 RETURNING *', [req.body.mail, req.body.phone ,req.body.city, req.body.genre, req.userId]))
        .then((resp) => {
          if (!resp || !resp.rows) {
            return res.send
          }
          res.send(resp.rows[0])
        })
        .catch((e) => res.status(500).send(e.stack))
        .then(() => client.end())
    }

    function getMyGames(req, res, next) {
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      console.log(req.userId);
      client.connect()
        .then(() => client.query('SELECT * FROM game WHERE user_iduser = $1', [req.userId]))
        .then(resp => res.send(resp.rows))
        .catch((e) => res.status(500).send(e.stack))
        .then(() => client.end())
    }

    function getMyBorrowedGame(req, res, next) {
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      client.connect()
        .then(() => client.query('SELECT idgame,idigdb,name,description,urlcover,publisher,lended,user_iduser FROM games AS g, user_has_game AS u WHERE u.user_iduser = $1 AND g.idgame = u.user_iduser', [req.userId]))
        .then((resp) => res.send(resp.rows))
        .catch((e) => res.status(500).send(e.stack))
        .then(() => client.end())
    }

    function updatePassword(req, res, next) {
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      client.connect()
        .then(() => client.query('UPDATE myuser SET password = $1 WHERE iduser = $2 RETURNING *', [req.body.password, req.userId]))
        .then((resp) => res.send(resp.rows[0]))
        .catch((e) => res.status(500).send(e.stack))
        .then(() => client.end())
    }



    return {
        findById,
        create,
        update,
        getMyGames,
        getMyBorrowedGame,
        updatePassword,
        getConnected
    };
}

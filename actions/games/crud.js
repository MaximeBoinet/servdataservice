const request = require('request');
const http = require('http');
const { Client } = require('pg');
const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;

module.exports = (api) => {
  const baseURL = "https://api-endpoint.igdb.com/games/"
  function getAllGenre (req, res, next) {
    request({
    url: baseURL,
    method: "GET",
    headers : {
      "user-key" : api.settings.key.api,
      "Accept" : 'application/json'
    },
    qs: {
      "fields" : "id,name,publishers,cover,summary,genres",
      "filter[genres][eq]" : req.params.genre,
      "limit" : 20,
      "order" : "popularity:desc"
    }
  }, (error, response, body) => {
  	if (error) {
      return res.status(500).send("L'appel à l'API à achoué");
    }
    api.middlewares.cache.set(req.originalUrl, body);
    return res.status(200).send(body);
  });
  }

  function getAllWord (req, res, next) {
    request({
    url: baseURL,
    method: "GET",
    headers : {
      "user-key" : api.settings.key.api,
      "Accept" : 'application/json'
    },
    qs: {
      "search" : req.params.word,
      "fields" : "id,name,cover",
      "limit" : 50,
      "order" : "popularity:desc"
    }
  }, (error, response, body) => {
  	if (error) {
      return res.status(500).send("L'appel à l'API à achoué");
    }

    api.middlewares.cache.set(req.originalUrl, body);
    return res.status(200).send(body);
  });
  }

  function getLendedGamesFromUser (req, res, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect()
      .then(() => client.query('SELECT * FROM games WHERE user_iduser = $1 AND lended = 1', [req.params.id]))
      .then(resp => res.send(resp.rows))
      .catch(e => res.send(e))
  }

  function getGamesFromUser (req, res, next) {
    if (!req.userId) {
        return res.status(401).send('not logged in');
    }
    api.middlewares.pool.query('SELECT * FROM games WHERE user_iduser = $1', [req.params.id])
      .then(resp => res.send(resp.rows))
      .catch(e => setImmediate(() => { throw e }))
  }

  function setLend(req, res, next) {
    if (req.userId == undefined) {
        return res.status(401).send('not logged in');
    }
    api.middlewares.pool.query('UPDATE games SET lended = 1 WHERE idgame = $1 RETURNING *', [req.params.id])
      .then(resp => res.send(resp.rows))
      .catch(e => setImmediate(() => { throw e }))
  }

  return {
    getAllGenre,
    getAllWord,
    getLendedGamesFromUser,
    getGamesFromUser,
    setLend
  }
}

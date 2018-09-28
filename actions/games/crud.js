const request = require('request');
const http = require('http');
const { Client } = require('pg');
const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;

module.exports = (api) => {
  const baseURL = "https://api-endpoint.igdb.com/"
  function getAllGenre (req, res, next) {
    request({
    url: baseURL+"/games/",
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
    url: baseURL+"/games/",
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
      .then(() => client.end())
  }

  function getGamesFromUser (req, res, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect()
      .then(client.query('SELECT * FROM games WHERE user_iduser = $1', [req.params.id]))
      .then(resp => res.send(resp.rows))
      .catch(e => res.send(e))
      .then(() => client.end())
  }

  function setLend(req, res, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect()
      .then(client.query('UPDATE games SET lended = 1 WHERE idgame = $1 RETURNING *', [req.params.id]))
      .then(resp => res.send(resp.rows))
      .catch(e => res.send(e))
      .then(() => client.end())
  }

  function createGame(req, res, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect()
      .then(() => client.query('INSERT INTO games(idigdb, name, description, urlcover, publisher, lended, user_iduser) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.body.idapi, req.body.name, req.body.description, req.body.urlcover, req.body.publisher, req.body.lended, req.userId]))
      .then(resp => res.send(resp.rows[0]))
      .catch(e => res.send(e))
      .then(() => client.end())

  }

  function getGameById(req, res, next) {
    request({
    url: baseURL+"/games/"+req.params.gameid,
    method: "GET",
    headers : {
      "user-key" : api.settings.key.api,
      "Accept" : 'application/json'
    },
    qs: {
      "fields" : "id,name,publishers,cover,summary,genres"
    }
  }, (error, response, body) => {
  	if (error) {
      console.error(error);
      return res.status(500).send("L'appel à l'API à achoué");
    }
    return res.status(200).send(body);
  });
  }

  function getLenders (req, res, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect()
      .then(client.query('SELECT iduser,mail,password,phone,city,genre_idgenre FROM myuser AS u ,games AS g,  WHERE g.idigdb = $1 AND u.iduser = g.user_iduser', [req.params.id]))
      .then(resp => res.send(resp.rows))
      .catch(e => res.send(e))
      .then(() => client.end())
  }

  function getPublisher (req, res, next) {
    request({
    url: baseURL+"/companies/"+req.params.id,
    method: "GET",
    headers : {
      "user-key" : api.settings.key.api,
      "Accept" : 'application/json'
    },
    qs: {
      "fields" : "name"
    }
  }, (error, response, body) => {
  	if (error) {
      return res.status(500).send("L'appel à l'API à achoué");
    }
    return res.status(200).send(body);
  });
  }

  return {
    getAllGenre,
    getAllWord,
    getLendedGamesFromUser,
    getGamesFromUser,
    setLend,
    createGame,
    getGameById,
    getLenders,
    getPublisher
  }
}

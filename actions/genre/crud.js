
const request = require('request');
const http = require('http');const { Client } = require('pg');
const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;

let pref = ""
var val

module.exports = (api) => {
  function getAllGenre (req, res, next) {
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    client.connect()
      .then(() => client.query('SELECT * FROM genre'))
      .then(resp => {
        if (!resp || !resp.rows) {
          return res.status(404).send("No kind found")
        }
        res.send(resp.rows)
      })
      .catch((e) => res.status(500).send(e.stack))
      .then(() => client.end())
  }

  function populateBDD(req, res, next) {
      request({
      url: "https://api-endpoint.igdb.com/genres/",
      method: "GET",
      headers : {
        "user-key" : api.settings.key.api,
        "Accept" : 'application/json'
      },
      qs: {
        "fields" : "id,name",
        "limit" : 50
      }
    }, (error, response, body) => {
    	if (error) {
        return res.status(500).send("L'appel à l'API à achoué");
      }
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      const jsbody = JSON.parse(body)
      val = []
      buildSentence(0, jsbody, () => {
        client.connect()
          .then(() => client.query('DELETE FROM genre'))
          .then(() => client.query('INSERT INTO genre(idapi,name) VALUES' + pref + ' RETURNING *', val))
          .then(resp => {
            api.middlewares.cache.set(req.originalUrl, resp.rows.toString());
            res.send(resp.rows)
          })
          .catch((e) => res.send(e.stack))
          .then(() => client.end())
      });
    })
  }

  function buildSentence(index, tab, callback) {
    if(tab.length <= index) {
      return callback();
    }
    if(index > 0) {
      pref += ','
    }
    pref += "($"+ ((index*2)+1) +", $"+ ((index*2)+2) +")"
    val.push(tab[index].id)
    val.push(tab[index].name)

    return buildSentence(++index, tab)
  }

  return {
    getAllGenre,
    populateBDD
  }
}

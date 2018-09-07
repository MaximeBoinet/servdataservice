const request = require('request');

module.exports = (api) => {
  function getAllGenre (req, res, next) {
    request({
    url: "https://api-endpoint.igdb.com/games/",
    method: "GET",
    headers : {
      "user-key" : api.settings.key.api,
      "Accept" : 'application/json'
    },
    qs: {
      "fields" : "id,name,publishers,cover,summary,genres",
      "filter[genres][eq]" : req.params.genre,
      "limite" : 20,
      "order" : "popularity:desc"
    }
  }, function (error, response, body){
  	if (error) {
      return res.status(500).send("L'appel à l'API à achoué");
    }
    api.middlewares.cache.set(req.originalUrl, body);
    return res.status(200).send(body);
  });
  }

  return {
    getAllGenre
  }
}

const sha1 = require('sha1');

module.exports = (api) => {

    function findById(req, res, next) {
      api.middlewares.pool.query('SELECT * FROM myuser WHERE iduser = $1', [req.params.userid])
        .then(resp => res.send(resp.rows[0]))
        .catch(e => setImmediate(() => { throw e }))
    }

    function create(req, res, next) {
      api.middlewares.pool.query('INSERT INTO myuser(mail,password,phone,city,genre_idgenre) VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.body.mail, req.body.password ,req.body.phone ,req.body.city, req.body.genre])
        .then(resp => res.send(resp.rows[0]))
        .catch(e => setImmediate(() => { throw e }))
    }

    function update(req, res, next) {
      api.middlewares.pool.query('UPDATE myuser SET mail = $1, phone = $2, city = $3, genre_idgenre = $4 WHERE iduser = $5 RETURNING *', [req.body.mail, req.body.phone ,req.body.city, req.body.genre, req.userId])
        .then(resp => res.send(resp.rows[0]))
        .catch(e => setImmediate(() => { throw e }))
    }

    function getMyGames(req, res, next) {
      api.middlewares.pool.query('SELECT * FROM games WHERE user_iduser = $1', [req.userId])
        .then(resp => res.send(resp.rows))
        .catch(e => setImmediate(() => { throw e }))
    }

    function getMyBorrowedGame(req, res, next) {
      api.middlewares.pool.query('SELECT idgame,idigdb,name,description,urlcover,publisher,lended,user_iduser FROM games AS g, user_has_game AS u WHERE u.user_iduser = $1 AND g.idgame = u.user_iduser', [req.userId])
        .then(resp => res.send(resp.rows))
        .catch(e => setImmediate(() => { throw e }))
    }

    function updatePassword(req, res, next) {
      api.middlewares.pool.query('UPDATE myuser SET password = $1 WHERE iduser = $2 RETURNING *', [req.body.password, req.userId])
        .then(resp => res.send(resp.rows[0]))
        .catch(e => setImmediate(() => { throw e }))
    }

    return {
        findById,
        create,
        update,
        getMyGames,
        getMyBorrowedGame,
        updatePassword
    };
}

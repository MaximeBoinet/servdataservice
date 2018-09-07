const sha1 = require('sha1');
const { Client } = require('pg');
const { DATABASE_URL } = process.env;

module.exports = (api) => {

    function findById(req, res, next) {
      const client = new Client({
        connectionString: DATABASE_URL,
      });
      client.connect((err) => {
        if (err) {
          return res.status(500).send(err.stack)
        }
        client.query('SELECT * FROM mydb.myuser WHERE mail = $1 AND password = $2', [req.body.mail, req.body.password] , (err, resp) => {
          if (err) {
            return res.status(500).send(err.stack)
          }
          //return res.send(err ? err.stack : resp);
          client.end(() => {
            return res.send(err ? err.stack : resp[row]);
          })
        })
      });
    }

    function findByUsername(req, res, next) {
        /*User.findOne({
                username: req.params.username
            })
            .populate('Aquariums')
            .populate({
                path: 'Fishes',
                populate: { path: 'Species' }
            })
            .exec((err, data) => {
                if (err) {
                    return res.status(500).send();
                }
                if (!data || data.length == 0) {
                    return res.status(404).send("user.not.found");
                }
                return res.send(data);
            })*/
    }

    function create(req, res, next) {
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
            return res.send(err ? err.stack : resp);
          })
        })
      });
    }

    function update(req, res, next) {
        /*if (req.userId != req.params.id) {
            return res.status(401).send('cant.modify.another.user.account');
        }
        if (req.body.password) {
            req.body.password = sha1(req.body.password)
        }
        User.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(404).send("user.not.found");
            }
            return res.send(data);
        });*/
    }

    function remove(req, res, next) {
        /*if (req.userId != req.params.id) {
            return res.status(401).send('cant.delete.another.user.account');
        }
        User.findByIdAndRemove(req.para, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!data) {
                return res.status(404).send('user.not.found');
            }

            if(data.Fishes !== []){

            }

            if(data.Aquariums !== []){

            }
            return res.send(data);
        });*/
    }

    return {
        findById,
        create
    };
}

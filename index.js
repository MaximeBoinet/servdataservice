const express = require('express');
const api = express();

require('./settings')(api);
console.log('\n>> Settings initialized');
require('./middlewares')(api);
console.log('>> Middleware initialized');
require('./actions')(api);
console.log('>> Actions initialized');
require('./routes')(api);
console.log('>> Routes initialized');
let date = new Date()
api.listen(process.env.PORT || api.settings.port);
console.log(`(%s:%s:%s) Server started and listening on port %s`, date.getHours(), date.getMinutes(), date.getSeconds(), process.env.PORT || api.settings.port)

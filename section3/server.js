const http = require('http');

const routes = require('./routes');
//cannot edit imported objects

const server = http.createServer(routes);

server.listen(3000);
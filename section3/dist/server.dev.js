"use strict";

var http = require('http');

var routes = require('./routes'); //cannot edit imported objects


var server = http.createServer(routes);
server.listen(3000);
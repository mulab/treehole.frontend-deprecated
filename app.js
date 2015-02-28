'use strict';

var express = require('express');
var app = express();

var server = require('http').createServer(app);

require('./config')(app);
require('./routes')(app);

server.listen(process.env.PORT, function () {
  console.log('Web server listening');
});

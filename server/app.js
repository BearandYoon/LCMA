/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
//var Promise = require('es6-promise').Promise;
var Token = require('./components/token');
var app = express();


var server = require('http').createServer(app);
require('./config/express')(app);
require('./components/module').init(app);
require('./routes')(app);
require('./components/db')();


// TODO: Remove this when you are sure it is not used anymore
global.$app = {};

app.use(function (req, res, next) {

  var token = Token.get(req);

  if(token) {
    global.$app.user_id = token.iss;
  }

});



// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;

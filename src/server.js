var Hapi = require('hapi'),
    acquire = require('acquire'),
    Engine = acquire('engine').Engine;

// Create a server with a host and port
var Server = function () {
  this.server = null;
  this.engine = null;
  this.init();
};

Server.prototype.init = function () {
  var self = this;
  self.engine = new Engine();
  self.server = new Hapi.Server();
  self.server.connection({
    host: 'localhost',
    port: 8000
  });

  // Add the route
  self.server.route({
    method: 'POST',
    path: '/add',
    handler: function (request, reply) {
      reply('hello world');
    }
  });
};

Server.prototype.start = function () {
  var self = this;
  self.server.start();
};

module.exports.Server = Server;
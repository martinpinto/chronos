var Hapi = require('hapi'),
  acquire = require('acquire'),
  Engine = acquire('engine').Engine,
  winston = require('winston');

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

  // Add insert_events
  self.server.route({
    method: 'POST',
    path: '/insert_events',
    handler: function (request, reply) {
      var nowait = request.query.nowait !== undefined;
      if (request.query.nowait !== undefined) {
        reply({
          status: 'ok'
        });
      }
      self.engine.insertEvents(request.payload.events, function (err, res) {
        if (nowait) {
          return;
        }
        if (err) {
          return reply(JSON.stringify(err), null).code(500);
        } else {
          return reply(res);
        }
      });
    }
  });

  // Add find_event_ids route
  self.server.route({
    method: 'POST',
    path: '/find_events',
    handler: function (request, reply) {
      var eventTemplates = request.payload.templates,
        timerange = request.payload.timerange,
        numEvents = request.payload.count;

      self.engine.findEvents(eventTemplates,
        timerange,
        numEvents,
        function (err, res) {
          if (err) {
            return reply(JSON.stringify(err), null).code(500);
          } else {
            return reply(res);
          }
        });
    }
  });
  winston.log('info', 'Chronos is up and running...');
};

Server.prototype.start = function () {
  var self = this;
  self.server.start();
};

module.exports.Server = Server;
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

  // Add insert_events
  self.server.route({
    method: 'POST',
    path: '/insert_events',
    handler: function (request, reply) {
      self.engine.insertEvents(request.payload.events, function (err, res) {
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
    path: '/find_event_ids',
    handler: function (request, reply) {

      var eventTemplates = request.payload.eventTemplates,
        timerange = request.payload.timerange,
        storageState = request.payload.storageState,
        numEvents = request.payload.numEvents,
        resultType = request.payload.resultType;

      self.engine.findEventIds(eventTemplates,
        timerange,
        storageState,
        numEvents,
        resultType,
        function (err, res) {
          if (err) {
            return reply(JSON.stringify(err), null).code(500);
          } else {
            return reply(res);
          }
        });
    }
  });
};

Server.prototype.start = function () {
  var self = this;
  self.server.start();
};

module.exports.Server = Server;
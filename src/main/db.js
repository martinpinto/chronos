var elasticsearch = require('elasticsearch'),
  acquire = require('acquire'),
  dbUtils = acquire('dbUtils'),
  sugar = require('sugar'),
  Seq = require('seq'),
  config = require('config');


function DB() {
  this.esClient = null;
  this.init();
}

// class methods
DB.prototype.init = function () {
  var self = this;
  self.esClient = new elasticsearch.Client({
    hosts: [
      {
        host: config.get('engine.dbConfig.host'),
        port: config.get('engine.dbConfig.port'),
    }]
  });
};

DB.prototype.createIndices = function (events, callback) {
  var self = this,
    indices = events.map(function (event) {
      return event.index;
    }).unique();

  try {
    new Seq(indices)
      .seqEach(function (index) {
        var that = this;
        self.esClient.indices.exists({
          index: index
        }, function (err, resp) {
          if (err) {
            throw err;
          }
          if (resp === true) {
            that();
          } else {
            self.esClient.indices.create({
              index: index,
              body: {
                mappings: {
                  _default_: {
                    properties: dbUtils.getEventMapping()
                  }
                }
              }
            }, function (err) {
              if (err) {
                throw err;
              }
              that();
            });
          }
        });
      })
      .seq(function () {
        callback();
      });
  } catch (ex) {
    callback(ex);
  }
};

DB.prototype.addEvents = function (events, callback) {
  var self = this;

  // Assign proper indices toe the events
  events.map(function (event) {
    event.index = dbUtils.getIndexForEvent(event);
    return event;
  });

  self.createIndices(events, function (err) {
    if (err) {
      callback(err);
    }
    // Write to DB
    self.esClient.bulk({
      body: dbUtils.getFormattedEvents(events)
    }, function (err, resp) {
      var result = [];
      if (!err) {
        var items = resp.items;
        for (var i in items) {
          var item = {
            index: items[i].create._index,
            type: items[i].create._type,
            id: items[i].create._id,
            error: items[i].create.error ? items[i].create.error : null
          };
          result.push(item);
        }
      }
      callback(err, result);
    });
  });
};

// export the class
module.exports.DB = DB;
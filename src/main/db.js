var elasticsearch = require('elasticsearch'),
  acquire = require('acquire'),
  dbUtils = acquire('dbUtils'),
  sugar = require('sugar'),
  Seq = require('seq');

function DB() {
  this.esClient = null;
  this.init();
}

// class methods
DB.prototype.init = function () {
  var self = this;
  self.esClient = new elasticsearch.Client({
    host: 'localhost:9200'
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
          result.push({
            index: items[i].index._index,
            type: items[i].index._type,
            id: items[i].index._id
          });
        }
      }
      callback(err, result);
    });
  });
};

// export the class
module.exports.DB = DB;
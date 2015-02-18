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

DB.prototype.createIndices = function (events) {
  var self = this,
    indices = events.map(function (event) {
      return event.index;
    }).unique();

  console.log(indices);

  new Seq(indices)
    .seqMap(function (index, i) {
      var that = this;
      self.esClient.indices.exists({
        index: index
      }, function (err, resp, status) {
        var res = {
          index: index,
          exists: resp
        };
        console.log(res);
        that(err, {
          index: index,
          exists: resp
        });
      });
    })
    .seq(function (data) {
      var that = this;
      console.log(typeof data)
      console.log("-->", data);
    })
    .seqMap(function (index, i) {
      var that = this;
      console.log(index)
    })
    .catch(function (err) {
      console.error(err.stack ? err.stack : err)
    });
}

DB.prototype.addEvents = function (events, callback) {
  var self = this;

  // Assign proper indices toe the events
  events.map(function (event) {
    event.index = dbUtils.getIndexForEvent(event);
    return event;
  });

  self.createIndices(events);


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

};

// export the class
module.exports.DB = DB;
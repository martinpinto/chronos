var elasticsearch = require('elasticsearch'),
  acquire = require('acquire'),
  dbUtils = acquire('dbUtils');

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

DB.prototype.addEvents = function (events, callback) {
  var self = this;

  // Assign proper indices toe the events
  events.map(function (event) {
    event.index = dbUtils.getIndexForEvent(event);
    return event;
  });

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
var acquire = require('acquire'),
    event = acquire('event');

var data = {
  type: 'click',
  actor: 'user1',
  subjects: [],
  timestamp: 1234567890,
  typeDomain: 'clickFromWebsite',
  orign: 'http://youtube.com',
  payload: []
};
console.log(event);
var event = event.createEventFromData(data);

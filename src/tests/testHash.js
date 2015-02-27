var acquire = require('acquire');
var event = acquire('event');
var assert = require('assert');

var data1 = {
    type: 'click',
    actor: 'user1',
    subjects: [{
        id: 'http://yahoo.com',
        type: 'website',
        text: 'Yahoo!',
        domain: 'yahoo.com'
  }],
    timestamp: 0,
    typeDomain: 'clickFromWebsite',
    origin: 'http://yahoo.com',
    payload: []
};

var data2 = {
    type: 'click',
    actor: 'user1',
    subjects: [{
        id: 'http://yahoo.com',
        type: 'website',
        text: 'Yahoo!',
        domain: 'yahoo.com'
  }],
    timestamp: 0,
    typeDomain: 'clickFromWebsite',
    origin: 'http://yahoo.com',
    payload: []
};

var data3 = {
    type: 'click',
    actor: 'user1',
    subjects: [{
        id: 'http://google.com',
        type: 'website',
        text: 'Google Search',
        domain: 'google.com',
  }],
    timestamp: Date.now(),
    typeDomain: 'clickFromWebsite',
    origin: 'http://youtube.com',
    payload: []
};

var event1 = event.createEventFromData(data1);
var event2 = event.createEventFromData(data2);
var event3 = event.createEventFromData(data3);

assert.ok(event1.id === event2.id); // identical hash codes
assert.ok(event1.id !== event3.id); // different hash codes

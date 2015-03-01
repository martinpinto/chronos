/*global describe, it*/

var acquire = require('acquire'),
  event = acquire('event'),
  assert = require('assert');

var data1 = {
  interpretation: 'click',
  actor: 'user1',
  subjects: [{
    id: 'http://yahoo.com',
    interpretation: 'website',
    text: 'Yahoo!',
    origin: 'yahoo.com'
  }],
  timestamp: 0,
  manifestation: 'clickFromWebsite',
  origin: 'http://yahoo.com',
  payload: []
};


var data2 = {
  interpretation: 'click',
  actor: 'user1',
  subjects: [{
    id: 'http://google.com',
    interpretation: 'website',
    text: 'Google Search',
    origin: 'google.com',
  }],
  timestamp: Date.now(),
  manifestation: 'clickFromWebsite',
  origin: 'http://youtube.com',
  payload: []
};


describe('Event', function () {
  describe('#createEventFromData()', function () {
    it('Event ids generated based on property keys', function () {

      var event1 = event.createEventFromData(data1);
      var event2 = event.createEventFromData(data1);
      var event3 = event.createEventFromData(data2);

      assert.ok(event1.id === event2.id); // identical hash codes
      assert.ok(event1.id !== event3.id); // different hash codes
      data1.subjects[0].id = 'http://facebook.com';

      var event4 = event.createEventFromData(data1);
      assert.ok(event1.id !== event4.id); // different hash codes
    });
  });

  describe('#matchesTemplate()', function () {
    it('Match events', function () {

      var event1 = event.createEventFromData(data1);
      var event2 = event.createEventFromData(data1);
      var template1 = {
        interpretation: 'click',
        subjects: [{
          id: event1.subjects[0].id
        },]
      };

      assert.ok(event1.matchesTemplate(template1));
      assert.ok(event1.matchesTemplate(event2));
    });
  });
});
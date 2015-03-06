/* global describe, it*/

var acquire = require('acquire'),
  event = acquire('event'),
  subject = acquire('subject'),
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

var data3 = {
  id: 'http://google.com',
  interpretation: 'website',
  text: 'Google Search',
  origin: 'google.com',
  mimeType: 'text/html'
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
    it('should return an error if an event template does not match another', function () {

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
  
  describe('#createEventFromData()', function() {
    it('should return an error if an event field is not defined as in event.requiredFields', function() {
      var event1 = event.createEventFromData(data1);
      var requiredFields = event.requiredFields;
      for (var rkey in requiredFields) {
        assert.ok(typeof event1[rkey] === requiredFields[rkey]);
      }
    });
  });
    
});

describe('Subject', function() {
  describe('#createSubjectFromData()', function() {
    it('should return an error if a subject field is not defined as in subject.requiredFields', function() {
      var subject1 = subject.createSubjectFromData(data3);
      var requiredFields = subject.requiredFields;
      for (var rkey in requiredFields) {
        assert.ok(typeof subject1[rkey] === requiredFields[rkey]);
      }
    });
  });
  
  describe('#matchesTemplate()', function() {
    it('should return an error if a subject template does not match another', function () {
      
      var subject1 = subject.createSubjectFromData(data3);
      var subject2 = subject.createSubjectFromData(data3);
      var template1  = {
        interpretation: 'click'
      };
      
      assert.ok(subject1.matchesTemplate(template1));
      assert.ok(subject2.matchesTemplate(subject1));
    });
  });
    
});

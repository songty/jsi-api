'use strict';


var App = window.App = Ember.Application.create();
require('./router.js')(App);

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'http://localhost:9000/api/v1/employees'
});

App.Employee = DS.Model.extend({
  id: DS.attr('string'),
  name: DS.attr('string'),
  role: DS.attr('string'),
  links: DS.attr('string')
});


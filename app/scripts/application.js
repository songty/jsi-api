'use strict';


var App = window.App = Ember.Application.create();
require('./router.js')(App);

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/v1',
  host: 'http://localhost:9000'
});

App.Employee = DS.Model.extend({
  eployeeID: DS.attr('string'),
  name: DS.attr('string'),
  role: DS.attr('string'),
  links: DS.attr('string')
});


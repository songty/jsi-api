'use strict';


var App = window.App = Ember.Application.create();
require('./router.js')(App);

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/v1',
  host: 'http://localhost:9000'
});

App.Employee = DS.Model.extend({
  name: DS.attr('string'),
  role: DS.attr('string')
});

console.log(App.Employee);

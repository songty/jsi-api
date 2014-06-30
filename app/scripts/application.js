'use strict';


var App = window.App = Ember.Application.create();
require('./router.js')(App);

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/v1',
  host: 'http://localhost:9000'
});

App.Employee = DS.Model.extend({
  name: DS.attr('string'),
  role: DS.attr('string'),
  boss: DS.belongsTo('employee', {async: true}),
  projects: DS.hasMany('projects', {async: true}),
  reports: DS.hasMany('employee', {async: true})
});

App.Project = DS.Model.extend({
	teamMembers: DS.hasMany('employee', {async: true}),
	name: DS.attr('string')
});
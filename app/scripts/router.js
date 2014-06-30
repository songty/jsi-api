'use strict';
module.exports = function(App){
  App.Router.map(function(){
  	this.resource('employee', { path: '/employee/:employee_id' });
  });
  App.IndexRoute = Ember.Route.extend({
    model: function(){
      return this.store.findAll('employee');
    }
  });
  App.EmployeeRoute = Ember.Route.extend({
  	actions: {
  		home: function() {
  			this.transitionTo('index');
  		}
  	}
  });
};


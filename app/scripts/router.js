'use strict';
module.exports = function(App){
  App.Router.map(function(){
  	this.resource('employee', { path: '/employee/:employee_id' }, function() {
  		this.route('edit');
  	});
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
  		},
  		edit: function() {
  			this.transitionTo('employee.edit');
  		}
  	}
  });
  App.EmployeeEditRoute = Ember.Route.extend({
  	model: function(param) {
  		return this.store.find('employee', param);
  	}
  });
};


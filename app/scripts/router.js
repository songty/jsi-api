'use strict';
module.exports = function(App){
  App.Router.map(function(){
    console.log('I\'m the router');
  });
  App.IndexRoute = Ember.Route.extend({
    model: function(){
      return this.store.find('employee');
    }
  });
};

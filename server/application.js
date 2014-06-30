'use strict';

var _ = require('lodash');
var util = require('util');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var favicon = require('serve-favicon');
var config = require('./config');

var app = express();
var config = require('./config');

var knexConfig = require('../knexfile.js')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

if (config.env === 'development') {
  var connectLivereload = require('connect-livereload');
  app.use(connectLivereload({ port: process.env.LIVERELOAD_PORT || 35729 }));
  app.use(morgan('dev'));
  app.use(require('knex-logger')(knex));
  app.use(express.static(config.public));
  app.use(express.static(path.join(__dirname, '../app')));
}
if (config.env === 'production') {
  app.use(morgan('default'));
  app.use(favicon(path.join(config.public, 'favicon.ico')));
  app.use(express.static(config.public));
  app.use(compression());
}
app.use(bodyParser.json());
app.use(methodOverride());

var Employee,
    Project;

Employee = bookshelf.Model.extend({
  projects: function() {
    return this.belongsToMany(Project);
  },
  boss: function() {
    return this.belongsTo(Employee, 'boss_id');
  },
  reports: function() {
    return this.hasMany(Employee, 'boss_id');
  },
  tableName: 'employees'
});

Project = bookshelf.Model.extend({
  teamMembers: function() {
    return this.belongsToMany(Employee);
  },
  tableName: 'projects'
});

var api = express.Router();

var clean = _.partialRight(_.pick, function(value, key) {
  return key.charAt(0) !== '_' && !key.match(/_id$/);
});

var decorate = {
  employee: function(employee) {
    if (!employee) { return employee; }
    var links = {
      reports: util.format('/api/v1/employees/%s/reports', employee.id),
      projects: util.format('/api/v1/employees/%s/projects', employee.id)
    };
    if (employee.boss || employee.bossId) {
      links.boss = util.format('/api/v1/employees/%s/boss', employee.id);
    }
    return _.extend({}, clean(employee), { links: links });
  },
  project: function(project) {
    if (!project) { return project; }
    var links = {
      members: util.format('/api/v1/projects/%s/members', project.id)
    };
    return _.extend({}, clean(project), { links: links });
  }
};

var delay = function(req, res, next) {
  setTimeout(next, 500);
};

api.get('/employees', delay, function(req, res) {
  Employee.fetchAll().then(function(collection) {
    var employees = collection.toJSON().map(function(employee) {
      return decorate.employee(employee);
    });
    res.json({ employees: employees });
  }).done();
});

api.get('/employees/:id', delay, function(req, res) {
  Employee.where({ id: req.params.id }).fetch().then(function(model) {
    res.json({ employee: decorate.employee(model.toJSON()) });
  }).done();
});

api.put('/employees/:id', delay, function(req, res) {
  Employee.where({ id: req.params.id }).fetch().then(function(model) {
    model.set('name', req.body.employee.name);
    model.set('role', req.body.employee.role);
    // TODO: update projects as well
    return model.save();
  }).then(function(model) {
    res.json({ employee: decorate.employee(model.toJSON()) });
  }).done();
});


api.get('/employees/:id/boss', delay, function(req, res) {
  // TODO: improve query
  Employee.where({ id: req.params.id })
  .fetch({ withRelated: 'boss' })
  .then(function(model) {
    var employee = model && model.toJSON();
    res.json({ employee: decorate.employee(employee.boss) });
  });
});

api.get('/employees/:id/projects', delay, function(req, res) {
  // TODO: improve query
  Employee.where({ id: req.params.id })
  .fetch({ withRelated: 'projects' })
  .then(function(model) {
    var employee = model && model.toJSON();
    var projects = (employee && employee.projects || []).map(function(project) {
      return decorate.project(project);
    });
    res.json({ projects: projects });
  });
});

api.get('/employees/:id/reports', delay, function(req, res) {
  // TODO: improve query
  Employee.where({ id: req.params.id })
  .fetch({ withRelated: 'reports' })
  .then(function(model) {
    var employee = model && model.toJSON();
    var reports = (employee && employee.reports || []).map(function(employee) {
      return decorate.employee(employee);
    });
    res.json({ employees: reports });
  });
});

api.get('/projects', delay, function(req, res) {
  Project.fetchAll().then(function(collection) {
    var projects = collection.toJSON().map(function(project) {
      return decorate.project(project);
    });
    res.json({ projects: projects });
  }).done();
});

api.get('/projects/:id', delay, function(req, res) {
  Project.where({ id: req.params.id }).fetch().then(function(model) {
    res.json({ project: decorate.project(model.toJSON()) });
  });
});

api.get('/projects/:id/members', delay, function(req, res) {
  // TODO: improve query
  Project.where({ id: req.params.id })
  .fetch({ withRelated: 'teamMembers' })
  .then(function(model) {
    var project = model && model.toJSON();
    var members = (project && project.teamMembers || []).map(function(employee) {
      return decorate.employee(employee);
    });
    res.json({ employees: members });
  });
});

app.use('/api/v1', api);
app.get('/*', function(req, res) {
  res.sendfile(path.join(config.public, 'index.html'));
});


// expose app
module.exports = app;

// start server
if (require.main === module) {
  app.listen(config.port, function() {
    return console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
}

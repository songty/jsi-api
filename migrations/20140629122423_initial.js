'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('employees', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('role').notNullable();
    table.integer('boss_id').references('employees.id');
  }).createTable('projects', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('goals').notNullable();
  }).createTable('employees_projects', function(table) {
    table.integer('employee_id').references('employees.id');
    table.integer('project_id').references('projects.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('employees_projects')
    .dropTable('projects')
    .dropTable('employees');
};

// you may also want to run this to test things out:
// insert into employees (name, role, boss_id) values ('Susan', 'CEO', null);
// insert into employees (name, role, boss_id) values ('John', 'CTO', 1);
// insert into employees (name, role, boss_id) values ('Mark', 'CFO', 1);
// insert into employees (name, role, boss_id) values ('Jessica', 'Developer', 2);
// insert into employees (name, role, boss_id) values ('Allan', 'Developer', 2);
// insert into employees (name, role, boss_id) values ('Rebecca', 'Accountant', 3);
// insert into employees (name, role, boss_id) values ('Daniel', 'Executive Assistant', 1);
// insert into projects(name, goals) values('Wearables', 'Make new wearables products');
// insert into projects(name, goals) values('Budget', 'Ensure there is enough money');
// insert into employees_projects values (1, 1), (1, 2), (2, 1), (2, 2), (3, 1), (3, 2), (4, 1), (5, 1), (6, 2), (7, 2);

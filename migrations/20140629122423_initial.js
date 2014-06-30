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

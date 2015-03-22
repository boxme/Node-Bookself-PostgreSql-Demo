"use strict";

var Schema = require("./data/schema.js");
var Moment = require("moment");
var Promise = require("bluebird");
var Async = require("async");
var _ = require("lodash");
var App = require("express");
var Models = require("./models/index.js");

var createTable = function (tableName) {
	return Models.Bookshelf.knex.schema.createTable(tableName, function (table) {
		var column;
		var columnKeys = _.keys(Schema[tableName]);

		columnKeys.forEach(function (key) {
			if (Schema[tableName][key].type === "text" && Schema[tableName][key].hasOwnProperty("fieldtype")) {
				column = table[Schema[tableName][key].type](key, Schema[tableName][key].fieldtype);
			} else if (Schema[tableName][key].type === "string" && Schema[tableName][key].hasOwnProperty("maxlength")) {
				column = table[Schema[tableName][key].type](key, Schema[tableName][key].maxlength);
			} else {
				column = table[Schema[tableName][key].type](key);
			}

			if (Schema[tableName][key].hasOwnProperty("nullable") && Schema[tableName][key].nullable === true) {
				column.nullable();
			} else {
				column.notNullable();
			}

			if (Schema[tableName][key].hasOwnProperty("primary") && Schema[tableName][key].primary === true) {
				column.primary();
			}

			if (Schema[tableName][key].hasOwnProperty("unique") && Schema[tableName][key].unique) {
				column.unique();
			}

			if (Schema[tableName][key].hasOwnProperty("unsigned") && Schema[tableName][key].unsigned) {
				column.unsigned();
			}

			if (Schema[tableName][key].hasOwnProperty("references")) {
				column.references(Schema[tableName][key].references);
			}

			if (Schema[tableName][key].hasOwnProperty("defaultTo")) {
				column.defaultTo(Schema[tableName][key].defaultTo);
			}
		});
	});
};

var doesTableExist = function (tableName) {
	return Models.Bookshelf.knex.schema.hasTable(tableName);
};

var initDb = function () {
	var calls = [];
	var tableNames = _.keys(Schema);

	tableNames.forEach(function (tableName) {

		var f = function (callback) {
			doesTableExist(tableName)
			.then(function (exists) {
				if (!exists) {
					console.log("Creating database table " + tableName + "...");

					createTable(tableName)
					.then(function (result) {
						console.log("---> Created database table " + tableName);
						callback(null, result);
					})
					.catch(function (err) {
						console.log("Error creating " + tableName + " table " + err);
						callback(err, null);
					});

				} else {
					callback(null, exists);
				}
			})
			.catch(function (error) {
				console.log("Error creating " + tableName + " table " + error);
				callback(error, null)
			});
		};

		calls.push(f);
	});

	Async.series(calls, function (err, result) {
		if (!err) {
			console.log("Finished initialising database table");
		} else {
			console.log("Error initialising database table: " + err);
		}
	});
};

initDb();

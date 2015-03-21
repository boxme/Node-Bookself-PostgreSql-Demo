"use strict";

var Schema = require("../data/schema.js");
var Bookshelf = require("bookshelf")(knex);
var Moment = require("moment");
var Promise = require("bluebird");
var _ = require("lodash");
var App = require("express");

var Knex = require("knex")({
	client: "pq",
	connection: {
		host: "localhost",
		user: "boxme",
		password: "Ab123456!",
		database: "blogsite"
	},
});

var Bookshelf = require("bookshelf")(Knex);
Bookshelf.plugin("visibility");

var createTable = function (tableName) {
	return tableName.knex.schema.createTable(tableName, function (table) {
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

var initDb = function (tableName) {
	tableName.forEach(function (name) {
		Bookshelf.knex.schema.hasTable(name).then(function (exists) {
			if (!exists) {
				// Create table
			}
		});
	});
};

exports = Bookshelf;

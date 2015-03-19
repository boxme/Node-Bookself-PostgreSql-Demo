"use strict";

var Schema = require("../data/schema.js");
var Bookshelf = require("bookshelf")(knex);
var moment = require("moment");
var Promise = require("bluebird");
var _ = require("lodash");

var knex = require("knex")({
	client: "pq",
	connection: {
		host: ,
		user: ,
		password: ,
		database: 
	},
});

var Bookshelf = require("bookshelf")(knex);
Bookshelf.plugin("visibility");

exports = Bookshelf;
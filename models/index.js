var knex = require("knex")({
	client: "pq",
	connection: {
		host: ,
		user: ,
		password: ,
		database: 
	},
});

var Schema = require("../data/schema.js");
var Bookshelf = require("bookshelf")(knex);
var moment = require("moment");
var Promise = require("bluebird");
var _ = require("lodash");

Bookshelf.plugin("visibility");

var User = Bookshelf.Model.extend({
	tableName: "users"
});
exports.User = User;

var Category = Bookshelf.Model.extend({
	tableName: "categories",
});
exports.Category = Category;

var Blogpost = Bookshelf.Model.extend({
	tableName: "blogposts",
	category: function() {
		// one-to-one or one-to-many
		return this.belongsTo(Category, "category_id");
	},
	tags: function() {
		// many-to-many
		return this.belongsToMany(Tag, "tag_id");
	},
	author: function() {
		// Bookshelf assumes that table names are plurals 
		// and that the foreignkey is the singular table name fixed with _id
		return this.belongsTo(User, "user_id");
	}
});
exports.Blogpost = Blogpost;

var Tag = Bookshelf.Model.extend({
	tableName: "tags",
	blogpost: function() {
		return this.belongsToMany(Blogpost, "post_id");
	}
});
exports.Tag = Tag;

exports.Bookshelf = Bookshelf;

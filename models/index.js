"use strict";

var moment = require("moment");

var Knex = require("knex")({
	client: "pg",
	connection: {
		host: "localhost",
		user: "",
		password: "",
		database: "blogsite"
	}
});

var Bookshelf = require("bookshelf")(Knex);
Bookshelf.plugin("visibility");

var User = Bookshelf.Model.extend({
	tableName: "users"
});
exports.User = User;

var Category = Bookshelf.Model.extend({
	tableName: "categories"
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
		// 1st param: ClassName of related table
		// 2nd param: Name of related table
		// Other params: Foreign Keys
		return this.belongsToMany(Tag, "posts_tags", "tag_id");
	},
	author: function() {
		// Bookshelf assumes that table names are plurals 
		// and that the foreignkey is the singular name of the related table fixed with _id
		return this.belongsTo(User, "user_id");
	}
});
exports.Blogpost = Blogpost;

var Tag = Bookshelf.Model.extend({
	tableName: "tags",
	blogpost: function() {
		return this.belongsToMany(Blogpost, "posts_tags", "post_id");
	}
});
exports.Tag = Tag;

exports.Bookshelf = Bookshelf;
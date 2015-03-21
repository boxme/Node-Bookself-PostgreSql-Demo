"use strict";

var Bookshelf = require("../server.js");
var moment = require("moment");

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
		return this.belongsToMany(Tag, "posts_tags", "tag_id");
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
		return this.belongsToMany(Blogpost, "posts_tags", "post_id");
	}
});
exports.Tag = Tag;
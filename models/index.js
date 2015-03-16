var knex = require("knex")({
	client: "pq",
	connection: {
		host: ,
		user: ,
		password: ,
		database: 
	},
});

var Bookself = require("bookself")(knex);
Bookself.plugin("visibility");

var User = Bookself.Model.extend({
	tableName: "users"
});
exports.User = User;

var Blogpost = Bookself.Model.extend({
	tableName: "blogpost",
	hasTimestamps : true,
	category: function() {
		return this.belongsTo(Category, "category_id");
	},
	tags: function() {
		return this.belongsToMany(Tag);
	},
	author: function() {
		return this.belogsTo(User);
	}
});
exports.Blogpost = Blogpost;

var Category = Bookself.Model.extend({
	tableName: "categories",
	blogpost: function() {
		return this.belongsToMany(Blogpost, "cateogory_id");
	}
});
exports.Category = Category;

var Tag = Bookself.Model.extend({
	tableName: "tags",
	blogpost: function() {
		return this.belongsToMany(Blogpost);
	}
});
exports.Tag = Tag;

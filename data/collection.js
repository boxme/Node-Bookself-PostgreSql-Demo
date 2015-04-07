"use strict";

var Model = require("../models/index.js");

var Users = Model.Bookshelf.Collection.extend({
	model: Model.User
});
exports.UsersCollection = Users;

var Blogposts = Model.Bookshelf.Collection.extend({
	model: Model.Blogpost
});
exports.BlogpostsCollection = Blogposts;

var Categories = Model.Bookshelf.Collection.extend({
	model: Model.Category
});
exports.CategoriesCollection = Categories;

var Tags = Model.Bookshelf.Collection.extend({
	model: Model.Tag
});
exports.TagsCollection = Tags;
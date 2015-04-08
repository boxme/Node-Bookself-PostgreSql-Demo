"use strict";

var Model = require("../models/index.js");

var Users = Model.Bookshelf.Collection.extend({
	model: Model.User
});
exports.UserCollection = Users;

var Blogposts = Model.Bookshelf.Collection.extend({
	model: Model.Blogpost
});
exports.BlogpostCollection = Blogposts;

var Categories = Model.Bookshelf.Collection.extend({
	model: Model.Category
});
exports.CategoryCollection = Categories;

var Tags = Model.Bookshelf.Collection.extend({
	model: Model.Tag
});
exports.TagsCollection = Tags;
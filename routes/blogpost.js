"use strict";

var BlogpostController = {},
	Moment = require("moment"),
	TagController = require("./tag.js"),
	Collections = require("../data/collection.js");

BlogpostController.getAll = function (req, res) {
	Collections.BlogpostCollection.forge()
	.fetch()
	.then(function (result) {
		res.status(200).json(result);
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

BlogpostController.getPost = function (req, res) {
	Collections.BlogpostCollection.forge()
	.query(function (qb) {
		qb.where("id", "=", req.params.id);
	})
	.fetchOne({
		withRelated: ["categories", "tags"]
	})
	.then(function (post) {
		if (!post) {
			res.status(404).json({});
		} else {
			res.status(200).json(post);
		}
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

BlogpostController.create = function (req, res) {
	var tags = req.body.tags;

	if (tags) {
		tags = tags.split(", ").map(function (tag) {
			return tag.trim();
		});
	} else {
		tags = ["uncategories"];
	}

	// Save post
	Collections.BlogpostCollection.forge()
	.create({
		user_id: req.body.user_id,
		category_id: req.body.category_id,
		title: req.body.title,
		html: req.body.content,
		created_at: Moment().format()
	})
	.then(function (blogpost) {
		// save tags
		TagController.create(tags)
		.then(function (ids) {
			blogpost.tag().attach(ids);
			res.status(200).json(blogpost);
		})
		.catch(function (err) {
			res.status(500).json({message: err.message});
		});
	})
	.catch(function (err) {
		res.status(500).json({message: err.message});
	});
};

module.exports = BlogpostController;















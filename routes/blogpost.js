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
	getBlogpostWithId(req.params.id)
	.then(function (post) {
		if (!post) {
			res.status(404).json({message: "blogpost not found"});
		} else {
			res.status(200).json(post);
		}
	})
	.catch(function (err) {
		res.status(500).json({message: err.message});
	});
};

BlogpostController.create = function (req, res) {
	var tags = getArrayOfTags(req, ["uncategories"]);

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

var getArrayOfTags = function (req, defaultCategory) {
	var tags = req.body.tags;

	if (tags) {
		tags = tags.split(", ").map(function (tag) {
			return tag.trim();
		});
	} else {
		tags = defaultCategory;
	}

	return tags;
};

BlogpostController.update = function (req, res) {
	var tags = getArrayOfTags(req, []);

	getBlogpostWithId(req.params.id)
	.then(function (blogpost) {
		if (!blogpost) {
			res.status(404).json({message: "blogpost not found"});
		} else {
			blogpost.save({
				user_id: req.body.user_id || blogpost.get("id"),
				category_id: req.body.category_id || blogpost.get("category_id"),
				title: req.body.title || blogpost.get("title"),
				html: req.body.content || blogpost.get("html"),
				updated_at: Moment().format()
			})
			.then(function (result) {
				if (tags.length > 0) {
					TagController.create(tags)
					.then(function (ids) {
						result.tag().attach(ids);
						res.status(200).json("");
					})
					.catch(function (err) {
						res.status(500).json({message: err.message});
					});
				} else {
					res.status(200).json(result);
				}
			})
			.catch(function (err) {
				res.status(500).json({message: err.message});
			});
		}
	})
	.catch(function (err) {
		res.status(500).json({message: err.message});
	})
};

BlogpostController.destroy = function (req, res) {
	getBlogpostWithId(req.params.id)
	.then(function (blogpost) {
		if (!blogpost) {
			res.status(404).json({error:"Blogpost not found", message: err.message});
		} else {
			var tagIds = blogpost.toJSON().tag.map(function (tag) {
				return tag.id;
			});

			// Delete many-to-many relations first
			blogpost.tag().detach(tagIds);

			// Then delete the model itself
			blogpost.destroy()
			.then(function () {
				res.status(200).json({});
			})
			.catch(function (err) {
				res.status(500).json({error:"Blogpost delete failed", message: err.message})
			});
		}
	})
	.catch(function (err) {
		res.status(500).json({message: err.message})
	});
};

var getBlogpostWithId = function (id) {
	// To get back the tags in alphabatical order
	var tagRelation = function (qb) {
		qb.orderBy("name");
	};

	return Collections.BlogpostCollection.forge()
	.query(function (qb) {
		qb.where("id", "=", id);
	})
	.fetchOne({
		withRelated: ["category", {"tag" : tagRelation}]
	});
}

module.exports = BlogpostController;















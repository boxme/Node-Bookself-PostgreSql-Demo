"use strict";
var TagController = {},
	_ = require("lodash"),
	Model = require("../models/index.js"),
	Collections = require("../data/collection.js");

TagController.getAll = function () {
	Collections.TagsCollection.forge()
	.fetch()
	.then(function (existingTags) {
		return existingTags.toJSON();
	});
};

TagController.getMatchingTags = function (tags) {
	tags = tags.map(function (tagName) {
		return tagName.toLowerCase();
	});
	
	Collections.TagsCollection.forge()
	.query(function (qb) {
		qb.whereIn("name", tags);
	})
	.fetch()
	.then(function (matchingTags) {
		return matchingTags.toJSON();
	});
};

TagController.create = function (tags) {
	// Create array of tag objects
	var tagObjs = tags.map(function (tag) {
		return {
			name: tag.toLowerCase()
		};
	});

	// Get tags that already existed
	var existingTags = TagController.getMatchingTags(tags);
	var doNotExist = [];

	// Filter out exisiting tags
	if (existingTags.length > 0) {
		var existingTagNames = existingTags.map(function (existingTag) {
			return existingTag.name;
		});

		doNotExist = tagObjs.filter(function (tagObj) {
			return existingTagNames.indexOf(tagObj.name) < 0;
		});
	} else {
		doNotExist = tagObjs;
	}

	// Save tags that do not exist
	return Collections.TagsCollection.forge(doNotExist).mapThen(function (model) {
		return model
				.save()
				.then(function () {
					return model.get("id");
				});
	})
	.then(function (ids) {
		// Union the newly created tags' ids 
		return _.union(ids, _.pluck(existingTag, "id"));
	});
};
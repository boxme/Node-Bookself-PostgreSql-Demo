"use strict";
var TagController = {},
	Collections = require("../data/collection.js");

TagController.getAll = function () {
	Collections.TagsCollection.forge()
	.fetch()
	.then(function (existingTags) {
		return existingTags.toJSON();
	});
};

TagController.create = function (tags) {
	var tagObjs = tags.map(function (tag) {
		return {
			name: tag
		}
	});

	// Get tags that already existed
	var existingTags = TagController.getAll();
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
	
};
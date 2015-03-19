"use strict";

var Schema = {
	users: {
		id: {type: "increments", nullable: false, primary: true},
		email: {type: "string", maxlength: 254, nullable: false, unqiue: true},
		name: {type: "string", maxlength: 150, nullable: false}
	},

	categories: {
		id: {type: "increments", nullable: false, primary: true},
		name: {type: "string", maxlength: 150, nullable: false, unqiue: true}
	},

	blogposts: {
		id: {type: "increments", nullable: false, primary: true},
		user_id: {type: "integer", nullable: false, unsigned: true},
		category_id: {type: "integer", nullable: false, unsigned: true},
		title: {type: "string", maxlength: 150, nullable: false},
		html: {type: "text", fieldtype: "medium", nullable: false},
		created_at: {type: "dateTime", nullable: false},
		updated_at: {type: "dateTime", nullable: true}
	},

	tags: {
		id: {type: "increments", nullable: false, primary: true},
		name: {type: "string", nullable: false}
	}

	// A table for many-to-many relation between tags table & posts table
	posts_tags: {
		id: {type: "increments", nullable: false, primary: true},
		post_id: {type: "integer", nullable: false, unsigned: true, references: "blogposts.id"},
		tag_id: {type: "integer", nullable: false, unsigned: true, references: "tags.id"}
	}
};

module.exports = Schema;
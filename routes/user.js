"use strict";

var UserController = {},
	Collections = require("../data/collection.js"),
	Model = require("../models/index.js");

UserController.getAll = function (req, res) {
	Collections.UserCollection.forge()
	.fetch()
	.then(function (result) {
		res.status(200).json(result);
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

UserController.create = function (req, res) {
	Collections.UserCollection.forge({
		name: req.body.name,
		email: req.body.email
	})
	.save()
	.then(function (result) {
		res.status(200).json(result);
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

UserController.getUser = function (req, res) {
	Collections.UserCollection.forge({
		id: req.params.id
	})
	.fetch()
	.then(function (result) {
		if (!result) {
			res.status(404).json({});
		} else {
			res.status(200).json(result)
		}
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

UserController.update = function (req, res) {
	Collections.UserCollection.forge({
		id: req.params.id
	})
	.fetch({
		require: true
	})
	.then(function (user) {
		if (!user) {
			res.status(404).json({});
		} else {
			user.save({
				name: req.body.name || user.get("name"),
				email: req.body.email || user.get("email")
			})
			.then(function (result) {
				res.status(200).json(result);
			})
			.catch(function (err) {
				res.status(500).json(err);
			});
		}
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

UserController.destroy = function (req, res) {
	Collections.UserCollection.forge({
		id: req.params.id
	})
	.fetch({
		require: true
	})
	.then(function (user) {
		if (!user) {
			res.status(404).json({});
		} else {
			user.destroy()
			.then(function () {
				res.status(200).json({});
			})
			.catch(function (err) {
				res.status(500).json(err);
			});
		}
	})
	.catch(function (err) {
		res.status(500).json(err);
	})
};

module.exports = UserController;
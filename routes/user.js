"use strict";

var UsersController = {},
	Collections = require("../data/collection.js"),
	Model = require("../models/index.js");

UsersController.getAllUsers = function (req, res) {
	Collections.UsersCollection.forge()
	.fetch()
	.then(function (result) {
		res.status(200).json(result);
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

UsersController.create = function (req, res) {
	Collections.UsersCollection.forge({
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

UsersController.getUser = function (req, res) {
	Collections.UsersCollection.forge({
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

UsersController.update = function (req, res) {
	Collections.UsersCollection.forge({
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

UsersController.destroy = function (req, res) {
	Collections.UsersCollection.forge({
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

module.exports = UsersController;
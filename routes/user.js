"use strict";

var UserController = {},
	Bcrypt = require("bcrypt"),
	Crypto = require("crypto"),
	Promise = require("bluebird"),
	Collections = require("../data/collection.js");

UserController.getAll = function (req, res) {
	Collections.UserCollection.forge()
	// .query(function (qb) {
	// 	qb.where("id", "<", "8").andWhere("name", "=", "desmond");
	// })
	.fetch()
	.then(function (result) {
		result = result.map(removePasswordFromUserData);
		res.status(200).json(result);
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

UserController.create = function (req, res) {
	var salt = Bcrypt.genSaltSync(12);
	var hash = Bcrypt.hashSync(req.body.password, salt);

	Collections.UserCollection.forge()
	.create({
		name: req.body.name,
		email: req.body.email.toLowerCase(),
		password: hash
	})
	.then(function (result) {
		res.status(200).json(result);
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

UserController.login = function (req, res) {
	Collections.UserCollection.forge()
	.query(function (qb) {
		qb.where("email", "=", req.body.email.toLowerCase());
	})
	.fetchOne()
	.then(function (user) {
		if (user) {
			var isPassword = Bcrypt.compareSync(req.body.password, user.get("password"));
			if (isPassword) {
				if (user.get("token")) {
					return Promise.resolve(user);
				} else {
					// No token
					var randomBytes = Promise.promisify(Crypto.randomBytes);

					return randomBytes(48)
					.then(function (buf) {
						var aToken = buf.toString("hex");
						// set the modified data before saving
						// user.set({token: aToken});
						return user.save({token: aToken});
					});
				}
			} else {
				return Promise.reject("password-incorrect");
			}
		} else {
			return Promise.reject("user_not_found");
		}
	})
	.then(function (user) {
		user = removePasswordFromUserData(user);
		res.status(200).json(user);
	})
	.catch(function (err) {
		res.status(400).json({error: err});
	});
};

UserController.logout = function (req, res) {
	Collections.UserCollection.forge()
	.query(function (qb) {
		qb.where("token", "=", req.body.token);
	})
	.fetchOne()
	.then(function (user) {
		user.save({token: null});
		res.status(200).json({message: "logout"});
	})
	.catch(function (err) {
		res.status(500).json({error: err.message});
	});
};

UserController.getUser = function (req, res) {
	Collections.UserCollection.forge()
	.query(function (qb) {
		qb.where("id", "=", req.params.id);
	})
	.fetchOne()
	.then(function (result) {
		if (!result) {
			res.status(404).json({});
		} else {
			result = removePasswordFromUserData(result);
			res.status(200).json(result)
		}
	})
	.catch(function (err) {
		res.status(500).json(err);
	});
};

UserController.update = function (req, res) {
	Collections.UserCollection.forge()
	.query(function (qb) {
		qb.where("id", "=", req.params.id);
	})
	.fetchOne({
		require: true
	})
	.then(function (user) {
		if (!user) {
			res.status(404).json({});
		} else {
			user
			.save({
				name: req.body.name || user.get("name"),
				email: req.body.email || user.get("email")
			})
			.then(function (result) {
				result = removePasswordFromUserData(result);
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
	Collections.UserCollection.forge()
	.query(function (qb) {
		qb.where("id", "=", req.params.id);
	})
	.fetchOne({
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

var removePasswordFromUserData = function (user) {
	var userObject = user.toJSON();
	if (userObject.hasOwnProperty("password")) {
		delete(userObject.password);
	}
	return userObject;
};

module.exports = UserController;
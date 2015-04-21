var Model = require("./user.js"),
	AuthController = {},
	Collections = require("../data/collection.js");

AuthController.requireUser = function () {
	return function (req, res, next) {
		var token;

		var token_method = "NONE";

		if (req.body.token) {
			token = req.body.token;
			token_method = "BODY";
		} else if (req.query.token) {
			token = req.query.token;
			token_method = "QUERY";
		} else if (req.headers.token) {
			token = req.headers.token;
			token_method = "HEADER";
		}

		token_method += "_TOKEN";

		console.log("Auth method: " + token_method + " - " + req.url);

		if (token) {
			Collections.UserCollection.forge() 
			.query(function (qb) {
				qb.where("token", "=", token);
			})
			.fetchOne()
			.then(function (user) {
				if (user) {
					// Keep a copy of the user info for future use
					req.user = user;
					next();
				} else {
					res.status(404).json({error: "user_not_found"});
				}
			})
			.catch(function (err) {
				res.status(500).json({error: err.message});
			});
		} else {
			res.status(400).json({error: "require_token"});
		}
	};
};

module.exports = AuthController;
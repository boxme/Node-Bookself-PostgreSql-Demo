"use strict";

var Express = require("express"),
    App = Express(),
    Http = require("http"),
    BodyParser = require("body-parser"),
    Router = Express.Router(),
    Db = require("./database.js"),
    UserController = require("./routes/user.js"),
    CategoryController = require("./routes/category.js");

App.set('port', 3000);
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({"extended": true}));

// Http.createServer(App).listen(3000);
Db.initialisation();

var server = Http.Server(App);
server.listen(App.get("port"), function () {
	console.log("Express server listening on port " + App.get("port"));
});

App.get("/users", UserController.getAll);
App.get("/users/:id", UserController.getUser);
App.post("/users", UserController.create);
App.put("/users/:id", UserController.update);
App.delete("/users/:id", UserController.destroy);

App.get("/categories", CategoryController.getAll);
App.get("categories/:id", CategoryController.getCategory);
App.post("categories/", CategoryController.create);
App.put("categories/:id", CategoryController.update);
App.delete("categories/:id", CategoryController.destroy);
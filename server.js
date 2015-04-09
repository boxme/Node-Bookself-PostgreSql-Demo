"use strict";

var Express = require("express"),
    App = Express(),
    Http = require("http"),
    BodyParser = require("body-parser"),
    Router = Express.Router(),
    MethodOverride = require('method-override'),
    Db = require("./database.js"),
    UserController = require("./routes/user.js"),
    CategoryController = require("./routes/category.js");

// App.set('port', 3000);
App.use(MethodOverride());
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({extended: true}));

Db.initialisation();

Http.createServer(App).listen(3000);

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
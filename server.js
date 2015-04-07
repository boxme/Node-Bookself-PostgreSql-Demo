"use strict";

var Express = require("express"),
    App = Express(),
    Http = require("http"),
    BodyParser = require("body-parser"),
    Db = require("./database.js"),
    UsersController = require("./routes/user.js");

App.use(BodyParser.urlencoded({"extended": true}));
App.use(BodyParser.json());

Http.createServer(App).listen(3000);

Db.initialisation();

App.get("/users", UsersController.getAllUsers);
App.get("/users/:id", UsersController.getUser);
App.post("/users", UsersController.create);
App.put("/users/:id", UsersController.update);
App.delete("/users/:id", UsersController.destroy);
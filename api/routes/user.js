const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

userController.forEach((item) => {
  const { method, routeName, controller } = item;
  router[method](routeName, controller);
});

module.exports = router;

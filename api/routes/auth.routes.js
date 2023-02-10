const express = require("express");
const router = express.Router();

const auController = require("../controllers/auth.controller");

auController.forEach((item) => {
  const { method, routeName, controller } = item;
  router[method](routeName, controller);
});

module.exports = router;

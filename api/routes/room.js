const express = require("express");
const router = express.Router();

const roomController = require("../controllers/room");

roomController.forEach((item) => {
  const { method, routeName, controller } = item;
  router[method](routeName, controller);
});

module.exports = router;

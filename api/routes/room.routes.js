const express = require("express");
const router = express.Router();

const roomController = require("../controllers/room.controller");

roomController.forEach((item) => {
  const { method, routeName, controller } = item;
  router[method](routeName, controller);
});

module.exports = router;

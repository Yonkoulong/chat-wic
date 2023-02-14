const express = require("express");
const router = express.Router();

const messageDirectController = require("../controllers/message_direct.controller");

messageDirectController.forEach((item) => {
  const { method, routeName, controller } = item;
  router[method](routeName, controller);
});

module.exports = router;

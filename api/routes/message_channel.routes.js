const express = require("express");
const router = express.Router();

const messageChannelController = require("../controllers/message_channel.controller");

messageChannelController.forEach((item) => {
  const { method, routeName, controller } = item;
  router[method](routeName, controller);
});

module.exports = router;

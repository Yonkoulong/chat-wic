const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message");

messageController.forEach((item) => {
  const { method, routeName, controller } = item;
  router[method](routeName, controller);
});

module.exports = router;

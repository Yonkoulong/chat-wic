const express = require("express");
const router = express.Router();

const channelController = require("../controllers/channel.controller");

channelController.forEach((item) => {
  const { method, routeName, controller } = item;
  if (item?.isAuthorizeRoleAdmin) {
    router[method](routeName, AuthMiddleware.isAuthorizeRoleAdmin, controller);
  } else if (item?.isAuthorizeRoleProjectManager) {
    router[method](
      routeName,
      AuthMiddleware.isAuthorizeRoleProjectManager,
      controller
    );
  } else {
    router[method](routeName, controller);
  }
});

module.exports = router;

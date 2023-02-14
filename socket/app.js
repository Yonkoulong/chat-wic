const express = require("express");
const setupMiddleware = require("./app-middleware");
const setUpSocketIO = require("./app-socket");

const app = express();
const http = require("http").Server(app);

const setUpApp = async () => {
  setupMiddleware(app);
  setUpSocketIO(http);
  return http.listen(process.env.PORT || 4000);
};

setUpApp();

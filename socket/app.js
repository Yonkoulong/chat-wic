const express = require("express");
const setupMiddleware = require("./app-middleware");
const setUpSocketIO = require("./app-socket");

const app = express();
const http = require("http").Server(app);

const setUpApp = async () => {
  setupMiddleware(app);
  setUpSocketIO(http);

  app.get("/api", (req, res) => {
    res.send("this is home location");
  });
  return http.listen(process.env.PORT || 4000);
};

setUpApp();

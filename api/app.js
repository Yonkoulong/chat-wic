const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const { Server } = require("socket.io");

mongoose.set("strictQuery", true);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const setupMiddleware = require("./app-middleware");
const setupRoutes = require("./app-routes");

const setupApp = async () => {
  setupMiddleware(app);
  setupRoutes(app);

  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connect-done");
    })
    .catch((err) => {
      console.log(err);
    });

  io.on('connection', (socket) => {
    console.log('user is online!');

    socket.on('disconnect', () => {
      console.log('user is offline');
    })
  })
  
  return app.listen(process.env.PORT || 8080);
};

setupApp();

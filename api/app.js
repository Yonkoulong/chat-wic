const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const http = require("http");

mongoose.set("strictQuery", true);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*'
  }
});

const setupMiddleware = require("./app-middleware");
const setupRoutes = require("./app-routes");

const setupApp = async () => {
  setupMiddleware(app);
  setupRoutes(app);


  io.on('connection', (socket) => {
    console.log('We have a new connection!!!!');

    socket.on('disconnect', () => {
      console.log('user is offline');
    })
  })

  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connect-done");
    })
    .catch((err) => {
      console.log(err);
    });

  server.listen(4000);
  return app.listen(process.env.PORT || 8080);
};

setupApp();

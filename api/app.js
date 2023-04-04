const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");

mongoose.set("strictQuery", true);

const app = express();
const server = http.createServer(app);
const setupMiddleware = require("./app-middleware");
const setupRoutes = require("./app-routes");

const setupApp = async () => {
  setupMiddleware(app);
  setupRoutes(app);

  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB-Connect-done");
    })
    .catch((err) => {
      console.log(err);
    });

  const expressServer = server.listen(process.env.PORT || 8080, () => {
    console.log(`listen on port ${process.env.PORT || 8080}`)
  });

  const io = new Server(expressServer, {
    cors: {
      origin: "*",
    },
  })

  io.on("connection", (socket) => {
    console.log("We have a new connection!!!!", socket?.id);

    //status member
    socket.on('update-status-user', (data) => {
      console.log(data);
      if(data) {
        io.emit('status-user-updated', data);
      }
    })

    //channel message
    socket.on(`send-channel-msg`, (data) => {
      if (data) {
        // io.sockets.emit(`msg-channel-recieve/${data?.channelId}`, data);
        console.log(data)
        io.in(data?.channelId).emit('msg-channel-recieve', data);
      }
    })

    socket.on("disconnect", () => {
      console.log("user is offline");
    });
  });

};

setupApp();

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
    // socket.on('update-status-user', (data) => {
    //   console.log(data);
    //   if(data) {
    //     io.emit('status-user-updated', data);
    //   }
    // })

    socket.on('room', data => {
      //data is idRoom
      socket.join(data);
      console.log("You are connecting to this room", data);
    })

    //channel
    socket.on('create-channel-room', (data) => {
      socket.join(data?._id);
      socket.to(idChannel).emit('channel-created', data); 
    })

    socket.on('send-message-channel', (data) => {
      socket.to(data.channelId).emit('receive-message-channel', data);
    })

    socket.on('delete-message-channel', (data) => {
      socket.to(data.channelId).emit('receive-message-channel', data);
    })

    socket.on('edit-message-channel', (data) => {
      socket.to(data.channelId).emit('receive-message-channel', data);
    })


    //direct
    socket.on('create-direct-room', (data) => {
      socket.join(idChannel);
      io.to(idChannel).emit('direct-created', idChannel); 
    })

    socket.on('send-message-direct', (data) => {
      socket.to(data.directId).emit('receive-message-direct', data);
    })

    socket.on('delete-message-direct', (data) => {
      socket.to(data.directId).emit('receive-message-direct', data);
    })

    socket.on('edit-message-direct', (data) => {
      socket.to(data.directId).emit('receive-message-direct', data);
    })

    //behavior
    socket.on("typing", (data) => {
      socket.to(data.room).emit('typing');
    })

    socket.on("disconnect", () => {
      console.log("user is offline");
    });
  });

};

setupApp();

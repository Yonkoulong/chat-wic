const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");
const ChannelModel = require("./models/channel.model");

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
    console.log(`listen on port ${process.env.PORT || 8080}`);
  });

  const io = new Server(expressServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log(
      "We have a new connection!!!!",
      socket.handshake.headers?.userid
    );
    socket.data.userId = socket.handshake.headers?.userid;

    //list channell
    const connecteds = io.sockets.sockets;
    try {
      const channelsByUserId = await ChannelModel.find({
        userIds: { $in: [socket.handshake.headers?.userid] },
      });

      if (channelsByUserId) {
        channelsByUserId.forEach((channel) => {
          socket.join([channel?._id]);
        });
      }
    } catch {}

    //status member
    // socket.on('update-status-user', (data) => {
    //   console.log(data);
    //   if(data) {
    //     io.emit('status-user-updated', data);
    //   }
    // })

    socket.on("room", (data) => {
      //data is idRoom
      socket.join(data);
      console.log("You are connecting to this room", data);
    });

    //invite
    socket.on("invite", (data) => {});

    //channel
    socket.on("create-channel-room", async (data) => {
      socket.join(data?._id);
      const sockets = await io.fetchSockets();
      const membersSocketId = sockets
        .filter((item) => {
          return data.userIds.includes(item.data.userId);
        })
        .map((x) => x.id);
      io.to(membersSocketId).emit("invited-to-a-channel", { test: data?._id });
    });

    socket.on("send-message-channel", (data) => {
      io.to(data.channelId).emit("receive-message-channel", data);
    });

    // socket.on('delete-message-channel', (data) => {
    //   socket.to(data.channelId).emit('receive-message-channel', data);
    // })

    // socket.on('edit-message-channel', (data) => {
    //   socket.to(data.channelId).emit('receive-message-channel', data);
    // })

    //direct
    socket.on("create-direct-room", (data) => {
      socket.join(idChannel);
      io.to(idChannel).emit("direct-created", idChannel);
    });

    socket.on("send-message-direct", (data) => {
      socket.to(data.directId).emit("receive-message-direct", data);
    });

    // socket.on('delete-message-direct', (data) => {
    //   socket.to(data.directId).emit('receive-message-direct', data);
    // })

    // socket.on('edit-message-direct', (data) => {
    //   socket.to(data.directId).emit('receive-message-direct', data);
    // })

    //behavior
    socket.on("typing", (data) => {
      socket.to(data.room).emit("typing");
    });

    socket.on("disconnect", () => {
      console.log("user is offline");
    });
  });
};

setupApp();

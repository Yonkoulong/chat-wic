const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const http = require("http");

mongoose.set("strictQuery", true);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});
server.listen(8000);
const setupMiddleware = require("./app-middleware");
const setupRoutes = require("./app-routes");

function makeString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const setupApp = async () => {
  setupMiddleware(app);
  io.on("connection", (socket) => {
    console.log("We have a new connection!!!!");

    setInterval(() => {
      const id = makeString(5);
      socket.emit("chat/roomId", {
        data: {
          reactions: [],
          _id: id,
          messageFrom: id,
          content: id,
          directId: id,
          type: "PLAIN_TEXT",
          replyId: "",
          createdAt: "2023-03-31T10:02:33.140Z",
          updatedAt: "2023-03-31T10:11:00.701Z",
          __v: 0,
          senderName: "longbillard",
          avatar: "",
          replyMessage: {},
        },
      });
    }, 3000);

    socket.on("disconnect", () => {
      console.log("user is offline");
    });
  });

  setupRoutes(app);

  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connect-done");
    })
    .catch((err) => {
      console.log(err);
    });

  return app.listen(process.env.PORT || 8080);
};

setupApp();

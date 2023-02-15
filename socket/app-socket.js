const socketIO = require("socket.io");
let usersActive = [];

const setUpSocketIO = (http) => {
  const socketConfig = socketIO(http, {
    cors: {
      origin: process?.env?.PORT_CLIENT || "http://localhost:3000",
    },
  });

  socketConfig.on("connection", (socket) => {
    console.log(socket);
    // sending between react app and socket server
    socket.on("message", (data) => {
      socketConfig.emit("messageResponse", data);
    });

    // fetch active users from socket.io
    socket.on("newUser", (data) => {
      usersActive.push(data);
      socketConfig.emit("newUserResponse", usersActive);
    });

    // detect user typing
    socket.on("typing", (data) => socketConfig.emit("typingResponse", data));

    // user leave app disconnect and update
    socket.on("disconnect", () => {
      usersActive = usersActive.filter((user) => user?.socketId !== socket.id);
      socketConfig.emit("newUserResponse", usersActive);
      socket.disconnect();
    });
  });
};

module.exports = setUpSocketIO;

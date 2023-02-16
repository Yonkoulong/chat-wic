const socketIO = require("socket.io");
let usersActive = [];

const setUpSocketIO = (http) => {
  const socketIOConfig = socketIO(http, {
    cors: {
      origin: process?.env?.PORT_CLIENT || "http://localhost:3000",
      credentials: true,
    },
    transports: ["websocket"],
  });

  socketIOConfig.on("connection", (socket) => {
    console.log(socket.id);
    // sending between react app and socket server
    socket.on("message", (data) => {
      socketIOConfig.emit("messageResponse", data);
    });

    // fetch active users from socket.io
    socket.on("newUser", (data) => {
      usersActive.push(data);
      socketIOConfig.emit("newUserResponse", usersActive);
    });

    // detect user typing
    socket.on("typing", (data) => socketIOConfig.emit("typingResponse", data));

    // user leave app disconnect and update
    socket.on("disconnect", () => {
      usersActive = usersActive.filter((user) => user?.socketId !== socket.id);
      socketIOConfig.emit("newUserResponse", usersActive);
      socket.disconnect();
    });
  });
};

module.exports = setUpSocketIO;

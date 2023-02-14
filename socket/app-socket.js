const socketIO = require("socket.io");

const setUpSocketIO = (http) => {
  const socketConfig = socketIO(http, {
    cors: {
      origin: process?.env?.PORT_CLIENT || "http://localhost:5173",
    },
  });
  socketConfig.on("connection", (socket) => {
    console.log(`Connect successfully ${socket.id}`);
    socket.on("disconnect", () => {
      console.log("Socket disconnect");
    });
  });
};

module.exports = setUpSocketIO;

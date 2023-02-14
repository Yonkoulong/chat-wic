const socketIO = require("socket.io")(http, {
  cors: {
    origin: process?.env?.PORT_CLIENT || "http://localhost:5173",
  },
});

const setUpSocketIO = () => {
  socketIO.on("connection", (socket) => {
    console.log(`Connect successfully ${socket.id}`);
    socket.on("disconnect", () => {
      console.log("Socket disconnect");
    });
  });
};

module.exports = setUpSocketIO;

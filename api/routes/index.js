const userRoutes = require("./user.routes");
const roomRoutes = require("./room.routes");
const messageRoutes = require("./message.routes");
const authRoutes = require("./auth.routes");

module.exports = [userRoutes, roomRoutes, messageRoutes, authRoutes];

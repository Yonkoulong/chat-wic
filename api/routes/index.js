const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const messageChannelRoutes = require("./message_channel.routes");
const messageDirectRoutes = require("./message_direct.routes");

module.exports = [
  userRoutes,
  authRoutes,
  messageChannelRoutes,
  messageDirectRoutes,
];

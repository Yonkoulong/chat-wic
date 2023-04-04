const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const messageChannelRoutes = require("./message_channel.routes");
const messageDirectRoutes = require("./message_direct.routes");
const channelRoutes = require("./channel.routes");
const directRoutes = require("./direct.routes");
const taskRoutes = require("./task.route");

module.exports = [
  userRoutes,
  authRoutes,
  messageChannelRoutes,
  messageDirectRoutes,
  channelRoutes,
  directRoutes,
  taskRoutes,
];

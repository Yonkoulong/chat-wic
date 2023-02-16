const cors = require("cors");
const dotenv = require("dotenv");

var allowCrossDomain = function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials'", "true");
  next();
};

const setupMiddleware = (app) => {
  dotenv.config();
  app.use(cors());
  app.use(allowCrossDomain);
};

module.exports = setupMiddleware;

const cors = require("cors");
const dotenv = require("dotenv");

const setupMiddleware = (app) => {
  dotenv.config();
  app.use(cors());
};

module.exports = setupMiddleware;

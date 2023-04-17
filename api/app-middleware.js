const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const setupMiddleware = (app) => {
  dotenv.config();
  app.use(cors({ origin: process.env.PORT_ENV == "dev" ? "http://localhost:5173" : "https://chat-wic.onrender.com" }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
};

module.exports = setupMiddleware;


const bodyParser = require("body-parser");
const cors = require('cors');
const dotenv = require("dotenv");


const setupMiddleware = (app) => {
    dotenv.config();
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
}

module.exports = setupMiddleware;
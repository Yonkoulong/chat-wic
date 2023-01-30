const express = require("express");
const mongoose = require("mongoose");

const app = express();


const setupMiddleware = require("./app-middleware");
const setupRoutes = require("./app-routes");



const setupApp = async() => {
  setupMiddleware(app);
  setupRoutes(app);

  await mongoose.connect(process.env.MONGO_URI).catch((err) => {
    console.log(err)
  })

  return  app.listen(process.env.PORT || 8080);
}

setupApp();

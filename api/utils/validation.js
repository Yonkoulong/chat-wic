const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");

const isObjectIdInMongodb = (id) => {
  return ObjectId.isValid(id);
};

const isArray = (arr) => {
  return Array.isArray(arr);
};

const verifyToken = (token) => {
  let decoded = "";
  try {
    decoded = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    console.log(err);
  }

  return decoded;
};

module.exports = { isObjectIdInMongodb, isArray, verifyToken };

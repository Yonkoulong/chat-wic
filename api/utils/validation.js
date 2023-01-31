const ObjectId = require("mongodb").ObjectId;

const isObjectIdInMongodb = (id) => {
  return ObjectId.isValid(id);
};

const isArray = (arr) => {
  return Array.isArray(arr);
};

module.exports = { isObjectIdInMongodb, isArray };

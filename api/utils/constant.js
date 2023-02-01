const MongoDB = require("mongodb");
const ObjectIdMongodb = MongoDB.ObjectId;

const httpCode = {
  ok: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
};

const IUserStatus = {
  offline: "OFFLINE",
  online: "ONLINE",
  busy: "BUSY",
  other: "OTHER",
};

const responseError = {
  badRequest: {
    content: "Bad request",
  },
  notFound: "Not found",
};

const ORDER_DIRECTION = {
  asc: 1,
  ASC: 1,
  DESC: -1,
  desc: -1,
};

module.exports = {
  httpCode,
  IUserStatus,
  responseError,
  ORDER_DIRECTION,
  MongoDB,
  ObjectIdMongodb,
};

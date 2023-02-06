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

const saltRounds = 10;

const responseError = {
  badRequest: {
    content: "Bad request",
  },
  notFound: "Not found",
  updatePassword: "Password incorrect, please try again ",
  login: "Account or password incorrect, please try again",
};

const ORDER_DIRECTION = {
  asc: 1,
  ASC: 1,
  DESC: -1,
  desc: -1,
};

const DEFAULT_PASSWORD = "123456a@";

const ROOM_TYPES = {
  channel: "CHANNEL",
  direct: "DIRECT",
};

const USER_ROLES = {
  admin : "ADMIN",
  staff : "STAFF"
}

module.exports = {
  httpCode,
  IUserStatus,
  responseError,
  ORDER_DIRECTION,
  MongoDB,
  ObjectIdMongodb,
  saltRounds,
  DEFAULT_PASSWORD,
  ROOM_TYPES,
  USER_ROLES
};

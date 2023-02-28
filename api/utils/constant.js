const MongoDB = require("mongodb");
const ObjectIdMongodb = MongoDB.ObjectId;

const httpCode = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorize: 401,
  forbidden: 403,
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
  notFound: { content: "Not found" },
  updatePassword: { content: "Password incorrect, please try again " },
  login: { content: "Account or password incorrect, please try again" },
  organizeAlreadyExist: { content: "Organize already exist." },
  emailAlreadyExist: { content: "Email already exist." },
  createOrganizeError: { content: "Create organize error." },
  userUnauthorized: { content: "User has not permission." },
  wrongPayload: { content: "Payload is in wrong format." },
  lengthPassword: { content: "Password must be great than 8 character." },
  invalidEmail: { content: "Invalid email." },
  invalidToken: { content: "Your session has expired. Please login again." },
  invalidEmailCase2: {
    content: "The email domain must be belong domain to the organization.",
  },
};

const responseConstant = {
  deleteUserSuccessfully: { content: "Delete user successfully." },
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
  admin: "ADMIN",
  staff: "STAFF",
  projectManager: "PROJECT_MANAGER",
};

const MESSAGE_TYPES = {
  link: "LINK",
  paragraph: "PARAGRAPH",
  plainText: "PLAIN_TEXT",
  image: "IMAGE",
};

const convertToken = (token) => {
  if (!token) {
    return "";
  }
  return token.replace("Bearer ", "");
};

const minLengthPassword = 8;

const calculateTotalPage = (allRecord = 10, record = 10) => {
  return Math.ceil(allRecord / record);
};

const formatResponse = (response) => {
  const data = {
    content: response
  }

  return data;
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
  USER_ROLES,
  convertToken,
  responseConstant,
  minLengthPassword,
  calculateTotalPage,
  MESSAGE_TYPES,
  formatResponse
};

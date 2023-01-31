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

module.exports = {
  httpCode,
  IUserStatus,
  responseError,
};

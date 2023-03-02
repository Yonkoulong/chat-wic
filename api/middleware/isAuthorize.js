const {
  httpCode,
  responseError,
  convertToken,
  USER_ROLES,
} = require("../utils/constant");
const { verifyToken } = require("../utils/validation");

const isAuthorizeRoleAdmin = async (req, res, next) => {
  const token = req?.headers?.authorization || req?.headers?.Authorization;
  const userData = verifyToken(convertToken(token));

  const currentUser = userData?.data;
  if (currentUser && currentUser?.role === USER_ROLES.admin) {
    next();
  }

  return res.status(httpCode.unauthorize).json(responseError.userUnauthorized);
};

const isAuthorizeRoleProjectManager = async (req, res, next) => {
  const token = req?.headers?.authorization || req?.headers?.Authorization;
  const userData = verifyToken(convertToken(token));

  const currentUser = userData?.data;
  if (currentUser && currentUser?.role !== USER_ROLES.staff) {
    next();
  }

  return res.status(httpCode.unauthorize).json(responseError.userUnauthorized);
};

module.exports = { isAuthorizeRoleAdmin, isAuthorizeRoleProjectManager };

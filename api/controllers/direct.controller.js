const DirectModel = require("../models/direct.model");
const {
  httpCode,
  IUserStatus,
  responseError,
  ObjectIdMongodb,
  saltRounds,
  DEFAULT_PASSWORD,
  convertToken,
  USER_ROLES,
  responseConstant,
  minLengthPassword,
  calculateTotalPage,
  formatResponse,
} = require("../utils/constant");
const {
  isObjectIdInMongodb,
  isArray,
  verifyToken,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const postCreateDirect = async (req, res) => {
  const { messageFrom } = req?.body;

  if (!isArray(userIds && isObjectIdInMongodb(ownerId))) {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }

  const newChannel = {
    channelName,
    userIds,
    ownerId,
  };
  try {
    await DirectModel?.create(newChannel);
    return res?.status(httpCode.ok).json({ content: newChannel });
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postGetDirectsByUserId = async (req, res) => {
  const { userId } = req?.params;
  try {
    const channelsByUserId = await DirectModel.find({
      userIds: { $in: [userId] },
    });
    return res.status(httpCode.ok).json(formatResponse(channelsByUserId));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

module.exports = [
  {
    method: "post",
    controller: postCreateDirect,
    routeName: "/direct/create",
  },
  {
    method: "post",
    controller: postGetDirectsByUserId,
    routeName: "/direct/:userId/list",
  },
];

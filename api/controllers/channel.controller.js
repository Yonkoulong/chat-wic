const ChannelModel = require("../models/channel.model");
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

const postCreateChannel = async (req, res) => {
  const { channelName, userIds, ownerId } = req?.body;

  if (!isArray(userIds && isObjectIdInMongodb(ownerId))) {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }

  const newChannel = {
    channelName,
    userIds,
    ownerId,
  };
  try {
    await ChannelModel?.create(newChannel);
    return res?.status(httpCode.ok).json({ content: newChannel });
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postGetChannelsByUserId = async (req, res) => {
  const { userId } = req?.params;
  try {
    const channelsByUserId = await ChannelModel.find({
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
    controller: postCreateChannel,
    routeName: "/channel/create",
    isAuthorizeProjectManager: true,
  },
  {
    method: "post",
    controller: postGetChannelsByUserId,
    routeName: "/channel/:userId/list",
  },
];

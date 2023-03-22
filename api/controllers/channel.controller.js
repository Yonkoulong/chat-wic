const ChannelModel = require("../models/channel.model");
const UserModel = require("../models/user.model");
const {
  httpCode,
  responseError,
  formatResponse,
  ObjectIdMongodb,
} = require("../utils/constant");
const { isObjectIdInMongodb, isArray } = require("../utils/validation");

const templateRespUser = {
  username: 1,
  id: 1,
  email: 1,
  firstName: 1,
  lastName: 1,
  avatar: 1
};

const postCreateChannel = async (req, res) => {
  const { channelName, userIds, ownerId, description } = req?.body;

  if (!isArray(userIds) && isObjectIdInMongodb(ownerId)) {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
  const channelId = new ObjectIdMongodb();
  const allUserIds = [...userIds, ownerId];

  const newChannel = {
    _id: channelId,
    channelName,
    userIds: allUserIds,
    ownerId,
    description,
  };
  try {
    await ChannelModel?.create(newChannel);
    return res?.status(httpCode.ok).json(formatResponse(newChannel));
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

const postGetChannelDetail = async (req, res) => {
  const { channelId } = req?.params;
  try {
    const channels = await ChannelModel.find({
      _id: channelId,
    });

    let channelById = isArray(channels) ? channels[0]?._doc : {};
    if (channelById?.ownerId) {
      try {
        const usersByOwnerId = await UserModel.find({
          _id: channelById?.ownerId,
        });

        const ownerInfo = isArray(usersByOwnerId)
          ? usersByOwnerId[0]?._doc
          : {};
        // push userinfo
        channelById = { ...channelById, ownerInfo };
      } catch {}
    }

    if (isArray(channelById?.userIds)) {
      try {
        membersByUserIds = await UserModel.find({
          id: {
            $in: channelById?.userIds,
          },
        });

        channelById = {
          ...channelById,
          membersInChannel: membersByUserIds || [],
        };
      } catch {}
    }

    return res.status(httpCode.ok).json(formatResponse(channelById));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postSearchMemberByChannel = async (req, res) => {
  const { username, paging, userIds, ownerId } = req.body;
  const userIdsChecked = isArray(userIds) ? userIds : [];

  const usersQuery = [...userIdsChecked, ownerId || ""];
  let userInChannel = [];
  const querySearch = { _id: { $in: usersQuery } };
  if (username) {
    querySearch.username = { $regex: username };
  }

  const page = !!paging ? paging?.page : 1;
  const size = !!paging ? paging?.size : 10;

  try {
    if (!!paging) {
      const numberToSkip = (page - 1) * size;
      userInChannel = await UserModel.find(querySearch, templateRespUser)
        .skip(numberToSkip)
        .limit(size);
    } else {
      userInChannel = await UserModel.find(querySearch, templateRespUser);
    }

    return res.status(httpCode.ok).json(formatResponse(userInChannel));
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
  {
    method: "post",
    controller: postGetChannelDetail,
    routeName: "/channel/:channelId",
  },
  {
    method: "post",
    controller: postSearchMemberByChannel,
    routeName: "/channel/:channelId/users",
  },
];

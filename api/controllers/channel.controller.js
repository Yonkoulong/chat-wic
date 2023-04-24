const ChannelModel = require("../models/channel.model");
const UserModel = require("../models/user.model");
const {
  httpCode,
  responseError,
  formatResponse,
  ObjectIdMongodb,
  ORDER_DIRECTION,
} = require("../utils/constant");
const { isObjectIdInMongodb, isArray } = require("../utils/validation");

const templateRespUser = {
  username: 1,
  id: 1,
  email: 1,
  firstName: 1,
  lastName: 1,
  avatar: 1,
  userStatus: 1,
};

const postCreateChannel = async (req, res) => {
  const { channelName, userIds, ownerId, description, organizeId } = req?.body;

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
    organizeId,
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
  const { organizeId, orders } = req.body;
  const direction = orders?.updatedAt || "DESC";
  try {
    const channelsByUserId = await ChannelModel.find({
      userIds: { $in: [userId] },
      organizeId,
    }).sort({ updatedAt: ORDER_DIRECTION[direction] });
    return res.status(httpCode.ok).json(formatResponse(channelsByUserId));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postGetChannelDetail = async (req, res) => {
  const { channelId } = req.params;
  const { organizeId, userId } = req.body;

  try {
    const channels = await ChannelModel.find({
      _id: channelId,
      organizeId,
    });

    const filterUserInChannel = channels[0].userIds.filter((id) => {
      return id == userId;
    });

    if (filterUserInChannel.length <= 0) {
      return res.status(httpCode.notFound).json(responseError.notFound);
    }

    //check belong to organization
    if (channels[0].organizeId != organizeId) {
      return res.status(httpCode.notFound).json(responseError.notFound);
    }

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

const deleteMemberInChannel = async (req, res) => {
  const { channelId, memberId } = req?.params;

  if (!channelId || !memberId) {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }

  const channels = await ChannelModel.find({
    _id: channelId,
  });
  // not found channel
  if (channels?.length < 1) {
    if (!channelId || !memberId) {
      return res?.status(httpCode.notFound).json(responseError.notFound);
    }
  }

  const userIds = channels[0]?.userIds;
  const newUserIds = userIds?.filter((id) => id !== memberId);

  const channelUpdated = { ...channels[0]?._doc, userIds: newUserIds };

  try {
    await ChannelModel.updateOne(
      { _id: channelId },
      {
        $set: channelUpdated,
        $currentDate: { lastUpdated: true },
      }
    );

    return res.status(httpCode.ok).json(formatResponse(channelUpdated));
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postAddMembersToChannel = async (req, res) => {
  const { ids } = req.body;
  const { channelId, memberId } = req?.params;

  if (!channelId || !Array.isArray(ids)) {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }

  const channels = await ChannelModel.find({
    _id: channelId,
  });

  // not found channel
  if (channels?.length < 1) {
    if (!channelId || !memberId) {
      return res?.status(httpCode.notFound).json(responseError.notFound);
    }
  }
  let userIds = channels[0]?.userIds;

  if(isArray(userIds)) {
    ids.forEach(id => {
      if(!userIds.includes(id)){
        userIds = [...userIds, id]
      }
    })
  }
 
  const channelUpdated = { ...channels[0]?._doc, userIds };

  try {
    await ChannelModel.updateOne(
      { _id: channelId },
      {
        $set: channelUpdated,
        $currentDate: { lastUpdated: true },
      }
    );

    return res.status(httpCode.ok).json(formatResponse(channelUpdated));
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
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
  {
    method: "delete",
    controller: deleteMemberInChannel,
    routeName: "/channel/:channelId/delete-members/:memberId",
  },
  {
    method: "post",
    controller: postAddMembersToChannel,
    routeName: "/channel/:channelId/add-members",
  },
];

const DirectModel = require("../models/direct.model");
const UserModel = require("../models/user.model");
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
  ORDER_DIRECTION,
} = require("../utils/constant");
const {
  isObjectIdInMongodb,
  isArray,
  verifyToken,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const templateRespUser = {
  username: 1,
  id: 1,
  email: 1,
  firstName: 1,
  lastName: 1,
  avatar: 1,
  userStatus: 1
};

const postCreateDirect = async (req, res) => {
  const { userIds, organizeId } = req?.body;

  if (!userIds || !organizeId || !isObjectIdInMongodb(organizeId)) {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }

  const convertUserIds = isArray(userIds) ? userIds : [];
  const directId = new ObjectIdMongodb();
  const newDirect = {
    _id: directId,
    userIds: convertUserIds,
    organizeId,
  };

  try {
    await DirectModel.create(newDirect);
    return res.status(httpCode.ok).json(formatResponse(newDirect));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postGetDirectsByUserId = async (req, res) => {
  const { userId } = req?.params;
  const { organizeId, orders } = req.body;
  const direction = orders?.updatedAt || "DESC";
  try {
    let directByUserId = await DirectModel.find({
      userIds: { $in: [userId] },
      organizeId,
    }).sort({ updatedAt: ORDER_DIRECTION[direction] });

    let usersIdsInDirects = [];

    directByUserId?.forEach((item) => {
      const ids = isArray(item?.userIds) ? item.userIds : [];
      usersIdsInDirects = [...usersIdsInDirects, ...ids];
    });

    const usersInfoInDirects = await UserModel.find(
      { id: { $in: usersIdsInDirects } },
      templateRespUser
    );
    const respDataDirects = [];
    directByUserId.forEach((item, _index) => {
      const ids = isArray(item?.userIds) ? item.userIds : [];
      let usersInfo = [];
      usersInfoInDirects.forEach((user) => {
        if (ids.includes(user?.id)) {
          usersInfo.push(user);
        }
      });
      respDataDirects.push({ ...item?._doc, usersInfo });
    });

    return res.status(httpCode.ok).json(formatResponse(respDataDirects));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postCheckAlreadyExistDirect = async (req, res) => {
  const { userIds, organizeId } = req?.body;
  let user1Id = null;
  let user2Id = null;
  if (userIds?.length > 1) {
    user1Id = userIds[0]?.toString();
    user2Id = userIds[1]?.toString();
  }
  // [2 , 1]
  let directByUserId = await DirectModel.find({
    userIds: { $elemMatch: { $in: userIds } },
    organizeId,
  });
  let matchDirectExist = null;
  directByUserId.forEach((direct) => {
    if (
      direct?.userIds?.includes(user1Id) &&
      direct?.userIds?.includes(user2Id)
    ) {
      matchDirectExist = direct;
    }
  });
  if (matchDirectExist) {
    // exist
    return res.status(httpCode.ok).json(formatResponse(matchDirectExist));
  } else {
    // new direct
    const _id = new ObjectIdMongodb();
    const newDirect = {
      _id,
      userIds,
      organizeId,
    };
    try {
      await DirectModel.create(newDirect);
      return res.status(httpCode.ok).json(formatResponse(newDirect));
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const postGetDirectDetail = async (req, res) => {
  const { directId } = req?.params;
  const { organizeId, userId } = req.body;
 
  try {
    const directs = await DirectModel.find({
      _id: directId,
      organizeId
    });

    const filterUserInDirect = directs[0].userIds.filter((id) => {
      return id == userId;
    })

    if(filterUserInDirect.length <= 0) {
      return res.status(httpCode.notFound).json(responseError.notFound);
    }

    if(directs[0].organizeId != organizeId) {
      return res.status(httpCode.notFound).json(responseError.notFound);
    }

    let directById = isArray(directs) ? directs[0]?._doc : {};

    let responseDirectDetail = {};

    if (directById?.userIds) {
      try {
        const userInfoInDirect = await UserModel.find({
          _id: directById?.userIds,
        });

        const userInfo = [];

        if (userInfoInDirect && userInfoInDirect.length > 0) {
          userInfoInDirect?.forEach((uInfo) => {
            userInfo.push(uInfo);
          });
        }

        responseDirectDetail = {
          ...directById,
          usersInfo: userInfo,
        };
      } catch (error) {
        throw error;
      }
    }

    return res.status(httpCode.ok).json(formatResponse(responseDirectDetail));
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
  {
    method: "post",
    controller: postCheckAlreadyExistDirect,
    routeName: "/direct/check-already-exist-direct",
  },
  {
    method: "post",
    controller: postGetDirectDetail,
    routeName: "/direct/:directId",
  },
];

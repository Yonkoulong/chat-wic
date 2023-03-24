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
} = require("../utils/constant");
const {
  isObjectIdInMongodb,
  isArray,
  verifyToken,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const postCreateDirect = async (req, res) => {
  const { userIds, organizeId } = req?.body;

  if(!userIds || !organizeId || !isObjectIdInMongodb(organizeId)){
    return res?.status(httpCode.badRequest).json(responseError.badRequest); 
  }

  const convertUserIds = isArray(userIds) ? userIds : [];
  const directId = new ObjectIdMongodb();
  const newDirect = {
    _id : directId,
    userIds : convertUserIds,
    organizeId
  }

  try { 
    await DirectModel.create(newDirect);
    return res.status(httpCode.ok).json(formatResponse(newDirect)); 
  }catch{
    return res?.status(httpCode.badRequest).json(responseError.badRequest); 
  }

  
};

const postGetDirectsByUserId = async (req, res) => {
  const { userId , organizeId} = req?.params;
  try {
    let directByUserId = await DirectModel.find({
      userIds: { $in: [userId] },organizeId
    });

    let usersIdsInDirects = [];

    directByUserId?._doc?.forEach(item => {
      const ids = isArray(item?.userIds) ? item.userIds : [];
      usersIdsInDirects = [...usersIdsInDirects, ...ids] ;
    });

    const usersInfoInDirects = await UserModel.find({id : {$in : usersIdsInDirects}});
    directByUserId.forEach((item, index) => {
      const ids = isArray(item?.userIds) ? item.userIds : [];
      let usersInfo = [];
      usersInfoInDirects.forEach(user => {
        if(ids.includes(user?.id)){
          usersInfo.push(user)
        }
      })
      directByUserId[index].usersInfo = usersInfo;
    })

    return res.status(httpCode.ok).json(formatResponse(directByUserId));
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

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

const templateRespUser = {
  username: 1,
  id: 1,
  email: 1,
  firstName: 1,
  lastName: 1,
  avatar: 1
};

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
  const { userId } = req?.params;
  const {organizeId} = req.body;
  try {
    let directByUserId = await DirectModel.find({
      userIds: { $in: [userId] },organizeId
    });

    let usersIdsInDirects = [];

    directByUserId?.forEach(item => {
      const ids = isArray(item?.userIds) ? item.userIds : [];
      usersIdsInDirects = [...usersIdsInDirects, ...ids] ;
    });


    const usersInfoInDirects = await UserModel.find({id : {$in : usersIdsInDirects}}, templateRespUser);
    const respDataDirects = [];
    directByUserId.forEach((item, index) => {
      const ids = isArray(item?.userIds) ? item.userIds : [];
      let usersInfo = [];
      usersInfoInDirects.forEach(user => {
        if(ids.includes(user?.id)){
          usersInfo.push(user)
        }
      })
      console.log(usersInfo)
      respDataDirects.push({...item?._doc, usersInfo})
    })

    console.log(respDataDirects)

    return res.status(httpCode.ok).json(formatResponse(respDataDirects));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const postCheckAlreadyExistDirect = async (req, res) => {
  const { userIds , organizeId} = req?.body;
  // [2 , 1]
  let directByUserId = await DirectModel.find({
    userIds: { $in: userIds }, organizeId
  });
  if(directByUserId?.length > 0 ){
    // exist
    return res.status(httpCode.ok).json(formatResponse(directByUserId));
  }else{
    // new direct
    const _id = new ObjectIdMongodb();
    const newDirect = {
      _id,
      userIds,
      organizeId
    }
    try { 
      await DirectModel.create(newDirect);
      return res.status(httpCode.ok).json(formatResponse(newDirect)); 
    }catch{
      return res?.status(httpCode.badRequest).json(responseError.badRequest); 
    }
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
];

const User = require("../models/user");
const MongoDB = require("mongodb");
const { httpCode, IUserStatus, responseError } = require("../utils/constant");
const { isObjectIdInMongodb, isArray } = require("../utils/validation");

const ObjectIdMongodb = MongoDB.ObjectId;

const getUsers = async (_req, res) => {
  //create an array of documents
  try {
    const users = await User.find({});

    return res.status(httpCode.ok).json(users);
  } catch {
    return res.status(httpCode.badRequest).json([]);
  }
};

const getUserDetail = async (req, res) => {
  const { id } = req?.params;
  if (isObjectIdInMongodb(id)) {
    const convertId = ObjectIdMongodb(id);
    try {
      const user = await User.find({ _id: convertId });
      if (isArray(user) && user.length > 0) {
        return res.status(httpCode.ok).json(user[0]);
      } else {
        return res.status(httpCode.notFound).json(responseError.notFound);
      }
    } catch {
      return res.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const putUserDetail = async (req, res) => {};

const postUser = async (req, res) => {
  const { username, email, password, avatar } = req?.body;
  const newUser = {
    username,
    email,
    password,
    avatar,
    userStatus: IUserStatus.offline,
  };

  try {
    await User?.create(newUser);
    return res?.status(httpCode.ok).json(newUser);
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

module.exports = [
  {
    method: "get",
    controller: getUsers,
    routeName: "/users",
  },
  {
    method: "get",
    controller: getUserDetail,
    routeName: "/user/:id",
  },
  {
    method: "put",
    controller: putUserDetail,
    routeName: "/user/:id/update",
  },
  {
    method: "post",
    controller: postUser,
    routeName: "/user/create",
  },
];

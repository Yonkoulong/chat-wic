const User = require("../models/user.model");
const {
  httpCode,
  IUserStatus,
  responseError,
  ObjectIdMongodb,
  saltRounds,
} = require("../utils/constant");
const { isObjectIdInMongodb, isArray } = require("../utils/validation");
const bcrypt = require("bcrypt");

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
      // match user
      const user = await User.find({ _id: convertId });
      if (isArray(user) && user.length > 0) {
        return res.status(httpCode.ok).json(user[0]);
      } else {
        return res.status(httpCode.notFound).json(responseError.notFound);
      }
    } catch {
      return res.status(httpCode.badRequest).json(responseError.badRequest);
    }
  } else {
    return res.status(httpCode.badRequest).json(responseError.notFound);
  }
};

const putUserDetail = async (req, res) => {
  const { id } = req?.params;
  const { username, email, password, userStatus, avatar } = req.body;
  const convertId = ObjectIdMongodb(id);
  const matchUser = await User.find({ _id: convertId });

  if (!username && !email && !password && !userStatus && !avatar) {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }

  let newPassword;

  if (password) {
    newPassword = await bcrypt.hash(password, saltRounds);
  } else {
    newPassword = matchUser[0]?.password;
  }

  if (isArray(matchUser) && matchUser.length > 0) {
    const userUpdated = {
      username: username || matchUser[0]?.username,
      email: email || matchUser[0]?.email,
      password: newPassword,
      userStatus: userStatus || matchUser[0]?.userStatus,
      avatar: avatar || matchUser[0]?.avatar,
    };
    try {
      await User.updateOne(
        { _id: convertId },
        {
          $set: userUpdated,
          $currentDate: { lastUpdated: true },
        }
      );

      return res.status(httpCode.ok).json({ ...userUpdated, _id: id });
    } catch {
      return res.status(httpCode.badRequest).json(responseError.badRequest);
    }
  } else {
    return res.status(httpCode.notFound).json(responseError.notFound);
  }
};

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

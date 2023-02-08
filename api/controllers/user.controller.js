const User = require("../models/user.model");
const {
  httpCode,
  IUserStatus,
  responseError,
  ObjectIdMongodb,
  saltRounds,
  DEFAULT_PASSWORD,
  convertToken,
  USER_ROLES,
} = require("../utils/constant");
const {
  isObjectIdInMongodb,
  isArray,
  verifyToken,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const { email, password } = req?.body;
  const token = req?.headers?.authorization;
  const currentUser = verifyToken(convertToken(token));
  if (currentUser?.role !== USER_ROLES.admin) {
    return res
      .status(httpCode.unauthorize)
      .json(responseError.userUnauthorized);
  }
  const convertPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    username: "",
    email,
    password: convertPassword,
    avatar: "",
    userStatus: IUserStatus.offline,
    firstName: "",
    lastName: "",
  };

  try {
    await User?.create(newUser);
    return res?.status(httpCode.ok).json(newUser);
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const putUpdatePasswordUser = async (req, res) => {
  const { id } = req?.params;
  const { oldPassword, newPassword } = req.body;

  if (!id || !oldPassword || !newPassword) {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }

  const matchUser = await User.find({ _id: ObjectIdMongodb(id) });
  const currentPassword = matchUser[0]?.password || "";
  const isMatchPassword = await bcrypt.compare(oldPassword, currentPassword);

  if (isMatchPassword) {
    const convertNewPassword = await bcrypt.hash(newPassword, saltRounds);
    const userUpdated = { ...matchUser[0]?._doc, password: convertNewPassword };
    await User.updateOne(
      { _id: id },
      {
        $set: userUpdated,
        $currentDate: { lastUpdated: true },
      }
    );

    return res.status(httpCode.ok).json(userUpdated);
  } else {
    return res.status(httpCode.badRequest).json(responseError.updatePassword);
  }
};

const getResetPasswordByUserId = async (req, res) => {
  const { id } = req?.params;
  const matchUser = await User.find({ _id: ObjectIdMongodb(id) });
  const user = matchUser[0];
  const newPassword = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds);
  const userUpdated = { ...user?._doc, password: newPassword };
  try {
    await User.updateOne(
      { _id: id },
      {
        $set: userUpdated,
        $currentDate: { lastUpdated: true },
      }
    );

    return res.status(httpCode.ok).json(userUpdated);
  } catch {
    return res.status(httpCode.badRequest).json(responseError.updatePassword);
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
    routeName: "/user/:id/update-profile",
  },
  {
    method: "post",
    controller: postUser,
    routeName: "/user/create",
  },
  {
    method: "put",
    controller: putUpdatePasswordUser,
    routeName: "/user/:id/update-password",
  },
  {
    method: "get",
    controller: getResetPasswordByUserId,
    routeName: "/user/:id/reset-password",
  },
];

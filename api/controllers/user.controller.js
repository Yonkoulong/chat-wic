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
  responseConstant,
  minLengthPassword,
  calculateTotalPage,
} = require("../utils/constant");
const {
  isObjectIdInMongodb,
  isArray,
  verifyToken,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const postUsersWithOrganizeId = async (req, res) => {
  const { organizeId, paging, isPaging, username, id, email, role } = req.body;

  const page = !!paging ? paging?.page : 1;
  const size = !!paging ? paging?.size : 10;
  let usersWithOrganizeId = [];
  let allUsers = [];

  // query user
  const queryUser = { organizeId };
  if (username) {
    queryUser.username = { $regex: username };
  }

  if (id) {
    queryUser._id = id;
  }

  if (email) {
    queryUser.email = { $regex: email };
  }

  if (role) {
    queryUser.role = { $regex: role };
  }

  console.log(queryUser);

  try {
    allUsers = await User.find(queryUser);
  } catch (err) {
    console.log(err);
  }

  try {
    if (paging && !isPaging) {
      usersWithOrganizeId = await User.find(queryUser).skip(page).limit(size);
    } else {
      usersWithOrganizeId = allUsers;
    }

    const data = {
      content: usersWithOrganizeId,
      paging: {
        pageNumber: page,
        pageSize: size,
        totalPage: calculateTotalPage(
          allUsers?.length || 1,
          usersWithOrganizeId?.length || 1
        ),
        totalRecord: allUsers?.length || 10,
      },
    };

    return res.status(httpCode.ok).json(data);
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
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

  if (password?.length < minLengthPassword) {
    return res.status(httpCode.badRequest).json(responseError.lengthPassword);
  }

  const userWithEmail = await User.find({ email });

  if (isArray(userWithEmail) && userWithEmail.length > 0) {
    return res
      .status(httpCode.badRequest)
      .json(responseError.emailAlreadyExist);
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
    organizeId: currentUser?.organizeId,
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

const deleteUserByUserId = async (req, res) => {
  const { ids } = req.body;

  if (!isArray(ids)) {
    return res.status(httpCode.badRequest).json(responseError.wrongPayload);
  }

  const token = req?.headers?.authorization;
  const currentUser = verifyToken(convertToken(token));
  if (currentUser?.role !== USER_ROLES.admin) {
    return res
      .status(httpCode.unauthorize)
      .json(responseError.userUnauthorized);
  }

  const organizeId = currentUser?.organizeId;

  try {
    await User.deleteMany({ _id: { $in: ids }, organizeId });
    return res
      .status(httpCode.ok)
      .json(responseConstant.deleteUserSuccessfully);
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

module.exports = [
  {
    method: "post",
    controller: postUsersWithOrganizeId,
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
  {
    method: "delete",
    controller: deleteUserByUserId,
    routeName: "/user/delete",
  },
];

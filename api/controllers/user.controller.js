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
  formatResponse,
} = require("../utils/constant");
const {
  isObjectIdInMongodb,
  isArray,
  verifyToken,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const postUsersWithOrganizeId = async (req, res) => {
  const token = req?.headers?.authorization || req?.headers?.Authorization;
  const userData = verifyToken(convertToken(token));

  const currentUser = userData?.data;

  if (!currentUser || currentUser?.role !== USER_ROLES.admin) {
    return res
      .status(httpCode.unauthorize)
      .json(responseError.userUnauthorized);
  }

  const {
    organizeId,
    paging,
    // isPaging,
    username,
    id,
    email,
    role,
    userStatus,
    createdAt,
  } = req.body;

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
    queryUser.id = { $regex: id };
  }

  if (email) {
    queryUser.email = { $regex: email };
  }

  if (role) {
    queryUser.role = { $regex: role };
  }

  if (userStatus) {
    queryUser.userStatus = { $regex: userStatus?.toUpperCase() };
  }

  if (createdAt?.from && createdAt?.to) {
    queryUser.createdAt = {
      $gte: ISODate(createdAt.from),
      $lt: ISODate(createdAt.to),
    };
  }

  try {
    allUsers = await User.find(queryUser);
  } catch (err) {
    console.log(err);
  }

  try {
    if (!!paging) {
      const numberToSkip = (page - 1) * size;
      usersWithOrganizeId = await User.find(queryUser)
        .skip(numberToSkip)
        .limit(size);
    } else {
      usersWithOrganizeId = allUsers;
    }

    const data = {
      content: usersWithOrganizeId,
      paging: {
        page: page,
        size: size,
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
        return res.status(httpCode.ok).json(formatResponse(user[0]));
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
  const { username, email, password, userStatus, avatar, role } = req.body;
  const convertId = ObjectIdMongodb(id);
  const matchUser = await User.find({ _id: convertId });

  if (!username && !email && !password && !userStatus && !avatar && !role) {
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
      ...matchUser[0]?._doc,
      username: username || matchUser[0]?.username,
      email: email || matchUser[0]?.email,
      password: newPassword,
      userStatus: userStatus || matchUser[0]?.userStatus,
      avatar: avatar || matchUser[0]?.avatar,
      role: role || matchUser[0]?.role,
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

const posCreateUser = async (req, res) => {
  const { email, password, role } = req?.body;

  if (!email || !password) {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }

  const token = req?.headers?.authorization || req?.headers?.Authorization;
  const userData = verifyToken(convertToken(token));
  const currentUser = userData?.data;

  if (!!currentUser && currentUser?.role !== USER_ROLES.admin) {
    return res
      .status(httpCode.unauthorize)
      .json(responseError.userUnauthorized);
  }

  if (email?.includes("@")) {
    const domainOrganization = currentUser?.email?.split("@")[1];
    const domainNewUser = email?.split("@")[1];
    if (domainNewUser !== domainOrganization) {
      return res
        .status(httpCode.badRequest)
        .json(responseError.invalidEmailCase2);
    }
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
  const newUserId = new ObjectIdMongodb();
  const newUser = {
    _id: newUserId,
    username: "",
    id: newUserId?.toString(),
    email,
    password: convertPassword,
    avatar: "",
    userStatus: IUserStatus.offline,
    firstName: "",
    lastName: "",
    organizeId: currentUser?.organizeId,
    role: role || USER_ROLES.staff,
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

const deleteUserByUserIds = async (req, res) => {
  const { ids } = req.body;

  if (!isArray(ids)) {
    return res.status(httpCode.badRequest).json(responseError.wrongPayload);
  }

  const token = req?.headers?.authorization;
  console.log(token);
  const respToken = verifyToken(convertToken(token));
  const currentUser = respToken?.data;
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

const getRefreshToken = async (req, res) => {
  const token = req?.headers?.authorization || req?.headers?.Authorization;
  const userData = verifyToken(convertToken(token));

  const currentUser = userData?.data;
  if (currentUser) {
    const respData = {
      content: { ...currentUser, token: convertToken(token) },
    };
    return res.status(httpCode.ok).json(respData);
  }

  return res.status(httpCode.badRequest).json(responseError.invalidToken);
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
    controller: posCreateUser,
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
    controller: deleteUserByUserIds,
    routeName: "/user/delete",
  },
  {
    method: "post",
    controller: getRefreshToken,
    routeName: "/user/refresh-token",
  },
];

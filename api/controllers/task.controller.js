const TaskSchema = require("../models/task.model");
const UserSchema = require("../models/user.model");
const {
  httpCode,
  IUserStatus,
  responseError,
  ObjectIdMongodb,
  saltRounds,
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

const templateRespUser = {
  username: 1,
  id: 1,
  email: 1,
  firstName: 1,
  lastName: 1,
  avatar: 1,
};

const templateRespUserType2 = {
  username: 1,
  id: 1,
  avatar: 1,
  _id: 1,
};

const posCreateTask = async (req, res) => {
  const {
    title,
    content,
    assignee,
    startDate,
    endDate,
    status,
    creatorId,
    organizeId,
  } = req?.body;

  try {
    const userCreateTaskInfoRole = await UserSchema.find(
      { id: creatorId },
      { role: 1 }
    );
    if (userCreateTaskInfoRole?.length > 0) {
      const userRole = userCreateTaskInfoRole[0]?.role;
      // PM has permission create task
      if (userRole !== USER_ROLES.projectManager) {
        return res
          ?.status(httpCode.badRequest)
          .json(responseError.userUnauthorized);
      }

      const _id = new ObjectIdMongodb();

      const newTask = {
        _id,
        title,
        content,
        assignee,
        startDate,
        endDate,
        status,
        creatorId,
      };

      if (organizeId) {
        newTask.organizeId = organizeId;
      }

      await TaskSchema?.create(newTask);
      return res?.status(httpCode.ok).json(newTask);
    } else {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const getTaskDetail = async (req, res) => {
  const { id } = req?.params;
  if (isObjectIdInMongodb(id)) {
    const convertId = ObjectIdMongodb(id);
    try {
      // match task
      const taskInfo = await TaskSchema.find({ _id: convertId });
      let taskResponse = { ...taskInfo[0]?._doc };
      //  info user
      const creatorInfo = await UserSchema.find(
        {
          id: taskResponse?.creatorId,
        },
        templateRespUser
      );
      if (creatorInfo?.length > 0) {
        taskResponse = { ...taskResponse, creatorInfo: creatorInfo[0]?._doc };
      }
      const assigneeInfo = await UserSchema.find(
        {
          id: taskResponse?.assignee,
        },
        templateRespUser
      );
      if (assigneeInfo?.length > 0) {
        taskResponse = { ...taskResponse, assigneeInfo: assigneeInfo[0]?._doc };
      }

      if (taskInfo?.length > 0) {
        return res.status(httpCode.ok).json(formatResponse(taskResponse));
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

const putUpdateTask = async (req, res) => {
  const { id } = req?.params;
  const { title, content, assignee, startDate, endDate, status } = req?.body;
  if (isObjectIdInMongodb(id)) {
    const convertId = ObjectIdMongodb(id);
    try {
      // match task
      const taskInfo = await TaskSchema.find({ _id: convertId });
      if (taskInfo?.length > 0) {
        const newTaskInfo = {
          ...taskInfo[0]._doc,
        };
        if (!!title) newTaskInfo.title = title;
        if (!!content) newTaskInfo.content = content;
        if (!!assignee) newTaskInfo.assignee = assignee;
        if (!!startDate) newTaskInfo.startDate = startDate;
        if (!!endDate) newTaskInfo.endDate = endDate;
        if (!!status) newTaskInfo.status = status;

        await TaskSchema.updateOne(
          { _id: convertId },
          {
            $set: newTaskInfo,
            $currentDate: { lastUpdated: true },
          }
        );

        return res.status(httpCode.ok).json(formatResponse(newTaskInfo));
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

const getTaskByOrganize = async (req, res) => {
  const { organizeId } = req?.params;
  try {
    // match task
    const taskInfo = await TaskSchema.find({ organizeId });

    if (taskInfo?.length > 0) {
      let usersId = [];
      let taskResponse = taskInfo?.map((item) => {
        if (item?.creatorId) usersId.push(item?.creatorId);
        if (item?.assignee) usersId.push(item?.assignee);
        return { ...item?._doc };
      });

      const UsersInfo = await UserSchema.find(
        { id: { $in: usersId } },
        templateRespUserType2
      );

      taskResponse = taskResponse.map((item) => {
        const creatorId = item?.creatorId;
        const assignee = item?.assignee;
        let creatorInfo = {};
        let assigneeInfo = {};

        UsersInfo.forEach((user) => {
          if (user?.id === creatorId) {
            creatorInfo = user?._doc;
          }
          if (user?.id === assignee) {
            assigneeInfo = user?._doc;
          }
        });

        return { ...item, creatorInfo, assigneeInfo };
      });

      return res.status(httpCode.ok).json(formatResponse(taskResponse));
    } else {
      return res.status(httpCode.notFound).json(responseError.notFound);
    }
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

module.exports = [
  {
    method: "post",
    controller: posCreateTask,
    routeName: "/tasks/create",
  },
  {
    method: "post",
    controller: getTaskDetail,
    routeName: "/task/:id",
  },
  {
    method: "put",
    controller: putUpdateTask,
    routeName: "/task/:id/update",
  },
  {
    method: "post",
    controller: getTaskByOrganize,
    routeName: "/tasks/:organizeId/list",
  },
];

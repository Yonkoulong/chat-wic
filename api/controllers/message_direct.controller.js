const MessageDirect = require("../models/message_direct.model");
const User = require("../models/user.model");
const {
  httpCode,
  responseError,
  ORDER_DIRECTION,
  ObjectIdMongodb,
} = require("../utils/constant");
const { isObjectIdInMongodb } = require("../utils/validation");

const getMessagesDirect = async (_req, res) => {
  //create an array of documents
  try {
    const message = await MessageDirect?.find({});
    return res.json(message);
  } catch {
    return res.json([]);
  }
};

const postMessageDirect = async (req, res) => {
  const { content, roomId, senderId } = req.body;

  if (isObjectIdInMongodb(roomId) && isObjectIdInMongodb(senderId)) {
    const convertSenderId = ObjectIdMongodb(senderId);
    const convertRoomId = ObjectIdMongodb(roomId);
    const newMessage = {
      senderId: convertSenderId,
      content,
      roomId: convertRoomId,
    };

    try {
      await MessageDirect.create(newMessage);
      return res?.status(httpCode.ok).json(newMessage);
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const getMessageDirectByRoomId = async (req, res) => {
  const { roomId } = req?.params;
  if (!roomId)
    return res?.status(httpCode.badRequest).json(responseError.badRequest);

  const { paging, isPaging } = req?.body;
  const orderCreatedAt = paging?.orders?.createdAt;

  // declare message in room

  let messageInRoom = [];

  if (isObjectIdInMongodb(roomId)) {
    if (isPaging || !!paging) {
      messageInRoom = await MessageDirect.find({ roomId })
        .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
        .skip(paging?.page || 1)
        .limit(paging?.size || 10);
    } else {
      messageInRoom = await MessageDirect.find({ roomId });
    }
  }

  const senderIds = messageInRoom?.map((message) => {
    if (isObjectIdInMongodb(message?.senderId)) {
      return ObjectIdMongodb(message.senderId);
    }
  });
  const senders = await User.find({ _id: { $in: senderIds } });
  const convertMessageInRoom = messageInRoom?.map((message) => {
    const senderIdToString = message?.senderId?.toString();
    let senderName = "";
    senders?.forEach((sender) => {
      if (senderIdToString === sender?._id?.toString()) {
        senderName = sender?.username || "";
      }
    });

    return { ...message?._doc, senderName };
  });

  return res.status(httpCode.ok).json(convertMessageInRoom);
};

module.exports = [
  {
    method: "get",
    controller: getMessagesDirect,
    routeName: "/messages-direct",
  },
  {
    method: "post",
    controller: postMessageDirect,
    routeName: "/message-direct/create",
  },
  {
    method: "get",
    controller: getMessageDirectByRoomId,
    routeName: "/message-direct/:roomId",
  },
];

const Message = require("../models/message.model");
const User = require("../models/user.model");
const {
  httpCode,
  responseError,
  ORDER_DIRECTION,
  ObjectIdMongodb,
} = require("../utils/constant");
const { isObjectIdInMongodb } = require("../utils/validation");

const getMessages = async (_req, res) => {
  //create an array of documents
  try {
    const message = await Message?.find({});
    return res.json(message);
  } catch {
    return res.json([]);
  }
};

const postMessage = async (req, res) => {
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
      await Message.create(newMessage);
      return res?.status(httpCode.ok).json(newMessage);
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const getMessageByRoomId = async (req, res) => {
  const { roomId } = req?.params;
  if (!roomId)
    return res?.status(httpCode.badRequest).json(responseError.badRequest);

  const { paging, isPaging } = req?.body;
  const orderCreatedAt = paging?.orders?.createdAt;

  // declare message in room

  let messageInRoom = [];

  if (isObjectIdInMongodb(roomId)) {
    if (isPaging || !!paging) {
      messageInRoom = await Message.find({ roomId })
        .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
        .skip(paging?.page || 1)
        .limit(paging?.size || 10);
    } else {
      messageInRoom = await Message.find({ roomId });
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
  { method: "get", controller: getMessages, routeName: "/messages" },
  { method: "post", controller: postMessage, routeName: "/message/create" },
  {
    method: "get",
    controller: getMessageByRoomId,
    routeName: "/message/:roomId",
  },
];

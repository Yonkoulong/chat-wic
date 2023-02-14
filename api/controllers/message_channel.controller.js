const MessageChannel = require("../models/message_channel.model");
const User = require("../models/user.model");
const {
  httpCode,
  responseError,
  ORDER_DIRECTION,
  ObjectIdMongodb,
} = require("../utils/constant");
const { isObjectIdInMongodb } = require("../utils/validation");

const getMessagesChannel = async (_req, res) => {
  //create an array of documents
  try {
    const message = await MessageChannel?.find({});
    return res.json(message);
  } catch {
    return res.json([]);
  }
};

const postMessageChannel = async (req, res) => {
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
      await MessageChannel.create(newMessage);
      return res?.status(httpCode.ok).json(newMessage);
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const getMessageChannelByRoomId = async (req, res) => {
  const { roomId } = req?.params;
  if (!roomId)
    return res?.status(httpCode.badRequest).json(responseError.badRequest);

  const { paging, isPaging } = req?.body;
  const orderCreatedAt = paging?.orders?.createdAt;

  // declare message in room

  let messageInRoom = [];

  if (isObjectIdInMongodb(roomId)) {
    if (isPaging || !!paging) {
      messageInRoom = await MessageChannel.find({ roomId })
        .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
        .skip(paging?.page || 1)
        .limit(paging?.size || 10);
    } else {
      messageInRoom = await MessageChannel.find({ roomId });
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
    controller: getMessagesChannel,
    routeName: "/messages-channel",
  },
  {
    method: "post",
    controller: postMessageChannel,
    routeName: "/message-channel/create",
  },
  {
    method: "get",
    controller: getMessageChannelByRoomId,
    routeName: "/message-channel/:roomId",
  },
];
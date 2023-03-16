const MessageChannel = require("../models/message_channel.model");
const User = require("../models/user.model");
const {
  httpCode,
  responseError,
  ORDER_DIRECTION,
  ObjectIdMongodb,
  formatResponse,
  isArray,
  MESSAGE_TYPES,
  responseConstant,
} = require("../utils/constant");
const { isObjectIdInMongodb } = require("../utils/validation");

const getMessagesChannel = async (_req, res) => {
  try {
    const message = await MessageChannel?.find({});
    return res.json(message);
  } catch {
    return res.json([]);
  }
};

const postMessageChannel = async (req, res) => {
  const { channelId } = req?.params;
  const { content, messageFrom, type, replyId } = req.body;

  if (isObjectIdInMongodb(channelId) && isObjectIdInMongodb(messageFrom)) {
    const convertMessageFromToObjectIdMongo = ObjectIdMongodb(messageFrom);
    const convertChannelIdToObjectIdMongo = ObjectIdMongodb(channelId);
    const messageId = new ObjectIdMongodb();
    const newMessage = {
      _id: messageId,
      messageFrom: convertMessageFromToObjectIdMongo,
      content,
      channelId: convertChannelIdToObjectIdMongo,
      type: type || MESSAGE_TYPES.plainText,
      replyId: replyId || "",
      reactions: [],
    };

    if (type === MESSAGE_TYPES.image) {
      newMessage.srcImage = content;
    }

    try {
      await MessageChannel.create(newMessage);
      return res?.status(httpCode.ok).json(newMessage);
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const getMessageChannelByChannelId = async (req, res) => {
  const { channelId } = req?.params;
  if (!channelId)
    return res?.status(httpCode.badRequest).json(responseError.badRequest);

  const { paging } = req?.body;
  const orderCreatedAt = paging?.orders?.createdAt;

  let messageInChannel = [];

  if (isObjectIdInMongodb(channelId)) {
    if (!!paging) {
      const { page, size } = paging;
      const numberToSkip = (page - 1) * size;
      messageInChannel = await MessageChannel.find({ channelId })
        .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
        .skip(numberToSkip)
        .limit(paging?.size || 10);
    } else {
      messageInChannel = await MessageChannel.find({ channelId });
    }
  }

  const senderIds = messageInChannel?.map((message) => {
    if (isObjectIdInMongodb(message?.messageFrom)) {
      return ObjectIdMongodb(message.messageFrom);
    }
  });
  // filter reply ids
  const replyIds = messageInChannel
    ?.filter((item) => item?.replyId)
    ?.map((item) => item.replyId);

  let messageByReplyIds = [];
  try {
    // get messages by ids
    messageByReplyIds = await MessageChannel.find({ _id: { $in: replyIds } });
  } catch {}
  const senders = await User.find({ _id: { $in: senderIds } });
  const convertMessageInChannel = messageInChannel?.map((message) => {
    const senderIdToString = message?.messageFrom?.toString();
    let senderName = "";
    let avatar = "";
    let replyMessage = {};
    senders?.forEach((sender) => {
      if (senderIdToString === sender?._id?.toString()) {
        senderName = sender?.username || "";
        avatar = sender?.avatar;
      }
    });
    // get message reply
    if (message?.replyId && messageByReplyIds?.length > 0) {
      messageByReplyIds?.forEach((item) => {
        if (item?._id?.toString() == message?.replyId) {
          replyMessage = item;
        }
      });
    }

    return { ...message?._doc, senderName, avatar, replyMessage };
  });

  return res.status(httpCode.ok).json(formatResponse(convertMessageInChannel));
};

// get message by thread id

const getMessagesByThreadId = async (req, res) => {
  const { threadId } = req?.params;
  try {
    const message = await MessageChannel?.find({ threadId });
    return res.json(message);
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const putUpdateMessageChannel = async (req, res) => {
  const { content, reaction } = req?.body;
  const { messageId } = req?.params;

  try {
    const messageById = await MessageChannel.find({ _id: messageId });
    let messageData = {};
    if (messageById?.length < 1) {
      return res?.status(httpCode.notFound).json(responseError.notFound);
    }
    messageData = {
      ...messageById[0]?._doc,
      content: content || messageById[0]?._doc?.content,
    };

    let messageReactions = messageData?.messageData?.reactions;

    if (isArray(messageReactions) && messageReactions?.length < 1) {
      messageReactions?.push(reaction);
    } else {
      messageReactions = messageReactions?.map((item) => {
        const reactorId = reaction?.reactorId;
        let newItem = item;
        // check already exist reactorId
        if (reactorId === item?.reactorId) {
          newItem = reaction;
        }
        return newItem;
      });
    }

    messageData = { ...messageData, reactions: messageReactions };

    MessageChannel.updateOne(
      { _id: messageId },
      { $set: messageData, $currentDate: { lastUpdated: true } }
    );
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const deleteMessageInChannel = async (req, res) => {
  const { messageId } = req?.params;

  try {
    await MessageChannel.deleteOne({ _id: messageId });
    return res
      .status(httpCode.ok)
      .json(responseConstant.deleteMessageSuccessfully);
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
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
    routeName: "/message-channel/:channelId/create",
  },
  {
    method: "post",
    controller: getMessageChannelByChannelId,
    routeName: "/message-channel/:channelId",
  },
  {
    method: "get",
    controller: getMessagesByThreadId,
    routeName: "/message-channel/:threadId",
  },
  {
    method: "put",
    controller: putUpdateMessageChannel,
    routeName: "/message-channel/:messageId",
  },
  {
    method: "delete",
    controller: deleteMessageInChannel,
    routeName: "/message-channel/:messageId/delete",
  },
];

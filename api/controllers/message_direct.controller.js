const MessageDirect = require("../models/message_direct.model");
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
  isObjectEmpty,
} = require("../utils/constant");
const { isObjectIdInMongodb } = require("../utils/validation");

const postCreateMessageDirect = async (req, res) => {
  const { directId } = req?.params;
  const {
    content,
    messageFrom,
    type,
    replyId,
    url,
    secretUrl,
    fileName,
    size,
    senderName,
    senderAvatar,
  } = req?.body;

  if (isObjectIdInMongodb(directId) && isObjectIdInMongodb(messageFrom)) {
    const convertMessageFromToObjectIdMongo = ObjectIdMongodb(messageFrom);
    const convertDirectIdToObjectIdMongo = ObjectIdMongodb(directId);
    const messageId = new ObjectIdMongodb();
    const newMessage = {
      _id: messageId,
      messageFrom: convertMessageFromToObjectIdMongo,
      content,
      directId: convertDirectIdToObjectIdMongo,
      type: type || MESSAGE_TYPES.PLAIN_TEXT,
      replyId: replyId || "",
      replyMessage: {},
      reactions: [],
    };

    if (type === MESSAGE_TYPES.IMAGE) {
      newMessage.srcImage = content;
    }

    if (type === MESSAGE_TYPES.RAW) {
      if (!!url) newMessage.url = url;
      if (!!secretUrl) newMessage.secretUrl = secretUrl;
      if (!!fileName) newMessage.fileName = fileName;
      if (!!size) newMessage.size = size;
    }

    let messageByReplyIds = {};
    let senderInReply = {};

    if (!isObjectEmpty(replyId)) {
      messageByReplyIds = await MessageDirect.find({ _id: { $in: replyId } });
      if (messageByReplyIds?.length > 0) {
        senderInReply = await User.find({
          _id: { $in: messageByReplyIds[0].messageFrom },
        });

        if (senderInReply?.length > 0) {
          messageByReplyIds = {
            ...messageByReplyIds["0"]?._doc,
            senderName: senderInReply[0].username,
          };
        }
      }
    }

    try {
      await MessageDirect.create(newMessage);

      if (messageByReplyIds) {
        return res
          ?.status(httpCode.ok)
          .json({
            ...newMessage,
            senderName,
            avatar: senderAvatar,
            replyMessage: messageByReplyIds,
          });
      } else {
        return res
          ?.status(httpCode.ok)
          .json({ ...newMessage, senderName, avatar: senderAvatar });
      }
    } catch {
      return res?.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

const postGetMessageDirectByDirectId = async (req, res) => {
  const { directId } = req?.params;
  if (!directId)
    return res?.status(httpCode.badRequest).json(responseError.badRequest);

  const { paging } = req?.body;
  const orderCreatedAt = paging?.orders?.createdAt;

  let messageInDirect = [];

  if (isObjectIdInMongodb(directId)) {
    if (!!paging) {
      const { page, size } = paging;
      const numberToSkip = (page - 1) * size;
      messageInDirect = await MessageDirect.find({ directId })
        .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
        .skip(numberToSkip)
        .limit(paging?.size || 10);
    } else {
      messageInDirect = await MessageDirect.find({ directId });
    }
  }

  const senderIds = messageInDirect?.map((message) => {
    if (isObjectIdInMongodb(message?.messageFrom)) {
      return ObjectIdMongodb(message.messageFrom);
    }
  });
  // filter reply ids
  const replyIds = messageInDirect
    ?.filter((item) => item?.replyId)
    ?.map((item) => item.replyId);

  let messageByReplyIds = [];
  try {
    // get messages by ids
    messageByReplyIds = await MessageDirect.find({ _id: { $in: replyIds } });
  } catch {}
  const senders = await User.find({ _id: { $in: senderIds } });
  const senderByReplyIds = await User.find({
    _id: { $in: messageByReplyIds[0]?.messageFrom },
  });
  const convertMessageInDirect = messageInDirect?.map((message) => {
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
          const newItem = {
            ...item?._doc,
            senderName: senderByReplyIds[0]?.username,
          };
          replyMessage = newItem;
        }
      });
    }

    return { ...message?._doc, senderName, avatar, replyMessage };
  });

  return res.status(httpCode.ok).json(formatResponse(convertMessageInDirect));
};

const putUpdateMessageDirect = async (req, res) => {
  const { content, reaction } = req?.body;
  const { messageId } = req?.params;

  try {
    const messageById = await MessageDirect.find({ _id: messageId });

    let messageData = {};
    if (messageById?.length < 1) {
      return res?.status(httpCode.notFound).json(responseError.notFound);
    }
    messageData = {
      ...messageById[0]?._doc,
      content: content || messageById[0]?._doc?.content,
    };

    let messageReactions = messageData?.reactions || [];

    const isWillRemoveReaction =
      messageReactions?.filter((item) => {
        return (
          item?.unified?.toString() === reaction?.unified?.toString() &&
          item?.reactorId === reaction?.reactorId
        );
      })?.length > 0;

    const isMessageAlreadyExist =
      messageReactions?.filter((item) => {
        return item?.reactorId === reaction?.reactorId;
      })?.length < 1;

    const isNewReaction =
      messageReactions?.length < 1 || !isMessageAlreadyExist;

    console.log(isWillRemoveReaction, "isWillRemoveReaction");

    if (isNewReaction) {
      // add new reaction
      messageReactions?.push(reaction);
    } else if (isWillRemoveReaction) {
      // remove reaction has existed
      messageReactions = messageReactions?.filter(
        (item) =>
          item?.unified !== reaction?.unified &&
          reaction?.reactorId !== reaction?.reactorId
      );
    } else {
      // update new reaction
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

    console.log("MessageData", messageData);

    await MessageDirect.updateOne(
      { _id: messageId },
      { $set: messageData, $currentDate: { lastUpdated: true } }
    );

    return res?.status(httpCode.ok).json(formatResponse(messageData));
  } catch {
    return res?.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

const deleteMessageInDirect = async (req, res) => {
  const { messageId } = req?.params;

  try {
    await MessageDirect.deleteOne({ _id: messageId });
    return res
      .status(httpCode.ok)
      .json(responseConstant.deleteMessageSuccessfully);
  } catch {
    return res.status(httpCode.badRequest).json(responseError.badRequest);
  }
};

module.exports = [
  {
    method: "post",
    controller: postCreateMessageDirect,
    routeName: "/message-direct/:directId/create",
  },
  {
    method: "post",
    controller: postGetMessageDirectByDirectId,
    routeName: "/message-direct/:directId/messages",
  },
  {
    method: "put",
    controller: putUpdateMessageDirect,
    routeName: "/message-direct/:messageId/update-message",
  },
  {
    method: "delete",
    controller: deleteMessageInDirect,
    routeName: "/message-direct/:messageId/delete",
  },
];

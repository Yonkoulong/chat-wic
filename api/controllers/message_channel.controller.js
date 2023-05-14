const MessageChannel = require("../models/message_channel.model");
const MessageThread = require("../models/message_thread.model");
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
  const {
    content,
    messageFrom,
    type,
    replyId,
    threadId,
    url,
    secretUrl,
    fileName,
    size,
    senderName,
    senderAvatar,
  } = req?.body;

  if (isObjectIdInMongodb(channelId) && isObjectIdInMongodb(messageFrom)) {
    const convertMessageFromToObjectIdMongo = ObjectIdMongodb(messageFrom);
    const convertChannelIdToObjectIdMongo = ObjectIdMongodb(channelId);
    const messageId = new ObjectIdMongodb();

    const newMessage = {
      _id: messageId,
      messageFrom: convertMessageFromToObjectIdMongo,
      content,
      channelId: convertChannelIdToObjectIdMongo,
      type: type || MESSAGE_TYPES.PLAIN_TEXT,
      replyId: replyId || "",
      threadId: threadId || "",
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

    if (replyId) {
      messageByReplyIds = await MessageChannel.find({ _id: { $in: replyId } });
      if (messageByReplyIds.length > 0) {
        senderInReply = await User.find({
          _id: { $in: messageByReplyIds[0].messageFrom },
        });

        if (senderInReply.length > 0) {
          messageByReplyIds = {
            ...messageByReplyIds["0"]?._doc,
            senderName: senderInReply[0].username,
          };
        }
      }
    }

    try {
      await MessageChannel.create(newMessage);
      if (!isObjectEmpty(messageByReplyIds)) {
        return res?.status(httpCode.ok).json({
          ...newMessage,
          replyMessage: messageByReplyIds,
          senderName: senderName,
          avatar: senderAvatar,
        });
      } else {
        return res?.status(httpCode.ok).json({
          ...newMessage,
          senderName: senderName,
          avatar: senderAvatar,
        });
      }
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

  // filter thread ids
  const threadIds = messageInChannel
   ?.filter((item) => item?.threadId)
   ?.map((item) => item.threadId);

  let messageByReplyIds = [];
  let messageByThreadIds = [];
  let listMesageInThread = [];

  try {
    // get messages by rep ids
    messageByReplyIds = await MessageChannel.find({ _id: { $in: replyIds } });
    //get message by thread ids
    messageByThreadIds = await MessageChannel.find({ _id: { $in: threadIds } });
    //get messages thread belong to threađIs
    listMesageInThread = await MessageThread.find({ threadId: { $in: threadIds } });

  } catch (error) {
    throw error;
  }

  const senders = await User.find({ _id: { $in: senderIds } });
  const senderByReplyIds = await User.find({
    _id: { $in: messageByReplyIds[0]?.messageFrom },
  });

  const convertMessageInChannel = messageInChannel?.map((message) => {
    const senderIdToString = message?.messageFrom?.toString();
    let senderName = "";
    let avatar = "";
    let replyMessage = {};
    let threadInfo = {};

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

    //get message has thread
    if (message?.threadId && messageByThreadIds?.length > 0) {
      let countMems = 0;
      let newMessagesBelongToThread = [];

      listMesageInThread.forEach((messageThread) => {

        if(messageThread?.threadId == message?.threadId) {
          newMessagesBelongToThread = [...newMessagesBelongToThread, messageThread];
        }
      })
      
      if(newMessagesBelongToThread.length > 0) {
        let temp = '';

        newMessagesBelongToThread?.forEach((messageThread) => {

          if(temp != messageThread.messageFrom.toString()) {
            temp = messageThread.messageFrom;
            countMems++;
          }
        })

        const newItem = {
          totalMembersInThread: countMems,
          totalMessagesInThread: newMessagesBelongToThread.length,
          createAtThread: newMessagesBelongToThread[0].createdAt
        }

        threadInfo = newItem;
      }
    }
    
    return { ...message?._doc, senderName, avatar, replyMessage, threadInfo };
  });

  return res.status(httpCode.ok).json(formatResponse(convertMessageInChannel));
};

// get message by thread id

const getMessagesByThreadId = async (req, res) => {
  const { threadId } = req?.params;
  try {
    const message = await MessageChannel?.find({
      threadId,
      threadIdContainMessage: threadId,
    });
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

    let messageReactions = messageData?.reactions || [];
    console.log(messageReactions)

    const isWillRemoveReaction =
      messageReactions?.filter((item) => {
        return (
          item?.unified?.toString() === reaction?.unified?.toString() &&
          item?.reactorId === reaction?.reactorId
        );
      })?.length > 0;

    

    const isUpdateReaction = messageReactions?.filter((item) => {
      return (
        item?.unified?.toString() !== reaction?.unified?.toString() &&
        item?.reactorId === reaction?.reactorId
      );
    })?.length > 0;

    const isMessageAlreadyExist =
      messageReactions?.filter((item) => {
        console.log(item, reaction?.reactorId);
        return item?.reactorId === reaction?.reactorId;
      })?.length > 0;


    const isNewReaction =
      messageReactions?.length < 1 || !isMessageAlreadyExist;

      
      if (isNewReaction) {
      console.log( "isNewReaction");
      // add new reaction
      messageReactions?.push(reaction);
    }

    // remove reaction has existed
    if (isWillRemoveReaction) {
      console.log( "isWillRemoveReaction");

      messageReactions = messageReactions?.filter(
        (item) => item?.reactorId !== reaction?.reactorId
      );
    }

    // update new reaction
    if (isUpdateReaction) {
      console.log( "isUpdateReaction");

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

    await MessageChannel.updateOne(
      { _id: messageId },
      { $set: messageData, $currentDate: { lastUpdated: true } }
    );

    return res?.status(httpCode.ok).json(formatResponse(messageData));
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

const getMessageChannelDetail = async (req, res) => {
  const { messageId } = req?.params;
  if (isObjectIdInMongodb(messageId)) {
    const convertId = ObjectIdMongodb(messageId);

    try {
      //match message
      const messageInfo = await MessageChannel.find({ _id: convertId });
      // let messageResponse = { ...messageInfo[0]?._doc };
      //info message
      if (messageInfo?.length > 0) {
        return res
          .status(httpCode.ok)
          .json(formatResponse(messageInfo[0]?._doc));
      } else {
        return res.status(httpCode.notFound).json(responseError.notFound);
      }
    } catch (err) {
      return res.status(httpCode.badRequest).json(responseError.badRequest);
    }
  }
};

// search member and channel by organizeId
const postSearchMemberAndChannelByOrganizeId = async (req, res) => {};

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
    method: "post",
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
  {
    method: "post",
    controller: postSearchMemberAndChannelByOrganizeId,
    routeName: "/member-and-channel/:organizeId/search",
  },
  {
    method: "get",
    controller: getMessageChannelDetail,
    routeName: "/message-channel/:messageId/detail",
  },
];

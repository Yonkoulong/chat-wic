const Room = require("../models/room.model");
const User = require("../models/user.model");
const { isArray } = require("../utils/validation");

const {
  httpCode,
  responseError,
  ObjectIdMongodb,
  ORDER_DIRECTION,
  ROOM_TYPES,
} = require("../utils/constant");

const getRooms = async (_req, res) => {
  //create an array of documents
  try {
    const rooms = await Room?.find({});

    return res.json(rooms);
  } catch {
    return res.json([]);
  }
};

const getRoomByUserId = async (req, res) => {
  const { userId } = req?.params;
  if (!userId)
    return res.status(httpCode.badRequest).json(responseError.badRequest);

  let roomsByUserId = [];
  const { paging, isPaging } = req?.body;
  const orderCreatedAt = paging?.orders?.createdAt;

  if (isPaging || !!paging) {
    roomsByUserId = await Room.find({
      userIds: {
        $in: [ObjectIdMongodb(userId)],
      },
    })
      .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
      .skip(paging?.page || 1)
      .limit(paging?.size || 10);
  } else {
    roomsByUserId = await Room.find({
      userIds: {
        $in: [ObjectIdMongodb(userId)],
      },
    });
  }

  let roomsTypeChannel = [];
  let roomsTypeDirect = [];
  let ownerIdsOfRoomsTypeChannel = [];

  // get room by room type
  roomsByUserId.forEach((room) => {
    if (room?.roomType === ROOM_TYPES.channel) {
      roomsTypeChannel.push(room);
      ownerIdsOfRoomsTypeChannel.push(ObjectIdMongodb(room.ownerId));
    }

    if (room?.roomType === ROOM_TYPES.direct) {
      roomsTypeDirect.push(room);
    }
  });

  // get owner listing of room with type : "CHANNEL"
  const ownerListing = await User.find({
    _id: {
      $in: ownerIdsOfRoomsTypeChannel,
    },
  });

  const convertRoomsTypeChannel = roomsTypeChannel?.map((room) => {
    const ownerIdInRoomToString = room?.ownerId?.toString();
    let ownerName = "";

    ownerListing.forEach((owner) => {
      if (owner?._id?.toString() === ownerIdInRoomToString) {
        ownerName = owner?.username || "";
      }
    });

    return { ...room?._doc, ownerName };
  });

  // convert data room type direct
  let remainingMemberIdsOfRoomsTypeDirect = [];
  let remainingMemberOfRoomsTypeDirect = [];
  roomsTypeDirect.forEach((room) => {
    room?.userIds?.forEach((id) => {
      if (id?.toString() !== userId.toString()) {
        remainingMemberIdsOfRoomsTypeDirect.push(id);
      }
    });
  });

  try {
    remainingMemberOfRoomsTypeDirect = await User.find({
      _id: { $in: remainingMemberIdsOfRoomsTypeDirect },
    });

    // let roomName = "";
    // if (isArray(remainingMember) && remainingMember.length > 0) {
    //   roomName = remainingMember[0].username;
    // }
  } catch {
    (err) => console.log(err);
  }

  const convertRoomsTypeDirect = roomsTypeDirect.map((room) => {
    let roomName = "";
    let remainingMemberId = "";
    room?.userIds?.forEach((id) => {
      if (id?.toString() !== userId.toString()) {
        remainingMemberId = id?.toString();
      }
    });

    remainingMemberOfRoomsTypeDirect.forEach((item) => {
      if (item?._id?.toString() === remainingMemberId) {
        roomName = `${item?.firstName || ""} ${item?.lastName || ""}`.trim();
      }
    });

    return { ...room?._doc, roomName };
  });

  const configResponse = {
    channel: convertRoomsTypeChannel,
    direct: convertRoomsTypeDirect,
  };

  return res.status(httpCode.ok).json(configResponse);
};

const postCreateRoom = async (req, res) => {};

module.exports = [
  { method: "get", controller: getRooms, routeName: "/rooms" },
  { method: "get", controller: getRoomByUserId, routeName: "/rooms/:userId" },
  { method: "post", controller: getRoomByUserId, routeName: "/rooms/:userId" },
  { method: "post", controller: postCreateRoom, routeName: "/room/create" },
];

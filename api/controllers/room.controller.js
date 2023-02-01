const Room = require("../models/room.model");
const User = require("../models/user.model");
const { isObjectIdInMongodb } = require("../utils/validation");

const {
  httpCode,
  responseError,
  ObjectIdMongodb,
  ORDER_DIRECTION,
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
      users: {
        $in: [ObjectIdMongodb(userId)],
      },
    })
      .sort({ createdAt: ORDER_DIRECTION[orderCreatedAt || "DESC"] })
      .skip(paging?.page || 1)
      .limit(paging?.size || 10);
  } else {
    roomsByUserId = await Room.find({
      users: {
        $in: [ObjectIdMongodb(userId)],
      },
    });
  }

  const ownerIds = roomsByUserId?.map((room) => {
    if (isObjectIdInMongodb(room?.ownerId)) {
      return ObjectIdMongodb(room.ownerId);
    }
  });

  const ownerListing = await User.find({
    _id: {
      $in: ownerIds,
    },
  });

  const convertRoomsByUserId = roomsByUserId?.map((room) => {
    const ownerIdInRoomToString = room?.ownerId?.toString();
    let ownerName = "";

    ownerListing.map((owner) => {
      if (owner?._id?.toString() === ownerIdInRoomToString) {
        ownerName = owner?.username || "";
      }
    });

    return { ...room?._doc, ownerName };
  });

  return res.status(httpCode.ok).json(convertRoomsByUserId);
};

module.exports = [
  { method: "get", controller: getRooms, routeName: "/rooms" },
  { method: "get", controller: getRoomByUserId, routeName: "/rooms/:userId" },
];

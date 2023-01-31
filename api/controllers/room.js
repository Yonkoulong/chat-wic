const Room = require("../models/room");

const getRooms = async (_req, res) => {
  //create an array of documents
  try {
    const rooms = await Room?.find({});

    return res.json(rooms);
  } catch {
    return res.json([]);
  }
};

module.exports = [{ method: "get", controller: getRooms, routeName: "/rooms" }];

const Room = require("../models/room");

const getRooms = async (_req, res) => {
  //create an array of documents
  const rooms = await Room.find({});

  return res.json(rooms);
};

module.exports = [{ method: "get", controller: getRooms, routeName: "/rooms" }];

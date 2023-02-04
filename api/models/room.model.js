const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    roomName: {
      type: String,
      required: false,
    },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    roomType: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);

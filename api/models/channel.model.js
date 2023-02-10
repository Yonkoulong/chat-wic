const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    channelName: {
      type: String,
      required: false,
    },
    userIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Channel", channelSchema);

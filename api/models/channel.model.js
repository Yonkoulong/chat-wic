const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    channelName: {
      type: String,
      required: true,
    },
    userIds: [{ type: String, required: true }],
    administratorsIds: [{ type: String, required: false }],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    organizeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Channel", channelSchema);

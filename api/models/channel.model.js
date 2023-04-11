const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    channelName: {
      type: String,
      required: false,
    },
    userIds: [{ type: String, required: false }],
    administratorsIds: [{ type: String, required: false }],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    organizeId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Channel", channelSchema);

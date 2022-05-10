const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    content: {
      type: String,
    },
    from: {
      type: Object,
    },
    socketId: {
      type: String,
    },
    time: {
      type: String,
    },
    date: {
      type: String,
    },
    to: {
      type: String,
    },
    // message: {
    //   text: { type: String, required: true },
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);

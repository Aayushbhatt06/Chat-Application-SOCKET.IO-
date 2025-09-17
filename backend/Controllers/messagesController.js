const chatModel = require("../Models/ChatDb");

const loadMessages = async (req, res) => {
  try {
    const {id} = req.body;

    const userId = req.user._id;
    if (!id || !userId) {
      return res.status(403).json({
        message: "Id is not defined",
        success: false,
      });
    }
    const roomId = [userId, id].sort().join("_");
    let chat = await chatModel.findOne({ roomId });

    if (!chat) {
      chat = new chatModel({ roomId, messages: [] });
      await chat.save();
      return res.status(200).json({ messages: [] });
    }

    return res.status(200).json({ messages: chat.messages });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { id, text } = req.body;
    const userId = req.user._id;
    const roomId = [userId.toString(), id.toString()].sort().join("_");

    let chat = await chatModel.findOne({ roomId });

    if (!chat) {
      chat = new chatModel({ roomId, messages: [] });
    }

    chat.messages.push({ sender: userId, text: text });
    await chat.save();

    return res.status(200).json({ messages: chat.messages });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = { loadMessages, addMessage };

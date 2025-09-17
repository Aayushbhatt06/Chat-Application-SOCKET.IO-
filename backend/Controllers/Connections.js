const User = require("../Models/User");

const reqCon = async (req, res) => {
  try {
    const { reqId } = req.body;
    const userId = req.user._id;

    // Prevent sending request to self
    if (reqId.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    const user = await User.findById(reqId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.connections.includes(userId)) {
      return res.status(400).json({ message: "Already connected" });
    }

    if (user.conReq.some((r) => r.user.toString() === userId.toString())) {
      return res.status(400).json({ message: "Request already sent" });
    }

    user.conReq.push({ user: userId });
    await user.save();

    res.status(200).json({ message: "Connection request sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptCon = async (req, res) => {
  try {
    const { reqId } = req.body;
    const userId = req.user._id;

    if (reqId.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot accept request from yourself" });
    }

    const user = await User.findById(userId);
    const requester = await User.findById(reqId);

    if (!user || !requester)
      return res.status(404).json({ message: "User not found" });

    if (user.connections.includes(reqId)) {
      return res.status(400).json({ message: "Already connected" });
    }

    if (!user.conReq.some((r) => r.user.toString() === reqId)) {
      return res
        .status(400)
        .json({ message: "No request found from this user" });
    }

    user.connections.push(reqId);
    requester.connections.push(userId);

    user.conReq = user.conReq.filter((r) => r.user.toString() !== reqId);

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Connection accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectCon = async (req, res) => {
  try {
    const { reqId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.conReq.some((r) => r.user.toString() === reqId)) {
      return res
        .status(400)
        .json({ message: "No request found from this user" });
    }

    user.conReq = user.conReq.filter((r) => r.user.toString() !== reqId);
    await user.save();

    res.status(200).json({ message: "Connection request rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
};

const getCon = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await User.find({
      _id: { $in: user.connections },
    }).select("name");
    res.status(200).json({ connections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getConReq = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("conReq.user", "name");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ conReq: user.conReq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeCon = async (req, res) => {
  try {
    const { conId } = req.body;
    const userId = req.user._id.toString();

    // Prevent self-removal
    if (userId === conId.toString()) {
      return res.status(400).json({ message: "Cannot remove yourself" });
    }

    const user = await User.findById(userId);
    const user1 = await User.findById(conId);

    if (!user || !user1) {
      return res.status(404).json({ message: "User not found" });
    }

    const prevLengthUser = user.connections.length;
    const prevLengthUser1 = user1.connections.length;

    user.connections = user.connections.filter(
      (id) => id.toString() !== conId.toString()
    );
    user1.connections = user1.connections.filter(
      (id) => id.toString() !== userId.toString()
    );

    await user.save();
    await user1.save();

    if (
      prevLengthUser === user.connections.length &&
      prevLengthUser1 === user1.connections.length
    ) {
      return res.status(400).json({ message: "Connection does not exist" });
    }

    res.status(200).json({ message: "Connection removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { reqCon, acceptCon, rejectCon, getCon, getConReq, removeCon };

const User = require("../Models/User");

const fetchUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: userId } }).select("name _id");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const findUsers = async (req, res) => {
  const {name} = req.body;
  const user = await User.find({ name: { $regex: name, $options: "i" } }).select("name _id");
  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error finding user" });
  }
};

module.exports = { fetchUsers, findUsers };

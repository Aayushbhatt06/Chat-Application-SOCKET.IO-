import { Request, Response } from "express";
import { Types } from "mongoose";
import userModel from "../Models/User.js";

const fetchUsers = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id as Types.ObjectId;
  try {
    const users = await userModel.find({ _id: { $ne: userId } }).select("name _id");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const findUsers = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const user = await userModel.find({ name: { $regex: name, $options: "i" } }).select("name _id");
  try {
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error finding user" });
  }
};

export { fetchUsers, findUsers };

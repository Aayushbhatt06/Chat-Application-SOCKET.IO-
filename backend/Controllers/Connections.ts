import { Request, Response } from "express";
import { Types } from "mongoose";
import userModel from "../Models/User.js";
import chatModel from "../Models/ChatDb.js";

const reqCon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reqId } = req.body;
    const userId = req.user!._id as Types.ObjectId;

    // Prevent sending request to self
    if (reqId.toString() === userId.toString()) {
      res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
      return;
    }

    const user = await userModel.findById(reqId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.connections.some((id) => id.toString() === userId.toString())) {
      res.status(400).json({ message: "Already connected" });
      return;
    }

    if (user.conReq.some((r) => r.user.toString() === userId.toString())) {
      res.status(400).json({ message: "Request already sent" });
      return;
    }

    user.conReq.push({ user: userId } as any);
    await user.save();

    res.status(200).json({ message: "Connection request sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptCon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reqId } = req.body;
    const userId = req.user!._id as Types.ObjectId;

    if (reqId.toString() === userId.toString()) {
      res
        .status(400)
        .json({ message: "Cannot accept request from yourself" });
      return;
    }

    const user = await userModel.findById(userId);
    const requester = await userModel.findById(reqId);

    if (!user || !requester) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.connections.includes(reqId)) {
      res.status(400).json({ message: "Already connected" });
      return;
    }

    if (!user.conReq.some((r) => r.user.toString() === reqId)) {
      res
        .status(400)
        .json({ message: "No request found from this user" });
      return;
    }

    user.connections.push(reqId as any);
    requester.connections.push(userId as any);

    user.conReq = user.conReq.filter((r) => r.user.toString() !== reqId);

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Connection accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectCon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reqId } = req.body;
    const userId = req.user!._id as Types.ObjectId;

    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.conReq.some((r) => r.user.toString() === reqId)) {
      res
        .status(400)
        .json({ message: "No request found from this user" });
      return;
    }

    user.conReq = user.conReq.filter((r) => r.user.toString() !== reqId);
    await user.save();

    res.status(200).json({ message: "Connection request rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
};

const getCon = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id as Types.ObjectId;
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const connections = await userModel.find({
      _id: { $in: user.connections },
    }).select("name");
    res.status(200).json({ connections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getConReq = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id as Types.ObjectId;
    const user = await userModel.findById(userId).populate("conReq.user", "name");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ conReq: user.conReq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeCon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conId } = req.body;
    const userId = (req.user!._id as Types.ObjectId).toString();
    const roomId = [userId, conId].sort().join("_");
    // Prevent self-removal
    if (userId === conId.toString()) {
      res.status(400).json({ message: "Cannot remove yourself" });
      return;
    }

    const user = await userModel.findById(userId);
    const user1 = await userModel.findById(conId);

    if (!user || !user1) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const prevLengthUser = user.connections.length;
    const prevLengthUser1 = user1.connections.length;

    user.connections = user.connections.filter(
      (id) => id.toString() !== conId.toString()
    ) as typeof user.connections;
    user1.connections = user1.connections.filter(
      (id) => id.toString() !== userId.toString()
    ) as typeof user1.connections;

    await user.save();
    await user1.save();
    const ch = await chatModel.findOneAndDelete({ roomId });

    if (
      prevLengthUser === user.connections.length &&
      prevLengthUser1 === user1.connections.length
    ) {
      res.status(400).json({ message: "Connection does not exist" });
      return;
    }

    res.status(200).json({ message: "Connection removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { reqCon, acceptCon, rejectCon, getCon, getConReq, removeCon };

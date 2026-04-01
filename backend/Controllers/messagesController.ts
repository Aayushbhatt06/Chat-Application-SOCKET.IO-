import { Request, Response } from "express";
import { Types } from "mongoose";
import chatModel from "../Models/ChatDb.js";

const loadMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    const userId = req.user!._id as Types.ObjectId;
    if (!id || !userId) {
      res.status(403).json({
        message: "Id is not defined",
        success: false,
      });
      return;
    }
    const roomId = [userId, id].sort().join("_");
    let chat = await chatModel.findOne({ roomId });

    if (!chat) {
      chat = new chatModel({ roomId, messages: [] });
      await chat.save();
      res.status(200).json({ messages: [] });
      return;
    }

    res.status(200).json({ messages: chat.messages });
  } catch (err: any) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const addMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, text } = req.body;
    const userId = req.user!._id as Types.ObjectId;
    const roomId = [userId.toString(), id.toString()].sort().join("_");

    let chat = await chatModel.findOne({ roomId });

    if (!chat) {
      chat = new chatModel({ roomId, messages: [] });
    }

    chat.messages.push({ sender: userId, text: text } as any);
    await chat.save();

    res.status(200).json({ messages: chat.messages });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export { loadMessages, addMessage };

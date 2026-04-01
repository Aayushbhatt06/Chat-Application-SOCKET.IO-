import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  text: string;
  time: Date;
}

export interface IChat extends Document {
  roomId: string;
  messages: IMessage[];
}

const chatSchema = new Schema<IChat>({
  roomId: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const chatModel: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);

export default chatModel;

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IConReq {
  user: Types.ObjectId;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  connections: Types.ObjectId[];
  conReq: IConReq[];
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  connections: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  conReq: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  password: {
    type: String,
    required: true,
  },
});

const userModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default userModel;

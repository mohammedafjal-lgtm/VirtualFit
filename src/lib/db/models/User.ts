import { Schema, model, models } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  name?: string;
  password?: string;
  image?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    password: { type: String, select: false },
    image: String,
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
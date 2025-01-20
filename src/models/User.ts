import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  handle: string;
  description: string;
  image: string;
  links: string[]
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  handle: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: "",
  },
  links: {
    type: String,
    default: "[]"
  },
  image: {
    type: String,
    default: "",
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;

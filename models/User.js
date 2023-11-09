import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // match: /.+\@.+\..+/,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      unique: true,
      required: true,
    },
    tokens: [{ type: Object }],
    code: String,
    accountType: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    coords: { type: Object },
    isEditor: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

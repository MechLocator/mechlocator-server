import mongoose from "mongoose";

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
    // Account Type for app users
    accountType: {
      type: String,
    },
    // user role for dashboard users
    role: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
    },
    coords: { type: Object },
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

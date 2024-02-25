import mongoose from "mongoose";

const AuthUserSchema = new mongoose.Schema(
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
    jobLocation: {
      type: String,
    },
    jobRole: {
      type: String,
    },
    desc: {
      type: String,
    },
    role: {
      type: String,
      enum: ["editor", "admin"],
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
  },
  { timestamps: true }
);

export default mongoose.model("AuthUser", AuthUserSchema);

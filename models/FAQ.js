import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  // coming from the admin or editor
  isApproved: {
    type: Boolean,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

export default mongoose.model("FAQ", FAQSchema);

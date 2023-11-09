import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Reviews", ReviewsSchema);

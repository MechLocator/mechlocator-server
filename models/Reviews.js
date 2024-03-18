import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    reviewerName: {
      type: String,
      required: true,
    },
    reviewerAccountType: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    wordRating: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reviews", ReviewsSchema);

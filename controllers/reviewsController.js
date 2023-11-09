import Reviews from "../models/Reviews.js";

export const createReview = async (req, res, next) => {
  try {
    const newReview = new Reviews(req.body);
    const createdReview = await newReview.save();
    res.status(200).json({
      success: true,
      message: "Review created successfully",
      createdReview,
    });
  } catch (error) {
    next(error);
  }
};

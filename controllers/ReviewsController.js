import Reviews from "../models/Reviews";

export const createReview = async (req, res, next) => {
  try {
    const newReview = new Reviews(req.body);
    const createdReview = await newReview.save();
    res.status(200).json({
      success: true,
      message: "Review created successfully!",
      createdReview,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const updatedReview = await Reviews.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Review updated successfully!",
      updatedReview,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await Reviews.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(`Review with the id ${req.params.id} has been deleted!!`);
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const review = await Reviews.findById(req.params.id);
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Reviews.find();
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

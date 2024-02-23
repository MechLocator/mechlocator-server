import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/reviewsController.js";

const router = express.Router();

// Create Review
router.post("/create-review", verifyUser, createReview);
router.put("/edit-review/:id", verifyUser, updateReview);
router.delete("/delete-review/:id", deleteReview);
router.get("/get-review/:id", verifyUser, getReview);
router.get("/get-reviews", verifyUser, getReviews);

export default router;

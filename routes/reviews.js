import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/reviewsController.js";
import { authPage } from "../utils/withAuth.js";

const router = express.Router();

// Create Review
router.post("/create-review", verifyUser, createReview);
router.put("/edit-review/:id", verifyUser, updateReview);
router.delete(
  "/delete-review/:id",
  authPage(["admin", "editor"]),
  deleteReview
);
router.get(
  "/get-review/:id",
  verifyUser,
  authPage(["admin", "editor"]),
  getReview
);
router.get(
  "/get-reviews",
  verifyUser,
  authPage(["admin", "editor"]),
  getReviews
);

export default router;

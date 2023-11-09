import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/reviewsController.js";
import verifyAdmin from "../utils/verifyAdmin.js";
import verifyEditor from "../utils/verifyEditor.js";

const router = express.Router();

// Create Review
router.post("/create-review", verifyUser, createReview);
router.put("/edit-review/:id", verifyUser, updateReview);
router.delete("/delete-review/:id", verifyUser, verifyAdmin, deleteReview);
router.get("/get-review/:id", verifyUser, verifyAdmin, verifyEditor, getReview);
router.get("/get-reviews", verifyUser, verifyAdmin, verifyEditor, getReviews);

export default router;

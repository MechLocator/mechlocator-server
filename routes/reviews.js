import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/reviewsController.js";
import { adminAuthPage, editorAuthPage } from "../utils/withAuth.js";

const router = express.Router();

// Create Review
router.post("/create-review", verifyUser, createReview);
router.put("/edit-review/:id", verifyUser, updateReview);
router.delete(
  "/delete-review/:id",
  adminAuthPage("admin"),
  editorAuthPage("editor"),
  deleteReview
);
router.get(
  "/get-review/:id",
  verifyUser,
  adminAuthPage("admin"),
  editorAuthPage("editor"),
  getReview
);
router.get(
  "/get-reviews",
  verifyUser,
  adminAuthPage("admin"),
  editorAuthPage("editor"),
  getReviews
);

export default router;

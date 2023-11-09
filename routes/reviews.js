import express from "express";
import verifyUser from "../utils/verifyUser";
import verifyAdmin from "../utils/verifyAdmin";
import verifyEditor from "../utils/verifyEditor";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/ReviewsController";

const router = express.Router();

router.post("/create-review", verifyUser, createReview);
router.put("/edit-review/:id", verifyUser, updateReview);
router.delete(
  "/delete-review/:id",
  verifyUser,
  verifyAdmin,
  verifyEditor,
  deleteReview
);
router.get("/get-review/:id", verifyUser, verifyAdmin, verifyEditor, getReview);
router.get("/get-reviews", verifyUser, verifyAdmin, verifyEditor, getReviews);

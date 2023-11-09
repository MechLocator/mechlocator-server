import express from "express";
import verifyUser from "../utils/verifyUser.js";
import { createReview } from "../controllers/reviewsController.js";

const router = express.Router();

// Create Review
router.post("/create-review", verifyUser, createReview);

export default router;

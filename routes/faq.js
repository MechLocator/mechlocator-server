import express from "express";
import {
  createFAQ,
  deleteFAQ,
  getFAQ,
  getFAQs,
  updateFAQ,
} from "../controllers/faqController.js";
import verifyUser from "../utils/verifyUser.js";
import verifyAdmin from "../utils/verifyAdmin.js";
import verifyEditor from "../utils/verifyEditor.js";

const router = express.Router();

// Create Review
router.post("/create-faq", verifyUser, createFAQ);
router.put("/edit-review/:id", verifyUser, updateFAQ);
router.delete("/delete-review/:id", verifyUser, verifyAdmin, deleteFAQ);
router.get("get-review/:id", verifyUser, verifyAdmin, verifyEditor, getFAQ);
router.get("get-reviews", verifyUser, verifyAdmin, verifyEditor, getFAQs);

export default router;

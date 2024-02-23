import express from "express";
import {
  createFAQ,
  deleteFAQ,
  getFAQ,
  getFAQs,
  updateFAQ,
} from "../controllers/faqController.js";
import verifyUser from "../utils/verifyUser.js";
// Some commits need to happen

const router = express.Router();

// Create Review
router.post("/create", createFAQ); // only an admin or editor can create faqs
router.put("/edit/:id", updateFAQ); // only and admin or editor can make changes to an faq
router.delete("/delete/:id", deleteFAQ); // only an admin can delete an faq
router.get("/get/:id", verifyUser, getFAQ); // all users can get an faq
router.get("/get-all", verifyUser, getFAQs); // all users can get an faq

export default router;

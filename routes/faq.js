import express from "express";
import {
  createFAQ,
  deleteFAQ,
  getFAQ,
  getFAQs,
  updateFAQ,
} from "../controllers/faqController.js";
import verifyUser from "../utils/verifyUser.js";
import { userAuth } from "../utils/jsontokenVerifier.js";
// Some commits need to happen

const router = express.Router();

// Create Review
router.post("/create", userAuth(["admin", "editor"]), createFAQ); // only an admin or editor can create faqs
router.put("/edit/:id", userAuth(["admin", "editor"]), updateFAQ); // only and admin or editor can make changes to an faq
router.delete("/delete/:id", userAuth(["admin", "editor"]), deleteFAQ); // only an admin can delete an faq
router.get("/get/:id", verifyUser, getFAQ); // all users can get an faq
router.get("/get-all", verifyUser, userAuth(["admin", "editor"]), getFAQs); // all users can get an faq

export default router;

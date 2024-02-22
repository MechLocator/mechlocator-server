import express from "express";
import {
  createFAQ,
  deleteFAQ,
  getFAQ,
  getFAQs,
  updateFAQ,
} from "../controllers/faqController.js";
import verifyAdmin from "../utils/verifyAdmin.js";
import verifyEditor from "../utils/verifyEditor.js";
import verifyUser from "../utils/verifyUser.js";
import { authPage } from "../utils/withAuth.js";
// Some commits need to happen

const router = express.Router();

// Create Review
router.post("/create", authPage(["admin", "editor"]), createFAQ); // only an admin or editor can create faqs
router.put("/edit/:id", authPage(["admin", "editor"]), updateFAQ); // only and admin or editor can make changes to an faq
router.delete("/delete/:id", verifyAdmin, deleteFAQ); // only an admin can delete an faq
router.get("/get/:id", verifyUser, authPage(["admin", "editor"]), getFAQ); // all users can get an faq
router.get("/get-all", verifyUser, authPage(["admin", "editor"]), getFAQs); // all users can get an faq

export default router;

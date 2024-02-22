import express from "express";
import {
  createFAQ,
  deleteFAQ,
  getFAQ,
  getFAQs,
  updateFAQ,
} from "../controllers/faqController.js";
import verifyUser from "../utils/verifyUser.js";
import { adminAuthPage, editorAuthPage } from "../utils/withAuth.js";
// Some commits need to happen

const router = express.Router();

// Create Review
router.post(
  "/create",
  adminAuthPage("admin"),
  editorAuthPage("editor"),
  createFAQ
); // only an admin or editor can create faqs
router.put(
  "/edit/:id",
  adminAuthPage("admin"),
  editorAuthPage("editor"),
  updateFAQ
); // only and admin or editor can make changes to an faq
router.delete(
  "/delete/:id",
  adminAuthPage("admin"),
  editorAuthPage("editor"),
  deleteFAQ
); // only an admin can delete an faq
router.get(
  "/get/:id",
  verifyUser,
  adminAuthPage("admin"),
  editorAuthPage("editor"),
  getFAQ
); // all users can get an faq
router.get(
  "/get-all",
  verifyUser,
  adminAuthPage("admin"),
  editorAuthPage("editor"),
  getFAQs
); // all users can get an faq

export default router;

import express from "express";
import verifyUser from "../utils/verifyUser";
import verifyAdmin from "../utils/verifyAdmin";
import verifyEditor from "../utils/verifyEditor";
import {
  createFAQ,
  deleteFAQ,
  getFAQ,
  getFAQs,
  updateFAQ,
} from "../controllers/FAQController";

const router = express.Router();

router.post("/create-faq", verifyUser, createFAQ);
router.put("/edit-faq/:id", verifyUser, updateFAQ);
router.delete(
  "/delete-review/:id",
  verifyUser,
  verifyAdmin,
  verifyEditor,
  deleteFAQ
);
router.get("/get-review/:id", verifyUser, verifyAdmin, verifyEditor, getFAQ);
router.get("/get-reviews", verifyUser, verifyAdmin, verifyEditor, getFAQs);

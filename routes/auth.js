import express from "express";
import {
  isAuth,
  login,
  register,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/private", isAuth);
export default router;

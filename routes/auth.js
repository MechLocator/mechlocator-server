import express from "express";
import {
  getProfile,
  isAuth,
  login,
  register,
  resetPassword,
  signOut,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/sign-out", isAuth, signOut);
router.get("/profile", isAuth, getProfile);
router.post("/reset-password", resetPassword);
router.get("/private", isAuth);
export default router;

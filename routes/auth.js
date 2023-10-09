import express from "express";
import {
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
router.get("/profile", isAuth, (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({
        success: false,
        message: "You do not have authorization to proceed!",
      });
    } else {
      return res.json({
        success: true,
        profile: {
          // id: req.params.id,
          // name: req.user.name,
          // email: req.user.email,
          ...req.user,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/reset-password", resetPassword);
router.get("/private", isAuth);
export default router;

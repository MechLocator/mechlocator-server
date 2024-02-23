import express from "express";
import {
  isAuth,
  login,
  register,
  resetPassword,
  signOut,
  updatePassword,
  verifyCode,
} from "../controllers/authController.js";
import verifyUser from "../utils/verifyUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/sign-out", isAuth, signOut); // android app logout
router.post("/reset-password", resetPassword); // android app reset password route
router.post("/verify-code", verifyCode);
router.put("/update-password/:id", updatePassword);
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
          ...req.user._doc,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/reset-password", verifyUser, resetPassword);
router.get("/private", isAuth);
export default router;

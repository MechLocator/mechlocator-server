import express from "express";
import {
  isAuth,
  login,
  register,
  resetPassword,
  sendPassCodeToEmail,
  signOut,
  updatePassword,
  verifyCode,
} from "../controllers/authController.js";
import verifyAdmin from "../utils/verifyAdmin.js";
import verifyEditor from "../utils/verifyEditor.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/sign-out", isAuth, signOut);
router.post("/reset-password", resetPassword);
router.post("/pass-to-email", verifyAdmin, verifyEditor, sendPassCodeToEmail); // only admins or editors can access this route
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
router.post("/reset-password", resetPassword);
router.get("/private", isAuth);
export default router;

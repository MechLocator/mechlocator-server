import express from "express";
import {
  createDashUser,
  login,
  register,
  resetPassword,
  sendPassCodeToEmail,
  signOut,
} from "../controllers/dashAuthController.js";
import { userAuth } from "../utils/jsontokenVerifier.js";

const router = express.Router();

router.post("/admin-register", async (req, res) => {
  await register(req.body, "admin", res);
});
router.post("/editor-register", async (req, res) => {
  await register(req.body, "editor", res);
});
router.post("/admin-login", async (req, res) => {
  await login(req.body, "admin", res);
});
router.post("/editor-login", async (req, res) => {
  await login(req.body, "editor", res);
});
// Implement sign out route
router.get("/sign-out", userAuth(["admin", "editor"]), signOut);
router.post("/reset-password", userAuth(["admin", "editor"]), resetPassword);
router.post("/create-dash-user", userAuth(["admin"]), createDashUser);
router.post("/pass-to-email", userAuth(["admin"]), sendPassCodeToEmail); // only admins or editors can access this route
router.get("/return-something", userAuth(["admin"]), async (req, res) => {
  // console.log(req);
  return res
    .status(202)
    .json(`welcome user. You're allowed to view this route as an admin`);
});
router.get(
  "/return-something-else",
  userAuth(["editor"]),
  //   checkRole(["admin"]),
  async (_, res) => {
    // console.log(req);
    return res
      .status(202)
      .json(`welcome user. You're allowed to view this route as an editor`);
  }
);

export default router;

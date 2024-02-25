import express from "express";
import {
  createDashUser,
  isAuth,
  login,
  modifyUserStatus,
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
router.get("/sign-out", isAuth, userAuth(["admin", "editor"]), signOut);
/** 
 * @DESC Admin and Editor can make changes to a user's account. This
 includes verification and suspension.
*/

router.put(
  "/modify-status/:id",
  userAuth(["admin", "editor"]),
  modifyUserStatus
);
// create a dashboard users route
router.post("/reset-password", userAuth(["admin", "editor"]), resetPassword); // both admins and editors can reset their own passwords
router.post("/create-dash-user", userAuth(["admin"]), createDashUser);
router.put("/modify-status", userAuth(["admin", "editor"]), modifyUserStatus);
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

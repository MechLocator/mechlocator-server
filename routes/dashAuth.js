import express from "express";
import {
  createDashUser,
  fetchUser,
  getPartners,
  getUsers,
  isAuth,
  login,
  modifyUserStatus,
  register,
  resetPassword,
  sendPassCodeToEmail,
  signOut,
} from "../controllers/dashAuthController.js";
import { userAuth } from "../utils/jsontokenVerifier.js";
import { getUser, getAllUsers } from "../controllers/userController.js";
import { getFAQs } from "../controllers/faqController.js";

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
//GET ALL
router.get("/get-all-users", userAuth(["admin", "editor"]), getAllUsers);
router.get("/get-users", userAuth(["admin", "editor"]), getUsers);
router.get("/get-query-result", userAuth(["admin", "editor"]), fetchUser);
router.get("/get-user/:id", userAuth(["admin", "editor"]), getUser);
router.get("/garages", userAuth(["admin", "editor"]), getPartners);
router.get("/get-faqs", userAuth(["admin", "editor"]), getFAQs); // all users can get an faq

export default router;

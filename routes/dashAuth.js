import express from "express";
import {
  createDashUser,
  login,
  register,
  resetPassword,
  sendPassCodeToEmail,
} from "../controllers/dashAuthController.js";
import { userAuth } from "../utils/jsontokenVerifier.js";
import AuthUser from "../models/AuthUser.js";

const router = express.Router();

/**
 * @DESC Check Role Middleware
 */
// const checkRole = roles => async (req, res, next) => {
//   let { name } = req.body;

//retrieve employee info from DB
//   const user = await AuthUser.findOne({ name });
//   !roles.includes(user?.role)
//     ? res.status(401).json("Sorry you do not have access to this route")
//     : next();
// };

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
router.post("/reset-password", resetPassword);
router.post("/create-dash-user", createDashUser);
router.post("/pass-to-email", sendPassCodeToEmail); // only admins or editors can access this route
router.get(
  "/return-something",
  userAuth(["admin"]),
  //   checkRole(["admin"]),
  async (req, res) => {
    // console.log(req);
    return res
      .status(202)
      .json(`welcome user. You're allowed to view this route as an admin`);
  }
);
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

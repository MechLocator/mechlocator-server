import express from "express";

import {
  updateUser,
  deleteUser,
  getUser,
  getUserByUid,
  getPartners,
  getGarageByLocation,
  getUserByEmail,
  acceptTerms,
} from "../controllers/userController.js";
import verifyUser from "../utils/verifyUser.js";
import { isAuth } from "../controllers/authController.js";

const router = express.Router();

//UPDATE

// Allow only the user to perform updates to their profile from here
router.put("/update-resource/:id", verifyUser, updateUser);
router.put("/accept-terms/:id", verifyUser, acceptTerms)
router.put("/add-info/:id", updateUser);

//DELETE
/*
 A User alone can delete their account
*/
router.delete("/delete-resource/:id", verifyUser, deleteUser);

router.get("/get-user", getUserByEmail);

//GET
router.get("/get-resource/:id", verifyUser, getUser);

// GET
router.get("/get/partners", getPartners);
// GET
router.get("/get/garage-by-location", getGarageByLocation);

// GET
router.get("actions/:uid", getUserByUid);

export default router;

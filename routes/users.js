import express from "express";

import {
  updateUser,
  deleteUser,
  getUser,
  getUserByUid,
  getPartners,
  getGarageByLocation,
  getUserByEmail,
} from "../controllers/userController.js";
import verifyUser from "../utils/verifyUser.js";

const router = express.Router();

//UPDATE

// Allow only the user to perform updates to their profile from here
router.put("/update-resource/:id", verifyUser, updateUser);
// router.put("/add-info/:id", verifyUser, addUserInfo);

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

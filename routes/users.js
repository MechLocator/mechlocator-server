import express from "express";

import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getUserByUid,
  addUserInfo,
} from "../controllers/userController.js";

import verifyEditor from "../utils/verifyEditor.js";
import verifyAdmin from "../utils/verifyAdmin.js";
import verifyUser from "../utils/verifyUser.js";

const router = express.Router();

//UPDATE
/*
 Admin, Editor and User can make changes to a user's account. This
 includes verification and suspension.
*/
router.put("actions/modify-status/:id", verifyEditor, verifyAdmin, updateUser);

// Allow only the user to perform updates to their profile from here
router.put("actions/update-resource/:id", verifyUser, updateUser);
// router.put("/add-info/:id", verifyUser, addUserInfo);

//DELETE
/*
 A User alone can delete their account
*/
router.delete("actions/delete-resource/:id", verifyUser, deleteUser);

//GET
router.get(
  "actions/get-resource/:id",
  verifyUser,
  verifyAdmin,
  verifyEditor,
  getUser
);

// GET
router.get("actions/:uid", getUserByUid);

//GET ALL
router.get("actions/get-all-resources", verifyAdmin, verifyEditor, getUsers);

export default router;

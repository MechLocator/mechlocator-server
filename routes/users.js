import express from "express";

import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getUserByUid,
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
router.put("/:id", verifyUser, verifyEditor, verifyAdmin, updateUser);

//DELETE
/*
 A User alone can delete their account
*/
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", verifyUser, verifyAdmin, verifyEditor, getUser);

// GET
router.get("/:uid", getUserByUid);

//GET ALL
router.get("/", verifyAdmin, verifyEditor, getUsers);

export default router;

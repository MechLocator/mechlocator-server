import User from "../models/User.js";
import { createError } from "../utils/error.js";
import { verifyNumber } from "../utils/verifyNumber.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const acceptTerms = async (req,res,next) => {
  const {id} = req.params
  try {
    // Ascertain the user's email exists in the database
    const user = await User.findById({ _id: id });
    if (!user) return next(createError(404, "Sorry, this user was not found!!"));

    // Update the isTermsAgreed attribute of the User model
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 200, message: "User has been deleted!!" });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    console.log(`Request id ${req.params.id}`);
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  //   const failed = true;

  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// come back to this later
export const addUserInfo = async (req, res, next) => {
  try {
    const isPhoneVerified = verifyNumber(req.body.phoneNumber);
    try {
      if (isPhoneVerified) {
        // assign the user's phone plus other updates to the user schema
        const user = await User.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        return res.status(200).json({ success: true, user });
      }
    } catch (error) {
      next(error);
      return res.json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    next(error);
    return res.json({ success: false.status, message: error.message });
  }
};

export const getUserByUid = async (req, res, next) => {
  // const query = { owner_uid: req.query.owner_uid }
  try {
    const userByUid = await User.findOne({
      where: { owner_uid: req.query.owner_uid },
    });
    res.status(200).json(userByUid);
    console.log(`User by uid: ${userByUid}`);
  } catch (error) {
    next(error);
  }
};

export const getPartners = async (req, res, next) => {
  const query = { accountType: req.query.accountType };
  try {
    const partners = await User.find(query);
    res.status(200).json(partners);
    console.log(partners);
  } catch (error) {
    next(error);
  }
};

export const getGarageByLocation = async (req, res, next) => {
  const query = { location: req.query.location };
  try {
    const garage = await User.find(query);
    res.status(200).json(garage);
    console.log(partners);
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (req, res, next) => {
  const query = { email: req.query.email };
  try {
    const user = await User.find(query);
    res.status(200).json(user);
    console.log(partners);
  } catch (error) {
    next(error);
  }
};

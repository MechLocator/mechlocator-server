import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, 'Sorry, user not found!'));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return next(createError(400, 'Wrong username or password'));

    const token = jwt.sign(
      { 
        id: user._id, 
        isAdmin: user.isAdmin, 
        isEditor: user.isEditor, 
        isVerified: user.isVerified, 
        isSuspended: user.isSuspended,
        isPartner: user.isPartner
      },
      process.env.JWT_SECRET_KEY
    );

    const { password, isAdmin, isEditor, isVerified, isPartner, isSuspended, ...otherDetails } = user._doc;
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin, isVerified, isSuspended, isPartner });
  } catch (err) {
    next(err);
  }
};
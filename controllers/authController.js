import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import nodemailer from "nodemailer";
import { codeToSend } from "../utils/generateCode.js";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const passToHash = req.body.password;
    const hash = bcrypt.hashSync(passToHash, salt);

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
    if (!user) return next(createError(404, "Sorry, user not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return next(createError(400, "Wrong username or password"));

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isEditor: user.isEditor,
        isVerified: user.isVerified,
        isSuspended: user.isSuspended,
        isPartner: user.isPartner,
      },
      process.env.JWT_SECRET_KEY
    );

    let oldTokens = user.tokens || [];

    if (oldTokens.length) {
      oldTokens = oldTokens.filter(t => {
        const timeDiff = Date.now() - parseInt(t.signedAt) / 1000;
        if (timeDiff < 86400) {
          return t;
        }
      });
    }

    await User.findByIdAndUpdate(user._id, {
      tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
    });

    const {
      password,
      isAdmin,
      isEditor,
      isVerified,
      isPartner,
      isSuspended,
      ...otherDetails
    } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        details: { ...otherDetails },
        isAdmin,
        isVerified,
        isSuspended,
        isPartner,
        token,
      });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return next(createError(404, "Sorry, user not found!"));

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      logger: true,
      debug: true,
      secureConnection: false,
      secure: true,
      port: 465,
      auth: {
        user: "mechlocator@gmail.com",
        pass: process.env.NODEMAILER_USER_PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    console.log("User email " + user.email);

    const mailOptions = {
      from: "mechlocator@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: `<main><b>Use the code below to reset your password:</b><br/><p>${codeToSend}</p></main>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.send("Email Sent!!");
  } catch (error) {
    next(error);
  }
};

export const verifyCode = (req, res, next) => {
  const { code } = req.body;
  if (code !== codeToSend) return;
  res
    .status(200)
    .json({
      success: true,
      message: "User password updated successfully",
    })
    .catch(error => next(error));
};

export const updatePassword = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const passToHash = req.body.password;
    const hash = bcrypt.hashSync(passToHash, salt);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, password: hash } },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(`Decoded Token: ${JSON.stringify(decode)}`);
      const user = await User.findById(decode.id);
      if (!user) {
        return res.json({ success: false, message: "No user was found!" });
      }

      console.log((req.user = user));
      // console.log(`User is ${user}`);
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.json({ success: false, message: error.message });
      }
      if (error.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: error.message,
        });
      }

      res.json({ success: false, message: "Internal server error!" });
    }
  } else {
    res.json({ success: false, message: "unauthorized access!" });
  }
};

export const signOut = async (req, res) => {
  try {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Authorization fail!" });
      } else {
        const tokens = req.user.tokens;

        const newTokens = tokens.filter(t => t.token !== token);

        await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
        return res.json({ success: true, message: "Sign out successfully!" });
      }
    }
  } catch (error) {
    console.log(`AuthController signOut error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

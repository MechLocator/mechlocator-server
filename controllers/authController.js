import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

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
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
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

export const resetPassword = async (req, _, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "Sorry, user not found!"));

    // Generate a random set of numbers, maximum length of 6 which we'll send to a user's email
    function generateRandomNumber(length) {
      const numbers = "0123456789";
      let result;
      const numLength = numbers.length;
      for (let i = 0; i < length; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numLength));
      }
      return result;
    }

    const codeToSend = generateRandomNumber(6);

    // Assign a password reset token for this user
    const token = jwt.sign(
      { id: user._id, code: codeToSend },
      process.env.JWT_PASSWORD_RESET_KEY
    );

    // Send this token somehow to the user's email and have them confirm it in the app
    console.log(JSON.stringify(token));
  } catch (error) {
    next(error);
  }

  // If the email exists in the MongoDB database, send a reset code to that email
  // Have the user input the code into the app
  // The app then confirms this code against that provided by the api
  // If the codes match, we proceed to the next stage
  // which is inputing a new password
  // This new password is then saved and then the user is prompted to login once again
};

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    next(err);
    return res
      .status(500)
      .json({ message: err.message || "could not decode the token" });
  }
  if (!decodedToken) {
    res.status(401).json({ message: "unauthorized" });
  } else {
    res.status(200).json({ message: "You are authenticated!!" });
  }
};

export const signOut = (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    // if (!token) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Authorization Has Failed!",
    //   });
    // } else {
    //   req.session.destroy();
    //   res.setHeader("Clear-Site-Data", '"cookies", "storage"');
    //   res.clearCookie("access_token");
    // }
    console.log(req.headers.authorization);
    res.send("Ok");
  }
};

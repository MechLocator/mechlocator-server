import AuthUser from "../models/AuthUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import nodemailer from "nodemailer";
import User from "../models/User.js";

/**
 * @DESC Controller function to handle registration of dashboard users onto the platform.
 */
export const register = async (req, role, res) => {
  try {
    //Get employee from database with same name if any
    const validateEmployeename = async name => {
      let user = await AuthUser.findOne({ name });
      return user ? false : true;
    };

    //Get employee from database with same email if any
    const validateEmail = async email => {
      let user = await AuthUser.findOne({ email });
      return user ? false : true;
    };
    // Validate the name
    let nameNotTaken = await validateEmployeename(req.name);
    if (!nameNotTaken) {
      return res.status(400).json({
        message: `User name is already taken.`,
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(req.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
      });
    }

    // Hash password using bcrypt
    const password = await bcrypt.hash(req.password, 12);
    // create a new user
    const user = new AuthUser({
      ...req,
      password,
      role,
    });

    await user.save();
    console.log("registration was successful");
    return res.status(201).json({
      message: "You've successfully registered!!",
    });
  } catch (err) {
    // Implement logger function if any
    return res.status(500).json({
      message: `${err.message}`,
    });
  }
};

/**
 * @DESC Controller function to handle login of users onto the platform.
 */
export const login = async (req, role, res) => {
  let { email, password } = req;

  // First Check if the user exist in the database
  const user = await AuthUser.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User email is not found. Invalid login credentials.",
      success: false,
    });
  }

  // We will check the if the employee is logging in via the route for his departemnt
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false,
    });
  }

  // That means the employee is existing and trying to signin fro the right portal
  // Now check if the password match
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // if the password match Sign a the token and issue it to the employee
    let token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1 day" }
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

    await AuthUser.findByIdAndUpdate(user._id, {
      tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
    });

    const { password, ...otherDetails } = user._doc;

    // let result = {
    //   name: user.name,
    //   role: user.role,
    //   email: user.email,
    //   token: token,
    // };

    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        ...otherDetails,
        token,
        message: "You are now logged in.",
      });
    // return res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .json({
    //     details: otherDetails,
    //     token,
    //   });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
    });
  }
};

/**
 * @DESC Controller function to handle the creation of a dashboard user.
 * This function is only accessible to users with admin rights
 */
export const createDashUser = async (req, res, next) => {
  const user = await AuthUser.findOne({ email: req.body.email });
  if (user) {
    res.status(409).send("Email already exists!");
    return next(createError(409, "Sorry, user not found!"));
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const passToHash = req.body.password;
    const hash = bcrypt.hashSync(passToHash, salt);

    const newUser = new AuthUser({
      ...req.body,
      password: hash,
    });
    await newUser.save();
    const { password, ...otherDetails } = newUser._doc;
    res.status(200).json(otherDetails);
  } catch (err) {
    next(err);
  }
};

/**
 * @DESC Controller function to handle information updates on admin board accounts only
 */
export const updateUser = async (req, res, next) => {
  try {
    const userToModify = await AuthUser.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userToModify,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Controller function to handle the verification or suspension of app users)
 */
export const modifyUserStatus = async (req, res, next) => {
  try {
    const userToModify = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userToModify,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Controller function to fetch all users in a paginated form
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    // convert the page and limit from strings to integers
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize);

    const startIndex = (page - 1) * pageSize;
    const lastIndex = page * pageSize;

    /**
     * Initialize an empty object to handle pagination functionality
     */
    const results = {};
    results.totalUsers = users.length;
    results.pageCount = Math.ceil(users.length / pageSize);

    if (lastIndex < users.length) {
      results.next = {
        page: page + 1,
      };
    }

    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
      };
    }

    results.result = users.slice(startIndex, lastIndex);

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

/**
 * Function specifying data fetch based on the query received
 */
export const fetchUser = async (req, res, next) => {
  const query = { email: req.query.email };

  try {
    const foundUser = await User.findOne(query);
    return res.status(200).json({ ...foundUser._doc });
  } catch (err) {
    next(err);
  }
};

/**
 * @funcDesc - The sendPassToEmail takes the password from the frontend and send it to the newly registered user's email inbox.
 */
export const sendPassToEmail = async (req, res, next) => {
  const { role, email, password } = req.body;
  try {
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

    console.log("User email " + email);
    console.log(
      "Environment Variable Pass " + process.env.NODEMAILER_USER_PASS
    );

    const mailOptions = {
      from: "mechlocator@gmail.com",
      to: email,
      subject: "Authentication credentials for first time sign-in",
      html: `<main>
              <br />
              <b>Use the credentials below to sign-in for the first time. You can then change the password to what you wish later.</b>
              <i>Do not share it with anybody else.</i>
              <br/>
              <section>
                <p style={{color: "#000", fontSize: "1.2rem", fontWeight: "600"}}>Email: ${email}</p>
                <p style={{color: "#000", fontSize: "1.2rem", fontWeight: "600"}}>Password: ${password}</p>
                <p style={{color: "#000", fontSize: "1.2rem", fontWeight: "600"}}>Your Role: ${role}</p>
                <a href="https://admin.mechtraktech.com" target="_blank">Mechanic Locator Admin Board</a>
              </section>
            </main>`,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);
        }
      });
    });
    res.status(200).json({
      success: true,
      message: "New user's credentials sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Controller function to handle fetch request for all garages
 */
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

/**
 * @DESC Controller function to handle reset password request.
 * It checks the existence of a user in the DB and if they are present,
 * it uses Nodemailer <https://nodemailer.com/> to send a password reset code to the user.
 * Once the user has entered that code and confirmed it against the backend,
 * they are allowed to proceed with the password reset request.
 */
export const resetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await AuthUser.findOne({ email: email });
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
    console.log(
      "Environment Variable Pass " + process.env.NODEMAILER_USER_PASS
    );

    const mailOptions = {
      from: "mechlocator@gmail.com",
      to: user.email,
      subject: "Password Reset - Mechanic Locator",
      html: `<main><b>Use the code below to reset your password:</b><br/><p>${codeToSend}</p></main>`,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);
        }
      });
    });
    res.send("Email Sent!!");
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Controller function to handle password update upon password reset request
 */
export const updatePassword = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const passToHash = req.body.password;
    const hash = bcrypt.hashSync(passToHash, salt);
    console.log(req.params);
    const updatedUser = await AuthUser.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, password: hash } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User password updated successfully",
      updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @DESC Controller function to check whether a loggedin user is still loggedin
 */
export const isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(`Decoded Token: ${JSON.stringify(decode)}`);
      const user = await AuthUser.findById(decode.id);
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

/**
 * @DESC Controller function to handle signout on the server
 * It is responsible for the removal of the JWT assigned upon login
 */
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

        await AuthUser.findByIdAndUpdate(req.user._id, { tokens: newTokens });
        return res.json({ success: true, message: "Sign out successfully!" });
      }
    }
  } catch (error) {
    console.log(`AuthController signOut error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

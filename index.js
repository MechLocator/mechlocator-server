import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.js";
import dashAuth from "./routes/dashAuth.js";
import usersRoute from "./routes/users.js";
import reviewsRoute from "./routes/reviews.js";
import faqRoute from "./routes/faq.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;

const mongoConnect = async () => {
  mongoose.set("strictQuery", true);
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connection was completed successfully");
  } catch (err) {
    throw err;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log(`mongoDB disconnected!`);
});

mongoose.connection.on("connected", () => {
  console.log(`mongoDB has reconnected successfully!`);
});

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "Authorization"
  );
  next();
});

app.use("/api/dashboard/users", dashAuth);
app.use("/api/dashboard/users/actions", usersRoute);
app.use("/api/dashboard/actions", faqRoute);
// app.use("/api/app/users/actions", faqRoute);
app.use("/api/app/users", authRoute);
app.use("/api/app/users/actions", usersRoute);
app.use("/api/app/users/actions", reviewsRoute, faqRoute);

app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Looks like something went wrong :(";
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

// app.listen(8100, () => {
//   mongoConnect();
//   console.log("Connection to backend has been completed successfully!!");
// });

mongoConnect().then(() => {
  app.listen(PORT, () => {
    console.log("Connection to backend has been completed successfully!!");
  });
});

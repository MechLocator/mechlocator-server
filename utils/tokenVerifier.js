import { createError } from "./error.js";
import jwt from 'jsonwebtoken';


export default function verifyToken(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, 'You are not authenticated!'));
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return next(createError(403, 'Token is not valid!'));
      req.user = user;
      next();
    });
  };
import jwt from "jsonwebtoken";

/**
 * @DESC Verify JWT from authorization header Middleware
 */
export const userAuth = roles => async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Env variable " + process.env.JWT_SECRET_KEY);
  console.log("====================");
  if (!authHeader)
    return res.status(403).json({
      message: "Forbidden Access!!",
      success: false,
    });
  console.log("Bearer token " + authHeader); // Bearer token
  console.log("==========================");
  const token = await authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    console.log("verifying");
    if (err)
      return res.status(403).json({
        message: "Invalid token!!",
        success: false,
      }); //invalid token
    console.log("Decoded token");
    console.log(decoded); //for correct token
    console.log("=============");
    if (roles.includes(decoded.role)) {
      next();
    } else {
      return res.status(401).json("Sorry you do not have access to this route");
    }
  });
};

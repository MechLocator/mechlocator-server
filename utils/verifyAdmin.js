import verifyToken from "./tokenVerifier.js"

export default function verifyAdmin (req, res, next) {
    verifyToken(req, res, next, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return next(createError(403, 'You are not an admin!'));
      }
    });
};
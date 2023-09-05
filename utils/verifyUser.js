import verifyToken from "./tokenVerifier.js"

export default function verifyUser (req, res, next) {
    verifyToken(req, res, next, () => {
      if (req.user.id === req.params.id || req.user.isAdmin || req.user.isEditor) {
        next();
      } else {
        return next(createError(403, 'You are not an authorized user!'));
      }
    });
};
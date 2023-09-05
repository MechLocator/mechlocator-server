import verifyToken from "./tokenVerifier.js"

export default function verifyEditor(req, res, next) {
    verifyToken(req, res, next, () => {
      if (req.user.isEditor) {
        next();
      } else {
        return next(createError(403, 'You are not an editor!'));
      }
    });
};
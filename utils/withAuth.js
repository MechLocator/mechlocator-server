export const authPage = permissions => {
  return (req, res, next) => {
    const userRole = req.body.userRole;

    if (permissions.includes(userRole)) {
      next();
    } else {
      return res.json({
        status: 401,
        message: "You are not allowed to conduct this operation!",
      });
    }
  };
};

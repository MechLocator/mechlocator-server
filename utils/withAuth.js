export const adminAuthPage = permissions => {
  return (req, res, next) => {
    const userRole = req.body.adminRole;

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

export const editorAuthPage = permissions => {
  return (req, res, next) => {
    const userRole = req.body.editorRole;

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

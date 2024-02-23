export const adminAuthPage = permissions => {
  return (req, res, next) => {
    // const userRole = req.body.role;
    console.log(`Req object ${JSON.stringify(req.body)}`);

    if (permissions.includes(req.body.role)) {
      next();
    } else {
      return res.status(401).json({
        status: 401,
        message: "You are not an admin!",
      });
    }
  };
};

export const editorAuthPage = permissions => {
  return (req, res, next) => {
    const userRole = req.body.role;

    if (permissions.includes(userRole)) {
      next();
    } else {
      return res.status(401).json({
        status: 401,
        message: "You are not an editor!",
      });
    }
  };
};

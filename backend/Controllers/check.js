const check = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: No user found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Valid user",
    data: req.user,
    success: true,
  });
};

module.exports = check;

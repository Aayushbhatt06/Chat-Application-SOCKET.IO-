import { Request, Response } from "express";

const check = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized: No user found",
      success: false,
    });
    return;
  }

  res.status(200).json({
    message: "Valid user",
    data: req.user,
    success: true,
  });
};

export default check;

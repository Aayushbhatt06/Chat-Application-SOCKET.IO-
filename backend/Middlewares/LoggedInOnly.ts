import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import userModel from "../Models/User.js";
import { IUser } from "../Models/User.js";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
}

const LoggedInOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

export default LoggedInOnly;

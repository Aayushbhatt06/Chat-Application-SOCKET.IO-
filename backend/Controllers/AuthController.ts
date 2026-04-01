import { Request, Response } from "express";
import userModel from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
        success: false,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "User not found",
        success: false,
      });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unexpected error",
      success: false,
    });
  }
};

export { login, signup };

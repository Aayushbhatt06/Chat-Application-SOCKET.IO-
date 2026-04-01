import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const signupValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const Schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = Schema.validate(req.body);

  if (error) {
    res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message,
    });
    return;
  }

  next();
};

const LoginValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const Schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = Schema.validate(req.body);

  if (error) {
    res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message,
    });
    return;
  }

  next();
};

export { signupValidation, LoginValidation };

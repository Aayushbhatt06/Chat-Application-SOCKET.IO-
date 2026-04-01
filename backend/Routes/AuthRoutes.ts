import { Router } from "express";
import { login, signup } from "../Controllers/AuthController.js";
import {
  signupValidation,
  LoginValidation,
} from "../Middlewares/LoginValidation.js";

const router = Router();

router.post("/login", LoginValidation, login);
router.post("/signup", signupValidation, signup);

export default router;

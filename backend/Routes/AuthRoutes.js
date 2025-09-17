const router = require("express").Router();
const { login, signup } = require("../Controllers/AuthController");
const {
  signupValidation,
  LoginValidation,
} = require("../Middlewares/LoginValidation");

router.post("/login", LoginValidation, login);
router.post("/signup", signupValidation, signup);

module.exports = router;

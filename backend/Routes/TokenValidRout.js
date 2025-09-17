const router = require("express").Router();
const LoggedInOnly = require("../Middlewares/LoggedInOnly");
const check = require("../Controllers/check");
router.get("/token", LoggedInOnly, check);

module.exports = router;

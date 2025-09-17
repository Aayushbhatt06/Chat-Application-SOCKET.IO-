const router = require("express").Router();
const {
  reqCon,
  acceptCon,
  rejectCon,
  getCon,
  getConReq,
  removeCon,
} = require("../Controllers/Connections");
const LoggedInOnly = require("../Middlewares/LoggedInOnly");
LoggedInOnly;
const { fetchUsers, findUsers } = require("../Controllers/Users");

router.post("/reqcon", LoggedInOnly, reqCon);
router.post("/acceptcon", LoggedInOnly, acceptCon);
router.post("/rejectcon", LoggedInOnly, rejectCon);
router.get("/getcon", LoggedInOnly, getCon);
router.get("/getconreq", LoggedInOnly, getConReq);
router.get("/users", LoggedInOnly, fetchUsers);
router.post("/finduser", LoggedInOnly, findUsers);
router.post("/removecon", LoggedInOnly, removeCon);

module.exports = router;

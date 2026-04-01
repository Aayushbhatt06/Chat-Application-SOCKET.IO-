import { Router } from "express";
import {
  reqCon,
  acceptCon,
  rejectCon,
  getCon,
  getConReq,
  removeCon,
} from "../Controllers/Connections.js";
import LoggedInOnly from "../Middlewares/LoggedInOnly.js";
import { fetchUsers, findUsers } from "../Controllers/Users.js";

const router = Router();

router.post("/reqcon", LoggedInOnly, reqCon);
router.post("/acceptcon", LoggedInOnly, acceptCon);
router.post("/rejectcon", LoggedInOnly, rejectCon);
router.get("/getcon", LoggedInOnly, getCon);
router.get("/getconreq", LoggedInOnly, getConReq);
router.get("/users", LoggedInOnly, fetchUsers);
router.post("/finduser", LoggedInOnly, findUsers);
router.post("/removecon", LoggedInOnly, removeCon);

export default router;

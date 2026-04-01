import { Router } from "express";
import LoggedInOnly from "../Middlewares/LoggedInOnly.js";
import check from "../Controllers/check.js";

const router = Router();

router.get("/token", LoggedInOnly, check);

export default router;

import { Router } from "express";
import {
  loadMessages,
  addMessage,
} from "../Controllers/messagesController.js";
import LoggedInOnly from "../Middlewares/LoggedInOnly.js";

const router = Router();

router.post("/load", LoggedInOnly, loadMessages);
router.post("/newmessage", LoggedInOnly, addMessage);

export default router;

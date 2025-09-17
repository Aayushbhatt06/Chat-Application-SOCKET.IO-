const router = require("express").Router();
const {
  loadMessages,
  addMessage,
} = require("../Controllers/messagesController");
const LoggedInOnly = require("../Middlewares/LoggedInOnly");

router.post("/load", LoggedInOnly, loadMessages);
router.post("/newmessage", LoggedInOnly, addMessage);

module.exports = router;

const router = require("express").Router();
const isAuthenticated = require("../../../middleware/isAuthenticate");
const { sendMessage, getMessages } = require("../controller");

// SEND MESSAGE
router.post("/", isAuthenticated, sendMessage);

// GET MESSAGES BETWEEN TWO USERS
router.get("/:userId1/:userId2", isAuthenticated, getMessages);

module.exports = router;

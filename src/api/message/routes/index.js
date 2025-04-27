const express = require("express");
const router = express.Router();
const messageController = require("../controller/index");

// Define routes and ensure handlers are functions
router.post("/send", messageController.sendMessage); // Ensure sendMessage is a function

module.exports = router;

const express = require("express");
const { createChatResponse } = require("../controllers/chatController");

const router = express.Router();

router.post("/", createChatResponse);

module.exports = router;

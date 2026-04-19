const express = require("express");
const { getRootMessage } = require("../controllers/rootController");
const { createHealthData, getHealthData } = require("../controllers/dataController");
const { createChatResponse } = require("../controllers/chatController");
const { createMealSuggestions } = require("../controllers/mealsController");

const router = express.Router();

router.get("/", getRootMessage);
router.post("/api/data", createHealthData);
router.get("/api/data", getHealthData);
router.post("/api/chat", createChatResponse);
router.post("/api/meals", createMealSuggestions);

module.exports = router;

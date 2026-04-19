const express = require("express");
const { getRootMessage } = require("../controllers/rootController");
const healthRoutes = require("./healthRoutes");
const chatRoutes = require("./chatRoutes");
const mealRoutes = require("./mealRoutes");
const insightRoutes = require("./insightRoutes");

const router = express.Router();

router.get("/", getRootMessage);
router.use("/api/health", healthRoutes);
router.use("/api/chat", chatRoutes);
router.use("/api/meals", mealRoutes);
router.use("/api/insights", insightRoutes);
router.use("/api/data", healthRoutes);

module.exports = router;

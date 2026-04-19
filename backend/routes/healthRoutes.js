const express = require("express");
const {
  createHealthData,
  getHealthData,
  getHealthHistoryData,
  getLatestHealthData,
} = require("../controllers/dataController");

const router = express.Router();

router.post("/", createHealthData);
router.get("/", getLatestHealthData);
router.get("/latest", getLatestHealthData);
router.get("/history", getHealthHistoryData);
router.get("/legacy", getHealthData);

module.exports = router;

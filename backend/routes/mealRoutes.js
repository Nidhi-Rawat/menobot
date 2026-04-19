const express = require("express");
const { createMealSuggestions } = require("../controllers/mealsController");

const router = express.Router();

router.post("/", createMealSuggestions);

module.exports = router;

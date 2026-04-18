const UserHealth = require("../models/UserHealth");
const calculatePain = require("../utils/calculatePain");
const predictCycle = require("../utils/predictCycle");
const detectPhase = require("../utils/detectPhase");

const isValidScore = (value) => Number.isFinite(value) && value >= 0 && value <= 10;

const createHealthData = async (req, res) => {
  try {
    const { lastPeriod, cycles, cramps, mood, fatigue, flow } = req.body;
    const parsedCramps = Number(cramps);
    const parsedMood = Number(mood);
    const parsedFatigue = Number(fatigue);
    const parsedFlow = Number(flow);

    if (!Array.isArray(cycles) || cycles.length < 3) {
      return res.status(400).json({ message: "cycles must be an array with at least 3 values" });
    }

    const validCycles = cycles.every(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 15 && Number(value) <= 45
    );
    if (!validCycles) {
      return res.status(400).json({ message: "each cycle value must be a number between 15 and 45" });
    }

    if (![parsedCramps, parsedMood, parsedFatigue, parsedFlow].every(isValidScore)) {
      return res.status(400).json({
        message: "cramps, mood, fatigue, and flow must be numbers between 0 and 10",
      });
    }

    const { painScore, category } = calculatePain({
      cramps: parsedCramps,
      mood: parsedMood,
      fatigue: parsedFatigue,
      flow: parsedFlow,
    });
    const nextPeriod = predictCycle(cycles, lastPeriod);
    const phase = detectPhase(lastPeriod);

    await UserHealth.create({
      lastPeriod,
      cycles,
      cramps: parsedCramps,
      mood: parsedMood,
      fatigue: parsedFatigue,
      flow: parsedFlow,
      painScore,
      category,
      nextPeriod,
      phase,
    });

    return res.status(201).json({
      painScore,
      category,
      nextPeriod,
      phase,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Invalid input data" });
  }
};

const getHealthData = async (req, res) => {
  try {
    const entries = await UserHealth.find().sort({ createdAt: -1 });
    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createHealthData, getHealthData };

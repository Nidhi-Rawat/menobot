const calculatePain = require("../utils/calculatePain");
const predictCycle = require("../utils/predictCycle");
const detectPhase = require("../utils/detectPhase");
const UserHealth = require("../models/UserHealth");
const mongoose = require("mongoose");

const isValidScore = (value) => Number.isFinite(value) && value >= 1 && value <= 5;
let latestHealthEntry = null;

const getLatestHealthEntry = async () => {
  if (latestHealthEntry) {
    return latestHealthEntry;
  }

  if (mongoose.connection.readyState !== 1) {
    return null;
  }

  const latestEntry = await UserHealth.findOne().sort({ createdAt: -1 }).lean();

  if (!latestEntry) {
    return null;
  }

  latestHealthEntry = {
    ...latestEntry,
    updatedAt: latestEntry.createdAt || latestEntry.updatedAt || new Date().toISOString(),
  };

  return latestHealthEntry;
};

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
        message: "cramps, mood, fatigue, and flow must be numbers between 1 and 5",
      });
    }

    const { painScore, category } = calculatePain({
      cramps: parsedCramps,
      mood: parsedMood,
      fatigue: parsedFatigue,
      flow: parsedFlow,
    });
    const nextPeriod = predictCycle(cycles, lastPeriod);
    const phase = detectPhase(lastPeriod, cycles);
    const responsePayload = {
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
      updatedAt: new Date().toISOString(),
    };

    latestHealthEntry = responsePayload;

    if (mongoose.connection.readyState === 1) {
      await UserHealth.create(responsePayload);
    }

    console.log("createHealthData response:", responsePayload);

    return res.status(201).json(responsePayload);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Invalid input data" });
  }
};

const getHealthData = async (req, res) => {
  try {
    const latestEntry = await getLatestHealthEntry();
    const entries = latestEntry ? [latestEntry] : [];
    console.log("getHealthData response:", entries[0] || null);
    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createHealthData, getHealthData, getLatestHealthEntry };

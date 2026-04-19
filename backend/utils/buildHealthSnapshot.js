const calculatePain = require("./calculatePain");
const detectPhase = require("./detectPhase");
const predictCycle = require("./predictCycle");

function normalizeCycles(cycles) {
  if (!Array.isArray(cycles)) {
    throw new Error("cycles must be an array");
  }

  const normalized = cycles
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 15 && value <= 45);

  if (normalized.length < 3) {
    throw new Error("cycles must contain at least 3 values between 15 and 45");
  }

  return normalized;
}

function normalizeScore(value, fieldName) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 1 || numericValue > 5) {
    throw new Error(`${fieldName} must be a number between 1 and 5`);
  }

  return numericValue;
}

function buildHealthSnapshot(input) {
  const lastPeriod = new Date(input?.lastPeriod);

  if (Number.isNaN(lastPeriod.getTime())) {
    throw new Error("lastPeriod must be a valid date");
  }

  const cycles = normalizeCycles(input?.cycles);
  const cramps = normalizeScore(input?.cramps, "cramps");
  const mood = normalizeScore(input?.mood, "mood");
  const fatigue = normalizeScore(input?.fatigue, "fatigue");
  const flow = normalizeScore(input?.flow, "flow");
  const cycleLength = Math.round(cycles.reduce((total, value) => total + value, 0) / cycles.length);
  const { painScore, category } = calculatePain({ cramps, mood, fatigue, flow });
  const phase = detectPhase(lastPeriod, cycles);
  const nextPeriod = predictCycle(cycles, lastPeriod);

  return {
    lastPeriod,
    cycles,
    cycleLength,
    cramps,
    mood,
    fatigue,
    flow,
    painScore,
    category,
    phase,
    nextPeriod,
  };
}

module.exports = buildHealthSnapshot;

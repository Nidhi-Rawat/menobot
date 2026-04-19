const buildHealthSnapshot = require("../utils/buildHealthSnapshot");
const serializeHealthEntry = require("../utils/serializeHealthEntry");
const { createHealthEntry, getLatestHealthEntry, getHealthHistory } = require("../utils/healthRepository");

function calculateCycleDay(lastPeriodDate) {
  const startDate = new Date(lastPeriodDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays + 1 : null;
}

async function getLatestHealthEntryData() {
  const latestEntry = await getLatestHealthEntry();
  if (!latestEntry) {
    return null;
  }

  const serializedEntry = serializeHealthEntry(latestEntry);
  return {
    ...serializedEntry,
    cycleDay: calculateCycleDay(serializedEntry.lastPeriod),
  };
}

async function getHealthHistoryEntries() {
  const entries = await getHealthHistory();

  return entries.map((entry) => {
    const serializedEntry = serializeHealthEntry(entry);
    return {
      ...serializedEntry,
      cycleDay: calculateCycleDay(serializedEntry.lastPeriod),
    };
  });
}

const createHealthData = async (req, res) => {
  try {
    const healthSnapshot = buildHealthSnapshot(req.body);
    const savedEntry = await createHealthEntry(healthSnapshot);
    const responsePayload = await getLatestHealthEntryData(savedEntry);
    return res.status(201).json(responsePayload);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Invalid input data" });
  }
};

const getLatestHealthData = async (req, res) => {
  try {
    const latestEntry = await getLatestHealthEntryData();
    return res.status(200).json(latestEntry);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getHealthHistoryData = async (req, res) => {
  try {
    const entries = await getHealthHistoryEntries();
    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getHealthData = async (req, res) => {
  try {
    const latestEntry = await getLatestHealthEntryData();
    return res.status(200).json(latestEntry ? [latestEntry] : []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHealthData,
  getHealthData,
  getLatestHealthData,
  getHealthHistoryData,
  getLatestHealthEntryData,
  getHealthHistoryEntries,
};

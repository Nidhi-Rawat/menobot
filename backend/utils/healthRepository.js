const mongoose = require("mongoose");
const UserHealth = require("../models/UserHealth");

let inMemoryEntries = [];

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

async function createHealthEntry(payload) {
  if (isDatabaseReady()) {
    return UserHealth.create(payload);
  }

  const entry = {
    ...payload,
    _id: `memory-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  inMemoryEntries = [entry, ...inMemoryEntries];
  return entry;
}

async function getLatestHealthEntry() {
  if (isDatabaseReady()) {
    return UserHealth.findOne().sort({ createdAt: -1 }).lean();
  }

  return inMemoryEntries[0] || null;
}

async function getHealthHistory(limit = 30) {
  if (isDatabaseReady()) {
    const entries = await UserHealth.find().sort({ createdAt: -1 }).limit(limit).lean();
    return entries.reverse();
  }

  return [...inMemoryEntries].slice(0, limit).reverse();
}

module.exports = {
  createHealthEntry,
  getLatestHealthEntry,
  getHealthHistory,
  isDatabaseReady,
};

function serializeHealthEntry(entry) {
  if (!entry) {
    return null;
  }

  return {
    id: String(entry._id || ""),
    lastPeriod: entry.lastPeriod,
    cycles: Array.isArray(entry.cycles) ? entry.cycles : [],
    cycleLength: Number(entry.cycleLength || 0),
    cramps: Number(entry.cramps || 0),
    mood: Number(entry.mood || 0),
    fatigue: Number(entry.fatigue || 0),
    flow: Number(entry.flow || 0),
    painScore: Number(entry.painScore || 0),
    category: entry.category || "",
    phase: entry.phase || "",
    nextPeriod: entry.nextPeriod || null,
    createdAt: entry.createdAt || null,
    updatedAt: entry.updatedAt || entry.createdAt || null,
  };
}

module.exports = serializeHealthEntry;

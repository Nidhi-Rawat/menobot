function detectPhase(lastPeriodDate, cycles = []) {
  const startDate = new Date(lastPeriodDate);
  if (Number.isNaN(startDate.getTime())) {
    throw new Error("lastPeriodDate must be a valid date");
  }

  const normalizedCycles = Array.isArray(cycles)
    ? cycles.map((value) => Number(value)).filter((value) => Number.isFinite(value))
    : [];

  const averageCycleLength = normalizedCycles.length
    ? Math.round(
        normalizedCycles.reduce((total, value) => total + value, 0) / normalizedCycles.length
      )
    : 28;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceLastPeriod = Math.floor((now - startDate) / msPerDay);

  if (daysSinceLastPeriod < 0) {
    throw new Error("lastPeriodDate cannot be in the future");
  }

  const cycleDay = daysSinceLastPeriod + 1;

  if (cycleDay <= 5) {
    return "Menstrual";
  }
  if (cycleDay <= 14) {
    return "Follicular";
  }
  if (cycleDay <= 17) {
    return "Ovulation";
  }
  if (cycleDay <= averageCycleLength) {
    return "Luteal";
  }

  return "Late";
}

module.exports = detectPhase;

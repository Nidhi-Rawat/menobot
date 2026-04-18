function detectPhase(lastPeriodDate) {
  const startDate = new Date(lastPeriodDate);
  if (Number.isNaN(startDate.getTime())) {
    throw new Error("lastPeriodDate must be a valid date");
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceLastPeriod = Math.floor((now - startDate) / msPerDay);

  const cycleDay = ((daysSinceLastPeriod % 28) + 28) % 28 + 1;

  if (cycleDay >= 1 && cycleDay <= 5) {
    return "Menstrual";
  }
  if (cycleDay >= 6 && cycleDay <= 14) {
    return "Follicular";
  }
  if (cycleDay >= 15 && cycleDay <= 17) {
    return "Ovulation";
  }
  return "Luteal";
}

module.exports = detectPhase;

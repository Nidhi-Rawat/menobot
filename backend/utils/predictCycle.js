function predictCycle(cycles, lastPeriodDate) {
  if (!Array.isArray(cycles) || cycles.length < 3) {
    throw new Error("cycles must be an array with at least 3 values");
  }

  const latest = Number(cycles[cycles.length - 1]);
  const second = Number(cycles[cycles.length - 2]);
  const third = Number(cycles[cycles.length - 3]);

  if ([latest, second, third].some((value) => Number.isNaN(value))) {
    throw new Error("cycles must contain valid numbers");
  }

  const weightedAverage = 0.5 * latest + 0.3 * second + 0.2 * third;
  const roundedCycleLength = Math.round(weightedAverage);

  const baseDate = new Date(lastPeriodDate);
  if (Number.isNaN(baseDate.getTime())) {
    throw new Error("lastPeriodDate must be a valid date");
  }

  const predictedDate = new Date(baseDate);
  predictedDate.setDate(predictedDate.getDate() + roundedCycleLength);

  return predictedDate;
}

module.exports = predictCycle;

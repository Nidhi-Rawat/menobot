function calculatePain(data) {
  const cramps = Number(data?.cramps ?? 0);
  const mood = Number(data?.mood ?? 0);
  const fatigue = Number(data?.fatigue ?? 0);
  const flow = Number(data?.flow ?? 0);

  const painScore =
    0.4 * cramps + 0.2 * mood + 0.2 * fatigue + 0.2 * flow;

  let category = "Low";
  if (painScore >= 7) {
    category = "High";
  } else if (painScore >= 4) {
    category = "Medium";
  }

  return { painScore, category };
}

module.exports = calculatePain;

function calculatePain(data) {
  const cramps = Number(data?.cramps ?? 0);
  const mood = Number(data?.mood ?? 0);
  const fatigue = Number(data?.fatigue ?? 0);
  const flow = Number(data?.flow ?? 0);

  const painScore =
    0.4 * cramps +
    0.2 * mood +
    0.2 * flow +
    0.2 * fatigue;

  const finalScore = Number((painScore * 2).toFixed(1));

  let category = "Low";
  if (finalScore > 6) {
    category = "High";
  } else if (finalScore > 3) {
    category = "Medium";
  }

  return { painScore: finalScore, category };
}

module.exports = calculatePain;

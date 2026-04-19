function calculatePain(data) {
  const cramps = Number(data?.cramps ?? 0);
  const mood = Number(data?.mood ?? 0);
  const fatigue = Number(data?.fatigue ?? 0);
  const flow = Number(data?.flow ?? 0);

  const average = (cramps + mood + fatigue + flow) / 4;
  const painScore = Number(average.toFixed(1));

  let category = "Low";
  if (painScore > 6) {
    category = "High";
  } else if (painScore > 3) {
    category = "Medium";
  }

  return { painScore, category };
}

module.exports = calculatePain;

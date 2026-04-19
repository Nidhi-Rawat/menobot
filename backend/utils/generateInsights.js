function getPainTrend(history) {
  if (history.length < 2) {
    return null;
  }

  const previous = history[history.length - 2];
  const latest = history[history.length - 1];

  if (latest.painScore > previous.painScore) {
    return "Pain is increasing compared to your last entry.";
  }

  if (latest.painScore < previous.painScore) {
    return "Pain is easing compared to your last entry.";
  }

  return "Pain is steady compared to your last entry.";
}

function getMoodTrend(history) {
  if (history.length < 2) {
    return null;
  }

  const previous = history[history.length - 2];
  const latest = history[history.length - 1];

  if (latest.mood > previous.mood) {
    return "Mood is improving compared to your last entry.";
  }

  if (latest.mood < previous.mood) {
    return "Mood has dipped since your last entry.";
  }

  return "Mood is stable compared to your last entry.";
}

function getRecurringHighPainInsight(history) {
  const highPainEntries = history.filter((entry) => entry.painScore >= 6);

  if (highPainEntries.length < 2) {
    return null;
  }

  const groupedByCycleDay = highPainEntries.reduce((accumulator, entry) => {
    const key = Number(entry.cycleDay);
    if (!Number.isFinite(key)) {
      return accumulator;
    }

    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const recurringDays = Object.entries(groupedByCycleDay)
    .filter(([, count]) => count >= 2)
    .map(([day]) => Number(day))
    .sort((left, right) => left - right);

  if (recurringDays.length === 0) {
    return null;
  }

  if (recurringDays.length === 1) {
    return `Your pain tends to peak on Day ${recurringDays[0]}.`;
  }

  return `Your pain tends to peak on Day ${recurringDays[0]}-${recurringDays[recurringDays.length - 1]}.`;
}

function generateInsights(history) {
  const insights = [getPainTrend(history), getMoodTrend(history), getRecurringHighPainInsight(history)].filter(
    Boolean
  );

  const latest = history[history.length - 1] || null;

  return {
    latest,
    insights,
    summary:
      insights[0] ||
      "Keep logging consistently to unlock smarter insights about pain, mood, and cycle patterns.",
  };
}

module.exports = generateInsights;

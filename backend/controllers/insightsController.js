const { getHealthHistoryEntries } = require("./dataController");
const generateInsights = require("../utils/generateInsights");

async function getInsights(req, res) {
  try {
    const history = await getHealthHistoryEntries();

    if (history.length === 0) {
      return res.status(200).json({
        latest: null,
        insights: [],
        summary: "Start tracking your health today to unlock smarter insights.",
      });
    }

    return res.status(200).json(generateInsights(history));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getInsights };

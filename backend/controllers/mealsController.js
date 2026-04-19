const {
  REGION_OPTIONS,
  DIET_TYPE_OPTIONS,
  getMealSuggestions,
} = require("../utils/getMealSuggestions");

const createMealSuggestions = async (req, res) => {
  try {
    const { phase, painScore, region, dietType } = req.body;

    if (typeof phase !== "string" || !phase.trim()) {
      return res.status(400).json({ message: "phase is required" });
    }

    if (!Number.isFinite(Number(painScore))) {
      return res.status(400).json({ message: "painScore must be a valid number" });
    }

    if (!REGION_OPTIONS.includes(region)) {
      return res.status(400).json({ message: "region must be a valid option" });
    }

    if (!DIET_TYPE_OPTIONS.includes(dietType)) {
      return res.status(400).json({ message: "dietType must be Veg or Non-Veg" });
    }
    const result = getMealSuggestions(phase, painScore, region, dietType);

    return res.status(200).json({
      phase,
      painScore: Number(painScore),
      region,
      dietType,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createMealSuggestions };

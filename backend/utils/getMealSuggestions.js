const REGION_OPTIONS = ["Indian", "South Indian", "North Indian", "Western"];
const DIET_TYPE_OPTIONS = ["Veg", "Non-Veg"];

const PHASE_MEAL_LIBRARY = {
  menstrual: [
    {
      name: "Palak dal with jeera rice",
      region: "Indian",
      dietType: "Veg",
      tags: ["iron-rich"],
      reason: "Spinach and lentils are helpful iron-rich choices during the menstrual phase.",
    },
    {
      name: "Ragi dosa with beetroot chutney",
      region: "South Indian",
      dietType: "Veg",
      tags: ["iron-rich"],
      reason: "Ragi and beetroot support iron intake while keeping the meal familiar and comforting.",
    },
    {
      name: "Chicken liver masala with roti",
      region: "North Indian",
      dietType: "Non-Veg",
      tags: ["iron-rich"],
      reason: "A stronger iron-rich option when recovery and replenishment feel important.",
    },
    {
      name: "Warm lentil soup with whole grain toast",
      region: "Western",
      dietType: "Veg",
      tags: ["iron-rich"],
      reason: "A simple iron-focused meal that feels gentle and nourishing.",
    },
  ],
  follicular: [
    {
      name: "Paneer salad bowl with herbs",
      region: "Indian",
      dietType: "Veg",
      tags: ["light", "fresh"],
      reason: "Fresh ingredients work well in the follicular phase when energy is building back up.",
    },
    {
      name: "Idli with coconut chutney and sprout salad",
      region: "South Indian",
      dietType: "Veg",
      tags: ["light", "fresh"],
      reason: "A lighter South Indian option with a fresher side to match the phase.",
    },
    {
      name: "Tandoori chicken with cucumber salad",
      region: "North Indian",
      dietType: "Non-Veg",
      tags: ["light", "fresh"],
      reason: "Keeps meals clean and fresh without feeling too heavy.",
    },
    {
      name: "Greek yogurt bowl with berries",
      region: "Western",
      dietType: "Veg",
      tags: ["light", "fresh"],
      reason: "A lighter fresh option that fits well during the follicular phase.",
    },
  ],
  ovulation: [
    {
      name: "Paneer quinoa bowl with greens",
      region: "Indian",
      dietType: "Veg",
      tags: ["high-protein"],
      reason: "Higher-protein meals can feel especially supportive around ovulation.",
    },
    {
      name: "Egg uttapam with sambar",
      region: "South Indian",
      dietType: "Non-Veg",
      tags: ["high-protein"],
      reason: "Adds more protein while keeping the meal regionally familiar.",
    },
    {
      name: "Chicken tikka with sauteed vegetables",
      region: "North Indian",
      dietType: "Non-Veg",
      tags: ["high-protein"],
      reason: "A protein-forward option to match the ovulation phase.",
    },
    {
      name: "Grilled salmon with greens",
      region: "Western",
      dietType: "Non-Veg",
      tags: ["high-protein"],
      reason: "A clean high-protein meal with lighter sides.",
    },
  ],
  luteal: [
    {
      name: "Khichdi with pumpkin seeds",
      region: "Indian",
      dietType: "Veg",
      tags: ["magnesium-rich", "complex-carbs"],
      reason: "Grounding carbs and magnesium-rich ingredients can support the luteal phase well.",
    },
    {
      name: "Vegetable upma with roasted peanuts",
      region: "South Indian",
      dietType: "Veg",
      tags: ["magnesium-rich", "complex-carbs"],
      reason: "Comforting complex carbs with a magnesium-rich boost from peanuts.",
    },
    {
      name: "Egg curry with brown rice",
      region: "North Indian",
      dietType: "Non-Veg",
      tags: ["magnesium-rich", "complex-carbs"],
      reason: "A steadier, more grounding meal for luteal energy shifts.",
    },
    {
      name: "Oats with almonds and banana",
      region: "Western",
      dietType: "Veg",
      tags: ["magnesium-rich", "complex-carbs"],
      reason: "An easy luteal-friendly option with slower carbs and magnesium-rich ingredients.",
    },
  ],
};

function normalizePhase(phase) {
  return typeof phase === "string" ? phase.trim().toLowerCase() : "";
}

function normalizePainScore(painScore) {
  const numericPainScore = Number(painScore);
  return Number.isFinite(numericPainScore) ? numericPainScore : 0;
}

function normalizeRegion(region) {
  return REGION_OPTIONS.includes(region) ? region : "Indian";
}

function normalizeDietType(dietType) {
  return DIET_TYPE_OPTIONS.includes(dietType) ? dietType : "Veg";
}

function getPainTagsAndTip(painScore) {
  const normalizedPainScore = normalizePainScore(painScore);

  if (normalizedPainScore > 6) {
    return {
      extraTags: ["anti-inflammatory"],
      tip: "Higher pain days may feel better with anti-inflammatory foods like turmeric, ginger, and warm tea.",
    };
  }

  if (normalizedPainScore >= 4) {
    return {
      extraTags: ["balanced"],
      tip: "Moderate pain can pair well with balanced, steady meals that are easy to digest.",
    };
  }

  return {
    extraTags: ["normal"],
    tip: "Lower pain days are a good time to stay consistent with normal balanced meals.",
  };
}

function getBaseMeals(phase, region, dietType) {
  const normalizedPhase = normalizePhase(phase);
  const normalizedRegion = normalizeRegion(region);
  const normalizedDietType = normalizeDietType(dietType);
  const meals = PHASE_MEAL_LIBRARY[normalizedPhase] || [];

  const prioritizedGroups = [
    meals.filter((meal) => meal.region === normalizedRegion && meal.dietType === normalizedDietType),
    meals.filter((meal) => meal.dietType === normalizedDietType && meal.region !== normalizedRegion),
    meals.filter((meal) => meal.region === normalizedRegion && meal.dietType !== normalizedDietType),
    meals.filter((meal) => meal.region !== normalizedRegion && meal.dietType !== normalizedDietType),
  ];

  const uniqueMeals = [];
  const seenNames = new Set();

  for (const group of prioritizedGroups) {
    for (const meal of group) {
      if (!seenNames.has(meal.name)) {
        seenNames.add(meal.name);
        uniqueMeals.push(meal);
      }
    }
  }

  return uniqueMeals;
}

function getNutritionTip(phase) {
  switch (normalizePhase(phase)) {
    case "menstrual":
      return "Focus on iron-rich meals and hydration for support during menstrual days.";
    case "follicular":
      return "Fresh, lighter meals can feel especially good as energy starts rising.";
    case "ovulation":
      return "Protein-forward meals can help support steadier energy around ovulation.";
    case "luteal":
      return "Complex carbs and magnesium-rich ingredients can support cravings and energy shifts.";
    default:
      return "Balanced meals are a good place to start when phase data is limited.";
  }
}

function getMealSuggestions(phase, painScore, region, dietType) {
  const baseMeals = getBaseMeals(phase, region, dietType).slice(0, 5);
  const painAdjustment = getPainTagsAndTip(painScore);

  return {
    meals: baseMeals.map((meal) => ({
      name: meal.name,
      tags: [...new Set([...meal.tags, ...painAdjustment.extraTags])],
      reason: `${meal.reason} ${painAdjustment.tip}`,
    })),
    nutritionTip: getNutritionTip(phase),
  };
}

module.exports = {
  REGION_OPTIONS,
  DIET_TYPE_OPTIONS,
  getMealSuggestions,
};

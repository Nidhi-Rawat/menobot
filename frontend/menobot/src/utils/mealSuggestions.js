export const regionOptions = [
  { value: 'indian', label: 'Indian' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'asian', label: 'Asian' },
  { value: 'global', label: 'Global' },
]

export const dietTypeOptions = [
  { value: 'veg', label: 'Veg' },
  { value: 'non-veg', label: 'Non-Veg' },
]

const PHASE_MEAL_LIBRARY = {
  menstrual: [
    {
      name: 'Palak dal with lemon rice',
      region: 'indian',
      dietType: 'veg',
      tags: ['iron-rich'],
      reason: 'Spinach and lentils are iron-rich and especially supportive during menstrual days.',
    },
    {
      name: 'Chicken liver masala with roti',
      region: 'indian',
      dietType: 'non-veg',
      tags: ['iron-rich'],
      reason: 'A stronger iron-rich option when you want more direct replenishment support.',
    },
    {
      name: 'Lentil and beet grain bowl',
      region: 'global',
      dietType: 'veg',
      tags: ['iron-rich'],
      reason: 'Beets and lentils make a simple iron-focused meal when energy feels low.',
    },
    {
      name: 'Turkey spinach soup',
      region: 'global',
      dietType: 'non-veg',
      tags: ['iron-rich'],
      reason: 'A warm, easier meal that still supports iron intake and recovery.',
    },
  ],
  follicular: [
    {
      name: 'Paneer quinoa salad with herbs',
      region: 'indian',
      dietType: 'veg',
      tags: ['protein-rich', 'fresh'],
      reason: 'Protein and fresher ingredients pair well with the rebuilding energy of the follicular phase.',
    },
    {
      name: 'Tandoori chicken and cucumber bowl',
      region: 'indian',
      dietType: 'non-veg',
      tags: ['protein-rich', 'fresh'],
      reason: 'Keeps meals protein-forward while still feeling bright and light.',
    },
    {
      name: 'Greek yogurt fruit bowl',
      region: 'mediterranean',
      dietType: 'veg',
      tags: ['protein-rich', 'fresh'],
      reason: 'Balances protein with fresh fruit and seeds for a lighter but energizing meal.',
    },
    {
      name: 'Herbed fish with tomato salad',
      region: 'mediterranean',
      dietType: 'non-veg',
      tags: ['protein-rich', 'fresh'],
      reason: 'Supports the phase with lean protein and a fresh side.',
    },
  ],
  ovulation: [
    {
      name: 'Vegetable poha with sprouts',
      region: 'indian',
      dietType: 'veg',
      tags: ['light', 'fiber-rich'],
      reason: 'A lighter, fiber-friendly meal that still feels satisfying around ovulation.',
    },
    {
      name: 'Steamed fish with sauteed greens',
      region: 'asian',
      dietType: 'non-veg',
      tags: ['light', 'fiber-rich'],
      reason: 'Keeps the meal light while adding greens and easy digestion.',
    },
    {
      name: 'Hummus veggie plate',
      region: 'mediterranean',
      dietType: 'veg',
      tags: ['light', 'fiber-rich'],
      reason: 'Offers fiber-rich freshness without feeling too heavy.',
    },
    {
      name: 'Chicken lettuce wraps',
      region: 'asian',
      dietType: 'non-veg',
      tags: ['light', 'fiber-rich'],
      reason: 'A lighter protein option with crisp vegetables and less heaviness.',
    },
  ],
  luteal: [
    {
      name: 'Khichdi with pumpkin seeds',
      region: 'indian',
      dietType: 'veg',
      tags: ['complex-carbs', 'magnesium-rich'],
      reason: 'A comforting option with grounding carbs and magnesium-rich seed support.',
    },
    {
      name: 'Egg curry with brown rice',
      region: 'indian',
      dietType: 'non-veg',
      tags: ['complex-carbs', 'magnesium-rich'],
      reason: 'Supports luteal cravings with steady carbs and a protein-rich main.',
    },
    {
      name: 'Oats with almonds and banana',
      region: 'global',
      dietType: 'veg',
      tags: ['complex-carbs', 'magnesium-rich'],
      reason: 'A simple luteal meal that leans into magnesium-rich toppings and slower carbs.',
    },
    {
      name: 'Salmon with sweet potato mash',
      region: 'mediterranean',
      dietType: 'non-veg',
      tags: ['complex-carbs', 'magnesium-rich'],
      reason: 'Balances complex carbs with a richer main meal for steadier energy.',
    },
  ],
  default: [
    {
      name: 'Balanced vegetable grain bowl',
      region: 'global',
      dietType: 'veg',
      tags: ['balanced'],
      reason: 'A simple fallback meal when detailed cycle context is limited.',
    },
    {
      name: 'Grilled chicken with vegetables',
      region: 'global',
      dietType: 'non-veg',
      tags: ['balanced'],
      reason: 'A balanced fallback option with protein and vegetables.',
    },
  ],
}

const PAIN_ADJUSTMENTS = {
  high: {
    tags: ['anti-inflammatory'],
    reason:
      'Higher pain levels can benefit from anti-inflammatory ingredients like turmeric, ginger, and warm tea.',
  },
  medium: {
    tags: ['magnesium-rich'],
    reason:
      'Moderate pain can benefit from magnesium-rich ingredients like nuts and seeds for extra support.',
  },
}

function normalizePhase(phase) {
  return typeof phase === 'string' ? phase.trim().toLowerCase() : 'default'
}

function normalizeRegion(region) {
  return typeof region === 'string' ? region.trim().toLowerCase() : 'global'
}

function normalizeDietType(dietType) {
  return dietType === 'non-veg' ? 'non-veg' : 'veg'
}

function normalizePainScore(painScore) {
  const numericPainScore = Number(painScore)
  return Number.isFinite(numericPainScore) ? numericPainScore : 0
}

function getPainAdjustment(painScore) {
  const normalizedPainScore = normalizePainScore(painScore)

  if (normalizedPainScore >= 7) {
    return PAIN_ADJUSTMENTS.high
  }

  if (normalizedPainScore >= 4) {
    return PAIN_ADJUSTMENTS.medium
  }

  return null
}

function getBaseMeals(phase, region, dietType) {
  const normalizedPhase = normalizePhase(phase)
  const normalizedRegion = normalizeRegion(region)
  const normalizedDietType = normalizeDietType(dietType)
  const phaseMeals = PHASE_MEAL_LIBRARY[normalizedPhase] || PHASE_MEAL_LIBRARY.default

  const regionAndTypeMatches = phaseMeals.filter(
    (meal) => meal.region === normalizedRegion && meal.dietType === normalizedDietType,
  )

  if (regionAndTypeMatches.length) {
    return regionAndTypeMatches
  }

  const typeMatches = phaseMeals.filter((meal) => meal.dietType === normalizedDietType)
  if (typeMatches.length) {
    return typeMatches
  }

  return phaseMeals
}

export function getTags(phase, painScore, region, dietType) {
  const baseMeals = getBaseMeals(phase, region, dietType)
  const baseTags = baseMeals.flatMap((meal) => meal.tags)
  const adjustment = getPainAdjustment(painScore)

  return [...new Set([...baseTags, ...(adjustment?.tags || [])])]
}

export function getMealSuggestions(phase, painScore, region, dietType) {
  const baseMeals = getBaseMeals(phase, region, dietType)
  const adjustment = getPainAdjustment(painScore)

  return baseMeals.map((meal) => {
    if (!adjustment) {
      return meal
    }

    return {
      ...meal,
      tags: [...new Set([...meal.tags, ...adjustment.tags])],
      reason: `${meal.reason} ${adjustment.reason}`,
    }
  })
}

export const mealSuggestionMockData = {
  phase: 'luteal',
  painScore: 8,
  region: 'indian',
  dietType: 'veg',
}

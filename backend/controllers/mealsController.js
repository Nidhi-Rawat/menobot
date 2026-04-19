const { getLatestHealthEntryData } = require("./dataController");

const VALID_REGIONS = ["india", "us", "europe"];
const VALID_DIET_TYPES = ["veg", "nonveg"];

function parseJsonBlock(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\[[\s\S]*\]/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function normalizeMealSuggestions(payload) {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((meal) => ({
      name: typeof meal?.name === "string" ? meal.name.trim() : "",
      tags: Array.isArray(meal?.tags)
        ? meal.tags
            .map((tag) => String(tag).trim().toLowerCase())
            .filter(Boolean)
            .slice(0, 3)
        : [],
      benefit: typeof meal?.benefit === "string" ? meal.benefit.trim() : "",
    }))
    .filter((meal) => meal.name && meal.benefit)
    .slice(0, 4);
}

async function createMealSuggestions(req, res) {
  try {
    console.log("Received:", req.body);

    const latestData = await getLatestHealthEntryData();
    const phase = String(req.body?.phase || latestData?.phase || "").trim();
    const painScore = Number(req.body?.painScore ?? latestData?.painScore);
    const region = String(req.body?.region || "").toLowerCase().trim();
    const dietType = String(req.body?.dietType || "").toLowerCase().trim();

    if (!phase) {
      return res.status(400).json({ message: "phase is required" });
    }

    if (!Number.isFinite(painScore)) {
      return res.status(400).json({ message: "painScore must be a valid number" });
    }

    if (!VALID_REGIONS.includes(region)) {
      return res.status(400).json({ error: "region must be a valid option" });
    }

    if (!VALID_DIET_TYPES.includes(dietType)) {
      return res.status(400).json({ error: "dietType must be a valid option" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY is not configured" });
    }

    const prompt = [
      `Suggest 4 healthy ${dietType} meals for a person in ${phase} phase with pain score ${painScore} in ${region}.`,
      "Focus on anti-inflammatory and magnesium-rich foods when relevant.",
      'Return strict JSON only as an array of objects with keys: name, tags, benefit.',
      'Example: [{"name":"Khichdi with pumpkin seeds","tags":["magnesium-rich","anti-inflammatory"],"benefit":"Helps reduce cramps and supports digestion"}]',
      "Keep meal names short and benefits to one concise line each.",
    ].join(" ");

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "You generate personalized meal suggestions. Output valid JSON only with no markdown and no extra text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const completion = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(502).json({
        message: completion?.error?.message || "Unable to fetch meals, try again",
      });
    }

    const content = completion?.choices?.[0]?.message?.content || "";
    const parsedMeals = parseJsonBlock(content);
    const meals = normalizeMealSuggestions(parsedMeals);

    if (meals.length === 0) {
      return res.status(502).json({ message: "Unable to fetch meals, try again" });
    }

    return res.status(200).json({
      region,
      dietType,
      phase,
      painScore,
      meals,
      nutritionTip: `Personalized meals for your ${phase} phase with a pain score of ${painScore}.`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch meals, try again" });
  }
}

module.exports = { createMealSuggestions };

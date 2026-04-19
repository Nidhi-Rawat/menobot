const calculatePain = require("../utils/calculatePain");
const detectPhase = require("../utils/detectPhase");
const { getLatestHealthEntry } = require("./dataController");

const getPainLabel = (painScore) => {
  if (painScore >= 7) return "high";
  if (painScore >= 4) return "medium";
  return "low";
};

const createChatResponse = async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const userData = await getLatestHealthEntry();

    if (!userData) {
      return res.status(400).json({
        message: "No health data found. Please save your latest symptoms before using chat.",
      });
    }

    const { painScore, category } = calculatePain({
      cramps: userData.cramps,
      mood: userData.mood,
      fatigue: userData.fatigue,
      flow: userData.flow,
    });

    const phase = detectPhase(userData.lastPeriod, userData.cycles);

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY is not configured" });
    }

    const painLabel = getPainLabel(painScore);
    const prompt = [
      `The user is currently in the ${phase.toLowerCase()} phase.`,
      `Their calculated pain score is ${painScore}/10, which is ${painLabel} (${category.toLowerCase()}).`,
      `Latest symptom ratings: cramps ${userData.cramps}/5, mood ${userData.mood}/5, fatigue ${userData.fatigue}/5, flow ${userData.flow}/5.`,
      `The user's question is: ${message}`,
      "Respond in a soft, supportive, practical tone and personalize the answer using this health data when it is relevant.",
    ].join(" ");

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a kind period wellness assistant. Keep responses short, gentle, practical, and clearly tailored to the user's latest health data.",
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
        message: completion?.error?.message || "Failed to get response from Groq",
      });
    }

    const responseText = completion?.choices?.[0]?.message?.content?.trim() || "";

    return res.status(200).json({
      prompt,
      response: responseText,
      context: {
        painScore,
        phase,
        category,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createChatResponse };

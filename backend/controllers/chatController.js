const { getLatestHealthEntryData } = require("./dataController");

function getPainLabel(painScore) {
  if (painScore >= 7) return "high";
  if (painScore >= 4) return "medium";
  return "low";
}

function buildFallbackReply(message, latestData) {
  const messageValue = message.toLowerCase();
  const painLabel = getPainLabel(latestData.painScore);
  const phase = latestData.phase?.toLowerCase() || "current";

  if (messageValue.includes("eat") || messageValue.includes("food") || messageValue.includes("meal")) {
    return `Your pain is ${painLabel} today and you're in the ${phase} phase, so focus on anti-inflammatory, steady meals with magnesium-rich ingredients and warm hydration.`;
  }

  if (messageValue.includes("pain") || messageValue.includes("cramps")) {
    return `Your pain is ${painLabel} today. Since you're in the ${phase} phase, try warmth, hydration, lighter movement, and anti-inflammatory foods to stay supported.`;
  }

  if (messageValue.includes("mood") || messageValue.includes("stress") || messageValue.includes("anx")) {
    return `Since you're in the ${phase} phase with mood at ${latestData.mood}/5, keep routines calming today with rest breaks, protein-rich meals, and gentle movement.`;
  }

  return `You're in the ${phase} phase today with a pain score of ${latestData.painScore}/10. Focus on calm routines, steady meals, hydration, and supportive rest based on how your body feels.`;
}

const createChatResponse = async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const userData = await getLatestHealthEntryData();

    if (!userData) {
      return res.status(400).json({
        message: "No health data found. Please save your latest symptoms before using chat.",
      });
    }

    const healthContext = {
      phase: req.body?.phase || userData.phase,
      painScore: Number(req.body?.painScore ?? userData.painScore),
      mood: Number(req.body?.mood ?? userData.mood),
      fatigue: Number(req.body?.fatigue ?? userData.fatigue),
      flow: Number(req.body?.flow ?? userData.flow),
      cramps: Number(req.body?.cramps ?? userData.cramps),
      category: userData.category,
    };

    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        response: buildFallbackReply(message, healthContext),
        context: healthContext,
      });
    }

    const painLabel = getPainLabel(healthContext.painScore);
    const prompt = [
      `The user is currently in the ${String(healthContext.phase).toLowerCase()} phase.`,
      `Their pain score is ${healthContext.painScore}/10, which is ${painLabel} (${String(
        healthContext.category
      ).toLowerCase()}).`,
      `Latest symptom ratings: cramps ${healthContext.cramps}/5, mood ${healthContext.mood}/5, fatigue ${healthContext.fatigue}/5, flow ${healthContext.flow}/5.`,
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
      context: healthContext,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createChatResponse };

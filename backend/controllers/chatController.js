const getPainLabel = (painScore) => {
  if (painScore >= 7) return "high";
  if (painScore >= 4) return "medium";
  return "low";
};

const createChatResponse = async (req, res) => {
  try {
    const { phase, painScore, mood } = req.body;
    const parsedPainScore = Number(painScore);
    const parsedMood = Number(mood);

    if (typeof phase !== "string" || !Number.isFinite(parsedPainScore) || !Number.isFinite(parsedMood)) {
      return res.status(400).json({
        message: "phase (string), painScore (number), and mood (number) are required",
      });
    }

    if (parsedPainScore < 0 || parsedPainScore > 10 || parsedMood < 0 || parsedMood > 10) {
      return res.status(400).json({
        message: "painScore and mood must be between 0 and 10",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY is not configured" });
    }

    const painLabel = getPainLabel(parsedPainScore);
    const prompt = `User is in ${phase.toLowerCase()} phase with ${painLabel} pain. Respond in a soft tone.`;

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
              "You are a kind period wellness assistant. Keep responses short, gentle, and practical.",
          },
          {
            role: "user",
            content: `${prompt} Mood score is ${parsedMood}/10.`,
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
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createChatResponse };

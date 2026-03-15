const express = require("express");
const Anthropic = require("@anthropic-ai/sdk").default;
const { buildPrompt } = require("./buildPrompt");

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

router.post("/generate", async (req, res) => {
  try {
    const { skills, building_blocks, proficiency_level } = req.body;

    if (!skills?.length || !building_blocks?.length || !proficiency_level) {
      return res.status(400).json({ error: "Missing required selections." });
    }

    const { systemPrompt, userMessage } = buildPrompt({
      skills,
      building_blocks,
      proficiency_level,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0].text;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Claude response was not valid JSON.");
      }
    }

    res.json(parsed);
  } catch (err) {
    console.error("Generation error:", err);
    const status = err.status || 500;
    res.status(status).json({
      error: err.message || "An error occurred during generation.",
    });
  }
});

module.exports = router;

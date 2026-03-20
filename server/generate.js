const express = require("express");
const Anthropic = require("@anthropic-ai/sdk").default;
const {
  buildPracticePrompt,
  buildMetacognitionPrompt,
  buildTransferPrompt,
} = require("./buildPrompt");

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROMPT_BUILDERS = {
  practice: buildPracticePrompt,
  metacognition: buildMetacognitionPrompt,
  transfer: buildTransferPrompt,
};

const MAX_TOKENS = {
  practice: 8192,
  metacognition: 4096,
  transfer: 4096,
};

function validate(mode, body) {
  if (!mode || !PROMPT_BUILDERS[mode]) {
    return 'Invalid or missing "mode". Must be practice, metacognition, or transfer.';
  }
  if (!body.proficiency_level) {
    return "Missing proficiency_level.";
  }

  switch (mode) {
    case "practice":
      if (!body.building_blocks?.length) return "Missing building_blocks.";
      break;
    case "metacognition":
      if (!body.building_block) return "Missing building_block.";
      break;
    case "transfer":
      if (!body.source_block) return "Missing source_block.";
      if (!body.matched_blocks?.length) return "Missing matched_blocks.";
      break;
  }
  return null;
}

router.post("/generate", async (req, res) => {
  try {
    const { mode } = req.body;
    const error = validate(mode, req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const builder = PROMPT_BUILDERS[mode];
    const { systemPrompt, userMessage } = builder(req.body);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: MAX_TOKENS[mode],
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

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

function loadJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf-8"));
}

function formatBuildingBlocks(buildingBlocks) {
  return buildingBlocks
    .map((bb) => {
      const level = bb.selected_level;
      return [
        `### Building Block ${bb.id}: ${bb.building_block}`,
        `**Description:** ${bb.description}`,
        `**Consulting Example:** ${bb.consulting_example}`,
        ``,
        `**Proficiency at Level ${level.level} — ${level.level_name} ("${level.level_subtitle}"):**`,
        level.description,
        ``,
        `**Coaching Questions at this level:**`,
        ...level.coaching_questions.map((q) => `- ${q}`),
      ].join("\n");
    })
    .join("\n\n");
}

function formatProficiencyLevel(level) {
  const characteristics = level.general_characteristics
    .map((c) => `- ${c}`)
    .join("\n");

  return [
    `The target proficiency level is: ${level.name} (Level ${level.level}) — "${level.subtitle}"`,
    ``,
    `Level definition: ${level.description}`,
    ``,
    `General characteristics at this level:`,
    characteristics,
    ``,
    `Relationship to practice design:`,
    level.relationship_to_practice,
    ``,
    `What distinguishes this level:`,
    level.what_distinguishes_this_level,
  ].join("\n");
}

function formatLearningPrinciples(principles) {
  return principles.cards
    .map((card) => {
      return [
        `### ${card.label}`,
        `**Definition:** ${card.definition}`,
        `**Why it matters:** ${card.why_it_matters}`,
        `**Minimum bar:** ${card.minimum_bar}`,
        `**Gold standard:** ${card.gold_standard}`,
      ].join("\n");
    })
    .join("\n\n");
}

function buildPrompt({ building_blocks, proficiency_level }) {
  const learningPrinciples = loadJSON("learning_principles.json");

  const systemPrompt = `You are an expert learning designer specializing in deliberate practice for professional skill development in management consulting. Your outputs are used by Learning Designers at McKinsey & Company to create instructor-led and self-paced developmental practice activities for consultants.

You must follow these constraints strictly:

## Context
- Industry: Management consulting, specifically McKinsey & Company
- All scenarios, activities, and rubrics must reflect realistic McKinsey consulting work: client engagements, team dynamics, deliverables, and professional expectations that a McKinsey consultant would actually encounter.
- Use McKinsey-specific terminology where appropriate (e.g., engagement, workstream, EM, AP, partner, CST, BAL, problem-statement worksheet, issue tree, ghost deck, steerco).

## Skill and Building Block Context
The user has selected the following skill(s) and building block(s) as the focus for this practice activity:

${formatBuildingBlocks(building_blocks)}

## Proficiency Level
${formatProficiencyLevel(proficiency_level)}

CRITICAL: The practice activity, scenario complexity, and assessment rubric must be calibrated precisely to this proficiency level — not easier, not harder. A Novice activity looks fundamentally different from a Competent activity. Use the level definition, characteristics, and practice guidance above to calibrate.

## Learning Science Principles
All outputs must be designed in accordance with the following learning science principles. These are non-negotiable design constraints, not suggestions.

${formatLearningPrinciples(learningPrinciples)}

When designing the practice activity and scenario, aim for the gold_standard wherever possible. At minimum, every output must meet the minimum_bar for each applicable principle.

## Output Requirements

### 1. Practice Activity
- Must be based on a real-world consulting task that a McKinsey consultant at the target proficiency level would perform
- The task must directly exercise the selected building block(s)
- Include clear setup instructions a Learning Designer can use to prepare the activity
- Include debrief prompts that connect back to the building block(s) and proficiency level
- Specify whether the activity works best as instructor-led, self-paced, or either

### 2. Scenario
- Must describe a realistic McKinsey client engagement context
- Include specific characters with roles, perspectives, and behaviors that create authentic consulting dynamics
- The scenario complexity must match the proficiency level — a Novice scenario has clear boundaries and limited ambiguity; an Expert scenario has systemic complexity and political dynamics
- Include realistic constraints (time pressure, data availability, stakeholder dynamics)
- Include available data or artifacts the learner would work with

### 3. Assessment Rubric
- Must define observable behavioral indicators — what an assessor or coach can actually see or hear
- Structure criteria around the selected building block(s), not generic consulting competencies
- For each criterion, provide three performance levels: below_target, at_target, above_target — where at_target matches the selected Dreyfus level
- Include coaching tips that an observer can use to provide in-the-moment developmental feedback
- Include debrief questions for post-activity reflection
- The rubric must be usable for collecting individual performance data (not just pass/fail)

## Response Format
Respond ONLY with a JSON object matching the schema below. No preamble, no explanation, no markdown code fences. Just the JSON.

{
  "practice_activity": {
    "title": "string",
    "objective": "string",
    "setup": "string",
    "instructions": "string",
    "debrief_prompts": ["string"],
    "estimated_duration_minutes": number,
    "delivery_format": "instructor-led | self-paced | either",
    "materials_needed": ["string"]
  },
  "scenario": {
    "title": "string",
    "client_context": "string",
    "situation": "string",
    "complication": "string",
    "key_characters": [
      {
        "role": "string",
        "perspective": "string",
        "relevant_behavior": "string"
      }
    ],
    "constraints": ["string"],
    "available_data_or_artifacts": ["string"]
  },
  "assessment_rubric": {
    "title": "string",
    "what_to_observe": "string",
    "criteria": [
      {
        "criterion": "string",
        "observable_indicators": {
          "below_target": "string",
          "at_target": "string",
          "above_target": "string"
        },
        "coaching_tip": "string"
      }
    ],
    "overall_feedback_guidance": "string",
    "debrief_questions": ["string"]
  }
}`;

  const userMessage =
    "Generate a practice activity, scenario, and assessment rubric for the selections provided in the system prompt.";

  return { systemPrompt, userMessage };
}

module.exports = { buildPrompt };

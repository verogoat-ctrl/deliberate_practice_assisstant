const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

function loadJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf-8"));
}

/* ── shared formatters ── */

function formatBuildingBlock(bb) {
  const level = bb.selected_level;
  const lines = [
    `### Building Block ${bb.id}: ${bb.building_block}`,
    `**Description:** ${bb.description}`,
    `**Core Cognitive Mechanisms:** ${bb.main_cognitive_mechanisms}`,
    ``,
    `**Current Proficiency — Level ${level.level} (${level.level_name}):**`,
    ``,
    `**Observable Markers:**`,
    ...level.markers.map((m) => `- ${m}`),
    ``,
    `**Common Failure Modes:**`,
    ...level.failure_modes.map((f) => `- ${f}`),
    ``,
    `**Diagnostic Questions:**`,
    ...level.diagnostic_questions.map((q) => `- ${q}`),
    ``,
    `**Coaching Questions:**`,
    ...level.coaching_questions.map((q) => `- ${q}`),
  ];

  if (bb.next_level) {
    const next = bb.next_level;
    lines.push(
      ``,
      `**Next Level — Level ${next.level} (${next.level_name}):**`,
      ``,
      `**Observable Markers at next level:**`,
      ...next.markers.map((m) => `- ${m}`),
      ``,
      `**Common Failure Modes at next level:**`,
      ...next.failure_modes.map((f) => `- ${f}`)
    );
  }

  return lines.join("\n");
}

function formatBuildingBlocks(buildingBlocks) {
  return buildingBlocks.map(formatBuildingBlock).join("\n\n");
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

function mcKinseyContext() {
  return `## Context
- Industry: Management consulting, specifically McKinsey & Company
- All outputs must reflect realistic McKinsey consulting work: client engagements, team dynamics, deliverables, and professional expectations that a McKinsey consultant would actually encounter.
- Use McKinsey-specific terminology where appropriate (e.g., engagement, workstream, EM, AP, partner, CST, BAL, problem-statement worksheet, issue tree, ghost deck, steerco).`;
}

/* ── Mode 1: Practice ── */

function buildPracticePrompt({ building_blocks, proficiency_level }) {
  const learningPrinciples = loadJSON("learning_principles.json");

  const systemPrompt = `You are an expert learning designer specializing in deliberate practice for professional skill development in management consulting. Your outputs are used by Learning Designers at McKinsey & Company to create instructor-led and self-paced developmental practice activities for consultants.

You must follow these constraints strictly:

${mcKinseyContext()}

## Skill and Building Block Context
The user has selected the following building block(s) as the focus for this practice activity. For each block, you are given the current proficiency level markers and failure modes, AND the next level's markers and failure modes to define the growth gap.

${formatBuildingBlocks(building_blocks)}

## Proficiency Level
${formatProficiencyLevel(proficiency_level)}

CRITICAL: The practice activity, scenario complexity, and assessment rubric must be calibrated precisely to this proficiency level — not easier, not harder. A Novice activity looks fundamentally different from a Competent activity.

## Learning Science Principles
All outputs must be designed in accordance with the following learning science principles. These are non-negotiable design constraints, not suggestions.

${formatLearningPrinciples(learningPrinciples)}

When designing the practice activity and scenario, aim for the gold_standard wherever possible. At minimum, every output must meet the minimum_bar for each applicable principle.

## Output Requirements

### 1. Case Skeleton
Generate the abstract challenge variables that define what makes a practice activity meaningfully difficult for deepening expertise at the target proficiency level. Do not reference specific consulting domains, industries, or deliverables — describe the challenge in domain-agnostic terms.

The skeleton must include these five categories:
- **problem_type**: The abstract cognitive challenge type the learner faces (e.g., ill-structured problem, diagnosis under ambiguity, optimization with trade-offs). Do not reference a specific domain or industry.
- **information_characteristics**: The abstract properties of information the learner must work with: volume, ambiguity, signal-to-noise ratio, degree of pre-structuring, completeness, and contradictions. Calibrate to the proficiency level. Do not reference specific data sources or industries.
- **cognitive_demand**: The core thinking acts the challenge requires, directly tied to the selected building block's cognitive mechanisms. Keep it abstract — no domain-specific deliverables.
- **complexity_dimensions**: The abstract complexity factors that make this challenge meaningful for the target proficiency level. No domain-specific examples.
- **situational_constraints**: Abstract environmental pressures and limitations (e.g., time pressure, incomplete access, competing priorities, stakeholder dynamics) calibrated to the proficiency level. No domain-specific context.

### 2. Proficiency Gap
For each selected building block, describe the gap between the learner's current proficiency level and the next level. Compare the current level's observable markers and failure modes with the next level's markers to articulate what specific shifts in thinking, behavior, or judgment the learner must develop. Each gap description should be concrete and actionable — a Learning Designer should be able to read it and understand exactly what growth looks like.

If the selected level is Level 5 (Expert), OMIT this section entirely from the response.

### 3. Practice Activity
- Must be based on a real-world consulting task that a McKinsey consultant at the target proficiency level would perform
- The task must directly exercise the selected building block(s)
- Include clear setup instructions a Learning Designer can use to prepare the activity
- Include debrief prompts that connect back to the building block(s) and proficiency level
- Specify whether the activity works best as instructor-led, self-paced, or either

### 4. Scenario
Provide a short, high-level scenario that describes the consulting context in which these building blocks can be practiced in a formal learning program. Keep it brief — just enough context for a Learning Designer to understand the setting. Include a list of available data and artifacts (documents, datasets, reports, etc.) that the learner would have access to during the activity.

### 5. Assessment Rubric
- Must define observable behavioral indicators — what an assessor or coach can actually see or hear
- Structure criteria around the selected building block(s), not generic consulting competencies
- For each criterion, provide three performance levels: below_target, at_target, above_target — where at_target matches the selected Dreyfus level
- Include coaching tips for in-the-moment developmental feedback
- Include debrief questions for post-activity reflection
- Rubric criteria should be calibrated to reflect the complexity and demands described in the case skeleton

## Response Format
Respond ONLY with a JSON object matching the schema below. No preamble, no explanation, no markdown code fences. Just the JSON.

{
  "case_skeleton": {
    "problem_type": "string",
    "information_characteristics": ["string"],
    "cognitive_demand": "string",
    "complexity_dimensions": ["string"],
    "situational_constraints": ["string"]
  },
  "proficiency_gap": [
    {
      "building_block_id": "string",
      "building_block_name": "string",
      "current_level": number,
      "next_level": number,
      "gap_description": "string"
    }
  ],
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
    "context": "string",
    "complication": "string",
    "available_data_artifacts": ["string"]
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
    "Generate practice goals, a case skeleton, a practice activity, a scenario, and an assessment rubric for the selections provided in the system prompt.";

  return { systemPrompt, userMessage };
}

/* ── Mode 2: Metacognition ── */

function buildMetacognitionPrompt({ building_block, proficiency_level }) {
  const systemPrompt = `You are an expert in metacognition, cognitive science, and professional development for management consultants. Your outputs are used by Learning Designers at McKinsey & Company to create materials that help consultants develop self-awareness about their cognitive processes.

You must follow these constraints strictly:

${mcKinseyContext()}

## Building Block Context
The user has selected the following building block as the focus for metacognition questions:

${formatBuildingBlock(building_block)}

## Proficiency Level
${formatProficiencyLevel(proficiency_level)}

## Task
Generate three categories of questions that help a consultant at this proficiency level surface, examine, and improve their cognitive processes related to this building block.

### 1. Self-Assessment Questions
Questions the learner asks themselves to evaluate their own performance on this building block. These should help the learner honestly gauge where they are in their development, identify specific strengths and gaps, and recognize patterns in their own thinking. The questions should be calibrated to what someone at this Dreyfus level can realistically self-observe.

### 2. Reflection Questions
Questions that deepen the learner's understanding of their own cognitive process — how they think, not just what they think. These should surface the mental models, heuristics, assumptions, and reasoning patterns the learner uses when exercising this building block. They should prompt genuine insight, not surface-level answers.

### 3. Coaching Questions
Questions a coach, manager, or peer could ask the learner to facilitate their development on this building block. These should be open-ended, non-judgmental, and designed to help the learner see blind spots, challenge assumptions, and consider alternative approaches. Calibrate to the proficiency level — coaching a Novice looks different from coaching a Proficient practitioner.

## Response Format
Respond ONLY with a JSON object matching the schema below. No preamble, no explanation, no markdown code fences. Just the JSON.

{
  "self_assessment_questions": ["string"],
  "reflection_questions": ["string"],
  "coaching_questions": ["string"]
}`;

  const userMessage =
    "Generate metacognition questions (self-assessment, reflection, and coaching) for the selected building block and proficiency level.";

  return { systemPrompt, userMessage };
}

/* ── Mode 3: Transfer ── */

function buildTransferPrompt({ source_block, matched_blocks, proficiency_level }) {
  const matchedSection = matched_blocks
    .map((mb) => {
      return [
        `### Target Block ${mb.id}: ${mb.building_block}`,
        `**Description:** ${mb.description}`,
        `**Cognitive Mechanisms:** ${mb.main_cognitive_mechanisms}`,
        `**Shared Mechanisms with Source:** ${mb.shared_mechanisms.join(", ")}`,
      ].join("\n");
    })
    .join("\n\n");

  const systemPrompt = `You are an expert in learning transfer, cognitive science, and professional skill development for management consultants. Your outputs are used by Learning Designers at McKinsey & Company to help consultants transfer skills across domains.

You must follow these constraints strictly:

${mcKinseyContext()}

## Source Building Block
The learner has developed the following building block and wants to transfer its underlying cognitive skills to related building blocks:

${formatBuildingBlock(source_block)}

## Proficiency Level
${formatProficiencyLevel(proficiency_level)}

## Target Building Blocks (share cognitive mechanisms with source)
The following building blocks share one or more cognitive mechanisms with the source block. For each, the shared mechanisms are listed.

${matchedSection}

## Task
For each target building block, generate a transfer activity that helps the learner apply the cognitive mechanisms they have developed in the source building block to the target building block. The activity should:
- Explicitly connect the shared cognitive mechanisms between source and target
- Be calibrated to the selected proficiency level
- Be realistic for a McKinsey consulting context
- Include a clear rationale explaining why this transfer is possible and how the shared mechanisms enable it

Also provide an overall summary of the shared cognitive mechanisms that connect these building blocks and why transfer between them is feasible.

## Response Format
Respond ONLY with a JSON object matching the schema below. No preamble, no explanation, no markdown code fences. Just the JSON.

{
  "shared_mechanisms_summary": "string",
  "transfer_activities": [
    {
      "target_block_id": "string",
      "target_block_name": "string",
      "shared_mechanisms": ["string"],
      "activity": "string",
      "rationale": "string"
    }
  ]
}`;

  const userMessage =
    "Generate transfer activities that help the learner apply cognitive mechanisms from the source building block to each target building block.";

  return { systemPrompt, userMessage };
}

module.exports = { buildPracticePrompt, buildMetacognitionPrompt, buildTransferPrompt };

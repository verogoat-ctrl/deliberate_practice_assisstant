import { useState } from "react";

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CopyButtons({ jsonData, textData, label }) {
  const [copied, setCopied] = useState(null);

  async function copy(content, type) {
    await navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => copy(JSON.stringify(jsonData, null, 2), "json")}
        className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
      >
        {copied === "json" ? "Copied!" : "Copy JSON"}
      </button>
      <button
        onClick={() => copy(textData, "text")}
        className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
      >
        {copied === "text" ? "Copied!" : "Copy as Text"}
      </button>
    </div>
  );
}

function Section({ title, defaultOpen = true, children, jsonData, textData }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-3">
          {open && (
            <span onClick={(e) => e.stopPropagation()}>
              <CopyButtons jsonData={jsonData} textData={textData} />
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mt-3">
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </dt>
      <dd className="text-sm text-gray-700 leading-relaxed">{children}</dd>
    </div>
  );
}

function List({ items }) {
  return (
    <ul className="list-disc list-inside space-y-0.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-gray-700">
          {typeof item === "string" ? item : JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
}

function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-gray-100 text-gray-600",
    accent: "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
  };
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function practiceToText(pa) {
  return [
    `PRACTICE ACTIVITY: ${pa.title}`,
    `\nObjective: ${pa.objective}`,
    `\nSetup:\n${pa.setup}`,
    `\nInstructions:\n${pa.instructions}`,
    `\nDebrief Prompts:\n${pa.debrief_prompts.map((p) => `  - ${p}`).join("\n")}`,
    `\nEstimated Duration: ${pa.estimated_duration_minutes} minutes`,
    `Delivery Format: ${pa.delivery_format}`,
    `\nMaterials Needed:\n${pa.materials_needed.map((m) => `  - ${m}`).join("\n")}`,
  ].join("\n");
}

function scenarioToText(sc) {
  return [
    `SCENARIO: ${sc.title}`,
    `\nClient Context: ${sc.client_context}`,
    `\nSituation: ${sc.situation}`,
    `\nComplication: ${sc.complication}`,
    `\nKey Characters:`,
    ...sc.key_characters.map(
      (c) =>
        `  - ${c.role}: ${c.perspective} (Behavior: ${c.relevant_behavior})`
    ),
    `\nConstraints:\n${sc.constraints.map((c) => `  - ${c}`).join("\n")}`,
    `\nAvailable Data/Artifacts:\n${sc.available_data_or_artifacts.map((a) => `  - ${a}`).join("\n")}`,
  ].join("\n");
}

function rubricToText(ar) {
  return [
    `ASSESSMENT RUBRIC: ${ar.title}`,
    `\nWhat to Observe: ${ar.what_to_observe}`,
    `\nCriteria:`,
    ...ar.criteria.map(
      (c) =>
        `\n  ${c.criterion}\n    Below Target: ${c.observable_indicators.below_target}\n    At Target: ${c.observable_indicators.at_target}\n    Above Target: ${c.observable_indicators.above_target}\n    Coaching Tip: ${c.coaching_tip}`
    ),
    `\nOverall Feedback Guidance: ${ar.overall_feedback_guidance}`,
    `\nDebrief Questions:\n${ar.debrief_questions.map((q) => `  - ${q}`).join("\n")}`,
  ].join("\n");
}

function PracticeActivityView({ data }) {
  return (
    <dl>
      <Field label="Objective">{data.objective}</Field>
      <Field label="Setup">
        <p className="whitespace-pre-line">{data.setup}</p>
      </Field>
      <Field label="Instructions">
        <p className="whitespace-pre-line">{data.instructions}</p>
      </Field>
      <Field label="Debrief Prompts">
        <List items={data.debrief_prompts} />
      </Field>
      <div className="flex gap-3 mt-3">
        <Badge variant="accent">
          {data.estimated_duration_minutes} min
        </Badge>
        <Badge>{data.delivery_format}</Badge>
      </div>
      <Field label="Materials Needed">
        <List items={data.materials_needed} />
      </Field>
    </dl>
  );
}

function ScenarioView({ data }) {
  return (
    <dl>
      <Field label="Client Context">{data.client_context}</Field>
      <Field label="Situation">
        <p className="whitespace-pre-line">{data.situation}</p>
      </Field>
      <Field label="Complication">
        <p className="whitespace-pre-line">{data.complication}</p>
      </Field>
      <Field label="Key Characters">
        <div className="space-y-2 mt-1">
          {data.key_characters.map((char, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-semibold text-gray-800">{char.role}</p>
              <p className="text-gray-600 mt-0.5">
                <span className="text-gray-400">Perspective:</span>{" "}
                {char.perspective}
              </p>
              <p className="text-gray-600 mt-0.5">
                <span className="text-gray-400">Behavior:</span>{" "}
                {char.relevant_behavior}
              </p>
            </div>
          ))}
        </div>
      </Field>
      <Field label="Constraints">
        <List items={data.constraints} />
      </Field>
      <Field label="Available Data / Artifacts">
        <List items={data.available_data_or_artifacts} />
      </Field>
    </dl>
  );
}

function RubricView({ data }) {
  return (
    <dl>
      <Field label="What to Observe">{data.what_to_observe}</Field>
      <Field label="Criteria">
        <div className="space-y-4 mt-2">
          {data.criteria.map((c, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-2 font-semibold text-sm text-gray-800">
                {c.criterion}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-red-400 uppercase mb-1">
                    Below Target
                  </p>
                  <p className="text-sm text-gray-600">
                    {c.observable_indicators.below_target}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-[var(--color-accent)] uppercase mb-1">
                    At Target
                  </p>
                  <p className="text-sm text-gray-600">
                    {c.observable_indicators.at_target}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-green-500 uppercase mb-1">
                    Above Target
                  </p>
                  <p className="text-sm text-gray-600">
                    {c.observable_indicators.above_target}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 bg-amber-50 border-t border-gray-100">
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">Coaching tip:</span>{" "}
                  {c.coaching_tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Field>
      <Field label="Overall Feedback Guidance">
        <p className="whitespace-pre-line">{data.overall_feedback_guidance}</p>
      </Field>
      <Field label="Debrief Questions">
        <List items={data.debrief_questions} />
      </Field>
    </dl>
  );
}

export default function OutputDisplay({ result }) {
  if (!result) return null;

  const { practice_activity, scenario, assessment_rubric } = result;

  return (
    <div className="space-y-4">
      <Section
        title={`Practice Activity — ${practice_activity.title}`}
        jsonData={practice_activity}
        textData={practiceToText(practice_activity)}
      >
        <PracticeActivityView data={practice_activity} />
      </Section>

      <Section
        title={`Scenario — ${scenario.title}`}
        jsonData={scenario}
        textData={scenarioToText(scenario)}
      >
        <ScenarioView data={scenario} />
      </Section>

      <Section
        title={`Assessment Rubric — ${assessment_rubric.title}`}
        jsonData={assessment_rubric}
        textData={rubricToText(assessment_rubric)}
      >
        <RubricView data={assessment_rubric} />
      </Section>
    </div>
  );
}

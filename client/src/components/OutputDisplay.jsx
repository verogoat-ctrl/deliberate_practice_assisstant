import { useState } from "react";
import styled from "@emotion/styled";
import {
  Badge,
  Button,
  Typography,
  List as MdsList,
  ListItem,
} from "@mds/mds-reactjs-library";

/* ── styled helpers ── */

const SectionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const SectionTitle = styled.div`
  background: #f9fafb;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 0.9375rem;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
`;

const SubSectionTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  padding: 12px 0 4px;
  margin-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

const CopyRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const FieldWrap = styled.div`
  margin-top: 12px;
`;

const FieldLabel = styled.dt`
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
`;

const FieldValue = styled.dd`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
`;


const CriterionCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const CriterionHeader = styled.div`
  background: #f9fafb;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
`;

const RubricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const RubricCell = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #f3f4f6;
  @media (min-width: 768px) {
    border-top: none;
    &:not(:first-of-type) {
      border-left: 1px solid #f3f4f6;
    }
  }
`;

const RubricLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
  color: ${(props) => props.color || "#6b7280"};
`;

const CoachingTip = styled.div`
  padding: 8px 16px;
  background: #fffbeb;
  border-top: 1px solid #f3f4f6;
  font-size: 0.75rem;
  color: #92400e;
`;

const CriteriaStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
`;


const TransferCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;

const TransferTarget = styled.p`
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 8px;
`;

const MechBadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
`;

const QuestionCard = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
`;

/* ── copy helpers ── */

function CopyButtons({ jsonData, textData }) {
  const [copied, setCopied] = useState(null);

  async function copy(content, type) {
    await navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <CopyRow>
      <Button
        appearance="tertiary"
        size="sm"
        onClick={() => copy(JSON.stringify(jsonData, null, 2), "json")}
      >
        {copied === "json" ? "Copied!" : "Copy JSON"}
      </Button>
      <Button
        appearance="tertiary"
        size="sm"
        onClick={() => copy(textData, "text")}
      >
        {copied === "text" ? "Copied!" : "Copy as Text"}
      </Button>
    </CopyRow>
  );
}

/* ── shared components ── */

function Field({ label, children }) {
  return (
    <FieldWrap>
      <FieldLabel>{label}</FieldLabel>
      <FieldValue>{children}</FieldValue>
    </FieldWrap>
  );
}

const StyledList = styled(MdsList)`
  font-size: 0.875rem;
  line-height: 1.6;

  li,
  li > * {
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;

function BulletList({ items }) {
  return (
    <StyledList ordered={false} indented>
      {items.map((item, i) => (
        <ListItem key={i}>
          {typeof item === "string" ? item : JSON.stringify(item)}
        </ListItem>
      ))}
    </StyledList>
  );
}

/* ── text serializers ── */

function skeletonToText(sk) {
  return [
    "CASE SKELETON",
    `\nProblem Type: ${sk.problem_type}`,
    `\nInformation Characteristics:\n${sk.information_characteristics.map((c) => `  - ${c}`).join("\n")}`,
    `\nCognitive Demand: ${sk.cognitive_demand}`,
    `\nComplexity Dimensions:\n${sk.complexity_dimensions.map((d) => `  - ${d}`).join("\n")}`,
    `\nSituational Constraints:\n${sk.situational_constraints.map((c) => `  - ${c}`).join("\n")}`,
  ].join("\n");
}

function proficiencyGapToText(gaps) {
  return [
    "PROFICIENCY GAP",
    ...gaps.map(
      (g) =>
        `\n${g.building_block_name} (${g.building_block_id}) — Level ${g.current_level} → ${g.next_level}:\n${g.gap_description}`
    ),
  ].join("\n");
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
  const parts = [
    `SCENARIO: ${sc.title}`,
    `\nContext: ${sc.context}`,
    `\nComplication: ${sc.complication}`,
  ];
  if (sc.available_data_artifacts?.length) {
    parts.push(`\nAvailable Data / Artifacts:\n${sc.available_data_artifacts.map((a) => `  - ${a}`).join("\n")}`);
  }
  return parts.join("\n");
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

function metacognitionToText(r) {
  return [
    "SELF-ASSESSMENT QUESTIONS",
    ...r.self_assessment_questions.map((q) => `  - ${q}`),
    "\nREFLECTION QUESTIONS",
    ...r.reflection_questions.map((q) => `  - ${q}`),
    "\nCOACHING QUESTIONS",
    ...r.coaching_questions.map((q) => `  - ${q}`),
  ].join("\n");
}

function transferToText(r) {
  return [
    `SHARED MECHANISMS\n${r.shared_mechanisms_summary}`,
    ...r.transfer_activities.map(
      (ta) =>
        `\nTRANSFER: ${ta.target_block_name} (${ta.target_block_id})\nShared: ${ta.shared_mechanisms.join(", ")}\nActivity: ${ta.activity}\nRationale: ${ta.rationale}`
    ),
  ].join("\n");
}

/* ── Mode 1 views ── */

function CaseSkeletonView({ data }) {
  return (
    <dl>
      <Field label="Problem Type">
        <p style={{ whiteSpace: "pre-line" }}>{data.problem_type}</p>
      </Field>
      <Field label="Information Characteristics">
        <BulletList items={data.information_characteristics} />
      </Field>
      <Field label="Cognitive Demand">
        <p style={{ whiteSpace: "pre-line" }}>{data.cognitive_demand}</p>
      </Field>
      <Field label="Complexity Dimensions">
        <BulletList items={data.complexity_dimensions} />
      </Field>
      <Field label="Situational Constraints">
        <BulletList items={data.situational_constraints} />
      </Field>
    </dl>
  );
}

function ProficiencyGapView({ data }) {
  return (
    <dl>
      {data.map((g) => (
        <Field
          key={g.building_block_id}
          label={`${g.building_block_id} ${g.building_block_name} — Level ${g.current_level} → ${g.next_level}`}
        >
          <p style={{ whiteSpace: "pre-line" }}>{g.gap_description}</p>
        </Field>
      ))}
    </dl>
  );
}

function PracticeActivityView({ data }) {
  return (
    <dl>
      <Field label="Objective">{data.objective}</Field>
      <Field label="Setup">
        <p style={{ whiteSpace: "pre-line" }}>{data.setup}</p>
      </Field>
      <Field label="Instructions">
        <p style={{ whiteSpace: "pre-line" }}>{data.instructions}</p>
      </Field>
      <Field label="Debrief Prompts">
        <BulletList items={data.debrief_prompts} />
      </Field>
      <Field label="Materials Needed">
        <BulletList items={data.materials_needed} />
      </Field>
    </dl>
  );
}

function ScenarioView({ data }) {
  return (
    <dl>
      <Field label="Context">
        <p style={{ whiteSpace: "pre-line" }}>{data.context}</p>
      </Field>
      <Field label="Complication">
        <p style={{ whiteSpace: "pre-line" }}>{data.complication}</p>
      </Field>
      {data.available_data_artifacts?.length > 0 && (
        <Field label="Available Data / Artifacts">
          <BulletList items={data.available_data_artifacts} />
        </Field>
      )}
    </dl>
  );
}

function RubricView({ data }) {
  return (
    <dl>
      <Field label="What to Observe">{data.what_to_observe}</Field>
      <Field label="Criteria">
        <CriteriaStack>
          {data.criteria.map((c, i) => (
            <CriterionCard key={i}>
              <CriterionHeader>{c.criterion}</CriterionHeader>
              <RubricGrid>
                <RubricCell>
                  <RubricLabel color="#f87171">Below Target</RubricLabel>
                  <Typography type="body-sm" style={{ color: "#4b5563" }}>
                    {c.observable_indicators.below_target}
                  </Typography>
                </RubricCell>
                <RubricCell>
                  <RubricLabel color="var(--color-accent)">At Target</RubricLabel>
                  <Typography type="body-sm" style={{ color: "#4b5563" }}>
                    {c.observable_indicators.at_target}
                  </Typography>
                </RubricCell>
                <RubricCell>
                  <RubricLabel color="#22c55e">Above Target</RubricLabel>
                  <Typography type="body-sm" style={{ color: "#4b5563" }}>
                    {c.observable_indicators.above_target}
                  </Typography>
                </RubricCell>
              </RubricGrid>
              <CoachingTip>
                <strong>Coaching tip:</strong> {c.coaching_tip}
              </CoachingTip>
            </CriterionCard>
          ))}
        </CriteriaStack>
      </Field>
      <Field label="Overall Feedback Guidance">
        <p style={{ whiteSpace: "pre-line" }}>{data.overall_feedback_guidance}</p>
      </Field>
      <Field label="Debrief Questions">
        <BulletList items={data.debrief_questions} />
      </Field>
    </dl>
  );
}

/* ── Mode 2 views ── */

function QuestionListView({ questions }) {
  return (
    <div>
      {questions.map((q, i) => (
        <QuestionCard key={i}>{q}</QuestionCard>
      ))}
    </div>
  );
}

/* ── Mode 3 views ── */

function TransferView({ data }) {
  return (
    <div>
      {data.transfer_activities.map((ta, i) => (
        <TransferCard key={i}>
          <TransferTarget>
            {ta.target_block_id} {ta.target_block_name}
          </TransferTarget>
          <MechBadgeRow>
            {ta.shared_mechanisms.map((m) => (
              <Badge key={m} type="info">{m}</Badge>
            ))}
          </MechBadgeRow>
          <Field label="Activity">
            <p style={{ whiteSpace: "pre-line" }}>{ta.activity}</p>
          </Field>
          <Field label="Rationale">
            <p style={{ whiteSpace: "pre-line" }}>{ta.rationale}</p>
          </Field>
        </TransferCard>
      ))}
    </div>
  );
}

/* ── section builder ── */

function buildSections(result, mode) {
  if (mode === "practice") {
    const sections = [];
    if (result.case_skeleton) {
      sections.push({
        key: "skeleton",
        title: "Challenge Characteristics",
        json: result.case_skeleton,
        text: skeletonToText(result.case_skeleton),
        view: <CaseSkeletonView data={result.case_skeleton} />,
      });
    }
    if (result.proficiency_gap?.length) {
      sections.push({
        key: "gap",
        title: "Proficiency Gap",
        json: result.proficiency_gap,
        text: proficiencyGapToText(result.proficiency_gap),
        view: <ProficiencyGapView data={result.proficiency_gap} />,
      });
    }
    if (result.practice_activity || result.scenario || result.assessment_rubric) {
      const combinedJson = {
        ...(result.practice_activity && { practice_activity: result.practice_activity }),
        ...(result.scenario && { scenario: result.scenario }),
        ...(result.assessment_rubric && { assessment_rubric: result.assessment_rubric }),
      };
      const textParts = [];
      if (result.practice_activity) textParts.push(practiceToText(result.practice_activity));
      if (result.scenario) textParts.push(scenarioToText(result.scenario));
      if (result.assessment_rubric) textParts.push(rubricToText(result.assessment_rubric));

      sections.push({
        key: "activity",
        title: "Example Activity and Rubrics",
        json: combinedJson,
        text: textParts.join("\n\n"),
        view: (
          <>
            {result.practice_activity && (
              <PracticeActivityView data={result.practice_activity} />
            )}
            {result.scenario && (
              <>
                <SubSectionTitle>Scenario — {result.scenario.title}</SubSectionTitle>
                <ScenarioView data={result.scenario} />
              </>
            )}
            {result.assessment_rubric && (
              <>
                <SubSectionTitle>Assessment Rubric — {result.assessment_rubric.title}</SubSectionTitle>
                <RubricView data={result.assessment_rubric} />
              </>
            )}
          </>
        ),
      });
    }
    return sections;
  }

  if (mode === "metacognition") {
    return [
      {
        key: "self-assessment",
        title: "Self-Assessment Questions",
        json: result.self_assessment_questions,
        text: result.self_assessment_questions.map((q) => `- ${q}`).join("\n"),
        view: <QuestionListView questions={result.self_assessment_questions} />,
      },
      {
        key: "reflection",
        title: "Reflection Questions",
        json: result.reflection_questions,
        text: result.reflection_questions.map((q) => `- ${q}`).join("\n"),
        view: <QuestionListView questions={result.reflection_questions} />,
      },
      {
        key: "coaching",
        title: "Coaching Questions",
        json: result.coaching_questions,
        text: result.coaching_questions.map((q) => `- ${q}`).join("\n"),
        view: <QuestionListView questions={result.coaching_questions} />,
      },
    ];
  }

  if (mode === "transfer") {
    return [
      {
        key: "mechanisms",
        title: "Shared Mechanisms",
        json: { summary: result.shared_mechanisms_summary },
        text: result.shared_mechanisms_summary,
        view: (
          <Field label="Summary">
            <p style={{ whiteSpace: "pre-line" }}>{result.shared_mechanisms_summary}</p>
          </Field>
        ),
      },
      {
        key: "activities",
        title: "Transfer Activities",
        json: result.transfer_activities,
        text: transferToText(result),
        view: <TransferView data={result} />,
      },
    ];
  }

  return [];
}

/* ── main export ── */

export default function OutputDisplay({ result, mode }) {
  if (!result) return null;

  const sections = buildSections(result, mode);

  return (
    <SectionStack>
      {sections.map((sec) => (
        <SectionCard key={sec.key}>
          <SectionTitle>{sec.title}</SectionTitle>
          <div style={{ padding: "16px 20px 20px" }}>
            {sec.view}
            <CopyButtons jsonData={sec.json} textData={sec.text} />
          </div>
        </SectionCard>
      ))}
    </SectionStack>
  );
}

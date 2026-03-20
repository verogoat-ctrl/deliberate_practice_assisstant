import { useState, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { Typography, Divider, Alert, Tabs, Tab } from "@mds/mds-reactjs-library";
import SkillSelector from "./components/SkillSelector";
import BuildingBlockSelector from "./components/BuildingBlockSelector";
import LevelSelector from "./components/LevelSelector";
import GenerateButton from "./components/GenerateButton";
import OutputDisplay from "./components/OutputDisplay";
import LoadingState from "./components/LoadingState";
import TransferMatches, { findTransferMatches } from "./components/TransferMatches";
import { generatePractice } from "./lib/api";

import dreyfusData from "../../data/dreyfus_progression.json";
import proficiencyData from "../../data/proficiency_levels.json";

const MODE_CONFIG = {
  practice:      { maxSkills: 2, maxBlocks: 3 },
  metacognition: { maxSkills: 1, maxBlocks: 1 },
  transfer:      { maxSkills: 1, maxBlocks: 1 },
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`;

const HeaderBar = styled.header`
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
`;

const HeaderInner = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 2px;
`;

const Main = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: 24px 16px;
  @media (min-width: 640px) { padding: 24px; }
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (min-width: 1024px) { flex-direction: row; }
`;

const Sidebar = styled.aside`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (min-width: 1024px) { width: 400px; }
`;

const SelectorCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OutputPanel = styled.div`
  flex: 1;
  min-width: 0;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const HintText = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
`;

const TabsWrapper = styled.div`
  margin-bottom: 4px;
`;

const MODE_LABELS = {
  practice: "Practice",
  metacognition: "Metacognition",
  transfer: "Transfer",
};

const MODE_DESCRIPTIONS = {
  practice: "Generate practice goals, activities, scenarios, and rubrics.",
  metacognition: "Generate metacognition questions for self-assessment, reflection, and coaching.",
  transfer: "Generate transfer activities across building blocks that share cognitive mechanisms.",
};

export default function App() {
  const [mode, setMode] = useState("practice");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultMode, setResultMode] = useState(null);
  const [error, setError] = useState(null);

  const { maxSkills, maxBlocks } = MODE_CONFIG[mode];

  function handleModeChange(newMode) {
    setMode(newMode);
    setSelectedSkills([]);
    setSelectedBlocks([]);
    setSelectedLevel(null);
    setResult(null);
    setResultMode(null);
    setError(null);
  }

  const handleSkillChange = useCallback(
    (skills) => {
      setSelectedSkills(skills);
      setSelectedBlocks((prev) => {
        const allBlockIds = (dreyfusData || [])
          .filter((bb) => skills.includes(bb.ldm_skill))
          .map((bb) => bb.id);
        return prev.filter((b) => allBlockIds.includes(b.id));
      });
    },
    []
  );

  const transferMatches = useMemo(() => {
    if (mode !== "transfer" || selectedBlocks.length === 0) return [];
    return findTransferMatches(selectedBlocks[0], dreyfusData || []);
  }, [mode, selectedBlocks]);

  const isValid =
    selectedSkills.length >= 1 &&
    selectedBlocks.length >= 1 &&
    selectedLevel !== null &&
    (mode !== "transfer" || transferMatches.length > 0);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let payload;

      if (mode === "practice") {
        payload = {
          mode: "practice",
          building_blocks: selectedBlocks.map((bb) => {
            const currentStage = bb.stages.find(
              (s) => s.level === selectedLevel.level
            );
            const nextStage = bb.stages.find(
              (s) => s.level === selectedLevel.level + 1
            ) || null;
            return {
              id: bb.id,
              building_block: bb.building_block,
              description: bb.description,
              main_cognitive_mechanisms: bb.main_cognitive_mechanisms,
              selected_level: currentStage,
              next_level: nextStage,
            };
          }),
          proficiency_level: selectedLevel,
        };
      } else if (mode === "metacognition") {
        const bb = selectedBlocks[0];
        const currentStage = bb.stages.find(
          (s) => s.level === selectedLevel.level
        );
        payload = {
          mode: "metacognition",
          building_block: {
            id: bb.id,
            building_block: bb.building_block,
            description: bb.description,
            main_cognitive_mechanisms: bb.main_cognitive_mechanisms,
            selected_level: currentStage,
          },
          proficiency_level: selectedLevel,
        };
      } else {
        const bb = selectedBlocks[0];
        const currentStage = bb.stages.find(
          (s) => s.level === selectedLevel.level
        );
        payload = {
          mode: "transfer",
          source_block: {
            id: bb.id,
            building_block: bb.building_block,
            description: bb.description,
            main_cognitive_mechanisms: bb.main_cognitive_mechanisms,
            selected_level: currentStage,
          },
          matched_blocks: transferMatches.map((m) => ({
            id: m.id,
            building_block: m.building_block,
            description: m.description,
            main_cognitive_mechanisms: m.main_cognitive_mechanisms,
            shared_mechanisms: m.shared_mechanisms,
          })),
          proficiency_level: selectedLevel,
        };
      }

      const data = await generatePractice(payload);
      setResult(data);
      setResultMode(mode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper>
      <HeaderBar>
        <HeaderInner>
          <Typography type="heading5" component="h1">
            Skill Practice Generator
          </Typography>
          <Subtitle>
            Generate deliberate practice activities, rubrics, reflection questions,
            and transfer exercises for McKinsey colleagues
          </Subtitle>
        </HeaderInner>
      </HeaderBar>

      <Main>
        <Layout>
          <Sidebar>
            <TabsWrapper>
              <Tabs
                selectedValue={mode}
                onChange={(value) => handleModeChange(value)}
              >
                <Tab label="Practice" value="practice" />
                <Tab label="Metacognition" value="metacognition" />
                <Tab label="Transfer" value="transfer" />
              </Tabs>
            </TabsWrapper>

            <Typography type="body-sm" style={{ color: "#6b7280", marginTop: -8 }}>
              {MODE_DESCRIPTIONS[mode]}
            </Typography>

            <SelectorCard>
              <SkillSelector
                data={dreyfusData}
                selected={selectedSkills}
                onChange={handleSkillChange}
                maxSkills={maxSkills}
              />

              <Divider type="light" />

              <BuildingBlockSelector
                data={dreyfusData}
                selectedSkills={selectedSkills}
                selected={selectedBlocks}
                onChange={setSelectedBlocks}
                maxBlocks={maxBlocks}
              />

              {mode === "transfer" && (
                <>
                  <Divider type="light" />
                  <TransferMatches
                    sourceBlock={selectedBlocks[0] || null}
                    allBlocks={dreyfusData || []}
                  />
                </>
              )}

              <Divider type="light" />

              <LevelSelector
                levels={proficiencyData}
                selected={selectedLevel}
                onChange={setSelectedLevel}
              />
            </SelectorCard>

            <GenerateButton
              disabled={!isValid}
              loading={loading}
              onClick={handleGenerate}
            />

            {!isValid && !loading && !result && (
              <HintText>
                {mode === "transfer" && selectedBlocks.length > 0 && transferMatches.length === 0
                  ? "No transfer matches found for this building block."
                  : `Select ${maxSkills > 1 ? "1–" + maxSkills : "1"} competenc${maxSkills > 1 ? "ies" : "y"}, ${maxBlocks > 1 ? "1–" + maxBlocks : "1"} building block${maxBlocks > 1 ? "s" : ""}, and 1 proficiency level to generate.`}
              </HintText>
            )}
          </Sidebar>

          <OutputPanel>
            {loading && <LoadingState />}

            {error && (
              <Alert id="generation-error" type="danger-contextual">
                {error}
              </Alert>
            )}

            {result && !loading && (
              <OutputDisplay result={result} mode={resultMode} />
            )}

            {!loading && !error && !result && (
              <EmptyState>
                <Typography type="body-sm" style={{ color: "#9ca3af" }}>
                  {MODE_DESCRIPTIONS[mode]}
                </Typography>
              </EmptyState>
            )}
          </OutputPanel>
        </Layout>
      </Main>
    </PageWrapper>
  );
}

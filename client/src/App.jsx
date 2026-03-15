import { useState, useCallback } from "react";
import SkillSelector from "./components/SkillSelector";
import BuildingBlockSelector from "./components/BuildingBlockSelector";
import LevelSelector from "./components/LevelSelector";
import GenerateButton from "./components/GenerateButton";
import OutputDisplay from "./components/OutputDisplay";
import LoadingState from "./components/LoadingState";
import { generatePractice } from "./lib/api";

import dreyfusData from "../../data/dreyfus_progression.json";
import proficiencyData from "../../data/proficiency_levels.json";

export default function App() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSkillChange = useCallback(
    (skills) => {
      setSelectedSkills(skills);
      setSelectedBlocks((prev) => {
        const allBlocks = (dreyfusData?.competencies || []).flatMap((c) =>
          c.skills
            .filter((s) => skills.includes(s.skill_name))
            .flatMap((s) => s.building_blocks.map((bb) => bb.id))
        );
        return prev.filter((b) => allBlocks.includes(b.id));
      });
    },
    []
  );

  const isValid =
    selectedSkills.length >= 1 &&
    selectedBlocks.length >= 1 &&
    selectedLevel !== null;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        skills: selectedSkills,
        building_blocks: selectedBlocks.map((bb) => {
          const levelEntry = bb.proficiency_levels.find(
            (pl) => pl.level === selectedLevel.level
          );
          return {
            id: bb.id,
            building_block: bb.building_block,
            description: bb.description,
            consulting_example: bb.consulting_example,
            selected_level: levelEntry,
          };
        }),
        proficiency_level: selectedLevel,
      };
      const data = await generatePractice(payload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-900">
            Deliberate Practice Generator
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Generate practice activities, scenarios, and assessment rubrics for
            McKinsey consultants
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel — selectors */}
          <aside className="w-full lg:w-[380px] shrink-0 space-y-5">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
              <SkillSelector
                data={dreyfusData}
                selected={selectedSkills}
                onChange={handleSkillChange}
              />

              <hr className="border-gray-100" />

              <BuildingBlockSelector
                data={dreyfusData}
                selectedSkills={selectedSkills}
                selected={selectedBlocks}
                onChange={setSelectedBlocks}
              />

              <hr className="border-gray-100" />

              <LevelSelector
                levels={proficiencyData}
                selected={selectedLevel}
                onChange={setSelectedLevel}
              />
            </div>

            <GenerateButton
              disabled={!isValid}
              loading={loading}
              onClick={handleGenerate}
            />

            {!isValid && !loading && !result && (
              <p className="text-xs text-gray-400 text-center">
                Select at least 1 skill, 1 building block, and 1 proficiency
                level to generate.
              </p>
            )}
          </aside>

          {/* Right panel — output */}
          <div className="flex-1 min-w-0">
            {loading && <LoadingState />}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <p className="text-sm font-semibold text-red-700">
                  Generation failed
                </p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}

            {result && !loading && <OutputDisplay result={result} />}

            {!loading && !error && !result && (
              <div className="flex items-center justify-center h-64 bg-white border border-gray-200 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Your generated practice activity, scenario, and rubric will
                    appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

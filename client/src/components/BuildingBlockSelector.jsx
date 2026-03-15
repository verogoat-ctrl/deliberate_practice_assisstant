import { useState } from "react";

const MAX_BLOCKS = 3;

export default function BuildingBlockSelector({
  data,
  selectedSkills,
  selected,
  onChange,
}) {
  const [expandedTip, setExpandedTip] = useState(null);
  const competencies = data?.competencies || [];

  const availableBlocks = competencies.flatMap((comp) =>
    comp.skills
      .filter((skill) => selectedSkills.includes(skill.skill_name))
      .flatMap((skill) =>
        skill.building_blocks.map((bb) => ({
          ...bb,
          skillName: skill.skill_name,
        }))
      )
  );

  function toggle(blockId) {
    if (selected.some((b) => b.id === blockId)) {
      onChange(selected.filter((b) => b.id !== blockId));
    } else if (selected.length < MAX_BLOCKS) {
      const block = availableBlocks.find((b) => b.id === blockId);
      if (block) onChange([...selected, block]);
    }
  }

  if (!selectedSkills.length) {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Building Blocks
          <span className="ml-1 font-normal text-gray-400">
            (select 1–{MAX_BLOCKS})
          </span>
        </label>
        <p className="text-sm text-gray-400 italic">
          Select at least one skill first.
        </p>
      </div>
    );
  }

  const grouped = {};
  availableBlocks.forEach((bb) => {
    if (!grouped[bb.skillName]) grouped[bb.skillName] = [];
    grouped[bb.skillName].push(bb);
  });

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Building Blocks
        <span className="ml-1 font-normal text-gray-400">
          (select 1–{MAX_BLOCKS})
        </span>
      </label>

      {Object.entries(grouped).map(([skillName, blocks]) => (
        <div key={skillName} className="mb-3">
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-1.5">
            {skillName}
          </p>
          <div className="flex flex-col gap-1.5">
            {blocks.map((bb) => {
              const active = selected.some((b) => b.id === bb.id);
              const disabled = !active && selected.length >= MAX_BLOCKS;
              const tipOpen = expandedTip === bb.id;
              return (
                <div key={bb.id}>
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(bb.id)}
                      disabled={disabled}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-left shrink-0
                        ${
                          active
                            ? "bg-[var(--color-accent)] text-white"
                            : disabled
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                      `}
                    >
                      {bb.id} {bb.building_block}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedTip(tipOpen ? null : bb.id)}
                      className="text-gray-400 hover:text-gray-600 text-xs mt-1.5 shrink-0"
                      title="Show description"
                    >
                      {tipOpen ? "hide" : "info"}
                    </button>
                  </div>
                  {tipOpen && (
                    <p className="text-xs text-gray-500 mt-1 ml-3 whitespace-pre-line leading-relaxed">
                      {bb.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

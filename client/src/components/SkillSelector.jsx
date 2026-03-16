const MAX_SKILLS = 2;

export default function SkillSelector({ data, selected, onChange }) {
  const competencies = data?.competencies || [];

  function toggle(skillName) {
    if (selected.includes(skillName)) {
      onChange(selected.filter((s) => s !== skillName));
    } else if (selected.length < MAX_SKILLS) {
      onChange([...selected, skillName]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Skills
        <span className="ml-1 font-normal text-gray-400">
          (select 1–{MAX_SKILLS})
        </span>
      </label>

      <div className="flex flex-wrap gap-2">
        {competencies.flatMap((comp) =>
          comp.skills.map((skill) => {
              const active = selected.includes(skill.skill_name);
              const disabled = !active && selected.length >= MAX_SKILLS;
              return (
                <button
                  key={skill.skill_name}
                  type="button"
                  onClick={() => toggle(skill.skill_name)}
                  disabled={disabled}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${
                      active
                        ? "bg-[var(--color-accent)] text-white"
                        : disabled
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                >
                  {skill.skill_name}
                </button>
              );
          })
        )}
      </div>
    </div>
  );
}

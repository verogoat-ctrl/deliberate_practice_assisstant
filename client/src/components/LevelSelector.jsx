export default function LevelSelector({ levels, selected, onChange }) {
  const items = levels?.levels || [];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Proficiency Level
        <span className="ml-1 font-normal text-gray-400">(select 1)</span>
      </label>

      <div className="flex flex-col gap-1.5">
        {items.map((lvl) => {
          const active = selected?.level === lvl.level;
          return (
            <button
              key={lvl.level}
              type="button"
              onClick={() => onChange(lvl)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border
                ${
                  active
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent)] font-semibold"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <span className="font-semibold">Level {lvl.level}:</span>{" "}
              {lvl.name}
              <span className="text-gray-400 ml-1">— {lvl.subtitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useMemo } from "react";
import styled from "@emotion/styled";
import { Typography, Button } from "@mds/mds-reactjs-library";

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export default function SkillSelector({ data, selected, onChange, maxSkills = 2 }) {
  const uniqueSkills = useMemo(
    () => [...new Set((data || []).map((bb) => bb.ldm_skill))],
    [data]
  );

  function toggle(skillName) {
    if (selected.includes(skillName)) {
      onChange(selected.filter((s) => s !== skillName));
    } else if (selected.length < maxSkills) {
      onChange([...selected, skillName]);
    }
  }

  return (
    <div>
      <Typography type="body-sm" component="label" style={{ fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>
        Skill{" "}
        <span style={{ fontWeight: 400, color: "#9ca3af" }}>
          (select 1–{maxSkills})
        </span>
      </Typography>

      <Stack>
        {uniqueSkills.map((skillName) => {
          const active = selected.includes(skillName);
          const disabled = !active && selected.length >= maxSkills;
          return (
            <Button
              key={skillName}
              appearance={active ? "primary" : "secondary"}
              size="md"
              disabled={disabled}
              onClick={() => toggle(skillName)}
              style={{ width: "100%", textAlign: "left", justifyContent: "flex-start" }}
            >
              {skillName}
            </Button>
          );
        })}
      </Stack>
    </div>
  );
}

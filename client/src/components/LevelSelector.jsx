import styled from "@emotion/styled";
import { Typography, Button } from "@mds/mds-reactjs-library";

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export default function LevelSelector({ levels, selected, onChange }) {
  const items = levels?.levels || [];

  return (
    <div>
      <Typography type="body-sm" component="label" style={{ fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>
        Proficiency Level{" "}
        <span style={{ fontWeight: 400, color: "#9ca3af" }}>(select 1)</span>
      </Typography>

      <Stack>
        {items.map((lvl) => {
          const active = selected?.level === lvl.level;
          return (
            <Button
              key={lvl.level}
              appearance={active ? "primary" : "secondary"}
              size="md"
              onClick={() => onChange(lvl)}
              style={{ width: "100%", textAlign: "left", justifyContent: "flex-start" }}
            >
              <strong>Level {lvl.level}:</strong>&nbsp;{lvl.name}
            </Button>
          );
        })}
      </Stack>
    </div>
  );
}

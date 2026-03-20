import styled from "@emotion/styled";
import {
  Accordion,
  AccordionPanel,
  AccordionHeader,
  Checkbox,
  Typography,
} from "@mds/mds-reactjs-library";

const GroupHeader = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 6px;
`;

const GroupWrap = styled.div`
  margin-bottom: 12px;
`;

const StyledAccordionHeader = styled(AccordionHeader)`
  font-size: 0.875rem;
  text-align: left;
  justify-content: flex-start;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const DescriptionText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  white-space: pre-line;
  line-height: 1.5;
  padding: 8px 16px 12px;
`;

export default function BuildingBlockSelector({
  data,
  selectedSkills,
  selected,
  onChange,
  maxBlocks = 3,
}) {
  const availableBlocks = (data || [])
    .filter((bb) => selectedSkills.includes(bb.ldm_skill))
    .map((bb) => ({ ...bb, skillName: bb.ldm_skill }));

  function toggle(blockId) {
    if (selected.some((b) => b.id === blockId)) {
      onChange(selected.filter((b) => b.id !== blockId));
    } else if (selected.length < maxBlocks) {
      const block = availableBlocks.find((b) => b.id === blockId);
      if (block) onChange([...selected, block]);
    }
  }

  if (!selectedSkills.length) {
    return (
      <div>
        <Typography type="body-sm" component="label" style={{ fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>
          Building Blocks{" "}
          <span style={{ fontWeight: 400, color: "#9ca3af" }}>
            (select 1–{maxBlocks})
          </span>
        </Typography>
        <Typography type="body-sm" style={{ color: "#9ca3af", fontStyle: "italic" }}>
          Select at least one competency first.
        </Typography>
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
      <Typography type="body-sm" component="label" style={{ fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>
        Building Blocks{" "}
        <span style={{ fontWeight: 400, color: "#9ca3af" }}>
          (select 1–{maxBlocks})
        </span>
      </Typography>

      {Object.entries(grouped).map(([skillName, blocks]) => (
        <GroupWrap key={skillName}>
          <GroupHeader>{skillName}</GroupHeader>
          <Accordion>
            {blocks.map((bb) => {
              const active = selected.some((b) => b.id === bb.id);
              const disabled = !active && selected.length >= maxBlocks;
              return (
                <AccordionPanel key={bb.id}>
                  <StyledAccordionHeader>
                    <CheckboxRow
                      disabled={disabled}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        value={bb.id}
                        checked={active}
                        disabled={disabled}
                        onChange={() => toggle(bb.id)}
                      />
                      <span>{bb.id} {bb.building_block}</span>
                    </CheckboxRow>
                  </StyledAccordionHeader>
                  <DescriptionText>{bb.description}</DescriptionText>
                </AccordionPanel>
              );
            })}
          </Accordion>
        </GroupWrap>
      ))}
    </div>
  );
}

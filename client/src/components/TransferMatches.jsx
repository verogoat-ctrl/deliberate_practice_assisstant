import { useMemo } from "react";
import styled from "@emotion/styled";
import { Typography, Badge } from "@mds/mds-reactjs-library";

const Wrapper = styled.div`
  margin-top: 4px;
`;

const MatchCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
`;

const BlockName = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
`;

const MechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const EmptyNote = styled.p`
  font-size: 0.8125rem;
  color: #9ca3af;
  font-style: italic;
`;

export function findTransferMatches(sourceBlock, allBlocks) {
  if (!sourceBlock) return [];

  const sourceMechs = sourceBlock.main_cognitive_mechanisms
    .split(", ")
    .map((m) => m.trim());

  return allBlocks
    .filter((bb) => bb.id !== sourceBlock.id)
    .map((bb) => {
      const targetMechs = bb.main_cognitive_mechanisms
        .split(", ")
        .map((m) => m.trim());
      const shared = sourceMechs.filter((m) => targetMechs.includes(m));
      return shared.length > 0
        ? { ...bb, shared_mechanisms: shared }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.shared_mechanisms.length - a.shared_mechanisms.length);
}

export default function TransferMatches({ sourceBlock, allBlocks }) {
  const matches = useMemo(
    () => findTransferMatches(sourceBlock, allBlocks),
    [sourceBlock, allBlocks]
  );

  if (!sourceBlock) {
    return (
      <Wrapper>
        <Typography type="body-sm" component="label" style={{ fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>
          Transfer Matches
        </Typography>
        <EmptyNote>Select a building block to see matches.</EmptyNote>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Typography type="body-sm" component="label" style={{ fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>
        Transfer Matches{" "}
        <span style={{ fontWeight: 400, color: "#9ca3af" }}>
          ({matches.length} blocks share mechanisms)
        </span>
      </Typography>

      {matches.length === 0 && (
        <EmptyNote>No other blocks share cognitive mechanisms with this selection.</EmptyNote>
      )}

      {matches.map((match) => (
        <MatchCard key={match.id}>
          <BlockName>
            {match.id} {match.building_block}
          </BlockName>
          <MechRow>
            {match.shared_mechanisms.map((mech) => (
              <Badge key={mech} type="info">
                {mech}
              </Badge>
            ))}
          </MechRow>
        </MatchCard>
      ))}
    </Wrapper>
  );
}

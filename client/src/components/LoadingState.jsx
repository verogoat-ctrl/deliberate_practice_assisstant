import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const Pulse = styled.div`
  animation: ${pulse} 1.5s ease-in-out infinite;
  background: #e5e7eb;
  border-radius: 6px;
  ${(props) => props.h && `height: ${props.h};`}
  ${(props) => props.w && `width: ${props.w};`}
  ${(props) => props.mb && `margin-bottom: ${props.mb};`}
`;

const SkeletonCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default function LoadingState() {
  return (
    <Stack>
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i}>
          <Pulse h="20px" w="12rem" mb="16px" />
          <Pulse h="12px" w="100%" mb="8px" />
          <Pulse h="12px" w="83%" mb="8px" />
          <Pulse h="12px" w="66%" mb="16px" />
          <Pulse h="12px" w="100%" mb="8px" />
          <Pulse h="12px" w="75%" />
        </SkeletonCard>
      ))}
    </Stack>
  );
}

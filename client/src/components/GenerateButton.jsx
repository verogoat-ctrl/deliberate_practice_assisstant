import { Button, CircularLoading } from "@mds/mds-reactjs-library";

export default function GenerateButton({ disabled, loading, onClick }) {
  return (
    <Button
      appearance="primary"
      size="lg"
      disabled={disabled || loading}
      onClick={onClick}
      style={{ width: "100%" }}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CircularLoading indeterminate size="xsm" />
          Generating…
        </span>
      ) : (
        "Generate"
      )}
    </Button>
  );
}

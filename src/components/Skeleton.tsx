import React from "react";

const shimmerStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #2D2D44 0%, #3A3A52 50%, #2D2D44 100%)",
  backgroundSize: "200% 100%",
  animation: "skeleton-shimmer 1.5s infinite linear",
  borderRadius: "6px",
};

// Inject keyframes once via a style tag approach — SSR-safe via a module-level const
const SHIMMER_CSS = `
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

function ShimmerStyle() {
  return <style dangerouslySetInnerHTML={{ __html: SHIMMER_CSS }} />;
}

// ── SkeletonLine ────────────────────────────────────────────────────────────
export function SkeletonLine({
  width = "100%",
  height = 14,
  className = "",
  style = {},
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <ShimmerStyle />
      <div
        className={className}
        style={{
          ...shimmerStyle,
          width,
          height,
          borderRadius: "4px",
          flexShrink: 0,
          ...style,
        }}
      />
    </>
  );
}

// ── SkeletonCard ────────────────────────────────────────────────────────────
export function SkeletonCard({
  height = 120,
  className = "",
}: {
  height?: number | string;
  className?: string;
}) {
  return (
    <>
      <ShimmerStyle />
      <div
        className={className}
        style={{
          ...shimmerStyle,
          height,
          borderRadius: "12px",
          width: "100%",
        }}
      />
    </>
  );
}

// ── SkeletonTable ───────────────────────────────────────────────────────────
export function SkeletonTable({
  rows = 6,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <>
      <ShimmerStyle />
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          backgroundColor: "var(--surface)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            padding: "12px 16px",
            gap: "12px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} style={{ ...shimmerStyle, height: 10, borderRadius: "4px" }} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              padding: "14px 16px",
              gap: "12px",
              borderBottom: row < rows - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            {Array.from({ length: columns }).map((_, col) => (
              <div
                key={col}
                style={{
                  ...shimmerStyle,
                  height: 13,
                  borderRadius: "4px",
                  width: col === 0 ? "80%" : col === columns - 1 ? "50%" : "70%",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ── SkeletonMetricCard ──────────────────────────────────────────────────────
export function SkeletonMetricCard({ wide = false }: { wide?: boolean }) {
  return (
    <>
      <ShimmerStyle />
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "20px",
          backgroundColor: "var(--surface)",
        }}
      >
        {/* Label */}
        <div style={{ ...shimmerStyle, height: 10, width: "45%", marginBottom: "10px", borderRadius: "4px" }} />
        {/* Value */}
        <div style={{ ...shimmerStyle, height: 32, width: "55%", marginBottom: "8px", borderRadius: "6px" }} />
        {/* Sub-line */}
        <div style={{ ...shimmerStyle, height: 10, width: "65%", marginBottom: wide ? "16px" : 0, borderRadius: "4px" }} />
        {wide && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
            {[0.7, 0.5, 0.8].map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ ...shimmerStyle, height: 8, width: "30%", borderRadius: "4px", flexShrink: 0 }} />
                <div style={{ flex: 1, height: 6, borderRadius: "4px", backgroundColor: "#2D2D44" }}>
                  <div style={{ ...shimmerStyle, height: 6, width: `${w * 100}%`, borderRadius: "4px" }} />
                </div>
                <div style={{ ...shimmerStyle, height: 8, width: "12%", borderRadius: "4px" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

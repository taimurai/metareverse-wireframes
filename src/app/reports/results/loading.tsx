import { SkeletonLine } from "@/components/Skeleton";

export default function ResultsLoading() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 20px" }}>
        <div>
          <SkeletonLine width={100} height={22} />
          <div style={{ marginTop: 8 }}>
            <SkeletonLine width={260} height={12} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <SkeletonLine width={140} height={36} style={{ borderRadius: "10px" }} />
          <SkeletonLine width={100} height={36} style={{ borderRadius: "10px" }} />
          <SkeletonLine width={120} height={36} style={{ borderRadius: "10px" }} />
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
        {[70, 60, 70].map((w, i) => (
          <SkeletonLine key={i} width={w} height={13} style={{ margin: "8px 8px 12px" }} />
        ))}
      </div>

      {/* 2-col chart grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "20px",
              backgroundColor: "var(--surface)",
            }}
          >
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <SkeletonLine width={120} height={13} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#2D2D44" }} />
            </div>
            {/* Value */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
              <SkeletonLine width={100} height={26} />
              <SkeletonLine width={50} height={12} />
            </div>
            {/* Chart area */}
            <div
              style={{
                height: 180,
                borderRadius: "8px",
                background: "linear-gradient(90deg, #2D2D44 0%, #3A3A52 50%, #2D2D44 100%)",
                backgroundSize: "200% 100%",
                animation: "skeleton-shimmer 1.5s infinite linear",
              }}
            />
            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
              <div style={{ width: 12, height: 2, borderRadius: "2px", background: "#3A3A52" }} />
              <SkeletonLine width={80} height={10} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

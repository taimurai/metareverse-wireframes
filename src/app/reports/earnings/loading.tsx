import { SkeletonLine } from "@/components/Skeleton";

export default function EarningsLoading() {
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

      {/* Earnings card */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          marginBottom: "24px",
          backgroundColor: "var(--surface)",
        }}
      >
        <div style={{ padding: "20px" }}>
          {/* Earnings type selector */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              marginBottom: "24px",
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRight: i < 4 ? "1px solid var(--border)" : "none",
                  backgroundColor: i === 0 ? "var(--bg)" : "transparent",
                }}
              >
                <SkeletonLine width="70%" height={10} style={{ marginBottom: "8px" }} />
                <SkeletonLine width="60%" height={22} />
              </div>
            ))}
          </div>

          {/* Chart */}
          <div
            style={{
              height: 220,
              borderRadius: "8px",
              background: "linear-gradient(90deg, #2D2D44 0%, #3A3A52 50%, #2D2D44 100%)",
              backgroundSize: "200% 100%",
              animation: "skeleton-shimmer 1.5s infinite linear",
              marginLeft: 40,
            }}
          />

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: 12, height: 2, borderRadius: "2px", background: "#3A3A52" }} />
                <SkeletonLine width={40} height={10} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top content */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          backgroundColor: "var(--surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <SkeletonLine width={100} height={14} style={{ marginBottom: "6px" }} />
            <SkeletonLine width={220} height={10} />
          </div>
          <SkeletonLine width={110} height={30} style={{ borderRadius: "8px" }} />
        </div>

        <div style={{ padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div
                  style={{
                    aspectRatio: "1",
                    borderRadius: "8px",
                    background: "linear-gradient(90deg, #2D2D44 0%, #3A3A52 50%, #2D2D44 100%)",
                    backgroundSize: "200% 100%",
                    animation: "skeleton-shimmer 1.5s infinite linear",
                    marginBottom: "8px",
                  }}
                />
                <SkeletonLine width="90%" height={10} style={{ marginBottom: "4px" }} />
                <SkeletonLine width="60%" height={10} style={{ marginBottom: "4px" }} />
                <SkeletonLine width="70%" height={10} />
              </div>
            ))}
          </div>
        </div>
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

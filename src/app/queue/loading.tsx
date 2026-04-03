import { SkeletonLine } from "@/components/Skeleton";

export default function QueueLoading() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 20px" }}>
        <div>
          <SkeletonLine width={140} height={22} />
          <div style={{ marginTop: 8 }}>
            <SkeletonLine width={200} height={12} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <SkeletonLine width={120} height={36} style={{ borderRadius: "10px" }} />
          <SkeletonLine width={100} height={36} style={{ borderRadius: "10px" }} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        {[80, 90, 70, 60].map((w, i) => (
          <SkeletonLine key={i} width={w} height={32} style={{ borderRadius: "10px" }} />
        ))}
        <div style={{ marginLeft: "auto" }}>
          <SkeletonLine width={160} height={32} style={{ borderRadius: "8px" }} />
        </div>
      </div>

      {/* Date group label */}
      <div style={{ marginBottom: "10px" }}>
        <SkeletonLine width={100} height={11} />
      </div>

      {/* Queue rows */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          backgroundColor: "var(--surface)",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 56px 1fr 180px 120px 80px",
              alignItems: "center",
              padding: "14px 16px",
              gap: "16px",
              borderBottom: i < 7 ? "1px solid var(--border)" : "none",
            }}
          >
            {/* Checkbox */}
            <div style={{ width: 18, height: 18, borderRadius: "4px", background: "#2D2D44" }} />
            {/* Thumbnail */}
            <div style={{ width: 48, height: 48, borderRadius: "8px", background: "#2D2D44", flexShrink: 0 }} />
            {/* Caption + page */}
            <div>
              <SkeletonLine width="85%" height={13} />
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: 20, height: 20, borderRadius: "4px", background: "#3A3A52", flexShrink: 0 }} />
                <SkeletonLine width={100} height={10} />
              </div>
            </div>
            {/* Scheduled time */}
            <SkeletonLine width={120} height={12} />
            {/* Platforms */}
            <div style={{ display: "flex", gap: "4px" }}>
              {[0, 1, 2].slice(0, 2 + (i % 2)).map((j) => (
                <SkeletonLine key={j} width={28} height={20} style={{ borderRadius: "4px" }} />
              ))}
            </div>
            {/* Type badge */}
            <SkeletonLine width={50} height={20} style={{ borderRadius: "4px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

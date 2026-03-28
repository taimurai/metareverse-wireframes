import { SkeletonLine } from "@/components/Skeleton";

export default function FailedPostsLoading() {
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
          <SkeletonLine width={100} height={36} style={{ borderRadius: "10px" }} />
          <SkeletonLine width={80} height={36} style={{ borderRadius: "10px" }} />
        </div>
      </div>

      {/* Summary banner */}
      <div
        style={{
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "20px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: "10px", background: "#2D2D44", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="50%" height={14} style={{ marginBottom: "6px" }} />
          <SkeletonLine width="35%" height={10} />
        </div>
        <SkeletonLine width={90} height={32} style={{ borderRadius: "8px" }} />
      </div>

      {/* Failed post rows */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          backgroundColor: "var(--surface)",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              gap: "16px",
              borderBottom: i < 3 ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: "8px", background: "#2D2D44", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <SkeletonLine width="75%" height={13} style={{ marginBottom: "6px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "4px", background: "#3A3A52", flexShrink: 0 }} />
                  <SkeletonLine width={90} height={10} />
                  <SkeletonLine width={60} height={10} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SkeletonLine width={70} height={22} style={{ borderRadius: "6px" }} />
              <SkeletonLine width={28} height={28} style={{ borderRadius: "6px" }} />
              <SkeletonLine width={60} height={28} style={{ borderRadius: "6px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

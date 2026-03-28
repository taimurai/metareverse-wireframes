import { SkeletonLine, SkeletonMetricCard } from "@/components/Skeleton";

export default function ReportsLoading() {
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

      {/* Sub-nav tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
        {[70, 60, 70].map((w, i) => (
          <SkeletonLine key={i} width={w} height={13} style={{ margin: "8px 8px 12px" }} />
        ))}
      </div>

      {/* Revenue aggregation card */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "24px",
          marginBottom: "24px",
          backgroundColor: "var(--surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SkeletonLine width={80} height={20} style={{ borderRadius: "6px" }} />
            <SkeletonLine width={130} height={10} />
          </div>
          <SkeletonLine width={110} height={30} style={{ borderRadius: "8px" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px", marginBottom: "20px" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i}>
              <SkeletonLine width="80%" height={32} style={{ marginBottom: "6px" }} />
              <SkeletonLine width="60%" height={11} style={{ marginBottom: "4px" }} />
              <SkeletonLine width="50%" height={10} />
            </div>
          ))}
        </div>
        {/* Page revenue bars */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", borderRadius: "8px", backgroundColor: "var(--bg)", marginBottom: "4px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "6px", background: "#2D2D44", flexShrink: 0 }} />
            <SkeletonLine width={120} height={12} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, height: 8, borderRadius: "999px", background: "#2D2D44" }}>
              <div style={{ width: `${[60, 45, 35, 25, 15][i]}%`, height: 8, borderRadius: "999px", background: "#3A3A52" }} />
            </div>
            <SkeletonLine width={50} height={12} />
            <SkeletonLine width={55} height={10} />
            <SkeletonLine width={40} height={10} />
          </div>
        ))}
      </div>

      {/* Performance heading */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#2D2D44" }} />
        <SkeletonLine width={100} height={14} />
        <SkeletonLine width={180} height={12} />
      </div>

      {/* 6 metric cards in 2-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>

      {/* Recent content table */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          backgroundColor: "var(--surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <SkeletonLine width={120} height={14} />
          <SkeletonLine width={100} height={30} style={{ borderRadius: "8px" }} />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 100px 100px 80px 80px 80px",
              alignItems: "center",
              padding: "14px 20px",
              gap: "12px",
              borderBottom: i < 4 ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "8px", background: "#2D2D44", flexShrink: 0 }} />
              <SkeletonLine width="70%" height={12} />
            </div>
            {[0, 1, 2, 3, 4].map((j) => (
              <SkeletonLine key={j} width="60%" height={12} style={{ marginLeft: "auto" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

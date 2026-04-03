import { SkeletonLine, SkeletonMetricCard, SkeletonTable } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 20px" }}>
        <div>
          <SkeletonLine width={180} height={22} />
          <div style={{ marginTop: 8 }}>
            <SkeletonLine width={120} height={12} />
          </div>
        </div>
        <SkeletonLine width={130} height={36} style={{ borderRadius: "10px" }} />
      </div>

      {/* 3 metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </div>

      {/* Attention section skeleton */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <SkeletonLine width={140} height={13} />
          <SkeletonLine width={60} height={18} style={{ borderRadius: "999px" }} />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              marginBottom: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "#2D2D44", flexShrink: 0 }} />
              <div>
                <SkeletonLine width={160} height={13} />
                <div style={{ marginTop: 6 }}>
                  <SkeletonLine width={220} height={10} />
                </div>
              </div>
            </div>
            <SkeletonLine width={90} height={32} style={{ borderRadius: "8px" }} />
          </div>
        ))}
      </div>

      {/* Table section label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SkeletonLine width={80} height={13} />
          <SkeletonLine width={160} height={20} style={{ borderRadius: "999px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SkeletonLine width={160} height={34} style={{ borderRadius: "8px" }} />
          <SkeletonLine width={90} height={13} />
        </div>
      </div>

      {/* Page health table */}
      <SkeletonTable rows={7} columns={7} />

      {/* Bottom 2-col cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "16px",
            backgroundColor: "var(--surface)",
          }}
        >
          <SkeletonLine width={160} height={10} style={{ marginBottom: "16px" }} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <SkeletonLine width={20} height={16} />
              <div style={{ width: 28, height: 28, borderRadius: "8px", background: "#2D2D44", flexShrink: 0 }} />
              <SkeletonLine width="40%" height={12} />
              <SkeletonLine width={60} height={14} style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid var(--border)",
            padding: "16px",
            backgroundColor: "var(--surface)",
          }}
        >
          <SkeletonLine width={160} height={10} style={{ marginBottom: "16px" }} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "8px", background: "#2D2D44", flexShrink: 0 }} />
              <SkeletonLine width="40%" height={12} />
              <SkeletonLine width={80} height={12} style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

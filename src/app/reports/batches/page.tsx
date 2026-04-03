"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

type Period = "7d" | "28d" | "90d";

interface PageInBatch {
  id: string;
  name: string;
  avatar: string;
  color: string;
  followers: string;
  revenue: string;
  revenueRaw: number;
  rpm: string;
  views: string;
  viewsRaw: number;
  growth: string;
  growthRaw: number;
  engagement: string;
  status: "healthy" | "stable" | "declining";
}

interface BatchData {
  id: string;
  name: string;
  color: string;
  pageCount: number;
  pages: PageInBatch[];
  // KPIs
  revenue: string;
  revenueRaw: number;
  revenuePct: string; // MoM change
  revenuePctRaw: number;
  rpm: string;
  rpmRaw: number;
  totalViews: string;
  totalViewsRaw: number;
  growth: string;
  growthRaw: number;
  engagement: string;
  engagementRaw: number;
  postsThisMonth: number;
  health: "healthy" | "stable" | "declining" | "at-risk";
  healthReason: string;
  recommendation: string;
  weeklyRevenue: number[]; // 4 weeks
  contributionPct: number; // % of total portfolio revenue
}

const BATCH_DATA: BatchData[] = [
  {
    id: "b1",
    name: "Partner A — Lifestyle",
    color: "#F59E0B",
    pageCount: 3,
    pages: [
      { id: "lc",  name: "Laugh Central",     avatar: "LC", color: "#8B5CF6", followers: "3.2M", revenue: "$28.4K", revenueRaw: 28400, rpm: "$5.12", views: "5.6M",  viewsRaw: 5600000, growth: "+18%", growthRaw: 18,  engagement: "6.8%", status: "healthy"  },
      { id: "ff",  name: "Fitness Factory",   avatar: "FF", color: "#EC4899", followers: "310K", revenue: "$11.2K", revenueRaw: 11200, rpm: "$4.44", views: "2.5M",  viewsRaw: 2500000, growth: "+6%",  growthRaw: 6,   engagement: "5.1%", status: "stable"   },
      { id: "dh",  name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K", revenue: "$8.6K",  revenueRaw: 8600,  rpm: "$4.91", views: "1.8M",  viewsRaw: 1800000, growth: "+9%",  growthRaw: 9,   engagement: "3.8%", status: "healthy"  },
    ],
    revenue: "$48.2K", revenueRaw: 48200, revenuePct: "+14%", revenuePctRaw: 14,
    rpm: "$4.82", rpmRaw: 4.82,
    totalViews: "9.9M", totalViewsRaw: 9900000,
    growth: "+12%", growthRaw: 12,
    engagement: "5.2%", engagementRaw: 5.2,
    postsThisMonth: 198,
    health: "healthy",
    healthReason: "All 3 pages growing. Laugh Central up 18% MoM.",
    recommendation: "Increase upload frequency on Fitness Factory — it has the highest follow-through rate but lowest volume.",
    weeklyRevenue: [9800, 11200, 12900, 14300],
    contributionPct: 51,
  },
  {
    id: "b2",
    name: "Partner B — Education",
    color: "#8B5CF6",
    pageCount: 3,
    pages: [
      { id: "hu",  name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M", revenue: "$24.1K", revenueRaw: 24100, rpm: "$4.20", views: "5.7M",  viewsRaw: 5700000, growth: "+5%",  growthRaw: 5,   engagement: "4.2%", status: "healthy"  },
      { id: "tb",  name: "TechByte",          avatar: "TB", color: "#14B8A6", followers: "1.1M", revenue: "$13.8K", revenueRaw: 13800, rpm: "$3.62", views: "3.8M",  viewsRaw: 3800000, growth: "+2%",  growthRaw: 2,   engagement: "2.9%", status: "stable"   },
      { id: "mm",  name: "Money Matters",     avatar: "MM", color: "#F59E0B", followers: "680K", revenue: "$0",     revenueRaw: 0,     rpm: "—",     views: "1.2M",  viewsRaw: 1200000, growth: "-3%",  growthRaw: -3,  engagement: "2.1%", status: "declining"},
    ],
    revenue: "$37.9K", revenueRaw: 37900, revenuePct: "+2%", revenuePctRaw: 2,
    rpm: "$3.91", rpmRaw: 3.91,
    totalViews: "10.7M", totalViewsRaw: 10700000,
    growth: "+2%", growthRaw: 2,
    engagement: "3.4%", engagementRaw: 3.4,
    postsThisMonth: 167,
    health: "stable",
    healthReason: "Money Matters not monetized — dragging batch RPM. TechByte growth stalling.",
    recommendation: "Enroll Money Matters in monetization. Boost TechByte post volume — highest RPM ceiling in portfolio.",
    weeklyRevenue: [8900, 9200, 9700, 10100],
    contributionPct: 40,
  },
  {
    id: "b3",
    name: "Partner C — Women's",
    color: "#EC4899",
    pageCount: 1,
    pages: [
      { id: "khn", name: "Know Her Name",     avatar: "KH", color: "#0EA5E9", followers: "136K", revenue: "$4.8K",  revenueRaw: 4800,  rpm: "$2.10", views: "2.3M",  viewsRaw: 2300000, growth: "-8%",  growthRaw: -8,  engagement: "3.8%", status: "declining"},
    ],
    revenue: "$4.8K", revenueRaw: 4800, revenuePct: "-8%", revenuePctRaw: -8,
    rpm: "$2.10", rpmRaw: 2.10,
    totalViews: "2.3M", totalViewsRaw: 2300000,
    growth: "-8%", growthRaw: -8,
    engagement: "3.8%", engagementRaw: 3.8,
    postsThisMonth: 22,
    health: "at-risk",
    healthReason: "Revenue declining 8% MoM. Single page batch — no diversification. RPM at $2.10 vs $4.82 portfolio avg.",
    recommendation: "Add 2 more women's interest pages to this batch. Increase posting cadence — only 22 posts/month vs 167–198 for other batches.",
    weeklyRevenue: [1400, 1300, 1100, 1000],
    contributionPct: 5,
  },
];

const TOTAL_REVENUE = BATCH_DATA.reduce((a, b) => a + b.revenueRaw, 0);

const healthConfig = {
  healthy:   { label: "Healthy",   color: "#4ADE80", bg: "rgba(74,222,128,0.1)",   border: "rgba(74,222,128,0.25)"  },
  stable:    { label: "Stable",    color: "#60A5FA", bg: "rgba(96,165,250,0.1)",   border: "rgba(96,165,250,0.25)"  },
  declining: { label: "Declining", color: "#FBBF24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.25)"  },
  "at-risk": { label: "At Risk",   color: "#EF4444", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.25)"   },
};

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: i === data.length - 1 ? color : `${color}50`, minHeight: 3 }} />
      ))}
    </div>
  );
}

function KpiCell({ value, sub, highlight }: { value: string; sub: string; highlight?: string }) {
  return (
    <div className="text-center py-3 px-2">
      <div className="text-[15px] font-bold" style={{ color: highlight || "var(--text)" }}>{value}</div>
      <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</div>
    </div>
  );
}

export default function BatchPerformancePage() {
  const [period, setPeriod] = useState<Period>("28d");
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [sortKpi, setSortKpi] = useState<"revenue" | "rpm" | "growth" | "engagement">("revenue");

  const sorted = [...BATCH_DATA].sort((a, b) => {
    if (sortKpi === "revenue") return b.revenueRaw - a.revenueRaw;
    if (sortKpi === "rpm") return b.rpmRaw - a.rpmRaw;
    if (sortKpi === "growth") return b.growthRaw - a.growthRaw;
    return b.engagementRaw - a.engagementRaw;
  });

  const atRisk = BATCH_DATA.filter(b => b.health === "at-risk" || b.health === "declining");

  return (
    <div>
      <Header
        title="Insights"
        subtitle="Review performance results and more."
        actions={
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
            {(["7d", "28d", "90d"] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium"
                style={{ backgroundColor: period === p ? "var(--bg)" : "transparent", color: period === p ? "var(--text)" : "var(--text-secondary)", boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.3)" : "none" }}>
                {p}
              </button>
            ))}
          </div>
        }
      />

      {/* Sub-navigation */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "Overview",       href: "/reports",                active: false },
          { label: "Results",        href: "/reports/results",        active: false },
          { label: "Earnings",       href: "/reports/earnings",       active: false },
          { label: "By Posting ID",  href: "/reports/id-performance", active: false },
          { label: "Batches",        href: "/reports/batches",        active: true  },
        ].map(tab => (
          <Link key={tab.label} href={tab.href} className="relative px-4 py-3 text-[13px] font-medium"
            style={{ color: tab.active ? "var(--primary)" : "var(--text-secondary)" }}>
            {tab.label}
            {tab.active && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
          </Link>
        ))}
      </div>

      {/* Alert banner */}
      {atRisk.length > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div className="flex-1">
            <p className="text-[13px] font-semibold" style={{ color: "#EF4444" }}>
              {atRisk.length} batch{atRisk.length > 1 ? "es" : ""} need attention
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {atRisk.map(b => b.name).join(" · ")} — revenue declining. See recommendations below.
            </p>
          </div>
        </div>
      )}

      {/* Portfolio revenue share bar */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Portfolio Revenue Share · ${(TOTAL_REVENUE / 1000).toFixed(1)}K this month
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{period}</span>
        </div>
        <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-3">
          {BATCH_DATA.map(b => (
            <div key={b.id} className="h-full transition-all rounded-full"
              style={{ width: `${b.contributionPct}%`, backgroundColor: b.color }} />
          ))}
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          {BATCH_DATA.map(b => (
            <div key={b.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
              <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{b.name.split(" — ")[1] || b.name}</span>
              <span className="text-[12px] font-bold" style={{ color: "var(--text)" }}>{b.contributionPct}%</span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{b.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI comparison table */}
      <div className="rounded-xl border overflow-hidden mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-hover)" }}>
          <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Batch Comparison</span>
          <div className="flex gap-1.5">
            {(["revenue", "rpm", "growth", "engagement"] as const).map(k => (
              <button key={k} onClick={() => setSortKpi(k)}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg capitalize transition-all"
                style={{ backgroundColor: sortKpi === k ? "var(--primary)" : "var(--surface)", color: sortKpi === k ? "white" : "var(--text-muted)", border: `1px solid ${sortKpi === k ? "var(--primary)" : "var(--border)"}` }}>
                {k === "rpm" ? "RPM" : k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Column headers */}
        <div className="grid grid-cols-[200px_1fr_1fr_1fr_1fr_1fr_100px] border-b divide-x text-[10px] font-semibold uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--surface-hover)" }}>
          <div className="px-4 py-2.5">Batch</div>
          <div className="px-2 py-2.5 text-center">Revenue</div>
          <div className="px-2 py-2.5 text-center">RPM</div>
          <div className="px-2 py-2.5 text-center">Views</div>
          <div className="px-2 py-2.5 text-center">Growth</div>
          <div className="px-2 py-2.5 text-center">Engagement</div>
          <div className="px-2 py-2.5 text-center">Trend</div>
        </div>
        {sorted.map(batch => {
          const hc = healthConfig[batch.health];
          return (
            <div key={batch.id} className="grid grid-cols-[200px_1fr_1fr_1fr_1fr_1fr_100px] border-b divide-x last:border-b-0"
              style={{ borderColor: "var(--border)" }}>
              {/* Batch name */}
              <div className="px-4 py-3 flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: batch.color }} />
                <div>
                  <div className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{batch.name.split(" — ")[1] || batch.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{batch.pageCount} pages</div>
                </div>
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: hc.bg, color: hc.color, border: `1px solid ${hc.border}` }}>{hc.label}</span>
              </div>
              <KpiCell value={batch.revenue} sub={batch.revenuePctRaw >= 0 ? `+${batch.revenuePct} MoM` : `${batch.revenuePct} MoM`} highlight={batch.revenuePctRaw < 0 ? "#EF4444" : "#4ADE80"} />
              <KpiCell value={batch.rpm} sub="per 1K views" />
              <KpiCell value={batch.totalViews} sub="this month" />
              <KpiCell value={batch.growth} sub="MoM growth" highlight={batch.growthRaw < 0 ? "#EF4444" : batch.growthRaw > 5 ? "#4ADE80" : "var(--text)"} />
              <KpiCell value={batch.engagement} sub="avg rate" />
              {/* Mini bar chart */}
              <div className="flex items-center justify-center px-3 py-2">
                <MiniBarChart data={batch.weeklyRevenue} color={batch.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch detail cards */}
      <div className="space-y-4">
        {BATCH_DATA.map(batch => {
          const hc = healthConfig[batch.health];
          const isExpanded = expandedBatch === batch.id;
          return (
            <div key={batch.id} className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "var(--surface)", borderColor: batch.health === "at-risk" ? "rgba(239,68,68,0.3)" : "var(--border)" }}>

              {/* Batch header */}
              <div className="flex items-center gap-4 px-5 py-4" style={{ backgroundColor: `${batch.color}08` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-[13px]"
                  style={{ backgroundColor: batch.color }}>{batch.pageCount}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[15px]" style={{ color: "var(--text)" }}>{batch.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: hc.bg, color: hc.color, border: `1px solid ${hc.border}` }}>{hc.label}</span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{batch.healthReason}</p>
                </div>
                {/* KPI chips */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {[
                    { label: "Revenue", value: batch.revenue, color: "#4ADE80" },
                    { label: "RPM", value: batch.rpm, color: "var(--primary)" },
                    { label: "Growth", value: batch.growth, color: batch.growthRaw < 0 ? "#EF4444" : "#4ADE80" },
                    { label: "Posts", value: batch.postsThisMonth.toString(), color: "var(--text)" },
                  ].map(chip => (
                    <div key={chip.label} className="text-center px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
                      <div className="text-[14px] font-bold" style={{ color: chip.color }}>{chip.value}</div>
                      <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{chip.label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              </div>

              {/* Recommendation strip */}
              <div className="flex items-start gap-2.5 px-5 py-2.5 border-t"
                style={{ borderColor: "var(--border)", backgroundColor: `${hc.bg}` }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={hc.color} strokeWidth="2" className="mt-0.5 flex-shrink-0">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <p className="text-[11px]" style={{ color: hc.color }}><span className="font-semibold">Recommendation: </span>{batch.recommendation}</p>
              </div>

              {/* Per-page breakdown */}
              {isExpanded && (
                <div className="border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="px-5 py-2.5 border-b text-[10px] font-semibold uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--surface-hover)" }}>
                    Pages in this batch
                  </div>
                  <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                    {batch.pages.map(page => {
                      const phc = healthConfig[page.status];
                      return (
                        <div key={page.id} className="grid grid-cols-[180px_1fr_1fr_1fr_1fr_1fr] gap-0 px-5 py-3 items-center divide-x"
                          style={{ borderColor: "var(--border)" }}>
                          <div className="flex items-center gap-2.5 pr-4">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                            <div>
                              <div className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{page.name}</div>
                              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{page.followers}</div>
                            </div>
                          </div>
                          <KpiCell value={page.revenue} sub="revenue" />
                          <KpiCell value={page.rpm} sub="RPM" />
                          <KpiCell value={page.views} sub="views" />
                          <KpiCell value={page.growth} sub="growth" highlight={page.growthRaw < 0 ? "#EF4444" : page.growthRaw > 10 ? "#4ADE80" : "var(--text)"} />
                          <div className="flex items-center justify-center">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: phc.bg, color: phc.color, border: `1px solid ${phc.border}` }}>{phc.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reallocation panel */}
      <div className="rounded-xl border p-5 mt-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>Portfolio Optimization</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: "Grow Partner A", desc: "Highest RPM at $4.82. Add 2 more lifestyle pages to this batch to capitalize on strong performance.", action: "Add Pages →", color: "#4ADE80", impact: "+$8–12K/mo" },
            { title: "Fix Money Matters", desc: "Zero revenue despite 680K followers. Enroll in Facebook monetization immediately — estimated $6K/mo uncaptured.", action: "Enable Monetization →", color: "#FBBF24", impact: "+$6K/mo" },
            { title: "Revive Partner C", desc: "Only 22 posts/month vs 167–198 average. Revenue declining 8% MoM. Increase content cadence or merge pages.", action: "Edit Batch →", color: "#EF4444", impact: "Prevent -$10K/qtr" },
          ].map(rec => (
            <div key={rec.title} className="rounded-xl p-4" style={{ backgroundColor: "var(--surface-hover)", border: `1px solid ${rec.color}25` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold" style={{ color: rec.color }}>{rec.title}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${rec.color}15`, color: rec.color }}>{rec.impact}</span>
              </div>
              <p className="text-[11px] mb-3" style={{ color: "var(--text-secondary)" }}>{rec.desc}</p>
              <button className="text-[11px] font-semibold" style={{ color: rec.color }}>{rec.action}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

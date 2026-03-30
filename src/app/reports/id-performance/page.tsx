"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

interface IdWeekData {
  week: string;
  reach: number;
}

interface IdPerformance {
  connId: string;
  name: string;
  email: string;
  fbUserId: string;
  status: "active" | "expired";
  healthScore: number;
  healthLabel: "Healthy" | "Declining" | "Replace";
  totalReach: string;
  totalReachRaw: number;
  avgReachPerPost: string;
  postsThisMonth: number;
  trend: "up" | "down" | "stable";
  weeklyData: IdWeekData[];
  topPage: string;
  topPageColor: string;
  topPageReach: string;
  worstPage: string;
  worstPageReach: string;
  recommendation: string;
}

const ID_DATA: IdPerformance[] = [
  {
    connId: "c1", name: "Taimur Asghar", email: "taimur@metareverse.com", fbUserId: "100089...",
    status: "active", healthScore: 88, healthLabel: "Healthy",
    totalReach: "4.8M", totalReachRaw: 4800000,
    avgReachPerPost: "28.4K", postsThisMonth: 169,
    trend: "up",
    weeklyData: [
      { week: "Mar 3",  reach: 980000 },
      { week: "Mar 10", reach: 1050000 },
      { week: "Mar 17", reach: 1240000 },
      { week: "Mar 24", reach: 1530000 },
    ],
    topPage: "History Uncovered", topPageColor: "#FF6B2B", topPageReach: "31.2K avg",
    worstPage: "Fitness Factory", worstPageReach: "6.8K avg",
    recommendation: "Keep as primary. Increase rotation share on top-performing pages.",
  },
  {
    connId: "c2", name: "Sarah Khan", email: "sarah@partner-a.com", fbUserId: "100092...",
    status: "active", healthScore: 72, healthLabel: "Declining",
    totalReach: "2.1M", totalReachRaw: 2100000,
    avgReachPerPost: "15.7K", postsThisMonth: 134,
    trend: "stable",
    weeklyData: [
      { week: "Mar 3",  reach: 560000 },
      { week: "Mar 10", reach: 530000 },
      { week: "Mar 17", reach: 510000 },
      { week: "Mar 24", reach: 500000 },
    ],
    topPage: "History Uncovered", topPageColor: "#FF6B2B", topPageReach: "19.8K avg",
    worstPage: "Fitness Factory", worstPageReach: "5.1K avg",
    recommendation: "Stable but slowly declining. Monitor for 2 more weeks before benching.",
  },
  {
    connId: "c3", name: "Ahmed Raza", email: "ahmed@partner-b.com", fbUserId: "100095...",
    status: "expired", healthScore: 22, healthLabel: "Replace",
    totalReach: "124K", totalReachRaw: 124000,
    avgReachPerPost: "3.9K", postsThisMonth: 32,
    trend: "down",
    weeklyData: [
      { week: "Mar 3",  reach: 48000 },
      { week: "Mar 10", reach: 38000 },
      { week: "Mar 17", reach: 24000 },
      { week: "Mar 24", reach: 14000 },
    ],
    topPage: "History Uncovered", topPageColor: "#FF6B2B", topPageReach: "3.9K avg",
    worstPage: "TechByte", worstPageReach: "—",
    recommendation: "Token expired + reach collapsed. Retire this ID and replace with fresh account.",
  },
];

function MiniSparkline({ data, color }: { data: IdWeekData[]; color: string }) {
  const max = Math.max(...data.map(d => d.reach));
  const min = Math.min(...data.map(d => d.reach));
  const range = max - min || 1;
  const w = 80, h = 28, pad = 3;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.reach - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((d.reach - min) / range) * (h - pad * 2);
        return i === data.length - 1 ? <circle key={i} cx={x} cy={y} r="2.5" fill={color} /> : null;
      })}
    </svg>
  );
}

export default function IdPerformancePage() {
  const [sortBy, setSortBy] = useState<"reach" | "health" | "posts">("reach");
  const [showRetireModal, setShowRetireModal] = useState<string | null>(null);

  const sorted = [...ID_DATA].sort((a, b) => {
    if (sortBy === "reach") return b.totalReachRaw - a.totalReachRaw;
    if (sortBy === "health") return b.healthScore - a.healthScore;
    return b.postsThisMonth - a.postsThisMonth;
  });

  const totalReach = ID_DATA.reduce((a, d) => a + d.totalReachRaw, 0);
  const topId = ID_DATA.reduce((a, b) => a.totalReachRaw > b.totalReachRaw ? a : b);

  return (
    <div>
      <Header
        title="Insights"
        subtitle="Review performance results and more."
      />

      {/* Sub-navigation */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "Overview",       href: "/reports",                active: false },
          { label: "Results",        href: "/reports/results",        active: false },
          { label: "Earnings",       href: "/reports/earnings",       active: false },
          { label: "By Posting ID",  href: "/reports/id-performance", active: true  },
          { label: "Batches", href: "/reports/batches", active: false },
        ].map((tab) => (
          <Link key={tab.label} href={tab.href} className="relative px-4 py-3 text-[13px] font-medium" style={{ color: tab.active ? "var(--primary)" : "var(--text-secondary)" }}>
            {tab.label}
            {tab.active && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
          </Link>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total IDs",        value: ID_DATA.length.toString(),                     sub: "connected accounts",              color: "var(--primary)" },
          { label: "Total Reach",      value: "7.0M",                                         sub: "this month across all IDs",       color: "#4ADE80" },
          { label: "Top Performer",    value: topId.name.split(" ")[0],                       sub: `${topId.avgReachPerPost} avg reach`, color: "var(--text)" },
          { label: "IDs to Replace",   value: ID_DATA.filter(d => d.healthLabel === "Replace").length.toString(), sub: "health score below 45", color: "#EF4444" },
        ].map(card => (
          <div key={card.label} className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{card.label}</div>
            <div className="text-[22px] font-bold mt-1 truncate" style={{ color: card.color }}>{card.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Reach share visual */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Reach Share by ID · This Month</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
          {ID_DATA.map(d => (
            <div key={d.connId} className="h-full rounded-full transition-all"
              style={{ width: `${(d.totalReachRaw / totalReach) * 100}%`, backgroundColor: d.healthLabel === "Replace" ? "#EF4444" : d.healthLabel === "Declining" ? "#FBBF24" : "#4ADE80" }} />
          ))}
        </div>
        <div className="flex items-center gap-5">
          {ID_DATA.map(d => (
            <div key={d.connId} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.healthLabel === "Replace" ? "#EF4444" : d.healthLabel === "Declining" ? "#FBBF24" : "#4ADE80" }} />
              <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{d.name.split(" ")[0]}</span>
              <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>{((d.totalReachRaw / totalReach) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-semibold" style={{ color: "var(--text-muted)" }}>
          {ID_DATA.length} posting IDs · sorted by {sortBy}
        </span>
        <div className="flex gap-1.5">
          {(["reach", "health", "posts"] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg capitalize transition-all"
              style={{ backgroundColor: sortBy === s ? "var(--primary)" : "var(--surface)", color: sortBy === s ? "white" : "var(--text-muted)", border: `1px solid ${sortBy === s ? "var(--primary)" : "var(--border)"}` }}>
              {s === "reach" ? "Total Reach" : s === "health" ? "Health Score" : "Post Volume"}
            </button>
          ))}
        </div>
      </div>

      {/* ID performance cards */}
      <div className="space-y-4">
        {sorted.map((id, rank) => {
          const healthColor = id.healthLabel === "Healthy" ? "#4ADE80" : id.healthLabel === "Declining" ? "#FBBF24" : "#EF4444";
          const trendColor = id.trend === "up" ? "#4ADE80" : id.trend === "down" ? "#EF4444" : "var(--text-muted)";
          return (
            <div key={id.connId} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: id.healthLabel === "Replace" ? "rgba(239,68,68,0.3)" : "var(--border)" }}>
              <div className="flex items-center gap-5 px-5 py-4">
                {/* Rank */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{ backgroundColor: rank === 0 ? "rgba(255,107,43,0.15)" : "var(--surface-hover)", color: rank === 0 ? "var(--primary)" : "var(--text-muted)" }}>
                  #{rank + 1}
                </div>

                {/* Identity */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-[12px]"
                  style={{ backgroundColor: healthColor }}>
                  {id.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[14px]" style={{ color: "var(--text)" }}>{id.name}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{id.fbUserId}</span>
                    {id.status === "expired" && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444" }}>EXPIRED</span>}
                  </div>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{id.email}</span>
                </div>

                {/* Health score */}
                <div className="flex flex-col items-center px-3 py-1.5 rounded-xl flex-shrink-0" style={{ backgroundColor: `${healthColor}12`, border: `1px solid ${healthColor}30` }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[18px] font-bold" style={{ color: healthColor }}>{id.healthScore}</span>
                    <span className="text-[9px] font-bold" style={{ color: healthColor }}>/100</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: healthColor }}>{id.healthLabel}</span>
                  <div className="w-14 h-1 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div className="h-full rounded-full" style={{ width: `${id.healthScore}%`, backgroundColor: healthColor }} />
                  </div>
                </div>

                {/* Key metrics */}
                <div className="flex items-center gap-5 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-[16px] font-bold" style={{ color: "#4ADE80" }}>{id.totalReach}</div>
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>total reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[16px] font-bold" style={{ color: "var(--text)" }}>{id.avgReachPerPost}</div>
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>avg/post</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[16px] font-bold" style={{ color: "var(--text)" }}>{id.postsThisMonth}</div>
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>posts/month</div>
                  </div>
                  {/* Sparkline */}
                  <div className="flex flex-col items-center gap-1">
                    <MiniSparkline data={id.weeklyData} color={trendColor} />
                    <span className="text-[9px] font-medium capitalize" style={{ color: trendColor }}>{id.trend}</span>
                  </div>
                </div>
              </div>

              {/* Bottom detail row */}
              <div className="flex items-center gap-0 border-t divide-x" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-hover)" }}>
                <div className="flex-1 px-5 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Best Page</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: id.topPageColor }} />
                    <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{id.topPage}</span>
                    <span className="text-[11px]" style={{ color: "#4ADE80" }}>{id.topPageReach}</span>
                  </div>
                </div>
                <div className="flex-1 px-5 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Worst Page</div>
                  <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{id.worstPage} <span style={{ color: "#EF4444" }}>{id.worstPageReach}</span></span>
                </div>
                <div className="flex-1 px-5 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Recommendation</div>
                  <span className="text-[11px]" style={{ color: id.healthLabel === "Replace" ? "#EF4444" : id.healthLabel === "Declining" ? "#FBBF24" : "#4ADE80" }}>{id.recommendation}</span>
                </div>
                {id.healthLabel === "Replace" && (
                  <div className="px-5 py-2.5 flex-shrink-0">
                    <button
                      onClick={() => setShowRetireModal(id.connId)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg text-white"
                      style={{ backgroundColor: "#EF4444" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                      Retire ID
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Retire confirmation modal */}
      {showRetireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="w-[440px] rounded-2xl border shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Retire this ID?</h2>
              <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
                {ID_DATA.find(d => d.connId === showRetireModal)?.name} will be removed from all rotations. This cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 rounded-xl mx-6 my-4" style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-[12px]" style={{ color: "#EF4444" }}>
                ⚠️ Retiring an ID removes it from all page rotation slots. Make sure you have replacement IDs connected before retiring.
              </p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowRetireModal(null)} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}>Cancel</button>
              <button onClick={() => setShowRetireModal(null)} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "#EF4444" }}>Confirm Retire</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

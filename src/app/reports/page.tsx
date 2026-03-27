"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SparklineChart from "@/components/SparklineChart";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import Link from "next/link";

const metricCards = [
  {
    title: "Views",
    value: "20.8K",
    change: "+2.3K%",
    changeType: "up" as const,
    sparkData: [20, 30, 25, 40, 35, 50, 45, 60, 55, 70, 65, 75, 300, 800],
    sub: [
      { label: "From followers", value: "11.8%", change: "-72.5%", changeType: "down" as const },
      { label: "From non-followers", value: "88.2%", change: "+54.7%", changeType: "up" as const },
    ],
    extra: { label: "Viewers", value: "12,433", change: "+4.9K%" },
  },
  {
    title: "Follows",
    value: "23",
    change: "+109.1%",
    changeType: "up" as const,
    sparkData: [0, 1, 0, 1, 0, 2, 1, 0, 1, 2, 1, 3, 4, 9],
    sub: [
      { label: "Unfollows", value: "110", change: "-38.9%", changeType: "down" as const },
      { label: "Net follows", value: "-87", change: "+48.5%", changeType: "up" as const },
    ],
  },
  {
    title: "Visits",
    value: "791",
    change: "+20.6%",
    changeType: "up" as const,
    sparkData: [10, 20, 30, 15, 25, 20, 35, 30, 40, 25, 50, 45, 60, 200],
    sub: [],
  },
  {
    title: "Interactions",
    value: "467",
    change: "+1.0K%",
    changeType: "up" as const,
    sparkData: [2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 8, 7, 100, 350],
    sub: [
      { label: "From followers", value: "27", change: "-15.6%", changeType: "down" as const },
      { label: "From non-followers", value: "440", change: "+4.3K%", changeType: "up" as const },
    ],
  },
  {
    title: "Videos & Reels",
    value: "90",
    change: "-67.6%",
    changeType: "down" as const,
    sparkData: [80, 60, 50, 40, 30, 20, 15, 10, 8, 6, 4, 3, 2, 1],
    sub: [
      { label: "3-second views", value: "90", change: "-67.6%", changeType: "down" as const },
      { label: "Watch time", value: "15m 23s", change: "-71.5%", changeType: "down" as const },
    ],
  },
  {
    title: "Approx. Earnings",
    value: "$1.49",
    change: "+100%",
    changeType: "up" as const,
    sparkData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.2, 0.3, 0.5, 1.49],
    sub: [],
    color: "var(--success)",
  },
];

const recentContent = [
  { title: "Kaja Kallas — Estonia's PM", views: "65.8K", reach: "45K", clicks: "7,277", earnings: "$3.88", type: "Photo" },
  { title: "Norway Health Crisis", views: "3.4K", reach: "2.6K", clicks: "94", earnings: "$0.30", type: "Photo" },
  { title: "Shirley Chisholm — 1968", views: "835", reach: "653", clicks: "10", earnings: "$0.10", type: "Photo" },
  { title: "Motley Crue — Supreme Court", views: "431", reach: "332", clicks: "4", earnings: "$0.06", type: "Photo" },
  { title: "Sojourner Truth — 1851", views: "320", reach: "231", clicks: "3", earnings: "$0.03", type: "Photo" },
];

export default function ReportingOverview() {
  const [period, setPeriod] = useState("28d");
  const [platform, setPlatform] = useState("facebook");

  return (
    <div>
      <Header
        title="Insights"
        subtitle="Review performance results and more."
        actions={
          <div className="flex items-center gap-3">
            <PlatformSwitcher active={platform} onChange={setPlatform} />
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
              {["7d", "28d", "90d"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium"
                  style={{
                    backgroundColor: period === p ? "var(--bg)" : "transparent",
                    color: period === p ? "var(--text)" : "var(--text-secondary)",
                    boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Sub-navigation */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "Overview", href: "/reports", active: true },
          { label: "Results", href: "/reports/results", active: false },
          { label: "Earnings", href: "/reports/earnings", active: false },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="relative px-4 py-3 text-[13px] font-medium"
            style={{ color: tab.active ? "var(--primary)" : "var(--text-secondary)" }}
          >
            {tab.label}
            {tab.active && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
          </Link>
        ))}
      </div>

      {/* Performance heading */}
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1877F2" }}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Performance</span>
        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Feb 27, 2026 – Mar 26, 2026</span>
      </div>

      {/* Metric Cards Grid — 2 columns */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {metricCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border p-5 group cursor-pointer"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>{card.title}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-[28px] font-bold tracking-tight" style={{ color: "var(--text)" }}>{card.value}</span>
                  <span className="text-[12px] font-semibold" style={{ color: card.changeType === "up" ? "var(--success)" : "var(--error)" }}>
                    {card.changeType === "up" ? "↑" : "↓"} {card.change}
                  </span>
                </div>
              </div>
              {/* Sparkline */}
              <div className="w-28 mt-2">
                <SparklineChart data={card.sparkData} color={card.color || "var(--primary)"} height={36} />
              </div>
            </div>

            {/* Sub-metrics */}
            {card.sub.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {card.sub.map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: "var(--text-muted)" }}>
                      {s.label} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", display: "inline", verticalAlign: "middle" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </span>
                    <span>
                      <span className="font-medium" style={{ color: "var(--text)" }}>{s.value}</span>
                      <span className="ml-2 font-medium" style={{ color: s.changeType === "up" ? "var(--success)" : "var(--error)" }}>
                        {s.changeType === "up" ? "↑" : "↓"} {s.change}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Extra metric (Viewers) */}
            {card.extra && (
              <div className="flex items-center justify-between text-[12px] mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--text-muted)" }}>
                  {card.extra.label} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", display: "inline", verticalAlign: "middle" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </span>
                <span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>{card.extra.value}</span>
                  <span className="ml-2 font-medium" style={{ color: "var(--success)" }}>↑ {card.extra.change}</span>
                </span>
              </div>
            )}

            {/* Chevron */}
            <div className="flex justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1877F2" }}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Recent content</h3>
          </div>
          <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg)", color: "var(--text-secondary)" }}>
            See all content
          </button>
        </div>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
              <th className="px-5 py-3 font-medium">Post</th>
              <th className="px-5 py-3 font-medium text-right">Views</th>
              <th className="px-5 py-3 font-medium text-right">Reach</th>
              <th className="px-5 py-3 font-medium text-right">Clicks</th>
              <th className="px-5 py-3 font-medium text-right">Earnings</th>
              <th className="px-5 py-3 font-medium">Type</th>
            </tr>
          </thead>
          <tbody>
            {recentContent.map((post, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--surface-active)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <div className="text-[12px] font-medium line-clamp-1" style={{ color: "var(--text)" }}>{post.title}</div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{post.views}</td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{post.reach}</td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{post.clicks}</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums" style={{ color: "var(--success)" }}>{post.earnings}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--surface-active)", color: "var(--text-muted)" }}>{post.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

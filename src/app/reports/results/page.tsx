"use client";
import { useState } from "react";
import Header from "@/components/Header";
import LineChart from "@/components/LineChart";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import Link from "next/link";

// Generate 28-day date labels
const dates = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(2026, 1, 27 + i); // Feb 27 - Mar 26
  return `${d.toLocaleDateString("en-US", { month: "short" })} ${d.getDate()}`;
});

const chartSections = [
  {
    title: "Views",
    value: "20.8K",
    change: "+2.3K%",
    changeType: "up" as const,
    info: "Total number of times your content was displayed",
    data: [120, 90, 100, 85, 95, 110, 130, 88, 105, 92, 78, 100, 115, 95, 88, 135, 420, 890, 1200, 3500, 8500, 2100, 980, 650, 520, 380, 290, 250],
    color: "var(--primary)",
  },
  {
    title: "Viewers",
    value: "12.4K",
    change: "+4.9K%",
    changeType: "up" as const,
    info: "Unique people who viewed your content",
    data: [80, 65, 72, 60, 68, 75, 90, 62, 74, 65, 55, 70, 80, 68, 62, 95, 300, 650, 880, 2500, 6200, 1500, 700, 460, 370, 270, 200, 180],
    color: "#8B5CF6",
  },
  {
    title: "Content Interactions",
    value: "467",
    change: "+1.0K%",
    changeType: "up" as const,
    info: "Reactions, comments, shares, and saves",
    data: [2, 1, 3, 1, 2, 3, 4, 1, 2, 1, 1, 2, 3, 2, 1, 4, 12, 28, 45, 80, 180, 50, 22, 15, 12, 8, 6, 5],
    color: "#14B8A6",
  },
  {
    title: "Link Clicks",
    value: "48",
    change: "-80.2%",
    changeType: "down" as const,
    info: "Clicks on links in your posts",
    data: [8, 12, 15, 10, 14, 11, 8, 6, 4, 3, 2, 1, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    color: "#F59E0B",
  },
  {
    title: "Visits",
    value: "791",
    change: "+20.6%",
    changeType: "up" as const,
    info: "Number of times your Page was visited",
    data: [15, 20, 18, 22, 25, 20, 30, 18, 25, 20, 16, 22, 28, 22, 18, 35, 55, 80, 120, 180, 45, 30, 25, 20, 18, 15, 12, 10],
    color: "#EC4899",
  },
  {
    title: "Follows",
    value: "23",
    change: "+109.1%",
    changeType: "up" as const,
    info: "New followers gained during this period",
    data: [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 2, 3, 5, 9, 4, 2, 1, 1, 0, 1, 0],
    color: "#6366F1",
  },
];

export default function ResultsPage() {
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
                <button key={p} onClick={() => setPeriod(p)} className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium" style={{
                  backgroundColor: period === p ? "var(--bg)" : "transparent",
                  color: period === p ? "var(--text)" : "var(--text-secondary)",
                  boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                }}>{p}</button>
              ))}
            </div>
          </div>
        }
      />

      {/* Sub-navigation */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "Overview", href: "/reports", active: false },
          { label: "Results", href: "/reports/results", active: true },
          { label: "Earnings", href: "/reports/earnings", active: false },
        ].map((tab) => (
          <Link key={tab.label} href={tab.href} className="relative px-4 py-3 text-[13px] font-medium" style={{ color: tab.active ? "var(--primary)" : "var(--text-secondary)" }}>
            {tab.label}
            {tab.active && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
          </Link>
        ))}
      </div>

      {/* Goal CTA */}
      <div className="rounded-xl border p-4 mb-6 flex items-center justify-between" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--primary-muted)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--primary)" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Set a goal, track progress and learn helpful tips for your professional success.</div>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>Start new goal</button>
      </div>

      {/* Chart Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        {chartSections.map((section) => (
          <div key={section.title} className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>{section.title}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <button className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-[24px] font-bold tracking-tight" style={{ color: "var(--text)" }}>{section.value}</span>
              <span className="text-[12px] font-semibold" style={{ color: section.changeType === "up" ? "var(--success)" : "var(--error)" }}>
                {section.changeType === "up" ? "↑" : "↓"} {section.change}
              </span>
            </div>

            <div className="h-[180px] relative" style={{ marginLeft: "30px" }}>
              <LineChart
                data={section.data.map((v, i) => ({ label: dates[i], value: v }))}
                color={section.color}
                height={180}
                formatValue={(v) => {
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
                  return v.toFixed(0);
                }}
              />
            </div>

            <div className="flex items-center justify-center mt-3 gap-2">
              <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: section.color }} />
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{section.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Header from "@/components/Header";
import LineChart from "@/components/LineChart";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import PageBatchSelector from "@/components/PageBatchSelector";
import Link from "next/link";
import { getResultsCharts, getDateLabels, type Period, type Platform } from "@/data/reportingData";

export default function ResultsPage() {
  const [period, setPeriod] = useState<Period>("28d");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [selectedScope, setSelectedScope] = useState("all");

  const charts = getResultsCharts(period, platform);
  const dates = getDateLabels(period);

  const handleExport = (title: string, data: number[]) => {
    const csv = "Date," + title + "\n" + data.map((v, i) => `${dates[i]},${v}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "_")}_${period}_${platform}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Header
        title="Insights"
        subtitle="Review performance results and more."
        actions={
          <div className="flex items-center gap-3">
            <PageBatchSelector selected={selectedScope} onChange={(id) => setSelectedScope(id)} />
            <PlatformSwitcher active={platform} onChange={(p) => setPlatform(p as Platform)} />
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
              {(["7d", "28d", "90d"] as Period[]).map((p) => (
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

      {/* Chart Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        {charts.map((section) => (
          <div key={section.title} className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>{section.title}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <button
                onClick={() => handleExport(section.title, section.data)}
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}
              >
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
                data={section.data.map((v, i) => ({ label: dates[i] || `Day ${i+1}`, value: v }))}
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

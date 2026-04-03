"use client";
import { useState } from "react";
import Header from "@/components/Header";
import LineChart from "@/components/LineChart";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import PageBatchSelector from "@/components/PageBatchSelector";
import Link from "next/link";
import { getEarningsData, getDateLabels, getTopContent, type Period, type Platform, type ScopeType } from "@/data/reportingData";

export default function EarningsPage() {
  const [period, setPeriod] = useState<Period>("28d");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [activeType, setActiveType] = useState("total");
  const [selectedScope, setSelectedScope] = useState("all");
  const [scopeType, setScopeType] = useState<ScopeType>("all");

  const earningsTypes = getEarningsData(period, platform, selectedScope, scopeType);
  const dates = getDateLabels(period);
  const topContent = getTopContent(platform);
  const activeData = earningsTypes.find(e => e.key === activeType) || earningsTypes[0];

  return (
    <div>
      <Header
        title="Insights"
        subtitle="Review performance results and more."
        actions={
          <div className="flex items-center gap-3">
            <PageBatchSelector selected={selectedScope} onChange={(id, type) => { setSelectedScope(id); setScopeType(type); }} />
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
          { label: "Results", href: "/reports/results", active: false },
          { label: "Earnings", href: "/reports/earnings", active: true },
          { label: "By Posting ID", href: "/reports/id-performance", active: false },
          { label: "Batches", href: "/reports/batches", active: false },
        ].map((tab) => (
          <Link key={tab.label} href={tab.href} className="relative px-4 py-3 text-[13px] font-medium" style={{ color: tab.active ? "var(--primary)" : "var(--text-secondary)" }}>
            {tab.label}
            {tab.active && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
          </Link>
        ))}
      </div>

      {/* Earnings Content */}
      <div className="rounded-xl border overflow-hidden mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="p-5">
          {/* Earnings type selector */}
          <div className="flex items-stretch gap-0 mb-6 rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            {earningsTypes.map((type, i) => (
              <button
                key={type.key}
                onClick={() => setActiveType(type.key)}
                className="flex-1 px-4 py-3 text-left relative"
                style={{
                  backgroundColor: activeType === type.key ? "var(--bg)" : "transparent",
                  borderRight: i < earningsTypes.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                {activeType === type.key && (
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "var(--primary)" }} />
                )}
                <div className="text-[11px] font-medium mb-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  {type.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[20px] font-bold" style={{ color: "var(--text)" }}>{type.value}</span>
                  {type.change !== "0%" && (
                    <span className="text-[11px] font-medium" style={{ color: type.changeType === "up" ? "var(--success)" : "var(--error)" }}>
                      ↑ {type.change}
                    </span>
                  )}
                  {type.change === "0%" && (
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>0%</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Earnings chart */}
          <div className="h-[220px] relative" style={{ marginLeft: "40px" }}>
            <LineChart
              data={activeData.data.map((v, i) => ({ label: dates[i] || `Day ${i+1}`, value: v }))}
              color="var(--success)"
              height={220}
              formatValue={(v) => `$${v.toFixed(2)}`}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {[
              { color: "var(--success)", label: "Total", key: "total" },
              { color: "#A78BFA", label: "Photos", key: "photos" },
              { color: "#818CF8", label: "Reels", key: "reels" },
              { color: "#F472B6", label: "Stories", key: "stories" },
              { color: "#FB923C", label: "Text", key: "text" },
            ].map((l) => (
              <button
                key={l.label}
                onClick={() => setActiveType(l.key)}
                className="flex items-center gap-1.5"
                style={{ opacity: activeType === l.key ? 1 : 0.5 }}
              >
                <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Content by Earnings */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Top content</h3>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>based on approximate content monetization earnings</div>
          </div>
          <Link href="/reports/page" className="text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg)", color: "var(--text-secondary)" }}>
            See all content
          </Link>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-6 gap-3">
            {topContent.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square rounded-lg mb-2 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "var(--surface-active)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: i === 0 ? "var(--success)" : "var(--surface)", color: i === 0 ? "#000" : "var(--text-muted)" }}>{i + 1}</div>
                </div>
                <div className="text-[10px] font-medium line-clamp-2" style={{ color: "var(--text-secondary)" }}>{item.title}</div>
                <div className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--success)" }}>{item.earnings}</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.views} views</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

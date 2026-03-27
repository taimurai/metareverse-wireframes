"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SparklineChart from "@/components/SparklineChart";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import PageBatchSelector from "@/components/PageBatchSelector";
import Link from "next/link";
import { getOverviewMetrics, getPageRevenue, getAggregateRevenue, getFilteredPageRevenue, getRecentPosts, type Period, type Platform, type ScopeType } from "@/data/reportingData";

export default function ReportingOverview() {
  const [period, setPeriod] = useState<Period>("28d");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [selectedScope, setSelectedScope] = useState("all");
  const [scopeType, setScopeType] = useState<"all" | "page" | "batch">("all");

  const metrics = getOverviewMetrics(period, platform, selectedScope, scopeType);
  const allPageRevenue = getPageRevenue(period);
  const pageRevenue = getFilteredPageRevenue(selectedScope, scopeType, allPageRevenue);
  const aggRevenue = getAggregateRevenue(period, selectedScope, scopeType);
  const recentPosts = getRecentPosts(platform);

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
          { label: "Overview", href: "/reports", active: true },
          { label: "Results", href: "/reports/results", active: false },
          { label: "Earnings", href: "/reports/earnings", active: false },
        ].map((tab) => (
          <Link key={tab.label} href={tab.href} className="relative px-4 py-3 text-[13px] font-medium" style={{ color: tab.active ? "var(--primary)" : "var(--text-secondary)" }}>
            {tab.label}
            {tab.active && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
          </Link>
        ))}
      </div>

      {/* Cross-Page Revenue Aggregation */}
      <div className="rounded-xl border p-6 mb-6 relative overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="absolute top-0 right-0 w-96 h-full opacity-[0.05]" style={{ background: "radial-gradient(circle at top right, var(--success), transparent 70%)" }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>OWNER ONLY</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {scopeType === "all" ? "Cross-Page Revenue" : scopeType === "batch" ? "Batch Revenue" : "Page Revenue"}
              </span>
            </div>
            <Link href="/reports/earnings" className="text-[12px] font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
              Full Earnings →
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-6 mb-5">
            <div>
              <div className="text-[32px] font-bold tracking-tight" style={{ color: "var(--text)" }}>{aggRevenue.weekly}</div>
              <div className="text-[12px]" style={{ color: "var(--text-secondary)" }}>This week</div>
              <div className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--success)" }}>{aggRevenue.weeklyChange}</div>
            </div>
            <div>
              <div className="text-[22px] font-bold" style={{ color: "var(--text)" }}>{aggRevenue.monthly}</div>
              <div className="text-[12px]" style={{ color: "var(--text-secondary)" }}>This month</div>
              <div className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--success)" }}>{aggRevenue.monthlyChange}</div>
            </div>
            <div>
              <div className="text-[22px] font-bold" style={{ color: "var(--text)" }}>{aggRevenue.rpm}</div>
              <div className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Avg RPM</div>
              <div className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--success)" }}>{aggRevenue.rpmChange}</div>
            </div>
            <div>
              <div className="text-[22px] font-bold" style={{ color: "var(--text)" }}>{aggRevenue.monetized}</div>
              <div className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Monetized Pages</div>
              <div className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--warning)" }}>{aggRevenue.notEnrolled}</div>
            </div>
            <div>
              <div className="text-[22px] font-bold" style={{ color: "var(--text)" }}>{aggRevenue.ninetyDay}</div>
              <div className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Last 90 days</div>
              <div className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--success)" }}>{aggRevenue.ninetyDayChange}</div>
            </div>
          </div>

          <div className="space-y-2">
            {pageRevenue.map((page) => (
              <div key={page.name} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                <div className="w-32 truncate text-[12px] font-medium" style={{ color: "var(--text)" }}>{page.name}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "var(--surface)" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(page.pct, 100)}%`, backgroundColor: page.monetized ? page.color : "var(--text-muted)" }} />
                  </div>
                  <span className="text-[10px] w-8 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>{page.pct > 0 ? `${page.pct}%` : "—"}</span>
                </div>
                <div className="w-16 text-right text-[12px] font-semibold tabular-nums" style={{ color: page.monetized ? "var(--success)" : "var(--text-muted)" }}>{page.revenue}</div>
                <div className="w-16 text-right text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>RPM {page.rpm}</div>
                <div className="w-14 text-right text-[11px] font-medium tabular-nums" style={{ color: page.changeType === "up" ? "var(--success)" : "var(--error)" }}>{page.change}</div>
                {!page.monetized && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>Not enrolled</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance heading */}
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: platform === "facebook" ? "#1877F2" : platform === "instagram" ? "#E4405F" : "#000" }}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Performance</span>
        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {period === "7d" ? "Mar 20 – Mar 26, 2026" : period === "28d" ? "Feb 27 – Mar 26, 2026" : "Dec 27, 2025 – Mar 26, 2026"}
        </span>
      </div>

      {/* Metric Cards Grid — 2 columns */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {metrics.map((card) => (
          <Link
            key={card.title}
            href="/reports/results"
            className="rounded-xl border p-5 group cursor-pointer block"
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
              <div className="w-28 mt-2">
                <SparklineChart data={card.sparkData} color={card.color || "var(--primary)"} height={36} />
              </div>
            </div>

            {card.sub.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {card.sub.map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: "var(--text-muted)" }}>{s.label}</span>
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

            {card.extra && (
              <div className="flex items-center justify-between text-[12px] mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--text-muted)" }}>{card.extra.label}</span>
                <span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>{card.extra.value}</span>
                  <span className="ml-2 font-medium" style={{ color: "var(--success)" }}>↑ {card.extra.change}</span>
                </span>
              </div>
            )}

            <div className="flex justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Content */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Recent content</h3>
          <Link href="/reports/page" className="text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg)", color: "var(--text-secondary)" }}>See all content</Link>
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
            {recentPosts.slice(0, 5).map((post, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--surface-active)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <div className="text-[12px] font-medium line-clamp-1" style={{ color: "var(--text)" }}>{post.caption}</div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{post.views}</td>
                <td className="px-5 py-3.5 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{post.reach}</td>
                <td className="px-5 py-3.5 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{post.clicks}</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums" style={{ color: "var(--success)" }}>{post.revenue}</td>
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

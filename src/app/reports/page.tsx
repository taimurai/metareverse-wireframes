"use client";
import { useState } from "react";
import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import Link from "next/link";

const pageReports = [
  { name: "Laugh Central", avatar: "LC", color: "#8B5CF6", views: "24.5M", engagement: "6.8%", reach: "18.2M", revenue: "$4,690", rpm: "$10.20", change: "+31%", changeType: "up" as const, posts: 312, monetized: true },
  { name: "History Uncovered", avatar: "HU", color: "#FF6B2B", views: "18.2M", engagement: "4.2%", reach: "12.1M", revenue: "$3,842", rpm: "$9.12", change: "+12%", changeType: "up" as const, posts: 284, monetized: true },
  { name: "TechByte", avatar: "TB", color: "#14B8A6", views: "9.1M", engagement: "2.9%", reach: "6.8M", revenue: "$2,180", rpm: "$8.95", change: "-3%", changeType: "down" as const, posts: 196, monetized: true },
  { name: "Money Matters", avatar: "MM", color: "#F59E0B", views: "7.4M", engagement: "2.1%", reach: "5.9M", revenue: "—", rpm: "—", change: "-1%", changeType: "down" as const, posts: 178, monetized: false },
  { name: "Daily Health Tips", avatar: "DH", color: "#6366F1", views: "5.6M", engagement: "3.8%", reach: "4.2M", revenue: "$1,245", rpm: "$7.80", change: "+8%", changeType: "up" as const, posts: 156, monetized: true },
  { name: "Fitness Factory", avatar: "FF", color: "#EC4899", views: "3.2M", engagement: "5.1%", reach: "2.4M", revenue: "$890", rpm: "$6.40", change: "+22%", changeType: "up" as const, posts: 134, monetized: true },
  { name: "Parenting Hub", avatar: "PH", color: "#06B6D4", views: "1.8M", engagement: "4.5%", reach: "1.2M", revenue: "—", rpm: "—", change: "+5%", changeType: "up" as const, posts: 89, monetized: false },
];

export default function ReportingOverview() {
  const [period, setPeriod] = useState("7d");

  return (
    <div>
      <Header
        title="Reporting Overview"
        subtitle="Performance summary across all connected pages"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
              {["7d", "30d", "90d"].map((p) => (
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

      {/* Revenue Hero */}
      <div className="rounded-xl border p-6 mb-6 relative overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="absolute top-0 right-0 w-96 h-full opacity-[0.05]" style={{ background: "radial-gradient(circle at top right, var(--primary), transparent 70%)" }} />
        <div className="relative">
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Total Revenue</div>
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="text-[36px] font-bold tracking-tight" style={{ color: "var(--text)" }}>$12,847</div>
              <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>This week</div>
              <div className="text-[12px] font-semibold mt-1" style={{ color: "var(--success)" }}>+14% vs last week</div>
            </div>
            <div>
              <div className="text-[24px] font-bold" style={{ color: "var(--text)" }}>$48,392</div>
              <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>This month</div>
              <div className="text-[12px] font-semibold mt-1" style={{ color: "var(--success)" }}>+9% vs last month</div>
            </div>
            <div>
              <div className="text-[24px] font-bold" style={{ color: "var(--text)" }}>$8.42</div>
              <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Average RPM</div>
              <div className="text-[12px] font-semibold mt-1" style={{ color: "var(--success)" }}>+$0.38 vs last week</div>
            </div>
            <div>
              <div className="text-[24px] font-bold" style={{ color: "var(--text)" }}>5 / 7</div>
              <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Monetized Pages</div>
              <div className="text-[12px] font-semibold mt-1" style={{ color: "var(--warning)" }}>2 pages not enrolled</div>
            </div>
          </div>

          {/* Mini revenue chart placeholder */}
          <div className="mt-6 h-24 rounded-xl flex items-end gap-1 px-2" style={{ backgroundColor: "var(--bg)" }}>
            {[35, 42, 38, 55, 48, 62, 58, 71, 65, 78, 72, 85, 80, 92].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i >= 12 ? "var(--primary)" : "rgba(255, 107, 43, 0.3)" }} />
            ))}
          </div>
          <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
            <span>2 weeks ago</span><span>1 week ago</span><span>Today</span>
          </div>
        </div>
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
          label="Total Views" value="68.8M" change="14%" changeType="up"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>}
          label="Avg Engagement" value="4.2%" change="0.3%" changeType="up"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Total Reach" value="50.8M" change="2%" changeType="down"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>}
          label="Total Shares" value="234K" change="18%" changeType="up"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          label="Posts Published" value="1,349" change="11%" changeType="up"
        />
      </div>

      {/* Page-by-Page Performance */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Page Performance</h3>
          <div className="flex items-center gap-2">
            <select className="text-[12px] px-3 py-1.5 rounded-lg border outline-none" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text-secondary)" }}>
              <option>Sort: Revenue ↓</option>
              <option>Sort: Views ↓</option>
              <option>Sort: Engagement ↓</option>
              <option>Sort: Change ↓</option>
            </select>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {pageReports.map((page) => (
            <Link
              key={page.name}
              href="/reports/page"
              className="flex items-center px-5 py-4 transition-colors"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {/* Page info */}
              <div className="flex items-center gap-3 w-52">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{page.name}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{page.posts} posts</div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex-1 grid grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-[12px] font-medium tabular-nums" style={{ color: "var(--text)" }}>{page.views}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Views</div>
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-medium tabular-nums" style={{ color: "var(--text)" }}>{page.engagement}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-medium tabular-nums" style={{ color: "var(--text)" }}>{page.reach}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Reach</div>
                </div>
                <div className="text-center">
                  {page.monetized ? (
                    <>
                      <div className="text-[12px] font-semibold tabular-nums" style={{ color: "var(--success)" }}>{page.revenue}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>RPM {page.rpm}</div>
                    </>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--surface-active)", color: "var(--text-muted)" }}>Not enrolled</span>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-semibold tabular-nums" style={{ color: page.changeType === "up" ? "var(--success)" : "var(--error)" }}>{page.change}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>vs prev</div>
                </div>
              </div>

              {/* Mini bar */}
              <div className="w-24 ml-4">
                <div className="h-2 rounded-full" style={{ backgroundColor: "var(--bg)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(parseInt(page.views) / 25) * 100}%`, backgroundColor: page.color, maxWidth: "100%" }} />
                </div>
              </div>

              {/* Arrow */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-4 flex-shrink-0" style={{ color: "var(--text-muted)" }}><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

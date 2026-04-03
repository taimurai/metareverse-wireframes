"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { useRole } from "@/contexts/RoleContext";
import { BATCH_CONFIG } from "@/contexts/RoleContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import AlertBanner from "@/components/AlertBanner";
import ConnectFacebookModal from "@/components/modals/ConnectFacebookModal";
import ReconnectModal from "@/components/modals/ReconnectModal";
import RetryModal from "@/components/modals/RetryModal";
import { useFakeLoading } from "@/hooks/useFakeLoading";
import DashboardLoading from "./loading";

// Page health data
const ALL_PAGES = [
  { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6", followers: "3.2M", revenue: 4690, rpm: 10.20, rpmChange: 31, views7d: 24200000, viewsChange: 18, queueNext24h: 8, failedPosts: 0, status: "healthy" as const, tokenDays: 58 },
  { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M", revenue: 3842, rpm: 9.12, rpmChange: 12, views7d: 18500000, viewsChange: 5, queueNext24h: 6, failedPosts: 0, status: "healthy" as const, tokenDays: 58 },
  { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6", followers: "1.1M", revenue: 2180, rpm: 8.95, rpmChange: -3, views7d: 8700000, viewsChange: -8, queueNext24h: 4, failedPosts: 0, status: "attention" as const, tokenDays: 5 },
  { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K", revenue: 1245, rpm: 7.80, rpmChange: 8, views7d: 3200000, viewsChange: 2, queueNext24h: 3, failedPosts: 0, status: "healthy" as const, tokenDays: 42 },
  { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899", followers: "310K", revenue: 890, rpm: 6.40, rpmChange: 22, views7d: 2100000, viewsChange: 15, queueNext24h: 2, failedPosts: 0, status: "healthy" as const, tokenDays: 42 },
  { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B", followers: "680K", revenue: 0, rpm: 0, rpmChange: 0, views7d: 5400000, viewsChange: -15, queueNext24h: 0, failedPosts: 3, status: "critical" as const, tokenDays: 0 },
  { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9", followers: "136", revenue: 4.45, rpm: 0.23, rpmChange: 100, views7d: 21000, viewsChange: 42, queueNext24h: 1, failedPosts: 0, status: "healthy" as const, tokenDays: 30 },
];

const FAILED_POSTS = [
  { id: "f1", page: "Money Matters", avatar: "MM", color: "#F59E0B", caption: "5 Investment Tips for 2025...", time: "2h ago", error: "Token expired", platforms: "FB + IG" },
  { id: "f2", page: "Money Matters", avatar: "MM", color: "#F59E0B", caption: "How to Save $10K This Year...", time: "5h ago", error: "Token expired", platforms: "FB" },
  { id: "f3", page: "Money Matters", avatar: "MM", color: "#F59E0B", caption: "Crypto Market Update...", time: "8h ago", error: "Token expired", platforms: "FB + IG + TH" },
  { id: "f4", page: "TechByte", avatar: "TB", color: "#14B8A6", caption: "AI Revolution: What's Next...", time: "1d ago", error: "Rate limited", platforms: "FB" },
];

const PAGE_HEALTH_DATA: Record<string, { monetization: "eligible" | "restricted" | "suspended"; flags: number; copyrightStrikes: number; distributionRestricted: boolean; payoutStatus: "on_time" | "pending" | "on_hold" }> = {
  lc:  { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
  hu:  { monetization: "eligible",   flags: 1, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
  tb:  { monetization: "restricted", flags: 0, copyrightStrikes: 1, distributionRestricted: true,  payoutStatus: "pending" },
  dh:  { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
  ff:  { monetization: "eligible",   flags: 2, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
  mm:  { monetization: "suspended",  flags: 3, copyrightStrikes: 1, distributionRestricted: true,  payoutStatus: "on_hold" },
  khn: { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
};

type KpiPeriod = "today" | "yesterday" | "7d" | "28d";
const KPI_PERIOD_DATA: Record<KpiPeriod, { revenue: number; revenueChange: string; rpm: number; rpmChange: string; views: number; viewsChange: string }> = {
  today:     { revenue: 1842,    revenueChange: "+$312 vs yesterday", rpm: 8.94, rpmChange: "+$0.12 vs yesterday", views: 8700000,   viewsChange: "+3%"  },
  yesterday: { revenue: 1530,    revenueChange: "+$214 vs prior day", rpm: 8.82, rpmChange: "+$0.05 vs prior day", views: 8200000,   viewsChange: "+1%"  },
  "7d":      { revenue: 12851,   revenueChange: "↑ 14%",             rpm: 9.05, rpmChange: "↑ $0.38",             rpm_sub: "5 of 7 pages monetized", views: 62100000,  viewsChange: "↑ 8%"  },
  "28d":     { revenue: 48392,   revenueChange: "↑ 9%",              rpm: 9.21, rpmChange: "↑ $0.82",             views: 224000000, viewsChange: "↑ 12%" },
} as any;
const PERIOD_LABEL: Record<KpiPeriod, string> = { today: "Today so far", yesterday: "Yesterday", "7d": "Last 7 Days", "28d": "Last 28 Days" };

const VIRAL_POSTS = [
  { id: "v1", page: "Laugh Central", avatar: "LC", color: "#8B5CF6", caption: "Monday morning energy hits different when you've had 3 coffees...", views: "2.4M", baseline: "180K", multiplier: "13x", platform: "FB", hoursAgo: 3 },
  { id: "v2", page: "History Uncovered", avatar: "HU", color: "#FF6B2B", caption: "The forgotten queen who ruled an empire for 40 years...", views: "890K", baseline: "95K", multiplier: "9x", platform: "FB+IG", hoursAgo: 6 },
  { id: "v3", page: "Know Her Name", avatar: "KH", color: "#0EA5E9", caption: "Marie Curie was told women couldn't be scientists. She won two Nobel Prizes...", views: "340K", baseline: "38K", multiplier: "9x", platform: "FB", hoursAgo: 11 },
];

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function Dashboard() {
  const { role, batch, config } = useRole();
  const isMobile = useIsMobile();
  const isLoading = useFakeLoading();
  const [showTokenBanner, setShowTokenBanner] = useState(true);
  const [showDisconnectBanner, setShowDisconnectBanner] = useState(true);
  const [reconnectModal, setReconnectModal] = useState(false);
  const [retryModal, setRetryModal] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const [pageSearch, setPageSearch] = useState("");
  const [selectedTablePages, setSelectedTablePages] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [bulkTagInput, setBulkTagInput] = useState("");
  const [kpiPeriod, setKpiPeriod] = useState<KpiPeriod>("7d");

  const totalRevenue = ALL_PAGES.reduce((s, p) => s + p.revenue, 0);
  const avgRpm = ALL_PAGES.filter(p => p.rpm > 0).reduce((s, p, _, a) => s + p.rpm / a.length, 0);
  const totalFailed = FAILED_POSTS.length;
  const criticalPages = ALL_PAGES.filter(p => p.status === "critical");
  const attentionPages = ALL_PAGES.filter(p => p.status === "attention");
  const healthyPages = ALL_PAGES.filter(p => p.status === "healthy");
  const emptyQueues = ALL_PAGES.filter(p => p.queueNext24h === 0);
  const expiringTokens = ALL_PAGES.filter(p => p.tokenDays > 0 && p.tokenDays <= 7);
  const totalViews7d = ALL_PAGES.reduce((s, p) => s + p.views7d, 0);
  const monetizedViews = Math.round(totalViews7d * 0.504);
  const totalScheduled = ALL_PAGES.reduce((s, p) => s + p.queueNext24h, 0);

  const toggleTablePage = (id: string) => {
    setSelectedTablePages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const selectAllTablePages = () => {
    const filtered = [...ALL_PAGES].filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()));
    if (selectedTablePages.size === filtered.length) {
      setSelectedTablePages(new Set());
    } else {
      setSelectedTablePages(new Set(filtered.map(p => p.id)));
    }
  };

  if (isLoading) return <DashboardLoading />;

  if (isMobile) {
    const totalQueueToday = ALL_PAGES.reduce((s, p) => s + p.queueNext24h, 0);
    return (
      <div className="px-4 py-4 space-y-4">
        {/* Revenue hero card */}
        <div className="rounded-xl p-4 relative overflow-hidden" style={{ backgroundColor: "#2D2D44", border: "1px solid #3A3A52" }}>
          <div className="absolute top-0 right-0 w-24 h-full opacity-[0.08]" style={{ background: "radial-gradient(circle at top right, #4ADE80, transparent 70%)" }} />
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#9494A8" }}>Revenue This Week</div>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold" style={{ color: "#F0F0F5" }}>${totalRevenue.toLocaleString()}</span>
            <span className="text-[12px] font-semibold" style={{ color: "#4ADE80" }}>↑ 14%</span>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#9494A8" }}>Avg RPM</div>
              <div className="text-[16px] font-bold" style={{ color: "#F0F0F5" }}>${avgRpm.toFixed(2)}</div>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: "#3A3A52" }} />
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#9494A8" }}>Pages</div>
              <div className="text-[16px] font-bold" style={{ color: "#F0F0F5" }}>{ALL_PAGES.length}</div>
            </div>
          </div>
        </div>

        {/* Failed posts alert */}
        {totalFailed > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span className="text-[13px] font-semibold" style={{ color: "#F0F0F5" }}>{totalFailed} posts failed</span>
            </div>
            <a href="/failed-posts" className="text-[12px] font-semibold px-3 py-1 rounded-lg text-white" style={{ backgroundColor: "#EF4444" }}>View</a>
          </div>
        )}

        {/* Token expiry warning */}
        {expiringTokens.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span className="text-[13px] font-semibold" style={{ color: "#F0F0F5" }}>{expiringTokens[0].name} token expires in {expiringTokens[0].tokenDays}d</span>
            </div>
          </div>
        )}

        {/* Page health dots */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#9494A8" }}>Page Health</div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {ALL_PAGES.map(page => (
              <div key={page.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: page.color }}>
                    {page.avatar}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{
                      backgroundColor: page.status === "healthy" ? "#4ADE80" : page.status === "attention" ? "#FBBF24" : "#EF4444",
                      borderColor: "#1A1A2E",
                    }}
                  />
                </div>
                <span className="text-[9px] text-center max-w-[44px] leading-tight" style={{ color: "#9494A8" }}>
                  {page.avatar}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Queue */}
        <div className="rounded-xl p-4" style={{ backgroundColor: "#2D2D44", border: "1px solid #3A3A52" }}>
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#9494A8" }}>Today&apos;s Queue</div>
            <a href="/queue" className="text-[11px] font-medium" style={{ color: "#FF6B2B" }}>View →</a>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-[28px] font-bold" style={{ color: "#F0F0F5" }}>{totalQueueToday}</span>
            <span className="text-[13px]" style={{ color: "#9494A8" }}>posts scheduled today</span>
          </div>
          <div className="text-[11px] mt-1" style={{ color: "#9494A8" }}>across {ALL_PAGES.filter(p => p.queueNext24h > 0).length} pages</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Alert Banners */}
      {showDisconnectBanner && (
        <AlertBanner
          type="danger"
          message="Money Matters disconnected. 3 posts failed, 0 scheduled."
          action="Reconnect"
          onAction={() => setReconnectModal(true)}
          onDismiss={() => setShowDisconnectBanner(false)}
        />
      )}
      {showTokenBanner && (
        <AlertBanner
          type="warning"
          message="TechByte token expires in 5 days. Reconnect to avoid interruptions."
          action="Reconnect"
          onAction={() => setReconnectModal(true)}
          onDismiss={() => setShowTokenBanner(false)}
        />
      )}

      <Header
        title="Control Center"
        subtitle={`${ALL_PAGES.length} pages · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`}
        actions={
          <button
            onClick={() => setConnectModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Connect Page
          </button>
        }
      />

      {/* Batch context banner for non-Owner roles */}
      {role !== "owner" && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: BATCH_CONFIG[batch].color }} />
          <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            Viewing <span className="font-semibold" style={{ color: "var(--text)" }}>{BATCH_CONFIG[batch].label}</span> — {BATCH_CONFIG[batch].pages.length} pages
          </span>
          <span className="ml-auto text-[11px] px-2 py-0.5 rounded-md font-semibold" style={{ backgroundColor: "var(--surface-2)", color: "var(--text-muted)" }}>
            {role.charAt(0).toUpperCase() + role.slice(1)} view
          </span>
        </div>
      )}

      {/* === SECTION 1: HERO CARDS === */}
      {/* Period toggle */}
      <div className="flex items-center gap-1 mb-3 p-1 rounded-xl w-fit" style={{ backgroundColor: "var(--surface)" }}>
        {(["today", "yesterday", "7d", "28d"] as KpiPeriod[]).map(p => (
          <button key={p} onClick={() => setKpiPeriod(p)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
            style={{ backgroundColor: kpiPeriod === p ? "var(--primary)" : "transparent", color: kpiPeriod === p ? "white" : "var(--text-muted)" }}>
            {p === "today" ? "Today" : p === "yesterday" ? "Yesterday" : p === "7d" ? "7 Days" : "28 Days"}
          </button>
        ))}
      </div>

      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: `repeat(${[config.canViewRevenue, config.canViewRpm, true, true].filter(Boolean).length}, 1fr)` }}>
        {/* Revenue — Owner only */}
        {config.canViewRevenue && (
        <div className="rounded-xl border p-5 relative overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="absolute top-0 right-0 w-32 h-full opacity-[0.08]" style={{ background: "radial-gradient(circle at top right, var(--success), transparent 70%)" }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Revenue — {PERIOD_LABEL[kpiPeriod]}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[28px] font-bold tracking-tight" style={{ color: "var(--text)" }}>${KPI_PERIOD_DATA[kpiPeriod].revenue.toLocaleString()}</span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--success)" }}>{KPI_PERIOD_DATA[kpiPeriod].revenueChange}</span>
          </div>
          <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>{kpiPeriod === "28d" ? "28-day total" : kpiPeriod === "7d" ? "$48,392 this month" : "across 7 pages"}</div>
        </div>
        )}

        {/* Portfolio RPM — Owner + Manager only */}
        {config.canViewRpm && <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider group/rpm relative cursor-help" style={{ color: "var(--text-muted)" }}>
            Portfolio RPM — {PERIOD_LABEL[kpiPeriod]}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline ml-1 -mt-0.5" style={{ color: "var(--text-muted)" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span className="absolute left-0 top-full mt-2 w-[240px] p-3 rounded-lg text-[11px] font-normal normal-case tracking-normal leading-relaxed hidden group-hover/rpm:block z-50 shadow-xl" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              Revenue Per Mille — calculated as (Earnings ÷ Monetized Views) × 1,000. Sourced from Meta Content Monetization API.
            </span>
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[28px] font-bold tracking-tight" style={{ color: "var(--text)" }}>${KPI_PERIOD_DATA[kpiPeriod].rpm.toFixed(2)}</span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--success)" }}>{KPI_PERIOD_DATA[kpiPeriod].rpmChange}</span>
          </div>
          <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>5 of 7 pages monetized</div>
        </div>}

        {/* Total Network Views */}
        <div className="rounded-xl border p-5 relative overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="absolute top-0 right-0 w-32 h-full opacity-[0.08]" style={{ background: "radial-gradient(circle at top right, #3B82F6, transparent 70%)" }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Network Views — {PERIOD_LABEL[kpiPeriod]}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[28px] font-bold tracking-tight" style={{ color: "var(--text)" }}>{formatNum(KPI_PERIOD_DATA[kpiPeriod].views)}</span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--success)" }}>{KPI_PERIOD_DATA[kpiPeriod].viewsChange}</span>
          </div>
          <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>{formatNum(Math.round(KPI_PERIOD_DATA[kpiPeriod].views * 0.504))} monetized views</div>
        </div>

        {/* Operations Pulse */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Operations Pulse</span>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="text-center">
              <div className="text-[20px] font-bold" style={{ color: totalFailed > 0 ? "var(--error)" : "var(--success)" }}>{totalFailed}</div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Failed</div>
            </div>
            <div className="text-center">
              <div className="text-[20px] font-bold" style={{ color: emptyQueues.length > 0 ? "var(--warning)" : "var(--success)" }}>{emptyQueues.length}</div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Empty Queues</div>
            </div>
            <div className="text-center">
              <div className="text-[20px] font-bold" style={{ color: expiringTokens.length > 0 ? "var(--warning)" : "var(--success)" }}>{expiringTokens.length}</div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Expiring</div>
            </div>
            <div className="text-center">
              <div className="text-[20px] font-bold" style={{ color: "var(--success)" }}>{totalScheduled}</div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Scheduled</div>
            </div>
          </div>
        </div>
      </div>

      {/* === SECTION 2: ATTENTION REQUIRED === */}
      {(criticalPages.length > 0 || totalFailed > 0 || emptyQueues.length > 0) && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--error)" }} />
            <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Needs Your Attention</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>
              {criticalPages.length + (totalFailed > 0 ? 1 : 0) + emptyQueues.length} issues
            </span>
          </div>

          <div className="space-y-2">
            {/* Failed posts */}
            {totalFailed > 0 && (
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--error-bg)", borderColor: "rgba(239, 68, 68, 0.2)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{totalFailed} posts failed to publish</span>
                    <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                      {FAILED_POSTS.slice(0, 2).map(p => p.page).filter((v, i, a) => a.indexOf(v) === i).join(", ")} — {FAILED_POSTS[0]?.error}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="/failed" className="text-[11px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>View All</a>
                  <button onClick={() => setRetryModal(true)} className="text-[12px] font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: "var(--error)" }}>Retry All</button>
                </div>
              </div>
            )}

            {/* Disconnected pages — grouped if > 2, individual otherwise */}
            {criticalPages.length > 2 ? (
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--error-bg)", borderColor: "rgba(239, 68, 68, 0.2)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{criticalPages.length} Pages Disconnected</span>
                    <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Tokens expired — publishing stopped on all affected pages</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="/settings/pages" className="text-[11px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>View All</a>
                  <button onClick={() => setReconnectModal(true)} className="text-[12px] font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: "var(--primary)" }}>Bulk Reconnect →</button>
                </div>
              </div>
            ) : (
              criticalPages.map(page => (
                <div key={page.id} className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--error-bg)", borderColor: "rgba(239, 68, 68, 0.2)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: page.color }}>
                      {page.avatar}
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{page.name} — Disconnected</span>
                      <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Token expired · {page.failedPosts} failed posts · Queue empty</div>
                    </div>
                  </div>
                  <button onClick={() => setReconnectModal(true)} className="text-[12px] font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: "var(--primary)" }}>Reconnect</button>
                </div>
              ))
            )}

            {/* Empty queues */}
            {emptyQueues.filter(p => p.status !== "critical").map(page => (
              <div key={page.id} className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--warning-bg)", borderColor: "rgba(251, 191, 36, 0.2)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: page.color }}>
                    {page.avatar}
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{page.name} — Queue empty</span>
                    <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>No posts scheduled in the next 24 hours</div>
                  </div>
                </div>
                <a href="/upload" className="text-[12px] font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: "var(--warning)", color: "#000" }}>Add Posts</a>
              </div>
            ))}

            {/* Expiring tokens — grouped if > 2, individual otherwise */}
            {expiringTokens.length > 2 ? (
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--warning-bg)", borderColor: "rgba(251, 191, 36, 0.2)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(251,191,36,0.2)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{expiringTokens.length} Pages — Token Expiring Soon</span>
                    <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Tokens expire within 7 days — reconnect to avoid interruption</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="/settings/pages" className="text-[11px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>View All</a>
                  <button onClick={() => setReconnectModal(true)} className="text-[12px] font-medium px-4 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>Reconnect All</button>
                </div>
              </div>
            ) : (
              expiringTokens.map(page => (
                <div key={`exp-${page.id}`} className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--warning-bg)", borderColor: "rgba(251, 191, 36, 0.2)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: page.color }}>
                      {page.avatar}
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{page.name} — Token expires in {page.tokenDays} days</span>
                      <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Reconnect to avoid posting interruptions</div>
                    </div>
                  </div>
                  <button onClick={() => setReconnectModal(true)} className="text-[12px] font-medium px-4 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>Reconnect</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* === SECTION 3: FASTEST GROWERS + VIRAL RADAR === */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Fastest Growers */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>🚀 Fastest Growers</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>This Week</span>
          </div>
          <div className="space-y-3">
            {[...ALL_PAGES].filter(p => p.viewsChange > 0).sort((a, b) => b.viewsChange - a.viewsChange).slice(0, 3).map(page => (
              <a key={page.id} href={`/reports/page?id=${page.id}`} className="flex items-center gap-3 cursor-pointer" style={{ textDecoration: "none" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: page.color }}>
                  {page.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{page.name}</span>
                    <span className="text-[12px] font-semibold" style={{ color: "var(--success)" }}>↑ {page.viewsChange}%</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{page.followers} followers · ${page.revenue.toLocaleString()} rev</div>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <a href="/reports" className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>See all in Reports →</a>
          </div>
        </div>

        {/* Viral Radar */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>⚡ Viral Radar</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,107,43,0.15)", color: "var(--primary)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--primary)" }} />
              Live
            </span>
          </div>
          <div className="space-y-3">
            {VIRAL_POSTS.map(post => (
              <div key={post.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 mt-0.5" style={{ backgroundColor: post.color }}>
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>{post.page}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>· {post.hoursAgo}h ago</span>
                  </div>
                  <div className="text-[11px] mb-1 truncate" style={{ color: "var(--text-secondary)" }}>&ldquo;{post.caption}&rdquo;</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium" style={{ color: "var(--success)" }}>👁 {post.views} views</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>⚡ {post.multiplier} baseline</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{post.platform}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === SECTION 3.5: PAGE HEALTH & MONETIZATION === */}
      {(() => {
        const healthPages = ALL_PAGES.map(p => ({ ...p, health: PAGE_HEALTH_DATA[p.id] }));
        const monetizedCount = healthPages.filter(p => p.health.monetization === "eligible").length;
        const flaggedCount = healthPages.filter(p => p.health.flags > 0 || p.health.copyrightStrikes > 0).length;
        const restrictedCount = healthPages.filter(p => p.health.distributionRestricted).length;
        return (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>🛡 Page Health & Monetization</span>
                {config.canViewRpm && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ADE80" }}>{monetizedCount}/{ALL_PAGES.length} Monetized</span>}
                {flaggedCount > 0 && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#FBBF24" }}>{flaggedCount} Flagged</span>}
                {restrictedCount > 0 && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444" }}>{restrictedCount} Restricted</span>}
              </div>
              <a href="/settings/pages" className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>Manage Pages →</a>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {healthPages.map(page => {
                const h = page.health;
                const hasIssue = h.flags > 0 || h.copyrightStrikes > 0 || h.distributionRestricted || h.monetization !== "eligible";
                const moColor = h.monetization === "eligible" ? "#4ADE80" : h.monetization === "restricted" ? "#FBBF24" : "#EF4444";
                const moLabel = h.monetization === "eligible" ? "Monetized" : h.monetization === "restricted" ? "Restricted" : "Suspended";
                return (
                  <div key={page.id} className="rounded-xl border p-3 flex flex-col gap-2"
                    style={{ backgroundColor: "var(--surface)", borderColor: hasIssue ? `${moColor}30` : "var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: page.color }}>
                        {page.avatar}
                      </div>
                      <span className="text-[11px] font-semibold truncate" style={{ color: "var(--text)" }}>{page.name}</span>
                    </div>
                    {/* Monetization — Owner + Manager only */}
                    {config.canViewRpm && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit" style={{ backgroundColor: `${moColor}15`, color: moColor }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: moColor }} />
                      {moLabel}
                    </div>
                    )}
                    {/* Payout status — Owner + Manager only */}
                    {config.canViewRpm && (() => {
                      const pc = h.payoutStatus === "on_time" ? "#4ADE80" : h.payoutStatus === "pending" ? "#FBBF24" : "#EF4444";
                      const pl = h.payoutStatus === "on_time" ? "✓ Paid" : h.payoutStatus === "pending" ? "⏳ Pending" : "⊘ On Hold";
                      return (
                        <div className="text-[10px] font-medium px-1.5 py-0.5 rounded w-fit" style={{ backgroundColor: `${pc}15`, color: pc }}>{pl}</div>
                      );
                    })()}
                    {/* Flags row */}
                    <div className="flex items-center gap-2">
                      {h.flags > 0 && (
                        <span className="text-[10px] font-medium" style={{ color: "#FBBF24" }} title="Content policy flags">⚑ {h.flags} flag{h.flags !== 1 ? "s" : ""}</span>
                      )}
                      {h.copyrightStrikes > 0 && (
                        <span className="text-[10px] font-medium" style={{ color: "#EF4444" }} title="Copyright strikes">© {h.copyrightStrikes} strike{h.copyrightStrikes !== 1 ? "s" : ""}</span>
                      )}
                      {h.distributionRestricted && (
                        <span className="text-[10px] font-medium" style={{ color: "#EF4444" }}>⊘ Dist.</span>
                      )}
                      {!hasIssue && (
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>No issues</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* === SECTION 4: ALL PAGES TABLE === */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>All Pages</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
              {healthyPages.length} Healthy
            </span>
            {attentionPages.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--warning)" }} />
                {attentionPages.length} Attention
              </span>
            )}
            {criticalPages.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--error)" }} />
                {criticalPages.length} Critical
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              value={pageSearch}
              onChange={e => setPageSearch(e.target.value)}
              placeholder="Search pages..."
              className="bg-transparent outline-none text-[12px] w-[140px]"
              style={{ color: "var(--text)" }}
            />
          </div>
          <a href="/reports" className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>Full Reports →</a>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="grid items-center px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", backgroundColor: "var(--surface)", gridTemplateColumns: (() => {
                const cols = ["36px", "200px"];
                if (config.canViewRevenue) cols.push("1fr");
                if (config.canViewRpm) cols.push("90px");
                cols.push("90px", "90px", "80px", "60px");
                return cols.join(" ");
              })() }}>
          <div>
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={(() => {
                const filtered = [...ALL_PAGES].filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()));
                return filtered.length > 0 && selectedTablePages.size === filtered.length;
              })()}
              onChange={selectAllTablePages}
              style={{ accentColor: "var(--primary)" }}
            />
          </div>
          <div>Page</div>
          {config.canViewRevenue && <div>Revenue</div>}
          {config.canViewRpm && <div className="group/rpmcol relative cursor-help">
            RPM
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline ml-0.5 -mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span className="absolute left-0 top-full mt-1 w-[220px] p-2.5 rounded-lg text-[10px] font-normal normal-case tracking-normal leading-relaxed hidden group-hover/rpmcol:block z-50 shadow-xl" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              (Earnings ÷ Monetized Views) × 1,000. From Meta Content Monetization API.
            </span>
          </div>}
          <div>Views (7d)</div>
          <div>Queue (24h)</div>
          <div>Token</div>
          <div>Health</div>
        </div>

        {/* Rows sorted by revenue desc, filtered by search */}
        {[...ALL_PAGES].filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase())).sort((a, b) => b.revenue - a.revenue).map(page => {
          const isSelected = selectedTablePages.has(page.id);
          return (
            <div
              key={page.id}
              className="grid items-center px-4 py-3 border-t cursor-pointer transition-all"
              style={{
                gridTemplateColumns: (() => {
                const cols = ["36px", "200px"];
                if (config.canViewRevenue) cols.push("1fr");
                if (config.canViewRpm) cols.push("90px");
                cols.push("90px", "90px", "80px", "60px");
                return cols.join(" ");
              })(),
                borderColor: "var(--border)",
                backgroundColor: isSelected ? "rgba(255,107,43,0.06)" : page.status === "critical" ? "var(--error-bg)" : "var(--surface)",
              }}
              onClick={() => window.location.href = `/reports/page?id=${page.id}`}
              onMouseEnter={e => {
                if (!isSelected) e.currentTarget.style.backgroundColor = page.status === "critical" ? "rgba(239,68,68,0.15)" : "var(--surface-hover)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = isSelected ? "rgba(255,107,43,0.06)" : page.status === "critical" ? "var(--error-bg)" : "var(--surface)";
              }}
            >
              {/* Checkbox */}
              <div onClick={e => { e.stopPropagation(); toggleTablePage(page.id); }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleTablePage(page.id)}
                  className="cursor-pointer"
                  style={{ accentColor: "var(--primary)" }}
                />
              </div>

              {/* Page */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: page.color }}>
                  {page.avatar}
                </div>
                <div>
                  <div className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{page.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{page.followers} followers</div>
                </div>
              </div>

              {/* Revenue bar — Owner only */}
              {config.canViewRevenue && <div className="flex items-center gap-3 pr-4">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((page.revenue / 5000) * 100, 100)}%`, backgroundColor: page.revenue > 0 ? page.color : "transparent" }} />
                </div>
                <div className="min-w-[70px] text-right">
                  <span className="text-[12px] font-semibold" style={{ color: page.revenue > 0 ? "var(--text)" : "var(--text-muted)" }}>
                    {page.revenue > 0 ? `$${page.revenue.toLocaleString()}` : "—"}
                  </span>
                  {page.revenue > 0 && page.revenue < 100 && (
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>+${page.revenue.toFixed(2)}</div>
                  )}
                  {page.revenue === 0 && page.rpm === 0 && (
                    <div className="text-[9px]" style={{ color: "var(--warning)" }}>Not enrolled</div>
                  )}
                </div>
              </div>}

              {/* RPM — Owner + Manager only */}
              {config.canViewRpm && <div>
                <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{page.rpm > 0 ? `$${page.rpm.toFixed(2)}` : "—"}</span>
                {page.rpmChange !== 0 && page.rpm > 0 && (
                  <div className="text-[10px]" style={{ color: page.rpmChange > 0 ? "var(--success)" : "var(--error)" }}>
                    {page.rpmChange > 0 ? "↑" : "↓"}{Math.abs(page.rpmChange)}%
                  </div>
                )}
              </div>}

              {/* Views */}
              <div>
                <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{formatNum(page.views7d)}</span>
                <div className="text-[10px]" style={{ color: page.viewsChange > 0 ? "var(--success)" : page.viewsChange < -10 ? "var(--error)" : "var(--text-muted)" }}>
                  {page.viewsChange > 0 ? "↑" : "↓"}{Math.abs(page.viewsChange)}%
                </div>
              </div>

              {/* Queue */}
              <div>
                <span className="text-[12px] font-medium" style={{ color: page.queueNext24h === 0 ? "var(--warning)" : "var(--text)" }}>
                  {page.queueNext24h} posts
                </span>
                {page.queueNext24h === 0 && <span className="text-[10px] block" style={{ color: "var(--warning)" }}>Empty!</span>}
              </div>

              {/* Token */}
              <div>
                {page.tokenDays === 0 ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>Expired</span>
                ) : page.tokenDays <= 7 ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>{page.tokenDays}d</span>
                ) : (
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{page.tokenDays}d</span>
                )}
              </div>

              {/* Health dot */}
              <div className="flex justify-center">
                <span className="w-3 h-3 rounded-full" style={{
                  backgroundColor: page.status === "healthy" ? "var(--success)" : page.status === "attention" ? "var(--warning)" : "var(--error)",
                  boxShadow: page.status === "critical" ? "0 0 8px var(--error)" : page.status === "attention" ? "0 0 8px var(--warning)" : "none",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Action Bar */}
      {selectedTablePages.size > 0 && (
        <div
          className="fixed bottom-0 right-0 z-40 flex items-center gap-3 px-5 py-3"
          style={{
            left: "250px",
            backgroundColor: "var(--surface)",
            borderTop: "2px solid var(--primary)",
            boxShadow: "0 -4px 24px rgba(255,107,43,0.15)",
          }}
        >
          <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{selectedTablePages.size} page{selectedTablePages.size !== 1 ? "s" : ""} selected</span>
          <button
            onClick={() => setSelectedTablePages(new Set())}
            className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "var(--bg)", color: "var(--text-secondary)" }}
          >
            Deselect all
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setReconnectModal(true)}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-1.5 rounded-lg"
            style={{ backgroundColor: "rgba(255,107,43,0.12)", color: "var(--primary)" }}
          >
            🔗 Reconnect Selected
          </button>
          <button
            onClick={() => setBulkAction(bulkAction === "pause" ? null : "pause")}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-1.5 rounded-lg"
            style={{ backgroundColor: bulkAction === "pause" ? "rgba(251,191,36,0.15)" : "var(--bg)", color: bulkAction === "pause" ? "var(--warning)" : "var(--text-secondary)" }}
          >
            ⏸ Pause Publishing
          </button>
          {bulkAction === "pause" && (
            <span className="text-[11px] px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
              Confirm: pause publishing for {selectedTablePages.size} page{selectedTablePages.size !== 1 ? "s" : ""}?
            </span>
          )}
          <button
            onClick={() => setBulkAction(bulkAction === "tag" ? null : "tag")}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-1.5 rounded-lg"
            style={{ backgroundColor: bulkAction === "tag" ? "rgba(99,102,241,0.15)" : "var(--bg)", color: bulkAction === "tag" ? "#6366F1" : "var(--text-secondary)" }}
          >
            🏷 Assign Tag
          </button>
          {bulkAction === "tag" && (
            <input
              type="text"
              value={bulkTagInput}
              onChange={e => setBulkTagInput(e.target.value)}
              placeholder="Enter tag name..."
              className="text-[12px] px-3 py-1.5 rounded-lg outline-none"
              style={{ backgroundColor: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", width: "140px" }}
            />
          )}
        </div>
      )}

      {/* === SECTION 5: TOP PERFORMERS + DECLINING === */}
      <div className="grid grid-cols-2 gap-3 mt-5" style={{ marginBottom: selectedTablePages.size > 0 ? "60px" : undefined }}>
        {/* Top performers */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Top Performers This Week</span>
          <div className="space-y-3 mt-3">
            {[...ALL_PAGES].sort((a, b) => b.views7d - a.views7d).slice(0, 5).map((page, i) => (
              <div key={page.id} className="flex items-center gap-3">
                <span className="text-[14px] font-bold w-5" style={{ color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "var(--text-muted)" }}>{i + 1}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                <span className="text-[12px] font-medium flex-1" style={{ color: "var(--text)" }}>{page.name}</span>
                <div className="text-right">
                  <div className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{formatNum(page.views7d)} views</div>
                  {config.canViewRevenue && page.revenue > 0 && (
                    <div className="text-[11px] font-medium" style={{ color: "var(--success)" }}>${page.revenue.toLocaleString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <a href="/reports" className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>See all pages in Reports →</a>
          </div>
        </div>

        {/* Declining pages */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Declining Performance</span>
          <div className="space-y-3 mt-3">
            {[...ALL_PAGES].filter(p => p.viewsChange < 0).sort((a, b) => a.viewsChange - b.viewsChange).map(page => (
              <div key={page.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                <span className="text-[12px] font-medium flex-1" style={{ color: "var(--text)" }}>{page.name}</span>
                <div className="text-right">
                  <div className="text-[12px] font-semibold" style={{ color: "var(--error)" }}>↓ {Math.abs(page.viewsChange)}% views</div>
                  {config.canViewRpm && (
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      RPM {page.rpmChange >= 0 ? <span style={{ color: "var(--success)" }}>↑{page.rpmChange}%</span> : <span style={{ color: "var(--error)" }}>↓{Math.abs(page.rpmChange)}%</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {ALL_PAGES.filter(p => p.viewsChange < 0).length === 0 && (
              <div className="flex items-center gap-2 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>All pages trending up</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConnectFacebookModal open={connectModal} onClose={() => setConnectModal(false)} />
      <ReconnectModal open={reconnectModal} onClose={() => setReconnectModal(false)} />
      <RetryModal open={retryModal} onClose={() => setRetryModal(false)} />
    </div>
  );
}

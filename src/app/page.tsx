"use client";
import { useState } from "react";
import Header from "@/components/Header";
import AlertBanner from "@/components/AlertBanner";
import ConnectFacebookModal from "@/components/modals/ConnectFacebookModal";
import ReconnectModal from "@/components/modals/ReconnectModal";
import RetryModal from "@/components/modals/RetryModal";

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

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function Dashboard() {
  const [showTokenBanner, setShowTokenBanner] = useState(true);
  const [showDisconnectBanner, setShowDisconnectBanner] = useState(true);
  const [reconnectModal, setReconnectModal] = useState(false);
  const [retryModal, setRetryModal] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const [pageSearch, setPageSearch] = useState("");

  const totalRevenue = ALL_PAGES.reduce((s, p) => s + p.revenue, 0);
  const avgRpm = ALL_PAGES.filter(p => p.rpm > 0).reduce((s, p, _, a) => s + p.rpm / a.length, 0);
  const totalFailed = FAILED_POSTS.length;
  const criticalPages = ALL_PAGES.filter(p => p.status === "critical");
  const attentionPages = ALL_PAGES.filter(p => p.status === "attention");
  const healthyPages = ALL_PAGES.filter(p => p.status === "healthy");
  const emptyQueues = ALL_PAGES.filter(p => p.queueNext24h === 0);
  const expiringTokens = ALL_PAGES.filter(p => p.tokenDays > 0 && p.tokenDays <= 7);

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

      {/* === SECTION 1: MONEY === */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        {/* Today's earnings */}
        <div className="rounded-xl border p-5 relative overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="absolute top-0 right-0 w-32 h-full opacity-[0.08]" style={{ background: "radial-gradient(circle at top right, var(--success), transparent 70%)" }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Revenue This Week</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[28px] font-bold tracking-tight" style={{ color: "var(--text)" }}>${totalRevenue.toLocaleString()}</span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--success)" }}>↑ 14%</span>
          </div>
          <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>$48,392 this month</div>
        </div>

        {/* Avg RPM */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider group/rpm relative cursor-help" style={{ color: "var(--text-muted)" }}>
            Portfolio RPM
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline ml-1 -mt-0.5" style={{ color: "var(--text-muted)" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span className="absolute left-0 top-full mt-2 w-[240px] p-3 rounded-lg text-[11px] font-normal normal-case tracking-normal leading-relaxed hidden group-hover/rpm:block z-50 shadow-xl" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              Revenue Per Mille — calculated as (Earnings ÷ Monetized Views) × 1,000. Sourced from Meta Content Monetization API.
            </span>
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[28px] font-bold tracking-tight" style={{ color: "var(--text)" }}>${avgRpm.toFixed(2)}</span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--success)" }}>↑ $0.38</span>
          </div>
          <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>5 of 7 pages monetized</div>
        </div>

        {/* Operations pulse */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Operations Pulse</span>
          <div className="grid grid-cols-3 gap-3 mt-3">
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

            {/* Disconnected pages */}
            {criticalPages.map(page => (
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
            ))}

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

            {/* Expiring tokens */}
            {expiringTokens.map(page => (
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
            ))}
          </div>
        </div>
      )}

      {/* === SECTION 3: PAGE HEALTH GRID === */}
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
        <div className="grid items-center px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", backgroundColor: "var(--surface)", gridTemplateColumns: "200px 1fr 90px 90px 90px 80px 60px" }}>
          <div>Page</div>
          <div>Revenue</div>
          <div className="group/rpmcol relative cursor-help">
            RPM
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline ml-0.5 -mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span className="absolute left-0 top-full mt-1 w-[220px] p-2.5 rounded-lg text-[10px] font-normal normal-case tracking-normal leading-relaxed hidden group-hover/rpmcol:block z-50 shadow-xl" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              (Earnings ÷ Monetized Views) × 1,000. From Meta Content Monetization API.
            </span>
          </div>
          <div>Views (7d)</div>
          <div>Queue (24h)</div>
          <div>Token</div>
          <div>Health</div>
        </div>

        {/* Rows sorted by revenue desc, filtered by search */}
        {[...ALL_PAGES].filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase())).sort((a, b) => b.revenue - a.revenue).map(page => (
          <div
            key={page.id}
            className="grid items-center px-4 py-3 border-t cursor-pointer transition-all"
            style={{
              gridTemplateColumns: "200px 1fr 90px 90px 90px 80px 60px",
              borderColor: "var(--border)",
              backgroundColor: page.status === "critical" ? "var(--error-bg)" : "var(--surface)",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = page.status === "critical" ? "rgba(239,68,68,0.15)" : "var(--surface-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = page.status === "critical" ? "var(--error-bg)" : "var(--surface)"; }}
          >
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

            {/* Revenue bar — bar color = page brand color, consistent */}
            <div className="flex items-center gap-3 pr-4">
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
            </div>

            {/* RPM */}
            <div>
              <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{page.rpm > 0 ? `$${page.rpm.toFixed(2)}` : "—"}</span>
              {page.rpmChange !== 0 && page.rpm > 0 && (
                <div className="text-[10px]" style={{ color: page.rpmChange > 0 ? "var(--success)" : "var(--error)" }}>
                  {page.rpmChange > 0 ? "↑" : "↓"}{Math.abs(page.rpmChange)}%
                </div>
              )}
            </div>

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
        ))}
      </div>

      {/* === SECTION 4: TOP & BOTTOM EARNERS === */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {/* Top earners */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Top Earners This Week</span>
          <div className="space-y-3 mt-3">
            {[...ALL_PAGES].filter(p => p.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 3).map((page, i) => (
              <div key={page.id} className="flex items-center gap-3">
                <span className="text-[14px] font-bold w-5" style={{ color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32" }}>{i + 1}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                <span className="text-[12px] font-medium flex-1" style={{ color: "var(--text)" }}>{page.name}</span>
                <span className="text-[13px] font-bold" style={{ color: "var(--success)" }}>${page.revenue.toLocaleString()}</span>
              </div>
            ))}
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
                <span className="text-[12px] font-semibold" style={{ color: "var(--error)" }}>↓ {Math.abs(page.viewsChange)}% views</span>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  RPM {page.rpmChange >= 0 ? <span style={{ color: "var(--success)" }}>↑{page.rpmChange}%</span> : <span style={{ color: "var(--error)" }}>↓{Math.abs(page.rpmChange)}%</span>}
                </span>
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

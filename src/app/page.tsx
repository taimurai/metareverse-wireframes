"use client";
import { useState } from "react";
import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import PageTable from "@/components/PageTable";
import AlertBanner from "@/components/AlertBanner";
import ConnectFacebookModal from "@/components/modals/ConnectFacebookModal";
import ReconnectModal from "@/components/modals/ReconnectModal";
import EditPostModal from "@/components/modals/EditPostModal";
import DeletePostModal from "@/components/modals/DeletePostModal";
import DisconnectPageModal from "@/components/modals/DisconnectPageModal";
import PartialSuccessModal from "@/components/modals/PartialSuccessModal";
import RetryModal from "@/components/modals/RetryModal";

type Tab = "pages" | "queue" | "failed";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("pages");
  const [showTokenBanner, setShowTokenBanner] = useState(true);
  const [showDisconnectBanner, setShowDisconnectBanner] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // Modal states
  const [connectModal, setConnectModal] = useState(false);
  const [reconnectModal, setReconnectModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState(false);
  const [partialModal, setPartialModal] = useState(false);
  const [retryModal, setRetryModal] = useState(false);

  const tabs: { key: Tab; label: string; count?: number; dotColor?: string }[] = [
    { key: "pages", label: "All Pages", count: 7 },
    { key: "queue", label: "Scheduled Queue", count: 42 },
    { key: "failed", label: "Failed Posts", count: 3, dotColor: "var(--error)" },
  ];

  // Empty dashboard state
  if (isEmpty) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Get started by connecting your Facebook account" />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ backgroundColor: "var(--primary-muted)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <h2 className="text-[20px] font-semibold mb-2" style={{ color: "var(--text)" }}>No pages connected yet</h2>
          <p className="text-[14px] text-center max-w-md mb-8" style={{ color: "var(--text-secondary)" }}>
            Connect your Facebook account to start managing all your Pages, Instagram, and Threads from one dashboard.
          </p>
          <button
            onClick={() => setConnectModal(true)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-[14px] font-semibold text-white"
            style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Connect Facebook Account
          </button>
          <div className="flex items-center gap-6 mt-8">
            {[
              { icon: "📁", label: "Bulk upload 100+ posts" },
              { icon: "📅", label: "Visual calendar scheduling" },
              { icon: "📊", label: "Unified performance metrics" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Toggle for demo */}
          <button onClick={() => setIsEmpty(false)} className="mt-12 text-[11px] px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
            Demo: Show populated dashboard →
          </button>
        </div>
        <ConnectFacebookModal open={connectModal} onClose={() => { setConnectModal(false); setIsEmpty(false); }} />
      </div>
    );
  }

  return (
    <div>
      {/* Alert Banners */}
      {showTokenBanner && (
        <AlertBanner
          type="warning"
          message="3 pages have tokens expiring in 5 days. Reconnect to avoid posting interruptions."
          action="Reconnect All"
          onAction={() => setReconnectModal(true)}
          onDismiss={() => setShowTokenBanner(false)}
        />
      )}
      {showDisconnectBanner && (
        <AlertBanner
          type="danger"
          message="1 page disconnected. 8 scheduled posts paused."
          action="Reconnect"
          onAction={() => setReconnectModal(true)}
          onDismiss={() => setShowDisconnectBanner(false)}
        />
      )}

      {/* Header */}
      <Header
        title="Dashboard"
        subtitle="Overview of all your connected pages and performance"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEmpty(true)}
              className="px-3 py-2.5 rounded-xl text-[12px] font-medium"
              style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}
            >
              Demo: Empty state
            </button>
            <button
              onClick={() => setConnectModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Connect Facebook
            </button>
          </div>
        }
      />

      {/* Revenue Hero (Owner-only) */}
      <div className="rounded-xl border p-5 mb-4 relative overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="absolute top-0 right-0 w-64 h-full opacity-[0.07]" style={{ background: "radial-gradient(circle at top right, var(--primary), transparent 70%)" }} />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>OWNER ONLY</span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Revenue from Meta Content Monetization</span>
            </div>
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-[32px] font-bold tracking-tight" style={{ color: "var(--text)" }}>$12,847</span>
                <span className="text-[14px] ml-2" style={{ color: "var(--text-secondary)" }}>this week</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: "var(--success)" }}>+14% vs last week</span>
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
              $48,392 this month &middot; $142,891 last 90 days
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>Avg RPM</div>
              <div className="text-[18px] font-bold" style={{ color: "var(--text)" }}>$8.42</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--success)" }}>+$0.38</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>Monetized Pages</div>
              <div className="text-[18px] font-bold" style={{ color: "var(--text)" }}>5/7</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--warning)" }}>2 not enrolled</div>
            </div>
            <a href="/reports" className="text-[12px] font-semibold px-4 py-2 rounded-xl" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
              Full Report →
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
          label="Total Views (7d)" value="68.8M" change="14%" changeType="up"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>}
          label="Engagement Rate" value="4.2%" change="0.3%" changeType="up"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Total Reach (7d)" value="50.8M" change="2%" changeType="down"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          label="Posts This Week" value="1,284" change="22%" changeType="up"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>}
          label="Shares (7d)" value="234K" change="18%" changeType="up"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: "var(--border)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-4 py-3 text-[13px] font-medium transition-colors"
            style={{ color: activeTab === tab.key ? "var(--primary)" : "var(--text-secondary)" }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 px-1.5 py-0.5 rounded-md text-[11px] font-semibold" style={{
                backgroundColor: activeTab === tab.key ? "var(--primary-muted)" : "rgba(148, 148, 168, 0.1)",
                color: tab.dotColor && activeTab === tab.key ? tab.dotColor : activeTab === tab.key ? "var(--primary)" : "var(--text-muted)",
              }}>{tab.count}</span>
            )}
            {activeTab === tab.key && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
          </button>
        ))}

        {/* Modal demo buttons */}
        <div className="ml-auto flex items-center gap-1 pb-1">
          <span className="text-[10px] mr-1" style={{ color: "var(--text-muted)" }}>Modals:</span>
          {[
            { label: "Edit", fn: () => setEditModal(true) },
            { label: "Delete", fn: () => setDeleteModal(true) },
            { label: "Disconnect", fn: () => setDisconnectModal(true) },
            { label: "Partial", fn: () => setPartialModal(true) },
            { label: "Retry", fn: () => setRetryModal(true) },
          ].map((m) => (
            <button key={m.label} onClick={m.fn} className="text-[10px] px-2 py-1 rounded-md" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "pages" && <PageTable />}

      {activeTab === "queue" && (
        <div className="rounded-xl border p-14 text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--primary-muted)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
          <div className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>42 Posts Scheduled</div>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-secondary)" }}>View and manage your scheduled posts in the Queue</p>
          <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>Go to Queue</button>
        </div>
      )}

      {activeTab === "failed" && (
        <div className="space-y-2">
          {[
            { page: "Money Matters", avatar: "MM", color: "#F59E0B", caption: "5 Investment Tips for 2025...", time: "2h ago", error: "Token expired", platforms: "FB + IG", status: "failed" as const },
            { page: "TechByte", avatar: "TB", color: "#14B8A6", caption: "AI Revolution: What's Next...", time: "5h ago", error: "Rate limited", platforms: "FB", status: "failed" as const },
            { page: "Money Matters", avatar: "MM", color: "#F59E0B", caption: "How to Save $10K This Year...", time: "8h ago", error: "IG failed, FB ok", platforms: "FB + IG", status: "partial" as const },
            { page: "Money Matters", avatar: "MM", color: "#F59E0B", caption: "Crypto Market Update...", time: "1d ago", error: "Token expired", platforms: "FB + IG + TH", status: "failed" as const },
          ].map((post, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl border group"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: post.status === "partial" ? "var(--warning-bg)" : "var(--error-bg)",
                    color: post.status === "partial" ? "var(--warning)" : "var(--error)",
                  }}
                >
                  {post.status === "partial" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  )}
                </div>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{post.caption}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {post.page} &middot; {post.platforms} &middot; {post.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: post.status === "partial" ? "var(--warning-bg)" : "var(--error-bg)",
                    color: post.status === "partial" ? "var(--warning)" : "var(--error)",
                  }}
                >
                  {post.error}
                </span>
                {post.status === "partial" && (
                  <button onClick={() => setPartialModal(true)} className="text-[11px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}>
                    Details
                  </button>
                )}
                <button
                  onClick={() => setRetryModal(true)}
                  className="text-[12px] font-semibold px-4 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Retry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ConnectFacebookModal open={connectModal} onClose={() => setConnectModal(false)} />
      <ReconnectModal open={reconnectModal} onClose={() => setReconnectModal(false)} />
      <EditPostModal open={editModal} onClose={() => setEditModal(false)} />
      <DeletePostModal open={deleteModal} onClose={() => setDeleteModal(false)} />
      <DisconnectPageModal open={disconnectModal} onClose={() => setDisconnectModal(false)} />
      <PartialSuccessModal open={partialModal} onClose={() => setPartialModal(false)} />
      <RetryModal open={retryModal} onClose={() => setRetryModal(false)} />
    </div>
  );
}

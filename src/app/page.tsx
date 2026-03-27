"use client";
import { useState } from "react";
import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import PageTable from "@/components/PageTable";
import AlertBanner from "@/components/AlertBanner";

type Tab = "pages" | "queue" | "failed";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("pages");
  const [showTokenBanner, setShowTokenBanner] = useState(true);
  const [showDisconnectBanner, setShowDisconnectBanner] = useState(true);

  const tabs: { key: Tab; label: string; count?: number; dotColor?: string }[] = [
    { key: "pages", label: "All Pages", count: 7 },
    { key: "queue", label: "Scheduled Queue", count: 42 },
    { key: "failed", label: "Failed Posts", count: 3, dotColor: "var(--error)" },
  ];

  return (
    <div>
      {/* Alert Banners */}
      {showTokenBanner && (
        <AlertBanner
          type="warning"
          message="3 pages have tokens expiring in 5 days. Reconnect to avoid posting interruptions."
          action="Reconnect All"
          onDismiss={() => setShowTokenBanner(false)}
        />
      )}
      {showDisconnectBanner && (
        <AlertBanner
          type="danger"
          message="1 page disconnected. 8 scheduled posts paused."
          action="Reconnect"
          onDismiss={() => setShowDisconnectBanner(false)}
        />
      )}

      {/* Header */}
      <Header
        title="Dashboard"
        subtitle="Overview of all your connected pages and performance"
        actions={
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white shadow-lg"
            style={{
              backgroundColor: "var(--primary)",
              boxShadow: "0 4px 14px var(--primary-glow)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--primary-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--primary)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Connect Facebook
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
          label="Total Views (7d)"
          value="68.8M"
          change="14%"
          changeType="up"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>}
          label="Engagement Rate"
          value="4.2%"
          change="0.3%"
          changeType="up"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Total Reach (7d)"
          value="50.8M"
          change="2%"
          changeType="down"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          label="Posts This Week"
          value="1,284"
          change="22%"
          changeType="up"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: "var(--border)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-4 py-3 text-[13px] font-medium transition-colors"
            style={{
              color: activeTab === tab.key ? "var(--primary)" : "var(--text-secondary)",
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="ml-2 px-1.5 py-0.5 rounded-md text-[11px] font-semibold"
                style={{
                  backgroundColor: activeTab === tab.key ? "var(--primary-muted)" : "rgba(148, 148, 168, 0.1)",
                  color: tab.dotColor && activeTab === tab.key ? tab.dotColor : activeTab === tab.key ? "var(--primary)" : "var(--text-muted)",
                }}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.key && (
              <div
                className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                style={{ backgroundColor: "var(--primary)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "pages" && <PageTable />}

      {activeTab === "queue" && (
        <div
          className="rounded-xl border p-14 text-center"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--primary-muted)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
          <div className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>42 Posts Scheduled</div>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-secondary)" }}>
            View and manage your scheduled posts in the Queue
          </p>
          <button
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
          >
            Go to Queue
          </button>
        </div>
      )}

      {activeTab === "failed" && (
        <div className="space-y-2">
          {[
            { page: "Money Matters", caption: "5 Investment Tips for 2025...", time: "2h ago", error: "Token expired", platforms: "FB + IG" },
            { page: "TechByte", caption: "AI Revolution: What's Next...", time: "5h ago", error: "Rate limited", platforms: "FB" },
            { page: "Money Matters", caption: "Crypto Market Update...", time: "1d ago", error: "Token expired", platforms: "FB + IG + TH" },
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
                  style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{post.caption}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {post.page} &middot; {post.platforms} &middot; {post.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}
                >
                  {post.error}
                </span>
                <button
                  className="text-[12px] font-semibold px-4 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--primary-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--primary)"; }}
                >
                  Retry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

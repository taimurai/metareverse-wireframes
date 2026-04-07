"use client";
import { useState } from "react";
import Header from "@/components/Header";

interface PageStat {
  pageId: string;
  pageName: string;
  avatar: string;
  color: string;
  postsThisWeek: number;
  avgReach: string;
  avgReachRaw: number;
  reachTrend: "up" | "down" | "stable";
  rotationSlot: number;
  isRotating: boolean;
}

interface CheckpointInfo {
  reason: string;
  detail: string;
  action: string;
  actionUrl: string;
}

interface Connection {
  id: string;
  fbUserId: string;
  name: string;
  email: string;
  role: "owner" | "user";
  pagesManaged: { id: string; name: string; avatar: string; color: string }[];
  connectedDate: string;
  lastActive: string;
  status: "active" | "expired" | "revoked";
  totalPostsThisWeek: number;
  totalReachThisWeek: string;
  pageStats: PageStat[];
  checkpoint?: CheckpointInfo;
}

const CONNECTIONS: Connection[] = [
  {
    id: "c1", fbUserId: "100089...", name: "Taimur Asghar", email: "taimur@metareverse.com", role: "owner",
    connectedDate: "Jan 12, 2026", lastActive: "2 minutes ago", status: "active",
    totalPostsThisWeek: 126, totalReachThisWeek: "1.2M",
    pagesManaged: [
      { id: "lc",  name: "Laugh Central",     avatar: "LC", color: "#8B5CF6" },
      { id: "hu",  name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
      { id: "tb",  name: "TechByte",          avatar: "TB", color: "#14B8A6" },
      { id: "mm",  name: "Money Matters",     avatar: "MM", color: "#F59E0B" },
      { id: "dh",  name: "Daily Health Tips", avatar: "DH", color: "#6366F1" },
      { id: "ff",  name: "Fitness Factory",   avatar: "FF", color: "#EC4899" },
      { id: "khn", name: "Know Her Name",     avatar: "KH", color: "#0EA5E9" },
    ],
    pageStats: [
      { pageId: "lc",  pageName: "Laugh Central",     avatar: "LC", color: "#8B5CF6", postsThisWeek: 34, avgReach: "22.1K", avgReachRaw: 22100, reachTrend: "up",     rotationSlot: 1, isRotating: true  },
      { pageId: "hu",  pageName: "History Uncovered", avatar: "HU", color: "#FF6B2B", postsThisWeek: 40, avgReach: "31.2K", avgReachRaw: 31200, reachTrend: "up",     rotationSlot: 1, isRotating: true  },
      { pageId: "tb",  pageName: "TechByte",          avatar: "TB", color: "#14B8A6", postsThisWeek: 22, avgReach: "14.5K", avgReachRaw: 14500, reachTrend: "stable", rotationSlot: 1, isRotating: false },
      { pageId: "mm",  pageName: "Money Matters",     avatar: "MM", color: "#F59E0B", postsThisWeek: 0,  avgReach: "8.2K",  avgReachRaw: 8200,  reachTrend: "down",   rotationSlot: 1, isRotating: false },
      { pageId: "dh",  pageName: "Daily Health Tips", avatar: "DH", color: "#6366F1", postsThisWeek: 18, avgReach: "11.3K", avgReachRaw: 11300, reachTrend: "up",     rotationSlot: 1, isRotating: true  },
      { pageId: "ff",  pageName: "Fitness Factory",   avatar: "FF", color: "#EC4899", postsThisWeek: 0,  avgReach: "6.8K",  avgReachRaw: 6800,  reachTrend: "down",   rotationSlot: 1, isRotating: false },
      { pageId: "khn", pageName: "Know Her Name",     avatar: "KH", color: "#0EA5E9", postsThisWeek: 12, avgReach: "7.4K",  avgReachRaw: 7400,  reachTrend: "up",     rotationSlot: 1, isRotating: false },
    ],
  },
  {
    id: "c2", fbUserId: "100092...", name: "Sarah Khan", email: "sarah@partner-a.com", role: "user",
    connectedDate: "Feb 5, 2026", lastActive: "3 hours ago", status: "active",
    totalPostsThisWeek: 73, totalReachThisWeek: "684K",
    pagesManaged: [
      { id: "lc", name: "Laugh Central",     avatar: "LC", color: "#8B5CF6" },
      { id: "ff", name: "Fitness Factory",   avatar: "FF", color: "#EC4899" },
      { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1" },
      { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
    ],
    pageStats: [
      { pageId: "lc", pageName: "Laugh Central",     avatar: "LC", color: "#8B5CF6", postsThisWeek: 28, avgReach: "17.4K", avgReachRaw: 17400, reachTrend: "stable", rotationSlot: 2, isRotating: true  },
      { pageId: "hu", pageName: "History Uncovered", avatar: "HU", color: "#FF6B2B", postsThisWeek: 25, avgReach: "19.8K", avgReachRaw: 19800, reachTrend: "stable", rotationSlot: 2, isRotating: true  },
      { pageId: "dh", pageName: "Daily Health Tips", avatar: "DH", color: "#6366F1", postsThisWeek: 14, avgReach: "9.7K",  avgReachRaw: 9700,  reachTrend: "stable", rotationSlot: 2, isRotating: true  },
      { pageId: "ff", pageName: "Fitness Factory",   avatar: "FF", color: "#EC4899", postsThisWeek: 0,  avgReach: "5.1K",  avgReachRaw: 5100,  reachTrend: "down",   rotationSlot: 2, isRotating: false },
    ],
  },
  {
    id: "c3", fbUserId: "100095...", name: "Ahmed Raza", email: "ahmed@partner-b.com", role: "user",
    connectedDate: "Feb 18, 2026", lastActive: "1 day ago", status: "expired",
    totalPostsThisWeek: 8, totalReachThisWeek: "31K",
    pagesManaged: [
      { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
      { id: "tb", name: "TechByte",          avatar: "TB", color: "#14B8A6" },
    ],
    pageStats: [
      { pageId: "hu", pageName: "History Uncovered", avatar: "HU", color: "#FF6B2B", postsThisWeek: 8,  avgReach: "3.9K",  avgReachRaw: 3900,  reachTrend: "down",   rotationSlot: 3, isRotating: true  },
      { pageId: "tb", pageName: "TechByte",          avatar: "TB", color: "#14B8A6", postsThisWeek: 0,  avgReach: "—",     avgReachRaw: 0,     reachTrend: "down",   rotationSlot: 2, isRotating: false },
    ],
    checkpoint: {
      reason: "Unusual posting activity detected",
      detail: "Facebook flagged this account for posting at high frequency across multiple pages in a short window. The account was temporarily checkpointed to verify human activity.",
      action: "Verify identity on Facebook",
      actionUrl: "https://www.facebook.com/help/",
    },
  },
];

function calcHealthScore(conn: Connection): { score: number; label: string; color: string; reason: string } {
  let score = 100;
  // Token status
  if (conn.status === "expired") score -= 50;
  // Trend signals (across pages)
  const trends = conn.pageStats.map(p => p.reachTrend);
  const downCount = trends.filter(t => t === "down").length;
  const upCount = trends.filter(t => t === "up").length;
  score -= downCount * 8;
  score += upCount * 4;
  // Reach quality
  const activeStats = conn.pageStats.filter(p => p.avgReachRaw > 0);
  const avgReach = activeStats.length > 0 ? activeStats.reduce((a, p) => a + p.avgReachRaw, 0) / activeStats.length : 0;
  if (avgReach === 0) score -= 25;
  else if (avgReach < 5000) score -= 20;
  else if (avgReach < 10000) score -= 8;
  else if (avgReach > 20000) score += 8;
  // Activity
  if (conn.totalPostsThisWeek === 0) score -= 20;
  else if (conn.totalPostsThisWeek < 10) score -= 5;
  // Clamp
  score = Math.max(0, Math.min(100, score));
  const label = score >= 75 ? "Healthy" : score >= 45 ? "Declining" : "Replace";
  const color = score >= 75 ? "#4ADE80" : score >= 45 ? "#FBBF24" : "#EF4444";
  const reason = conn.status === "expired" ? "Token expired" :
    score < 45 ? "Low reach + declining trend" :
    score < 75 ? "Stable but reach declining on some pages" :
    "Strong reach, active, trending up";
  return { score, label, color, reason };
}

// Pages available on the Facebook account (superset of what's connected)
const ALL_FB_PAGES = [
  { id: "lc",  name: "Laugh Central",     category: "Comedy",          followers: "3.2M", avatar: "LC", color: "#8B5CF6", ig: true  },
  { id: "hu",  name: "History Uncovered", category: "Education",       followers: "2.4M", avatar: "HU", color: "#FF6B2B", ig: true  },
  { id: "tb",  name: "TechByte",          category: "Technology",      followers: "1.1M", avatar: "TB", color: "#14B8A6", ig: true  },
  { id: "mm",  name: "Money Matters",     category: "Finance",         followers: "680K", avatar: "MM", color: "#F59E0B", ig: false },
  { id: "dh",  name: "Daily Health Tips", category: "Health",          followers: "420K", avatar: "DH", color: "#6366F1", ig: false },
  { id: "ff",  name: "Fitness Factory",   category: "Fitness",         followers: "310K", avatar: "FF", color: "#EC4899", ig: true  },
  { id: "khn", name: "Know Her Name",     category: "Women's History", followers: "136",  avatar: "KH", color: "#0EA5E9", ig: true  },
  { id: "dm",  name: "Daily Memes HQ",    category: "Entertainment",   followers: "890K", avatar: "DM", color: "#F43F5E", ig: false },
  { id: "su",  name: "Science Unlocked",  category: "Science",         followers: "220K", avatar: "SU", color: "#10B981", ig: true  },
  { id: "ft",  name: "Food Therapy",      category: "Food",            followers: "155K", avatar: "FT", color: "#F97316", ig: true  },
  { id: "mn",  name: "MindSpace",         category: "Mental Health",   followers: "98K",  avatar: "MS", color: "#A855F7", ig: false },
  { id: "wn",  name: "World News Now",    category: "News",            followers: "1.7M", avatar: "WN", color: "#64748B", ig: true  },
];

const ALREADY_CONNECTED_IDS = new Set(["lc","hu","tb","mm","dh","ff","khn"]);

export default function ConnectedIDs() {
  const [selected, setSelected] = useState<string | null>("c1");
  const [expandedStats, setExpandedStats] = useState<Set<string>>(new Set(["c1"]));

  // Bulk connect modal state
  type BulkStep = "idle" | "oauth-loading" | "select" | "importing" | "setup" | "done";
  const [bulkStep, setBulkStep] = useState<BulkStep>("idle");
  const [bulkPages, setBulkPages] = useState(
    ALL_FB_PAGES.map(p => ({ ...p, checked: !ALREADY_CONNECTED_IDS.has(p.id) && ["dm","su","ft"].includes(p.id) }))
  );
  const [bulkProgress, setBulkProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);

  // Per-page setup state: array of configs for each newly imported page
  type PageSetupConfig = { batch: string; timezone: string; interval: string };
  const [pageSetups, setPageSetups] = useState<PageSetupConfig[]>([]);
  const [setupIndex, setSetupIndex] = useState(0);

  const BATCH_OPTIONS = [
    { id: "batch-a", label: "Partner A — Lifestyle",  color: "#8B5CF6" },
    { id: "batch-b", label: "Partner B — Education",  color: "#FF6B2B" },
    { id: "batch-c", label: "Partner C — Women's",    color: "#0EA5E9" },
    { id: "new",     label: "Create new batch…",       color: "#6B7280" },
  ];

  const bulkSelectedCount = bulkPages.filter(p => !ALREADY_CONNECTED_IDS.has(p.id) && p.checked).length;
  const newlyImportedPages = bulkPages.filter(p => !ALREADY_CONNECTED_IDS.has(p.id) && p.checked);
  const currentSetupPage = newlyImportedPages[setupIndex] ?? null;
  const currentSetup = pageSetups[setupIndex] ?? { batch: "batch-a", timezone: "Asia/Karachi (PKT)", interval: "1.5 hrs" };

  const updateCurrentSetup = (field: keyof PageSetupConfig, value: string) => {
    setPageSetups(prev => {
      const next = [...prev];
      next[setupIndex] = { ...currentSetup, [field]: value };
      return next;
    });
  };

  const openBulkModal = () => {
    setBulkStep("oauth-loading");
    setTimeout(() => setBulkStep("select"), 1800);
  };

  const startBulkImport = () => {
    const count = bulkSelectedCount;
    setImportedCount(count);
    // Pre-fill setup configs
    setPageSetups(bulkPages.filter(p => !ALREADY_CONNECTED_IDS.has(p.id) && p.checked).map(() => ({ batch: "batch-a", timezone: "Asia/Karachi (PKT)", interval: "1.5 hrs" })));
    setSetupIndex(0);
    setBulkStep("importing");
    setBulkProgress(0);
    let pct = 0;
    const tick = () => {
      pct += 12;
      if (pct >= 100) { setBulkProgress(100); setBulkStep("setup"); }
      else { setBulkProgress(pct); setTimeout(tick, 140); }
    };
    setTimeout(tick, 140);
  };

  const nextSetupPage = () => {
    if (setupIndex < importedCount - 1) setSetupIndex(i => i + 1);
    else setBulkStep("done");
  };

  const closeBulkModal = () => setBulkStep("idle");

  const toggleExpand = (id: string) => {
    setExpandedStats(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const bestId = [...CONNECTIONS].sort((a, b) => b.totalPostsThisWeek - a.totalPostsThisWeek)[0];
  const throttledCount = CONNECTIONS.flatMap(c => c.pageStats).filter(p => p.avgReachRaw > 0 && p.avgReachRaw < 5000).length;

  // pausedIds: Set of "connId::pageId" keys
  const [pausedIds, setPausedIds] = useState<Set<string>>(new Set(["c3::hu"])); // Ahmed paused on History Uncovered by default

  const togglePause = (connId: string, pageId: string) => {
    const key = `${connId}::${pageId}`;
    setPausedIds(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  void selected; void setSelected; void bestId;

  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold" style={{ color: "var(--text)" }}>Connected IDs</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Facebook accounts connected to MetaReverse · Each ID posts on behalf of your pages · Track reach per ID to find your best performers
            </p>
          </div>
          <button onClick={openBulkModal} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: "var(--primary)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            + Connect Facebook Account
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total IDs", value: CONNECTIONS.length.toString(), sub: "Facebook accounts", color: "var(--primary)" },
            { label: "Active Tokens", value: CONNECTIONS.filter(c => c.status === "active").length.toString(), sub: `of ${CONNECTIONS.length} connected`, color: "#4ADE80" },
            { label: "Posts This Week", value: CONNECTIONS.reduce((a, c) => a + c.totalPostsThisWeek, 0).toString(), sub: "across all IDs", color: "var(--text)" },
            { label: "Low-Reach IDs", value: throttledCount.toString(), sub: `${pausedIds.size} paused · ${throttledCount} below 5K reach`, color: throttledCount > 0 ? "#FBBF24" : "#4ADE80" },
          ].map(card => (
            <div key={card.label} className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{card.label}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: card.color }}>{card.value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Feature callout */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(255,107,43,0.06)", border: "1px solid rgba(255,107,43,0.2)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" className="mt-0.5 flex-shrink-0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "var(--primary)" }}>ID Rotation — Track which account generates the most reach</p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Each Facebook user ID that posts to a page can generate different organic reach. Facebook&apos;s algorithm treats accounts differently — some IDs are &quot;warmer&quot; and reach more people. Enable rotation in Page Settings to distribute posts across IDs, then use the data below to retire underperforming IDs and promote top performers.
            </p>
          </div>
        </div>

        {/* Connection list */}
        <div className="space-y-4">
          {CONNECTIONS.map(conn => {
            const isExpanded = expandedStats.has(conn.id);
            const rotatingPages = conn.pageStats.filter(p => p.isRotating);
            return (
              <div key={conn.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                {/* Header row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: conn.status === "active" ? "#4ADE80" : "#EF4444", fontSize: 13 }}>
                    {conn.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[14px]" style={{ color: "var(--text)" }}>{conn.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium capitalize" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>{conn.role}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${conn.status === "active" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                        {conn.status === "active" ? "● Active" : "● Expired"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{conn.email}</span>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>ID: {conn.fbUserId}</span>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Last active {conn.lastActive}</span>
                    </div>
                  </div>
                  {/* Quick stats */}
                  {(() => {
                    const health = calcHealthScore(conn);
                    return (
                      <div className="flex items-center gap-5 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-[16px] font-bold" style={{ color: "var(--text)" }}>{conn.totalPostsThisWeek}</div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>posts/week</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[16px] font-bold" style={{ color: "#4ADE80" }}>{conn.totalReachThisWeek}</div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>total reach</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[16px] font-bold" style={{ color: "var(--primary)" }}>{rotatingPages.length}</div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>rotating pages</div>
                        </div>
                        {/* Health Score */}
                        <div className="flex flex-col items-center px-3 py-1.5 rounded-xl" style={{ backgroundColor: `${health.color}12`, border: `1px solid ${health.color}30` }}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[18px] font-bold leading-none" style={{ color: health.color }}>{health.score}</span>
                            <span className="text-[9px] font-bold" style={{ color: health.color }}>/100</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: health.color }}>{health.label}</span>
                          <div className="w-16 h-1 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                            <div className="h-full rounded-full" style={{ width: `${health.score}%`, backgroundColor: health.color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {/* Expand toggle */}
                  <button onClick={() => toggleExpand(conn.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>

                {/* Per-page stats table */}
                {isExpanded && (
                  <div className="border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-hover)" }}>
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                        Per-Page Reach Performance · This ID
                      </span>
                    </div>
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {conn.pageStats.map(ps => {
                        const trendColor = ps.reachTrend === "up" ? "#4ADE80" : ps.reachTrend === "down" ? "#EF4444" : "var(--text-muted)";
                        return (
                          <div key={ps.pageId} className="flex items-center gap-4 px-5 py-3 transition-opacity" style={{ opacity: pausedIds.has(`${conn.id}::${ps.pageId}`) ? 0.55 : 1 }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: ps.color }}>{ps.avatar}</div>
                            <span className="text-[12px] font-medium flex-1" style={{ color: "var(--text)" }}>{ps.pageName}</span>
                            {ps.isRotating && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: "rgba(255,107,43,0.1)", color: "var(--primary)" }}>
                                Slot {ps.rotationSlot} · Rotating
                              </span>
                            )}
                            {pausedIds.has(`${conn.id}::${ps.pageId}`) && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: "rgba(251,191,36,0.1)", color: "#FBBF24" }}>
                                ⏸ Paused
                              </span>
                            )}
                            <div className="flex items-center gap-5 flex-shrink-0">
                              <div className="text-center w-16">
                                <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{ps.postsThisWeek}</div>
                                <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>posts/wk</div>
                              </div>
                              <div className="text-center w-16">
                                <div className="text-[13px] font-semibold" style={{ color: "#4ADE80" }}>{ps.avgReach}</div>
                                <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>avg reach</div>
                              </div>
                              <div className="flex items-center gap-1 w-16 justify-center">
                                {ps.reachTrend === "up" && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={trendColor} strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
                                {ps.reachTrend === "down" && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={trendColor} strokeWidth="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>}
                                {ps.reachTrend === "stable" && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={trendColor} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>}
                                <span className="text-[10px] font-medium capitalize" style={{ color: trendColor }}>{ps.reachTrend}</span>
                              </div>
                            </div>
                            {/* Pause/Resume */}
                            {(() => {
                              const key = `${conn.id}::${ps.pageId}`;
                              const isPaused = pausedIds.has(key);
                              return (
                                <button
                                  onClick={() => togglePause(conn.id, ps.pageId)}
                                  className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg flex-shrink-0 transition-all"
                                  style={{
                                    backgroundColor: isPaused ? "rgba(251,191,36,0.1)" : "var(--surface-hover)",
                                    color: isPaused ? "#FBBF24" : "var(--text-muted)",
                                    border: isPaused ? "1px solid rgba(251,191,36,0.25)" : "1px solid transparent",
                                  }}>
                                  {isPaused ? (
                                    <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>Resume</>
                                  ) : (
                                    <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>Pause</>
                                  )}
                                </button>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                    {conn.status === "expired" && (
                      <div className="border-t" style={{ borderColor: "var(--border)" }}>
                        {/* Token expired row */}
                        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)", backgroundColor: "rgba(239,68,68,0.04)" }}>
                          <span className="text-[12px]" style={{ color: "#EF4444" }}>Token expired — this ID is no longer posting</span>
                          <button className="text-[12px] font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: "#EF4444" }}>Reconnect</button>
                        </div>
                        {/* Checkpoint Diagnosis */}
                        {conn.checkpoint && (
                          <div className="px-5 py-4" style={{ backgroundColor: "rgba(239,68,68,0.03)" }}>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.12)" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[12px] font-semibold" style={{ color: "#EF4444" }}>Checkpoint Diagnosis</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444" }}>
                                    {conn.checkpoint.reason}
                                  </span>
                                </div>
                                <p className="text-[11px] mb-2" style={{ color: "var(--text-secondary)" }}>{conn.checkpoint.detail}</p>
                                <a href={conn.checkpoint.actionUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold"
                                  style={{ color: "var(--primary)" }}>
                                  {conn.checkpoint.action}
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ── BULK CONNECT MODAL ── */}
      {bulkStep !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
          <div className="w-[540px] rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxHeight: "88vh" }}>

            {/* Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#1877F2" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
                    {bulkStep === "oauth-loading" ? "Connecting to Facebook…"
                      : bulkStep === "select" ? "Select pages to add"
                      : bulkStep === "importing" ? "Importing pages…"
                      : bulkStep === "setup" ? `Set up: ${currentSetupPage?.name ?? ""}`
                      : "Pages added successfully"}
                  </h2>
                  {bulkStep === "select" && (
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Found {ALL_FB_PAGES.length} pages on this account · {ALREADY_CONNECTED_IDS.size} already connected</p>
                  )}
                </div>
              </div>
              {(bulkStep === "select" || bulkStep === "setup" || bulkStep === "done") && (
                <button onClick={closeBulkModal} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            {/* OAuth loading */}
            {bulkStep === "oauth-loading" && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#1877F2" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>Fetching pages from your Facebook account…</p>
              </div>
            )}

            {/* Select pages */}
            {bulkStep === "select" && (
              <>
                <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    <strong style={{ color: "var(--text)" }}>{bulkSelectedCount}</strong> new page{bulkSelectedCount !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setBulkPages(p => p.map(x => ALREADY_CONNECTED_IDS.has(x.id) ? x : { ...x, checked: true }))}
                      className="text-[11px] px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--surface-hover)", color: "var(--primary)" }}>Select all new</button>
                    <button onClick={() => setBulkPages(p => p.map(x => ALREADY_CONNECTED_IDS.has(x.id) ? x : { ...x, checked: false }))}
                      className="text-[11px] px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>None</button>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {bulkPages.map(page => {
                    const already = ALREADY_CONNECTED_IDS.has(page.id);
                    return (
                      <div key={page.id}
                        onClick={() => !already && setBulkPages(prev => prev.map(p => p.id === page.id ? { ...p, checked: !p.checked } : p))}
                        className="flex items-center gap-4 px-6 py-3.5 border-b last:border-0 transition-all"
                        style={{
                          borderColor: "var(--border)",
                          backgroundColor: already ? "transparent" : page.checked ? "rgba(255,107,43,0.04)" : "transparent",
                          cursor: already ? "default" : "pointer",
                          opacity: already ? 0.5 : 1,
                        }}>
                        {/* Checkbox */}
                        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: already ? "var(--surface-hover)" : page.checked ? "var(--primary)" : "transparent", border: `1.5px solid ${already ? "var(--border)" : page.checked ? "var(--primary)" : "var(--border)"}` }}>
                          {already
                            ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            : page.checked && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{page.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>{page.category}</span>
                            {already && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ADE80" }}>Already connected</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{page.followers} followers</span>
                            {page.ig && <span className="text-[10px]" style={{ color: "#E1306C" }}>+ Instagram</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-6 py-4 border-t flex gap-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                  <button onClick={closeBulkModal} className="px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>Cancel</button>
                  <button onClick={startBulkImport} disabled={bulkSelectedCount === 0}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
                    style={{ backgroundColor: "var(--primary)", boxShadow: bulkSelectedCount > 0 ? "0 2px 10px var(--primary-glow)" : "none" }}>
                    Add {bulkSelectedCount > 0 ? bulkSelectedCount : ""} Page{bulkSelectedCount !== 1 ? "s" : ""} →
                  </button>
                </div>
              </>
            )}

            {/* Importing progress */}
            {bulkStep === "importing" && (
              <div className="flex flex-col items-center justify-center py-12 px-8 gap-5">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <div className="w-full">
                  <div className="flex justify-between text-[12px] mb-2">
                    <span style={{ color: "var(--text)" }}>Importing {importedCount} pages…</span>
                    <span style={{ color: "var(--text-muted)" }}>{bulkProgress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div className="h-full rounded-full transition-all duration-150" style={{ width: `${bulkProgress}%`, backgroundColor: "var(--primary)" }} />
                  </div>
                  <p className="text-[11px] mt-3 text-center" style={{ color: "var(--text-muted)" }}>Connecting pages, verifying permissions, and syncing metadata</p>
                </div>
              </div>
            )}

            {/* Setup step — per page */}
            {bulkStep === "setup" && currentSetupPage && (
              <>
                {/* Progress bar */}
                <div className="px-6 pt-4 pb-2 flex-shrink-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: currentSetupPage.color }}>{currentSetupPage.avatar}</div>
                      <div>
                        <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{currentSetupPage.name}</span>
                        <span className="text-[11px] ml-1.5" style={{ color: "var(--text-muted)" }}>{currentSetupPage.category} · {currentSetupPage.followers} followers</span>
                      </div>
                    </div>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{setupIndex + 1} of {importedCount}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${((setupIndex + 1) / importedCount) * 100}%`, backgroundColor: "var(--primary)" }} />
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-4">
                  <p className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>Configure this page independently. You can change these in Page Settings anytime.</p>

                  {/* Batch assignment */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Assign to Batch</div>
                    <div className="grid grid-cols-2 gap-2">
                      {BATCH_OPTIONS.map(b => (
                        <button key={b.id} onClick={() => updateCurrentSetup("batch", b.id)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                          style={{ border: `2px solid ${currentSetup.batch === b.id ? b.color : "var(--border)"}`, backgroundColor: currentSetup.batch === b.id ? `${b.color}10` : "var(--surface-hover)" }}>
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                          <span className="text-[12px] font-medium" style={{ color: currentSetup.batch === b.id ? b.color : "var(--text-secondary)" }}>{b.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Timezone</div>
                    <select value={currentSetup.timezone} onChange={e => updateCurrentSetup("timezone", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
                      style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)" }}>
                      {["Asia/Karachi (PKT)","America/New_York (EST)","America/Los_Angeles (PST)","Europe/London (GMT)","Asia/Dubai (GST)","Asia/Kolkata (IST)"].map(tz => (
                        <option key={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  {/* Post interval */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Post Interval</div>
                    <div className="flex gap-2 flex-wrap">
                      {["30 min","1 hr","1.5 hrs","2 hrs","3 hrs","4 hrs"].map(opt => (
                        <button key={opt} onClick={() => updateCurrentSetup("interval", opt)}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                          style={{ backgroundColor: currentSetup.interval === opt ? "var(--primary)" : "var(--surface-hover)", color: currentSetup.interval === opt ? "white" : "var(--text-secondary)" }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t flex gap-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => setBulkStep("done")} className="px-4 py-2.5 rounded-xl text-[12px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                    Skip Remaining
                  </button>
                  <button onClick={nextSetupPage}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white"
                    style={{ backgroundColor: "var(--primary)", boxShadow: "0 2px 10px var(--primary-glow)" }}>
                    {setupIndex < importedCount - 1 ? `Next Page →` : "Finish Setup ✓"}
                  </button>
                </div>
              </>
            )}

            {/* Done */}
            {bulkStep === "done" && (
              <div className="flex flex-col items-center justify-center py-10 px-8 gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#4ADE80" }}><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="text-center">
                  <p className="text-[17px] font-semibold mb-1" style={{ color: "var(--text)" }}>{importedCount} page{importedCount !== 1 ? "s" : ""} added</p>
                  <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Each page configured and assigned to its batch. Analytics will sync within 24 hours.</p>
                </div>
                <button onClick={closeBulkModal} className="mt-2 px-8 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useRole } from "@/contexts/RoleContext";
import AlertBanner from "@/components/AlertBanner";
import { useIsMobile } from "@/hooks/useIsMobile";

// ─── Data ────────────────────────────────────────────────────────────────────

const ALL_PAGES = [
  { id: "lc",  name: "Laugh Central",     avatar: "LC", color: "#8B5CF6", followers: "3.2M",  revenue: 4690,  rpm: 10.20, rpmChange: 31,  views7d: 24200000, viewsChange: 18,  engRate: 6.8, queueNext24h: 8, failedPosts: 0, tokenDays: 58, status: "healthy"   as const },
  { id: "hu",  name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M",  revenue: 3842,  rpm: 9.12,  rpmChange: 12,  views7d: 18500000, viewsChange: 5,   engRate: 4.2, queueNext24h: 6, failedPosts: 0, tokenDays: 58, status: "healthy"   as const },
  { id: "tb",  name: "TechByte",          avatar: "TB", color: "#14B8A6", followers: "1.1M",  revenue: 2180,  rpm: 8.95,  rpmChange: -3,  views7d: 8700000,  viewsChange: -8,  engRate: 2.9, queueNext24h: 4, failedPosts: 0, tokenDays: 5,  status: "attention" as const },
  { id: "dh",  name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K",  revenue: 1245,  rpm: 7.80,  rpmChange: 8,   views7d: 3200000,  viewsChange: 2,   engRate: 3.8, queueNext24h: 3, failedPosts: 0, tokenDays: 42, status: "healthy"   as const },
  { id: "ff",  name: "Fitness Factory",   avatar: "FF", color: "#EC4899", followers: "310K",  revenue: 890,   rpm: 6.40,  rpmChange: 22,  views7d: 2100000,  viewsChange: 15,  engRate: 5.1, queueNext24h: 2, failedPosts: 0, tokenDays: 42, status: "healthy"   as const },
  { id: "mm",  name: "Money Matters",     avatar: "MM", color: "#F59E0B", followers: "680K",  revenue: 0,     rpm: 0,     rpmChange: 0,   views7d: 5400000,  viewsChange: -15, engRate: 2.1, queueNext24h: 0, failedPosts: 3, tokenDays: 0,  status: "critical"  as const },
  { id: "khn", name: "Know Her Name",     avatar: "KH", color: "#0EA5E9", followers: "136",   revenue: 4.45,  rpm: 0.23,  rpmChange: 100, views7d: 21000,    viewsChange: 42,  engRate: 3.4, queueNext24h: 1, failedPosts: 0, tokenDays: 30, status: "healthy"   as const },
];

const PAGE_HEALTH: Record<string, {
  monetization: "eligible" | "restricted" | "suspended";
  flags: number; copyrightStrikes: number; distributionRestricted: boolean;
  payoutStatus: "on_time" | "pending" | "on_hold";
}> = {
  lc:  { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
  hu:  { monetization: "eligible",   flags: 1, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
  tb:  { monetization: "restricted", flags: 0, copyrightStrikes: 1, distributionRestricted: true,  payoutStatus: "pending" },
  dh:  { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
  ff:  { monetization: "eligible",   flags: 2, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
  mm:  { monetization: "suspended",  flags: 3, copyrightStrikes: 1, distributionRestricted: true,  payoutStatus: "on_hold" },
  khn: { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time" },
};

const FAILED_POSTS = [
  { id: "f1", page: "Money Matters",  avatar: "MM", color: "#F59E0B", caption: "5 Investment Tips for 2025...",  time: "2h ago",  error: "Token expired",  platforms: "FB + IG" },
  { id: "f2", page: "Money Matters",  avatar: "MM", color: "#F59E0B", caption: "How to Save $10K This Year...", time: "5h ago",  error: "Token expired",  platforms: "FB" },
  { id: "f3", page: "Money Matters",  avatar: "MM", color: "#F59E0B", caption: "Crypto Market Update...",       time: "8h ago",  error: "Token expired",  platforms: "FB + IG + TH" },
  { id: "f4", page: "TechByte",       avatar: "TB", color: "#14B8A6", caption: "AI Revolution: What's Next...", time: "1d ago",  error: "Rate limited",   platforms: "FB" },
];

const VIRAL_POSTS = [
  { id: "v1", page: "Laugh Central",     avatar: "LC", color: "#8B5CF6", caption: "Monday morning energy hits different when you've had 3 coffees...", views: "2.4M", multiplier: "13x", hoursAgo: 3 },
  { id: "v2", page: "History Uncovered", avatar: "HU", color: "#FF6B2B", caption: "The forgotten queen who ruled an empire for 40 years...",          views: "890K", multiplier: "9x",  hoursAgo: 6 },
  { id: "v3", page: "Know Her Name",     avatar: "KH", color: "#0EA5E9", caption: "Marie Curie was told women couldn't be scientists...",              views: "340K", multiplier: "9x",  hoursAgo: 11 },
];

const BATCHES = [
  { id: "b1", name: "Partner A — Lifestyle", color: "#F59E0B", health: "healthy",  revenue: "$48.2K", change: "+14%", changeUp: true  },
  { id: "b2", name: "Partner B — Education", color: "#60A5FA", health: "stable",   revenue: "$38.1K", change: "+2%",  changeUp: true  },
  { id: "b3", name: "Partner C — Women's",   color: "#F87171", health: "at-risk",  revenue: "$5.1K",  change: "-22%", changeUp: false },
];

const HEALTH_COLOR: Record<string, string> = {
  healthy: "#4ADE80", stable: "#60A5FA", declining: "#FBBF24", "at-risk": "#F87171",
};

// Platform split per period (% of views per platform)
const PLATFORM_SPLIT: Record<string, { fb: number; ig: number; th: number }> = {
  today:     { fb: 71, ig: 24, th: 5 },
  yesterday: { fb: 69, ig: 26, th: 5 },
  "7d":      { fb: 70, ig: 25, th: 5 },
  "28d":     { fb: 68, ig: 27, th: 5 },
};

// Format contribution: volume split (posts) vs revenue split + absolute $
const FORMAT_SPLIT: Record<string, { reels: number; photos: number; reelsRev: number; photosRev: number; reelsFollowers: number; reelsRevAbs: string; photosRevAbs: string }> = {
  today:     { reels: 58, photos: 42, reelsRev: 38, photosRev: 62, reelsFollowers: 97, reelsRevAbs: "$700",    photosRevAbs: "$1,142"  },
  yesterday: { reels: 62, photos: 38, reelsRev: 34, photosRev: 66, reelsFollowers: 96, reelsRevAbs: "$520",    photosRevAbs: "$1,010"  },
  "7d":      { reels: 55, photos: 45, reelsRev: 41, photosRev: 59, reelsFollowers: 97, reelsRevAbs: "$5,269",  photosRevAbs: "$7,582"  },
  "28d":     { reels: 60, photos: 40, reelsRev: 39, photosRev: 61, reelsFollowers: 97, reelsRevAbs: "$18,873", photosRevAbs: "$29,519" },
};

// Per-post efficiency (from results page)
const PER_POST: Record<string, { avgReach: string; linkClicks: string; engRate: string; postsPublished: number }> = {
  today:     { avgReach: "3,247", linkClicks: "0.3",  engRate: "17.71%", postsPublished: 12  },
  yesterday: { avgReach: "3,108", linkClicks: "0.2",  engRate: "16.90%", postsPublished: 16  },
  "7d":      { avgReach: "3,182", linkClicks: "0.2",  engRate: "16.40%", postsPublished: 94  },
  "28d":     { avgReach: "3,341", linkClicks: "0.2",  engRate: "17.71%", postsPublished: 389 },
};

// Net follows by content type
const NET_FOLLOWS_BY_TYPE: Record<string, { reels: number; photos: number; text: number }> = {
  today:     { reels: 46,    photos: 1,    text: 0   },
  yesterday: { reels: 59,    photos: 2,    text: 0   },
  "7d":      { reels: 401,   photos: 10,   text: 1   },
  "28d":     { reels: 1211,  photos: 35,   text: 2   },
};

// Posting ID infrastructure
const POSTING_IDS = [
  { name: "Taimur", score: 88, trend: "stable"   as const, reachPct: 68 },
  { name: "Sarah",  score: 72, trend: "declining" as const, reachPct: 22 },
  { name: "Ahmed",  score: 91, trend: "stable"   as const, reachPct: 10 },
];

// Audience geography / quality
const AUDIENCE_GEO = { usPercent: 62, usChange: -3, topCountries: ["US 62%", "CO 9%", "GT 7%"] };

// Which platforms each page publishes to
const PAGE_PLATFORMS: Record<string, string[]> = {
  lc:  ["FB","IG"],
  hu:  ["FB","IG"],
  tb:  ["FB"],
  dh:  ["FB","IG","TH"],
  ff:  ["FB","IG"],
  mm:  ["FB","IG","TH"],
  khn: ["FB"],
};

type Period = "today" | "yesterday" | "7d" | "28d";
const PERIOD_DATA: Record<Period, {
  revenue: string; revenueChange: string; revenueUp: boolean;
  rpm: string; rpmChange: string; rpmUp: boolean;
  views: string; viewsChange: string; viewsUp: boolean;
  reach: string; reachChange: string; reachUp: boolean;
  followers: string; followersChange: string; followersUp: boolean;
  engRate: string; engRateChange: string; engRateUp: boolean;
  published: number; publishedChange: string; publishedUp: boolean;
}> = {
  today:     { revenue: "$1,842",  revenueChange: "+$312 vs yesterday",  revenueUp: true,  rpm: "$8.94",  rpmChange: "+$0.12 vs yesterday",   rpmUp: true,  views: "8.7M",   viewsChange: "+3% vs yesterday",  viewsUp: true,  reach: "5.9M",   reachChange: "+2% vs yesterday",  reachUp: true,  followers: "24,232", followersChange: "+47 today",         followersUp: true, engRate: "17.71%", engRateChange: "+1.2% vs yesterday", engRateUp: true,  published: 12,  publishedChange: "posts today",      publishedUp: true  },
  yesterday: { revenue: "$1,530",  revenueChange: "+$214 vs prior day",  revenueUp: true,  rpm: "$8.82",  rpmChange: "+$0.05 vs prior day",    rpmUp: true,  views: "8.2M",   viewsChange: "+1% vs prior day",  viewsUp: true,  reach: "5.5M",   reachChange: "+1% vs prior day",  reachUp: true,  followers: "24,185", followersChange: "+61 yesterday",     followersUp: true, engRate: "16.9%",  engRateChange: "-0.3% vs prior",     engRateUp: false, published: 16,  publishedChange: "posts went live",  publishedUp: true  },
  "7d":      { revenue: "$12,851", revenueChange: "↑ 14% vs prev 7d",   revenueUp: true,  rpm: "$9.05",  rpmChange: "↑ $0.38 vs prev 7d",     rpmUp: true,  views: "62.1M",  viewsChange: "↑ 8% vs prev 7d",   viewsUp: true,  reach: "41.8M",  reachChange: "↑ 6% vs prev 7d",   reachUp: true,  followers: "24,232", followersChange: "+412 this week",    followersUp: true, engRate: "16.4%",  engRateChange: "↑ 0.9% vs prev 7d", engRateUp: true,  published: 94,  publishedChange: "posts this week",  publishedUp: true  },
  "28d":     { revenue: "$48,392", revenueChange: "↑ 9% vs prev 28d",   revenueUp: true,  rpm: "$9.21",  rpmChange: "↑ $0.82 vs prev 28d",    rpmUp: true,  views: "224M",   viewsChange: "↑ 12% vs prev 28d", viewsUp: true,  reach: "151M",   reachChange: "↑ 10% vs prev 28d", reachUp: true,  followers: "24,232", followersChange: "+1,248 this month", followersUp: true, engRate: "17.71%", engRateChange: "↑ 2.1% vs prev 28d",engRateUp: true,  published: 389, publishedChange: "posts this month", publishedUp: true  },
};

const SPARKLINES: Record<string, number[]> = {
  revenue:   [820,940,880,1020,960,1100,1050,1220,1180,1340,1290,1480,1420,1842],
  rpm:       [8.1,8.2,8.0,8.3,8.4,8.5,8.6,8.7,8.8,8.9,8.8,9.0,8.9,8.94],
  views:     [5.2,5.8,5.4,6.1,5.9,6.4,6.2,6.9,7.1,7.4,7.2,7.8,7.6,8.7],
  reach:     [3.4,3.9,3.7,4.1,4.0,4.3,4.2,4.6,4.8,5.0,4.9,5.3,5.2,5.9],
  followers: [23568,23612,23645,23669,23688,23712,23781,23824,23888,23941,23997,24058,24163,24232],
  engRate:   [14.2,14.8,15.1,15.6,16.0,16.4,16.8,17.0,17.2,17.4,17.5,17.6,17.7,17.71],
  published: [8,11,9,12,10,14,9,11,13,10,12,11,13,12],
};

const NET_VIEWS     = [180,210,195,230,215,245,238,260,254,275,269,290,284,305,299,320,340,380,420,480,510,440,460,490,520,560,590,620];
const NET_EARNINGS  = [42,48,45,52,50,58,55,62,60,68,65,72,70,78,76,84,88,96,110,124,132,114,118,126,134,144,150,160];
const NET_FOLLOWERS = [14,18,16,21,19,24,22,27,25,30,28,34,32,38,36,42,48,55,62,72,78,68,70,74,78,84,88,94];

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

// ─── Micro components ────────────────────────────────────────────────────────

function Spark({ data, color, height = 28 }: { data: number[]; color: string; height?: number }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const w = 80;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NetworkChart() {
  const W = 800, H = 160, PAD = 8;
  const norm = (arr: number[]) => {
    const mn = Math.min(...arr), mx = Math.max(...arr), r = mx - mn || 1;
    return arr.map((v, i) => `${(i / (arr.length - 1)) * W},${H - ((v - mn) / r) * (H - PAD * 2) - PAD}`);
  };
  const mkPath = (pts: string[]) => "M" + pts.join(" L");
  const mkFill = (pts: string[]) => mkPath(pts) + ` L${W},${H} L0,${H} Z`;
  const vPts = norm(NET_VIEWS), ePts = norm(NET_EARNINGS), fPts = norm(NET_FOLLOWERS);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="v3Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={mkFill(vPts)} fill="url(#v3Grad)" />
        <path d={mkPath(vPts)} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={mkPath(ePts)} fill="none" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
        <path d={mkPath(fPts)} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3" />
      </svg>
      <div className="flex justify-between mt-1">
        {["Mar 11","Mar 18","Mar 25","Apr 1","Apr 8"].map(l => (
          <span key={l} className="text-[10px]" style={{ color: "var(--text-muted)" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function DashboardV3() {
  const { role, batchConfig } = useRole();
  const isMobile = useIsMobile();
  const [period, setPeriod] = useState<Period>("7d");
  const [pageSearch, setPageSearch] = useState("");
  const [tableSort, setTableSort] = useState<"revenue" | "views" | "rpm" | "eng">("revenue");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandOps, setExpandOps] = useState(false);
  const [showTokenBanner, setShowTokenBanner] = useState(true);
  const [showDisconnectBanner, setShowDisconnectBanner] = useState(true);

  const isOwner = role === "owner" || role === "co-owner";
  const visiblePages = isOwner ? ALL_PAGES : ALL_PAGES.filter(p => batchConfig.pages.includes(p.id));
  const visibleFailed = isOwner ? FAILED_POSTS : FAILED_POSTS.filter(f => batchConfig.pages.some(pid => ALL_PAGES.find(p => p.id === pid)?.avatar === f.avatar));

  const kpi = PERIOD_DATA[period];
  const failedCount    = visibleFailed.length;
  const emptyQueues    = visiblePages.filter(p => p.queueNext24h === 0).length;
  const expiringTokens = visiblePages.filter(p => p.tokenDays > 0 && p.tokenDays <= 7).length;
  const scheduled      = 142;
  const avgQueueDepth  = (visiblePages.reduce((s, p) => s + p.queueNext24h, 0) / visiblePages.length).toFixed(1);
  const monetizedCount = visiblePages.filter(p => p.revenue > 0).length;
  const avgRpm         = (visiblePages.filter(p => p.rpm > 0).reduce((s, p) => s + p.rpm, 0) / monetizedCount || 0).toFixed(2);

  const togglePage = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    const filtered = visiblePages.filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()));
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));
  };

  const filteredPages = visiblePages
    .filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()))
    .sort((a, b) => {
      if (tableSort === "revenue") return b.revenue - a.revenue;
      if (tableSort === "rpm")     return b.rpm - a.rpm;
      if (tableSort === "eng")     return b.engRate - a.engRate;
      return b.views7d - a.views7d;
    });

  const KPI_TILES = [
    { key: "revenue",   label: "Revenue",    value: kpi.revenue,              change: kpi.revenueChange,   up: kpi.revenueUp,   color: "#4ADE80", href: "/reports/earnings" },
    { key: "rpm",       label: "Avg RPM",    value: kpi.rpm,                  change: kpi.rpmChange,       up: kpi.rpmUp,       color: "#8B5CF6", href: "/reports/earnings" },
    { key: "views",     label: "Views",      value: kpi.views,                change: kpi.viewsChange,     up: kpi.viewsUp,     color: "var(--primary)", href: "/reports/results" },
    { key: "reach",     label: "Reach",      value: kpi.reach,                change: kpi.reachChange,     up: kpi.reachUp,     color: "#14B8A6", href: "/reports/results" },
    { key: "followers", label: "Followers",  value: kpi.followers,            change: kpi.followersChange, up: kpi.followersUp, color: "#F59E0B", href: "/reports/audience" },
    { key: "engRate",   label: "Engagement", value: kpi.engRate,              change: kpi.engRateChange,   up: kpi.engRateUp,   color: "#EC4899", href: "/reports/results" },
    { key: "published", label: "Posts Live", value: String(kpi.published),    change: kpi.publishedChange, up: kpi.publishedUp, color: "#60A5FA", href: "/published" },
  ];

  const OPS_TILES = [
    { label: "Failed",       value: failedCount,              warn: failedCount > 0,    critical: failedCount > 2,    href: "/failed-posts"    },
    { label: "Scheduled",    value: scheduled,                warn: false,              critical: false,              href: "/queue"           },
    { label: "Empty Queues", value: emptyQueues,              warn: emptyQueues > 0,    critical: emptyQueues > 2,    href: "/queue"           },
    { label: "Expiring",     value: expiringTokens,           warn: expiringTokens > 0, critical: false,              href: "/settings/pages"  },
    { label: "Pages",        value: visiblePages.length,      warn: false,              critical: false,              href: "/settings/pages"  },
    { label: "Avg Queue",    value: `${avgQueueDepth}`,       warn: parseFloat(avgQueueDepth) < 3, critical: false,  href: "/queue"           },
    { label: "Published",    value: kpi.published,            warn: false,              critical: false,              href: "/published"       },
  ];

  // Mobile
  if (isMobile) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Revenue · 7 days</div>
          <div className="text-[28px] font-bold" style={{ color: "var(--text)" }}>$12,851</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--success)" }}>↑ 14% vs prior week</div>
        </div>
        {failedCount > 0 && (
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="text-[12px] font-medium" style={{ color: "#EF4444" }}>{failedCount} failed posts need attention</span>
            <Link href="/failed-posts" className="ml-auto text-[11px] font-semibold" style={{ color: "#EF4444" }}>Fix →</Link>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {KPI_TILES.slice(2).map(t => (
            <Link key={t.key} href={t.href} className="rounded-xl p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{t.label}</div>
              <div className="text-[16px] font-bold" style={{ color: "var(--text)" }}>{t.value}</div>
              <div className="text-[10px]" style={{ color: t.up ? "var(--success)" : "var(--error)" }}>{t.up ? "↑" : "↓"} {t.change}</div>
            </Link>
          ))}
        </div>
        <Link href="/reports" className="block text-center text-[12px] font-semibold py-2 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--primary)" }}>
          Full Analytics →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Alert banners */}
      {showDisconnectBanner && (
        <AlertBanner
          type="danger"
          message="Money Matters is disconnected — posts are failing. Reconnect now to resume publishing."
          action="Reconnect"
          onAction={() => {}}
          onDismiss={() => setShowDisconnectBanner(false)}
        />
      )}
      {showTokenBanner && (
        <AlertBanner
          type="warning"
          message="TechByte's token expires in 5 days. Reconnect before it expires to avoid interruptions."
          action="Reconnect"
          onAction={() => {}}
          onDismiss={() => setShowTokenBanner(false)}
        />
      )}

      <Header
        title="Dashboard"
        subtitle="Portfolio intelligence + operational control."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[12px] px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>← v1</Link>
            <Link href="/dashboard-v2" className="text-[12px] px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>v2</Link>
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
              {(["today","yesterday","7d","28d"] as Period[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-medium"
                  style={{
                    backgroundColor: period === p ? "var(--bg)" : "transparent",
                    color: period === p ? "var(--text)" : "var(--text-secondary)",
                    boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                  }}>
                  {p === "today" ? "Today" : p === "yesterday" ? "Yesterday" : p}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Batch context banner for non-owners */}
      {!isOwner && (
        <div className="mb-4 px-4 py-2.5 rounded-xl flex items-center gap-2 text-[12px] font-medium"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/></svg>
          Viewing: <span style={{ color: "var(--text)" }} className="font-semibold">{batchConfig.label}</span>
          <span style={{ color: "var(--text-muted)" }}>· {visiblePages.length} pages</span>
        </div>
      )}

      {/* ── Zone 1: KPI Command Bar ── */}
      <div className="grid grid-cols-7 gap-3 mb-6">
        {KPI_TILES.map(tile => (
          <Link key={tile.key} href={tile.href}
            className="rounded-xl px-3 py-3 flex flex-col gap-1 group hover:brightness-105 transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{tile.label}</span>
              <Spark data={SPARKLINES[tile.key]} color={tile.color} height={22} />
            </div>
            <div className="text-[19px] font-bold leading-none tabular-nums" style={{ color: "var(--text)" }}>{tile.value}</div>
            <div className="text-[10px] font-medium" style={{ color: tile.up ? "var(--success)" : "var(--error)" }}>
              {tile.up ? "↑" : "↓"} {tile.change}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Format Contribution Strip ── */}
      {(() => {
        const fmt = FORMAT_SPLIT[period];
        const plt = PLATFORM_SPLIT[period];
        const reelsSkew = fmt.reels > 65; // too many reels = follower growth but revenue risk
        const photosSkew = fmt.photos > 60; // too many photos = revenue focused but growth risk
        return (
          <div className="rounded-xl px-5 py-3.5 mb-5 flex items-center gap-6"
            style={{ background: "var(--surface)", border: `1px solid ${reelsSkew || photosSkew ? "rgba(251,191,36,0.4)" : "var(--border)"}` }}>

            {/* Format split */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>Content Format Mix</span>
                {(reelsSkew || photosSkew) && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(251,191,36,0.1)", color: "#FBBF24" }}>
                    ⚠ {reelsSkew ? "Reel-heavy — revenue at risk" : "Photo-heavy — growth at risk"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-1.5">
                <div className="h-2 rounded-l-full" style={{ width: `${fmt.reels}%`, backgroundColor: "#8B5CF6", transition: "width 0.3s" }} />
                <div className="h-2 rounded-r-full" style={{ width: `${fmt.photos}%`, backgroundColor: "#F59E0B", transition: "width 0.3s" }} />
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#8B5CF6" }} />
                  <span style={{ color: "var(--text-muted)" }}>Reels <span className="font-bold" style={{ color: "var(--text)" }}>{fmt.reels}%</span></span>
                  <span className="font-semibold tabular-nums" style={{ color: "#8B5CF6" }}>{fmt.reelsRevAbs}</span>
                  <span style={{ color: "var(--text-muted)" }}>·</span>
                  <span style={{ color: "#F59E0B" }}>↑{fmt.reelsFollowers}% of new followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#F59E0B" }} />
                  <span style={{ color: "var(--text-muted)" }}>Photos <span className="font-bold" style={{ color: "var(--text)" }}>{fmt.photos}%</span></span>
                  <span className="font-semibold tabular-nums" style={{ color: "#4ADE80" }}>{fmt.photosRevAbs}</span>
                  <span style={{ color: "var(--text-muted)" }}>·</span>
                  <span style={{ color: "#4ADE80" }}>↑{fmt.photosRev}% of revenue</span>
                </div>
              </div>
            </div>

            <div className="w-px h-10 shrink-0" style={{ background: "var(--border)" }} />

            {/* Platform split */}
            <div className="shrink-0">
              <div className="text-[11px] font-semibold mb-2" style={{ color: "var(--text)" }}>Platform Views Split</div>
              <div className="flex items-center gap-3">
                {[
                  { id: "FB", pct: plt.fb, color: "#1877F2" },
                  { id: "IG", pct: plt.ig, color: "#E1306C" },
                  { id: "TH", pct: plt.th, color: "var(--text-muted)" },
                ].map(pl => (
                  <div key={pl.id} className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${pl.color}22`, color: pl.color }}>{pl.id}</span>
                    <span className="text-[11px] font-semibold tabular-nums" style={{ color: "var(--text)" }}>{pl.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-px h-10 shrink-0" style={{ background: "var(--border)" }} />

            {/* Revenue platform split */}
            <div className="shrink-0">
              <div className="text-[11px] font-semibold mb-2" style={{ color: "var(--text)" }}>Revenue by Platform</div>
              <div className="flex items-center gap-3">
                {[
                  { id: "FB", pct: fmt.photosRev, color: "#1877F2" },
                  { id: "IG", pct: Math.round((100 - fmt.photosRev) * 0.85), color: "#E1306C" },
                  { id: "TH", pct: Math.round((100 - fmt.photosRev) * 0.15), color: "var(--text-muted)" },
                ].map(pl => (
                  <div key={pl.id} className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${pl.color}22`, color: pl.color }}>{pl.id}</span>
                    <span className="text-[11px] font-semibold tabular-nums" style={{ color: "var(--text)" }}>{pl.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-px h-10 shrink-0" style={{ background: "var(--border)" }} />

            {/* Per-post efficiency */}
            {(() => {
              const pp = PER_POST[period];
              return (
                <div className="shrink-0">
                  <div className="text-[11px] font-semibold mb-2" style={{ color: "var(--text)" }}>Per-Post Efficiency</div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[13px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{pp.avgReach}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Avg reach</div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{pp.linkClicks}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Link clicks</div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{pp.engRate}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Eng. rate</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <Link href="/reports/results" className="shrink-0 text-[11px] font-semibold ml-2" style={{ color: "var(--primary)" }}>
              Deep dive →
            </Link>
          </div>
        );
      })()}

      {/* ── Zones 2 + 3: Two-column layout ── */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>

        {/* ── LEFT: Intelligence + Operations ── */}
        <div className="flex flex-col gap-6">

          {/* Network Performance Chart */}
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Network Performance</div>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Mar 11 – Apr 8, 2026 · All pages</p>
              </div>
              <div className="flex items-center gap-5">
                {[
                  { label: "Views",    color: "var(--primary)", dash: false },
                  { label: "Earnings", color: "#4ADE80",        dash: true  },
                  { label: "Followers",color: "#F59E0B",        dash: true  },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <svg width="18" height="4" viewBox="0 0 18 4">
                      <line x1="0" y1="2" x2="18" y2="2" stroke={l.color} strokeWidth="2"
                        strokeDasharray={l.dash ? "4 2" : "none"} strokeLinecap="round" />
                    </svg>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <NetworkChart />
          </div>

          {/* ── Unified Pages Table (v1 ops + v2 intelligence merged) ── */}
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>

            {/* Table header */}
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Pages</div>
                {selected.size > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>
                    {selected.size} selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="flex items-center gap-0.5">
                  {([["revenue","Revenue"],["views","Views"],["rpm","RPM"],["eng","Engagement"]] as const).map(([k,l]) => (
                    <button key={k} onClick={() => setTableSort(k)}
                      className="px-2 py-1 rounded-md text-[11px] font-medium"
                      style={{
                        background: tableSort === k ? "var(--primary-muted)" : "transparent",
                        color: tableSort === k ? "var(--primary)" : "var(--text-muted)",
                      }}>{l}</button>
                  ))}
                </div>
                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-2 top-1/2 -translate-y-1/2" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-muted)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    value={pageSearch}
                    onChange={e => setPageSearch(e.target.value)}
                    placeholder="Filter pages..."
                    className="pl-6 pr-3 py-1 text-[12px] rounded-lg outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", width: 140 }}
                  />
                </div>
              </div>
            </div>

            {/* Column headers */}
            <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th className="pl-4 pr-2 py-2 w-8">
                    <input type="checkbox"
                      checked={selected.size === filteredPages.length && filteredPages.length > 0}
                      onChange={toggleAll}
                      className="w-3 h-3 rounded cursor-pointer"
                      style={{ accentColor: "var(--primary)" }}
                    />
                  </th>
                  {["Page","Platforms","Status","Monetization","Views (7d)","Revenue","RPM","Eng %","Queue","Payout","Issues"].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-[10px] uppercase tracking-wider whitespace-nowrap"
                      style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((p, i) => {
                  const health = PAGE_HEALTH[p.id];
                  const isSelected = selected.has(p.id);
                  const statusColor = p.status === "healthy" ? "var(--success)" : p.status === "attention" ? "var(--warning)" : "var(--error)";
                  const rowBg = p.status === "critical" ? "rgba(239,68,68,0.04)" : isSelected ? "var(--primary-muted)" : "transparent";

                  const monetBg    = health.monetization === "eligible" ? "rgba(74,222,128,0.1)"  : health.monetization === "restricted" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)";
                  const monetColor = health.monetization === "eligible" ? "#4ADE80"               : health.monetization === "restricted" ? "#FBBF24"             : "#EF4444";
                  const monetLabel = health.monetization === "eligible" ? "Eligible"               : health.monetization === "restricted" ? "Restricted"          : "Suspended";

                  const payoutBg    = health.payoutStatus === "on_time" ? "rgba(74,222,128,0.1)"  : health.payoutStatus === "pending" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)";
                  const payoutColor = health.payoutStatus === "on_time" ? "#4ADE80"               : health.payoutStatus === "pending" ? "#FBBF24"             : "#EF4444";
                  const payoutLabel = health.payoutStatus === "on_time" ? "✓ Paid"                : health.payoutStatus === "pending" ? "⏳ Pending"          : "⊘ On Hold";

                  const issueCount = health.flags + health.copyrightStrikes + (health.distributionRestricted ? 1 : 0) + (p.failedPosts > 0 ? 1 : 0);

                  return (
                    <tr key={p.id}
                      style={{ borderBottom: i < filteredPages.length - 1 ? "1px solid var(--border)" : "none", backgroundColor: rowBg }}
                      onMouseEnter={e => { if (!isSelected && p.status !== "critical") e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = rowBg; }}>

                      <td className="pl-4 pr-2 py-2.5">
                        <input type="checkbox" checked={isSelected} onChange={() => togglePage(p.id)}
                          className="w-3 h-3 rounded cursor-pointer" style={{ accentColor: "var(--primary)" }} />
                      </td>

                      {/* Page */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                            style={{ backgroundColor: p.color }}>{p.avatar}</div>
                          <div>
                            <div className="font-medium text-[12px] whitespace-nowrap" style={{ color: "var(--text)" }}>{p.name}</div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.followers} followers</div>
                          </div>
                        </div>
                      </td>

                      {/* Platforms */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          {(PAGE_PLATFORMS[p.id] || []).map(pl => (
                            <span key={pl} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{
                                background: pl === "FB" ? "rgba(24,119,242,0.12)" : pl === "IG" ? "rgba(225,48,108,0.12)" : "rgba(255,255,255,0.06)",
                                color: pl === "FB" ? "#1877F2" : pl === "IG" ? "#E1306C" : "var(--text-muted)",
                              }}>{pl}</span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                          <span className="text-[11px] capitalize" style={{ color: statusColor }}>{p.status}</span>
                        </div>
                      </td>

                      {/* Monetization */}
                      <td className="px-3 py-2.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: monetBg, color: monetColor }}>{monetLabel}</span>
                      </td>

                      {/* Views */}
                      <td className="px-3 py-2.5">
                        <div>
                          <span className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>{formatNum(p.views7d)}</span>
                          <div className="text-[10px] mt-0.5" style={{ color: p.viewsChange >= 0 ? "var(--success)" : "var(--error)" }}>
                            {p.viewsChange >= 0 ? "↑" : "↓"} {Math.abs(p.viewsChange)}%
                          </div>
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="px-3 py-2.5">
                        <div>
                          <span className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                            {p.revenue > 0 ? `$${p.revenue >= 1000 ? (p.revenue/1000).toFixed(1)+"K" : p.revenue.toFixed(2)}` : "—"}
                          </span>
                          <div className="w-full mt-1 h-1 rounded-full" style={{ background: "var(--border)" }}>
                            <div className="h-1 rounded-full" style={{
                              width: `${Math.min(100, (p.revenue / 5000) * 100)}%`,
                              backgroundColor: p.color,
                            }} />
                          </div>
                        </div>
                      </td>

                      {/* RPM */}
                      <td className="px-3 py-2.5">
                        <div>
                          <span className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>{p.rpm > 0 ? `$${p.rpm.toFixed(2)}` : "—"}</span>
                          {p.rpm > 0 && (
                            <div className="text-[10px] mt-0.5" style={{ color: p.rpmChange >= 0 ? "var(--success)" : "var(--error)" }}>
                              {p.rpmChange >= 0 ? "↑" : "↓"} {Math.abs(p.rpmChange)}%
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Engagement */}
                      <td className="px-3 py-2.5">
                        <span className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>{p.engRate}%</span>
                      </td>

                      {/* Queue */}
                      <td className="px-3 py-2.5">
                        <span className="font-semibold tabular-nums" style={{ color: p.queueNext24h === 0 ? "var(--error)" : "var(--text)" }}>
                          {p.queueNext24h === 0 ? "Empty" : `${p.queueNext24h}`}
                        </span>
                        {p.queueNext24h > 0 && <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>next 24h</div>}
                      </td>

                      {/* Payout */}
                      <td className="px-3 py-2.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: payoutBg, color: payoutColor }}>{payoutLabel}</span>
                      </td>

                      {/* Issues */}
                      <td className="px-3 py-2.5">
                        {issueCount > 0 ? (
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                              style={{ backgroundColor: issueCount >= 3 ? "#EF4444" : "#FBBF24" }}>
                              {issueCount}
                            </div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {[
                                health.flags > 0 && `${health.flags}F`,
                                health.copyrightStrikes > 0 && `${health.copyrightStrikes}©`,
                                p.failedPosts > 0 && `${p.failedPosts}✗`,
                              ].filter(Boolean).join(" ")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table footer */}
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {filteredPages.length} pages · {monetizedCount} monetized · ${(visiblePages.reduce((s,p) => s+p.revenue, 0) / 1000).toFixed(1)}K total revenue
              </span>
              <Link href="/reports" className="text-[11px] font-semibold" style={{ color: "var(--primary)" }}>
                Full Analytics →
              </Link>
            </div>
          </div>

          {/* Viral Radar */}
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#EF4444" }} />
              <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Viral Radar</div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full ml-0.5"
                style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>LIVE</span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {VIRAL_POSTS.map(post => (
                <div key={post.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: post.color }}>{post.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium truncate" style={{ color: "var(--text)" }}>{post.caption}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{post.page} · {post.hoursAgo}h ago</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[13px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{post.views}</div>
                    <div className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>{post.multiplier} baseline</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="flex flex-col gap-4">

          {/* Operations Pulse */}
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Operations Pulse</div>
              <button onClick={() => setExpandOps(x => !x)} className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {expandOps ? "less" : "more"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
              {(expandOps ? OPS_TILES : OPS_TILES.slice(0, 6)).map(tile => (
                <Link key={tile.label} href={tile.href}
                  className="px-3 py-3 flex flex-col gap-1"
                  style={{
                    background: tile.critical ? "rgba(239,68,68,0.08)" : tile.warn ? "rgba(251,191,36,0.06)" : "var(--surface)",
                  }}>
                  <div className="text-[18px] font-bold tabular-nums leading-none" style={{
                    color: tile.critical ? "#EF4444" : tile.warn ? "#FBBF24" : "var(--text)",
                  }}>{tile.value}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{tile.label}</div>
                </Link>
              ))}
            </div>

            {/* ID Infrastructure mini-gauge */}
            <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>ID Infrastructure</span>
                <Link href="/reports/id-performance" className="text-[10px]" style={{ color: "var(--primary)" }}>View →</Link>
              </div>
              <div className="space-y-1.5">
                {POSTING_IDS.map(id => (
                  <div key={id.name} className="flex items-center gap-2">
                    <span className="text-[10px] w-11 shrink-0" style={{ color: "var(--text-muted)" }}>{id.name}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                      <div className="h-1.5 rounded-full transition-all" style={{
                        width: `${id.score}%`,
                        backgroundColor: id.trend === "declining" ? "#FBBF24" : "#4ADE80",
                      }} />
                    </div>
                    <span className="text-[10px] tabular-nums w-7 text-right font-semibold"
                      style={{ color: id.trend === "declining" ? "#FBBF24" : "var(--text)" }}>{id.score}</span>
                    {id.trend === "declining" && (
                      <span className="text-[9px] font-bold px-1 py-0.5 rounded"
                        style={{ background: "rgba(251,191,36,0.12)", color: "#FBBF24" }}>↓</span>
                    )}
                    <span className="text-[9px] tabular-nums w-8 text-right" style={{ color: "var(--text-muted)" }}>{id.reachPct}% R</span>
                  </div>
                ))}
              </div>
              {POSTING_IDS.some(id => id.trend === "declining") && (
                <div className="mt-2 text-[10px] font-medium px-2 py-1 rounded-lg"
                  style={{ background: "rgba(251,191,36,0.08)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.2)" }}>
                  ⚠ Sarah declining at 72/100 — carries 22% of network reach
                </div>
              )}
            </div>
          </div>

          {/* Needs Attention */}
          {visibleFailed.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Needs Attention</div>
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>{visibleFailed.length}</span>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {visibleFailed.slice(0, 3).map(f => (
                  <div key={f.id} className="px-4 py-2.5 flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                      style={{ backgroundColor: f.color }}>{f.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium truncate" style={{ color: "var(--text)" }}>{f.caption}</div>
                      <div className="text-[10px]" style={{ color: "#EF4444" }}>{f.error} · {f.time}</div>
                    </div>
                  </div>
                ))}
                {visibleFailed.length > 3 && (
                  <div className="px-4 py-2 text-[11px]" style={{ color: "var(--text-muted)" }}>+{visibleFailed.length - 3} more failed posts</div>
                )}
              </div>
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderTop: "1px solid var(--border)" }}>
                <button className="flex-1 text-[11px] font-semibold py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>Retry All</button>
                <Link href="/failed-posts" className="flex-1 text-center text-[11px] font-semibold py-1.5 rounded-lg" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>View All</Link>
              </div>
            </div>
          )}

          {/* Monetization Health */}
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Monetization Health</div>
            </div>
            <div className="grid grid-cols-2 gap-px" style={{ background: "var(--border)", borderBottom: "1px solid var(--border)" }}>
              {[
                { label: "Monetized", value: `${monetizedCount}/${visiblePages.length}` },
                { label: "Avg RPM",   value: `$${avgRpm}` },
                { label: "At-Risk RPM", value: `${visiblePages.filter(p => p.rpmChange < -10).length}` },
                { label: "Not Enrolled", value: `${visiblePages.filter(p => p.revenue === 0).length}` },
              ].map(s => (
                <div key={s.label} className="px-4 py-2.5" style={{ background: "var(--surface)" }}>
                  <div className="text-[15px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{s.value}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 space-y-2">
              {[...visiblePages].filter(p => p.rpm > 0).sort((a,b) => b.rpm - a.rpm).map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="text-[10px] w-5 h-5 rounded flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: p.color, fontSize: "8px" }}>{p.avatar}</div>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100,(p.rpm/12)*100)}%`, backgroundColor: p.color }} />
                  </div>
                  <span className="text-[10px] tabular-nums w-12 text-right font-medium" style={{ color: "var(--text)" }}>${p.rpm.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Audience Quality / Geography Shift */}
            <div className="px-4 pb-3" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>Audience Quality</span>
                <Link href="/reports/audience" className="text-[10px]" style={{ color: "var(--primary)" }}>Details →</Link>
              </div>
              <div className="flex items-center gap-3 mb-1.5">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>US audience</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{AUDIENCE_GEO.usPercent}%</span>
                      <span className="text-[10px] font-semibold"
                        style={{ color: AUDIENCE_GEO.usChange < 0 ? "#FBBF24" : "#4ADE80" }}>
                        {AUDIENCE_GEO.usChange > 0 ? "↑" : "↓"} {Math.abs(AUDIENCE_GEO.usChange)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${AUDIENCE_GEO.usPercent}%`, backgroundColor: "#4ADE80" }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {AUDIENCE_GEO.topCountries.map(c => (
                  <span key={c} className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "var(--bg)", color: "var(--text-muted)" }}>{c}</span>
                ))}
              </div>
              {AUDIENCE_GEO.usChange < -2 && (
                <div className="mb-3 text-[10px] font-medium px-2 py-1 rounded-lg"
                  style={{ background: "rgba(251,191,36,0.08)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.2)" }}>
                  ⚠ US traffic down {Math.abs(AUDIENCE_GEO.usChange)}% — RPM may compress
                </div>
              )}

              {/* Net Follows by Content Type */}
              <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Net Follows by Format</div>
                {(() => {
                  const nf = NET_FOLLOWS_BY_TYPE[period];
                  const total = nf.reels + nf.photos + nf.text || 1;
                  return (
                    <div className="space-y-1.5">
                      {[
                        { label: "Reels",  value: nf.reels,  color: "#8B5CF6" },
                        { label: "Photos", value: nf.photos, color: "#F59E0B" },
                        { label: "Text",   value: nf.text,   color: "#60A5FA" },
                      ].map(row => (
                        <div key={row.label} className="flex items-center gap-2">
                          <span className="text-[10px] w-10 shrink-0" style={{ color: "var(--text-muted)" }}>{row.label}</span>
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                            <div className="h-1.5 rounded-full transition-all" style={{
                              width: `${Math.round((row.value / total) * 100)}%`,
                              backgroundColor: row.color,
                            }} />
                          </div>
                          <span className="text-[10px] font-semibold tabular-nums w-8 text-right"
                            style={{ color: row.value > 0 ? "var(--text)" : "var(--text-muted)" }}>
                            {row.value > 0 ? `+${row.value.toLocaleString()}` : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Batch Pulse */}
          {isOwner && (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Batch Pulse</div>
                <Link href="/reports/batches" className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>See Batches</Link>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {BATCHES.map(b => (
                  <div key={b.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: HEALTH_COLOR[b.health] }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium truncate" style={{ color: "var(--text)" }}>{b.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{b.revenue}</div>
                      <div className="text-[10px]" style={{ color: b.changeUp ? "var(--success)" : "var(--error)" }}>
                        {b.changeUp ? "↑" : "↓"} {b.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Bulk Actions Bar (appears when pages selected) ── */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
          style={{ background: "var(--bg-deep)", border: "1px solid var(--border-light)", minWidth: 480 }}>
          <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>
            {selected.size} page{selected.size > 1 ? "s" : ""} selected
          </span>
          <div className="w-px h-4 mx-1" style={{ background: "var(--border)" }} />
          <button onClick={() => setSelected(new Set())} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg"
            style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>Deselect All</button>
          <button className="text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Reconnect Selected
          </button>
          <button className="text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            style={{ background: "rgba(251,191,36,0.1)", color: "#FBBF24" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            Pause Publishing
          </button>
          <div className="flex items-center gap-1.5 ml-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            <input placeholder="Assign tag…" className="text-[11px] px-2 py-1 rounded-md outline-none w-24"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>
        </div>
      )}

    </div>
  );
}

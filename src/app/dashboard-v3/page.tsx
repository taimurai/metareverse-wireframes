"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRole } from "@/contexts/RoleContext";
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
  platforms: string[];
}> = {
  lc:  { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time", platforms: ["FB","IG"]      },
  hu:  { monetization: "eligible",   flags: 1, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time", platforms: ["FB","IG"]      },
  tb:  { monetization: "restricted", flags: 0, copyrightStrikes: 1, distributionRestricted: true,  payoutStatus: "pending", platforms: ["FB"]           },
  dh:  { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time", platforms: ["FB","IG","TH"] },
  ff:  { monetization: "eligible",   flags: 2, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time", platforms: ["FB","IG"]      },
  mm:  { monetization: "suspended",  flags: 3, copyrightStrikes: 1, distributionRestricted: true,  payoutStatus: "on_hold", platforms: ["FB","IG","TH"] },
  khn: { monetization: "eligible",   flags: 0, copyrightStrikes: 0, distributionRestricted: false, payoutStatus: "on_time", platforms: ["FB"]           },
};

const FAILED_POSTS = [
  { id: "f1", page: "Money Matters",  avatar: "MM", color: "#F59E0B", caption: "5 Investment Tips for 2025...",   time: "2h ago",  error: "Token expired",  platforms: "FB + IG"      },
  { id: "f2", page: "Money Matters",  avatar: "MM", color: "#F59E0B", caption: "How to Save $10K This Year...",  time: "5h ago",  error: "Token expired",  platforms: "FB"           },
  { id: "f3", page: "Money Matters",  avatar: "MM", color: "#F59E0B", caption: "Crypto Market Update...",        time: "8h ago",  error: "Token expired",  platforms: "FB + IG + TH" },
  { id: "f4", page: "TechByte",       avatar: "TB", color: "#14B8A6", caption: "AI Revolution: What's Next...",  time: "1d ago",  error: "Rate limited",   platforms: "FB"           },
];

const ALERTS = [
  { id: "a1", type: "danger"  as const, title: "Money Matters disconnected",       body: "Posts are failing. Token expired.",      action: "Reconnect" },
  { id: "a2", type: "warning" as const, title: "TechByte token expires in 5 days", body: "Reconnect before posts start failing.",  action: "Reconnect" },
  { id: "a3", type: "warning" as const, title: "Fitness Factory has 2 flags",      body: "Review flagged content to avoid reach drops.", action: "Review" },
  { id: "a4", type: "info"    as const, title: "Know Her Name — low RPM ($0.23)",  body: "Audience not Tier 1. Consider geo-targeting.", action: "View" },
];

const VIRAL_POSTS = [
  { id: "v1", page: "Laugh Central",     avatar: "LC", color: "#8B5CF6", caption: "Monday morning energy hits different when you've had 3 coffees...", views: "2.4M", multiplier: "13x", hoursAgo: 3 },
  { id: "v2", page: "History Uncovered", avatar: "HU", color: "#FF6B2B", caption: "The forgotten queen who ruled an empire for 40 years...",          views: "890K", multiplier: "9x",  hoursAgo: 6 },
  { id: "v3", page: "Know Her Name",     avatar: "KH", color: "#0EA5E9", caption: "Marie Curie was told women couldn't be scientists...",              views: "340K", multiplier: "9x",  hoursAgo: 11 },
  { id: "v4", page: "Fitness Factory",   avatar: "FF", color: "#EC4899", caption: "This 10-min morning routine changed everything...",                 views: "218K", multiplier: "6x",  hoursAgo: 14 },
];

const BATCHES = [
  { id: "b1", name: "Partner A — Lifestyle", color: "#F59E0B", health: "healthy",  revenue: "$48.2K", change: "+14%", changeUp: true  },
  { id: "b2", name: "Partner B — Education", color: "#60A5FA", health: "stable",   revenue: "$38.1K", change: "+2%",  changeUp: true  },
  { id: "b3", name: "Partner C — Women's",   color: "#F87171", health: "at-risk",  revenue: "$5.1K",  change: "-22%", changeUp: false },
];
const HEALTH_COLOR: Record<string, string> = { healthy: "#4ADE80", stable: "#60A5FA", declining: "#FBBF24", "at-risk": "#F87171" };

const BEST_POST = {
  caption: "Kaja Kallas — Estonia's PM during Ukraine invasion. The moment she called out NATO allies live on stage.",
  page: "History Uncovered", pageColor: "#FF6B2B", avatar: "HU",
  views: "65.8K", reach: "44.1K", earnings: "$3.88", engRate: "4.3%", type: "Photo", date: "Apr 2, 2026",
};

const POSTING_IDS = [
  { name: "Taimur", score: 88, trend: "stable"    as const, reachPct: 68 },
  { name: "Sarah",  score: 72, trend: "declining"  as const, reachPct: 22 },
  { name: "Ahmed",  score: 91, trend: "stable"    as const, reachPct: 10 },
];
const AUDIENCE_GEO = { usPercent: 62, usChange: -3, topCountries: ["US 62%", "CO 9%", "GT 7%"] };

type Period = "yesterday" | "7d" | "28d";

// ─── Date picker ──────────────────────────────────────────────────────────────
interface DashPreset { label: string; period: Period; start: string; end: string; sm: number; sd: number; em: number; ed: number; default?: boolean }
const DASH_PRESETS: DashPreset[] = [
  { label: "Yesterday",     period: "yesterday", start: "Apr 7, 2026",  end: "Apr 7, 2026",  sm: 3, sd: 7,  em: 3, ed: 7  },
  { label: "Last 7 days",   period: "7d",        start: "Apr 2, 2026",  end: "Apr 8, 2026",  sm: 3, sd: 2,  em: 3, ed: 8, default: true },
  { label: "Last 28 days",  period: "28d",       start: "Mar 11, 2026", end: "Apr 8, 2026",  sm: 2, sd: 11, em: 3, ed: 8  },
  { label: "Last 30 days",  period: "28d",       start: "Mar 9, 2026",  end: "Apr 8, 2026",  sm: 2, sd: 9,  em: 3, ed: 8  },
  { label: "Last 3 months", period: "28d",       start: "Jan 8, 2026",  end: "Apr 8, 2026",  sm: 0, sd: 8,  em: 3, ed: 8  },
];
const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DN = ["Su","Mo","Tu","We","Th","Fr","Sa"];
function enc(y: number, m: number, d: number) { return y * 10000 + m * 100 + d; }
function calWeeks(year: number, month: number) {
  const fd = new Date(year, month, 1).getDay(), dim = new Date(year, month + 1, 0).getDate();
  const weeks: (number|null)[][] = [];
  let week: (number|null)[] = Array(fd).fill(null);
  for (let d = 1; d <= dim; d++) { week.push(d); if (week.length === 7) { weeks.push(week); week = []; } }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }
  return weeks;
}
function MiniMonth({ year, month, preset }: { year: number; month: number; preset: DashPreset }) {
  const weeks = calWeeks(year, month);
  const se = enc(2026, preset.sm, preset.sd), ee = enc(2026, preset.em, preset.ed);
  return (
    <div className="w-[188px]">
      <div className="text-center text-[12px] font-semibold mb-2" style={{ color: "var(--text)" }}>{MN[month]} {year}</div>
      <div className="grid grid-cols-7 mb-1">
        {DN.map(d => <div key={d} className="text-center text-[10px] font-medium py-0.5" style={{ color: "var(--text-muted)" }}>{d}</div>)}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            if (!day) return <div key={di} />;
            const de = enc(year, month, day);
            const isS = de === se, isE = de === ee, inR = de >= se && de <= ee;
            return (
              <div key={di} className="text-center text-[11px] py-0.5 leading-6 select-none" style={{
                backgroundColor: isS || isE ? "var(--primary)" : inR ? "rgba(99,102,241,0.15)" : "transparent",
                color: isS || isE ? "#fff" : inR ? "var(--primary)" : "var(--text)",
                borderRadius: isS ? "6px 0 0 6px" : isE ? "0 6px 6px 0" : "0",
                fontWeight: isS || isE ? 700 : 400,
              }}>{day}</div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
function DashPicker({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const active = DASH_PRESETS.find(p => p.period === period && p.label !== "Last 30 days" && p.label !== "Last 3 months")
    || DASH_PRESETS.find(p => p.period === period) || DASH_PRESETS[1];
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {active.start === active.end ? active.start : `${active.start} – ${active.end}`}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-muted)" }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 rounded-xl shadow-2xl z-50 flex overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minWidth: 520 }}>
          <div className="p-4 flex gap-5" style={{ borderRight: "1px solid var(--border)" }}>
            <MiniMonth year={2026} month={2} preset={active} />
            <MiniMonth year={2026} month={3} preset={active} />
          </div>
          <div className="p-3 flex flex-col gap-0.5 min-w-[150px]">
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: "var(--text-muted)" }}>Quick select</div>
            {DASH_PRESETS.map(p => (
              <button key={p.label} onClick={() => { onChange(p.period); setOpen(false); }}
                className="text-left px-3 py-1.5 rounded-lg text-[12px] font-medium"
                style={{ background: p.label === active.label ? "var(--primary-muted)" : "transparent", color: p.label === active.label ? "var(--primary)" : "var(--text-secondary)" }}>
                {p.label}
                {p.default && <span className="ml-1.5 text-[9px] px-1 rounded" style={{ background: "var(--primary)", color: "#fff" }}>default</span>}
              </button>
            ))}
            <div className="mt-auto pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="text-[10px] px-2 mb-1" style={{ color: "var(--text-muted)" }}>Selected range</div>
              <div className="text-[11px] font-semibold px-2" style={{ color: "var(--text)" }}>{active.start}</div>
              {active.start !== active.end && <><div className="text-[10px] px-2" style={{ color: "var(--text-muted)" }}>to</div><div className="text-[11px] font-semibold px-2" style={{ color: "var(--text)" }}>{active.end}</div></>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── KPI data ─────────────────────────────────────────────────────────────────
const PERIOD_DATA: Record<Period, { revenue: string; revenueChange: string; revenueUp: boolean; rpm: string; rpmChange: string; rpmUp: boolean; views: string; viewsChange: string; viewsUp: boolean; reach: string; reachChange: string; reachUp: boolean; followers: string; followersChange: string; followersUp: boolean; engRate: string; engRateChange: string; engRateUp: boolean; published: number; publishedChange: string; publishedUp: boolean }> = {
  yesterday: { revenue: "$1,530",  revenueChange: "+$214 vs prior",    revenueUp: true,  rpm: "$8.82",  rpmChange: "+$0.05 vs prior",  rpmUp: true,  views: "8.2M",  viewsChange: "+1% vs prior",   viewsUp: true,  reach: "5.5M",  reachChange: "+1% vs prior",   reachUp: true,  followers: "24,185", followersChange: "+61 yesterday",   followersUp: true, engRate: "16.9%",  engRateChange: "-0.3% vs prior", engRateUp: false, published: 16,  publishedChange: "posts",   publishedUp: true },
  "7d":      { revenue: "$12,851", revenueChange: "↑ 14% vs prev 7d", revenueUp: true,  rpm: "$9.05",  rpmChange: "↑ $0.38 vs 7d",   rpmUp: true,  views: "62.1M", viewsChange: "↑ 8% vs 7d",    viewsUp: true,  reach: "41.8M", reachChange: "↑ 6% vs 7d",    reachUp: true,  followers: "24,232", followersChange: "+412 this week",  followersUp: true, engRate: "16.4%",  engRateChange: "↑ 0.9% vs 7d",  engRateUp: true,  published: 94,  publishedChange: "posts",   publishedUp: true },
  "28d":     { revenue: "$48,392", revenueChange: "↑ 9% vs prev 28d", revenueUp: true,  rpm: "$9.21",  rpmChange: "↑ $0.82 vs 28d",  rpmUp: true,  views: "224M",  viewsChange: "↑ 12% vs 28d",  viewsUp: true,  reach: "151M",  reachChange: "↑ 10% vs 28d",  reachUp: true,  followers: "24,232", followersChange: "+1,248 this month",followersUp: true, engRate: "17.71%", engRateChange: "↑ 2.1% vs 28d", engRateUp: true,  published: 389, publishedChange: "posts",   publishedUp: true },
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

// Network chart data
const NET_VIEWS     = [180,210,195,230,215,245,238,260,254,275,269,290,284,305,299,320,340,380,420,480,510,440,460,490,520,560,590,620];
const NET_EARNINGS  = [42,48,45,52,50,58,55,62,60,68,65,72,70,78,76,84,88,96,110,124,132,114,118,126,134,144,150,160];
const NET_FOLLOWERS = [14,18,16,21,19,24,22,27,25,30,28,34,32,38,36,42,48,55,62,72,78,68,70,74,78,84,88,94];

// Format + platform data
const FORMAT_SPLIT: Record<Period, { reels: number; photos: number; reelsRev: string; photosRev: string; reelsFollowers: number; fbPct: number; igPct: number; thPct: number }> = {
  yesterday: { reels: 62, photos: 38, reelsRev: "$520",    photosRev: "$1,010",  reelsFollowers: 96, fbPct: 69, igPct: 26, thPct: 5 },
  "7d":      { reels: 55, photos: 45, reelsRev: "$5,269",  photosRev: "$7,582",  reelsFollowers: 97, fbPct: 70, igPct: 25, thPct: 5 },
  "28d":     { reels: 60, photos: 40, reelsRev: "$18,873", photosRev: "$29,519", reelsFollowers: 97, fbPct: 68, igPct: 27, thPct: 5 },
};
const NET_FOLLOWS_BY_TYPE: Record<Period, { reels: number; photos: number; text: number }> = {
  yesterday: { reels: 59,   photos: 2,  text: 0 },
  "7d":      { reels: 401,  photos: 10, text: 1 },
  "28d":     { reels: 1211, photos: 35, text: 2 },
};
const PER_POST: Record<Period, { avgReach: string; linkClicks: string; engRate: string }> = {
  yesterday: { avgReach: "3,108", linkClicks: "0.2", engRate: "16.9%"  },
  "7d":      { avgReach: "3,182", linkClicks: "0.2", engRate: "16.4%"  },
  "28d":     { avgReach: "3,341", linkClicks: "0.2", engRate: "17.71%" },
};

// ─── Micro components ─────────────────────────────────────────────────────────
function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}
function Spark({ data, color, height = 32 }: { data: number[]; color: string; height?: number }) {
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
  const W = 800, H = 180, PAD = 10;
  const norm = (arr: number[]) => {
    const mn = Math.min(...arr), mx = Math.max(...arr), r = mx - mn || 1;
    return arr.map((v, i) => `${(i / (arr.length - 1)) * W},${H - ((v - mn) / r) * (H - PAD * 2) - PAD}`);
  };
  const mkPath = (pts: string[]) => "M" + pts.join(" L");
  const mkFill = (pts: string[]) => mkPath(pts) + ` L${W},${H} L0,${H} Z`;
  const vPts = norm(NET_VIEWS), ePts = norm(NET_EARNINGS), fPts = norm(NET_FOLLOWERS);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="v3cGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={mkFill(vPts)} fill="url(#v3cGrad)" />
      <path d={mkPath(vPts)} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={mkPath(ePts)} fill="none" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3" />
      <path d={mkPath(fPts)} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 4" />
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardV3() {
  const { role, batchConfig } = useRole();
  const isMobile = useIsMobile();
  const [period, setPeriod] = useState<Period>("7d");
  const [pageSearch, setPageSearch] = useState("");
  const [tableFilter, setTableFilter] = useState<"all" | "healthy" | "attention" | "monetized">("all");
  const [tableSort, setTableSort] = useState<"revenue" | "views" | "rpm" | "eng">("revenue");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const alertsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) setAlertsOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isOwner = role === "owner" || role === "co-owner";
  const visiblePages = isOwner ? ALL_PAGES : ALL_PAGES.filter(p => batchConfig.pages.includes(p.id));
  const kpi = PERIOD_DATA[period];
  const fmt = FORMAT_SPLIT[period];
  const nf  = NET_FOLLOWS_BY_TYPE[period];
  const pp  = PER_POST[period];

  const activeAlerts = ALERTS.filter(a => !dismissedAlerts.has(a.id));
  const failedCount    = FAILED_POSTS.length;
  const emptyQueues    = visiblePages.filter(p => p.queueNext24h === 0).length;
  const expiringTokens = visiblePages.filter(p => p.tokenDays > 0 && p.tokenDays <= 7).length;
  const monetizedCount = visiblePages.filter(p => p.revenue > 0).length;
  const avgRpm         = (visiblePages.filter(p => p.rpm > 0).reduce((s, p) => s + p.rpm, 0) / monetizedCount || 0).toFixed(2);
  const scheduled      = 142;

  const togglePage = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filteredPages = visiblePages
    .filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()))
    .filter(p => {
      if (tableFilter === "healthy")    return p.status === "healthy";
      if (tableFilter === "attention")  return p.status === "attention" || p.status === "critical";
      if (tableFilter === "monetized")  return p.revenue > 0;
      return true;
    })
    .sort((a, b) => {
      if (tableSort === "revenue") return b.revenue - a.revenue;
      if (tableSort === "rpm")     return b.rpm - a.rpm;
      if (tableSort === "eng")     return b.engRate - a.engRate;
      return b.views7d - a.views7d;
    });

  const KPI_TILES = [
    { key: "revenue",   label: "Revenue",    value: kpi.revenue,          change: kpi.revenueChange,   up: kpi.revenueUp,   color: "#4ADE80", href: "/reports/earnings" },
    { key: "rpm",       label: "Avg RPM",    value: kpi.rpm,              change: kpi.rpmChange,       up: kpi.rpmUp,       color: "#8B5CF6", href: "/reports/earnings" },
    { key: "views",     label: "Views",      value: kpi.views,            change: kpi.viewsChange,     up: kpi.viewsUp,     color: "var(--primary)", href: "/reports/results" },
    { key: "reach",     label: "Reach",      value: kpi.reach,            change: kpi.reachChange,     up: kpi.reachUp,     color: "#14B8A6", href: "/reports/results" },
    { key: "followers", label: "Followers",  value: kpi.followers,        change: kpi.followersChange, up: kpi.followersUp, color: "#F59E0B", href: "/reports/audience" },
    { key: "engRate",   label: "Engagement", value: kpi.engRate,          change: kpi.engRateChange,   up: kpi.engRateUp,   color: "#EC4899", href: "/reports/results" },
    { key: "published", label: "Posts Live", value: String(kpi.published), change: `${kpi.publishedChange}`, up: kpi.publishedUp, color: "#60A5FA", href: "/published" },
  ];

  const alertTypeColor: Record<string, string> = { danger: "#EF4444", warning: "#F59E0B", info: "var(--primary)" };
  const alertTypeBg: Record<string, string>    = { danger: "rgba(239,68,68,0.08)", warning: "rgba(245,158,11,0.08)", info: "rgba(99,102,241,0.08)" };

  // Mobile simplified view
  if (isMobile) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Revenue · 7 days</div>
          <div className="text-[28px] font-bold" style={{ color: "var(--text)" }}>$12,851</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--success)" }}>↑ 14% vs prior week</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {KPI_TILES.slice(2, 6).map(t => (
            <Link key={t.key} href={t.href} className="rounded-xl p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{t.label}</div>
              <div className="text-[16px] font-bold" style={{ color: "var(--text)" }}>{t.value}</div>
            </Link>
          ))}
        </div>
        <Link href="/reports" className="block text-center text-[12px] font-semibold py-2.5 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--primary)" }}>Full Analytics →</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: selected.size > 0 ? 80 : 0 }}>

      {/* ── Global Header ── */}
      <div className="flex items-center justify-between px-8 py-4 mb-2" style={{ borderBottom: "1px solid var(--border)" }}>
        {/* Left: title + subtitle */}
        <div>
          <div className="text-[16px] font-bold" style={{ color: "var(--text)" }}>Command Center</div>
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Portfolio overview · Apr 8, 2026</div>
        </div>

        {/* Center: date picker + version toggle */}
        <div className="flex items-center gap-3">
          <DashPicker period={period} onChange={setPeriod} />
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            {[["v1", "/"], ["v2", "/dashboard-v2"], ["v3", "/dashboard-v3"]].map(([label, href]) => (
              <Link key={label} href={href}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold"
                style={{
                  background: label === "v3" ? "var(--primary)" : "transparent",
                  color: label === "v3" ? "#fff" : "var(--text-muted)",
                }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: user + notifications + needs-attention pill */}
        <div className="flex items-center gap-3">
          {/* Needs Attention pill */}
          <div className="relative" ref={alertsRef}>
            <button
              onClick={() => setAlertsOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
              style={{
                background: activeAlerts.length > 0 ? "rgba(239,68,68,0.1)" : "var(--surface)",
                border: `1px solid ${activeAlerts.length > 0 ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                color: activeAlerts.length > 0 ? "#EF4444" : "var(--text-secondary)",
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {activeAlerts.length > 0 ? `${activeAlerts.length} Alerts` : "All Clear"}
              {activeAlerts.length > 0 && (
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: "#EF4444" }}>{activeAlerts.length}</span>
              )}
            </button>

            {/* Alerts dropdown */}
            {alertsOpen && (
              <div className="absolute right-0 top-full mt-2 rounded-xl shadow-2xl z-50 w-[340px] overflow-hidden"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Needs Attention</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{activeAlerts.length} unresolved</span>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {activeAlerts.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <div className="text-[13px] font-medium mb-1" style={{ color: "var(--text)" }}>✓ All clear</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>No issues need attention right now.</div>
                    </div>
                  ) : activeAlerts.map(alert => (
                    <div key={alert.id} className="px-4 py-3" style={{ background: alertTypeBg[alert.type] }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-[12px] font-semibold" style={{ color: alertTypeColor[alert.type] }}>{alert.title}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{alert.body}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button className="text-[10px] font-semibold px-2 py-1 rounded-md"
                            style={{ background: alertTypeColor[alert.type] + "22", color: alertTypeColor[alert.type] }}>
                            {alert.action}
                          </button>
                          <button onClick={() => setDismissedAlerts(prev => new Set([...prev, alert.id]))}
                            className="text-[11px] w-5 h-5 flex items-center justify-center rounded"
                            style={{ color: "var(--text-muted)" }}>✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {activeAlerts.length > 0 && (
                  <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <button className="flex-1 text-[11px] font-semibold py-1.5 rounded-lg"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>Retry All Failed</button>
                    <button onClick={() => setDismissedAlerts(new Set(ALERTS.map(a => a.id)))}
                      className="text-[11px] font-medium px-3 py-1.5 rounded-lg"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                      Dismiss All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "var(--primary)" }}>T</div>
            <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>Taimur</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: "rgba(99,102,241,0.12)", color: "var(--primary)" }}>Owner</span>
          </div>
        </div>
      </div>

      <div className="px-8">
        {/* Batch context for non-owners */}
        {!isOwner && (
          <div className="mb-5 px-4 py-2.5 rounded-xl flex items-center gap-2 text-[12px] font-medium"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/></svg>
            Viewing: <span style={{ color: "var(--text)" }} className="font-semibold">{batchConfig.label}</span>
            <span style={{ color: "var(--text-muted)" }}>· {visiblePages.length} pages</span>
          </div>
        )}

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-7 gap-4 mb-8">
          {KPI_TILES.map(tile => (
            <Link key={tile.key} href={tile.href}
              className="rounded-2xl px-4 py-4 flex flex-col gap-2 hover:brightness-105 transition-all"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{tile.label}</span>
                <Spark data={SPARKLINES[tile.key]} color={tile.color} height={28} />
              </div>
              <div className="text-[22px] font-bold leading-none tabular-nums" style={{ color: "var(--text)" }}>{tile.value}</div>
              <div className="text-[10px] font-medium" style={{ color: tile.up ? "var(--success)" : "var(--error)" }}>
                {tile.up ? "↑" : "↓"} {tile.change}
              </div>
            </Link>
          ))}
        </div>

        {/* ── Main 2-column layout ── */}
        <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 300px", alignItems: "start" }}>

          {/* ── CENTER: Primary content ── */}
          <div className="flex flex-col gap-8">

            {/* Network Performance Chart */}
            <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Network Performance</div>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Mar 11 – Apr 8, 2026 · All pages combined</p>
                </div>
                <div className="flex items-center gap-6">
                  {[
                    { label: "Views",    color: "var(--primary)", dash: false },
                    { label: "Earnings", color: "#4ADE80",        dash: true  },
                    { label: "Followers",color: "#F59E0B",        dash: true  },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <svg width="18" height="4" viewBox="0 0 18 4">
                        <line x1="0" y1="2" x2="18" y2="2" stroke={l.color} strokeWidth="2"
                          strokeDasharray={l.dash ? "5 3" : "none"} strokeLinecap="round" />
                      </svg>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <NetworkChart />
              <div className="flex justify-between mt-2">
                {["Mar 11","Mar 18","Mar 25","Apr 1","Apr 8"].map(l => (
                  <span key={l} className="text-[10px]" style={{ color: "var(--text-muted)" }}>{l}</span>
                ))}
              </div>
            </div>

            {/* Pages Table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              {/* Table toolbar */}
              <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Pages</span>
                  {selected.size > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>{selected.size} selected</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Quick filter toggles */}
                  <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "var(--bg)" }}>
                    {([["all","All"], ["healthy","Healthy"], ["attention","At Risk"], ["monetized","Monetized"]] as const).map(([k,l]) => (
                      <button key={k} onClick={() => setTableFilter(k)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                        style={{
                          background: tableFilter === k ? "var(--surface)" : "transparent",
                          color: tableFilter === k ? "var(--text)" : "var(--text-muted)",
                          boxShadow: tableFilter === k ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
                        }}>{l}</button>
                    ))}
                  </div>
                  {/* Sort */}
                  <div className="flex items-center gap-0.5">
                    {([["revenue","Rev"], ["views","Views"], ["rpm","RPM"], ["eng","Eng"]] as const).map(([k,l]) => (
                      <button key={k} onClick={() => setTableSort(k)}
                        className="px-2 py-1 rounded-md text-[11px] font-medium"
                        style={{ background: tableSort === k ? "var(--primary-muted)" : "transparent", color: tableSort === k ? "var(--primary)" : "var(--text-muted)" }}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {/* Search */}
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-muted)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input value={pageSearch} onChange={e => setPageSearch(e.target.value)} placeholder="Filter pages..."
                      className="pl-7 pr-3 py-1.5 text-[12px] rounded-lg outline-none"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", width: 148 }} />
                  </div>
                </div>
              </div>

              <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th className="pl-5 pr-3 py-2.5 w-8">
                      <input type="checkbox"
                        checked={selected.size === filteredPages.length && filteredPages.length > 0}
                        onChange={() => {
                          const filtered = filteredPages;
                          setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));
                        }}
                        className="w-3 h-3 rounded cursor-pointer" style={{ accentColor: "var(--primary)" }} />
                    </th>
                    {["Page","Platforms","Status","Monet.","Views","Revenue","RPM","Eng %","Queue","Payout","Issues"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold text-[10px] uppercase tracking-wider whitespace-nowrap"
                        style={{ color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map((p, i) => {
                    const health = PAGE_HEALTH[p.id];
                    const isSelected = selected.has(p.id);
                    const statusColor = p.status === "healthy" ? "var(--success)" : p.status === "attention" ? "var(--warning)" : "var(--error)";
                    const statusBg    = p.status === "healthy" ? "rgba(74,222,128,0.1)" : p.status === "attention" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)";
                    const rowBg = p.status === "critical" ? "rgba(239,68,68,0.03)" : isSelected ? "var(--primary-muted)" : "transparent";

                    const monetBg    = health.monetization === "eligible" ? "rgba(74,222,128,0.1)"  : health.monetization === "restricted" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)";
                    const monetColor = health.monetization === "eligible" ? "#4ADE80"               : health.monetization === "restricted" ? "#FBBF24"             : "#EF4444";
                    const monetLabel = health.monetization === "eligible" ? "Eligible"               : health.monetization === "restricted" ? "Restricted"          : "Suspended";

                    const payoutBg    = health.payoutStatus === "on_time" ? "rgba(74,222,128,0.1)"  : health.payoutStatus === "pending" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)";
                    const payoutColor = health.payoutStatus === "on_time" ? "#4ADE80"               : health.payoutStatus === "pending" ? "#FBBF24"             : "#EF4444";
                    const payoutLabel = health.payoutStatus === "on_time" ? "✓ Paid"                : health.payoutStatus === "pending" ? "⏳ Pending"           : "⊘ On Hold";

                    const issueCount = health.flags + health.copyrightStrikes + (health.distributionRestricted ? 1 : 0) + (p.failedPosts > 0 ? 1 : 0);

                    return (
                      <tr key={p.id}
                        style={{ borderBottom: i < filteredPages.length - 1 ? "1px solid var(--border)" : "none", backgroundColor: rowBg }}
                        onMouseEnter={e => { if (!isSelected && p.status !== "critical") e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = rowBg; }}>
                        <td className="pl-5 pr-3 py-4">
                          <input type="checkbox" checked={isSelected} onChange={() => togglePage(p.id)}
                            className="w-3 h-3 rounded cursor-pointer" style={{ accentColor: "var(--primary)" }} />
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                              style={{ backgroundColor: p.color }}>{p.avatar}</div>
                            <div>
                              <div className="font-semibold text-[12px] whitespace-nowrap" style={{ color: "var(--text)" }}>{p.name}</div>
                              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.followers}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-1">
                            {health.platforms.map(pl => (
                              <span key={pl} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                style={{
                                  background: pl === "FB" ? "rgba(24,119,242,0.12)" : pl === "IG" ? "rgba(225,48,108,0.12)" : "rgba(255,255,255,0.06)",
                                  color: pl === "FB" ? "#1877F2" : pl === "IG" ? "#E1306C" : "var(--text-muted)",
                                }}>{pl}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: statusBg, color: statusColor }}>
                            {p.status === "healthy" ? "Healthy" : p.status === "attention" ? "Attention" : "Critical"}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: monetBg, color: monetColor }}>{monetLabel}</span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>{formatNum(p.views7d)}</div>
                          <div className="text-[10px]" style={{ color: p.viewsChange >= 0 ? "var(--success)" : "var(--error)" }}>{p.viewsChange >= 0 ? "↑" : "↓"} {Math.abs(p.viewsChange)}%</div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                            {p.revenue > 0 ? `$${p.revenue >= 1000 ? (p.revenue/1000).toFixed(1)+"K" : p.revenue.toFixed(2)}` : "—"}
                          </div>
                          {p.revenue > 0 && (
                            <div className="w-16 mt-1 h-1 rounded-full" style={{ background: "var(--border)" }}>
                              <div className="h-1 rounded-full" style={{ width: `${Math.min(100,(p.revenue/5000)*100)}%`, backgroundColor: p.color }} />
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <div className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>{p.rpm > 0 ? `$${p.rpm.toFixed(2)}` : "—"}</div>
                          {p.rpm > 0 && <div className="text-[10px]" style={{ color: p.rpmChange >= 0 ? "var(--success)" : "var(--error)" }}>{p.rpmChange >= 0 ? "↑" : "↓"} {Math.abs(p.rpmChange)}%</div>}
                        </td>
                        <td className="px-3 py-4">
                          <span className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>{p.engRate}%</span>
                        </td>
                        <td className="px-3 py-4">
                          <span className="font-semibold tabular-nums" style={{ color: p.queueNext24h === 0 ? "var(--error)" : "var(--text)" }}>
                            {p.queueNext24h === 0 ? "Empty" : p.queueNext24h}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: payoutBg, color: payoutColor }}>{payoutLabel}</span>
                        </td>
                        <td className="px-3 py-4">
                          {issueCount > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                                style={{ backgroundColor: issueCount >= 3 ? "#EF4444" : "#FBBF24" }}>{issueCount}</div>
                              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                {[health.flags > 0 && `${health.flags}F`, health.copyrightStrikes > 0 && `${health.copyrightStrikes}©`, p.failedPosts > 0 && `${p.failedPosts}✗`].filter(Boolean).join(" ")}
                              </span>
                            </div>
                          ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center gap-4">
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {filteredPages.length} pages · {monetizedCount} monetized · ${(visiblePages.reduce((s,p) => s+p.revenue, 0)/1000).toFixed(1)}K total
                  </span>
                  <div className="flex items-center gap-3" style={{ borderLeft: "1px solid var(--border)", paddingLeft: 12 }}>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Issues key:</span>
                    {[["F", "Flags"], ["©", "Copyright"], ["✗", "Failed posts"]].map(([icon, label]) => (
                      <span key={icon} className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        <span className="font-bold" style={{ color: "var(--text)" }}>{icon}</span> = {label}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/reports" className="text-[11px] font-semibold" style={{ color: "var(--primary)" }}>Full Analytics →</Link>
              </div>
            </div>

            {/* Viral Radar — horizontal scroll strip */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#EF4444" }} />
                  <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Viral Radar</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>LIVE</span>
                </div>
                <Link href="/published" className="text-[11px] font-semibold" style={{ color: "var(--primary)" }}>See all live →</Link>
              </div>
              <div className="flex gap-4 px-6 py-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {VIRAL_POSTS.map(post => (
                  <div key={post.id} className="flex-none w-[220px] rounded-xl p-4"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                        style={{ backgroundColor: post.color }}>{post.avatar}</div>
                      <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{post.page}</div>
                      <div className="ml-auto text-[9px] shrink-0" style={{ color: "var(--text-muted)" }}>{post.hoursAgo}h ago</div>
                    </div>
                    <div className="text-[11px] font-medium leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text)" }}>{post.caption}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-[15px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{post.views}</div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>{post.multiplier} baseline</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Post of Period */}
            <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Best Post of Period</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Highest earnings in selected range</div>
                </div>
                <Link href="/published" className="text-[11px] font-semibold" style={{ color: "var(--primary)" }}>See all published →</Link>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: BEST_POST.pageColor }}>{BEST_POST.avatar}</div>
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{BEST_POST.page}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>{BEST_POST.type}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{BEST_POST.date}</span>
                  </div>
                  <div className="text-[13px] font-medium leading-relaxed" style={{ color: "var(--text)" }}>{BEST_POST.caption}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 shrink-0">
                  {[["Views", BEST_POST.views, "var(--primary)"], ["Reach", BEST_POST.reach, "#14B8A6"], ["Earnings", BEST_POST.earnings, "#4ADE80"], ["Eng. Rate", BEST_POST.engRate, "#EC4899"]].map(([l, v, c]) => (
                    <div key={l} className="text-center">
                      <div className="text-[14px] font-bold tabular-nums" style={{ color: c }}>{v}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT SIDEBAR (sticky) ── */}
          <div className="flex flex-col gap-6" style={{ position: "sticky", top: 24 }}>

            {/* Operations Pulse */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Operations Pulse</div>
              </div>
              <div className="grid grid-cols-2 gap-px" style={{ background: "var(--border)" }}>
                {[
                  { label: "Failed",       value: failedCount,   warn: failedCount > 0,    critical: failedCount > 2,    href: "/failed-posts"   },
                  { label: "Scheduled",    value: scheduled,     warn: false,              critical: false,              href: "/queue"          },
                  { label: "Empty Queues", value: emptyQueues,   warn: emptyQueues > 0,    critical: emptyQueues > 2,    href: "/queue"          },
                  { label: "Expiring",     value: expiringTokens,warn: expiringTokens > 0, critical: false,              href: "/settings/pages" },
                ].map(tile => (
                  <Link key={tile.label} href={tile.href}
                    className="px-4 py-4 flex flex-col gap-1.5"
                    style={{ background: tile.critical ? "rgba(239,68,68,0.06)" : tile.warn ? "rgba(251,191,36,0.04)" : "var(--surface)" }}>
                    <div className="text-[22px] font-bold tabular-nums leading-none" style={{
                      color: tile.critical ? "#EF4444" : tile.warn ? "#FBBF24" : "var(--text)",
                    }}>{tile.value}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{tile.label}</div>
                  </Link>
                ))}
              </div>
              {/* ID Infrastructure */}
              <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>ID Infrastructure</span>
                  <Link href="/reports/id-performance" className="text-[10px]" style={{ color: "var(--primary)" }}>View →</Link>
                </div>
                <div className="space-y-2">
                  {POSTING_IDS.map(id => (
                    <div key={id.name} className="flex items-center gap-2.5">
                      <span className="text-[10px] w-12 shrink-0" style={{ color: "var(--text-muted)" }}>{id.name}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${id.score}%`, backgroundColor: id.trend === "declining" ? "#FBBF24" : "#4ADE80" }} />
                      </div>
                      <span className="text-[10px] tabular-nums font-semibold w-6 text-right"
                        style={{ color: id.trend === "declining" ? "#FBBF24" : "var(--text)" }}>{id.score}</span>
                    </div>
                  ))}
                </div>
                {POSTING_IDS.some(id => id.trend === "declining") && (
                  <div className="mt-3 text-[10px] font-medium px-2.5 py-2 rounded-lg"
                    style={{ background: "rgba(251,191,36,0.07)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.15)" }}>
                    ⚠ Sarah declining — carries 22% of reach
                  </div>
                )}
              </div>
            </div>

            {/* Monetization Health */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Monetization Health</div>
                  <Link href="/reports/earnings" className="text-[10px]" style={{ color: "var(--primary)" }}>Deep dive →</Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-px" style={{ background: "var(--border)", borderBottom: "1px solid var(--border)" }}>
                {[
                  { label: "Monetized",    value: `${monetizedCount}/${visiblePages.length}` },
                  { label: "Avg RPM",      value: `$${avgRpm}` },
                  { label: "At-Risk RPM",  value: `${visiblePages.filter(p => p.rpmChange < -10).length}` },
                  { label: "Not Enrolled", value: `${visiblePages.filter(p => p.revenue === 0).length}` },
                ].map(s => (
                  <div key={s.label} className="px-4 py-3" style={{ background: "var(--surface)" }}>
                    <div className="text-[16px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{s.value}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {[...visiblePages].filter(p => p.rpm > 0).sort((a,b) => b.rpm - a.rpm).map(p => (
                  <div key={p.id} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded flex items-center justify-center text-white font-bold shrink-0"
                      style={{ backgroundColor: p.color, fontSize: "8px" }}>{p.avatar}</div>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100,(p.rpm/12)*100)}%`, backgroundColor: p.color }} />
                    </div>
                    <span className="text-[10px] tabular-nums w-12 text-right font-semibold" style={{ color: "var(--text)" }}>${p.rpm.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content & Platform Mix */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Content & Platform Mix</div>
                  <Link href="/reports/results" className="text-[10px]" style={{ color: "var(--primary)" }}>Deep dive →</Link>
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>Format balance · Views by platform</div>
              </div>
              <div className="px-5 py-4 space-y-4">
                {/* Format bar */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="h-2 rounded-l-full" style={{ width: `${fmt.reels}%`, backgroundColor: "#8B5CF6" }} />
                    <div className="h-2 rounded-r-full" style={{ width: `${fmt.photos}%`, backgroundColor: "#F59E0B" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#8B5CF6" }} />
                        <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>Reels {fmt.reels}%</span>
                      </div>
                      <div className="text-[10px]" style={{ color: "#4ADE80" }}>{fmt.reelsRev} revenue</div>
                      <div className="text-[10px]" style={{ color: "#F59E0B" }}>↑{fmt.reelsFollowers}% of followers</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#F59E0B" }} />
                        <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>Photos {fmt.photos}%</span>
                      </div>
                      <div className="text-[10px]" style={{ color: "#4ADE80" }}>{fmt.photosRev} revenue</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Primary earner</div>
                    </div>
                  </div>
                </div>
                {/* Platform split */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Views by Platform</div>
                  {[
                    { id: "FB", pct: fmt.fbPct, color: "#1877F2" },
                    { id: "IG", pct: fmt.igPct, color: "#E1306C" },
                    { id: "TH", pct: fmt.thPct, color: "var(--text-muted)" },
                  ].map(pl => (
                    <div key={pl.id} className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded w-7 text-center"
                        style={{ background: `${pl.color}22`, color: pl.color }}>{pl.id}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${pl.pct}%`, backgroundColor: pl.color }} />
                      </div>
                      <span className="text-[10px] tabular-nums font-semibold w-6 text-right" style={{ color: "var(--text)" }}>{pl.pct}%</span>
                    </div>
                  ))}
                </div>
                {/* Per-post efficiency */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Per-Post Efficiency</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[["Avg Reach", pp.avgReach], ["Link Clicks", pp.linkClicks], ["Eng. Rate", pp.engRate]].map(([l, v]) => (
                      <div key={l} className="text-center p-2 rounded-lg" style={{ background: "var(--bg)" }}>
                        <div className="text-[12px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{v}</div>
                        <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Audience Quality */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Audience Quality</div>
                  <Link href="/reports/audience" className="text-[10px]" style={{ color: "var(--primary)" }}>Details →</Link>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                {/* US gauge */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>US Audience</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-bold" style={{ color: "var(--text)" }}>{AUDIENCE_GEO.usPercent}%</span>
                      <span className="text-[10px] font-semibold" style={{ color: AUDIENCE_GEO.usChange < 0 ? "#FBBF24" : "#4ADE80" }}>
                        {AUDIENCE_GEO.usChange > 0 ? "↑" : "↓"}{Math.abs(AUDIENCE_GEO.usChange)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                    <div className="h-2 rounded-full" style={{ width: `${AUDIENCE_GEO.usPercent}%`, backgroundColor: "#4ADE80" }} />
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {AUDIENCE_GEO.topCountries.map(c => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>{c}</span>
                    ))}
                  </div>
                  {AUDIENCE_GEO.usChange < -2 && (
                    <div className="mt-2 text-[10px] font-medium px-2.5 py-1.5 rounded-lg"
                      style={{ background: "rgba(251,191,36,0.07)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.15)" }}>
                      ⚠ US traffic ↓{Math.abs(AUDIENCE_GEO.usChange)}% — RPM may compress
                    </div>
                  )}
                </div>
                {/* Net follows by format */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Net Follows by Format</div>
                  {(() => {
                    const total = nf.reels + nf.photos + nf.text || 1;
                    return (
                      <div className="space-y-2">
                        {[{ label: "Reels", value: nf.reels, color: "#8B5CF6" }, { label: "Photos", value: nf.photos, color: "#F59E0B" }, { label: "Text", value: nf.text, color: "#60A5FA" }].map(row => (
                          <div key={row.label} className="flex items-center gap-2">
                            <span className="text-[10px] w-10 shrink-0" style={{ color: "var(--text-muted)" }}>{row.label}</span>
                            <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${Math.round((row.value / total) * 100)}%`, backgroundColor: row.color }} />
                            </div>
                            <span className="text-[10px] font-semibold tabular-nums w-10 text-right"
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
              <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Batch Pulse</div>
                  <Link href="/reports/batches" className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>See Batches →</Link>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {BATCHES.map(b => (
                    <div key={b.id} className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: HEALTH_COLOR[b.health] }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium truncate" style={{ color: "var(--text)" }}>{b.name}</div>
                        <div className="text-[10px] capitalize" style={{ color: "var(--text-muted)" }}>{b.health}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[12px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{b.revenue}</div>
                        <div className="text-[10px] font-semibold" style={{ color: b.changeUp ? "var(--success)" : "var(--error)" }}>
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
      </div>

      {/* ── Bulk Actions Bar ── */}
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
            <input placeholder="Assign tag…" className="text-[11px] px-2.5 py-1 rounded-md outline-none w-28"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import Header from "@/components/Header";
import PageBatchSelector from "@/components/PageBatchSelector";
import Link from "next/link";

type Period = "7d" | "28d" | "90d";

// ------- Period-aware mock data -------

const PERIOD_DATA: Record<Period, {
  totalFollowers: number;
  netFollows: number;
  unfollows: number;
  growthPct: number;
  dateRange: string;
  trendLabel: string;
  startCount: number;
}> = {
  "7d":  { totalFollowers: 24232, netFollows: 198,  unfollows: 104, growthPct: 0.8, dateRange: "Mar 31 – Apr 6, 2026",   trendLabel: "Last 7 days",  startCount: 24034 },
  "28d": { totalFollowers: 24232, netFollows: 803,  unfollows: 413, growthPct: 3.3, dateRange: "Mar 10 – Apr 6, 2026",   trendLabel: "Last 28 days", startCount: 23568 },
  "90d": { totalFollowers: 24232, netFollows: 2841, unfollows: 1204, growthPct: 13.4, dateRange: "Jan 7 – Apr 6, 2026",  trendLabel: "Last 90 days", startCount: 21391 },
};

const FOLLOWER_TREND_28D = [
  { date: "Mar 10", count: 23568 }, { date: "Mar 11", count: 23582 }, { date: "Mar 12", count: 23591 },
  { date: "Mar 13", count: 23601 }, { date: "Mar 14", count: 23598 }, { date: "Mar 15", count: 23612 },
  { date: "Mar 16", count: 23624 }, { date: "Mar 17", count: 23619 }, { date: "Mar 18", count: 23631 },
  { date: "Mar 19", count: 23645 }, { date: "Mar 20", count: 23643 }, { date: "Mar 21", count: 23658 },
  { date: "Mar 22", count: 23669 }, { date: "Mar 23", count: 23677 }, { date: "Mar 24", count: 23671 },
  { date: "Mar 25", count: 23688 }, { date: "Mar 26", count: 23712 }, { date: "Mar 27", count: 23739 },
  { date: "Mar 28", count: 23781 }, { date: "Mar 29", count: 23824 }, { date: "Mar 30", count: 23888 },
  { date: "Mar 31", count: 23941 }, { date: "Apr 1",  count: 23997 }, { date: "Apr 2",  count: 24058 },
  { date: "Apr 3",  count: 24109 }, { date: "Apr 4",  count: 24163 }, { date: "Apr 5",  count: 24201 },
  { date: "Apr 6",  count: 24232 },
];

const FOLLOWER_TREND_7D = FOLLOWER_TREND_28D.slice(-7);

const FOLLOWER_TREND_90D = [
  { date: "Jan 7",  count: 21391 }, { date: "Jan 14", count: 21580 }, { date: "Jan 21", count: 21790 },
  { date: "Jan 28", count: 22010 }, { date: "Feb 4",  count: 22189 }, { date: "Feb 11", count: 22401 },
  { date: "Feb 18", count: 22640 }, { date: "Feb 25", count: 22891 }, { date: "Mar 4",  count: 23102 },
  { date: "Mar 11", count: 23310 }, { date: "Mar 18", count: 23631 }, { date: "Mar 25", count: 23688 },
  { date: "Apr 1",  count: 23997 }, { date: "Apr 6",  count: 24232 },
];

// Age brackets with women/men split (% of total audience each)
const AGE_GENDER = [
  { bracket: "25–34", women: 26.1, men: 14.1 },
  { bracket: "35–44", women: 18.2, men: 9.4  },
  { bracket: "18–24", women: 11.9, men: 6.4  },
  { bracket: "45–54", women: 6.8,  men: 3.4  },
  { bracket: "55–64", women: 1.7,  men: 1.0  },
  { bracket: "65+",   women: 0.6,  men: 0.4  },
];

const TOP_CITIES = [
  { city: "Guatemala City, Guatemala", pct: 13.2 },
  { city: "Managua, Nicaragua",        pct: 13.2 },
  { city: "Damascus, Syria",           pct: 10.5 },
  { city: "Guayaquil, Ecuador",        pct: 10.5 },
  { city: "Houston, TX",               pct: 10.5 },
  { city: "Lima, Peru",                pct: 10.5 },
];

const TOP_COUNTRIES = [
  { country: "United States", pct: 67.7 },
  { country: "Colombia",      pct: 4.8  },
  { country: "Guatemala",     pct: 4.1  },
  { country: "Ecuador",       pct: 4.0  },
  { country: "Nicaragua",     pct: 3.8  },
  { country: "Mexico",        pct: 3.6  },
];

const PAGE_FOLLOWERS = [
  { id: "lc",  name: "Luxury Cars Daily",  avatar: "LC", followers: 8412,  netFollows: { "7d": 52,  "28d": 214, "90d": 751  }, unfollows: { "7d": 21,  "28d": 88,  "90d": 310  }, topCountry: "United States" },
  { id: "hu",  name: "Home Universe",      avatar: "HU", followers: 6103,  netFollows: { "7d": 46,  "28d": 189, "90d": 634  }, unfollows: { "7d": 18,  "28d": 72,  "90d": 241  }, topCountry: "United States" },
  { id: "dh",  name: "Daily Humour",       avatar: "DH", followers: 4821,  netFollows: { "7d": 35,  "28d": 143, "90d": 511  }, unfollows: { "7d": 14,  "28d": 61,  "90d": 198  }, topCountry: "Colombia"      },
  { id: "ff",  name: "Fitness & Flow",     avatar: "FF", followers: 2544,  netFollows: { "7d": 24,  "28d": 98,  "90d": 341  }, unfollows: { "7d": 10,  "28d": 44,  "90d": 148  }, topCountry: "United States" },
  { id: "khn", name: "Kitchen Heroes",     avatar: "KH", followers: 1633,  netFollows: { "7d": 28,  "28d": 112, "90d": 398  }, unfollows: { "7d": 22,  "28d": 95,  "90d": 204  }, topCountry: "Guatemala"     },
  { id: "tb",  name: "Tech Bites",         avatar: "TB", followers: 521,   netFollows: { "7d": 8,   "28d": 31,  "90d": 118  }, unfollows: { "7d": 10,  "28d": 42,  "90d": 89   }, topCountry: "Mexico"        },
  { id: "mm",  name: "Morning Motivation", avatar: "MM", followers: 198,   netFollows: { "7d": 5,   "28d": 16,  "90d": 88   }, unfollows: { "7d": 4,   "28d": 11,  "90d": 14   }, topCountry: "Nicaragua"     },
];

const CONTENT_TYPE_FOLLOWS = [
  { type: "Reel", pct: 97.2, color: "var(--primary)" },
  { type: "Post", pct: 2.8,  color: "var(--success)"  },
];

// ------- Follower chart -------
function FollowerChart({ data }: { data: { date: string; count: number }[] }) {
  const W = 900, H = 120;
  const min = Math.min(...data.map(d => d.count));
  const max = Math.max(...data.map(d => d.count));
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.count - min) / (max - min)) * (H - 12) - 4;
    return `${x},${y}`;
  });
  const pathD = "M" + pts.join(" L");
  const fillD = pathD + ` L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="audienceFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#audienceFill)" />
      <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ------- Simple bar row -------
function BarRow({ label, pct, color = "var(--primary)" }: { label: string; pct: number; color?: string }) {
  return (
    <div className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="text-[12px] flex-1 truncate" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <div className="w-32 h-2 rounded-full overflow-hidden shrink-0" style={{ background: "var(--surface-active)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[12px] font-semibold w-10 text-right shrink-0" style={{ color: "var(--text)" }}>{pct}%</span>
    </div>
  );
}

// ------- Gender-split bar row -------
function GenderBarRow({ bracket, women, men }: { bracket: string; women: number; men: number }) {
  const total = women + men;
  const wPct = Math.round((women / total) * 100);
  const mPct = 100 - wPct;
  return (
    <div className="py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{bracket}</span>
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{total.toFixed(1)}% of audience</span>
      </div>
      {/* Stacked bar: women left, men right */}
      <div className="flex h-2 rounded-full overflow-hidden gap-px" style={{ background: "var(--surface-active)" }}>
        <div className="h-full rounded-l-full" style={{ width: `${(women / 30) * 100}%`, background: "var(--primary)" }} />
        <div className="h-full rounded-r-full" style={{ width: `${(men / 30) * 100}%`, background: "var(--text-muted)" }} />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px]" style={{ color: "var(--primary)" }}>Women {wPct}%</span>
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Men {mPct}%</span>
      </div>
    </div>
  );
}

// ------- Page -------
export default function AudiencePage() {
  const [scope, setScope] = useState("all");
  const [period, setPeriod] = useState<Period>("28d");

  const d = PERIOD_DATA[period];
  const trendData = period === "7d" ? FOLLOWER_TREND_7D : period === "90d" ? FOLLOWER_TREND_90D : FOLLOWER_TREND_28D;
  const xLabels = period === "7d"
    ? trendData.map(t => t.date)
    : period === "90d"
    ? ["Jan 7", "Jan 28", "Feb 18", "Mar 11", "Apr 6"]
    : ["Mar 10", "Mar 15", "Mar 20", "Mar 25", "Mar 30", "Apr 6"];

  return (
    <div>
      <Header
        title="Analytics"
        subtitle="Follower growth, demographics, and reach breakdown."
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
            <PageBatchSelector selected={scope} onChange={(id) => setScope(id)} />
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
          { label: "Overview",      href: "/reports",                active: false },
          { label: "Results",       href: "/reports/results",        active: false },
          { label: "Earnings",      href: "/reports/earnings",       active: false },
          { label: "By Posting ID", href: "/reports/id-performance", active: false },
          { label: "Batches",       href: "/reports/batches",        active: false },
          { label: "Audience",      href: "/reports/audience",       active: true  },
        ].map((tab) => (
          <Link key={tab.label} href={tab.href} className="relative px-4 py-3 text-[13px] font-medium" style={{ color: tab.active ? "var(--primary)" : "var(--text-secondary)" }}>
            {tab.label}
            {tab.active && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
          </Link>
        ))}
      </div>

      <div className="px-8 pb-8">
        {/* Top KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Followers", value: d.totalFollowers.toLocaleString(), sub: `+${d.growthPct}% from prev ${period}`, subColor: "var(--success)" },
            { label: "Net Follows",     value: `+${d.netFollows}`,                sub: d.trendLabel,                           subColor: "var(--success)" },
            { label: "Unfollows",       value: String(d.unfollows),               sub: d.trendLabel,                           subColor: "var(--error)"   },
            { label: "Net Growth",      value: `+${d.netFollows - d.unfollows}`,  sub: "Follows minus unfollows",              subColor: "var(--text-muted)" },
          ].map(k => (
            <div key={k.label} className="rounded-xl px-4 py-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>{k.label}</div>
              <div className="text-[22px] font-bold mb-0.5" style={{ color: "var(--text)" }}>{k.value}</div>
              <div className="text-[11px]" style={{ color: k.subColor }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Follower trend chart */}
        <div className="rounded-xl p-5 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Follower Growth — {d.trendLabel}</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{d.dateRange}</span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>
            {d.startCount.toLocaleString()} → {d.totalFollowers.toLocaleString()} · +{(d.totalFollowers - d.startCount).toLocaleString()} net followers
          </p>
          <div className="flex gap-3 items-end">
            <div className="flex flex-col justify-between text-right shrink-0" style={{ height: 120 }}>
              {[24200, 24000, 23800, 23600].map(v => (
                <span key={v} className="text-[10px] leading-none" style={{ color: "var(--text-muted)" }}>
                  {(v / 1000).toFixed(0)}K
                </span>
              ))}
            </div>
            <div className="flex-1">
              <FollowerChart data={trendData} />
              <div className="flex justify-between mt-1">
                {xLabels.map(d => (
                  <span key={d} className="text-[10px]" style={{ color: "var(--text-muted)" }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3-column grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Age & Gender — split bars */}
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>Age &amp; Gender</div>
            <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>Lifetime · Predominantly women 25–44</p>
            {AGE_GENDER.map(a => (
              <GenderBarRow key={a.bracket} bracket={a.bracket} women={a.women} men={a.men} />
            ))}
            <div className="flex items-center gap-4 mt-3">
              {[
                { label: "Women", color: "var(--primary)" },
                { label: "Men",   color: "var(--text-muted)" },
              ].map(g => (
                <div key={g.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>Top Cities</div>
            <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>Lifetime · % of total audience</p>
            {TOP_CITIES.map(c => (
              <BarRow key={c.city} label={c.city} pct={c.pct} color="var(--primary)" />
            ))}
          </div>

          {/* Top Countries */}
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>Top Countries</div>
            <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>Lifetime · % of total audience</p>
            {TOP_COUNTRIES.map(c => (
              <BarRow key={c.country} label={c.country} pct={c.pct} color="var(--primary)" />
            ))}
          </div>
        </div>

        {/* Follows by content type */}
        <div className="rounded-xl p-5 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>Net Follows by Content Type</div>
          <p className="text-[11px] mb-5" style={{ color: "var(--text-muted)" }}>{d.trendLabel} · Which content type drives new followers</p>
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {CONTENT_TYPE_FOLLOWS.map(c => (
              <div key={c.type} style={{ width: `${c.pct}%`, background: c.color }} title={`${c.type}: ${c.pct}%`} />
            ))}
          </div>
          <div className="flex items-center gap-6">
            {CONTENT_TYPE_FOLLOWS.map(c => (
              <div key={c.type} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{c.type}</span>
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{c.pct}%</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-4" style={{ color: "var(--text-muted)" }}>
            97.2% of new followers come from Reels — prioritise Reel-format content to maximise audience growth.
          </p>
        </div>

        {/* Per-page followers breakdown */}
        <div className="rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Followers by Page</div>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{d.trendLabel} · All pages in selected scope</p>
            </div>
          </div>
          <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Page", "Total Followers", "Net Follows", "Unfollows", "Growth %", "Top Country"].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left font-semibold" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAGE_FOLLOWERS.map((p, i) => {
                const nf = p.netFollows[period];
                const un = p.unfollows[period];
                const base = p.followers - nf + un;
                const growth = base > 0 ? (((nf - un) / base) * 100).toFixed(1) : "0.0";
                const isPositive = parseFloat(growth) >= 0;
                return (
                  <tr key={p.id} style={{ borderBottom: i < PAGE_FOLLOWERS.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>
                          {p.avatar}
                        </div>
                        <span className="font-medium" style={{ color: "var(--text)" }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold" style={{ color: "var(--text)" }}>{p.followers.toLocaleString()}</td>
                    <td className="px-5 py-3" style={{ color: "var(--success)" }}>+{nf}</td>
                    <td className="px-5 py-3" style={{ color: "var(--error)" }}>{un}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ background: isPositive ? "rgba(74,222,128,0.12)" : "rgba(239,68,68,0.12)", color: isPositive ? "var(--success)" : "var(--error)" }}>
                        {isPositive ? "+" : ""}{growth}%
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: "var(--text-secondary)" }}>{p.topCountry}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

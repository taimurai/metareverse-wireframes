// Shared reporting data — all pages reference this for consistency

export type Period = "7d" | "28d" | "90d";
export type Platform = "facebook" | "instagram" | "threads";
export type ScopeType = "all" | "page" | "batch";

// Per-page base data multipliers (relative to "all")
const PAGE_DATA: Record<string, { scale: number; seed: number; engRate: number; followPct: number; revenueScale: number }> = {
  all: { scale: 1, seed: 100, engRate: 4.2, followPct: 11.8, revenueScale: 1 },
  lc:  { scale: 0.36, seed: 111, engRate: 6.8, followPct: 15.2, revenueScale: 0.365 },
  hu:  { scale: 0.27, seed: 222, engRate: 4.2, followPct: 9.8, revenueScale: 0.299 },
  tb:  { scale: 0.13, seed: 333, engRate: 2.9, followPct: 7.4, revenueScale: 0.170 },
  mm:  { scale: 0.11, seed: 444, engRate: 2.1, followPct: 6.1, revenueScale: 0 },
  dh:  { scale: 0.08, seed: 555, engRate: 3.8, followPct: 12.5, revenueScale: 0.097 },
  ff:  { scale: 0.05, seed: 666, engRate: 5.1, followPct: 18.3, revenueScale: 0.069 },
  khn: { scale: 0.003, seed: 777, engRate: 3.4, followPct: 22.1, revenueScale: 0.0003 },
};

// Batch → page mappings
const BATCH_PAGES: Record<string, string[]> = {
  b1: ["lc", "ff", "dh"],
  b2: ["hu", "tb", "mm"],
  b3: ["khn"],
};

function getScopeScale(scope: string, scopeType: ScopeType): { scale: number; seed: number; engRate: number; followPct: number; revenueScale: number } {
  if (scopeType === "all" || scope === "all") return PAGE_DATA.all;
  if (scopeType === "page") return PAGE_DATA[scope] || PAGE_DATA.all;
  if (scopeType === "batch") {
    const pages = BATCH_PAGES[scope] || [];
    const combined = pages.reduce((acc, pid) => {
      const p = PAGE_DATA[pid] || PAGE_DATA.all;
      return { scale: acc.scale + p.scale, seed: p.seed, engRate: (acc.engRate + p.engRate) / 2, followPct: (acc.followPct + p.followPct) / 2, revenueScale: acc.revenueScale + p.revenueScale };
    }, { scale: 0, seed: 100, engRate: 0, followPct: 0, revenueScale: 0 });
    return combined;
  }
  return PAGE_DATA.all;
}

export function getFilteredPageRevenue(scope: string, scopeType: ScopeType, allPages: PageRevenueRow[]): PageRevenueRow[] {
  if (scopeType === "all" || scope === "all") return allPages;
  if (scopeType === "page") {
    const pageIdToName: Record<string, string> = { lc: "Laugh Central", hu: "History Uncovered", tb: "TechByte", mm: "Money Matters", dh: "Daily Health Tips", ff: "Fitness Factory", khn: "Know Her Name" };
    const name = pageIdToName[scope];
    return name ? allPages.filter(p => p.name === name) : allPages;
  }
  if (scopeType === "batch") {
    const pages = BATCH_PAGES[scope] || [];
    const pageNames: Record<string, string> = { lc: "Laugh Central", hu: "History Uncovered", tb: "TechByte", mm: "Money Matters", dh: "Daily Health Tips", ff: "Fitness Factory", khn: "Know Her Name" };
    const names = pages.map(p => pageNames[p]);
    return allPages.filter(p => names.includes(p.name));
  }
  return allPages;
}

// Generate date labels for a period
export function getDateLabels(period: Period): string[] {
  const days = period === "7d" ? 7 : period === "28d" ? 28 : 90;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(2026, 2, 26 - (days - 1 - i)); // ending Mar 26
    return `${d.toLocaleDateString("en-US", { month: "short" })} ${d.getDate()}`;
  });
}

// Seed-based pseudo-random for consistent data
function seeded(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 7) % 2147483647; return (s % 1000) / 1000; };
}

function generateTrend(length: number, base: number, volatility: number, trend: number, seed: number): number[] {
  const rng = seeded(seed);
  const data: number[] = [];
  let val = base;
  for (let i = 0; i < length; i++) {
    val += (rng() - 0.45) * volatility + trend;
    // Add a viral spike around 75% through
    if (i === Math.floor(length * 0.75)) val *= 3.5;
    if (i === Math.floor(length * 0.75) + 1) val *= 0.6;
    if (i === Math.floor(length * 0.75) + 2) val *= 0.5;
    data.push(Math.max(0, Math.round(val)));
  }
  return data;
}

export interface MetricData {
  title: string;
  value: string;
  rawValue: number;
  change: string;
  changeType: "up" | "down";
  sparkData: number[];
  sub: { label: string; value: string; change: string; changeType: "up" | "down" }[];
  extra?: { label: string; value: string; change: string };
  color?: string;
}

export interface ChartMetric {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  data: number[];
  color: string;
  info: string;
}

export function getOverviewMetrics(period: Period, platform: Platform, scope = "all", scopeType: ScopeType = "all"): MetricData[] {
  const platMult = platform === "facebook" ? 1 : platform === "instagram" ? 0.6 : 0.25;
  const days = period === "7d" ? 7 : period === "28d" ? 28 : 90;
  const periodMult = period === "7d" ? 0.25 : period === "28d" ? 1 : 3.2;
  const scopeData = getScopeScale(scope, scopeType);
  const mult = platMult * scopeData.scale;

  const views = Math.round(20800 * mult * periodMult);
  const viewers = Math.round(views * 0.68);
  const follows = Math.round(23 * mult * periodMult);
  const unfollows = Math.round(110 * mult * periodMult);
  const visits = Math.round(791 * mult * periodMult);
  const interactions = Math.round(467 * mult * periodMult);
  const videoViews = Math.round(90 * mult * periodMult);
  const earnings = +(1.49 * mult * periodMult).toFixed(2);
  const seedBase = scopeData.seed;

  return [
    {
      title: "Views",
      value: formatNum(views),
      rawValue: views,
      change: "+2.3K%",
      changeType: "up",
      sparkData: generateTrend(days, views / days * 0.3, views / days * 0.2, views / days * 0.02, seedBase + 1),
      sub: [
        { label: "From followers", value: `${scopeData.followPct}%`, change: "-72.5%", changeType: "down" },
        { label: "From non-followers", value: `${(100 - scopeData.followPct).toFixed(1)}%`, change: "+54.7%", changeType: "up" },
      ],
      extra: { label: "Viewers", value: formatNum(viewers), change: "+4.9K%" },
    },
    {
      title: "Follows",
      value: formatNum(follows),
      rawValue: follows,
      change: "+109.1%",
      changeType: "up",
      sparkData: generateTrend(days, 1, 2, 0.1, seedBase + 2),
      sub: [
        { label: "Unfollows", value: formatNum(unfollows), change: "-38.9%", changeType: "down" },
        { label: "Net follows", value: formatNum(follows - unfollows), change: "+48.5%", changeType: "up" },
      ],
    },
    {
      title: "Visits",
      value: formatNum(visits),
      rawValue: visits,
      change: "+20.6%",
      changeType: "up",
      sparkData: generateTrend(days, visits / days * 0.5, visits / days * 0.3, visits / days * 0.01, seedBase + 3),
      sub: [],
    },
    {
      title: "Interactions",
      value: formatNum(interactions),
      rawValue: interactions,
      change: "+1.0K%",
      changeType: "up",
      sparkData: generateTrend(days, interactions / days * 0.3, interactions / days * 0.2, interactions / days * 0.02, seedBase + 4),
      sub: [
        { label: "From followers", value: "27", change: "-15.6%", changeType: "down" },
        { label: "From non-followers", value: formatNum(Math.round(interactions * 0.94)), change: "+4.3K%", changeType: "up" },
      ],
    },
    {
      title: "Videos & Reels",
      value: formatNum(videoViews),
      rawValue: videoViews,
      change: "-67.6%",
      changeType: "down",
      sparkData: generateTrend(days, videoViews / days * 2, videoViews / days * 0.5, -videoViews / days * 0.01, seedBase + 5),
      sub: [
        { label: "3-second views", value: formatNum(videoViews), change: "-67.6%", changeType: "down" },
        { label: "Watch time", value: period === "7d" ? "4m 12s" : period === "28d" ? "15m 23s" : "48m 10s", change: "-71.5%", changeType: "down" },
      ],
    },
    {
      title: "Approx. Earnings",
      value: `$${earnings.toFixed(2)}`,
      rawValue: earnings,
      change: "+100%",
      changeType: "up",
      sparkData: generateTrend(days, 0.01, 0.05, 0.005, seedBase + 6),
      sub: [],
      color: "var(--success)",
    },
  ];
}

export function getResultsCharts(period: Period, platform: Platform, scope = "all", scopeType: ScopeType = "all"): ChartMetric[] {
  const platMult = platform === "facebook" ? 1 : platform === "instagram" ? 0.6 : 0.25;
  const days = period === "7d" ? 7 : period === "28d" ? 28 : 90;
  const periodMult = period === "7d" ? 0.25 : period === "28d" ? 1 : 3.2;
  const scopeData = getScopeScale(scope, scopeType);
  const mult = platMult * scopeData.scale;
  const s = scopeData.seed;

  return [
    {
      title: "Views",
      value: formatNum(Math.round(20800 * mult * periodMult)),
      change: "+2.3K%",
      changeType: "up",
      data: generateTrend(days, 200 * mult, 150 * mult, 5 * mult, s + 11),
      color: "var(--primary)",
      info: "Total number of times your content was displayed",
    },
    {
      title: "Viewers",
      value: formatNum(Math.round(12400 * mult * periodMult)),
      change: "+4.9K%",
      changeType: "up",
      data: generateTrend(days, 140 * mult, 100 * mult, 3 * mult, s + 12),
      color: "#8B5CF6",
      info: "Unique people who viewed your content",
    },
    {
      title: "Content Interactions",
      value: formatNum(Math.round(467 * mult * periodMult)),
      change: "+1.0K%",
      changeType: "up",
      data: generateTrend(days, 8 * mult, 5 * mult, 0.5 * mult, s + 13),
      color: "#14B8A6",
      info: "Reactions, comments, shares, and saves",
    },
    {
      title: "Link Clicks",
      value: formatNum(Math.round(48 * mult * periodMult)),
      change: "-80.2%",
      changeType: "down",
      data: generateTrend(days, 5 * mult, 3 * mult, -0.1 * mult, s + 14),
      color: "#F59E0B",
      info: "Clicks on links in your posts",
    },
    {
      title: "Visits",
      value: formatNum(Math.round(791 * mult * periodMult)),
      change: "+20.6%",
      changeType: "up",
      data: generateTrend(days, 20 * mult, 12 * mult, 0.3 * mult, s + 15),
      color: "#EC4899",
      info: "Number of times your Page was visited",
    },
    {
      title: "Follows",
      value: formatNum(Math.round(23 * mult * periodMult)),
      change: "+109.1%",
      changeType: "up",
      data: generateTrend(days, 1, 1.5, 0.05, s + 16),
      color: "#6366F1",
      info: "New followers gained during this period",
    },
  ];
}

export interface EarningsTypeData {
  key: string;
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  data: number[];
}

export function getEarningsData(period: Period, platform: Platform, scope = "all", scopeType: ScopeType = "all"): EarningsTypeData[] {
  const platMult = platform === "facebook" ? 1 : platform === "instagram" ? 0.4 : 0.1;
  const days = period === "7d" ? 7 : period === "28d" ? 28 : 90;
  const periodMult = period === "7d" ? 0.25 : period === "28d" ? 1 : 3.2;
  const scopeData = getScopeScale(scope, scopeType);
  const total = +(1.49 * platMult * scopeData.revenueScale * periodMult * 100).toFixed(2); // scale up for visible numbers
  const s = scopeData.seed;

  return [
    { key: "total", label: "Total approximate earnings", value: `$${total.toFixed(2)}`, change: "+100%", changeType: "up", data: generateTrend(days, total / days * 0.3, total / days * 0.2, total / days * 0.01, s + 21) },
    { key: "reels", label: "Reels", value: `$${(total * 0.15).toFixed(2)}`, change: "+42%", changeType: "up", data: generateTrend(days, total * 0.15 / days * 0.3, total * 0.15 / days * 0.2, 0.001, s + 22) },
    { key: "photos", label: "Photos", value: `$${(total * 0.72).toFixed(2)}`, change: "+100%", changeType: "up", data: generateTrend(days, total * 0.72 / days * 0.3, total * 0.72 / days * 0.2, 0.001, s + 23) },
    { key: "stories", label: "Stories", value: `$${(total * 0.08).toFixed(2)}`, change: "+18%", changeType: "up", data: generateTrend(days, total * 0.08 / days * 0.3, total * 0.08 / days * 0.1, 0.0005, s + 24) },
    { key: "text", label: "Text", value: `$${(total * 0.05).toFixed(2)}`, change: "+5%", changeType: "up", data: generateTrend(days, total * 0.05 / days * 0.3, total * 0.05 / days * 0.1, 0.0002, s + 25) },
  ];
}

export interface TopContent {
  title: string;
  earnings: string;
  views: string;
  type: string;
}

export function getTopContent(platform: Platform): TopContent[] {
  if (platform === "instagram") {
    return [
      { title: "Kaja Kallas — Estonia's PM", earnings: "$1.55", views: "26.3K", type: "Reel" },
      { title: "Norway Health Crisis", earnings: "$0.12", views: "1.4K", type: "Photo" },
      { title: "Shirley Chisholm — 1968", earnings: "$0.04", views: "334", type: "Photo" },
    ];
  }
  return [
    { title: "Kaja Kallas — Estonia's PM during Ukraine invasion", earnings: "$3.88", views: "65.8K", type: "Photo" },
    { title: "Norway's greatest public health crisis response", earnings: "$0.30", views: "3.4K", type: "Photo" },
    { title: "Shirley Chisholm — First Black woman on convention floor", earnings: "$0.10", views: "835", type: "Photo" },
    { title: "Motley Crue case at the Supreme Court", earnings: "$0.06", views: "431", type: "Photo" },
    { title: "Sojourner Truth — Convention floor question, 1851", earnings: "$0.03", views: "320", type: "Photo" },
    { title: "Rosalind Franklin — Photo 51 and DNA discovery", earnings: "$0.00", views: "46", type: "Photo" },
  ];
}

export interface RecentPost {
  caption: string;
  type: string;
  date: string;
  views: string;
  reach: string;
  clicks: string;
  reactions: string;
  comments: string;
  shares: string;
  revenue: string;
  status: string;
}

export function getRecentPosts(platform: Platform): RecentPost[] {
  const mult = platform === "facebook" ? 1 : platform === "instagram" ? 0.4 : 0.15;
  return [
    { caption: "Kaja Kallas — Estonia's PM during Ukraine invasion", type: "Photo", date: "Mar 26", views: formatNum(Math.round(65842 * mult)), reach: formatNum(Math.round(45015 * mult)), clicks: formatNum(Math.round(7277 * mult)), reactions: formatNum(Math.round(1842 * mult)), comments: formatNum(Math.round(284 * mult)), shares: formatNum(Math.round(52 * mult)), revenue: `$${(3.88 * mult).toFixed(2)}`, status: "published" },
    { caption: "Norway health crisis response", type: "Photo", date: "Mar 25", views: formatNum(Math.round(3371 * mult)), reach: formatNum(Math.round(2601 * mult)), clicks: formatNum(Math.round(94 * mult)), reactions: formatNum(Math.round(198 * mult)), comments: formatNum(Math.round(34 * mult)), shares: formatNum(Math.round(12 * mult)), revenue: `$${(0.30 * mult).toFixed(2)}`, status: "published" },
    { caption: "Shirley Chisholm — 1968 convention floor", type: "Photo", date: "Mar 24", views: formatNum(Math.round(835 * mult)), reach: formatNum(Math.round(653 * mult)), clicks: formatNum(Math.round(10 * mult)), reactions: formatNum(Math.round(92 * mult)), comments: formatNum(Math.round(15 * mult)), shares: formatNum(Math.round(5 * mult)), revenue: `$${(0.10 * mult).toFixed(2)}`, status: "published" },
    { caption: "Motley Crue — Supreme Court case", type: "Photo", date: "Mar 23", views: formatNum(Math.round(431 * mult)), reach: formatNum(Math.round(332 * mult)), clicks: formatNum(Math.round(4 * mult)), reactions: formatNum(Math.round(56 * mult)), comments: formatNum(Math.round(8 * mult)), shares: formatNum(Math.round(3 * mult)), revenue: `$${(0.06 * mult).toFixed(2)}`, status: "published" },
    { caption: "Sojourner Truth — Convention question, 1851", type: "Reel", date: "Mar 22", views: formatNum(Math.round(320 * mult)), reach: formatNum(Math.round(231 * mult)), clicks: formatNum(Math.round(3 * mult)), reactions: formatNum(Math.round(31 * mult)), comments: formatNum(Math.round(2 * mult)), shares: formatNum(Math.round(2 * mult)), revenue: `$${(0.03 * mult).toFixed(2)}`, status: "published" },
    { caption: "Rosalind Franklin — Photo 51 and DNA", type: "Photo", date: "Mar 15", views: formatNum(Math.round(46 * mult)), reach: formatNum(Math.round(28 * mult)), clicks: formatNum(Math.round(1 * mult)), reactions: "0", comments: "0", shares: "0", revenue: "$0.00", status: "published" },
    { caption: "Niki de Saint Phalle — Shooting Paintings", type: "Photo", date: "Mar 26", views: formatNum(Math.round(107 * mult)), reach: formatNum(Math.round(66 * mult)), clicks: "0", reactions: "0", comments: "0", shares: "0", revenue: "$0.00", status: "published" },
    { caption: "Ruth Bader Ginsburg — 5 landmark cases", type: "Reel", date: "Mar 26", views: formatNum(Math.round(111 * mult)), reach: formatNum(Math.round(77 * mult)), clicks: "0", reactions: "0", comments: "0", shares: "0", revenue: "$0.00", status: "published" },
  ];
}

export interface PageRevenueRow {
  name: string;
  avatar: string;
  color: string;
  revenue: string;
  rpm: string;
  views: string;
  pct: number;
  change: string;
  changeType: "up" | "down";
  monetized: boolean;
}

export function getPageRevenue(period: Period): PageRevenueRow[] {
  const mult = period === "7d" ? 0.25 : period === "28d" ? 1 : 3.2;
  return [
    { name: "Laugh Central", avatar: "LC", color: "#8B5CF6", revenue: `$${Math.round(4690 * mult).toLocaleString()}`, rpm: "$10.20", views: `${(24.5 * mult).toFixed(1)}M`, pct: 36, change: "+31%", changeType: "up", monetized: true },
    { name: "History Uncovered", avatar: "HU", color: "#FF6B2B", revenue: `$${Math.round(3842 * mult).toLocaleString()}`, rpm: "$9.12", views: `${(18.2 * mult).toFixed(1)}M`, pct: 30, change: "+12%", changeType: "up", monetized: true },
    { name: "TechByte", avatar: "TB", color: "#14B8A6", revenue: `$${Math.round(2180 * mult).toLocaleString()}`, rpm: "$8.95", views: `${(9.1 * mult).toFixed(1)}M`, pct: 17, change: "-3%", changeType: "down", monetized: true },
    { name: "Daily Health Tips", avatar: "DH", color: "#6366F1", revenue: `$${Math.round(1245 * mult).toLocaleString()}`, rpm: "$7.80", views: `${(5.6 * mult).toFixed(1)}M`, pct: 10, change: "+8%", changeType: "up", monetized: true },
    { name: "Fitness Factory", avatar: "FF", color: "#EC4899", revenue: `$${Math.round(890 * mult).toLocaleString()}`, rpm: "$6.40", views: `${(3.2 * mult).toFixed(1)}M`, pct: 7, change: "+22%", changeType: "up", monetized: true },
    { name: "Money Matters", avatar: "MM", color: "#F59E0B", revenue: "—", rpm: "—", views: `${(7.4 * mult).toFixed(1)}M`, pct: 0, change: "—", changeType: "up", monetized: false },
    { name: "Know Her Name", avatar: "KH", color: "#0EA5E9", revenue: `$${(4.45 * mult).toFixed(2)}`, rpm: "$0.23", views: `${(77.5 * mult).toFixed(1)}K`, pct: 0.03, change: "+100%", changeType: "up", monetized: true },
  ];
}

export function getAggregateRevenue(period: Period, scope = "all", scopeType: ScopeType = "all") {
  const scopeData = getScopeScale(scope, scopeType);
  const revScale = scopeType === "all" ? 1 : scopeData.revenueScale;
  return {
    weekly: `$${Math.round(12851 * revScale).toLocaleString()}`,
    monthly: `$${Math.round(48396 * revScale * (period === "90d" ? 3.2 : 1)).toLocaleString()}`,
    rpm: "$8.42",
    rpmChange: "+$0.38",
    monetized: "6 / 7",
    notEnrolled: "1 not enrolled",
    ninetyDay: `$${Math.round(142891 * revScale * (period === "90d" ? 1 : period === "28d" ? 0.34 : 0.08)).toLocaleString()}`,
    weeklyChange: "+14%",
    monthlyChange: "+9%",
    ninetyDayChange: "+11%",
  };
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

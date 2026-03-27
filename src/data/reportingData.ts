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
  _views: number;
  _reach: number;
  _clicks: number;
  _reactions: number;
  _comments: number;
  _shares: number;
  _revenue: number;
}

// Per-page post pools (different content per page)
const PAGE_POST_CAPTIONS: Record<string, { captions: string[]; reelIndices: number[] }> = {
  lc: { captions: ["When your code works first try but you don't trust it", "The WiFi password is on the wall — the wall:", "POV: You open 47 Chrome tabs and your laptop becomes a jet engine", "Boss: Can you stay late? Me: *already packed*", "When the meeting could've been an email — Part 47", "That moment when autocorrect changes your professional email", "When you finally fix the bug at 2am", "My bank account after payday vs 3 days later", "When someone says 'quick question' in Slack at 4:59pm", "The 5 stages of debugging: denial, anger, coffee, more coffee, it was a typo", "When your cat walks across the keyboard during a Zoom call", "Client: Can you make the logo bigger? Designer:", "When the intern pushes to production on Friday", "POV: You're the only one who knows how to fix the printer", "Reply all disasters that made history"], reelIndices: [2, 6, 10, 13] },
  hu: { captions: ["Kaja Kallas — Estonia's PM during Ukraine invasion", "Norway health crisis response — timeline", "Shirley Chisholm — 1968 convention floor speech", "Motley Crue — the Supreme Court case nobody talks about", "Sojourner Truth — Convention question, 1851", "Rosalind Franklin — Photo 51 and the DNA helix", "Marie Curie — the notebook that's still radioactive", "Harriet Tubman — the raid at Combahee Ferry", "Amelia Earhart — final radio transmission decoded", "Cleopatra — what she actually looked like", "Rosa Parks — the photo that changed everything", "Catherine the Great — 5 myths debunked", "Hypatia of Alexandria — murdered for mathematics", "Hatshepsut — the pharaoh they tried to erase", "Hedy Lamarr — actress who invented WiFi"], reelIndices: [4, 9, 12] },
  tb: { captions: ["Apple just leaked their next chip — and it's different", "The database that powers 90% of the internet", "Why developers are mass-migrating from Docker", "Rust vs Go in 2026 — the real benchmarks", "This AI model runs entirely on your phone", "The 10-line script that saved a Fortune 500 company $2M", "USB-C was supposed to fix everything. It didn't.", "The browser feature nobody knows about", "Why your SSD will die sooner than you think", "Linux just hit 5% desktop market share — here's why", "The API that broke the internet for 6 hours", "Quantum computing explained with pizza", "This startup built a CPU from scratch in a garage", "Why Windows 12 changes everything for developers", "The programming language that AI can't learn"], reelIndices: [1, 4, 8, 11] },
  dh: { captions: ["3 signs your body is dehydrated — #3 surprises everyone", "Why your doctor doesn't tell you about magnesium", "The breakfast mistake 80% of people make", "Walking vs running — the science is clear now", "Your gut bacteria controls your mood — here's how", "The sleep position that's destroying your back", "5 foods that are secretly inflammatory", "Why stretching before exercise is outdated advice", "The vitamin most people are deficient in", "Cold showers — hype or science?", "Your screen time is aging your eyes faster than you think", "The 2-minute breathing technique that lowers cortisol", "Why processed food is engineered to be addictive", "The truth about intermittent fasting after 40", "Sugar vs fat — the 60-year cover-up"], reelIndices: [3, 7, 9, 14] },
  ff: { captions: ["5 exercises you're doing wrong — and the simple fix", "The workout split that builds muscle 2x faster", "Why your bench press isn't improving", "Protein timing is a myth — here's the real data", "The mobility routine every lifter needs", "Creatine — everything you need to know in 2026", "Why running doesn't burn fat the way you think", "The deadlift form mistake that causes 70% of injuries", "Progressive overload explained in 60 seconds", "The pre-workout ingredient that actually works", "Rest days — how many do you actually need?", "The squat depth debate is finally settled", "Why women should lift heavier", "Cardio before or after weights? Science answers.", "The grip strength exercise that transfers to everything"], reelIndices: [0, 5, 8, 12] },
  mm: { captions: ["The $5 coffee habit is NOT why you're broke", "Why saving 20% of your income is outdated advice", "Index funds vs individual stocks — 20-year data", "The tax loophole that expires in December", "Credit score myths that are costing you money", "Why renting can be smarter than buying in 2026", "The emergency fund rule nobody follows correctly", "Compound interest — the graph that changes minds", "Side hustle taxes — what nobody tells you", "The retirement number is wrong for most people", "Why your 401k allocation is probably outdated", "Inflation-proof your savings with this strategy", "The hidden fees in your bank account", "Debt snowball vs avalanche — real calculator results", "Why financial advice on social media is dangerous"], reelIndices: [2, 7, 10, 13] },
  khn: { captions: ["Niki de Saint Phalle — Shooting paintings in Paris", "Ruth Bader Ginsburg — 5 landmark rulings", "Frida Kahlo — self-portrait analysis", "Ada Lovelace — the first algorithm ever written", "Boudicca — the queen who burned London", "Mary Shelley — she was only 18 when she wrote it", "Artemisia Gentileschi — revenge on canvas", "Nefertiti — the bust that was hidden for years", "Joan of Arc — the trial transcript", "Tomyris — the queen who killed Cyrus the Great", "Malala Yousafzai — her school diary entries", "Eleanor Roosevelt — the secret letters", "Wu Zetian — China's only female emperor", "Sacagawea — what the expedition journals say", "Empress Dowager Cixi — photographer queen"], reelIndices: [2, 4, 7] },
};

export function getRecentPosts(platform: Platform, pageId?: string): RecentPost[] {
  const mult = platform === "facebook" ? 1 : platform === "instagram" ? 0.4 : 0.15;
  const pool = pageId && PAGE_POST_CAPTIONS[pageId] ? PAGE_POST_CAPTIONS[pageId] : PAGE_POST_CAPTIONS.khn;

  // Generate posts from page-specific pool
  const posts: RecentPost[] = pool.captions.map((caption, i) => {
    const s = seededRandom(hashStr(caption));
    const baseViews = Math.round((s * 80000 + 50) * mult);
    const baseReach = Math.round(baseViews * (0.6 + s * 0.2));
    const baseClicks = Math.round(baseViews * (0.01 + s * 0.08));
    const baseReactions = Math.round(baseViews * (0.01 + s * 0.04));
    const baseComments = Math.round(baseReactions * (0.05 + s * 0.15));
    const baseShares = Math.round(baseReactions * (0.02 + s * 0.05));
    const baseRevenue = +(baseViews * 0.00005 * (0.5 + s)).toFixed(2);
    const day = 26 - i;
    const month = day > 0 ? "Mar" : "Feb";
    const displayDay = day > 0 ? day : 28 + day;

    return {
      caption, type: pool.reelIndices.includes(i) ? "Reel" : "Photo",
      date: `${month} ${displayDay}`, status: "published",
      views: formatNum(baseViews), reach: formatNum(baseReach),
      clicks: formatNum(baseClicks), reactions: formatNum(baseReactions),
      comments: formatNum(baseComments), shares: formatNum(baseShares),
      revenue: `$${baseRevenue.toFixed(2)}`,
      _views: baseViews, _reach: baseReach, _clicks: baseClicks,
      _reactions: baseReactions, _comments: baseComments, _shares: baseShares,
      _revenue: baseRevenue,
    };
  });

  return posts;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

// Raw post data with numeric values for sorting
interface RawPost {
  caption: string; type: "Photo" | "Reel"; date: string; views: number; reach: number; clicks: number; reactions: number; comments: number; shares: number; revenue: number;
}

const RAW_POSTS: RawPost[] = [
  { caption: "Kaja Kallas — Estonia's PM during Ukraine invasion", type: "Photo", date: "Mar 26", views: 65842, reach: 45015, clicks: 7277, reactions: 1842, comments: 284, shares: 52, revenue: 3.88 },
  { caption: "Norway health crisis response — timeline", type: "Photo", date: "Mar 25", views: 3371, reach: 2601, clicks: 94, reactions: 198, comments: 34, shares: 12, revenue: 0.30 },
  { caption: "Shirley Chisholm — 1968 convention floor speech", type: "Photo", date: "Mar 24", views: 835, reach: 653, clicks: 10, reactions: 92, comments: 15, shares: 5, revenue: 0.10 },
  { caption: "Motley Crue — the Supreme Court case nobody talks about", type: "Photo", date: "Mar 23", views: 431, reach: 332, clicks: 4, reactions: 56, comments: 8, shares: 3, revenue: 0.06 },
  { caption: "Sojourner Truth — Convention question, 1851", type: "Reel", date: "Mar 22", views: 320, reach: 231, clicks: 3, reactions: 31, comments: 2, shares: 2, revenue: 0.03 },
  { caption: "Rosalind Franklin — Photo 51 and the DNA helix", type: "Photo", date: "Mar 15", views: 46, reach: 28, clicks: 1, reactions: 0, comments: 0, shares: 0, revenue: 0 },
  { caption: "Niki de Saint Phalle — Shooting paintings in Paris", type: "Photo", date: "Mar 26", views: 107, reach: 66, clicks: 0, reactions: 0, comments: 0, shares: 0, revenue: 0 },
  { caption: "Ruth Bader Ginsburg — 5 landmark rulings", type: "Reel", date: "Mar 26", views: 111, reach: 77, clicks: 0, reactions: 0, comments: 0, shares: 0, revenue: 0 },
  { caption: "Marie Curie — the notebook that's still radioactive", type: "Photo", date: "Mar 21", views: 12400, reach: 8900, clicks: 342, reactions: 890, comments: 67, shares: 28, revenue: 1.12 },
  { caption: "Harriet Tubman — the raid at Combahee Ferry", type: "Photo", date: "Mar 20", views: 8750, reach: 6200, clicks: 210, reactions: 445, comments: 38, shares: 15, revenue: 0.78 },
  { caption: "Frida Kahlo — self-portrait analysis", type: "Reel", date: "Mar 19", views: 24300, reach: 18100, clicks: 890, reactions: 2100, comments: 312, shares: 89, revenue: 2.45 },
  { caption: "Amelia Earhart — final radio transmission decoded", type: "Photo", date: "Mar 18", views: 31200, reach: 22400, clicks: 1540, reactions: 1650, comments: 198, shares: 76, revenue: 2.89 },
  { caption: "Ada Lovelace — the first algorithm ever written", type: "Photo", date: "Mar 17", views: 5600, reach: 4100, clicks: 120, reactions: 310, comments: 42, shares: 18, revenue: 0.52 },
  { caption: "Cleopatra — what she actually looked like", type: "Reel", date: "Mar 16", views: 89400, reach: 64200, clicks: 4200, reactions: 5400, comments: 890, shares: 234, revenue: 8.92 },
  { caption: "Rosa Parks — the photo that changed everything", type: "Photo", date: "Mar 15", views: 15800, reach: 11200, clicks: 560, reactions: 920, comments: 78, shares: 34, revenue: 1.45 },
  { caption: "Catherine the Great — 5 myths debunked", type: "Photo", date: "Mar 14", views: 7200, reach: 5100, clicks: 180, reactions: 380, comments: 52, shares: 21, revenue: 0.68 },
  { caption: "Malala Yousafzai — her school diary entries", type: "Photo", date: "Mar 13", views: 4500, reach: 3200, clicks: 95, reactions: 210, comments: 28, shares: 12, revenue: 0.38 },
  { caption: "Hypatia of Alexandria — murdered for mathematics", type: "Reel", date: "Mar 12", views: 18900, reach: 13500, clicks: 720, reactions: 1280, comments: 156, shares: 67, revenue: 1.78 },
  { caption: "Eleanor Roosevelt — the secret letters", type: "Photo", date: "Mar 11", views: 9800, reach: 7100, clicks: 280, reactions: 520, comments: 45, shares: 19, revenue: 0.92 },
  { caption: "Wu Zetian — China's only female emperor", type: "Photo", date: "Mar 10", views: 6300, reach: 4500, clicks: 150, reactions: 340, comments: 38, shares: 14, revenue: 0.58 },
  { caption: "Nefertiti — the bust that was hidden for years", type: "Reel", date: "Mar 9", views: 42100, reach: 30200, clicks: 2100, reactions: 3200, comments: 420, shares: 112, revenue: 4.15 },
  { caption: "Joan of Arc — the trial transcript", type: "Photo", date: "Mar 8", views: 11200, reach: 8000, clicks: 340, reactions: 680, comments: 62, shares: 28, revenue: 1.02 },
  { caption: "Sacagawea — what the expedition journals say", type: "Photo", date: "Mar 7", views: 3800, reach: 2700, clicks: 80, reactions: 190, comments: 22, shares: 8, revenue: 0.32 },
  { caption: "Hatshepsut — the pharaoh they tried to erase", type: "Photo", date: "Mar 6", views: 28900, reach: 20800, clicks: 1320, reactions: 1890, comments: 234, shares: 89, revenue: 2.72 },
  { caption: "Boudicca — the queen who burned London", type: "Reel", date: "Mar 5", views: 35600, reach: 25400, clicks: 1800, reactions: 2400, comments: 312, shares: 98, revenue: 3.34 },
  { caption: "Mary Shelley — she was only 18 when she wrote it", type: "Photo", date: "Mar 4", views: 7800, reach: 5600, clicks: 200, reactions: 420, comments: 56, shares: 22, revenue: 0.72 },
  { caption: "Empress Dowager Cixi — photographer queen", type: "Photo", date: "Mar 3", views: 2900, reach: 2100, clicks: 60, reactions: 140, comments: 18, shares: 6, revenue: 0.24 },
  { caption: "Artemisia Gentileschi — revenge on canvas", type: "Reel", date: "Mar 2", views: 16400, reach: 11800, clicks: 640, reactions: 1100, comments: 134, shares: 56, revenue: 1.52 },
  { caption: "Hedy Lamarr — actress who invented WiFi", type: "Photo", date: "Mar 1", views: 52300, reach: 37600, clicks: 3200, reactions: 3800, comments: 520, shares: 145, revenue: 5.12 },
  { caption: "Tomyris — the queen who killed Cyrus the Great", type: "Photo", date: "Feb 28", views: 19800, reach: 14200, clicks: 780, reactions: 1340, comments: 178, shares: 72, revenue: 1.85 },
];

export function getRecentPosts(platform: Platform): RecentPost[] {
  const mult = platform === "facebook" ? 1 : platform === "instagram" ? 0.4 : 0.15;
  return RAW_POSTS.map(p => ({
    caption: p.caption, type: p.type, date: p.date, status: "published",
    views: formatNum(Math.round(p.views * mult)),
    reach: formatNum(Math.round(p.reach * mult)),
    clicks: formatNum(Math.round(p.clicks * mult)),
    reactions: formatNum(Math.round(p.reactions * mult)),
    comments: formatNum(Math.round(p.comments * mult)),
    shares: formatNum(Math.round(p.shares * mult)),
    revenue: `$${(p.revenue * mult).toFixed(2)}`,
    // Store raw numeric values for sorting
    _views: Math.round(p.views * mult),
    _reach: Math.round(p.reach * mult),
    _clicks: Math.round(p.clicks * mult),
    _reactions: Math.round(p.reactions * mult),
    _comments: Math.round(p.comments * mult),
    _shares: Math.round(p.shares * mult),
    _revenue: +(p.revenue * mult).toFixed(2),
  }));
}

export interface PageRevenueRow {
  id: string;
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
    { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6", revenue: `$${Math.round(4690 * mult).toLocaleString()}`, rpm: "$10.20", views: `${(24.5 * mult).toFixed(1)}M`, pct: 36, change: "+31%", changeType: "up", monetized: true },
    { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B", revenue: `$${Math.round(3842 * mult).toLocaleString()}`, rpm: "$9.12", views: `${(18.2 * mult).toFixed(1)}M`, pct: 30, change: "+12%", changeType: "up", monetized: true },
    { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6", revenue: `$${Math.round(2180 * mult).toLocaleString()}`, rpm: "$8.95", views: `${(9.1 * mult).toFixed(1)}M`, pct: 17, change: "-3%", changeType: "down", monetized: true },
    { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1", revenue: `$${Math.round(1245 * mult).toLocaleString()}`, rpm: "$7.80", views: `${(5.6 * mult).toFixed(1)}M`, pct: 10, change: "+8%", changeType: "up", monetized: true },
    { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899", revenue: `$${Math.round(890 * mult).toLocaleString()}`, rpm: "$6.40", views: `${(3.2 * mult).toFixed(1)}M`, pct: 7, change: "+22%", changeType: "up", monetized: true },
    { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B", revenue: "—", rpm: "—", views: `${(7.4 * mult).toFixed(1)}M`, pct: 0, change: "—", changeType: "up", monetized: false },
    { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9", revenue: `$${(4.45 * mult).toFixed(2)}`, rpm: "$0.23", views: `${(77.5 * mult).toFixed(1)}K`, pct: 0.03, change: "+100%", changeType: "up", monetized: true },
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

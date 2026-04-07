"use client";
import { useState } from "react";

type Post = {
  id: string;
  page: string;
  batch: string;
  caption: string;
  publishedAt: string;
  type: "Photos" | "Video" | "Reel" | "Link";
  views: number;
  reach: number;
  reactions: number;
  comments: number;
  shares: number;
  clicks: number;
  earnings: number; // USD
  permalink: string;
};

const posts: Post[] = [
  { id: "p1",  page: "Know Her Name",     batch: "Women's History",   caption: "Harriet Tubman didn't just escape — she came back. 13 times. Every time at risk of her own freedom. Every time because she refused to leave others behind.",       publishedAt: "Apr 5, 2026 · 10:14 AM", type: "Photos", views: 1155, reach: 892, reactions: 75, comments: 12, shares: 31, clicks: 210, earnings: 0.06, permalink: "#" },
  { id: "p2",  page: "Know Her Name",     batch: "Women's History",   caption: "Marie Curie won two Nobel Prizes in two different sciences. When she submitted her doctoral thesis, the committee called it the greatest contribution to science by a single researcher.",   publishedAt: "Apr 4, 2026 · 11:02 AM", type: "Photos", views: 892,  reach: 701, reactions: 54, comments: 8,  shares: 19, clicks: 148, earnings: 0.04, permalink: "#" },
  { id: "p3",  page: "Know Her Name",     batch: "Women's History",   caption: "Rosa Parks was not tired. She was a trained civil rights activist who planned her refusal. The 'tired old woman' story was a myth created to make her act seem spontaneous.",           publishedAt: "Apr 3, 2026 · 9:48 AM",  type: "Photos", views: 1042, reach: 834, reactions: 88, comments: 21, shares: 47, clicks: 261, earnings: 0.05, permalink: "#" },
  { id: "p4",  page: "Know Her Name",     batch: "Women's History",   caption: "Ada Lovelace wrote the first computer algorithm in 1843 — a century before computers existed. Charles Babbage built the machine. Ada understood what it could become.",                   publishedAt: "Apr 2, 2026 · 10:30 AM", type: "Photos", views: 744,  reach: 612, reactions: 41, comments: 5,  shares: 14, clicks: 119, earnings: 0.03, permalink: "#" },
  { id: "p5",  page: "Know Her Name",     batch: "Women's History",   caption: "Frida Kahlo painted through 35 surgeries. She called her work 'the most frank expression of myself.' Pain was her medium. Survival was her subject.",                                     publishedAt: "Apr 1, 2026 · 8:55 AM",  type: "Photos", views: 988,  reach: 777, reactions: 63, comments: 14, shares: 28, clicks: 195, earnings: 0.04, permalink: "#" },
  { id: "p6",  page: "LoopAgency",        batch: "Partner A Lifestyle", caption: "Morning light, coffee, presence. Some days the routine IS the ritual. #lifestyle #morningvibes",                                                                                         publishedAt: "Apr 5, 2026 · 7:00 AM",  type: "Photos", views: 412,  reach: 318, reactions: 22, comments: 3,  shares: 5,  clicks: 44,  earnings: 0.01, permalink: "#" },
  { id: "p7",  page: "GrowthLab Agency",  batch: "Partner A Lifestyle", caption: "The best marketing doesn't feel like marketing. It feels like a conversation your audience needed to have. Are you having those conversations?",                                           publishedAt: "Apr 4, 2026 · 2:15 PM",  type: "Photos", views: 674,  reach: 511, reactions: 38, comments: 9,  shares: 16, clicks: 88,  earnings: 0.02, permalink: "#" },
  { id: "p8",  page: "ByteForge",         batch: "Partner B Education", caption: "If you're learning to code: the confusion you feel right now is not a sign you're bad at this. It's a sign you're thinking. Keep going.",                                                publishedAt: "Apr 3, 2026 · 12:00 PM", type: "Photos", views: 521,  reach: 404, reactions: 45, comments: 11, shares: 22, clicks: 77,  earnings: 0.02, permalink: "#" },
  { id: "p9",  page: "ContentCo",         batch: "Partner A Lifestyle", caption: "Three years ago I had no audience. No brand. No strategy. Just a camera and something to say. Here's what I learned along the way 🧵",                                                   publishedAt: "Apr 2, 2026 · 9:00 AM",  type: "Photos", views: 317,  reach: 244, reactions: 18, comments: 4,  shares: 8,  clicks: 39,  earnings: 0.01, permalink: "#" },
  { id: "p10", page: "Know Her Name",     batch: "Women's History",   caption: "Malala Yousafzai was shot for going to school. When she recovered, she went back. Then she started a global education fund. Some people respond to fear by disappearing. Malala responded by amplifying.",  publishedAt: "Mar 28, 2026 · 10:01 AM", type: "Photos", views: 882,  reach: 714, reactions: 59, comments: 16, shares: 33, clicks: 182, earnings: 0.03, permalink: "#" },
  { id: "p11", page: "Know Her Name",     batch: "Women's History",   caption: "Simone de Beauvoir wrote 'One is not born, but rather becomes, a woman' in 1949. The world is still arguing about it.",                                                                    publishedAt: "Mar 27, 2026 · 11:30 AM", type: "Photos", views: 591,  reach: 472, reactions: 33, comments: 7,  shares: 11, clicks: 103, earnings: 0.02, permalink: "#" },
  { id: "p12", page: "ViralBurst",        batch: "Partner B Education", caption: "Curiosity is not a distraction from learning. It IS learning. Don't teach kids to memorize answers. Teach them to love questions.",                                                       publishedAt: "Mar 26, 2026 · 8:00 AM",  type: "Photos", views: 448,  reach: 352, reactions: 29, comments: 6,  shares: 13, clicks: 62,  earnings: 0.01, permalink: "#" },
];

const PAGE_OPTIONS = ["All Pages", "Know Her Name", "LoopAgency", "GrowthLab Agency", "ByteForge", "ContentCo", "ViralBurst"];
const BATCH_OPTIONS = ["All Batches", "Women's History", "Partner A Lifestyle", "Partner B Education"];
const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest first" },
  { value: "views_desc", label: "Most views" },
  { value: "earnings_desc", label: "Highest earnings" },
  { value: "reach_desc", label: "Most reach" },
];

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n); }
function fmtEarnings(n: number) { return n === 0 ? "—" : `$${n.toFixed(2)}`; }

export default function PublishedPage() {
  const [pageFilter, setPageFilter] = useState("All Pages");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [sort, setSort] = useState("date_desc");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  let filtered = posts.filter(p => {
    if (pageFilter !== "All Pages" && p.page !== pageFilter) return false;
    if (batchFilter !== "All Batches" && p.batch !== batchFilter) return false;
    if (search && !p.caption.toLowerCase().includes(search.toLowerCase()) && !p.page.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "views_desc") return b.views - a.views;
    if (sort === "earnings_desc") return b.earnings - a.earnings;
    if (sort === "reach_desc") return b.reach - a.reach;
    return 0; // date_desc — already sorted by date in mock
  });

  const totalViews    = filtered.reduce((s, p) => s + p.views, 0);
  const totalReach    = filtered.reduce((s, p) => s + p.reach, 0);
  const totalEarnings = filtered.reduce((s, p) => s + p.earnings, 0);
  const totalPosts    = filtered.length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>Published Posts</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Every post that went live — with per-post metrics pulled from the Facebook API.
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Posts shown", value: String(totalPosts) },
          { label: "Total views", value: fmt(totalViews) },
          { label: "Total reach", value: fmt(totalReach) },
          { label: "Est. earnings", value: `$${totalEarnings.toFixed(2)}` },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search captions…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg text-sm w-56"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        {/* Page filter */}
        <select value={pageFilter} onChange={e => setPageFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-[12px]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {PAGE_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>

        {/* Batch filter */}
        <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-[12px]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {BATCH_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>

        {/* Sort */}
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="px-3 py-2 rounded-lg text-[12px]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <div className="ml-auto">
          <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Post list */}
      <div className="space-y-2">
        {filtered.map(post => {
          const isExpanded = expandedId === post.id;
          return (
            <div key={post.id} className="rounded-xl overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>

              {/* Main row */}
              <div className="flex items-center gap-4 px-4 py-3">
                {/* Thumbnail placeholder */}
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "var(--surface-active)", color: "var(--text-muted)" }}>
                  IMG
                </div>

                {/* Caption + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] truncate mb-0.5" style={{ color: "var(--text)" }}>{post.caption}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>{post.page}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>·</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{post.publishedAt}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>·</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: "var(--surface-active)", color: "var(--text-muted)" }}>{post.type}</span>
                  </div>
                </div>

                {/* Metrics inline */}
                <div className="flex items-center gap-5 shrink-0">
                  {[
                    { icon: "👁", val: fmt(post.views),    tip: "Views"    },
                    { icon: "📡", val: fmt(post.reach),    tip: "Reach"    },
                    { icon: "❤️", val: String(post.reactions), tip: "Reactions" },
                    { icon: "💬", val: String(post.comments),  tip: "Comments" },
                    { icon: "🔁", val: String(post.shares),    tip: "Shares"   },
                    { icon: "💰", val: fmtEarnings(post.earnings), tip: "Earnings" },
                  ].map(m => (
                    <div key={m.tip} className="text-center" title={m.tip}>
                      <div className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>{m.icon}</div>
                      <div className="text-[12px] font-semibold" style={{ color: m.tip === "Earnings" && post.earnings > 0 ? "var(--success)" : "var(--text)" }}>{m.val}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg"
                    style={{ background: "var(--surface-active)", color: "var(--text-secondary)" }}>
                    {isExpanded ? "Less" : "Details"}
                  </button>
                  <a href={post.permalink} target="_blank" rel="noreferrer"
                    className="text-[11px] px-2.5 py-1.5 rounded-lg"
                    style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>
                    View →
                  </a>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-[10px] mb-1 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Full Caption</div>
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{post.caption}</p>
                    </div>
                    <div>
                      <div className="text-[10px] mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Engagement Breakdown</div>
                      <div className="space-y-1.5">
                        {[
                          { label: "Total Clicks",  val: post.clicks },
                          { label: "Reactions",     val: post.reactions },
                          { label: "Comments",      val: post.comments },
                          { label: "Shares",        val: post.shares },
                        ].map(r => (
                          <div key={r.label} className="flex items-center justify-between">
                            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{r.label}</span>
                            <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{r.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Post Info</div>
                      <div className="space-y-1.5">
                        {[
                          { label: "Page",      val: post.page },
                          { label: "Batch",     val: post.batch },
                          { label: "Type",      val: post.type },
                          { label: "Published", val: post.publishedAt },
                        ].map(r => (
                          <div key={r.label} className="flex items-center justify-between">
                            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{r.label}</span>
                            <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{r.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Permalink:</span>
                    <a href={post.permalink} className="text-[11px]" style={{ color: "var(--primary)" }}>
                      facebook.com/permalink/... →
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] mt-4" style={{ color: "var(--text-muted)" }}>
        Showing {filtered.length} of {posts.length} published posts · Metrics sync every 24 hours via Facebook Insights API.
      </p>
    </div>
  );
}

"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SparklineChart from "@/components/SparklineChart";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import Link from "next/link";

const recentPosts = [
  { caption: "Kaja Kallas — Estonia's PM during Ukraine invasion", type: "Photo", date: "Mar 26", views: "65,842", reach: "45,015", clicks: "7,277", photoClicks: "6,890", otherClicks: "387", reactions: "1,842", comments: "284", shares: "52", revenue: "$3.88", status: "published" },
  { caption: "Norway health crisis response", type: "Photo", date: "Mar 25", views: "3,371", reach: "2,601", clicks: "94", photoClicks: "82", otherClicks: "12", reactions: "198", comments: "34", shares: "12", revenue: "$0.30", status: "published" },
  { caption: "Shirley Chisholm — 1968 convention floor", type: "Photo", date: "Mar 24", views: "835", reach: "653", clicks: "10", photoClicks: "8", otherClicks: "2", reactions: "92", comments: "15", shares: "5", revenue: "$0.10", status: "published" },
  { caption: "Motley Crue — Supreme Court case", type: "Photo", date: "Mar 23", views: "431", reach: "332", clicks: "4", photoClicks: "3", otherClicks: "1", reactions: "56", comments: "8", shares: "3", revenue: "$0.06", status: "published" },
  { caption: "Sojourner Truth — Convention question, 1851", type: "Photo", date: "Mar 22", views: "320", reach: "231", clicks: "3", photoClicks: "2", otherClicks: "1", reactions: "31", comments: "2", shares: "2", revenue: "$0.03", status: "published" },
  { caption: "Rosalind Franklin — Photo 51 and DNA", type: "Photo", date: "Mar 15", views: "46", reach: "28", clicks: "1", photoClicks: "1", otherClicks: "0", reactions: "0", comments: "0", shares: "0", revenue: "$0.00", status: "published" },
];

export default function PageReport() {
  const [period, setPeriod] = useState("28d");
  const [platform, setPlatform] = useState("facebook");
  const [postFilter, setPostFilter] = useState("all");

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link href="/reports" className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Insights</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><polyline points="9 18 15 12 9 6"/></svg>
        <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>Know Her Name</span>
      </div>

      <Header
        title="Know Her Name"
        subtitle="Women's History · 136 posts · Facebook"
        actions={
          <div className="flex items-center gap-3">
            <PlatformSwitcher active={platform} onChange={setPlatform} />
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
              {["7d", "28d", "90d"].map((p) => (
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

      {/* Metric Cards - 3 column */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Views + Viewers */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Views</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-bold" style={{ color: "var(--text)" }}>77,522</span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--success)" }}>↑ 2.3K%</span>
          </div>
          <div className="mt-3 mb-3"><SparklineChart data={[20, 30, 25, 40, 35, 50, 300, 800]} color="var(--primary)" height={32} /></div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Viewers (unique)</span><span className="font-medium" style={{ color: "var(--text)" }}>53,281</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>From followers</span><span className="font-medium" style={{ color: "var(--text)" }}>11.8%</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>From non-followers</span><span className="font-medium" style={{ color: "var(--text)" }}>88.2%</span></div>
          </div>
        </div>

        {/* Interactions + Clicks */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Interactions</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-bold" style={{ color: "var(--text)" }}>2,641</span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--success)" }}>↑ 1.0K%</span>
          </div>
          <div className="mt-3 mb-3"><SparklineChart data={[2, 3, 4, 5, 8, 50, 180, 350]} color="#14B8A6" height={32} /></div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Reactions</span><span className="font-medium" style={{ color: "var(--text)" }}>2,219</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Comments</span><span className="font-medium" style={{ color: "var(--text)" }}>348</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Shares</span><span className="font-medium" style={{ color: "var(--text)" }}>74</span></div>
          </div>
        </div>

        {/* Clicks + Earnings */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Clicks & Earnings</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-bold" style={{ color: "var(--text)" }}>7,417</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>total clicks</span>
          </div>
          <div className="mt-3 mb-3"><SparklineChart data={[1, 2, 1, 3, 4, 30, 100, 400]} color="#F59E0B" height={32} /></div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Photo clicks</span><span className="font-medium" style={{ color: "var(--text)" }}>6,986</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Other clicks</span><span className="font-medium" style={{ color: "var(--text)" }}>431</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Approx. earnings</span><span className="font-semibold" style={{ color: "var(--success)" }}>$4.45</span></div>
          </div>
        </div>
      </div>

      {/* Video/Reels metrics */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-muted)" }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Videos & Reels</span>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>90</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>3-second views</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--error)" }}>↓ 67.6%</div>
          </div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>15m 23s</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Watch time</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--error)" }}>↓ 71.5%</div>
          </div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>0:42</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Avg watch time</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>—</div>
          </div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>$0.00</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Reels earnings</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>0%</div>
          </div>
        </div>
      </div>

      {/* Reactions Breakdown */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Reactions Breakdown</div>
        <div className="flex items-center gap-6">
          {[
            { emoji: "👍", label: "Like", count: "1,420", pct: 64 },
            { emoji: "❤️", label: "Love", count: "445", pct: 20 },
            { emoji: "😂", label: "Haha", count: "89", pct: 4 },
            { emoji: "😮", label: "Wow", count: "178", pct: 8 },
            { emoji: "😢", label: "Sad", count: "67", pct: 3 },
            { emoji: "😡", label: "Angry", count: "20", pct: 1 },
          ].map((r) => (
            <div key={r.label} className="flex-1 text-center">
              <div className="text-2xl mb-1">{r.emoji}</div>
              <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{r.count}</div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{r.pct}%</div>
              <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: "var(--bg)" }}>
                <div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: "var(--primary)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Recent Posts</h3>
          <div className="flex items-center gap-2">
            <select
              value={postFilter}
              onChange={(e) => setPostFilter(e.target.value)}
              className="text-[12px] px-3 py-1.5 rounded-lg border outline-none"
              style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text-secondary)" }}
            >
              <option value="all">All types</option>
              <option value="photos">Photos</option>
              <option value="videos">Videos</option>
              <option value="text">Text</option>
              <option value="reels">Reels</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                <th className="px-5 py-3 font-medium">Post</th>
                <th className="px-3 py-3 font-medium text-right">Views</th>
                <th className="px-3 py-3 font-medium text-right">Reach</th>
                <th className="px-3 py-3 font-medium text-right">Clicks</th>
                <th className="px-3 py-3 font-medium text-right">Reactions</th>
                <th className="px-3 py-3 font-medium text-right">Comments</th>
                <th className="px-3 py-3 font-medium text-right">Shares</th>
                <th className="px-3 py-3 font-medium text-right">Earnings</th>
                <th className="px-3 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--surface-active)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium line-clamp-1 max-w-[200px]" style={{ color: "var(--text)" }}>{post.caption}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{post.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{post.views}</td>
                  <td className="px-3 py-3 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{post.reach}</td>
                  <td className="px-3 py-3 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{post.clicks}</td>
                  <td className="px-3 py-3 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{post.reactions}</td>
                  <td className="px-3 py-3 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{post.comments}</td>
                  <td className="px-3 py-3 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{post.shares}</td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums" style={{ color: "var(--success)" }}>{post.revenue}</td>
                  <td className="px-3 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--surface-active)", color: "var(--text-muted)" }}>{post.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

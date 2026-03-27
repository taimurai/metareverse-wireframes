"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SparklineChart from "@/components/SparklineChart";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import Link from "next/link";
import { getRecentPosts, type Platform } from "@/data/reportingData";

type Period = "7d" | "28d" | "90d";

export default function PageReport() {
  const [period, setPeriod] = useState<Period>("28d");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [postFilter, setPostFilter] = useState("all");

  const allPosts = getRecentPosts(platform);
  const filteredPosts = postFilter === "all" ? allPosts : allPosts.filter(p => p.type.toLowerCase() === postFilter);

  const mult = platform === "facebook" ? 1 : platform === "instagram" ? 0.4 : 0.15;
  const periodMult = period === "7d" ? 0.25 : period === "28d" ? 1 : 3.2;

  const totalViews = Math.round(77522 * mult * periodMult);
  const totalViewers = Math.round(53281 * mult * periodMult);
  const totalInteractions = Math.round(2641 * mult * periodMult);
  const totalReactions = Math.round(2219 * mult * periodMult);
  const totalComments = Math.round(348 * mult * periodMult);
  const totalShares = Math.round(74 * mult * periodMult);
  const totalClicks = Math.round(7417 * mult * periodMult);
  const photoClicks = Math.round(6986 * mult * periodMult);
  const otherClicks = Math.round(431 * mult * periodMult);
  const earnings = +(4.45 * mult * periodMult).toFixed(2);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link href="/reports" className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Insights</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><polyline points="9 18 15 12 9 6"/></svg>
        <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>Know Her Name</span>
      </div>

      <Header
        title="Know Her Name"
        subtitle={`Women's History · ${Math.round(136 * periodMult)} posts · ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
        actions={
          <div className="flex items-center gap-3">
            <PlatformSwitcher active={platform} onChange={(p) => setPlatform(p as Platform)} />
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

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Views</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-bold" style={{ color: "var(--text)" }}>{totalViews.toLocaleString()}</span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--success)" }}>↑ 2.3K%</span>
          </div>
          <div className="mt-3 mb-3"><SparklineChart data={[20, 30, 25, 40, 35, 50, 300, 800]} color="var(--primary)" height={32} /></div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Viewers (unique)</span><span className="font-medium" style={{ color: "var(--text)" }}>{totalViewers.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>From followers</span><span className="font-medium" style={{ color: "var(--text)" }}>11.8%</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>From non-followers</span><span className="font-medium" style={{ color: "var(--text)" }}>88.2%</span></div>
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Interactions</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-bold" style={{ color: "var(--text)" }}>{totalInteractions.toLocaleString()}</span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--success)" }}>↑ 1.0K%</span>
          </div>
          <div className="mt-3 mb-3"><SparklineChart data={[2, 3, 4, 5, 8, 50, 180, 350]} color="#14B8A6" height={32} /></div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Reactions</span><span className="font-medium" style={{ color: "var(--text)" }}>{totalReactions.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Comments</span><span className="font-medium" style={{ color: "var(--text)" }}>{totalComments.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Shares</span><span className="font-medium" style={{ color: "var(--text)" }}>{totalShares.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Clicks & Earnings</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-bold" style={{ color: "var(--text)" }}>{totalClicks.toLocaleString()}</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>total clicks</span>
          </div>
          <div className="mt-3 mb-3"><SparklineChart data={[1, 2, 1, 3, 4, 30, 100, 400]} color="#F59E0B" height={32} /></div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Photo clicks</span><span className="font-medium" style={{ color: "var(--text)" }}>{photoClicks.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Other clicks</span><span className="font-medium" style={{ color: "var(--text)" }}>{otherClicks.toLocaleString()}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Approx. earnings</span><span className="font-semibold" style={{ color: "var(--success)" }}>${earnings.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {/* Video/Reels */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-muted)" }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Videos & Reels</span>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>{Math.round(90 * mult * periodMult)}</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>3-second views</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--error)" }}>↓ 67.6%</div>
          </div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>{period === "7d" ? "4m 12s" : period === "28d" ? "15m 23s" : "48m 10s"}</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Watch time</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--error)" }}>↓ 71.5%</div>
          </div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>0:42</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Avg watch time</div>
          </div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: "var(--text)" }}>$0.00</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Reels earnings</div>
          </div>
        </div>
      </div>

      {/* Reactions Breakdown */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Reactions Breakdown</div>
        <div className="flex items-center gap-6">
          {[
            { emoji: "👍", label: "Like", count: Math.round(1420 * mult * periodMult), pct: 64 },
            { emoji: "❤️", label: "Love", count: Math.round(445 * mult * periodMult), pct: 20 },
            { emoji: "😂", label: "Haha", count: Math.round(89 * mult * periodMult), pct: 4 },
            { emoji: "😮", label: "Wow", count: Math.round(178 * mult * periodMult), pct: 8 },
            { emoji: "😢", label: "Sad", count: Math.round(67 * mult * periodMult), pct: 3 },
            { emoji: "😡", label: "Angry", count: Math.round(20 * mult * periodMult), pct: 1 },
          ].map((r) => (
            <div key={r.label} className="flex-1 text-center">
              <div className="text-2xl mb-1">{r.emoji}</div>
              <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{r.count.toLocaleString()}</div>
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
          <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
            Recent Posts
            <span className="ml-2 text-[11px] font-normal" style={{ color: "var(--text-muted)" }}>
              {filteredPosts.length} posts
            </span>
          </h3>
          <select
            value={postFilter}
            onChange={(e) => setPostFilter(e.target.value)}
            className="text-[12px] px-3 py-1.5 rounded-lg border outline-none"
            style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text-secondary)" }}
          >
            <option value="all">All types ({allPosts.length})</option>
            <option value="photo">Photos ({allPosts.filter(p => p.type === "Photo").length})</option>
            <option value="reel">Reels ({allPosts.filter(p => p.type === "Reel").length})</option>
          </select>
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
              {filteredPosts.map((post, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: post.type === "Reel" ? "rgba(236, 72, 153, 0.12)" : "var(--surface-active)" }}>
                        {post.type === "Reel" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#F472B6" }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        )}
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
                    <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: post.type === "Reel" ? "rgba(236, 72, 153, 0.12)" : "var(--surface-active)", color: post.type === "Reel" ? "#F472B6" : "var(--text-muted)" }}>{post.type}</span>
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

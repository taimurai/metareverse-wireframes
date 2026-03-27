"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

const recentPosts = [
  { caption: "Did you know ancient Egyptians invented toothpaste?", type: "image", date: "Dec 14", views: "2.4M", engagement: "5.8%", shares: "12.4K", revenue: "$892", status: "published" },
  { caption: "The most devastating volcanic eruption in recorded history...", type: "video", date: "Dec 13", views: "4.1M", engagement: "7.2%", shares: "28.1K", revenue: "$1,420", status: "published" },
  { caption: "Why the Titanic sank: New evidence reveals...", type: "image", date: "Dec 12", views: "1.8M", engagement: "4.1%", shares: "8.2K", revenue: "$645", status: "published" },
  { caption: "5 ancient civilizations that mysteriously vanished...", type: "image", date: "Dec 11", views: "3.2M", engagement: "6.5%", shares: "18.9K", revenue: "$1,105", status: "published" },
  { caption: "The real story behind the Bermuda Triangle", type: "video", date: "Dec 10", views: "5.6M", engagement: "8.1%", shares: "34.2K", revenue: "$1,890", status: "published" },
  { caption: "History's greatest unsolved mysteries: Part 3", type: "image", date: "Dec 9", views: "1.2M", engagement: "3.4%", shares: "5.8K", revenue: "$410", status: "partial" },
];

export default function PageReport() {
  const [period, setPeriod] = useState("7d");

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link href="/reports" className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Reports</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><polyline points="9 18 15 12 9 6"/></svg>
        <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>History Uncovered</span>
      </div>

      <Header
        title="History Uncovered"
        subtitle="History & Facts &middot; 2.4M followers &middot; FB + IG + Threads"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
              {["7d", "30d", "90d"].map((p) => (
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

      {/* Revenue + Performance Hero */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Revenue Card */}
        <div className="rounded-xl border p-5 relative overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="absolute top-0 right-0 w-48 h-full opacity-[0.06]" style={{ background: "radial-gradient(circle at top right, var(--success), transparent 70%)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Revenue</span>
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>Monetized</span>
            </div>
            <div className="text-[28px] font-bold tracking-tight" style={{ color: "var(--text)" }}>$3,842</div>
            <div className="text-[13px] mt-0.5" style={{ color: "var(--text-secondary)" }}>this week</div>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>RPM</div>
                <div className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>$9.12</div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>This month</div>
                <div className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>$14,280</div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Change</div>
                <div className="text-[15px] font-semibold" style={{ color: "var(--success)" }}>+18%</div>
              </div>
            </div>
            {/* Mini chart */}
            <div className="mt-4 h-16 rounded-lg flex items-end gap-0.5 px-1" style={{ backgroundColor: "var(--bg)" }}>
              {[30, 45, 35, 52, 48, 65, 58, 72, 68, 78, 74, 88, 82, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i >= 12 ? "var(--success)" : "rgba(74, 222, 128, 0.25)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Performance</div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Views", value: "18.2M", change: "+12%", up: true },
              { label: "Engagement", value: "4.2%", change: "+0.4%", up: true },
              { label: "Reach", value: "12.1M", change: "+8%", up: true },
              { label: "Shares", value: "45.2K", change: "+15%", up: true },
              { label: "Comments", value: "18.4K", change: "+22%", up: true },
              { label: "Posts", value: "284", change: "+6%", up: true },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                <div>
                  <div className="text-[16px] font-bold tabular-nums" style={{ color: "var(--text)" }}>{m.value}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{m.label}</div>
                </div>
                <span className="text-[11px] font-semibold" style={{ color: m.up ? "var(--success)" : "var(--error)" }}>{m.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reactions Breakdown */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Reactions Breakdown</div>
        <div className="flex items-center gap-6">
          {[
            { emoji: "👍", label: "Like", count: "842K", pct: 62 },
            { emoji: "❤️", label: "Love", count: "245K", pct: 18 },
            { emoji: "😂", label: "Haha", count: "124K", pct: 9 },
            { emoji: "😮", label: "Wow", count: "89K", pct: 7 },
            { emoji: "😢", label: "Sad", count: "32K", pct: 2 },
            { emoji: "😡", label: "Angry", count: "18K", pct: 1 },
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
          <select className="text-[12px] px-3 py-1.5 rounded-lg border outline-none" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text-secondary)" }}>
            <option>All types</option>
            <option>Images</option>
            <option>Videos</option>
          </select>
        </div>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
              <th className="px-5 py-3 font-medium">Post</th>
              <th className="px-5 py-3 font-medium text-right">Views</th>
              <th className="px-5 py-3 font-medium text-right">Engagement</th>
              <th className="px-5 py-3 font-medium text-right">Shares</th>
              <th className="px-5 py-3 font-medium text-right">Revenue</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map((post, i) => (
              <tr key={i} className="group" style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: post.type === "image" ? "rgba(99, 102, 241, 0.12)" : "rgba(236, 72, 153, 0.12)" }}>
                      {post.type === "image" ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#818CF8" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#F472B6" }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      )}
                    </div>
                    <div>
                      <div className="text-[12px] font-medium line-clamp-1" style={{ color: "var(--text)" }}>{post.caption}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{post.date} &middot; {post.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{post.views}</td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{post.engagement}</td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{post.shares}</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums" style={{ color: "var(--success)" }}>{post.revenue}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{
                    backgroundColor: post.status === "published" ? "var(--success-bg)" : "var(--warning-bg)",
                    color: post.status === "published" ? "var(--success)" : "var(--warning)",
                  }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: post.status === "published" ? "var(--success)" : "var(--warning)" }} />
                    {post.status === "published" ? "Published" : "Partial"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

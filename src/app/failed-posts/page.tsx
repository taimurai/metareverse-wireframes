"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type FailReason = "token_expired" | "rate_limit" | "image_rejected" | "api_error" | "network_timeout" | "duplicate_content";

interface FailedPost {
  id: string;
  caption: string;
  page: { name: string; avatar: string; color: string };
  platforms: string[];
  scheduledAt: string;
  failedAt: string;
  reason: FailReason;
  reasonDetail: string;
  retryCount: number;
  type: "photo" | "reel" | "text";
  selected?: boolean;
}

const REASON_MAP: Record<FailReason, { label: string; color: string; icon: string; fix: string }> = {
  token_expired: { label: "Token Expired", color: "#EF4444", icon: "🔑", fix: "Reconnect page to refresh token" },
  rate_limit: { label: "Rate Limited", color: "#F59E0B", icon: "⏳", fix: "Auto-retry in 15 minutes" },
  image_rejected: { label: "Image Rejected", color: "#EF4444", icon: "🖼️", fix: "Image violates Meta content policy — replace media" },
  api_error: { label: "API Error", color: "#EF4444", icon: "⚠️", fix: "Meta API returned an error — retry or contact support" },
  network_timeout: { label: "Timeout", color: "#F59E0B", icon: "🌐", fix: "Network timeout — safe to retry" },
  duplicate_content: { label: "Duplicate", color: "#6366F1", icon: "📋", fix: "Meta flagged as duplicate — edit caption before retrying" },
};

const FAILED_POSTS: FailedPost[] = [
  {
    id: "f1", caption: "The $5 coffee habit is NOT why you're broke. Here's the real math...",
    page: { name: "Money Matters", avatar: "MM", color: "#F59E0B" },
    platforms: ["facebook", "instagram"], scheduledAt: "Today, 3:00 PM", failedAt: "Today, 3:01 PM",
    reason: "token_expired", reasonDetail: "Page access token expired on Mar 15, 2026. Last refreshed 62 days ago.",
    retryCount: 0, type: "photo",
  },
  {
    id: "f2", caption: "3 ancient civilizations that disappeared overnight — and nobody knows why...",
    page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
    platforms: ["facebook", "instagram", "threads"], scheduledAt: "Yesterday, 11:00 PM", failedAt: "Yesterday, 11:01 PM",
    reason: "rate_limit", reasonDetail: "Meta API rate limit exceeded. 200/200 calls used in the last hour.",
    retryCount: 2, type: "photo",
  },
  {
    id: "f3", caption: "This workout trick burns 3x more calories — but trainers won't tell you...",
    page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" },
    platforms: ["facebook"], scheduledAt: "Yesterday, 7:30 PM", failedAt: "Yesterday, 7:31 PM",
    reason: "image_rejected", reasonDetail: "Image contains text covering >20% of the image area. Meta advertising policy violation.",
    retryCount: 0, type: "photo",
  },
  {
    id: "f4", caption: "POV: Your code works on the first try but you don't trust it...",
    page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" },
    platforms: ["facebook", "instagram"], scheduledAt: "Mar 25, 5:00 PM", failedAt: "Mar 25, 5:02 PM",
    reason: "api_error", reasonDetail: "Meta Graph API returned 500 Internal Server Error. OAuthException code 2.",
    retryCount: 1, type: "reel",
  },
  {
    id: "f5", caption: "5 signs your body is dehydrated — #3 will surprise you...",
    page: { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" },
    platforms: ["facebook"], scheduledAt: "Mar 25, 1:00 PM", failedAt: "Mar 25, 1:00 PM",
    reason: "network_timeout", reasonDetail: "Connection timed out after 30s. Media upload incomplete.",
    retryCount: 3, type: "photo",
  },
  {
    id: "f6", caption: "The forgotten queen who ruled an empire for 40 years — and history erased her...",
    page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
    platforms: ["facebook", "instagram"], scheduledAt: "Mar 24, 9:00 AM", failedAt: "Mar 24, 9:01 AM",
    reason: "duplicate_content", reasonDetail: "Meta detected substantially similar content posted to this page in the last 24 hours.",
    retryCount: 0, type: "photo",
  },
  {
    id: "f7", caption: "Apple just leaked their next chip — and it's not what anyone expected...",
    page: { name: "TechByte", avatar: "TB", color: "#14B8A6" },
    platforms: ["facebook", "instagram", "threads"], scheduledAt: "Mar 24, 7:00 PM", failedAt: "Mar 24, 7:01 PM",
    reason: "api_error", reasonDetail: "Meta Graph API error: (#100) Unsupported post request. Object with ID does not exist.",
    retryCount: 0, type: "photo",
  },
];

export default function FailedPosts() {
  const [posts, setPosts] = useState(FAILED_POSTS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterReason, setFilterReason] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());

  const filteredPosts = filterReason === "all" ? posts : posts.filter(p => p.reason === filterReason);

  const reasonCounts = posts.reduce((acc, p) => {
    acc[p.reason] = (acc[p.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPosts.map(p => p.id)));
    }
  };

  const handleRetry = (id: string) => {
    setRetryingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setPosts(prev => prev.filter(p => p.id !== id));
      setRetryingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }, 1500);
  };

  const handleRetrySelected = () => {
    selectedIds.forEach(id => handleRetry(id));
  };

  const handleDismiss = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const tokenExpiredCount = posts.filter(p => p.reason === "token_expired").length;
  const retryableCount = posts.filter(p => ["rate_limit", "network_timeout", "api_error"].includes(p.reason)).length;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[240px]">
        <Header />
        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[28px] font-bold" style={{ color: "var(--text)" }}>Failed Posts</h1>
                <span className="text-sm px-2.5 py-1 rounded-full font-semibold text-red-400 bg-red-400/10">
                  {posts.length}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Posts that failed to publish — retry or dismiss</p>
            </div>
            {selectedIds.size > 0 && (
              <div className="flex gap-2">
                <button onClick={handleRetrySelected} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                  ↻ Retry Selected ({selectedIds.size})
                </button>
                <button onClick={() => { selectedIds.forEach(id => handleDismiss(id)); }} className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
                  Dismiss Selected
                </button>
              </div>
            )}
          </div>

          {/* Alert Banners */}
          {tokenExpiredCount > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-4 border" style={{ backgroundColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
              <span className="text-lg">🔑</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-red-400">{tokenExpiredCount} post{tokenExpiredCount > 1 ? "s" : ""} failed due to expired tokens</span>
                <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>Reconnect the affected pages to retry these posts</span>
              </div>
              <a href="/settings/pages" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 border border-red-400/30 hover:bg-red-400/10">
                Go to Page Settings
              </a>
            </div>
          )}

          {retryableCount > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-6 border" style={{ backgroundColor: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.2)" }}>
              <span className="text-lg">⚡</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-amber-400">{retryableCount} post{retryableCount > 1 ? "s" : ""} can be auto-retried</span>
                <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>Rate limits, timeouts, and API errors are usually temporary</span>
              </div>
              <button onClick={() => {
                posts.filter(p => ["rate_limit", "network_timeout", "api_error"].includes(p.reason)).forEach(p => handleRetry(p.id));
              }} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10">
                Retry All Safe
              </button>
            </div>
          )}

          {/* Reason Filter Pills */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilterReason("all")}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: filterReason === "all" ? "var(--primary)" : "var(--surface)",
                color: filterReason === "all" ? "white" : "var(--text-muted)",
              }}
            >
              All {posts.length}
            </button>
            {Object.entries(REASON_MAP).map(([key, { label, icon }]) => {
              const count = reasonCounts[key] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setFilterReason(filterReason === key ? "all" : key)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: filterReason === key ? "var(--surface-hover)" : "var(--surface)",
                    color: filterReason === key ? "var(--text)" : "var(--text-muted)",
                  }}
                >
                  {icon} {label} {count}
                </button>
              );
            })}
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="rounded-xl border p-16 text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-lg" style={{ color: "var(--text)" }}>No failed posts</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>All posts published successfully</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              {/* Table Header */}
              <div className="grid items-center px-4 py-3 text-[11px] font-semibold uppercase tracking-wider border-b"
                style={{ gridTemplateColumns: "40px 1fr 160px 120px 140px 100px 80px", borderColor: "var(--border)", color: "var(--text-muted)" }}>
                <div>
                  <input type="checkbox" checked={selectedIds.size === filteredPosts.length && filteredPosts.length > 0} onChange={selectAll}
                    className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: "var(--primary)" }} />
                </div>
                <div>Post</div>
                <div>Page</div>
                <div>Reason</div>
                <div>Failed At</div>
                <div>Retries</div>
                <div></div>
              </div>

              {/* Rows */}
              {filteredPosts.map(post => {
                const reason = REASON_MAP[post.reason];
                const isRetrying = retryingIds.has(post.id);
                const isExpanded = expandedId === post.id;

                return (
                  <div key={post.id}>
                    <div
                      className="grid items-center px-4 py-3 border-b cursor-pointer transition-colors hover:brightness-110"
                      style={{
                        gridTemplateColumns: "40px 1fr 160px 120px 140px 100px 80px",
                        borderColor: "var(--border)",
                        backgroundColor: isRetrying ? "rgba(74,222,128,0.05)" : selectedIds.has(post.id) ? "var(--surface-hover)" : "transparent",
                        opacity: isRetrying ? 0.6 : 1,
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    >
                      <div onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedIds.has(post.id)} onChange={() => toggleSelect(post.id)}
                          className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: "var(--primary)" }} />
                      </div>

                      {/* Post */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm flex-shrink-0">
                          {post.type === "photo" ? "📷" : post.type === "reel" ? "🎬" : "📝"}
                        </span>
                        <span className="text-sm truncate" style={{ color: "var(--text)" }}>{post.caption}</span>
                      </div>

                      {/* Page */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: post.page.color }}>
                          {post.page.avatar}
                        </div>
                        <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{post.page.name}</span>
                      </div>

                      {/* Reason */}
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${reason.color}15`, color: reason.color }}>
                          {reason.icon} {reason.label}
                        </span>
                      </div>

                      {/* Failed At */}
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.failedAt}</span>

                      {/* Retries */}
                      <span className="text-xs" style={{ color: post.retryCount > 0 ? "var(--text)" : "var(--text-muted)" }}>
                        {post.retryCount > 0 ? `${post.retryCount}× retried` : "—"}
                      </span>

                      {/* Actions */}
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        {isRetrying ? (
                          <span className="text-xs text-green-400 font-medium">Retrying...</span>
                        ) : (
                          <>
                            <button onClick={() => handleRetry(post.id)} className="p-1.5 rounded-lg text-xs hover:bg-green-400/10 text-green-400" title="Retry">
                              ↻
                            </button>
                            <button onClick={() => handleDismiss(post.id)} className="p-1.5 rounded-lg text-xs hover:bg-red-400/10 text-red-400" title="Dismiss">
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && !isRetrying && (
                      <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-hover)" }}>
                        <div className="grid grid-cols-[1fr_1fr] gap-6 ml-10">
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Error Details</div>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{post.reasonDetail}</p>
                            <div className="mt-3 p-2.5 rounded-lg border" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}>
                              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Suggested Fix</div>
                              <p className="text-xs" style={{ color: reason.color }}>{reason.fix}</p>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Post Details</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span style={{ color: "var(--text-muted)" }}>Originally scheduled</span>
                                <span style={{ color: "var(--text)" }}>{post.scheduledAt}</span>
                              </div>
                              <div className="flex justify-between">
                                <span style={{ color: "var(--text-muted)" }}>Target platforms</span>
                                <div className="flex gap-1">
                                  {post.platforms.map(p => (
                                    <span key={p} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
                                      {p === "facebook" ? "FB" : p === "instagram" ? "IG" : "TH"}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span style={{ color: "var(--text-muted)" }}>Type</span>
                                <span style={{ color: "var(--text)" }}>{post.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span style={{ color: "var(--text-muted)" }}>Retry attempts</span>
                                <span style={{ color: "var(--text)" }}>{post.retryCount}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button onClick={() => handleRetry(post.id)} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                                ↻ Retry Now
                              </button>
                              <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
                                Edit Post
                              </button>
                              <button onClick={() => handleDismiss(post.id)} className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 border border-red-400/30">
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

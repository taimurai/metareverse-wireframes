"use client";
import { useState } from "react";
import Header from "@/components/Header";

type FailCategory = "retry" | "reconnect" | "edit";

interface FailedPost {
  id: string;
  caption: string;
  page: { name: string; avatar: string; color: string };
  platforms: string[];
  scheduledAt: string;
  failedAt: string;
  category: FailCategory;
  message: string;
  type: "photo" | "reel" | "text";
}

const CATEGORY_INFO: Record<FailCategory, { label: string; color: string; action: string; actionLabel: string }> = {
  retry: { label: "Temporary issue", color: "#F59E0B", action: "retry", actionLabel: "Retry" },
  reconnect: { label: "Reconnect needed", color: "#EF4444", action: "reconnect", actionLabel: "Reconnect" },
  edit: { label: "Needs editing", color: "#8B5CF6", action: "edit", actionLabel: "Edit & Requeue" },
};

const FAILED_POSTS: FailedPost[] = [
  {
    id: "f1", caption: "The $5 coffee habit is NOT why you're broke. Here's the real math...",
    page: { name: "Money Matters", avatar: "MM", color: "#F59E0B" },
    platforms: ["facebook", "instagram"], scheduledAt: "Today, 3:00 PM", failedAt: "Today, 3:01 PM",
    category: "reconnect", message: "Your page connection has expired. Reconnect to retry.",
    type: "photo",
  },
  {
    id: "f2", caption: "3 ancient civilizations that disappeared overnight — and nobody knows why...",
    page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
    platforms: ["facebook", "instagram", "threads"], scheduledAt: "Yesterday, 11:00 PM", failedAt: "Yesterday, 11:01 PM",
    category: "retry", message: "Temporary issue with publishing. Safe to retry.",
    type: "photo",
  },
  {
    id: "f3", caption: "This workout trick burns 3x more calories — but trainers won't tell you...",
    page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" },
    platforms: ["facebook"], scheduledAt: "Yesterday, 7:30 PM", failedAt: "Yesterday, 7:31 PM",
    category: "edit", message: "Image didn't meet platform guidelines. Edit the media and requeue.",
    type: "photo",
  },
  {
    id: "f4", caption: "POV: Your code works on the first try but you don't trust it...",
    page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" },
    platforms: ["facebook", "instagram"], scheduledAt: "Mar 25, 5:00 PM", failedAt: "Mar 25, 5:02 PM",
    category: "retry", message: "Temporary issue with publishing. Safe to retry.",
    type: "reel",
  },
  {
    id: "f5", caption: "5 signs your body is dehydrated — #3 will surprise you...",
    page: { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" },
    platforms: ["facebook"], scheduledAt: "Mar 25, 1:00 PM", failedAt: "Mar 25, 1:00 PM",
    category: "retry", message: "Upload timed out. Safe to retry.",
    type: "photo",
  },
  {
    id: "f6", caption: "The forgotten queen who ruled an empire for 40 years — and history erased her...",
    page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
    platforms: ["facebook", "instagram"], scheduledAt: "Mar 24, 9:00 AM", failedAt: "Mar 24, 9:01 AM",
    category: "edit", message: "Very similar content was recently posted. Edit the caption and requeue.",
    type: "photo",
  },
  {
    id: "f7", caption: "Apple just leaked their next chip — and it's not what anyone expected...",
    page: { name: "TechByte", avatar: "TB", color: "#14B8A6" },
    platforms: ["facebook", "instagram", "threads"], scheduledAt: "Mar 24, 7:00 PM", failedAt: "Mar 24, 7:01 PM",
    category: "retry", message: "Temporary issue with publishing. Safe to retry.",
    type: "photo",
  },
];

export default function FailedPosts() {
  const [posts, setPosts] = useState(FAILED_POSTS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterCat, setFilterCat] = useState<string>("all");
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  const filteredPosts = simulateEmpty ? [] : (filterCat === "all" ? posts : posts.filter(p => p.category === filterCat));

  const catCounts = posts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
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
    }, 1200);
  };

  const handleMoveToDrafts = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const reconnectCount = catCounts["reconnect"] || 0;
  const retryCount = catCounts["retry"] || 0;

  return (
    <div className="flex flex-col">
        <Header />
        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
          {/* Wireframe toggle */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setSimulateEmpty(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border"
              style={{ backgroundColor: simulateEmpty ? "var(--primary-muted)" : "var(--surface)", color: simulateEmpty ? "var(--primary)" : "var(--text-muted)", borderColor: simulateEmpty ? "var(--primary)" : "var(--border)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
              {simulateEmpty ? "Showing empty state" : "Preview empty state"}
            </button>
          </div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[28px] font-bold" style={{ color: "var(--text)" }}>Failed Posts</h1>
                {posts.length > 0 && (
                  <span className="text-sm px-2.5 py-1 rounded-full font-semibold text-red-400 bg-red-400/10">
                    {posts.length}
                  </span>
                )}
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Posts that couldn&apos;t be published</p>
            </div>
            {selectedIds.size > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => { selectedIds.forEach(id => { const p = posts.find(x => x.id === id); if (p?.category === "retry") handleRetry(id); }); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Retry Selected ({[...selectedIds].filter(id => posts.find(p => p.id === id)?.category === "retry").length})
                </button>
                <button
                  onClick={() => { selectedIds.forEach(id => handleMoveToDrafts(id)); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium border"
                  style={{ backgroundColor: "transparent", color: "var(--text-muted)", borderColor: "var(--border)" }}
                >
                  Move to Drafts
                </button>
              </div>
            )}
          </div>

          {/* Alert Banners */}
          {reconnectCount > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-3 border" style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-red-400/15">🔑</div>
              <div className="flex-1">
                <span className="text-sm font-medium text-red-400">{reconnectCount} post{reconnectCount > 1 ? "s" : ""} need page reconnection</span>
                <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>Reconnect the affected pages, then retry</span>
              </div>
              <a href="/settings/pages" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Go to Page Settings
              </a>
            </div>
          )}

          {retryCount > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-6 border" style={{ backgroundColor: "rgba(251,191,36,0.06)", borderColor: "rgba(251,191,36,0.2)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-amber-400/15">⚡</div>
              <div className="flex-1">
                <span className="text-sm font-medium text-amber-400">{retryCount} post{retryCount > 1 ? "s" : ""} can be retried now</span>
                <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>These were temporary issues — safe to retry</span>
              </div>
              <button
                onClick={() => { posts.filter(p => p.category === "retry").forEach(p => handleRetry(p.id)); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 transition-colors"
              >
                Retry All
              </button>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex gap-2 mb-5">
            {[
              { key: "all", label: "All", count: posts.length },
              { key: "retry", label: "Can retry", count: catCounts["retry"] || 0 },
              { key: "reconnect", label: "Needs reconnect", count: catCounts["reconnect"] || 0 },
              { key: "edit", label: "Needs editing", count: catCounts["edit"] || 0 },
            ].filter(f => f.count > 0 || f.key === "all").map(f => (
              <button
                key={f.key}
                onClick={() => setFilterCat(filterCat === f.key ? "all" : f.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  backgroundColor: filterCat === f.key ? "var(--primary)" : "var(--surface)",
                  color: filterCat === f.key ? "white" : "var(--text-muted)",
                }}
              >
                {f.label} {f.count}
              </button>
            ))}
          </div>

          {/* Posts */}
          {filteredPosts.length === 0 ? (
            <div className="rounded-xl border flex flex-col items-center justify-center py-20 text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(74,222,128,0.1)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-[16px] font-semibold mb-1" style={{ color: "var(--text)" }}>All clear</p>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>No failed posts right now — everything published successfully</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPosts.map(post => {
                const cat = CATEGORY_INFO[post.category];
                const isRetrying = retryingIds.has(post.id);

                return (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                    style={{
                      backgroundColor: isRetrying ? "rgba(74,222,128,0.05)" : selectedIds.has(post.id) ? "var(--surface-hover)" : "var(--surface)",
                      borderColor: selectedIds.has(post.id) ? "var(--primary)" : "var(--border)",
                      opacity: isRetrying ? 0.5 : 1,
                    }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(post.id)}
                      onChange={() => toggleSelect(post.id)}
                      className="w-4 h-4 rounded cursor-pointer flex-shrink-0"
                      style={{ accentColor: "var(--primary)" }}
                    />

                    {/* Type icon */}
                    <span className="text-base flex-shrink-0">
                      {post.type === "photo" ? "📷" : post.type === "reel" ? "🎬" : "📝"}
                    </span>

                    {/* Caption */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: "var(--text)" }}>{post.caption}</p>
                      <p className="text-xs mt-1" style={{ color: cat.color }}>{post.message}</p>
                    </div>

                    {/* Page */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: post.page.color }}>
                        {post.page.avatar}
                      </div>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.page.name}</span>
                    </div>

                    {/* Platforms */}
                    <div className="flex gap-1 flex-shrink-0">
                      {post.platforms.map(p => (
                        <span key={p} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                          {p === "facebook" ? "FB" : p === "instagram" ? "IG" : "TH"}
                        </span>
                      ))}
                    </div>

                    {/* Time */}
                    <span className="text-xs flex-shrink-0 w-[100px] text-right" style={{ color: "var(--text-muted)" }}>{post.failedAt}</span>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {isRetrying ? (
                        <span className="text-xs text-green-400 font-medium w-[120px] text-center">Retrying...</span>
                      ) : (
                        <>
                          {post.category === "retry" && (
                            <button onClick={() => handleRetry(post.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                              Retry
                            </button>
                          )}
                          {post.category === "reconnect" && (
                            <a href="/settings/pages" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500">
                              Reconnect
                            </a>
                          )}
                          {post.category === "edit" && (
                            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "#8B5CF6" }}>
                              Edit & Requeue
                            </button>
                          )}
                          <button onClick={() => handleMoveToDrafts(post.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                            Move to Drafts
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer summary */}
          {posts.length > 0 && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="flex gap-4">
                <button onClick={selectAll} className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                  {selectedIds.size === filteredPosts.length ? "Deselect all" : "Select all"}
                </button>
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {posts.length} failed · {catCounts["retry"] || 0} retryable · {catCounts["reconnect"] || 0} need reconnect · {catCounts["edit"] || 0} need editing
              </span>
            </div>
          )}
        </main>
    </div>
  );
}

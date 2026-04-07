"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { useRole } from "@/contexts/RoleContext";

type FailCategory = "retry" | "reconnect" | "edit";
type ViewMode = "compact" | "visual";

interface FailedPost {
  id: string;
  caption: string;
  publisherId?: string;
  page: { name: string; avatar: string; color: string };
  platforms: string[];
  scheduledAt: string;
  failedAt: string;
  category: FailCategory;
  message: string;
  type: "photo" | "reel" | "text";
}

const CATEGORY_INFO: Record<FailCategory, { label: string; color: string; action: string; actionLabel: string }> = {
  retry:     { label: "Temporary issue",    color: "#F59E0B", action: "retry",     actionLabel: "Retry"        },
  reconnect: { label: "Reconnect needed",   color: "#EF4444", action: "reconnect", actionLabel: "Reconnect"    },
  edit:      { label: "Needs editing",      color: "#8B5CF6", action: "edit",      actionLabel: "Edit & Requeue" },
};

const FAILED_POSTS: FailedPost[] = [
  { id: "f1", caption: "The $5 coffee habit is NOT why you're broke. Here's the real math...",
    page: { name: "Money Matters", avatar: "MM", color: "#F59E0B" }, platforms: ["facebook","instagram"],
    scheduledAt: "Today, 3:00 PM", failedAt: "Today, 3:01 PM", category: "reconnect",
    message: "Your page connection has expired. Reconnect to retry.", type: "photo" },
  { id: "f2", caption: "3 ancient civilizations that disappeared overnight — and nobody knows why...",
    page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" }, platforms: ["facebook","instagram","threads"],
    scheduledAt: "Yesterday, 11:00 PM", failedAt: "Yesterday, 11:01 PM", category: "retry",
    message: "Temporary issue with publishing. Safe to retry.", type: "photo", publisherId: "sarah" },
  { id: "f3", caption: "This workout trick burns 3x more calories — but trainers won't tell you...",
    page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" }, platforms: ["facebook"],
    scheduledAt: "Yesterday, 7:30 PM", failedAt: "Yesterday, 7:31 PM", category: "edit",
    message: "Image didn't meet platform guidelines. Edit the media and requeue.", type: "photo", publisherId: "ahmed" },
  { id: "f4", caption: "POV: Your code works on the first try but you don't trust it...",
    page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" }, platforms: ["facebook","instagram"],
    scheduledAt: "Mar 25, 5:00 PM", failedAt: "Mar 25, 5:02 PM", category: "retry",
    message: "Temporary issue with publishing. Safe to retry.", type: "reel" },
  { id: "f5", caption: "5 signs your body is dehydrated — #3 will surprise you...",
    page: { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" }, platforms: ["facebook"],
    scheduledAt: "Mar 25, 1:00 PM", failedAt: "Mar 25, 1:00 PM", category: "retry",
    message: "Upload timed out. Safe to retry.", type: "photo" },
  { id: "f6", caption: "The forgotten queen who ruled an empire for 40 years — and history erased her...",
    page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" }, platforms: ["facebook","instagram"],
    scheduledAt: "Mar 24, 9:00 AM", failedAt: "Mar 24, 9:01 AM", category: "edit",
    message: "Very similar content was recently posted. Edit the caption and requeue.", type: "photo" },
  { id: "f7", caption: "Apple just leaked their next chip — and it's not what anyone expected...",
    page: { name: "TechByte", avatar: "TB", color: "#14B8A6" }, platforms: ["facebook","instagram","threads"],
    scheduledAt: "Mar 24, 7:00 PM", failedAt: "Mar 24, 7:01 PM", category: "retry",
    message: "Temporary issue with publishing. Safe to retry.", type: "photo" },
];

const ALL_PAGES = [
  { name: "Money Matters",   avatar: "MM", color: "#F59E0B", followers: "156K" },
  { name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "284K" },
  { name: "Fitness Factory", avatar: "FF", color: "#EC4899", followers: "198K" },
  { name: "Laugh Central",   avatar: "LC", color: "#8B5CF6", followers: "512K" },
  { name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "227K" },
  { name: "TechByte",        avatar: "TB", color: "#14B8A6", followers: "341K" },
];

const CURRENT_USER_ID = "sarah";

export default function FailedPosts() {
  const { role } = useRole();
  const initialPosts = role === "publisher"
    ? FAILED_POSTS.filter(p => p.publisherId === CURRENT_USER_ID)
    : FAILED_POSTS;
  const [posts, setPosts] = useState(initialPosts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterCat, setFilterCat] = useState<string>("all");
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());
  const [retryToast, setRetryToast] = useState<{ succeeded: number; failed: number } | null>(null);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  // New state
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [groupBy, setGroupBy] = useState<"none" | "page">("none");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [pageFilterOpen, setPageFilterOpen] = useState(false);
  const [pageSearch, setPageSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const catCounts = posts.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {} as Record<string, number>);

  const pageFilterActive = selectedPages.size > 0;
  const filteredPosts = simulateEmpty ? [] : posts
    .filter(p => filterCat === "all" ? true : p.category === filterCat)
    .filter(p => pageFilterActive ? selectedPages.has(p.page.name) : true);

  // Groups for group-by-page
  const pageGroups = groupBy === "page"
    ? ALL_PAGES
        .map(pg => ({ ...pg, posts: filteredPosts.filter(p => p.page.name === pg.name) }))
        .filter(g => g.posts.length > 0)
    : [];

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredPosts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredPosts.map(p => p.id)));
  };

  const handleRetry = (id: string) => {
    setRetryingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setPosts(prev => prev.filter(p => p.id !== id));
      setRetryingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }, 1200);
  };

  const handleBulkRetry = (ids: string[]) => {
    const retryable = ids.filter(id => posts.find(p => p.id === id)?.category === "retry");
    if (retryable.length === 0) return;
    retryable.forEach(id => setRetryingIds(prev => new Set(prev).add(id)));
    setTimeout(() => {
      // Simulate: all retryable succeed, non-retryable stay
      const succeeded = retryable.length;
      const stillFailing = ids.length - retryable.length;
      setPosts(prev => prev.filter(p => !retryable.includes(p.id)));
      setRetryingIds(prev => { const n = new Set(prev); retryable.forEach(id => n.delete(id)); return n; });
      setSelectedIds(new Set());
      setRetryToast({ succeeded, failed: stillFailing });
      setTimeout(() => setRetryToast(null), 4000);
    }, 1500);
  };

  const handleMoveToDrafts = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const togglePageFilter = (name: string) => {
    setSelectedPages(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  };

  const togglePageAccordion = (name: string) => {
    setExpandedPages(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  };

  const filteredPageSearch = ALL_PAGES.filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()));
  const pageFilterLabel = selectedPages.size === 0 ? "All Pages" : selectedPages.size === 1 ? [...selectedPages][0] : `${selectedPages.size} Pages`;

  const reconnectCount = catCounts["reconnect"] || 0;
  const retryCount = catCounts["retry"] || 0;

  return (
    <div className="flex flex-col">
      <Header />
      {/* Bulk retry summary toast */}
      {retryToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
          <span style={{ color: "#4ADE80" }}>✓ {retryToast.succeeded} succeeded</span>
          {retryToast.failed > 0 && <><span style={{ color: "var(--border)" }}>·</span><span style={{ color: "#EF4444" }}>{retryToast.failed} still failing</span></>}
        </div>
      )}
      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        {/* Wireframe toggle */}
        <div className="flex justify-end mb-2">
          <button onClick={() => setSimulateEmpty(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border"
            style={{ backgroundColor: simulateEmpty ? "var(--primary-muted)" : "var(--surface)", color: simulateEmpty ? "var(--primary)" : "var(--text-muted)", borderColor: simulateEmpty ? "var(--primary)" : "var(--border)" }}>
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
                <span className="text-sm px-2.5 py-1 rounded-full font-semibold text-red-400 bg-red-400/10">{posts.length}</span>
              )}
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Posts that couldn&apos;t be published</p>
          </div>
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkRetry([...selectedIds])}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--primary)" }}>
                Retry Selected ({[...selectedIds].filter(id => posts.find(p => p.id === id)?.category === "retry").length})
              </button>
              <button onClick={() => { selectedIds.forEach(id => handleMoveToDrafts(id)); }}
                className="px-4 py-2.5 rounded-lg text-sm font-medium border"
                style={{ backgroundColor: "transparent", color: "var(--text-muted)", borderColor: "var(--border)" }}>
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
            <a href="/settings/pages" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">Go to Page Settings</a>
          </div>
        )}
        {retryCount > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl mb-6 border" style={{ backgroundColor: "rgba(251,191,36,0.06)", borderColor: "rgba(251,191,36,0.2)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-amber-400/15">⚡</div>
            <div className="flex-1">
              <span className="text-sm font-medium text-amber-400">{retryCount} post{retryCount > 1 ? "s" : ""} can be retried now</span>
              <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>These were temporary issues — safe to retry</span>
            </div>
            <button onClick={() => handleBulkRetry(posts.filter(p => p.category === "retry").map(p => p.id))}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 transition-colors">
              Retry All
            </button>
          </div>
        )}

        {/* ── Controls ── */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {/* Category filter pills */}
          <div className="flex gap-2">
            {[
              { key: "all",       label: "All",             count: posts.length },
              { key: "retry",     label: "Can retry",       count: catCounts["retry"] || 0 },
              { key: "reconnect", label: "Needs reconnect", count: catCounts["reconnect"] || 0 },
              { key: "edit",      label: "Needs editing",   count: catCounts["edit"] || 0 },
            ].filter(f => f.count > 0 || f.key === "all").map(f => (
              <button key={f.key} onClick={() => setFilterCat(filterCat === f.key ? "all" : f.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{ backgroundColor: filterCat === f.key ? "var(--primary)" : "var(--surface)", color: filterCat === f.key ? "white" : "var(--text-muted)" }}>
                {f.label} {f.count}
              </button>
            ))}
          </div>

          {/* Page multi-select */}
          <div className="relative">
            <button onClick={() => setPageFilterOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-medium border transition-all"
              style={{ backgroundColor: "var(--surface)", color: pageFilterActive ? "var(--primary)" : "var(--text-secondary)", borderColor: pageFilterActive ? "var(--primary)" : "var(--border)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              {pageFilterLabel}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {pageFilterOpen && (
              <div className="absolute top-full mt-1 left-0 z-30 rounded-xl shadow-2xl overflow-hidden w-60"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="p-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <input value={pageSearch} onChange={e => setPageSearch(e.target.value)}
                    placeholder="Search pages..."
                    className="w-full px-3 py-1.5 rounded-lg text-[12px] outline-none"
                    style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)" }} />
                </div>
                <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => setSelectedPages(new Set())} className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>All</button>
                  <span style={{ color: "var(--border)" }}>·</span>
                  <button onClick={() => setSelectedPages(new Set(ALL_PAGES.map(p => p.name)))} className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>Select all</button>
                </div>
                <div className="max-h-44 overflow-y-auto py-1">
                  {filteredPageSearch.map(pg => (
                    <button key={pg.name} onClick={() => togglePageFilter(pg.name)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:opacity-80 transition-opacity">
                      <div className="w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: selectedPages.has(pg.name) ? "var(--primary)" : "transparent", borderColor: selectedPages.has(pg.name) ? "var(--primary)" : "var(--border)" }}>
                        {selectedPages.has(pg.name) && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: pg.color }}>{pg.avatar}</div>
                      <span className="text-[12px] flex-1 truncate" style={{ color: "var(--text)" }}>{pg.name}</span>
                    </button>
                  ))}
                </div>
                <div className="px-3 py-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => setPageFilterOpen(false)}
                    className="w-full py-1.5 rounded-lg text-[12px] font-medium"
                    style={{ backgroundColor: "var(--primary)", color: "white" }}>Done</button>
                </div>
              </div>
            )}
          </div>

          {/* Group by + View toggle — right side */}
          <div className="flex items-center gap-3 ml-auto">
            <select value={groupBy} onChange={e => setGroupBy(e.target.value as "none" | "page")}
              className="px-3 py-1.5 rounded-xl text-[12px]"
              style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)", outline: "none" }}>
              <option value="none">Group by: None</option>
              <option value="page">Group by: Page</option>
            </select>

            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <button onClick={() => setViewMode("compact")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all"
                style={{ backgroundColor: viewMode === "compact" ? "var(--surface-hover)" : "transparent", color: viewMode === "compact" ? "var(--text)" : "var(--text-muted)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                Compact
              </button>
              <button onClick={() => setViewMode("visual")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all"
                style={{ backgroundColor: viewMode === "visual" ? "var(--surface-hover)" : "transparent", color: viewMode === "visual" ? "var(--text)" : "var(--text-muted)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Visual
              </button>
            </div>
          </div>
        </div>

        {/* ── Posts ── */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-xl border flex flex-col items-center justify-center py-20 text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(74,222,128,0.1)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="text-[16px] font-semibold mb-1" style={{ color: "var(--text)" }}>All clear</p>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>No failed posts right now — everything published successfully</p>
          </div>
        ) : groupBy === "page" ? (
          /* ── Group by Page ── */
          <div className="space-y-2">
            {pageGroups.map(group => {
              const isExpanded = expandedPages.has(group.name);
              return (
                <div key={group.name} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                  <button onClick={() => togglePageAccordion(group.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "var(--surface-hover)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 transition-transform"
                      style={{ color: "var(--text-muted)", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: group.color }}>{group.avatar}</div>
                    <span className="text-[13px] font-semibold flex-1 text-left" style={{ color: "var(--text)" }}>{group.name}</span>
                    {/* Category breakdown badges */}
                    {(["retry","reconnect","edit"] as FailCategory[]).map(cat => {
                      const n = group.posts.filter(p => p.category === cat).length;
                      if (!n) return null;
                      return (
                        <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: `${CATEGORY_INFO[cat].color}18`, color: CATEGORY_INFO[cat].color }}>
                          {n} {cat}
                        </span>
                      );
                    })}
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium ml-1" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
                      {group.posts.length} total
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {group.posts.map(post => (
                        <FailedPostRow
                          key={post.id}
                          post={post}
                          viewMode={viewMode}
                          selected={selectedIds.has(post.id)}
                          isRetrying={retryingIds.has(post.id)}
                          onToggle={() => toggleSelect(post.id)}
                          onRetry={() => handleRetry(post.id)}
                          onMoveToDrafts={() => handleMoveToDrafts(post.id)}
                          editingId={editingId}
                          editingText={editingText}
                          onEditStart={(id, text) => { setEditingId(id); setEditingText(text); }}
                          onEditSave={() => setEditingId(null)}
                          onEditChange={setEditingText}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Flat list (compact or visual) ── */
          <div className="space-y-2">
            {filteredPosts.map(post => (
              <FailedPostRow
                key={post.id}
                post={post}
                viewMode={viewMode}
                selected={selectedIds.has(post.id)}
                isRetrying={retryingIds.has(post.id)}
                onToggle={() => toggleSelect(post.id)}
                onRetry={() => handleRetry(post.id)}
                onMoveToDrafts={() => handleMoveToDrafts(post.id)}
                editingId={editingId}
                editingText={editingText}
                onEditStart={(id, text) => { setEditingId(id); setEditingText(text); }}
                onEditSave={() => setEditingId(null)}
                onEditChange={setEditingText}
              />
            ))}
          </div>
        )}

        {/* Footer summary */}
        {posts.length > 0 && (
          <div className="flex items-center justify-between mt-6 px-2">
            <button onClick={selectAll} className="text-xs font-medium" style={{ color: "var(--primary)" }}>
              {selectedIds.size === filteredPosts.length ? "Deselect all" : "Select all"}
            </button>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {posts.length} failed · {catCounts["retry"] || 0} retryable · {catCounts["reconnect"] || 0} need reconnect · {catCounts["edit"] || 0} need editing
            </span>
          </div>
        )}
      </main>

      {/* Backdrop */}
      {pageFilterOpen && <div className="fixed inset-0 z-20" onClick={() => setPageFilterOpen(false)} />}
    </div>
  );
}

// ── FailedPostRow ─────────────────────────────────────────────────────────────
function FailedPostRow({
  post, viewMode, selected, isRetrying, onToggle, onRetry, onMoveToDrafts,
  editingId, editingText, onEditStart, onEditSave, onEditChange,
}: {
  post: FailedPost;
  viewMode: ViewMode;
  selected: boolean;
  isRetrying: boolean;
  onToggle: () => void;
  onRetry: () => void;
  onMoveToDrafts: () => void;
  editingId: string | null;
  editingText: string;
  onEditStart: (id: string, text: string) => void;
  onEditSave: () => void;
  onEditChange: (text: string) => void;
}) {
  const cat = CATEGORY_INFO[post.category];
  const isEditing = editingId === post.id;

  if (viewMode === "visual") {
    return (
      <div className="flex gap-4 p-4 rounded-xl border transition-all"
        style={{ backgroundColor: isRetrying ? "rgba(74,222,128,0.05)" : selected ? "var(--surface-hover)" : "var(--surface)", borderColor: selected ? "var(--primary)" : "var(--border)", opacity: isRetrying ? 0.5 : 1 }}>
        {/* Checkbox */}
        <div className="flex flex-col items-center gap-2 pt-1 flex-shrink-0">
          <input type="checkbox" checked={selected} onChange={onToggle}
            className="w-4 h-4 cursor-pointer" style={{ accentColor: "var(--primary)" }} />
        </div>
        {/* Thumbnail 1:1 */}
        <div className="w-[120px] h-[120px] rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: "var(--surface-hover)", border: `1px solid ${cat.color}40` }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: "var(--text-muted)", opacity: 0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {/* Error overlay badge */}
          <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: cat.color }}>
            {post.category === "retry"     && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>}
            {post.category === "reconnect" && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>}
            {post.category === "edit"      && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
          </div>
          {post.type === "reel" && (
            <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: "rgba(236,72,153,0.85)" }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div>
            {/* Page + platforms */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: post.page.color }}>{post.page.avatar}</div>
              <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{post.page.name}</span>
              <div className="flex gap-1 ml-1">
                {post.platforms.map(p => (
                  <span key={p} className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                    {p === "facebook" ? "FB" : p === "instagram" ? "IG" : "TH"}
                  </span>
                ))}
              </div>
            </div>
            {/* Caption — editable for "edit" category */}
            {post.category === "edit" && isEditing ? (
              <textarea
                autoFocus
                value={editingText}
                onChange={e => onEditChange(e.target.value)}
                onBlur={onEditSave}
                onKeyDown={e => { if (e.key === "Escape") onEditSave(); if (e.key === "Enter" && e.metaKey) onEditSave(); }}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-[13px] resize-none outline-none"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid #8B5CF6" }}
              />
            ) : (
              <p
                className={`text-[13px] leading-relaxed ${post.category === "edit" ? "cursor-text" : ""}`}
                style={{ color: "var(--text)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                onClick={() => { if (post.category === "edit") onEditStart(post.id, post.caption); }}
                title={post.category === "edit" ? "Click to edit caption" : undefined}
              >
                {post.caption}
              </p>
            )}
            {/* Error message */}
            <p className="text-[11px] mt-1.5 flex items-center gap-1.5" style={{ color: cat.color }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {post.message}
            </p>
            {post.category === "edit" && !isEditing && (
              <p className="text-[10px] mt-0.5" style={{ color: "#8B5CF6", opacity: 0.8 }}>Click caption to edit inline</p>
            )}
          </div>
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Scheduled: {post.scheduledAt} · Failed: {post.failedAt}
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col items-end justify-between flex-shrink-0">
          <div />
          {isRetrying ? (
            <span className="text-xs text-green-400 font-medium">Retrying...</span>
          ) : (
            <div className="flex flex-col gap-2 items-end">
              {post.category === "retry" && (
                <button onClick={onRetry} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>Retry</button>
              )}
              {post.category === "reconnect" && (
                <a href="/settings/pages" className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-red-500 block text-center">Reconnect</a>
              )}
              {post.category === "edit" && (
                <button onClick={onRetry} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: "#8B5CF6" }}>Edit & Requeue</button>
              )}
              <button onClick={onMoveToDrafts} className="px-3 py-1.5 rounded-lg text-[11px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                Move to Drafts
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // compact
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border transition-all"
      style={{ backgroundColor: isRetrying ? "rgba(74,222,128,0.05)" : selected ? "var(--surface-hover)" : "var(--surface)", borderColor: selected ? "var(--primary)" : "var(--border)", opacity: isRetrying ? 0.5 : 1 }}>
      <input type="checkbox" checked={selected} onChange={onToggle}
        className="w-4 h-4 rounded cursor-pointer flex-shrink-0" style={{ accentColor: "var(--primary)" }} />
      <span className="text-base flex-shrink-0">
        {post.type === "photo" ? "📷" : post.type === "reel" ? "🎬" : "📝"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ color: "var(--text)" }}>{post.caption}</p>
        <p className="text-xs mt-1" style={{ color: cat.color }}>{post.message}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: post.page.color }}>{post.page.avatar}</div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.page.name}</span>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {post.platforms.map(p => (
          <span key={p} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
            {p === "facebook" ? "FB" : p === "instagram" ? "IG" : "TH"}
          </span>
        ))}
      </div>
      <span className="text-xs flex-shrink-0 w-[100px] text-right" style={{ color: "var(--text-muted)" }}>{post.failedAt}</span>
      <div className="flex gap-2 flex-shrink-0">
        {isRetrying ? (
          <span className="text-xs text-green-400 font-medium w-[120px] text-center">Retrying...</span>
        ) : (
          <>
            {post.category === "retry"     && <button onClick={onRetry} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>Retry</button>}
            {post.category === "reconnect" && <a href="/settings/pages" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500">Reconnect</a>}
            {post.category === "edit"      && <button onClick={onRetry} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "#8B5CF6" }}>Edit & Requeue</button>}
            <button onClick={onMoveToDrafts} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>Move to Drafts</button>
          </>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type ApprovalStatus = "pending" | "approved" | "rejected" | "changes_requested";

interface ApprovalPost {
  id: string;
  thumbnail: string;
  caption: string;
  page: { name: string; avatar: string; color: string };
  platforms: string[];
  type: "photo" | "reel";
  submittedBy: string;
  submittedAt: string;
  scheduledFor: string;
  status: ApprovalStatus;
  approvalNote?: string;
  threadComment?: string;
}

const MOCK_POSTS: ApprovalPost[] = [
  {
    id: "ap1",
    thumbnail: "",
    caption: "The forgotten queen who ruled an empire for 40 years — and history erased her from the books completely",
    page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
    platforms: ["fb", "ig"],
    type: "photo",
    submittedBy: "Sarah Khan",
    submittedAt: "2 hours ago",
    scheduledFor: "Today, 3:00 PM EST",
    status: "pending",
    threadComment: "Thread: The real story behind her reign and why historians ignored her for centuries",
  },
  {
    id: "ap2",
    thumbnail: "",
    caption: "POV: Your code works on the first try but you don't trust it at all 😭",
    page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" },
    platforms: ["fb", "ig", "th"],
    type: "reel",
    submittedBy: "Ahmed Raza",
    submittedAt: "4 hours ago",
    scheduledFor: "Today, 4:30 PM EST",
    status: "pending",
  },
  {
    id: "ap3",
    thumbnail: "",
    caption: "5 exercises you're doing wrong — and the simple fix that makes them 3x more effective",
    page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" },
    platforms: ["fb"],
    type: "reel",
    submittedBy: "Sarah Khan",
    submittedAt: "5 hours ago",
    scheduledFor: "Tomorrow, 8:00 AM PST",
    status: "pending",
  },
  {
    id: "ap4",
    thumbnail: "",
    caption: "Apple just leaked their next chip — and it's not what anyone expected",
    page: { name: "TechByte", avatar: "TB", color: "#14B8A6" },
    platforms: ["fb", "ig", "th"],
    type: "photo",
    submittedBy: "Ahmed Raza",
    submittedAt: "Yesterday, 6:00 PM",
    scheduledFor: "Today, 5:00 PM EST",
    status: "approved",
    approvalNote: "Looks great — timely and on-brand.",
  },
  {
    id: "ap5",
    thumbnail: "",
    caption: "The $5 coffee habit is NOT why you're broke. Here's where your money is actually going",
    page: { name: "Money Matters", avatar: "MM", color: "#F59E0B" },
    platforms: ["fb", "ig"],
    type: "photo",
    submittedBy: "Sarah Khan",
    submittedAt: "Yesterday, 4:30 PM",
    scheduledFor: "Tomorrow, 9:00 AM EST",
    status: "changes_requested",
    approvalNote: "Caption is good but add a hook in the first line — make it punchier before the reveal.",
  },
  {
    id: "ap6",
    thumbnail: "",
    caption: "3 signs your body is telling you to drink more water",
    page: { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" },
    platforms: ["fb"],
    type: "photo",
    submittedBy: "Ahmed Raza",
    submittedAt: "Yesterday, 2:00 PM",
    scheduledFor: "Today, 6:00 PM EST",
    status: "rejected",
    approvalNote: "We already posted very similar content last week. Please create something fresh — check the queue before submitting.",
  },
];

function PlatformIcon({ p }: { p: string }) {
  if (p === "fb") return <svg width="12" height="12" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (p === "ig") return <svg width="12" height="12" viewBox="0 0 24 24" fill="url(#ig-a)"><defs><linearGradient id="ig-a" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01L1.47 11.5c0-3.63.865-6.51 2.56-8.535C5.836.807 8.662-.097 12.4.006c3.106.087 5.532 1.106 7.208 3.026 1.63 1.864 2.47 4.536 2.5 7.934l.003.5c.028 3.607-.867 6.471-2.66 8.516-1.854 2.116-4.658 3.064-8.277 2.018zM10.285 6.4a.4.4 0 00-.4.4v10.4a.4.4 0 00.585.355l9.2-5.2a.4.4 0 000-.71l-9.2-5.2a.4.4 0 00-.185-.045z"/></svg>;
}

const STATUS_CONFIG = {
  pending:           { label: "Awaiting Approval", color: "#FBBF24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.25)" },
  approved:          { label: "Approved",           color: "#4ADE80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.25)" },
  rejected:          { label: "Rejected",           color: "#EF4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)"  },
  changes_requested: { label: "Changes Requested",  color: "#60A5FA", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.25)" },
};

function ReviewModal({ post, onClose, onDecide }: {
  post: ApprovalPost;
  onClose: () => void;
  onDecide: (id: string, decision: ApprovalStatus, note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [deciding, setDeciding] = useState<ApprovalStatus | null>(null);

  const handleDecide = (decision: ApprovalStatus) => {
    setDeciding(decision);
    setTimeout(() => { onDecide(post.id, decision, note); onClose(); }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
      <div className="w-[520px] rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxHeight: "88vh" }}>

        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Review Post</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Submitted by {post.submittedBy} · {post.submittedAt}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          {/* Post preview */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {/* Thumbnail */}
            <div className="w-full h-40 flex items-center justify-center relative" style={{ backgroundColor: "var(--surface-hover)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase" style={{ backgroundColor: post.type === "reel" ? "#8B5CF6" : "#FF6B2B" }}>{post.type}</span>
            </div>
            {/* Caption */}
            <div className="px-4 py-4" style={{ backgroundColor: "var(--bg)" }}>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text)" }}>{post.caption}</p>
              {post.threadComment && (
                <div className="mt-3 pt-3 border-t flex gap-2" style={{ borderColor: "var(--border)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{post.threadComment}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-xl px-4 py-4 grid grid-cols-2 gap-3" style={{ backgroundColor: "var(--surface-hover)" }}>
            {[
              ["Page", <span key="page" className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: post.page.color }}>{post.page.avatar}</span>{post.page.name}</span>],
              ["Platforms", <span key="plat" className="flex items-center gap-1.5">{post.platforms.map(p => <PlatformIcon key={p} p={p} />)}</span>],
              ["Scheduled", post.scheduledFor],
              ["Submitted", post.submittedAt + " by " + post.submittedBy],
            ].map(([label, val]) => (
              <div key={String(label)}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{String(label)}</p>
                <div className="text-[12px] font-medium flex items-center gap-1" style={{ color: "var(--text)" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Note input */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>
              Note <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — visible to creator)</span>
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Add a note for the creator…"
              className="w-full px-4 py-3 rounded-xl text-[13px] resize-none"
              style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t flex gap-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => handleDecide("rejected")}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ backgroundColor: deciding === "rejected" ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>
            Reject
          </button>
          <button
            onClick={() => handleDecide("changes_requested")}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ backgroundColor: deciding === "changes_requested" ? "rgba(96,165,250,0.2)" : "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.3)" }}>
            Request Changes
          </button>
          <button
            onClick={() => handleDecide("approved")}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all"
            style={{ backgroundColor: deciding === "approved" ? "#16a34a" : "#22c55e", boxShadow: "0 2px 10px rgba(34,197,94,0.3)" }}>
            ✓ Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "changes_requested">("pending");
  const [posts, setPosts] = useState<ApprovalPost[]>(MOCK_POSTS);
  const [reviewing, setReviewing] = useState<ApprovalPost | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [pageFilter, setPageFilter] = useState<string>("all");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const decide = (id: string, decision: ApprovalStatus, note: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: decision, approvalNote: note || p.approvalNote } : p));
    const label = decision === "approved" ? "Post approved" : decision === "rejected" ? "Post rejected" : "Changes requested";
    showToast(label);
  };

  const bulkApprove = () => {
    const count = selected.size;
    setPosts(prev => prev.map(p => selected.has(p.id) ? { ...p, status: "approved" } : p));
    setSelected(new Set());
    showToast(`${count} post${count > 1 ? "s" : ""} approved`);
  };

  const filtered = posts.filter(p => {
    if (p.status !== tab) return false;
    if (pageFilter !== "all" && p.page.name !== pageFilter) return false;
    return true;
  });

  const pendingCount = posts.filter(p => p.status === "pending").length;
  const allPages = [...new Set(posts.map(p => p.page.name))];

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const TABS: { key: typeof tab; label: string }[] = [
    { key: "pending", label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
    { key: "approved", label: "Approved" },
    { key: "changes_requested", label: "Changes Requested" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 flex flex-col" style={{ marginLeft: "232px" }}>
        <Header
          title="Approvals"
          subtitle={
            tab === "pending"
              ? pendingCount > 0
                ? `${pendingCount} post${pendingCount !== 1 ? "s" : ""} awaiting your review`
                : "You're all caught up"
              : tab === "approved" ? "Posts you've approved"
              : tab === "changes_requested" ? "Posts awaiting creator edits"
              : "Posts you've rejected"
          }
        />

        <div className="px-8 pb-8">
          {/* Tabs + filter row */}
          <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setSelected(new Set()); }}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{
                    backgroundColor: tab === t.key ? "var(--surface-hover)" : "transparent",
                    color: tab === t.key ? "var(--text)" : "var(--text-muted)",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Page filter */}
            <select
              value={pageFilter}
              onChange={e => setPageFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-[12px]"
              style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)", outline: "none" }}>
              <option value="all">All Pages</option>
              {allPages.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Bulk bar */}
          {selected.size > 0 && tab === "pending" && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4"
              style={{ backgroundColor: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
              <span className="text-[13px] font-medium" style={{ color: "#4ADE80" }}>
                {selected.size} post{selected.size > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <button onClick={bulkApprove}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-white"
                  style={{ backgroundColor: "#22c55e", boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Approve All
                </button>
                <button onClick={() => setSelected(new Set())}
                  className="px-3 py-2 rounded-lg text-[12px]"
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--surface-hover)" }}>
                {tab === "pending"
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              </div>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>
                {tab === "pending" ? "Nothing to review" : tab === "approved" ? "No approved posts yet" : tab === "changes_requested" ? "No changes requested" : "No rejected posts"}
              </p>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                {tab === "pending" ? "All posts have been reviewed. Great work." : "Posts will appear here once reviewed."}
              </p>
            </div>
          )}

          {/* Post list */}
          {filtered.length > 0 && (
            <div className="flex flex-col gap-3">
              {filtered.map(post => {
                const statusCfg = STATUS_CONFIG[post.status];
                const isSelected = selected.has(post.id);
                return (
                  <div
                    key={post.id}
                    className="rounded-2xl overflow-hidden transition-all"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: `1px solid ${isSelected ? "rgba(74,222,128,0.4)" : "var(--border)"}`,
                      boxShadow: isSelected ? "0 0 0 2px rgba(74,222,128,0.15)" : "none",
                    }}>
                    <div className="flex items-start gap-4 p-5">
                      {/* Checkbox (pending only) */}
                      {tab === "pending" && (
                        <button
                          onClick={() => toggleSelect(post.id)}
                          className="mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all"
                          style={{ backgroundColor: isSelected ? "#22c55e" : "transparent", borderColor: isSelected ? "#22c55e" : "var(--border)" }}>
                          {isSelected && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      )}

                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span className="absolute bottom-1 right-1 px-1 py-0 rounded text-[8px] font-bold text-white uppercase" style={{ backgroundColor: post.type === "reel" ? "#8B5CF6" : "#FF6B2B" }}>{post.type}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-[13px] font-medium line-clamp-2 leading-relaxed" style={{ color: "var(--text)" }}>{post.caption}</p>
                          {/* Status badge */}
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap"
                            style={{ backgroundColor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                            {statusCfg.label}
                          </span>
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ backgroundColor: post.page.color }}>{post.page.avatar}</div>
                            {post.page.name}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {post.scheduledFor}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            {post.submittedBy} · {post.submittedAt}
                          </span>
                          <span className="flex items-center gap-1">
                            {post.platforms.map(p => <PlatformIcon key={p} p={p} />)}
                          </span>
                          {post.threadComment && (
                            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                              Has thread
                            </span>
                          )}
                        </div>

                        {/* Approval note */}
                        {post.approvalNote && (
                          <div className="mt-3 px-3 py-2.5 rounded-lg flex gap-2" style={{ backgroundColor: `${statusCfg.bg}`, border: `1px solid ${statusCfg.border}` }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={statusCfg.color} strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                            <p className="text-[12px]" style={{ color: statusCfg.color }}>{post.approvalNote}</p>
                          </div>
                        )}
                      </div>

                      {/* Review button */}
                      {tab === "pending" && (
                        <button
                          onClick={() => setReviewing(post)}
                          className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white flex-shrink-0 transition-all hover:opacity-90"
                          style={{ backgroundColor: "var(--primary)", boxShadow: "0 2px 8px var(--primary-glow)" }}>
                          Review
                        </button>
                      )}
                      {tab !== "pending" && (
                        <button
                          onClick={() => setReviewing(post)}
                          className="px-4 py-2 rounded-xl text-[12px] font-medium flex-shrink-0 transition-all hover:opacity-80"
                          style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                          View
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Review modal */}
        {reviewing && (
          <ReviewModal
            post={reviewing}
            onClose={() => setReviewing(null)}
            onDecide={decide}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-[13px] font-medium text-white shadow-xl"
            style={{ backgroundColor: "#1e1e2e", border: "1px solid var(--border)" }}>
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}

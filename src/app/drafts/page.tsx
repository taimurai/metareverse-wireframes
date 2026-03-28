"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PageBatchSelector from "@/components/PageBatchSelector";

interface Draft {
  id: string;
  thumbnail: string;
  caption: string;
  page: { name: string; avatar: string; color: string };
  platforms: string[];
  type: "photo" | "reel";
  createdAt: string;
  source: "bulk-upload" | "single-post";
  comments: { text: string; delay: string }[];
}

const DRAFT_DATA: Draft[] = [
  { id: "d1",  thumbnail: "", caption: "The forgotten queen who ruled an empire for 40 years — and history erased her from the books completely", page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" }, platforms: ["fb","ig"], type: "photo", createdAt: "Today, 9:14 AM",  source: "bulk-upload", comments: [{ text: "Thread comment 1: The real story behind her reign", delay: "0m" }, { text: "Thread comment 2: Why historians ignored her for centuries", delay: "5m" }] },
  { id: "d2",  thumbnail: "", caption: "POV: Your code works on the first try but you don't trust it at all", page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" }, platforms: ["fb","ig","th"], type: "reel", createdAt: "Today, 8:52 AM",  source: "single-post", comments: [] },
  { id: "d3",  thumbnail: "", caption: "5 exercises you're doing wrong — and the simple fix that makes them 3x more effective", page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" }, platforms: ["fb"], type: "reel", createdAt: "Today, 8:30 AM",  source: "bulk-upload", comments: [] },
  { id: "d4",  thumbnail: "", caption: "Apple just leaked their next chip — and it's not what anyone expected. Here's what the specs mean for you", page: { name: "TechByte", avatar: "TB", color: "#14B8A6" }, platforms: ["fb","ig","th"], type: "photo", createdAt: "Today, 7:45 AM",  source: "bulk-upload", comments: [] },
  { id: "d5",  thumbnail: "", caption: "3 signs your body is telling you to drink more water — #3 will surprise most people", page: { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" }, platforms: ["fb"], type: "photo", createdAt: "Today, 7:12 AM",  source: "single-post", comments: [{ text: "Your kidneys are working overtime to compensate", delay: "0m" }] },
  { id: "d6",  thumbnail: "", caption: "The $5 coffee habit is NOT why you're broke. Here's where your money is actually going", page: { name: "Money Matters", avatar: "MM", color: "#F59E0B" }, platforms: ["fb","ig"], type: "photo", createdAt: "Yesterday, 11:30 PM", source: "bulk-upload", comments: [] },
  { id: "d7",  thumbnail: "", caption: "3,000-year-old artifact found in a farmer's field — experts still can't agree what it was used for", page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" }, platforms: ["fb","ig"], type: "photo", createdAt: "Yesterday, 10:15 PM", source: "bulk-upload", comments: [{ text: "Similar objects found in 4 other countries", delay: "0m" }, { text: "The leading theory (and why it might be wrong)", delay: "5m" }, { text: "What modern archaeologists think today", delay: "10m" }] },
  { id: "d8",  thumbnail: "", caption: "POV: You mass a typo in a work email and hit send before you notice", page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" }, platforms: ["fb","ig","th"], type: "reel", createdAt: "Yesterday, 9:40 PM", source: "single-post", comments: [] },
  { id: "d9",  thumbnail: "", caption: "The Mediterranean diet ranked #1 again — here's the one thing most people get wrong about it", page: { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" }, platforms: ["fb"], type: "photo", createdAt: "Yesterday, 8:20 PM", source: "bulk-upload", comments: [] },
  { id: "d10", thumbnail: "", caption: "Why every programmer should learn at least one functional programming language in 2026", page: { name: "TechByte", avatar: "TB", color: "#14B8A6" }, platforms: ["fb","ig"], type: "photo", createdAt: "Yesterday, 7:55 PM", source: "bulk-upload", comments: [] },
  { id: "d11", thumbnail: "", caption: "This one investing rule would have made you $50k richer over the last 10 years", page: { name: "Money Matters", avatar: "MM", color: "#F59E0B" }, platforms: ["fb","ig"], type: "photo", createdAt: "Yesterday, 6:30 PM", source: "single-post", comments: [] },
  { id: "d12", thumbnail: "", caption: "The fastest bodyweight workout you can do in 12 minutes — no excuses", page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" }, platforms: ["fb","ig"], type: "reel", createdAt: "Mar 27, 4:00 PM", source: "bulk-upload", comments: [] },
];

const PAGES_MAP: Record<string, string[]> = {
  all: DRAFT_DATA.map(d => d.page.name),
  lc:  ["Laugh Central"],
  hu:  ["History Uncovered"],
  tb:  ["TechByte"],
  mm:  ["Money Matters"],
  dh:  ["Daily Health Tips"],
  ff:  ["Fitness Factory"],
  khn: ["Know Her Name"],
  b1:  ["Laugh Central","Fitness Factory","Daily Health Tips"],
  b2:  ["History Uncovered","TechByte","Money Matters"],
  b3:  ["Know Her Name"],
};

type SortOption = "newest" | "oldest" | "page";

// Schedule modal
function ScheduleModal({ draft, onClose, onSchedule }: { draft: Draft; onClose: () => void; onSchedule: (id: string, time: string, date: string) => void }) {
  const [date, setDate] = useState("today");
  const [time, setTime] = useState("10:00");
  const dateLabel = date === "today" ? "Today" : date === "tomorrow" ? "Tomorrow" : date;

  const formatDisplay = () => {
    const [h, m] = time.split(":").map(Number);
    const p = h >= 12 ? "PM" : "AM";
    const dh = h % 12 === 0 ? 12 : h % 12;
    return `${dateLabel}, ${dh}:${m.toString().padStart(2,"0")} ${p}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-[420px] rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Schedule Post</h2>
              <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{draft.caption.slice(0,60)}…</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Date */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Date</label>
            <div className="flex gap-2">
              {["today","tomorrow"].map(d => (
                <button key={d} onClick={() => setDate(d)}
                  className="flex-1 py-2 rounded-lg text-[12px] font-medium capitalize transition-all"
                  style={{ backgroundColor: date === d ? "var(--primary)" : "var(--surface-hover)", color: date === d ? "white" : "var(--text-secondary)" }}>
                  {d}
                </button>
              ))}
              <input type="date" onChange={e => setDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-[12px]"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", outline: "none" }} />
            </div>
          </div>
          {/* Time */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-[14px] font-medium"
              style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }} />
          </div>
          {/* Preview */}
          <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--surface-hover)" }}>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Will publish: </span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{formatDisplay()}</span>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
            style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}>
            Cancel
          </button>
          <button onClick={() => { onSchedule(draft.id, time, date); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ backgroundColor: "var(--primary)", boxShadow: "0 2px 10px var(--primary-glow)" }}>
            Add to Queue
          </button>
        </div>
      </div>
    </div>
  );
}

function PlatformIcon({ p }: { p: string }) {
  if (p === "fb") return <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (p === "ig") return <svg width="14" height="14" viewBox="0 0 24 24" fill="url(#ig)"><defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01L1.47 11.5c0-3.63.865-6.51 2.56-8.535C5.836.807 8.662-.097 12.4.006c3.106.087 5.532 1.106 7.208 3.026 1.63 1.864 2.47 4.536 2.5 7.934l.003.5c.028 3.607-.867 6.471-2.66 8.516-1.854 2.116-4.658 3.064-8.277 2.018zM10.285 6.4a.4.4 0 00-.4.4v10.4a.4.4 0 00.585.355l9.2-5.2a.4.4 0 000-.71l-9.2-5.2a.4.4 0 00-.185-.045z"/></svg>;
}

export default function DraftsPage() {
  const [selectedScope, setSelectedScope] = useState("all");
  const [scopeType, setScopeType] = useState<"all"|"page"|"batch">("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scheduling, setScheduling] = useState<Draft | null>(null);
  const [scheduledIds, setScheduledIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [source, setSource] = useState<"all"|"bulk-upload"|"single-post">("all");
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  const pageNames = PAGES_MAP[selectedScope] || [];

  const filtered = simulateEmpty ? [] : DRAFT_DATA
    .filter(d => !scheduledIds.has(d.id))
    .filter(d => scopeType === "all" ? true : pageNames.includes(d.page.name))
    .filter(d => source === "all" ? true : d.source === source)
    .sort((a, b) => {
      if (sort === "newest") return DRAFT_DATA.indexOf(a) - DRAFT_DATA.indexOf(b);
      if (sort === "oldest") return DRAFT_DATA.indexOf(b) - DRAFT_DATA.indexOf(a);
      return a.page.name.localeCompare(b.page.name);
    });

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(d => d.id)));
  };

  const handleSchedule = (id: string, time: string, date: string) => {
    setScheduledIds(prev => new Set([...prev, id]));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    const [h, m] = time.split(":").map(Number);
    const p = h >= 12 ? "PM" : "AM";
    const dh = h % 12 === 0 ? 12 : h % 12;
    const label = date === "today" ? "Today" : date === "tomorrow" ? "Tomorrow" : date;
    showToast(`Added to Queue — ${label}, ${dh}:${m.toString().padStart(2,"0")} ${p}`);
  };

  const handleBulkSchedule = () => {
    // Just show a schedule modal-like toast for bulk
    const count = selected.size;
    setScheduledIds(prev => new Set([...prev, ...selected]));
    setSelected(new Set());
    showToast(`${count} draft${count > 1 ? "s" : ""} added to Queue`);
  };

  const handleBulkDelete = () => {
    const count = selected.size;
    setScheduledIds(prev => new Set([...prev, ...selected])); // removes from list
    setSelected(new Set());
    showToast(`${count} draft${count > 1 ? "s" : ""} deleted`);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 flex flex-col" style={{ marginLeft: "232px" }}>
        <div className="flex justify-end px-8 pt-4">
          <button
            onClick={() => setSimulateEmpty(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border"
            style={{ backgroundColor: simulateEmpty ? "var(--primary-muted)" : "var(--surface)", color: simulateEmpty ? "var(--primary)" : "var(--text-muted)", borderColor: simulateEmpty ? "var(--primary)" : "var(--border)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
            {simulateEmpty ? "Showing empty state" : "Preview empty state"}
          </button>
        </div>
        <Header
          title="Drafts"
          subtitle={simulateEmpty ? "0 drafts" : `${filtered.length} draft${filtered.length !== 1 ? "s" : ""} waiting to be scheduled`}
          actions={
            <button
              onClick={() => window.location.href = "/upload"}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Upload
            </button>
          }
        />

        <div className="px-8 pb-8">
          {/* Filters row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <PageBatchSelector
              selected={selectedScope}
              onChange={(id, type) => { setSelectedScope(id); setScopeType(type as "all"|"page"|"batch"); }}
            />

            {/* Source filter */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              {([["all","All"],["bulk-upload","Bulk Upload"],["single-post","Single Post"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => setSource(val)}
                  className="px-3.5 py-2 text-[12px] font-medium transition-all"
                  style={{ backgroundColor: source === val ? "var(--primary)" : "transparent", color: source === val ? "white" : "var(--text-secondary)" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
                className="px-3 py-1.5 rounded-lg text-[12px]"
                style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)", outline: "none" }}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="page">By page</option>
              </select>
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4" style={{ backgroundColor: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
              <span className="text-[13px] font-medium" style={{ color: "var(--primary)" }}>
                {selected.size} draft{selected.size > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <button onClick={handleBulkSchedule}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-white"
                  style={{ backgroundColor: "var(--primary)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Add All to Queue
                </button>
                <button onClick={handleBulkDelete}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium"
                  style={{ backgroundColor: "var(--surface)", color: "var(--error)" }}>
                  Delete
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--surface-hover)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <p className="text-[14px] font-medium mb-1" style={{ color: "var(--text)" }}>No drafts</p>
              <p className="text-[12px] mb-5" style={{ color: "var(--text-muted)" }}>Posts you create without scheduling will appear here</p>
              <button onClick={() => window.location.href = "/upload"}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
                style={{ backgroundColor: "var(--primary)" }}>
                Go to Bulk Upload
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface-hover)" }}>
                    <th className="pl-4 pr-2 py-3 w-8">
                      <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={toggleAll} className="w-3.5 h-3.5 cursor-pointer" />
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider w-8" style={{ color: "var(--text-muted)" }}></th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Post</th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Page</th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>To</th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Threads</th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Source</th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Created</th>
                    <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(draft => (
                    <tr key={draft.id}
                      style={{ borderBottom: "1px solid var(--border)" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-hover)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <td className="pl-4 pr-2 py-3">
                        <input type="checkbox" checked={selected.has(draft.id)} onChange={() => toggleSelect(draft.id)} className="w-3.5 h-3.5 cursor-pointer" onClick={e => e.stopPropagation()} />
                      </td>
                      {/* Type icon */}
                      <td className="px-2 py-3">
                        <div className="w-6 h-6 flex items-center justify-center rounded" style={{ backgroundColor: draft.type === "reel" ? "rgba(236,72,153,0.12)" : "var(--surface-hover)" }}>
                          {draft.type === "reel" ? (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          ) : (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          )}
                        </div>
                      </td>
                      {/* Thumbnail + caption */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "var(--surface-hover)", border: "1px solid var(--border)" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                          <span className="truncate max-w-[320px]" style={{ color: "var(--text)" }}>{draft.caption}</span>
                        </div>
                      </td>
                      {/* Page */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: draft.page.color }}>
                            {draft.page.avatar}
                          </div>
                          <span className="whitespace-nowrap text-[12px]" style={{ color: "var(--text-secondary)" }}>{draft.page.name}</span>
                        </div>
                      </td>
                      {/* Platforms */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          {draft.platforms.map(p => <PlatformIcon key={p} p={p} />)}
                        </div>
                      </td>
                      {/* Threads */}
                      <td className="px-3 py-3">
                        {draft.comments.length > 0 ? (
                          <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--primary)" }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            {draft.comments.length}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      {/* Source */}
                      <td className="px-3 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                          backgroundColor: draft.source === "bulk-upload" ? "rgba(99,102,241,0.12)" : "rgba(20,184,166,0.12)",
                          color: draft.source === "bulk-upload" ? "#818CF8" : "#2DD4BF",
                        }}>
                          {draft.source === "bulk-upload" ? "Bulk" : "Single"}
                        </span>
                      </td>
                      {/* Created */}
                      <td className="px-3 py-3 whitespace-nowrap text-[12px]" style={{ color: "var(--text-muted)" }}>{draft.createdAt}</td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setScheduling(draft)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white whitespace-nowrap"
                            style={{ backgroundColor: "var(--primary)" }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            Schedule
                          </button>
                          <button className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}
                            onClick={() => { setScheduledIds(prev => new Set([...prev, draft.id])); showToast("Draft deleted"); }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary bar */}
          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-center gap-4">
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                {filtered.filter(d => d.comments.length > 0).length} with thread comments
              </span>
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                {filtered.filter(d => d.source === "bulk-upload").length} from bulk upload ·{" "}
                {filtered.filter(d => d.source === "single-post").length} from single post
              </span>
            </div>
          </div>
        </div>

        {/* Schedule modal */}
        {scheduling && (
          <ScheduleModal
            draft={scheduling}
            onClose={() => setScheduling(null)}
            onSchedule={handleSchedule}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-2xl z-50"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--success)" }}><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{toast}</span>
          </div>
        )}
      </main>
    </div>
  );
}

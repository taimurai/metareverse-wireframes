"use client";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

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
  { id: "d8",  thumbnail: "", caption: "POV: You miss a typo in a work email and hit send before you notice", page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" }, platforms: ["fb","ig","th"], type: "reel", createdAt: "Yesterday, 9:40 PM", source: "single-post", comments: [] },
  { id: "d9",  thumbnail: "", caption: "The Mediterranean diet ranked #1 again — here's the one thing most people get wrong about it", page: { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" }, platforms: ["fb"], type: "photo", createdAt: "Yesterday, 8:20 PM", source: "bulk-upload", comments: [] },
  { id: "d10", thumbnail: "", caption: "Why every programmer should learn at least one functional programming language in 2026", page: { name: "TechByte", avatar: "TB", color: "#14B8A6" }, platforms: ["fb","ig"], type: "photo", createdAt: "Yesterday, 7:55 PM", source: "bulk-upload", comments: [] },
  { id: "d11", thumbnail: "", caption: "This one investing rule would have made you $50k richer over the last 10 years", page: { name: "Money Matters", avatar: "MM", color: "#F59E0B" }, platforms: ["fb","ig"], type: "photo", createdAt: "Yesterday, 6:30 PM", source: "single-post", comments: [] },
  { id: "d12", thumbnail: "", caption: "The fastest bodyweight workout you can do in 12 minutes — no excuses", page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" }, platforms: ["fb","ig"], type: "reel", createdAt: "Mar 27, 4:00 PM", source: "bulk-upload", comments: [] },
];

const ALL_PAGES = [
  { name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "284K" },
  { name: "Laugh Central",     avatar: "LC", color: "#8B5CF6", followers: "512K" },
  { name: "Fitness Factory",   avatar: "FF", color: "#EC4899", followers: "198K" },
  { name: "TechByte",          avatar: "TB", color: "#14B8A6", followers: "341K" },
  { name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "227K" },
  { name: "Money Matters",     avatar: "MM", color: "#F59E0B", followers: "156K" },
];

// Mock page rhythms (mirrors Settings → Pages configuration)
const PAGE_RHYTHMS: Record<string, { interval: number; nextSlot: string; tz: string }> = {
  "History Uncovered": { interval: 2,   nextSlot: "Today, 3:00 PM",    tz: "EST" },
  "Laugh Central":     { interval: 2.5, nextSlot: "Today, 4:30 PM",    tz: "EST" },
  "Fitness Factory":   { interval: 3,   nextSlot: "Tomorrow, 8:00 AM", tz: "PST" },
  "TechByte":          { interval: 2,   nextSlot: "Today, 5:00 PM",    tz: "EST" },
  "Daily Health Tips": { interval: 4,   nextSlot: "Today, 6:00 PM",    tz: "EST" },
  "Money Matters":     { interval: 3,   nextSlot: "Tomorrow, 9:00 AM", tz: "EST" },
};

type SortOption = "newest" | "oldest" | "page";
type ViewMode = "compact" | "visual" | "density";

// ── Schedule modal ──────────────────────────────────────────────────────────
function ScheduleModal({ draft, onClose, onSchedule }: { draft: Draft; onClose: () => void; onSchedule: (id: string, time: string, date: string) => void }) {
  const rhythm = PAGE_RHYTHMS[draft.page.name];
  const [useAutoSlot, setUseAutoSlot] = useState(true);
  const [date, setDate] = useState("today");
  const [time, setTime] = useState("15:00");
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

        {/* Auto-slot banner */}
        {rhythm && (
          <div className="mx-6 mt-5">
            <button
              onClick={() => setUseAutoSlot(true)}
              className="w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all"
              style={{
                backgroundColor: useAutoSlot ? "rgba(74,222,128,0.06)" : "var(--surface-hover)",
                borderColor: useAutoSlot ? "rgba(74,222,128,0.3)" : "var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: useAutoSlot ? "#4ADE80" : "var(--border)" }}>
                    {useAutoSlot && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#4ADE80" }} />}
                  </div>
                  <span className="text-[12px] font-semibold" style={{ color: useAutoSlot ? "#4ADE80" : "var(--text-secondary)" }}>Next available slot</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ADE80" }}>AUTO</span>
              </div>
              <p className="text-[15px] font-bold ml-6" style={{ color: "var(--text)" }}>{rhythm.nextSlot}</p>
              <p className="text-[11px] ml-6 mt-0.5" style={{ color: "var(--text-muted)" }}>Every {rhythm.interval}h · {rhythm.tz} · {draft.page.name} rhythm</p>
            </button>
          </div>
        )}

        {/* Manual picker option */}
        <div className="mx-6 mt-2 mb-1">
          <button
            onClick={() => setUseAutoSlot(false)}
            className="w-full text-left px-4 py-3 rounded-xl border transition-all"
            style={{
              backgroundColor: !useAutoSlot ? "rgba(255,107,43,0.04)" : "transparent",
              borderColor: !useAutoSlot ? "rgba(255,107,43,0.3)" : "transparent",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: !useAutoSlot ? "var(--primary)" : "var(--border)" }}>
                {!useAutoSlot && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
              </div>
              <span className="text-[12px] font-medium" style={{ color: !useAutoSlot ? "var(--primary)" : "var(--text-muted)" }}>Pick a specific time</span>
            </div>
          </button>
        </div>

        {!useAutoSlot && (
          <div className="px-6 pb-2 flex flex-col gap-4">
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
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-[14px] font-medium"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }} />
            </div>
            <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--surface-hover)" }}>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Will publish: </span>
              <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{formatDisplay()}</span>
            </div>
          </div>
        )}

        <div className="px-6 py-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}>Cancel</button>
          <button onClick={() => {
            if (useAutoSlot && rhythm) {
              const dateStr = rhythm.nextSlot.toLowerCase().startsWith("today") ? "today" : "tomorrow";
              onSchedule(draft.id, "15:00", dateStr);
            } else {
              onSchedule(draft.id, time, date);
            }
            onClose();
          }}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ backgroundColor: useAutoSlot ? "#22c55e" : "var(--primary)", boxShadow: useAutoSlot ? "0 2px 10px rgba(34,197,94,0.3)" : "0 2px 10px var(--primary-glow)" }}>
            {useAutoSlot ? "⚡ Slot it in" : "Add to Queue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Bulk Add Thread modal ───────────────────────────────────────────────────
function BulkThreadModal({ count, onClose, onApply }: { count: number; onClose: () => void; onApply: () => void }) {
  const [text, setText] = useState("");
  const [delay, setDelay] = useState("0");
  const [overwrite, setOverwrite] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-[480px] rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Bulk Add Thread Comment</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Will be applied to {count} selected draft{count > 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="px-4 py-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="text-[12px]" style={{ color: "var(--primary)" }}>This comment will be posted as the first reply to each draft after it publishes.</span>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Thread Comment</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
              placeholder="Write your affiliate link, CTA, or follow-up comment here..."
              className="w-full px-4 py-3 rounded-xl text-[13px] resize-none"
              style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Post Delay</label>
              <select value={delay} onChange={e => setDelay(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-[12px]"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }}>
                <option value="0">Immediately after</option>
                <option value="5">5 minutes later</option>
                <option value="10">10 minutes later</option>
                <option value="30">30 minutes later</option>
                <option value="60">1 hour later</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={overwrite} onChange={e => setOverwrite(e.target.checked)}
              className="w-3.5 h-3.5 rounded" style={{ accentColor: "var(--primary)" }} />
            <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Overwrite existing thread comments on selected drafts</span>
          </label>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}>Cancel</button>
          <button onClick={() => { onApply(); onClose(); }} disabled={!text.trim()}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: "var(--primary)" }}>
            Apply to {count} Draft{count > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Bulk Auto-Schedule modal ────────────────────────────────────────────────
function BulkAutoScheduleModal({ drafts, onClose, onConfirm }: { drafts: Draft[]; onClose: () => void; onConfirm: () => void }) {
  const slotOffsets = [0, 2, 4, 0, 2, 4, 6, 0, 2, 4, 6, 8];
  const slotDates =   [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2]; // 0=Today, 1=Tomorrow, 2=Mar 29
  const dateLabels = ["Today", "Tomorrow", "Mar 29"];
  const slots = drafts.map((draft, i) => {
    const rhythm = PAGE_RHYTHMS[draft.page.name];
    const baseHour = 9 + slotOffsets[i % 12];
    const dateLabel = dateLabels[slotDates[i % 12]];
    const autoTime = rhythm
      ? rhythm.nextSlot
      : `${dateLabel}, ${baseHour > 12 ? baseHour - 12 : baseHour}:00 ${baseHour >= 12 ? "PM" : "AM"}`;
    return { draft, slot: autoTime, tz: rhythm?.tz ?? "EST" };
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-[560px] rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxHeight: "82vh" }}>
        <div className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Auto-Schedule {drafts.length} Posts</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Each post fills its page&apos;s next available slot · Quiet hours respected</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-2">
          {slots.map(({ draft, slot, tz }) => (
            <div key={draft.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--surface-hover)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: draft.page.color }}>{draft.page.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] truncate" style={{ color: "var(--text)" }}>{draft.caption.slice(0, 52)}…</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{draft.page.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[12px] font-semibold" style={{ color: "#4ADE80" }}>{slot}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{tz}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" className="flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t flex gap-3 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}>Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "#22c55e", boxShadow: "0 2px 12px rgba(34,197,94,0.3)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Confirm Auto-Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

function PlatformIcon({ p }: { p: string }) {
  if (p === "fb") return <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (p === "ig") return <svg width="14" height="14" viewBox="0 0 24 24" fill="url(#ig-d)"><defs><linearGradient id="ig-d" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01L1.47 11.5c0-3.63.865-6.51 2.56-8.535C5.836.807 8.662-.097 12.4.006c3.106.087 5.532 1.106 7.208 3.026 1.63 1.864 2.47 4.536 2.5 7.934l.003.5c.028 3.607-.867 6.471-2.66 8.516-1.854 2.116-4.658 3.064-8.277 2.018zM10.285 6.4a.4.4 0 00-.4.4v10.4a.4.4 0 00.585.355l9.2-5.2a.4.4 0 000-.71l-9.2-5.2a.4.4 0 00-.185-.045z"/></svg>;
}

export default function DraftsPage() {
  // View
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [groupBy, setGroupBy] = useState<"none" | "page">("none");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  // Filters
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [pageFilterOpen, setPageFilterOpen] = useState(false);
  const [pageSearch, setPageSearch] = useState("");
  const [filterType, setFilterType] = useState<"all"|"photo"|"reel">("all");
  const [filterSource, setFilterSource] = useState<"all"|"bulk-upload"|"single-post">("all");
  const [filterThread, setFilterThread] = useState<"all"|"has"|"missing">("all");
  const [sort, setSort] = useState<SortOption>("newest");

  // Pages that require approval (mirrors Settings/Pages config)
  const APPROVAL_REQUIRED_PAGES = new Set(["Laugh Central", "History Uncovered"]);

  // Selection & actions
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scheduling, setScheduling] = useState<Draft | null>(null);
  const [scheduledIds, setScheduledIds] = useState<Set<string>>(new Set());
  const [pendingApprovalIds, setPendingApprovalIds] = useState<Set<string>>(new Set());
  const [showBulkThread, setShowBulkThread] = useState(false);
  const [showAutoSchedule, setShowAutoSchedule] = useState(false);

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  // Undo delete
  const [undoToast, setUndoToast] = useState<{ ids: Set<string>; count: number; timer: ReturnType<typeof setTimeout> | null } | null>(null);
  const [undoCountdown, setUndoCountdown] = useState(5);
  const undoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  // Filtered + sorted
  const pageFilterActive = selectedPages.size > 0;
  const filtered = simulateEmpty ? [] : DRAFT_DATA
    .filter(d => !scheduledIds.has(d.id))
    .filter(d => pageFilterActive ? selectedPages.has(d.page.name) : true)
    .filter(d => filterType === "all" ? true : d.type === filterType)
    .filter(d => filterSource === "all" ? true : d.source === filterSource)
    .filter(d => filterThread === "all" ? true : filterThread === "has" ? d.comments.length > 0 : d.comments.length === 0)
    .sort((a, b) => {
      if (sort === "newest") return DRAFT_DATA.indexOf(a) - DRAFT_DATA.indexOf(b);
      if (sort === "oldest") return DRAFT_DATA.indexOf(b) - DRAFT_DATA.indexOf(a);
      return a.page.name.localeCompare(b.page.name);
    });

  // Group by page
  const pageGroups = groupBy === "page"
    ? ALL_PAGES
        .map(pg => ({ ...pg, drafts: filtered.filter(d => d.page.name === pg.name) }))
        .filter(g => g.drafts.length > 0)
    : [];

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(d => d.id)));

  const handleSchedule = (id: string, time: string, date: string) => {
    setScheduledIds(prev => new Set([...prev, id]));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    const [h, m] = time.split(":").map(Number);
    const p = h >= 12 ? "PM" : "AM";
    const dh = h % 12 === 0 ? 12 : h % 12;
    const label = date === "today" ? "Today" : date === "tomorrow" ? "Tomorrow" : date;
    showToast(`Added to Queue — ${label}, ${dh}:${m.toString().padStart(2,"0")} ${p}`);
  };

  const handleSubmitForApproval = (id: string) => {
    setPendingApprovalIds(prev => new Set([...prev, id]));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    showToast("Submitted for approval — awaiting review");
  };

  const handleBulkSchedule = () => {
    const count = selected.size;
    setScheduledIds(prev => new Set([...prev, ...selected]));
    setSelected(new Set());
    showToast(`${count} draft${count > 1 ? "s" : ""} added to Queue`);
  };

  const startUndoDelete = (ids: Set<string>) => {
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    setUndoCountdown(5);
    const timer = setTimeout(() => {
      setScheduledIds(prev => new Set([...prev, ...ids]));
      setUndoToast(null);
    }, 5000);
    setUndoToast({ ids, count: ids.size, timer });
    let remaining = 5;
    undoIntervalRef.current = setInterval(() => {
      remaining--;
      setUndoCountdown(remaining);
      if (remaining <= 0 && undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    }, 1000);
  };

  const handleUndo = () => {
    if (!undoToast) return;
    if (undoToast.timer) clearTimeout(undoToast.timer);
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    setUndoToast(null);
    showToast(`Restored ${undoToast.count} draft${undoToast.count > 1 ? "s" : ""}`);
  };

  const handleBulkDelete = () => {
    const toDelete = new Set(selected);
    setSelected(new Set());
    startUndoDelete(toDelete);
  };

  useEffect(() => () => { if (undoIntervalRef.current) clearInterval(undoIntervalRef.current); }, []);

  const filteredPageSearch = ALL_PAGES.filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()));

  const togglePageFilter = (name: string) => {
    setSelectedPages(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  };

  const togglePageAccordion = (name: string) => {
    setExpandedPages(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  };

  const pageFilterLabel = selectedPages.size === 0 ? "All Pages" : selectedPages.size === 1 ? [...selectedPages][0] : `${selectedPages.size} Pages`;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 flex flex-col" style={{ marginLeft: "232px" }}>
        {/* Wireframe toggle */}
        <div className="flex justify-end px-8 pt-4">
          <button onClick={() => setSimulateEmpty(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border"
            style={{ backgroundColor: simulateEmpty ? "var(--primary-muted)" : "var(--surface)", color: simulateEmpty ? "var(--primary)" : "var(--text-muted)", borderColor: simulateEmpty ? "var(--primary)" : "var(--border)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
            {simulateEmpty ? "Showing empty state" : "Preview empty state"}
          </button>
        </div>

        <Header
          title="Drafts"
          subtitle={simulateEmpty ? "0 drafts" : `${filtered.length} draft${filtered.length !== 1 ? "s" : ""} waiting to be scheduled`}
          actions={
            <button onClick={() => window.location.href = "/upload"}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Upload
            </button>
          }
        />

        <div className="px-8 pb-8">
          {/* ── Controls row ── */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {/* Filters — hidden in density view */}
            {viewMode !== "density" && <>
              {/* Page multi-select */}
              <div className="relative">
                <button onClick={() => setPageFilterOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium border transition-all"
                  style={{ backgroundColor: "var(--surface)", color: pageFilterActive ? "var(--primary)" : "var(--text-secondary)", borderColor: pageFilterActive ? "var(--primary)" : "var(--border)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  {pageFilterLabel}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {pageFilterOpen && (
                  <div className="absolute top-full mt-1 left-0 z-30 rounded-xl shadow-2xl overflow-hidden w-64"
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
                    <div className="max-h-48 overflow-y-auto py-1">
                      {filteredPageSearch.map(pg => (
                        <button key={pg.name} onClick={() => togglePageFilter(pg.name)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:opacity-80 transition-opacity">
                          <div className="w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: selectedPages.has(pg.name) ? "var(--primary)" : "transparent", borderColor: selectedPages.has(pg.name) ? "var(--primary)" : "var(--border)" }}>
                            {selectedPages.has(pg.name) && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: pg.color }}>{pg.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] truncate" style={{ color: "var(--text)" }}>{pg.name}</div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{pg.followers} followers</div>
                          </div>
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

              {/* Media type filter */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {([["all","All"],["photo","Photo"],["reel","Reel"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setFilterType(val)}
                    className="px-3 py-2 text-[12px] font-medium transition-all"
                    style={{ backgroundColor: filterType === val ? "var(--primary)" : "transparent", color: filterType === val ? "white" : "var(--text-secondary)" }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Source filter */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {([["all","All"],["bulk-upload","Bulk"],["single-post","Single"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setFilterSource(val)}
                    className="px-3 py-2 text-[12px] font-medium transition-all"
                    style={{ backgroundColor: filterSource === val ? "var(--primary)" : "transparent", color: filterSource === val ? "white" : "var(--text-secondary)" }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Thread filter */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {([["all","All threads"],["has","Has thread"],["missing","No thread"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setFilterThread(val)}
                    className="px-3 py-2 text-[12px] font-medium transition-all"
                    style={{ backgroundColor: filterThread === val ? "var(--primary)" : "transparent", color: filterThread === val ? "white" : "var(--text-secondary)" }}>
                    {label}
                  </button>
                ))}
              </div>
            </>}

            {/* Sort + Group + View toggle — right side */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Group by — hidden in density view */}
              {viewMode !== "density" && (
                <select value={groupBy} onChange={e => setGroupBy(e.target.value as "none" | "page")}
                  className="px-3 py-2 rounded-xl text-[12px]"
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)", outline: "none" }}>
                  <option value="none">Group by: None</option>
                  <option value="page">Group by: Page</option>
                </select>
              )}

              {/* Sort — hidden in density view */}
              {viewMode !== "density" && (
                <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
                  className="px-3 py-2 rounded-xl text-[12px]"
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)", outline: "none" }}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="page">By page</option>
                </select>
              )}

              {/* View toggle */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <button onClick={() => setViewMode("compact")}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-all"
                  style={{ backgroundColor: viewMode === "compact" ? "var(--surface-hover)" : "transparent", color: viewMode === "compact" ? "var(--text)" : "var(--text-muted)" }}
                  title="Compact list">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  Compact
                </button>
                <button onClick={() => setViewMode("visual")}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-all"
                  style={{ backgroundColor: viewMode === "visual" ? "var(--surface-hover)" : "transparent", color: viewMode === "visual" ? "var(--text)" : "var(--text-muted)" }}
                  title="Visual rows with thumbnails">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  Visual
                </button>
                <button onClick={() => setViewMode("density")}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-all"
                  style={{ backgroundColor: viewMode === "density" ? "var(--surface-hover)" : "transparent", color: viewMode === "density" ? "var(--text)" : "var(--text-muted)" }}
                  title="Density heatmap by page and date">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="4" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="3" y="10" width="7" height="4" rx="1"/><rect x="14" y="10" width="7" height="4" rx="1"/><rect x="3" y="17" width="7" height="4" rx="1"/><rect x="14" y="17" width="7" height="4" rx="1"/></svg>
                  Density
                </button>
              </div>
            </div>
          </div>

          {/* ── Bulk action bar ── */}
          {selected.size > 0 && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 transition-all"
              style={{ backgroundColor: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
              <span className="text-[13px] font-medium" style={{ color: "var(--primary)" }}>
                {selected.size} draft{selected.size > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <button onClick={() => setShowAutoSchedule(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-white"
                  style={{ backgroundColor: "#22c55e", boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Auto-Schedule
                </button>
                <button onClick={handleBulkSchedule}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium border"
                  style={{ backgroundColor: "transparent", color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Add to Queue
                </button>
                <button onClick={() => setShowBulkThread(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium border"
                  style={{ backgroundColor: "transparent", color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  Add Thread
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

          {/* ── Density Heatmap View ── */}
          {viewMode === "density" && (() => {
            const dateBucket = (createdAt: string) => createdAt.split(",")[0].trim();
            const allDates = [...new Set(DRAFT_DATA.filter(d => !scheduledIds.has(d.id)).map(d => dateBucket(d.createdAt)))];
            const totalDrafts = DRAFT_DATA.filter(d => !scheduledIds.has(d.id)).length;
            const countFor = (pageName: string, date: string) =>
              DRAFT_DATA.filter(d => !scheduledIds.has(d.id) && d.page.name === pageName && dateBucket(d.createdAt) === date).length;
            const totalForDate = (date: string) =>
              DRAFT_DATA.filter(d => !scheduledIds.has(d.id) && dateBucket(d.createdAt) === date).length;
            const cellColor = (n: number) => {
              if (n === 0) return { bg: "rgba(239,68,68,0.12)", text: "#EF4444", border: "rgba(239,68,68,0.25)" };
              if (n === 1) return { bg: "rgba(251,191,36,0.15)", text: "#FBBF24", border: "transparent" };
              if (n <= 3) return { bg: "rgba(74,222,128,0.15)", text: "#4ADE80", border: "transparent" };
              return { bg: "rgba(59,130,246,0.15)", text: "#60A5FA", border: "transparent" };
            };
            return (
              <div style={{ backgroundColor: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", padding: 24, marginBottom: 24 }}>
                {/* Summary + legend */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    Draft coverage across {ALL_PAGES.length} pages · {allDates.length} date{allDates.length !== 1 ? "s" : ""} · {totalDrafts} drafts total
                  </span>
                  <div className="flex items-center gap-4">
                    {([["#EF4444","0 drafts"],["#FBBF24","1 draft"],["#4ADE80","2–3 drafts"],["#60A5FA","4+ drafts"]] as const).map(([color, label]) => (
                      <span key={label} className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Grid */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ borderCollapse: "separate", borderSpacing: 6, width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: 160, textAlign: "left", padding: "0 8px 8px", color: "var(--text-muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Page</th>
                        {allDates.map(date => (
                          <th key={date} style={{ minWidth: 100, textAlign: "center", padding: "0 0 8px", color: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}>
                            {date}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_PAGES.map(page => (
                        <tr key={page.name}>
                          <td style={{ padding: "3px 8px 3px 0" }}>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                              <span className="text-[12px] font-medium truncate" style={{ color: "var(--text-secondary)", maxWidth: 110 }}>{page.name}</span>
                            </div>
                          </td>
                          {allDates.map(date => {
                            const n = countFor(page.name, date);
                            const { bg, text, border } = cellColor(n);
                            return (
                              <td key={date} style={{ padding: 3 }}>
                                <button
                                  onClick={() => { setViewMode("compact"); setSelectedPages(new Set([page.name])); }}
                                  style={{
                                    width: "100%", height: 70, borderRadius: 10,
                                    backgroundColor: bg, border: `1px solid ${border}`,
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", transition: "filter 0.15s",
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.25)")}
                                  onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
                                  title={`${n} draft${n !== 1 ? "s" : ""} · ${page.name} · ${date} — click to filter`}
                                >
                                  <span style={{ fontSize: 22, fontWeight: 700, color: text, lineHeight: 1 }}>{n === 0 ? "–" : n}</span>
                                  {n > 0 && <span style={{ fontSize: 10, color: text, opacity: 0.7, marginTop: 2 }}>{n === 1 ? "draft" : "drafts"}</span>}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      {/* Total row */}
                      <tr>
                        <td style={{ padding: "8px 8px 3px 0" }}>
                          <span className="text-[12px] font-bold" style={{ color: "var(--text)" }}>Total</span>
                        </td>
                        {allDates.map(date => {
                          const n = totalForDate(date);
                          return (
                            <td key={date} style={{ padding: "8px 3px 3px" }}>
                              <div style={{
                                width: "100%", height: 44, borderRadius: 10,
                                backgroundColor: "var(--bg)", border: "1px solid var(--border)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{n}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ── Empty state (skip in density view) ── */}
          {viewMode !== "density" && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--surface-hover)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <p className="text-[14px] font-medium mb-1" style={{ color: "var(--text)" }}>No drafts</p>
              <p className="text-[12px] mb-5" style={{ color: "var(--text-muted)" }}>Posts you create without scheduling will appear here</p>
              <button onClick={() => window.location.href = "/upload"}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
                style={{ backgroundColor: "var(--primary)" }}>
                Go to Bulk Upload
              </button>
            </div>
          ) : groupBy === "page" ? (
            /* ── Group by Page accordions ── */
            <div className="space-y-2">
              {pageGroups.map(group => {
                const isExpanded = expandedPages.has(group.name);
                const groupSelected = group.drafts.filter(d => selected.has(d.id)).length;
                return (
                  <div key={group.name} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                    {/* Accordion header */}
                    <button onClick={() => togglePageAccordion(group.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:opacity-90"
                      style={{ backgroundColor: "var(--surface-hover)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform flex-shrink-0"
                        style={{ color: "var(--text-muted)", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: group.color }}>{group.avatar}</div>
                      <span className="text-[13px] font-semibold flex-1 text-left" style={{ color: "var(--text)" }}>{group.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
                        {group.drafts.length} draft{group.drafts.length !== 1 ? "s" : ""}
                      </span>
                      {groupSelected > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(255,107,43,0.1)", color: "var(--primary)" }}>
                          {groupSelected} selected
                        </span>
                      )}
                    </button>
                    {/* Accordion rows */}
                    {isExpanded && (
                      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {group.drafts.map(draft => (
                          <DraftRow
                            key={draft.id}
                            draft={draft}
                            viewMode={viewMode}
                            selected={selected.has(draft.id)}
                            onToggle={() => toggleSelect(draft.id)}
                            onSchedule={() => setScheduling(draft)}
                            onDelete={() => startUndoDelete(new Set([draft.id]))}
                            editingId={editingId}
                            editingText={editingText}
                            onEditStart={(id, text) => { setEditingId(id); setEditingText(text); }}
                            onEditSave={() => setEditingId(null)}
                            onEditChange={setEditingText}
                            requiresApproval={APPROVAL_REQUIRED_PAGES.has(draft.page.name)}
                            isPendingApproval={pendingApprovalIds.has(draft.id)}
                            onSubmitForApproval={() => handleSubmitForApproval(draft.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : viewMode === "compact" ? (
            /* ── Compact table ── */
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface-hover)" }}>
                    <th className="pl-4 pr-2 py-3 w-8">
                      <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={toggleAll} className="w-3.5 h-3.5 cursor-pointer" style={{ accentColor: "var(--primary)" }} />
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
                    <tr key={draft.id} style={{ borderBottom: "1px solid var(--border)" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-hover)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td className="pl-4 pr-2 py-3">
                        <input type="checkbox" checked={selected.has(draft.id)} onChange={() => toggleSelect(draft.id)}
                          className="w-3.5 h-3.5 cursor-pointer" style={{ accentColor: "var(--primary)" }} onClick={e => e.stopPropagation()} />
                      </td>
                      <td className="px-2 py-3">
                        <div className="w-6 h-6 flex items-center justify-center rounded" style={{ backgroundColor: draft.type === "reel" ? "rgba(236,72,153,0.12)" : "var(--surface-hover)" }}>
                          {draft.type === "reel"
                            ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          }
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "var(--surface-hover)", border: "1px solid var(--border)" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                          <span className="truncate max-w-[320px]" style={{ color: "var(--text)" }}>{draft.caption}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: draft.page.color }}>{draft.page.avatar}</div>
                          <span className="whitespace-nowrap text-[12px]" style={{ color: "var(--text-secondary)" }}>{draft.page.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">{draft.platforms.map(p => <PlatformIcon key={p} p={p} />)}</div>
                      </td>
                      <td className="px-3 py-3">
                        {draft.comments.length > 0
                          ? <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--primary)" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                              {draft.comments.length}
                            </span>
                          : <span style={{ color: "var(--text-muted)" }}>—</span>
                        }
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: draft.source === "bulk-upload" ? "rgba(99,102,241,0.12)" : "rgba(20,184,166,0.12)", color: draft.source === "bulk-upload" ? "#818CF8" : "#2DD4BF" }}>
                          {draft.source === "bulk-upload" ? "Bulk" : "Single"}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-[12px]" style={{ color: "var(--text-muted)" }}>{draft.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          {pendingApprovalIds.has(draft.id) ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                              style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.25)" }}>
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              Awaiting Approval
                            </span>
                          ) : APPROVAL_REQUIRED_PAGES.has(draft.page.name) ? (
                            <button onClick={() => handleSubmitForApproval(draft.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap"
                              style={{ backgroundColor: "rgba(251,191,36,0.1)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.3)" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                              Submit for Approval
                            </button>
                          ) : (
                            <button onClick={() => setScheduling(draft)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white whitespace-nowrap"
                              style={{ backgroundColor: "var(--primary)" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                              Schedule
                            </button>
                          )}
                          <button className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}
                            onClick={() => startUndoDelete(new Set([draft.id]))}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* ── Visual rows ── */
            <div className="space-y-2">
              {/* Select all bar */}
              <div className="flex items-center gap-3 px-1 mb-2">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll} className="w-3.5 h-3.5 cursor-pointer" style={{ accentColor: "var(--primary)" }} />
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Select all</span>
              </div>
              {filtered.map(draft => (
                <DraftRow
                  key={draft.id}
                  draft={draft}
                  viewMode="visual"
                  selected={selected.has(draft.id)}
                  onToggle={() => toggleSelect(draft.id)}
                  onSchedule={() => setScheduling(draft)}
                  onDelete={() => startUndoDelete(new Set([draft.id]))}
                  requiresApproval={APPROVAL_REQUIRED_PAGES.has(draft.page.name)}
                  isPendingApproval={pendingApprovalIds.has(draft.id)}
                  onSubmitForApproval={() => handleSubmitForApproval(draft.id)}
                  editingId={editingId}
                  editingText={editingText}
                  onEditStart={(id, text) => { setEditingId(id); setEditingText(text); }}
                  onEditSave={() => setEditingId(null)}
                  onEditChange={setEditingText}
                />
              ))}
            </div>
          )}

          {/* Summary bar */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <div className="flex items-center gap-4">
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  {filtered.filter(d => d.comments.length > 0).length} with thread comments
                </span>
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  {filtered.filter(d => d.source === "bulk-upload").length} from bulk upload · {filtered.filter(d => d.source === "single-post").length} from single post
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {scheduling && <ScheduleModal draft={scheduling} onClose={() => setScheduling(null)} onSchedule={handleSchedule} />}
        {showBulkThread && <BulkThreadModal count={selected.size} onClose={() => setShowBulkThread(false)} onApply={() => showToast(`Thread comment added to ${selected.size} drafts`)} />}
          {showAutoSchedule && (
            <BulkAutoScheduleModal
              drafts={[...selected].map(id => DRAFT_DATA.find(d => d.id === id)!).filter(Boolean)}
              onClose={() => setShowAutoSchedule(false)}
              onConfirm={handleBulkSchedule}
            />
          )}

        {/* Undo delete toast */}
        {undoToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", minWidth: 340 }}>
            <div className="flex-1">
              <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
                {undoToast.count} draft{undoToast.count > 1 ? "s" : ""} deleted
              </p>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(undoCountdown / 5) * 100}%`, backgroundColor: undoCountdown <= 2 ? "var(--error)" : "var(--primary)" }} />
              </div>
            </div>
            <button onClick={handleUndo}
              className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors"
              style={{ backgroundColor: "rgba(255,107,43,0.12)", color: "var(--primary)" }}>
              Undo ({undoCountdown}s)
            </button>
          </div>
        )}

        {/* Success toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-2xl z-50"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--success)" }}><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{toast}</span>
          </div>
        )}
      </main>

      {/* Backdrop for page filter dropdown */}
      {pageFilterOpen && <div className="fixed inset-0 z-20" onClick={() => setPageFilterOpen(false)} />}
    </div>
  );
}

// ── DraftRow component (shared between visual and group-by-page) ─────────────
function DraftRow({
  draft, viewMode, selected, onToggle, onSchedule, onDelete,
  editingId, editingText, onEditStart, onEditSave, onEditChange,
  requiresApproval, isPendingApproval, onSubmitForApproval,
}: {
  draft: Draft;
  viewMode: ViewMode;
  selected: boolean;
  onToggle: () => void;
  onSchedule: () => void;
  onDelete: () => void;
  editingId: string | null;
  editingText: string;
  onEditStart: (id: string, text: string) => void;
  onEditSave: () => void;
  onEditChange: (text: string) => void;
  requiresApproval?: boolean;
  isPendingApproval?: boolean;
  onSubmitForApproval?: () => void;
}) {
  const isEditing = editingId === draft.id;

  if (viewMode === "visual") {
    return (
      <div className="flex gap-4 p-4 rounded-xl border transition-all group"
        style={{ backgroundColor: selected ? "var(--surface-hover)" : "var(--surface)", borderColor: selected ? "var(--primary)" : "var(--border)" }}>
        {/* Checkbox */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
          <input type="checkbox" checked={selected} onChange={onToggle}
            className="w-4 h-4 cursor-pointer" style={{ accentColor: "var(--primary)" }} />
        </div>
        {/* Thumbnail 1:1 */}
        <div className="w-[120px] h-[120px] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden relative"
          style={{ backgroundColor: "var(--surface-hover)", border: "1px solid var(--border)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: "var(--text-muted)", opacity: 0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {draft.type === "reel" && (
            <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: "rgba(236,72,153,0.85)" }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Page + platforms */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: draft.page.color }}>{draft.page.avatar}</div>
              <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{draft.page.name}</span>
              <div className="flex gap-1">{draft.platforms.map(p => <span key={p} className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>{p.toUpperCase()}</span>)}</div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto" style={{ backgroundColor: draft.source === "bulk-upload" ? "rgba(99,102,241,0.12)" : "rgba(20,184,166,0.12)", color: draft.source === "bulk-upload" ? "#818CF8" : "#2DD4BF" }}>
                {draft.source === "bulk-upload" ? "Bulk" : "Single"}
              </span>
            </div>
            {/* Caption — editable on click */}
            {isEditing ? (
              <textarea
                autoFocus
                value={editingText}
                onChange={e => onEditChange(e.target.value)}
                onBlur={onEditSave}
                onKeyDown={e => { if (e.key === "Escape") onEditSave(); if (e.key === "Enter" && e.metaKey) onEditSave(); }}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-[13px] resize-none outline-none"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--primary)" }}
              />
            ) : (
              <p
                className="text-[13px] cursor-text leading-relaxed"
                style={{ color: "var(--text)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                onClick={() => onEditStart(draft.id, draft.caption)}
                title="Click to edit caption"
              >
                {draft.caption}
              </p>
            )}
            {!isEditing && (
              <p className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--primary)" }}>
                Click caption to edit
              </p>
            )}
          </div>
          {/* Thread preview */}
          {draft.comments.length > 0 && (
            <div className="mt-2 flex items-start gap-1.5 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,107,43,0.06)", border: "1px solid rgba(255,107,43,0.15)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span className="text-[11px] truncate" style={{ color: "var(--primary)" }}>{draft.comments[0].text}</span>
              {draft.comments.length > 1 && <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>+{draft.comments.length - 1} more</span>}
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="flex flex-col items-end justify-between flex-shrink-0">
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{draft.createdAt}</span>
          <div className="flex gap-2">
            {isPendingApproval ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.25)" }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Awaiting Approval
              </span>
            ) : requiresApproval ? (
              <button onClick={onSubmitForApproval}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap"
                style={{ backgroundColor: "rgba(251,191,36,0.1)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.3)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                Submit for Approval
              </button>
            ) : (
              <button onClick={onSchedule}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                style={{ backgroundColor: "var(--primary)" }}>
                Schedule
              </button>
            )}
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // compact in group-by-page mode
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors group"
      style={{ backgroundColor: selected ? "rgba(255,107,43,0.04)" : "transparent" }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.backgroundColor = "transparent"; }}>
      <input type="checkbox" checked={selected} onChange={onToggle}
        className="w-3.5 h-3.5 cursor-pointer flex-shrink-0" style={{ accentColor: "var(--primary)" }} />
      <div className="w-6 h-6 flex items-center justify-center rounded flex-shrink-0" style={{ backgroundColor: draft.type === "reel" ? "rgba(236,72,153,0.12)" : "var(--surface-hover)" }}>
        {draft.type === "reel"
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        }
      </div>
      <span className="flex-1 text-[13px] truncate" style={{ color: "var(--text)" }}>{draft.caption}</span>
      <div className="flex items-center gap-1 flex-shrink-0">{draft.platforms.map(p => <span key={p} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>{p.toUpperCase()}</span>)}</div>
      {draft.comments.length > 0 && (
        <span className="flex items-center gap-1 text-[11px] flex-shrink-0" style={{ color: "var(--primary)" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          {draft.comments.length}
        </span>
      )}
      <span className="text-[11px] flex-shrink-0 w-[120px] text-right" style={{ color: "var(--text-muted)" }}>{draft.createdAt}</span>
      <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onSchedule}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white"
          style={{ backgroundColor: "var(--primary)" }}>Schedule</button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    </div>
  );
}

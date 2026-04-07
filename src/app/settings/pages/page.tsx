"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import { BATCH_CONFIG } from "@/contexts/RoleContext";

interface PostingId {
  connId: string;
  name: string;
  email: string;
  fbUserId: string;
  status: "active" | "expired" | "throttled";
  postsThisWeek: number;
  avgReach: string;
  avgReachRaw: number;
  reachTrend: "up" | "down" | "stable";
  lastUsed: string;
  isPrimary: boolean;
  slot: number;
}

interface PageData {
  id: string;
  name: string;
  avatar: string;
  color: string;
  followers: string;
  category: string;
  platforms: string[];
  tokenStatus: "active" | "expiring" | "expired";
  tokenExpiry: string;
  autoPost: boolean;
  autoPostIG: boolean;
  autoPostTH: boolean;
  postInterval: number; // in hours
  timezone: string;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
  monetized: boolean;
  postingIds: PostingId[];
  rotateIds: boolean;
  rotationMode: "round-robin" | "performance";
  approvalRequired: boolean;
  approvalMode: "single" | "multi";
  autoPublishOnApproval: boolean;
  approvers: string[];
}

const PAGES_DATA: PageData[] = [
  { id: "lc",  name: "Laugh Central",     avatar: "LC", color: "#8B5CF6", followers: "3.2M",  category: "Comedy",          platforms: ["facebook","instagram"],           tokenStatus: "active",   tokenExpiry: "Jun 15, 2026", autoPost: true,  autoPostIG: true,  autoPostTH: false, postInterval: 2.5, timezone: "EST", quietHours: true,  quietStart: "23:00", quietEnd: "08:00", monetized: true,
    postingIds: [
      { connId: "c1", name: "Taimur Asghar",  email: "taimur@metareverse.com", fbUserId: "100089...", status: "active",    postsThisWeek: 34, avgReach: "22.1K", avgReachRaw: 22100, reachTrend: "up",     lastUsed: "2h ago",   isPrimary: true,  slot: 1 },
      { connId: "c2", name: "Sarah Khan",      email: "sarah@partner-a.com",   fbUserId: "100092...", status: "active",    postsThisWeek: 28, avgReach: "17.4K", avgReachRaw: 17400, reachTrend: "stable", lastUsed: "5h ago",   isPrimary: false, slot: 2 },
    ], rotateIds: true, rotationMode: "round-robin", approvalRequired: true, approvalMode: "single", autoPublishOnApproval: true, approvers: ["Taimur Asghar"],
  },
  { id: "hu",  name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M",  category: "Education",       platforms: ["facebook","instagram","threads"], tokenStatus: "active",   tokenExpiry: "May 28, 2026", autoPost: true,  autoPostIG: true,  autoPostTH: true,  postInterval: 3,   timezone: "EST", quietHours: true,  quietStart: "22:00", quietEnd: "07:00", monetized: true,
    postingIds: [
      { connId: "c1", name: "Taimur Asghar",  email: "taimur@metareverse.com", fbUserId: "100089...", status: "active",    postsThisWeek: 40, avgReach: "31.2K", avgReachRaw: 31200, reachTrend: "up",     lastUsed: "1h ago",   isPrimary: true,  slot: 1 },
      { connId: "c2", name: "Sarah Khan",      email: "sarah@partner-a.com",   fbUserId: "100092...", status: "active",    postsThisWeek: 25, avgReach: "19.8K", avgReachRaw: 19800, reachTrend: "stable", lastUsed: "4h ago",   isPrimary: false, slot: 2 },
      { connId: "c3", name: "Ahmed Raza",      email: "ahmed@partner-b.com",   fbUserId: "100095...", status: "throttled", postsThisWeek: 8,  avgReach: "3.9K",  avgReachRaw: 3900,  reachTrend: "down",   lastUsed: "2d ago",   isPrimary: false, slot: 3 },
    ], rotateIds: true, rotationMode: "performance", approvalRequired: true, approvalMode: "multi", autoPublishOnApproval: false, approvers: ["Taimur Asghar", "Sarah Khan"],
  },
  { id: "tb",  name: "TechByte",          avatar: "TB", color: "#14B8A6", followers: "1.1M",  category: "Technology",      platforms: ["facebook","instagram","threads"], tokenStatus: "expiring", tokenExpiry: "Apr 2, 2026",  autoPost: true,  autoPostIG: false, autoPostTH: false, postInterval: 2,   timezone: "PST", quietHours: false, quietStart: "23:00", quietEnd: "07:00", monetized: true,
    postingIds: [
      { connId: "c1", name: "Taimur Asghar",  email: "taimur@metareverse.com", fbUserId: "100089...", status: "active",    postsThisWeek: 22, avgReach: "14.5K", avgReachRaw: 14500, reachTrend: "stable", lastUsed: "3h ago",   isPrimary: true,  slot: 1 },
      { connId: "c3", name: "Ahmed Raza",      email: "ahmed@partner-b.com",   fbUserId: "100095...", status: "expired",   postsThisWeek: 0,  avgReach: "—",     avgReachRaw: 0,     reachTrend: "down",   lastUsed: "5d ago",   isPrimary: false, slot: 2 },
    ], rotateIds: false, rotationMode: "round-robin", approvalRequired: false, approvalMode: "single", autoPublishOnApproval: true, approvers: ["Taimur Asghar"],
  },
  { id: "mm",  name: "Money Matters",     avatar: "MM", color: "#F59E0B", followers: "680K",  category: "Finance",         platforms: ["facebook","instagram"],           tokenStatus: "active",   tokenExpiry: "Jul 10, 2026", autoPost: false, autoPostIG: false, autoPostTH: false, postInterval: 4,   timezone: "EST", quietHours: false, quietStart: "23:00", quietEnd: "07:00", monetized: false,
    postingIds: [
      { connId: "c1", name: "Taimur Asghar",  email: "taimur@metareverse.com", fbUserId: "100089...", status: "active",    postsThisWeek: 0,  avgReach: "8.2K",  avgReachRaw: 8200,  reachTrend: "down",   lastUsed: "7d ago",   isPrimary: true,  slot: 1 },
    ], rotateIds: false, rotationMode: "round-robin", approvalRequired: false, approvalMode: "single", autoPublishOnApproval: true, approvers: [],
  },
  { id: "dh",  name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K",  category: "Health",          platforms: ["facebook"],                       tokenStatus: "active",   tokenExpiry: "Aug 1, 2026",  autoPost: true,  autoPostIG: false, autoPostTH: false, postInterval: 4,   timezone: "CST", quietHours: true,  quietStart: "21:00", quietEnd: "07:00", monetized: true,
    postingIds: [
      { connId: "c1", name: "Taimur Asghar",  email: "taimur@metareverse.com", fbUserId: "100089...", status: "active",    postsThisWeek: 18, avgReach: "11.3K", avgReachRaw: 11300, reachTrend: "up",     lastUsed: "6h ago",   isPrimary: true,  slot: 1 },
      { connId: "c2", name: "Sarah Khan",      email: "sarah@partner-a.com",   fbUserId: "100092...", status: "active",    postsThisWeek: 14, avgReach: "9.7K",  avgReachRaw: 9700,  reachTrend: "stable", lastUsed: "8h ago",   isPrimary: false, slot: 2 },
    ], rotateIds: true, rotationMode: "round-robin", approvalRequired: false, approvalMode: "single", autoPublishOnApproval: true, approvers: ["Taimur Asghar"],
  },
  { id: "ff",  name: "Fitness Factory",   avatar: "FF", color: "#EC4899", followers: "310K",  category: "Fitness",         platforms: ["facebook"],                       tokenStatus: "expired",  tokenExpiry: "Mar 15, 2026", autoPost: false, autoPostIG: false, autoPostTH: false, postInterval: 3,   timezone: "EST", quietHours: false, quietStart: "23:00", quietEnd: "07:00", monetized: true,
    postingIds: [
      { connId: "c1", name: "Taimur Asghar",  email: "taimur@metareverse.com", fbUserId: "100089...", status: "active",    postsThisWeek: 0,  avgReach: "6.8K",  avgReachRaw: 6800,  reachTrend: "down",   lastUsed: "12d ago",  isPrimary: true,  slot: 1 },
      { connId: "c2", name: "Sarah Khan",      email: "sarah@partner-a.com",   fbUserId: "100092...", status: "expired",   postsThisWeek: 0,  avgReach: "5.1K",  avgReachRaw: 5100,  reachTrend: "down",   lastUsed: "12d ago",  isPrimary: false, slot: 2 },
    ], rotateIds: false, rotationMode: "round-robin", approvalRequired: false, approvalMode: "single", autoPublishOnApproval: true, approvers: [],
  },
  { id: "khn", name: "Know Her Name",     avatar: "KH", color: "#0EA5E9", followers: "136K",  category: "Women's History", platforms: ["facebook","instagram","threads"], tokenStatus: "active",   tokenExpiry: "Sep 20, 2026", autoPost: true,  autoPostIG: true,  autoPostTH: false, postInterval: 2.5, timezone: "EST", quietHours: false, quietStart: "23:00", quietEnd: "07:00", monetized: false,
    postingIds: [
      { connId: "c1", name: "Taimur Asghar",  email: "taimur@metareverse.com", fbUserId: "100089...", status: "active",    postsThisWeek: 12, avgReach: "7.4K",  avgReachRaw: 7400,  reachTrend: "up",     lastUsed: "4h ago",   isPrimary: true,  slot: 1 },
    ], rotateIds: false, rotationMode: "round-robin", approvalRequired: false, approvalMode: "single", autoPublishOnApproval: true, approvers: [],
  },
];

const BATCH_COLORS = ["#F59E0B","#8B5CF6","#EC4899","#14B8A6","#FF6B2B","#6366F1","#0EA5E9","#10B981"];
const INTERVAL_OPTIONS = [1, 1.5, 2, 2.5, 3, 4, 6, 8];
const TIMEZONES = ["EST","CST","MST","PST","GMT","UTC","IST","PKT","SGT","AEST"];

interface BatchDefaults {
  interval: number;
  timezone: string;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
}
interface Batch {
  id: string;
  name: string;
  pages: string[];
  color: string;
  defaults?: BatchDefaults;
}
const INITIAL_BATCHES: Batch[] = [
  { id: "b1", name: "Partner A — Lifestyle",  pages: ["lc","ff","dh"],  color: "#F59E0B", defaults: { interval: 3,   timezone: "EST", quietHours: true,  quietStart: "23:00", quietEnd: "07:00" } },
  { id: "b2", name: "Partner B — Education",  pages: ["hu","tb","mm"],  color: "#8B5CF6", defaults: { interval: 2,   timezone: "EST", quietHours: false, quietStart: "23:00", quietEnd: "07:00" } },
  { id: "b3", name: "Partner C — Women's",    pages: ["khn"],           color: "#EC4899", defaults: { interval: 2.5, timezone: "EST", quietHours: false, quietStart: "23:00", quietEnd: "07:00" } },
];

// ── Batch Modal ──────────────────────────────────────────────────────────────
function BatchModal({ batch, onSave, onDelete, onClose }: { batch?: Batch | null; onSave: (b: Omit<Batch,"id">) => void; onDelete?: () => void; onClose: () => void }) {
  const [name, setName] = useState(batch?.name ?? "");
  const [selectedPages, setSelectedPages] = useState<string[]>(batch?.pages ?? []);
  const [color, setColor] = useState(batch?.color ?? BATCH_COLORS[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toggle = (id: string) => setSelectedPages(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="w-[560px] rounded-2xl border shadow-2xl" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>{batch ? "Edit Batch" : "Create New Batch"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Batch Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Partner A — Lifestyle"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none border"
              style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Color</label>
            <div className="flex gap-2">
              {BATCH_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-full relative hover:scale-110 transition-transform" style={{ backgroundColor: c }}>
                  {color === c && <svg className="absolute inset-0 m-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Pages in this batch <span style={{ color: "var(--primary)" }}>({selectedPages.length} selected)</span></label>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {PAGES_DATA.map(page => {
                const checked = selectedPages.includes(page.id);
                return (
                  <button key={page.id} onClick={() => toggle(page.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
                    style={{ backgroundColor: checked ? `${color}12` : "var(--surface-hover)", borderColor: checked ? color : "transparent" }}>
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: checked ? color : "var(--surface-active)", border: checked ? "none" : "1px solid var(--border)" }}>
                      {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: page.color }}>{page.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm" style={{ color: "var(--text)" }}>{page.name}</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{page.followers} followers · {page.category}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${page.tokenStatus === "active" ? "text-green-400 bg-green-400/10" : page.tokenStatus === "expiring" ? "text-amber-400 bg-amber-400/10" : "text-red-400 bg-red-400/10"}`}>
                      {page.tokenStatus === "active" ? "Active" : page.tokenStatus === "expiring" ? "Expiring" : "Expired"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "var(--border)" }}>
          {batch && onDelete ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Are you sure?</span>
                <button onClick={onDelete} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-red-500">Delete</button>
                <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg text-sm" style={{ color: "var(--text-muted)", backgroundColor: "var(--surface-hover)" }}>Cancel</button>
              </div>
            ) : selectedPages.length > 0 ? (
              <div className="relative group">
                <button disabled className="text-sm font-medium flex items-center gap-1.5 opacity-40 cursor-not-allowed" style={{ color: "var(--text-muted)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                  Delete Batch
                </button>
                <div className="absolute bottom-full left-0 mb-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" style={{ backgroundColor: "var(--surface-active)", color: "var(--text)", border: "1px solid var(--border)" }}>
                  Reassign all pages before deleting this batch
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="text-sm font-medium text-red-400 flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                Delete Batch
              </button>
            )
          ) : <div />}
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>Cancel</button>
            <button onClick={() => name.trim() && selectedPages.length > 0 && onSave({ name: name.trim(), pages: selectedPages, color })}
              disabled={!name.trim() || selectedPages.length === 0}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
              style={{ backgroundColor: "var(--primary)" }}>
              {batch ? "Save Changes" : "Create Batch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Schedule Preview ─────────────────────────────────────────────────────────
function SchedulePreview({ interval, quietHours, quietStart, quietEnd, timezone }: {
  interval: number; quietHours: boolean; quietStart: string; quietEnd: string; timezone: string;
}) {
  const [view, setView] = useState<"today" | "week">("today");

  const qStartH = parseInt(quietStart.split(":")[0]);
  const qEndH   = parseInt(quietEnd.split(":")[0]);

  const isBlocked = (h: number) => {
    if (!quietHours) return false;
    if (qStartH > qEndH) return h >= qStartH || h < qEndH;
    return h >= qStartH && h < qEndH;
  };

  // Generate slots for a given day offset (0=today)
  const generateSlots = () => {
    const slots: { hour: number; min: number; blocked: boolean }[] = [];
    let current = 6 * 60;
    const end = 24 * 60;
    while (current < end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push({ hour: h, min: m, blocked: isBlocked(h) });
      current += interval * 60;
    }
    return slots;
  };

  const slots = generateSlots();
  const activeSlots = slots.filter(s => !s.blocked);
  const blockedSlots = slots.filter(s => s.blocked);

  const fmt = (h: number, m: number) => {
    const p = h >= 12 ? "PM" : "AM";
    const dh = h % 12 === 0 ? 12 : h % 12;
    return `${dh}:${m.toString().padStart(2,"0")} ${p}`;
  };

  // Week view: generate 7 days with post counts
  const DAY_LABELS = ["Today", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekData = DAY_LABELS.map((label, i) => {
    // Weekends have slightly different quiet hours in practice — simulate small variation
    const daySlots = generateSlots();
    const active = daySlots.filter(s => !s.blocked).length;
    // Simulate weekend gap: Sat/Sun = lower activity
    const adjusted = label === "Sat" ? Math.max(1, active - 1) : label === "Sun" ? Math.max(0, active - 2) : active;
    return { label, count: adjusted, total: daySlots.length };
  });
  const maxCount = Math.max(...weekData.map(d => d.count), 1);

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Schedule Preview</span>
        <div className="flex gap-1 p-0.5 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
          {(["today","week"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-2.5 py-1 rounded text-[10px] font-semibold capitalize transition-all"
              style={{ backgroundColor: view === v ? "var(--primary)" : "transparent", color: view === v ? "white" : "var(--text-muted)" }}>
              {v === "today" ? "Today" : "This Week"}
            </button>
          ))}
        </div>
      </div>

      {view === "today" ? (
        <div className="p-3">
          {/* Summary */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>
              {activeSlots.length} active · {blockedSlots.length} blocked
            </span>
          </div>
          {/* Timeline bar */}
          <div className="relative h-8 rounded-lg overflow-hidden mb-3" style={{ backgroundColor: "var(--surface-hover)" }}>
            {slots.map((slot, i) => {
              const pct = ((slot.hour * 60 + slot.min - 360) / (18 * 60)) * 100;
              if (pct < 0 || pct > 100) return null;
              return (
                <div key={i} className="absolute top-1 bottom-1 w-1.5 rounded-full"
                  style={{ left: `${Math.min(pct, 97)}%`, backgroundColor: slot.blocked ? "rgba(239,68,68,0.4)" : "var(--primary)" }}
                  title={fmt(slot.hour, slot.min)} />
              );
            })}
            {quietHours && (() => {
              const dayStart = 6 * 60;
              const dayEnd = 24 * 60;
              const dayRange = dayEnd - dayStart;
              const qsMin = qStartH * 60;
              if (qsMin > dayStart) {
                const left = ((qsMin - dayStart) / dayRange) * 100;
                const width = ((dayEnd - qsMin) / dayRange) * 100;
                return (
                  <div className="absolute top-0 bottom-0 rounded-r-lg"
                    style={{ left: `${left}%`, width: `${width}%`, backgroundColor: "rgba(239,68,68,0.08)", borderLeft: "1px dashed rgba(239,68,68,0.4)" }} />
                );
              }
              return null;
            })()}
          </div>
          {/* Hour labels */}
          <div className="flex justify-between mb-3">
            {["6am","9am","12pm","3pm","6pm","9pm","12am"].map(l => (
              <span key={l} className="text-[9px]" style={{ color: "var(--text-muted)" }}>{l}</span>
            ))}
          </div>
          {/* Slot pills */}
          <div className="flex flex-wrap gap-1.5">
            {slots.map((slot, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: slot.blocked ? "rgba(239,68,68,0.1)" : "rgba(255,107,43,0.12)",
                  color: slot.blocked ? "#EF4444" : "var(--primary)",
                  textDecoration: slot.blocked ? "line-through" : "none",
                  opacity: slot.blocked ? 0.6 : 1,
                }}>
                {fmt(slot.hour, slot.min)}
              </span>
            ))}
          </div>
          {quietHours && blockedSlots.length > 0 && (
            <p className="text-[10px] mt-2.5" style={{ color: "var(--text-muted)" }}>
              🌙 Quiet {fmt(qStartH, 0)} – {fmt(qEndH, 0)} · {blockedSlots.length} slot{blockedSlots.length !== 1 ? "s" : ""} skipped
            </p>
          )}
          <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
            All times in {timezone} · New uploads slot into next available ↑
          </p>
        </div>
      ) : (
        <div className="p-3">
          {/* Bar chart */}
          <div className="flex items-end gap-1.5 h-24 mb-2">
            {weekData.map((day, i) => {
              const heightPct = day.count === 0 ? 0 : Math.max(12, (day.count / maxCount) * 100);
              const isGap = day.count === 0;
              const isToday = i === 0;
              return (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-medium" style={{ color: isGap ? "#EF4444" : isToday ? "var(--primary)" : "var(--text-muted)" }}>
                    {day.count === 0 ? "!" : day.count}
                  </span>
                  <div className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: isGap ? "rgba(239,68,68,0.2)" : isToday ? "var(--primary)" : "rgba(255,107,43,0.3)",
                      border: isGap ? "1px dashed rgba(239,68,68,0.4)" : "none",
                      minHeight: isGap ? 8 : 0,
                    }} />
                </div>
              );
            })}
          </div>
          {/* Day labels */}
          <div className="flex gap-1.5 mb-3">
            {weekData.map((day, i) => (
              <div key={day.label} className="flex-1 text-center">
                <span className="text-[9px] font-medium" style={{ color: i === 0 ? "var(--primary)" : "var(--text-muted)" }}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
          {/* Summary row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {weekData.reduce((a, d) => a + d.count, 0)} posts this week
            </span>
            {weekData.some(d => d.count === 0) && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {weekData.filter(d => d.count === 0).length} gap{weekData.filter(d => d.count === 0).length !== 1 ? "s" : ""}
              </span>
            )}
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>· {timezone}</span>
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>
            Every {interval}h · Active hours {quietHours ? "on" : "off"} · Gaps = no posts scheduled
          </p>
        </div>
      )}
    </div>
  );
}

// ── Batch Defaults Panel ─────────────────────────────────────────────────────
function BatchDefaultsPanel({
  batch, onSave, onClose,
}: {
  batch: Batch;
  onSave: (id: string, defaults: BatchDefaults) => void;
  onClose: () => void;
}) {
  const init = batch.defaults ?? { interval: 2, timezone: "EST", quietHours: false, quietStart: "23:00", quietEnd: "07:00" };
  const [interval, setInterval] = useState(init.interval);
  const [timezone, setTimezone] = useState(init.timezone);
  const [quietHours, setQuietHours] = useState(init.quietHours);
  const [quietStart, setQuietStart] = useState(init.quietStart);
  const [quietEnd, setQuietEnd] = useState(init.quietEnd);
  const [saved, setSaved] = useState(false);
  const batchPages = batch.pages.map(pid => PAGES_DATA.find(p => p.id === pid)).filter(Boolean);

  const handleSave = () => {
    onSave(batch.id, { interval, timezone, quietHours, quietStart, quietEnd });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: batch.color, boxShadow: `0 0 0 1px ${batch.color}30` }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-hover)" }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 text-sm" style={{ backgroundColor: batch.color }}>
          {batch.pages.length}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[15px]" style={{ color: "var(--text)" }}>{batch.name}</h3>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{batch.pages.length} pages · Batch defaults</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)", backgroundColor: "var(--surface)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Info banner */}
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl" style={{ backgroundColor: `${batch.color}12`, border: `1px solid ${batch.color}30` }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={batch.color} strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-[11px] leading-relaxed" style={{ color: batch.color }}>
            These defaults apply to all {batch.pages.length} pages in this batch. Individual pages can override any setting.
          </p>
        </div>

        {/* Interval */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Post Interval (all pages)</label>
          <div className="flex flex-wrap gap-1.5">
            {INTERVAL_OPTIONS.map(h => (
              <button key={h} onClick={() => setInterval(h)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={{ backgroundColor: interval === h ? "var(--primary)" : "var(--bg)", color: interval === h ? "white" : "var(--text-secondary)", border: `1px solid ${interval === h ? "var(--primary)" : "var(--border)"}` }}>
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Timezone (all pages)</label>
          <select value={timezone} onChange={e => setTimezone(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-[13px]"
            style={{ backgroundColor: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }}>
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>

        {/* Active hours */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: "var(--bg)" }}>
            <div>
              <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Active Hours</span>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Posts only sent during this window</p>
            </div>
            <Toggle on={quietHours} onChange={setQuietHours} />
          </div>
          {quietHours && (
            <div className="flex items-center gap-3 px-4 py-3 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
              <div className="flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>From</label>
                <input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-[12px]"
                  style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }} />
              </div>
              <span className="text-[12px] mt-4" style={{ color: "var(--text-muted)" }}>until</span>
              <div className="flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Until</label>
                <input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-[12px]"
                  style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }} />
              </div>
            </div>
          )}
        </div>

        {/* Schedule preview */}
        <SchedulePreview interval={interval} quietHours={quietHours} quietStart={quietStart} quietEnd={quietEnd} timezone={timezone} />

        {/* Pages in batch */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Pages Using These Defaults</div>
          <div className="flex flex-col gap-1.5">
            {batchPages.map(p => p && (
              <div key={p.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: p.color }}>{p.avatar}</div>
                <span className="text-[12px] flex-1" style={{ color: "var(--text)" }}>{p.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${batch.color}15`, color: batch.color }}>batch default</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save footer */}
      <div className="px-5 pb-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Changes apply to all pages unless overridden
        </span>
        <button onClick={handleSave}
          className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white flex items-center gap-2"
          style={{ backgroundColor: saved ? "var(--success)" : "var(--primary)", boxShadow: "0 2px 10px var(--primary-glow)" }}>
          {saved ? (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Saved!</>
          ) : "Apply to All Pages"}
        </button>
      </div>
    </div>
  );
}

// ── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className="w-10 h-5 rounded-full relative transition-colors flex-shrink-0"
      style={{ backgroundColor: on ? "var(--success)" : "var(--surface-active)" }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
        style={{ left: on ? "22px" : "2px" }} />
    </button>
  );
}

// ── Per-card editable state ───────────────────────────────────────────────────
type CardEdits = {
  autoPost?: boolean;
  autoPostIG?: boolean;
  autoPostTH?: boolean;
  postInterval?: number;
  timezone?: string;
  rotateIds?: boolean;
  monetized?: boolean;
  approvalRequired?: boolean;
  autoPublishOnApproval?: boolean;
};

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PageSettings() {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [viewingBatchDefaults, setViewingBatchDefaults] = useState<Batch | null>(null);
  const [timezoneMode, setTimezoneMode] = useState<"local" | "page">("page");
  const [showApprovalGuard, setShowApprovalGuard] = useState(false);

  // Per-card editable state (card grid changes)
  const [cardEdits, setCardEdits] = useState<Record<string, CardEdits>>({});
  const [cardSaved, setCardSaved] = useState<Record<string, boolean>>({});

  // Right panel edit state (for selected page detail)
  const [editState, setEditState] = useState<Partial<PageData>>({});
  const [panelSaved, setPanelSaved] = useState(false);

  // Per-page direct assignments (page id → array of member names)
  const [directAssignments, setDirectAssignments] = useState<Record<string, string[]>>({
    lc: ["Fatima Ali"],
  });
  const [showAddMember, setShowAddMember] = useState<"team" | "invite" | false>(false);
  const [pageInviteForm, setPageInviteForm] = useState({ name: "", email: "", role: "" });
  const [pageInviteToast, setPageInviteToast] = useState(false);

  function updateCard(pageId: string, field: keyof CardEdits, value: unknown) {
    setCardEdits(prev => ({ ...prev, [pageId]: { ...prev[pageId], [field]: value } }));
    setCardSaved(prev => ({ ...prev, [pageId]: false }));
  }

  function saveCard(pageId: string) {
    setCardSaved(prev => ({ ...prev, [pageId]: true }));
    setTimeout(() => setCardSaved(prev => ({ ...prev, [pageId]: false })), 2000);
  }

  function cardVal<K extends keyof PageData>(page: PageData, field: K): PageData[K] {
    const edits = cardEdits[page.id] as Partial<PageData> | undefined;
    return edits && field in edits ? (edits[field] as PageData[K]) : page[field];
  }

  function hasCardChanges(pageId: string) {
    return Object.keys(cardEdits[pageId] ?? {}).length > 0;
  }

  function getPageStatus(page: PageData): { label: string; color: string; bg: string } {
    const totalPostsThisWeek = page.postingIds.reduce((s, id) => s + id.postsThisWeek, 0);
    const allIdsExpired = page.postingIds.length > 0 && page.postingIds.every(id => id.status === "expired");
    if (page.tokenStatus === "expired" || allIdsExpired)
      return { label: "Token Expired",   color: "#EF4444", bg: "rgba(239,68,68,0.1)"   };
    if (page.tokenStatus === "expiring")
      return { label: "Token Expiring",  color: "#FBBF24", bg: "rgba(251,191,36,0.1)"  };
    if (!page.autoPost && totalPostsThisWeek === 0)
      return { label: "Needs Setup",     color: "#F97316", bg: "rgba(249,115,22,0.1)"  };
    if (!page.autoPost)
      return { label: "Paused",          color: "#94A3B8", bg: "rgba(148,163,184,0.1)" };
    if (totalPostsThisWeek === 0)
      return { label: "Inactive",        color: "#FBBF24", bg: "rgba(251,191,36,0.1)"  };
    return   { label: "Active",          color: "#4ADE80", bg: "rgba(74,222,128,0.1)"  };
  }

  const basePage = PAGES_DATA.find(p => p.id === selectedPageId);
  const selected = basePage ? { ...basePage, ...editState } : null;

  const selectPage = (id: string) => {
    setSelectedPageId(id);
    setEditState({});
    setPanelSaved(false);
    setShowAddMember(false);
    setPageInviteToast(false);
  };

  const update = (field: keyof PageData, value: unknown) => {
    setEditState(prev => ({ ...prev, [field]: value }));
    setPanelSaved(false);
  };

  const handleBatchDefaultsSave = (batchId: string, defaults: BatchDefaults) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, defaults } : b));
  };

  const handlePanelSave = () => {
    setPanelSaved(true);
    setTimeout(() => setPanelSaved(false), 2500);
  };

  const hasChanges = Object.keys(editState).length > 0;

  // ── Filter + Group state ──────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterMonetized, setFilterMonetized] = useState("all");
  const [groupBy, setGroupBy] = useState<"none" | "batch" | "status" | "platform">("none");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  function toggleGroup(key: string) {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const activeFilterCount = [
    filterBatch !== "all", filterStatus !== "all",
    filterPlatform !== "all", filterMonetized !== "all", search.length > 0,
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch(""); setFilterBatch("all"); setFilterStatus("all");
    setFilterPlatform("all"); setFilterMonetized("all");
  }

  // Apply filters
  const filteredPages = PAGES_DATA.filter(page => {
    const status = getPageStatus(page);
    if (search && !page.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterBatch !== "all") {
      const b = batches.find(b => b.pages.includes(page.id));
      if (filterBatch === "__none__") { if (b) return false; }
      else if (!b || b.id !== filterBatch) return false;
    }
    if (filterStatus !== "all" && status.label !== filterStatus) return false;
    if (filterPlatform !== "all" && !page.platforms.includes(filterPlatform)) return false;
    if (filterMonetized === "yes" && !page.monetized) return false;
    if (filterMonetized === "no" && page.monetized) return false;
    return true;
  });

  // Apply grouping
  type Group = { key: string; label: string; color?: string; pages: typeof PAGES_DATA };
  function buildGroups(): Group[] {
    if (groupBy === "none") return [{ key: "__all__", label: "", pages: filteredPages }];
    if (groupBy === "batch") {
      const groups: Group[] = batches.map(b => ({
        key: b.id, label: b.name, color: b.color,
        pages: filteredPages.filter(p => b.pages.includes(p.id)),
      })).filter(g => g.pages.length > 0);
      const unbatched = filteredPages.filter(p => !batches.some(b => b.pages.includes(p.id)));
      if (unbatched.length > 0) groups.push({ key: "__none__", label: "No Batch", pages: unbatched });
      return groups;
    }
    if (groupBy === "status") {
      const statusOrder = ["Active","Paused","Needs Setup","Inactive","Token Expiring","Token Expired"];
      const map = new Map<string, typeof PAGES_DATA>();
      filteredPages.forEach(p => {
        const s = getPageStatus(p).label;
        map.set(s, [...(map.get(s) ?? []), p]);
      });
      return statusOrder.filter(s => map.has(s)).map(s => ({ key: s, label: s, pages: map.get(s)! }));
    }
    if (groupBy === "platform") {
      return [
        { key: "facebook",  label: "Facebook",           pages: filteredPages.filter(p => p.platforms.includes("facebook")) },
        { key: "instagram", label: "Instagram",           pages: filteredPages.filter(p => p.platforms.includes("instagram")) },
        { key: "threads",   label: "Threads",             pages: filteredPages.filter(p => p.platforms.includes("threads")) },
      ].filter(g => g.pages.length > 0);
    }
    return [{ key: "__all__", label: "", pages: filteredPages }];
  }

  const groups = buildGroups();

  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 p-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[28px] font-bold" style={{ color: "var(--text)" }}>Page Settings</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Edit settings inline — click a row to open the detail panel for Posting IDs and Active Hours</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreateBatch(true)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              + New Batch
            </button>
            <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
              + Connect New Page
            </button>
          </div>
        </div>

        <div className={`grid gap-8 items-start ${selectedPageId || viewingBatchDefaults ? "grid-cols-[1fr_400px]" : "grid-cols-1"}`}>
          {/* ── Left: Airtable-style table ── */}
          <div className="overflow-x-auto">

            {/* ── Toolbar ── */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search pages…" value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-7 pr-3 py-1.5 rounded-lg text-[12px] outline-none w-44"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </div>

              {/* Filter: Batch */}
              <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-[12px] outline-none"
                style={{ background: filterBatch !== "all" ? "var(--primary-muted)" : "var(--surface)", border: `1px solid ${filterBatch !== "all" ? "var(--primary)" : "var(--border)"}`, color: filterBatch !== "all" ? "var(--primary)" : "var(--text-muted)" }}>
                <option value="all">All Batches</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                <option value="__none__">No Batch</option>
              </select>

              {/* Filter: Status */}
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-[12px] outline-none"
                style={{ background: filterStatus !== "all" ? "var(--primary-muted)" : "var(--surface)", border: `1px solid ${filterStatus !== "all" ? "var(--primary)" : "var(--border)"}`, color: filterStatus !== "all" ? "var(--primary)" : "var(--text-muted)" }}>
                <option value="all">All Statuses</option>
                {["Active","Paused","Needs Setup","Inactive","Token Expiring","Token Expired"].map(s => <option key={s}>{s}</option>)}
              </select>

              {/* Filter: Platform */}
              <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-[12px] outline-none"
                style={{ background: filterPlatform !== "all" ? "var(--primary-muted)" : "var(--surface)", border: `1px solid ${filterPlatform !== "all" ? "var(--primary)" : "var(--border)"}`, color: filterPlatform !== "all" ? "var(--primary)" : "var(--text-muted)" }}>
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="threads">Threads</option>
              </select>

              {/* Filter: Monetized */}
              <select value={filterMonetized} onChange={e => setFilterMonetized(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-[12px] outline-none"
                style={{ background: filterMonetized !== "all" ? "var(--primary-muted)" : "var(--surface)", border: `1px solid ${filterMonetized !== "all" ? "var(--primary)" : "var(--border)"}`, color: filterMonetized !== "all" ? "var(--primary)" : "var(--text-muted)" }}>
                <option value="all">Monetized: All</option>
                <option value="yes">Monetized: Yes</option>
                <option value="no">Monetized: No</option>
              </select>

              {/* Divider */}
              <div className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />

              {/* Group by */}
              <div className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
                  <line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>
                </svg>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Group by</span>
                <select value={groupBy} onChange={e => setGroupBy(e.target.value as typeof groupBy)}
                  className="px-2.5 py-1.5 rounded-lg text-[12px] outline-none"
                  style={{ background: groupBy !== "none" ? "var(--primary-muted)" : "var(--surface)", border: `1px solid ${groupBy !== "none" ? "var(--primary)" : "var(--border)"}`, color: groupBy !== "none" ? "var(--primary)" : "var(--text-muted)" }}>
                  <option value="none">None</option>
                  <option value="batch">Batch</option>
                  <option value="status">Status</option>
                  <option value="platform">Platform</option>
                </select>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button onClick={clearFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                </button>
              )}

              <span className="ml-auto text-[11px]" style={{ color: "var(--text-muted)" }}>
                {filteredPages.length} of {PAGES_DATA.length} pages
              </span>
            </div>

            {/* ── Table ── */}
            <table className="w-full border-collapse" style={{ minWidth: 900 }}>
              <thead>
                <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
                  {[
                    { label: "Page",        w: "w-48"  },
                    { label: "Status",      w: "w-28"  },
                    { label: "Batch",       w: "w-32"  },
                    { label: "Auto-post",   w: "w-36"  },
                    { label: "Interval",    w: "w-24"  },
                    { label: "Timezone",    w: "w-24"  },
                    { label: "Rotation",    w: "w-20"  },
                    { label: "Approval",    w: "w-20"  },
                    { label: "Monetized",   w: "w-20"  },
                    { label: "",            w: "w-28"  },
                  ].map(h => (
                    <th key={h.label} className={`${h.w} px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider`}
                      style={{ color: "var(--text-muted)" }}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map(group => {
                  const isCollapsed = collapsedGroups.has(group.key);
                  return (
                    <React.Fragment key={group.key}>
                      {/* Group header row */}
                      {groupBy !== "none" && (
                        <tr style={{ background: "var(--bg-deep)", borderBottom: "1px solid var(--border)" }}>
                          <td colSpan={10} className="px-3 py-2">
                            <button onClick={() => toggleGroup(group.key)}
                              className="flex items-center gap-2 text-left">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                style={{ color: "var(--text-muted)", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
                                <polyline points="6 9 12 15 18 9"/>
                              </svg>
                              {group.color && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />}
                              <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>{group.label}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--surface-active)", color: "var(--text-muted)" }}>
                                {group.pages.length}
                              </span>
                            </button>
                          </td>
                        </tr>
                      )}

                      {/* Page rows */}
                      {!isCollapsed && group.pages.map((page, i) => {
                  const status   = getPageStatus(page);
                  const edits    = cardEdits[page.id] ?? {};
                  const isDirty  = hasCardChanges(page.id);
                  const isSaved  = cardSaved[page.id];
                  const isSelected = selectedPageId === page.id;
                  const pageBatch  = batches.find(b => b.pages.includes(page.id));

                  const autoPost   = edits.autoPost   !== undefined ? edits.autoPost   : page.autoPost;
                  const autoPostIG = edits.autoPostIG !== undefined ? edits.autoPostIG : page.autoPostIG;
                  const autoPostTH = edits.autoPostTH !== undefined ? edits.autoPostTH : page.autoPostTH;
                  const interval   = edits.postInterval !== undefined ? edits.postInterval : page.postInterval;
                  const tz         = edits.timezone   !== undefined ? edits.timezone   : page.timezone;
                  const rotate     = edits.rotateIds  !== undefined ? edits.rotateIds  : page.rotateIds;
                  const approval   = edits.approvalRequired !== undefined ? edits.approvalRequired : page.approvalRequired;

                  const rowBg = isSelected ? "var(--primary-muted)" : i % 2 === 0 ? "var(--surface)" : "var(--bg-deep)";

                  return (
                    <tr key={page.id}
                      style={{ background: rowBg, borderBottom: "1px solid var(--border)", outline: isSelected ? "1px solid var(--primary)" : "none", outlineOffset: "-1px" }}>

                      {/* Page name */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => selectPage(page.id)}>
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: page.color }}>
                            {page.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold truncate" style={{ color: "var(--text)" }}>{page.name}</div>
                            <div className="flex gap-1 mt-0.5">
                              {page.platforms.map(p => (
                                <span key={p} className="text-[9px] px-1 py-0.5 rounded" style={{ background: "var(--surface-active)", color: "var(--text-muted)" }}>
                                  {p === "facebook" ? "FB" : p === "instagram" ? "IG" : "TH"}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                          style={{ color: status.color, background: status.bg }}>
                          ● {status.label}
                        </span>
                      </td>

                      {/* Batch */}
                      <td className="px-3 py-2.5">
                        {pageBatch ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium truncate block max-w-[120px]"
                            style={{ background: `${pageBatch.color}20`, color: pageBatch.color }}>
                            {pageBatch.name}
                          </span>
                        ) : (
                          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>

                      {/* Auto-post toggles */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-semibold" style={{ color: "var(--text-muted)" }}>FB</span>
                            <Toggle on={autoPost} onChange={v => updateCard(page.id, "autoPost", v)} />
                          </div>
                          {page.platforms.includes("instagram") && (
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-semibold" style={{ color: "var(--text-muted)" }}>IG</span>
                              <Toggle on={autoPostIG} onChange={v => updateCard(page.id, "autoPostIG", v)} />
                            </div>
                          )}
                          {page.platforms.includes("threads") && (
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-semibold" style={{ color: "var(--text-muted)" }}>TH</span>
                              <Toggle on={autoPostTH} onChange={v => updateCard(page.id, "autoPostTH", v)} />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Interval */}
                      <td className="px-3 py-2.5">
                        <select value={interval} onChange={e => updateCard(page.id, "postInterval", parseFloat(e.target.value))}
                          className="text-[11px] px-2 py-1.5 rounded-lg outline-none w-full"
                          style={{ background: "var(--bg-deep)", border: "1px solid var(--border)", color: "var(--text)" }}>
                          {INTERVAL_OPTIONS.map(h => <option key={h} value={h}>{h}h</option>)}
                        </select>
                      </td>

                      {/* Timezone */}
                      <td className="px-3 py-2.5">
                        <select value={tz} onChange={e => updateCard(page.id, "timezone", e.target.value)}
                          className="text-[11px] px-2 py-1.5 rounded-lg outline-none w-full"
                          style={{ background: "var(--bg-deep)", border: "1px solid var(--border)", color: "var(--text)" }}>
                          {TIMEZONES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </td>

                      {/* Rotation */}
                      <td className="px-3 py-2.5">
                        <Toggle on={rotate} onChange={v => updateCard(page.id, "rotateIds", v)} />
                      </td>

                      {/* Approval */}
                      <td className="px-3 py-2.5">
                        <Toggle on={approval} onChange={v => updateCard(page.id, "approvalRequired", v)} />
                      </td>

                      {/* Monetized */}
                      <td className="px-3 py-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: page.monetized ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.08)", color: page.monetized ? "#4ADE80" : "#EF4444" }}>
                          {page.monetized ? "Yes" : "No"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => saveCard(page.id)} disabled={!isDirty && !isSaved}
                            className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 transition-all"
                            style={{
                              background: isSaved ? "var(--success)" : isDirty ? "var(--primary)" : "var(--surface-active)",
                              color: (isDirty || isSaved) ? "white" : "var(--text-muted)",
                              opacity: !isDirty && !isSaved ? 0.35 : 1,
                            }}>
                            {isSaved
                              ? <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Saved</>
                              : "Save"}
                          </button>
                          <button onClick={() => selectPage(page.id)}
                            className="text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                            style={{ background: isSelected ? "var(--primary-muted)" : "var(--surface-active)", color: isSelected ? "var(--primary)" : "var(--text-muted)" }}>
                            {isSelected ? "Open ●" : "Details"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {filteredPages.length === 0 && (
              <div className="py-12 text-center" style={{ color: "var(--text-muted)" }}>
                <p className="text-[13px] font-medium mb-1">No pages match your filters</p>
                <button onClick={clearFilters} className="text-[12px]" style={{ color: "var(--primary)" }}>Clear filters</button>
              </div>
            )}

            {/* Batch groups below table */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Batch Groups ({batches.length})</span>
              </div>
              {batches.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed text-center" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => setShowCreateBatch(true)} className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: "var(--primary)" }}>Create First Batch</button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {batches.map(batch => {
                    const batchPages = batch.pages.map(pid => PAGES_DATA.find(p => p.id === pid)).filter(Boolean);
                    return (
                      <div key={batch.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: batch.color }}>
                          {batch.pages.length}
                        </div>
                        <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{batch.name}</span>
                        <div className="flex gap-1">
                          {batchPages.map(p => p && (
                            <div key={p.id} className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: p.color }} title={p.name}>
                              {p.avatar}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1.5 ml-2">
                          <button onClick={() => { setViewingBatchDefaults(batch); setSelectedPageId(null); }}
                            className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                            style={{ background: batch.defaults ? `${batch.color}15` : "var(--surface-active)", color: batch.defaults ? batch.color : "var(--text-muted)" }}>
                            Defaults
                          </button>
                          <button onClick={() => setEditingBatch(batch)}
                            className="text-[10px] px-2 py-1 rounded-lg"
                            style={{ background: "var(--surface-active)", color: "var(--text-muted)" }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Per-Page Settings Panel / Batch Defaults ── */}
          <div className="sticky top-24 h-fit">
            {viewingBatchDefaults ? (
              <BatchDefaultsPanel
                batch={viewingBatchDefaults}
                onSave={handleBatchDefaultsSave}
                onClose={() => setViewingBatchDefaults(null)}
              />
            ) : selected ? (
              <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: selectedPageId ? "var(--primary)" : "var(--border)", boxShadow: "0 0 0 1px var(--primary-muted)" }}>
                {/* Panel header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-hover)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: selected.color }}>
                    {selected.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[15px]" style={{ color: "var(--text)" }}>{selected.name}</h3>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{selected.followers} followers · {selected.category}</span>
                  </div>
                  {hasChanges && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(255,107,43,0.12)", color: "var(--primary)" }}>
                      Unsaved
                    </span>
                  )}
                </div>

                <div className="px-5 py-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">

                  {/* ── Token Status ── */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Connection</div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px]" style={{ color: "var(--text)" }}>Token status</span>
                        <span className={`text-[12px] font-semibold ${selected.tokenStatus === "active" ? "text-green-400" : selected.tokenStatus === "expiring" ? "text-amber-400" : "text-red-400"}`}>
                          {selected.tokenStatus === "active" ? "● Active" : selected.tokenStatus === "expiring" ? "● Expiring soon" : "● Expired"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[13px]" style={{ color: "var(--text)" }}>Expires</span>
                        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{selected.tokenExpiry}</span>
                      </div>
                      {selected.tokenStatus !== "active" && (
                        <button className="w-full mt-3 py-2 rounded-lg text-[12px] font-semibold text-white"
                          style={{ backgroundColor: selected.tokenStatus === "expired" ? "#EF4444" : "#F59E0B" }}>
                          {selected.tokenStatus === "expired" ? "Reconnect Now" : "Refresh Token"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Posting IDs ── */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Posting IDs</div>
                      <button className="text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1"
                        style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add ID
                      </button>
                    </div>

                    {/* Rotation toggle */}
                    <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: "var(--bg)" }}>
                        <div>
                          <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>ID Rotation</span>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {selected.rotateIds
                              ? `Posts rotate across ${selected.postingIds.filter(p => p.status === "active").length} active IDs`
                              : "Posts always use the primary ID"}
                          </p>
                        </div>
                        <Toggle on={selected.rotateIds} onChange={v => update("rotateIds", v)} />
                      </div>
                      {selected.rotateIds && (
                        <div className="flex items-center gap-2 px-3 py-2 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Mode</span>
                          <div className="flex gap-1.5 ml-auto">
                            {(["round-robin", "performance"] as const).map(mode => (
                              <button key={mode} onClick={() => update("rotationMode", mode)}
                                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg capitalize transition-all"
                                style={{
                                  backgroundColor: selected.rotationMode === mode ? "var(--primary)" : "var(--surface-hover)",
                                  color: selected.rotationMode === mode ? "white" : "var(--text-muted)",
                                }}>
                                {mode === "round-robin" ? "Round-robin" : "Performance-weighted"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ID list */}
                    <div className="flex flex-col gap-2">
                      {selected.postingIds.map((pid, i) => {
                        const trendColor = pid.reachTrend === "up" ? "#4ADE80" : pid.reachTrend === "down" ? "#EF4444" : "var(--text-muted)";
                        const trendIcon = pid.reachTrend === "up"
                          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={trendColor} strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                          : pid.reachTrend === "down"
                          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={trendColor} strokeWidth="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={trendColor} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
                        return (
                          <div key={pid.connId} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${pid.status === "throttled" ? "rgba(251,191,36,0.3)" : pid.status === "expired" ? "rgba(239,68,68,0.25)" : "var(--border)"}`, backgroundColor: "var(--bg)" }}>
                            {/* ID header row */}
                            <div className="flex items-center gap-2.5 px-3 py-2.5">
                              {/* Slot number */}
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                style={{ backgroundColor: pid.isPrimary ? "var(--primary)" : "var(--surface-hover)", color: pid.isPrimary ? "white" : "var(--text-muted)" }}>
                                {pid.slot}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[12px] font-semibold truncate" style={{ color: "var(--text)" }}>{pid.name}</span>
                                  {pid.isPrimary && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: "rgba(255,107,43,0.12)", color: "var(--primary)" }}>PRIMARY</span>}
                                  {pid.status === "throttled" && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#FBBF24" }}>THROTTLED</span>}
                                  {pid.status === "expired" && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444" }}>EXPIRED</span>}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{pid.fbUserId}</span>
                                  <span style={{ color: "var(--border)" }}>·</span>
                                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Last used {pid.lastUsed}</span>
                                </div>
                              </div>
                            </div>
                            {/* Stats row */}
                            <div className="flex items-center gap-0 border-t divide-x" style={{ borderColor: "var(--border)" }}>
                              {[
                                { label: "Posts this week", value: pid.postsThisWeek.toString() },
                                { label: "Avg reach", value: pid.avgReach },
                                { label: "Trend", value: trendIcon as React.ReactNode, isIcon: true },
                              ].map((stat, si) => (
                                <div key={si} className="flex-1 flex flex-col items-center py-2" style={{ borderColor: "var(--border)" }}>
                                  <div className="flex items-center gap-0.5" style={{ color: si === 2 ? trendColor : "var(--text)" }}>
                                    {stat.isIcon ? stat.value : <span className="text-[12px] font-bold">{stat.value}</span>}
                                  </div>
                                  <span className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {selected.postingIds.some(p => p.status === "throttled") && (
                      <div className="flex items-start gap-2 mt-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <p className="text-[11px]" style={{ color: "#FBBF24" }}>
                          1 ID is throttled and generating low reach. Consider pausing it and replacing with a fresh account.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── Approval Workflow ── */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Approval Workflow</div>
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      {/* Master toggle */}
                      <div className="flex items-center justify-between px-3 py-3" style={{ backgroundColor: "var(--bg)" }}>
                        <div>
                          <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>Require Approval</span>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {selected.approvalRequired
                              ? "Posts need approval before publishing"
                              : "Posts go directly to queue without review"}
                          </p>
                        </div>
                        <Toggle on={selected.approvalRequired} onChange={v => {
                          if (v && selected.approvers.length === 0) { setShowApprovalGuard(true); return; }
                          update("approvalRequired", v);
                        }} />
                      </div>

                      {selected.approvalRequired && (
                        <>
                          {/* Approvers — read-only, inherited from Page Team */}
                          <div className="px-3 py-3 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Approvers</p>
                              <a href="/settings/account" className="text-[10px] font-medium" style={{ color: "var(--primary)" }}>Manage in Team Settings →</a>
                            </div>
                            {(() => {
                              const ALL_TEAM = [
                                { name: "Taimur Asghar", initials: "TA", color: "#FF6B2B", roles: ["owner"] },
                                { name: "Sarah Khan",    initials: "SK", color: "#8B5CF6", roles: ["publisher","approver"] },
                                { name: "Ahmed Raza",    initials: "AR", color: "#14B8A6", roles: ["publisher"] },
                                { name: "Aisha Siddiqui",initials: "AS", color: "#0EA5E9", roles: ["manager","publisher"] },
                              ];
                              const approvers = ALL_TEAM.filter(m => m.roles.includes("owner") || m.roles.includes("manager") || m.roles.includes("approver"));
                              return approvers.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  {approvers.map(m => (
                                    <div key={m.name} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0" style={{ backgroundColor: m.color }}>{m.initials}</div>
                                      <span className="text-[12px] flex-1" style={{ color: "var(--text)" }}>{m.name}</span>
                                      <div className="flex gap-1">
                                        {m.roles.filter(r => ["owner","manager","approver"].includes(r)).map(r => (
                                          <span key={r} className="text-[9px] font-semibold px-1.5 py-0.5 rounded capitalize" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>{r}</span>
                                        ))}
                                      </div>
                                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>inherited</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>No approvers assigned. Add an Approver in Team Settings.</p>
                              );
                            })()}
                          </div>

                          {/* Auto-publish is always ON — no toggle needed */}
                          <div className="flex items-center gap-2 px-3 py-2.5 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Auto-publish always on — posts go live at their scheduled time once approved</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Page Team ── */}
                  {(() => {
                    const ALL_TEAM = [
                      { name: "Taimur Asghar", initials: "TA", color: "#FF6B2B", roles: ["owner"],               batches: ["all"] },
                      { name: "Sarah Khan",     initials: "SK", color: "#8B5CF6", roles: ["publisher","approver"], batches: ["batch-a"] },
                      { name: "Ahmed Raza",     initials: "AR", color: "#14B8A6", roles: ["publisher"],            batches: ["batch-b"] },
                      { name: "Nida Jafri",     initials: "NJ", color: "#6366F1", roles: ["analyst"],              batches: ["batch-b"] },
                      { name: "Aisha Siddiqui", initials: "AS", color: "#0EA5E9", roles: ["manager","publisher"],  batches: ["batch-c"] },
                      { name: "Fatima Ali",     initials: "FA", color: "#EC4899", roles: ["publisher"],            batches: ["batch-a","batch-b"] },
                    ];
                    // Find which batch this page belongs to
                    const pageBatch = Object.entries(BATCH_CONFIG).find(([id, cfg]) => id !== "all" && cfg.pages.includes(selected.id));
                    const batchId = pageBatch?.[0];
                    const batchLabel = pageBatch?.[1].label ?? "All Batches";
                    const batchColor = pageBatch?.[1].color ?? "#FF6B2B";
                    // Members inherited from batch
                    const inheritedMembers = ALL_TEAM.filter(m => m.batches.includes("all") || (batchId && m.batches.includes(batchId)));
                    // Directly assigned members
                    const directNames = directAssignments[selected.id] ?? [];
                    const directMembers = ALL_TEAM.filter(m => directNames.includes(m.name));
                    // Members available to add (not already inherited or direct)
                    const available = ALL_TEAM.filter(m => !inheritedMembers.includes(m) && !directMembers.includes(m));

                    return (
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Page Team</div>
                        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                          {/* Inherited from batch */}
                          <div className="px-3 py-2.5" style={{ backgroundColor: "var(--bg)" }}>
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>From Batch</span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${batchColor}20`, color: batchColor }}>{batchLabel}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              {inheritedMembers.map(m => (
                                <div key={m.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0" style={{ backgroundColor: m.color }}>{m.initials}</div>
                                  <span className="text-[12px] flex-1" style={{ color: "var(--text)" }}>{m.name}</span>
                                  <div className="flex gap-1">
                                    {m.roles.map(r => (
                                      <span key={r} className="text-[9px] font-semibold px-1.5 py-0.5 rounded capitalize" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>{r}</span>
                                    ))}
                                  </div>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>inherited</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Directly assigned */}
                          {directMembers.length > 0 && (
                            <div className="px-3 py-2.5 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Direct Access</div>
                              <div className="flex flex-col gap-1">
                                {directMembers.map(m => (
                                  <div key={m.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(255,107,43,0.06)", border: "1px solid rgba(255,107,43,0.15)" }}>
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0" style={{ backgroundColor: m.color }}>{m.initials}</div>
                                    <span className="text-[12px] flex-1" style={{ color: "var(--text)" }}>{m.name}</span>
                                    <div className="flex gap-1">
                                      {m.roles.map(r => (
                                        <span key={r} className="text-[9px] font-semibold px-1.5 py-0.5 rounded capitalize" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>{r}</span>
                                      ))}
                                    </div>
                                    <button
                                      onClick={() => setDirectAssignments(prev => ({ ...prev, [selected.id]: (prev[selected.id] ?? []).filter(n => n !== m.name) }))}
                                      className="text-[10px] px-1.5 py-0.5 rounded transition-all hover:opacity-80"
                                      style={{ color: "var(--error)", backgroundColor: "rgba(239,68,68,0.1)" }}>
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add directly */}
                          <div className="px-3 py-2.5 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                            {pageInviteToast && (
                              <div className="mb-2 px-3 py-2 rounded-lg text-[11px] font-medium" style={{ backgroundColor: "rgba(74,222,128,0.1)", color: "#4ADE80" }}>✓ Invite sent</div>
                            )}
                            {showAddMember === false && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setShowAddMember("team")}
                                  className="flex items-center gap-1.5 text-[11px] font-semibold transition-all hover:opacity-80"
                                  style={{ color: "var(--primary)" }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                  Add from team
                                </button>
                                <span style={{ color: "var(--border)" }}>·</span>
                                <button
                                  onClick={() => { setShowAddMember("invite"); setPageInviteForm({ name: "", email: "", role: "" }); }}
                                  className="flex items-center gap-1.5 text-[11px] font-semibold transition-all hover:opacity-80"
                                  style={{ color: "var(--text-muted)" }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                  Invite by email
                                </button>
                              </div>
                            )}

                            {showAddMember === "team" && (
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Add from Team</div>
                                {available.length === 0 ? (
                                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>All team members already have access to this page.</p>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    {available.map(m => (
                                      <button
                                        key={m.name}
                                        onClick={() => {
                                          setDirectAssignments(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] ?? []), m.name] }));
                                          setShowAddMember(false);
                                        }}
                                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-all hover:opacity-80"
                                        style={{ backgroundColor: "var(--surface-hover)" }}>
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0" style={{ backgroundColor: m.color }}>{m.initials}</div>
                                        <span className="text-[12px] flex-1" style={{ color: "var(--text)" }}>{m.name}</span>
                                        <div className="flex gap-1">
                                          {m.roles.map(r => (
                                            <span key={r} className="text-[9px] font-semibold px-1.5 py-0.5 rounded capitalize" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>{r}</span>
                                          ))}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                                <button onClick={() => setShowAddMember(false)} className="mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>Cancel</button>
                              </div>
                            )}

                            {showAddMember === "invite" && (
                              <div className="space-y-2">
                                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Invite by Email</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    value={pageInviteForm.name}
                                    onChange={e => setPageInviteForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Full name"
                                    className="px-2.5 py-2 rounded-lg text-[12px] outline-0 border-0"
                                    style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}
                                  />
                                  <input
                                    value={pageInviteForm.email}
                                    onChange={e => setPageInviteForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="Email address"
                                    type="email"
                                    className="px-2.5 py-2 rounded-lg text-[12px] outline-0 border-0"
                                    style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}
                                  />
                                </div>
                                <select
                                  value={pageInviteForm.role}
                                  onChange={e => setPageInviteForm(f => ({ ...f, role: e.target.value }))}
                                  className="w-full px-2.5 py-2 rounded-lg text-[12px] outline-0 border-0"
                                  style={{ backgroundColor: "var(--surface-hover)", color: pageInviteForm.role ? "var(--text)" : "var(--text-muted)" }}>
                                  <option value="">Select role…</option>
                                  <option value="publisher">Publisher</option>
                                  <option value="approver">Approver</option>
                                  <option value="analyst">Analyst</option>
                                </select>
                                <div className="flex gap-2 pt-1">
                                  <button onClick={() => setShowAddMember(false)} className="px-3 py-1.5 rounded-lg text-[11px]" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>Cancel</button>
                                  <button
                                    disabled={!pageInviteForm.name || !pageInviteForm.email || !pageInviteForm.role}
                                    onClick={() => {
                                      setShowAddMember(false);
                                      setPageInviteToast(true);
                                      setTimeout(() => setPageInviteToast(false), 2500);
                                    }}
                                    className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-white disabled:opacity-40"
                                    style={{ backgroundColor: "var(--primary)" }}>
                                    Send Invite
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── Posting Schedule ── */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Posting Schedule</div>
                    <div className="space-y-3">

                      {/* Auto-publish always on — no toggle */}
                      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--success)", flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Auto-publish always on — posts go live at their scheduled time once approved</span>
                      </div>

                      {/* Post interval */}
                      <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
                        <div>
                          <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Post interval</div>
                          <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Gap between posts</div>
                        </div>
                        <select value={selected.postInterval} onChange={e => update("postInterval", parseFloat(e.target.value))}
                          className="text-[12px] px-3 py-1.5 rounded-lg outline-none"
                          style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)" }}>
                          {INTERVAL_OPTIONS.map(h => (
                            <option key={h} value={h}>{h === 1 ? "1 hr" : `${h} hrs`}</option>
                          ))}
                        </select>
                      </div>

                      {/* Timezone */}
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Timezone</div>
                            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Schedule times are in this timezone</div>
                          </div>
                          <select value={selected.timezone} onChange={e => update("timezone", e.target.value)}
                            className="text-[12px] px-3 py-1.5 rounded-lg outline-none"
                            style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)" }}>
                            {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
                          </select>
                        </div>
                        {/* Local vs Page time toggle */}
                        <div className="flex rounded-lg overflow-hidden mt-2" style={{ border: "1px solid var(--border)" }}>
                          {(["local","page"] as const).map(mode => (
                            <button key={mode} onClick={() => setTimezoneMode(mode)}
                              className="flex-1 py-1.5 text-[11px] font-medium transition-all"
                              style={{ backgroundColor: timezoneMode === mode ? "var(--primary)" : "transparent", color: timezoneMode === mode ? "white" : "var(--text-muted)" }}>
                              {mode === "local" ? "My local time" : `Page time (${selected.timezone})`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Hours */}
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Active hours</div>
                            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Posts only sent during this window</div>
                          </div>
                          <Toggle on={selected.quietHours} onChange={v => update("quietHours", v)} />
                        </div>
                        {selected.quietHours && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1">
                              <div className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>From</div>
                              <input type="time" value={selected.quietStart} onChange={e => update("quietStart", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
                                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)" }} />
                            </div>
                            <div className="mt-4" style={{ color: "var(--text-muted)" }}>→</div>
                            <div className="flex-1">
                              <div className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>Until</div>
                              <input type="time" value={selected.quietEnd} onChange={e => update("quietEnd", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
                                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Schedule Preview ── */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Schedule Preview</div>
                    <SchedulePreview
                      interval={selected.postInterval}
                      quietHours={selected.quietHours}
                      quietStart={selected.quietStart}
                      quietEnd={selected.quietEnd}
                      timezone={selected.timezone}
                    />
                  </div>

                  {/* ── Cross-posting defaults ── */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Cross-posting Defaults</div>
                    <div className="text-[11px] mb-3 px-1" style={{ color: "var(--text-muted)" }}>
                      When uploading, these platforms are pre-selected automatically.
                    </div>
                    <div className="space-y-2">
                      {[
                        { key: "facebook", label: "Facebook", always: true },
                        { key: "instagram", label: "Instagram", always: false, field: "autoPostIG" as keyof PageData },
                        { key: "threads",   label: "Threads",   always: false, field: "autoPostTH" as keyof PageData },
                      ].map(plat => {
                        const connected = selected.platforms.includes(plat.key);
                        const enabled = plat.always ? true : (selected[plat.field!] as boolean);
                        return (
                          <div key={plat.key} className="flex items-center justify-between p-3 rounded-xl"
                            style={{ backgroundColor: "var(--bg)", opacity: connected ? 1 : 0.4 }}>
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{plat.label}</span>
                              {!connected && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>Not connected</span>}
                              {plat.always && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(74,222,128,0.1)", color: "var(--success)" }}>Always on</span>}
                            </div>
                            {!plat.always && (
                              <Toggle on={enabled && connected} onChange={v => update(plat.field!, v)} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Monetization ── */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Monetization</div>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
                      <span className="text-[13px]" style={{ color: "var(--text)" }}>Content Monetization</span>
                      <span className={`text-[12px] font-semibold ${selected.monetized ? "text-green-400" : "text-red-400"}`}>
                        {selected.monetized ? "Enrolled" : "Not Enrolled"}
                      </span>
                    </div>
                  </div>

                  {/* ── In Batches ── */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>In Batches</div>
                    {batches.filter(b => b.pages.includes(selected.id)).length === 0 ? (
                      <div className="text-[12px] p-3 rounded-xl text-center" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>Not in any batch</div>
                    ) : (
                      <div className="space-y-1.5">
                        {batches.filter(b => b.pages.includes(selected.id)).map(b => (
                          <div key={b.id} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                            <span className="text-[12px]" style={{ color: "var(--text)" }}>{b.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* ── Save footer ── */}
                <div className="px-5 py-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-hover)" }}>
                  <button className="text-[12px] font-medium text-red-400">Retire ID</button>
                  <div className="flex items-center gap-3">
                    {panelSaved && (
                      <span className="text-[12px] font-medium text-green-400 flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Saved
                      </span>
                    )}
                    <button onClick={handlePanelSave} disabled={!hasChanges}
                      className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white transition-opacity disabled:opacity-30"
                      style={{ backgroundColor: "var(--primary)" }}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* empty right panel placeholder */
              <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-16 text-center" style={{ borderColor: "var(--border)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3" style={{ color: "var(--text-muted)" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <p className="text-[13px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>Select a page or batch</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Click any page or &quot;Defaults&quot; on a batch to configure</p>
              </div>
            )}

          </div>
        </div>
      </main>

      {showCreateBatch && <BatchModal onSave={d => { setBatches(prev => [...prev, { ...d, id: `b${Date.now()}` }]); setShowCreateBatch(false); }} onClose={() => setShowCreateBatch(false)} />}
      {editingBatch && <BatchModal batch={editingBatch} onSave={d => { setBatches(prev => prev.map(b => b.id === editingBatch.id ? { ...d, id: b.id } : b)); setEditingBatch(null); }} onDelete={() => { setBatches(prev => prev.filter(b => b.id !== editingBatch.id)); setEditingBatch(null); }} onClose={() => setEditingBatch(null)} />}

      {/* Approval guard modal */}
      {showApprovalGuard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(251,191,36,0.12)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div>
                <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>No approvers assigned</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Approval cannot be enabled until at least one Approver is assigned to this batch.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowApprovalGuard(false)} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                Cancel
              </button>
              <a href="/settings/account?tab=team" onClick={() => setShowApprovalGuard(false)} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white text-center" style={{ backgroundColor: "var(--primary)" }}>
                Add Approver
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

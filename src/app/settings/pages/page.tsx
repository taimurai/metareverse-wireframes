"use client";
import { useState } from "react";
import Header from "@/components/Header";

const PAGES_DATA = [
  { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6", followers: "3.2M", category: "Comedy", platforms: ["facebook", "instagram"], tokenStatus: "active", tokenExpiry: "Jun 15, 2026", autoPost: true, postInterval: "2.5 hrs", timezone: "EST", monetized: true },
  { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M", category: "Education", platforms: ["facebook", "instagram", "threads"], tokenStatus: "active", tokenExpiry: "May 28, 2026", autoPost: true, postInterval: "3 hrs", timezone: "EST", monetized: true },
  { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6", followers: "1.1M", category: "Technology", platforms: ["facebook", "instagram", "threads"], tokenStatus: "expiring", tokenExpiry: "Apr 2, 2026", autoPost: true, postInterval: "2 hrs", timezone: "PST", monetized: true },
  { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B", followers: "680K", category: "Finance", platforms: ["facebook", "instagram"], tokenStatus: "active", tokenExpiry: "Jul 10, 2026", autoPost: false, postInterval: "—", timezone: "EST", monetized: false },
  { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K", category: "Health", platforms: ["facebook"], tokenStatus: "active", tokenExpiry: "Aug 1, 2026", autoPost: true, postInterval: "4 hrs", timezone: "CST", monetized: true },
  { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899", followers: "310K", category: "Fitness", platforms: ["facebook"], tokenStatus: "expired", tokenExpiry: "Mar 15, 2026", autoPost: false, postInterval: "—", timezone: "EST", monetized: true },
  { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9", followers: "136", category: "Women's History", platforms: ["facebook", "instagram", "threads"], tokenStatus: "active", tokenExpiry: "Sep 20, 2026", autoPost: true, postInterval: "2.5 hrs", timezone: "EST", monetized: false },
];

const BATCH_COLORS = ["#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#FF6B2B", "#6366F1", "#0EA5E9", "#10B981"];

interface Batch {
  id: string;
  name: string;
  pages: string[];
  color: string;
}

const INITIAL_BATCHES: Batch[] = [
  { id: "b1", name: "Partner A — Lifestyle", pages: ["lc", "ff", "dh"], color: "#F59E0B" },
  { id: "b2", name: "Partner B — Education", pages: ["hu", "tb", "mm"], color: "#8B5CF6" },
  { id: "b3", name: "Partner C — Women's", pages: ["khn"], color: "#EC4899" },
];

interface BatchModalProps {
  batch?: Batch | null;
  onSave: (batch: Omit<Batch, "id">) => void;
  onDelete?: () => void;
  onClose: () => void;
}

function BatchModal({ batch, onSave, onDelete, onClose }: BatchModalProps) {
  const [name, setName] = useState(batch?.name ?? "");
  const [selectedPages, setSelectedPages] = useState<string[]>(batch?.pages ?? []);
  const [color, setColor] = useState(batch?.color ?? BATCH_COLORS[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggle = (id: string) => setSelectedPages(prev =>
    prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="w-[560px] rounded-2xl border shadow-2xl" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            {batch ? "Edit Batch" : "Create New Batch"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Batch Name */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Batch Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Partner A — Lifestyle"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none border"
              style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", borderColor: "var(--border)" }}
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Color</label>
            <div className="flex gap-2">
              {BATCH_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <svg className="absolute inset-0 m-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Page Selection */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>
              Pages in this batch <span style={{ color: "var(--primary)" }}>({selectedPages.length} selected)</span>
            </label>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {PAGES_DATA.map(page => {
                const checked = selectedPages.includes(page.id);
                return (
                  <button
                    key={page.id}
                    onClick={() => toggle(page.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
                    style={{
                      backgroundColor: checked ? `${color}12` : "var(--surface-hover)",
                      borderColor: checked ? color : "transparent",
                    }}
                  >
                    {/* Checkbox */}
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: checked ? color : "var(--surface-active)", border: checked ? "none" : "1px solid var(--border)" }}>
                      {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: page.color }}>
                      {page.avatar}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm" style={{ color: "var(--text)" }}>{page.name}</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{page.followers} followers · {page.category}</div>
                    </div>
                    {/* Token status */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      page.tokenStatus === "active" ? "text-green-400 bg-green-400/10" :
                      page.tokenStatus === "expiring" ? "text-amber-400 bg-amber-400/10" :
                      "text-red-400 bg-red-400/10"
                    }`}>
                      {page.tokenStatus === "active" ? "Active" : page.tokenStatus === "expiring" ? "Expiring" : "Expired"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "var(--border)" }}>
          {batch && onDelete ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Are you sure?</span>
                <button onClick={onDelete} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-red-500">Delete</button>
                <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg text-sm" style={{ color: "var(--text-muted)", backgroundColor: "var(--surface-hover)" }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="text-sm font-medium text-red-400 flex items-center gap-1.5 hover:text-red-300 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Delete Batch
              </button>
            )
          ) : <div />}

          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
              Cancel
            </button>
            <button
              onClick={() => name.trim() && selectedPages.length > 0 && onSave({ name: name.trim(), pages: selectedPages, color })}
              disabled={!name.trim() || selectedPages.length === 0}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {batch ? "Save Changes" : "Create Batch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PageSettings() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [showCreateBatch, setShowCreateBatch] = useState(false);

  const selected = PAGES_DATA.find(p => p.id === selectedPage);

  const handleCreateBatch = (data: Omit<Batch, "id">) => {
    setBatches(prev => [...prev, { ...data, id: `b${Date.now()}` }]);
    setShowCreateBatch(false);
  };

  const handleEditBatch = (data: Omit<Batch, "id">) => {
    setBatches(prev => prev.map(b => b.id === editingBatch?.id ? { ...data, id: b.id } : b));
    setEditingBatch(null);
  };

  const handleDeleteBatch = () => {
    setBatches(prev => prev.filter(b => b.id !== editingBatch?.id));
    setEditingBatch(null);
  };

  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold" style={{ color: "var(--text)" }}>Page Settings</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Manage connected pages, posting schedules, and batch groups</p>
          </div>
          <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
            + Connect New Page
          </button>
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-8">
          {/* Left */}
          <div className="space-y-3">
            {/* Connected Pages */}
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Connected Pages ({PAGES_DATA.length})
            </div>

            {PAGES_DATA.map(page => (
              <div
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                style={{
                  backgroundColor: selectedPage === page.id ? "var(--surface-hover)" : "var(--surface)",
                  borderColor: selectedPage === page.id ? "var(--primary)" : "var(--border)",
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: page.color }}>
                  {page.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{page.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>{page.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{page.followers} followers</span>
                    <div className="flex gap-1">
                      {page.platforms.map(p => (
                        <span key={p} className="text-[9px] px-1 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                          {p === "facebook" ? "FB" : p === "instagram" ? "IG" : "TH"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  page.tokenStatus === "active" ? "text-green-400 bg-green-400/10" :
                  page.tokenStatus === "expiring" ? "text-amber-400 bg-amber-400/10" :
                  "text-red-400 bg-red-400/10"
                }`}>
                  {page.tokenStatus === "active" ? "● Active" : page.tokenStatus === "expiring" ? "● Expiring" : "● Expired"}
                </span>
              </div>
            ))}

            {/* Batch Groups */}
            <div className="flex items-center justify-between mt-8 mb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Batch Groups ({batches.length})
              </div>
              <button
                onClick={() => setShowCreateBatch(true)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: "var(--primary)", color: "white" }}
              >
                + New Batch
              </button>
            </div>

            {batches.length === 0 && (
              <div className="p-8 rounded-xl border border-dashed text-center" style={{ borderColor: "var(--border)" }}>
                <div className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>No batches yet</div>
                <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Group pages by partner or campaign for quick filtering</div>
                <button onClick={() => setShowCreateBatch(true)} className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: "var(--primary)" }}>
                  Create First Batch
                </button>
              </div>
            )}

            {batches.map(batch => {
              const batchPages = batch.pages.map(pid => PAGES_DATA.find(p => p.id === pid)).filter(Boolean);
              return (
                <div
                  key={batch.id}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                >
                  {/* Color swatch + count */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: batch.color }}>
                    {batch.pages.length}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{batch.name}</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {batchPages.map(p => p && (
                        <div key={p.id} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                          {p.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingBatch(batch)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Page Detail Panel */}
          <div className="rounded-xl border p-6 h-fit sticky top-24" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            {selected ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: selected.color }}>
                    {selected.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: "var(--text)" }}>{selected.name}</h3>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{selected.followers} followers · {selected.category}</span>
                  </div>
                </div>

                {/* Token Status */}
                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Token Status</div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "var(--text)" }}>Status</span>
                      <span className={`text-sm font-medium ${selected.tokenStatus === "active" ? "text-green-400" : selected.tokenStatus === "expiring" ? "text-amber-400" : "text-red-400"}`}>
                        {selected.tokenStatus.charAt(0).toUpperCase() + selected.tokenStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm" style={{ color: "var(--text)" }}>Expires</span>
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{selected.tokenExpiry}</span>
                    </div>
                    {selected.tokenStatus !== "active" && (
                      <button className="w-full mt-3 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: selected.tokenStatus === "expired" ? "#EF4444" : "#F59E0B" }}>
                        {selected.tokenStatus === "expired" ? "Reconnect Now" : "Refresh Token"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Platforms */}
                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Connected Platforms</div>
                  <div className="space-y-2">
                    {["facebook", "instagram", "threads"].map(plat => {
                      const connected = selected.platforms.includes(plat);
                      return (
                        <div key={plat} className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                          <span className="text-sm font-medium" style={{ color: connected ? "var(--text)" : "var(--text-muted)" }}>
                            {plat === "facebook" ? "Facebook" : plat === "instagram" ? "Instagram" : "Threads"}
                          </span>
                          <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${connected ? "bg-green-500" : "bg-gray-600"}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${connected ? "left-[18px]" : "left-0.5"}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Queue Settings */}
                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Queue Settings</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                      <span className="text-sm" style={{ color: "var(--text)" }}>Auto-post</span>
                      <div className={`w-9 h-5 rounded-full relative cursor-pointer ${selected.autoPost ? "bg-green-500" : "bg-gray-600"}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white ${selected.autoPost ? "left-[18px]" : "left-0.5"}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--text)" }}>Post interval</span>
                      <select className="text-sm rounded-lg px-3 py-1.5 border-0 outline-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}>
                        <option>1.5 hrs</option><option>2 hrs</option>
                        <option defaultValue="2.5 hrs">2.5 hrs</option>
                        <option>3 hrs</option><option>4 hrs</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--text)" }}>Timezone</span>
                      <select className="text-sm rounded-lg px-3 py-1.5 border-0 outline-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}>
                        <option>EST</option><option>CST</option><option>PST</option><option>UTC</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Monetization */}
                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Monetization</div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "var(--text)" }}>Content Monetization</span>
                      <span className={`text-sm font-medium ${selected.monetized ? "text-green-400" : "text-red-400"}`}>
                        {selected.monetized ? "Enrolled" : "Not Enrolled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Batches this page belongs to */}
                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>In Batches</div>
                  {batches.filter(b => b.pages.includes(selected.id)).length === 0 ? (
                    <div className="text-xs p-3 rounded-lg text-center" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                      Not in any batch
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {batches.filter(b => b.pages.includes(selected.id)).map(b => (
                        <div key={b.id} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                          <span className="text-sm" style={{ color: "var(--text)" }}>{b.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <button className="w-full py-2 rounded-lg text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors">
                    Disconnect Page
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--surface-hover)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Select a page</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Click any page to view and edit its settings</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Batch Modal */}
      {showCreateBatch && (
        <BatchModal
          onSave={handleCreateBatch}
          onClose={() => setShowCreateBatch(false)}
        />
      )}

      {/* Edit Batch Modal */}
      {editingBatch && (
        <BatchModal
          batch={editingBatch}
          onSave={handleEditBatch}
          onDelete={handleDeleteBatch}
          onClose={() => setEditingBatch(null)}
        />
      )}
    </div>
  );
}

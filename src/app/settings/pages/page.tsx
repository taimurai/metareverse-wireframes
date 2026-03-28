"use client";
import { useState } from "react";
import Header from "@/components/Header";

const PAGES = [
  { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6", followers: "3.2M", category: "Comedy", platforms: ["facebook", "instagram"], tokenStatus: "active", tokenExpiry: "Jun 15, 2026", autoPost: true, postInterval: "2.5 hrs", timezone: "EST", monetized: true },
  { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M", category: "Education", platforms: ["facebook", "instagram", "threads"], tokenStatus: "active", tokenExpiry: "May 28, 2026", autoPost: true, postInterval: "3 hrs", timezone: "EST", monetized: true },
  { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6", followers: "1.1M", category: "Technology", platforms: ["facebook", "instagram", "threads"], tokenStatus: "expiring", tokenExpiry: "Apr 2, 2026", autoPost: true, postInterval: "2 hrs", timezone: "PST", monetized: true },
  { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B", followers: "680K", category: "Finance", platforms: ["facebook", "instagram"], tokenStatus: "active", tokenExpiry: "Jul 10, 2026", autoPost: false, postInterval: "—", timezone: "EST", monetized: false },
  { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K", category: "Health", platforms: ["facebook"], tokenStatus: "active", tokenExpiry: "Aug 1, 2026", autoPost: true, postInterval: "4 hrs", timezone: "CST", monetized: true },
  { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899", followers: "310K", category: "Fitness", platforms: ["facebook"], tokenStatus: "expired", tokenExpiry: "Mar 15, 2026", autoPost: false, postInterval: "—", timezone: "EST", monetized: true },
  { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9", followers: "136", category: "Women's History", platforms: ["facebook", "instagram", "threads"], tokenStatus: "active", tokenExpiry: "Sep 20, 2026", autoPost: true, postInterval: "2.5 hrs", timezone: "EST", monetized: false },
];

const BATCHES = [
  { id: "b1", name: "Partner A — Lifestyle", pages: ["lc", "ff", "dh"], color: "#F59E0B" },
  { id: "b2", name: "Partner B — Education", pages: ["hu", "tb", "mm"], color: "#8B5CF6" },
  { id: "b3", name: "Partner C — Women's", pages: ["khn"], color: "#EC4899" },
];

export default function PageSettings() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [editingBatch, setEditingBatch] = useState<string | null>(null);
  const [showAddBatch, setShowAddBatch] = useState(false);

  const selected = PAGES.find(p => p.id === selectedPage);

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
            {/* Left: Page List */}
            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Connected Pages ({PAGES.length})
              </div>

              {PAGES.map(page => (
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
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      page.tokenStatus === "active" ? "text-green-400 bg-green-400/10" :
                      page.tokenStatus === "expiring" ? "text-amber-400 bg-amber-400/10" :
                      "text-red-400 bg-red-400/10"
                    }`}>
                      {page.tokenStatus === "active" ? "● Active" : page.tokenStatus === "expiring" ? "● Expiring" : "● Expired"}
                    </span>
                    {page.monetized && (
                      <span className="text-[9px] text-green-400">💰 Monetized</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Batch Groups */}
              <div className="text-[11px] font-semibold uppercase tracking-wider mt-8 mb-3" style={{ color: "var(--text-muted)" }}>
                Batch Groups ({BATCHES.length})
              </div>

              {BATCHES.map(batch => (
                <div
                  key={batch.id}
                  className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: batch.color }}>
                    {batch.pages.length}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{batch.name}</span>
                    <div className="flex gap-1 mt-1">
                      {batch.pages.map(pid => {
                        const p = PAGES.find(pg => pg.id === pid);
                        return p ? (
                          <span key={pid} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                            {p.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <button onClick={() => setEditingBatch(batch.id)} className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                    Edit
                  </button>
                </div>
              ))}

              <button
                onClick={() => setShowAddBatch(!showAddBatch)}
                className="w-full p-3 rounded-xl border border-dashed text-sm font-medium text-center"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                + Create New Batch Group
              </button>
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
                        <span className={`text-sm font-medium ${
                          selected.tokenStatus === "active" ? "text-green-400" :
                          selected.tokenStatus === "expiring" ? "text-amber-400" : "text-red-400"
                        }`}>
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
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium" style={{ color: connected ? "var(--text)" : "var(--text-muted)" }}>
                                {plat === "facebook" ? "Facebook" : plat === "instagram" ? "Instagram" : "Threads"}
                              </span>
                            </div>
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
                          <option>1.5 hrs</option>
                          <option>2 hrs</option>
                          <option selected={selected.postInterval === "2.5 hrs"}>2.5 hrs</option>
                          <option>3 hrs</option>
                          <option>4 hrs</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: "var(--text)" }}>Timezone</span>
                        <select className="text-sm rounded-lg px-3 py-1.5 border-0 outline-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}>
                          <option>EST</option>
                          <option>CST</option>
                          <option>PST</option>
                          <option>UTC</option>
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

                  {/* Danger Zone */}
                  <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <button className="w-full py-2 rounded-lg text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors">
                      Disconnect Page
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-3xl mb-3">⚙️</div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>Select a page</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Click a page to view and edit its settings</p>
                </div>
              )}
            </div>
          </div>
        </main>
    </div>
  );
}

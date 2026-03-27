"use client";
import { useState } from "react";

type MediaType = "image" | "video";

interface GridRow {
  id: string;
  type: MediaType;
  filename: string;
  caption: string;
  comments: string;
  ig: boolean;
  threads: boolean;
  schedule: string;
  selected: boolean;
  charCount: number;
  color: string;
}

const mockMedia: GridRow[] = [
  { id: "1", type: "image", filename: "sunset_beach.jpg", caption: "Did you know that the largest wave ever recorded was 1,720 feet tall? Here are 5 more ocean facts that will blow your mind...", comments: "1. The ocean covers 71% of Earth\n2. The deepest point is 36,000 ft", ig: true, threads: true, schedule: "9:00 AM", selected: false, charCount: 118, color: "#FF6B2B" },
  { id: "2", type: "video", filename: "workout_routine.mp4", caption: "Watch this incredible 5-minute morning routine that changed everything. No equipment needed!", comments: "", ig: true, threads: true, schedule: "10:30 AM", selected: false, charCount: 86, color: "#6366F1" },
  { id: "3", type: "image", filename: "infographic_health.png", caption: "Breaking: New study reveals the #1 habit of healthy people. The results might surprise you...", comments: "1. First key finding\n2. What experts say\n3. How to apply this", ig: true, threads: false, schedule: "12:00 PM", selected: false, charCount: 91, color: "#EC4899" },
  { id: "4", type: "video", filename: "cooking_tutorial.mov", caption: "How to make restaurant-quality pasta in under 10 minutes. Save this for later!", comments: "", ig: false, threads: true, schedule: "1:30 PM", selected: false, charCount: 78, color: "#14B8A6" },
  { id: "5", type: "image", filename: "motivational_quote.jpg", caption: "The only way to do great work is to love what you do. Double tap if you agree!", comments: "1. What this means for entrepreneurs\n2. Real success stories", ig: true, threads: true, schedule: "3:00 PM", selected: false, charCount: 77, color: "#F59E0B" },
  { id: "6", type: "image", filename: "historical_facts.png", caption: "In 1969, humans first walked on the moon. Here are 10 things you didn't know about the Apollo mission...", comments: "1. The computer had less power than your phone\n2. They left mirrors on the moon", ig: true, threads: true, schedule: "4:30 PM", selected: false, charCount: 103, color: "#8B5CF6" },
  { id: "7", type: "video", filename: "travel_vlog.mp4", caption: "This hidden gem in Bali will leave you speechless. We found paradise!", comments: "", ig: true, threads: false, schedule: "6:00 PM", selected: false, charCount: 70, color: "#06B6D4" },
  { id: "8", type: "image", filename: "tech_news.jpg", caption: "AI just changed everything. Here's what happened this week in tech and why you should care...", comments: "1. Major breakthrough in reasoning\n2. New tools released\n3. What it means for creators", ig: true, threads: true, schedule: "7:30 PM", selected: false, charCount: 92, color: "#F43F5E" },
];

export default function BulkGrid() {
  const mode = "media";
  const [rows, setRows] = useState<GridRow[]>(mockMedia);
  const [selectAll, setSelectAll] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: string; field: string } | null>(null);

  const toggleSelect = (id: string) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, selected: !row.selected } : row)));
  };

  const toggleAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setRows((r) => r.map((row) => ({ ...row, selected: next })));
  };

  const selectedCount = rows.filter((r) => r.selected).length;

  return (
    <div>
      {/* Toolbar */}
      {selectedCount > 0 && (
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-xl mb-3"
          style={{ backgroundColor: "var(--primary-muted)", border: "1px solid rgba(255, 107, 43, 0.2)" }}
        >
          <span className="text-[13px] font-medium" style={{ color: "var(--primary)" }}>
            {selectedCount} row{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>
              Bulk Edit Captions
            </button>
            <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--error)" }}>
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]" style={{ minWidth: mode === "media" ? "1000px" : "700px" }}>
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                <th className="px-3 py-3 font-medium w-8">
                  <input type="checkbox" checked={selectAll} onChange={toggleAll} className="rounded accent-orange-500" />
                </th>
                <th className="px-2 py-3 font-medium w-8" title="Drag to reorder"></th>
                {mode === "media" && <th className="px-3 py-3 font-medium w-12">Type</th>}
                {mode === "media" && <th className="px-3 py-3 font-medium w-20">Media</th>}
                <th className="px-3 py-3 font-medium" style={{ minWidth: "260px" }}>Caption</th>
                <th className="px-3 py-3 font-medium" style={{ minWidth: "180px" }}>Comments (thread)</th>
                {mode === "media" && <th className="px-3 py-3 font-medium w-10 text-center">IG</th>}
                <th className="px-3 py-3 font-medium w-10 text-center">{mode === "media" ? "TH" : "Threads"}</th>
                <th className="px-3 py-3 font-medium w-28">Schedule</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isDragging = dragIdx === idx;
                return (
                  <tr
                    key={row.id}
                    className="group"
                    style={{
                      borderBottom: "1px solid var(--border)",
                      opacity: isDragging ? 0.4 : 1,
                      backgroundColor: row.selected ? "rgba(255, 107, 43, 0.04)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!row.selected) e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                    onMouseLeave={(e) => { if (!row.selected) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={row.selected} onChange={() => toggleSelect(row.id)} className="rounded accent-orange-500" />
                    </td>

                    {/* Drag handle */}
                    <td
                      className="px-2 py-3 cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={() => setDragIdx(idx)}
                      onDragEnd={() => setDragIdx(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIdx !== null && dragIdx !== idx) {
                          const next = [...rows];
                          const [moved] = next.splice(dragIdx, 1);
                          next.splice(idx, 0, moved);
                          setRows(next);
                        }
                        setDragIdx(null);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
                        <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                      </svg>
                    </td>

                    {/* Type */}
                    {mode === "media" && (
                      <td className="px-3 py-3">
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-md"
                          style={{
                            backgroundColor: row.type === "image" ? "rgba(99, 102, 241, 0.12)" : "rgba(236, 72, 153, 0.12)",
                            color: row.type === "image" ? "#818CF8" : "#F472B6",
                          }}
                        >
                          {row.type === "image" ? "IMG" : "VID"}
                        </span>
                      </td>
                    )}

                    {/* Media thumbnail */}
                    {mode === "media" && (
                      <td className="px-3 py-3">
                        <div className="relative">
                          <div
                            className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ backgroundColor: row.color }}
                          >
                            {row.type === "image" ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            )}
                          </div>
                          {row.type === "video" && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: "var(--surface-active)", color: "var(--text-muted)" }}>
                              ▼
                            </div>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Caption */}
                    <td className="px-3 py-3">
                      {editingCell?.row === row.id && editingCell?.field === "caption" ? (
                        <textarea
                          className="w-full text-[12px] p-2 rounded-lg border resize-none outline-none"
                          style={{ backgroundColor: "var(--bg)", borderColor: "var(--primary)", color: "var(--text)" }}
                          rows={3}
                          defaultValue={row.caption}
                          autoFocus
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => { if (e.key === "Escape") setEditingCell(null); }}
                        />
                      ) : (
                        <div
                          className="cursor-text rounded-lg p-2 -m-2 hover:ring-1 transition-all"
                          style={{ "--tw-ring-color": "var(--border-light)" } as React.CSSProperties}
                          onClick={() => setEditingCell({ row: row.id, field: "caption" })}
                        >
                          <div className="text-[12px] line-clamp-2" style={{ color: "var(--text)" }}>
                            {row.caption}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px]" style={{ color: row.charCount > 2000 ? "var(--error)" : row.charCount > 1800 ? "var(--warning)" : "var(--text-muted)" }}>
                              {row.charCount}/2,200
                            </span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Comments */}
                    <td className="px-3 py-3">
                      {row.comments ? (
                        <div
                          className="cursor-text rounded-lg p-2 -m-2 hover:ring-1 transition-all"
                          style={{ "--tw-ring-color": "var(--border-light)" } as React.CSSProperties}
                          onClick={() => setEditingCell({ row: row.id, field: "comments" })}
                        >
                          <div className="text-[11px] whitespace-pre-line line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                            {row.comments}
                          </div>
                          <span className="text-[10px] mt-1 block" style={{ color: "var(--text-muted)" }}>
                            {row.comments.split("\n").length} comments
                          </span>
                        </div>
                      ) : (
                        <div
                          className="cursor-text rounded-lg p-2 -m-2 text-[11px] hover:ring-1 transition-all"
                          style={{ color: "var(--text-muted)", "--tw-ring-color": "var(--border-light)" } as React.CSSProperties}
                          onClick={() => setEditingCell({ row: row.id, field: "comments" })}
                        >
                          + Add thread comments
                        </div>
                      )}
                    </td>

                    {/* IG toggle */}
                    {mode === "media" && (
                      <td className="px-3 py-3 text-center">
                        <label className="relative inline-flex cursor-pointer">
                          <input type="checkbox" checked={row.ig} onChange={() => setRows(r => r.map(x => x.id === row.id ? { ...x, ig: !x.ig } : x))} className="sr-only peer" />
                          <div className="w-8 h-[18px] rounded-full peer peer-checked:after:translate-x-[14px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-[14px] after:w-[14px] after:transition-all" style={{ backgroundColor: row.ig ? "var(--primary)" : "var(--surface-active)" }}>
                            <div className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform" style={{ transform: row.ig ? "translateX(14px)" : "translateX(0)" }} />
                          </div>
                        </label>
                        {row.ig && row.type === "video" && (
                          <div className="mt-1">
                            <span className="text-[9px] px-1 py-0.5 rounded" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>90s max</span>
                          </div>
                        )}
                      </td>
                    )}

                    {/* Threads toggle */}
                    <td className="px-3 py-3 text-center">
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" checked={row.threads} onChange={() => setRows(r => r.map(x => x.id === row.id ? { ...x, threads: !x.threads } : x))} className="sr-only peer" />
                        <div className="w-8 h-[18px] rounded-full" style={{ backgroundColor: row.threads ? "var(--primary)" : "var(--surface-active)" }}>
                          <div className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform" style={{ transform: row.threads ? "translateX(14px)" : "translateX(0)" }} />
                        </div>
                      </label>
                      {row.threads && row.type === "video" && (
                        <div className="mt-1">
                          <span className="text-[9px] px-1 py-0.5 rounded" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>5m max</span>
                        </div>
                      )}
                    </td>

                    {/* Schedule */}
                    <td className="px-3 py-3">
                      <div
                        className="text-[12px] font-medium px-2.5 py-1.5 rounded-lg cursor-pointer hover:ring-1 transition-all"
                        style={{ backgroundColor: "var(--bg)", color: "var(--text)", "--tw-ring-color": "var(--border-light)" } as React.CSSProperties}
                      >
                        {row.schedule}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

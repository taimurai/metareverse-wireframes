"use client";
import { useState, useRef, useEffect } from "react";

type MediaType = "image" | "video";

interface ThreadComment {
  id: string;
  text: string;
  delay: string; // e.g. "0m", "5m", "10m"
}

interface GridRow {
  id: string;
  type: MediaType;
  filename: string;
  caption: string;
  comments: ThreadComment[];
  ig: boolean;
  threads: boolean;
  schedule: string;
  selected: boolean;
  charCount: number;
  color: string;
}

const mockMedia: GridRow[] = [
  { id: "1", type: "image", filename: "sunset_beach.jpg", caption: "Did you know that the largest wave ever recorded was 1,720 feet tall? Here are 5 more ocean facts that will blow your mind...", comments: [
    { id: "c1", text: "The ocean covers 71% of Earth's surface 🌊", delay: "0m" },
    { id: "c2", text: "The deepest point is 36,000 ft — the Mariana Trench", delay: "5m" },
  ], ig: true, threads: true, schedule: "9:00 AM", selected: false, charCount: 118, color: "#FF6B2B" },
  { id: "2", type: "video", filename: "workout_routine.mp4", caption: "Watch this incredible 5-minute morning routine that changed everything. No equipment needed!", comments: [], ig: true, threads: true, schedule: "10:30 AM", selected: false, charCount: 86, color: "#6366F1" },
  { id: "3", type: "image", filename: "infographic_health.png", caption: "Breaking: New study reveals the #1 habit of healthy people. The results might surprise you...", comments: [
    { id: "c3", text: "First key finding: consistency beats intensity", delay: "0m" },
    { id: "c4", text: "What experts say about this study 👇", delay: "5m" },
    { id: "c5", text: "How to apply this to your daily routine", delay: "10m" },
  ], ig: true, threads: false, schedule: "12:00 PM", selected: false, charCount: 91, color: "#EC4899" },
  { id: "4", type: "video", filename: "cooking_tutorial.mov", caption: "How to make restaurant-quality pasta in under 10 minutes. Save this for later!", comments: [], ig: false, threads: true, schedule: "1:30 PM", selected: false, charCount: 78, color: "#14B8A6" },
  { id: "5", type: "image", filename: "motivational_quote.jpg", caption: "The only way to do great work is to love what you do. Double tap if you agree!", comments: [
    { id: "c6", text: "What this means for entrepreneurs 💡", delay: "0m" },
    { id: "c7", text: "Real success stories from people who followed their passion", delay: "5m" },
  ], ig: true, threads: true, schedule: "3:00 PM", selected: false, charCount: 77, color: "#F59E0B" },
  { id: "6", type: "image", filename: "historical_facts.png", caption: "In 1969, humans first walked on the moon. Here are 10 things you didn't know about the Apollo mission...", comments: [
    { id: "c8", text: "The computer had less power than your phone 📱", delay: "0m" },
    { id: "c9", text: "They left mirrors on the moon that we still use today", delay: "5m" },
  ], ig: true, threads: true, schedule: "4:30 PM", selected: false, charCount: 103, color: "#8B5CF6" },
  { id: "7", type: "video", filename: "travel_vlog.mp4", caption: "This hidden gem in Bali will leave you speechless. We found paradise!", comments: [], ig: true, threads: false, schedule: "6:00 PM", selected: false, charCount: 70, color: "#06B6D4" },
  { id: "8", type: "image", filename: "tech_news.jpg", caption: "AI just changed everything. Here's what happened this week in tech and why you should care...", comments: [
    { id: "c10", text: "Major breakthrough in reasoning capabilities 🧠", delay: "0m" },
    { id: "c11", text: "New tools released this week you need to try", delay: "5m" },
    { id: "c12", text: "What it means for content creators going forward", delay: "10m" },
  ], ig: true, threads: true, schedule: "7:30 PM", selected: false, charCount: 92, color: "#F43F5E" },
];

export default function BulkGrid() {
  const mode = "media";
  const [rows, setRows] = useState<GridRow[]>(mockMedia);
  const [selectAll, setSelectAll] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: string; field: string } | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

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

                    {/* Threaded Comments */}
                    <td className="px-3 py-3">
                      <ThreadCommentsCell
                        comments={row.comments}
                        isEditing={editingCell?.row === row.id && editingCell?.field === "comments"}
                        onStartEdit={() => setEditingCell({ row: row.id, field: "comments" })}
                        onStopEdit={() => setEditingCell(null)}
                        onChange={(comments) => setRows(r => r.map(x => x.id === row.id ? { ...x, comments } : x))}
                      />
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

/* ── Threaded Comments Cell ── */
function ThreadCommentsCell({
  comments,
  isEditing,
  onStartEdit,
  onStopEdit,
  onChange,
}: {
  comments: ThreadComment[];
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onChange: (comments: ThreadComment[]) => void;
}) {
  const [newText, setNewText] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  // Close on outside click
  useEffect(() => {
    if (!isEditing) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onStopEdit();
        setEditIdx(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isEditing, onStopEdit]);

  const addComment = () => {
    if (!newText.trim()) return;
    const delayMin = comments.length * 5;
    onChange([...comments, {
      id: `new-${Date.now()}`,
      text: newText.trim(),
      delay: `${delayMin}m`,
    }]);
    setNewText("");
  };

  const removeComment = (idx: number) => {
    onChange(comments.filter((_, i) => i !== idx));
  };

  const startInlineEdit = (idx: number) => {
    setEditIdx(idx);
    setEditText(comments[idx].text);
  };

  const saveInlineEdit = () => {
    if (editIdx === null) return;
    if (!editText.trim()) {
      removeComment(editIdx);
    } else {
      onChange(comments.map((c, i) => i === editIdx ? { ...c, text: editText.trim() } : c));
    }
    setEditIdx(null);
  };

  const updateDelay = (idx: number, delay: string) => {
    onChange(comments.map((c, i) => i === idx ? { ...c, delay } : c));
  };

  // Collapsed view
  if (!isEditing) {
    return (
      <div
        className="cursor-pointer rounded-lg p-2 -m-2 hover:ring-1 transition-all"
        style={{ "--tw-ring-color": "var(--border-light)" } as React.CSSProperties}
        onClick={onStartEdit}
      >
        {comments.length > 0 ? (
          <div>
            {/* Show thread preview */}
            <div className="space-y-1">
              {comments.slice(0, 2).map((c, i) => (
                <div key={c.id} className="flex items-start gap-1.5">
                  <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
                    {i < Math.min(comments.length, 2) - 1 && (
                      <div className="w-px h-3" style={{ backgroundColor: "var(--border-light)" }} />
                    )}
                  </div>
                  <span className="text-[10px] line-clamp-1" style={{ color: "var(--text-secondary)" }}>{c.text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-medium" style={{ color: "var(--primary)" }}>
                {comments.length} comment{comments.length > 1 ? "s" : ""} in thread
              </span>
              {comments.length > 2 && (
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>+{comments.length - 2} more</span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Add thread comments
          </div>
        )}
      </div>
    );
  }

  // Expanded editing view
  return (
    <div ref={containerRef} className="rounded-lg p-2 -m-2 min-w-[240px]" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--primary)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
          Thread Comments ({comments.length})
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
          Sequential
        </span>
      </div>

      {/* Comment list */}
      <div className="space-y-1 mb-2">
        {comments.map((c, i) => (
          <div key={c.id} className="flex items-start gap-1.5 group/comment">
            {/* Thread line */}
            <div className="flex flex-col items-center flex-shrink-0 pt-1">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
                {i + 1}
              </div>
              {i < comments.length - 1 && (
                <div className="w-px flex-1 min-h-[8px]" style={{ backgroundColor: "var(--border-light)" }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {editIdx === i ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveInlineEdit(); if (e.key === "Escape") setEditIdx(null); }}
                  onBlur={saveInlineEdit}
                  autoFocus
                  className="w-full text-[11px] px-2 py-1 rounded border outline-none"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--primary)", color: "var(--text)" }}
                />
              ) : (
                <div
                  className="text-[11px] px-2 py-1 rounded cursor-text hover:bg-opacity-50"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => startInlineEdit(i)}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {c.text}
                </div>
              )}

              {/* Delay + actions */}
              <div className="flex items-center gap-1.5 mt-0.5 px-2">
                <select
                  value={c.delay}
                  onChange={(e) => updateDelay(i, e.target.value)}
                  className="text-[9px] px-1 py-0.5 rounded border-none outline-none"
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}
                >
                  <option value="0m">Immediate</option>
                  <option value="1m">+1 min</option>
                  <option value="2m">+2 min</option>
                  <option value="5m">+5 min</option>
                  <option value="10m">+10 min</option>
                  <option value="15m">+15 min</option>
                  <option value="30m">+30 min</option>
                </select>
                <button
                  onClick={() => removeComment(i)}
                  className="opacity-0 group-hover/comment:opacity-100 transition-opacity"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--error)" }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new comment */}
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "1.5px dashed var(--border-light)" }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: "var(--text-muted)" }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
          placeholder="Add a comment..."
          className="flex-1 text-[11px] px-2 py-1.5 rounded border outline-none"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <button
          onClick={addComment}
          disabled={!newText.trim()}
          className="text-[10px] font-semibold px-2 py-1 rounded"
          style={{ backgroundColor: newText.trim() ? "var(--primary)" : "var(--surface-active)", color: newText.trim() ? "white" : "var(--text-muted)" }}
        >
          Add
        </button>
      </div>

      {/* Tip */}
      {comments.length === 0 && (
        <div className="text-[9px] mt-2 px-1" style={{ color: "var(--text-muted)" }}>
          Comments are posted sequentially under the main post. Set delays between each.
        </div>
      )}
    </div>
  );
}

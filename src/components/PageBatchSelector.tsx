"use client";
import { useState, useRef, useEffect } from "react";

const pages = [
  { id: "all", name: "All Pages", avatar: "✦", color: "var(--primary)", followers: "8.2M total", type: "all" as const },
  { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6", followers: "3.2M", type: "page" as const },
  { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M", type: "page" as const },
  { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6", followers: "1.1M", type: "page" as const },
  { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B", followers: "680K", type: "page" as const },
  { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K", type: "page" as const },
  { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899", followers: "310K", type: "page" as const },
  { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9", followers: "136", type: "page" as const },
];

const batches = [
  { id: "b1", name: "Partner A — Lifestyle", pages: ["lc", "ff", "dh"], count: 3, color: "#F59E0B" },
  { id: "b2", name: "Partner B — Education", pages: ["hu", "tb", "mm"], count: 3, color: "#8B5CF6" },
  { id: "b3", name: "Partner C — Women's", pages: ["khn"], count: 1, color: "#EC4899" },
];

interface PageBatchSelectorProps {
  selected: string;
  onChange: (id: string, type: "all" | "page" | "batch") => void;
}

export default function PageBatchSelector({ selected, onChange }: PageBatchSelectorProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"pages" | "batches">("pages");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedItem = pages.find(p => p.id === selected) || batches.find(b => b.id === selected);
  const displayName = selectedItem ? ("name" in selectedItem ? selectedItem.name : "") : "All Pages";
  const displayAvatar = pages.find(p => p.id === selected)?.avatar || "✦";
  const displayColor = pages.find(p => p.id === selected)?.color || batches.find(b => b.id === selected)?.color || "var(--primary)";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border text-[13px] font-medium min-w-[200px]"
        style={{ backgroundColor: "var(--surface)", borderColor: open ? "var(--primary)" : "var(--border)", color: "var(--text)" }}
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: displayColor }}>
          {displayAvatar}
        </div>
        <span className="flex-1 text-left truncate">{displayName}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[300px] rounded-xl border overflow-hidden z-50 shadow-2xl" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
            {(["pages", "batches"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 px-4 py-2.5 text-[12px] font-medium relative"
                style={{ color: tab === t ? "var(--primary)" : "var(--text-muted)" }}
              >
                {t === "pages" ? "Pages" : "Batches"}
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-md" style={{ backgroundColor: tab === t ? "var(--primary-muted)" : "var(--bg)", color: tab === t ? "var(--primary)" : "var(--text-muted)" }}>
                  {t === "pages" ? pages.length : batches.length}
                </span>
                {tab === t && <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder={tab === "pages" ? "Search pages..." : "Search batches..."} className="flex-1 text-[12px] bg-transparent outline-none" style={{ color: "var(--text)" }} />
            </div>
          </div>

          {/* Items */}
          <div className="max-h-[280px] overflow-y-auto px-2 pb-2">
            {tab === "pages" && pages.map((page) => (
              <button
                key={page.id}
                onClick={() => { onChange(page.id, page.type); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
                style={{
                  backgroundColor: selected === page.id ? "var(--primary-muted)" : "transparent",
                }}
                onMouseEnter={(e) => { if (selected !== page.id) e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                onMouseLeave={(e) => { if (selected !== page.id) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: page.color }}>
                  {page.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium truncate" style={{ color: selected === page.id ? "var(--primary)" : "var(--text)" }}>{page.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{page.followers}</div>
                </div>
                {selected === page.id && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--primary)" }}><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}

            {tab === "batches" && (
              <>
                {batches.map((batch) => (
                  <button
                    key={batch.id}
                    onClick={() => { onChange(batch.id, "batch"); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
                    style={{
                      backgroundColor: selected === batch.id ? "var(--primary-muted)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (selected !== batch.id) e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                    onMouseLeave={(e) => { if (selected !== batch.id) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${batch.color}20`, border: `1.5px solid ${batch.color}` }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={batch.color} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium truncate" style={{ color: selected === batch.id ? "var(--primary)" : "var(--text)" }}>{batch.name}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{batch.count} pages</div>
                    </div>
                    {/* Page avatars */}
                    <div className="flex -space-x-1">
                      {batch.pages.slice(0, 3).map((pid) => {
                        const p = pages.find(pg => pg.id === pid);
                        return p ? (
                          <div key={pid} className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-bold border" style={{ backgroundColor: p.color, borderColor: "var(--surface)" }}>
                            {p.avatar}
                          </div>
                        ) : null;
                      })}
                    </div>
                    {selected === batch.id && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--primary)" }}><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                ))}

                {/* Create batch CTA */}
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mt-1" style={{ borderTop: "1px solid var(--border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--bg)", border: "1.5px dashed var(--border-light)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
                  <div className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Create new batch</div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

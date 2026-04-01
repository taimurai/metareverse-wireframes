"use client";
import { useState } from "react";
import Header from "@/components/Header";

const PAGES = [
  { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6", followers: "3.2M", platforms: ["FB", "IG"], status: "connected" },
  { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B", followers: "2.4M", platforms: ["FB", "IG", "TH"], status: "connected" },
  { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6", followers: "1.1M", platforms: ["FB", "IG", "TH"], status: "expiring" },
  { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B", followers: "680K", platforms: ["FB", "IG"], status: "disconnected" },
  { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1", followers: "420K", platforms: ["FB"], status: "connected" },
  { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899", followers: "310K", platforms: ["FB", "IG"], status: "connected" },
  { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9", followers: "136K", platforms: ["FB"], status: "connected" },
];

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: "photo" | "reel";
  caption: string;
  thread: string;
  showThread: boolean;
  platforms: string[];
}

const INITIAL_FILES: UploadedFile[] = [
  { id: "f1", name: "morning-coffee.jpg", size: "2.4 MB", type: "photo", caption: "", thread: "", showThread: false, platforms: ["FB", "IG"] },
  { id: "f2", name: "workout-reel.mp4", size: "18 MB", type: "reel", caption: "", thread: "", showThread: false, platforms: ["FB"] },
  { id: "f3", name: "history-map.jpg", size: "3.1 MB", type: "photo", caption: "", thread: "", showThread: false, platforms: ["FB", "IG"] },
  { id: "f4", name: "finance-tip.jpg", size: "1.8 MB", type: "photo", caption: "", thread: "", showThread: false, platforms: ["FB"] },
  { id: "f5", name: "diet-reel.mp4", size: "22 MB", type: "reel", caption: "", thread: "", showThread: false, platforms: ["FB", "IG"] },
  { id: "f6", name: "tech-leak.jpg", size: "2.9 MB", type: "photo", caption: "", thread: "", showThread: false, platforms: ["FB"] },
];

type CopyrightStatus = "scanning" | "clear" | "possible_match" | "flagged";
const COPYRIGHT_SCAN: Record<string, { status: CopyrightStatus; match?: string }> = {
  f1: { status: "clear" },
  f2: { status: "possible_match", match: "Upbeat Pop Track (Unidentified)" },
  f3: { status: "clear" },
  f4: { status: "clear" },
  f5: { status: "flagged", match: 'Calvin Harris — "Summer"' },
  f6: { status: "clear" },
};

const AUTO_SLOTS = [
  { time: "Today, 3:00 PM",    tz: "EST" },
  { time: "Today, 4:30 PM",    tz: "EST" },
  { time: "Today, 6:00 PM",    tz: "EST" },
  { time: "Tomorrow, 8:00 AM", tz: "EST" },
  { time: "Tomorrow, 10:00 AM",tz: "EST" },
  { time: "Tomorrow, 12:00 PM",tz: "EST" },
];

type Stage = "select-page" | "upload" | "uploading" | "captioning" | "done" | "auto-preview";

const STEPS = [
  { n: 1, label: "Select Page" },
  { n: 2, label: "Upload Media" },
  { n: 3, label: "Add Captions" },
  { n: 4, label: "Save to Drafts" },
];

const stageIndex = (s: Stage) => {
  if (s === "select-page") return 0;
  if (s === "upload") return 1;
  if (s === "uploading") return 1;
  if (s === "captioning") return 2;
  return 3;
};

export default function BulkUploadPage() {
  const [stage, setStage] = useState<Stage>("select-page");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pageSearch, setPageSearch] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>(INITIAL_FILES);

  const selectedPageData = PAGES.find(p => p.id === selectedPage);
  const filteredPages = PAGES.filter(p =>
    p.name.toLowerCase().includes(pageSearch.toLowerCase())
  );
  const captionedCount = files.filter(f => f.caption.trim().length > 0).length;

  const handleSelectPage = (id: string) => {
    const page = PAGES.find(p => p.id === id);
    if (page?.status === "disconnected") return;
    setSelectedPage(id);
    setStage("upload");
  };

  const startUpload = () => {
    setStage("uploading");
    setProgress(0);
    setUploadCount(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        setUploadCount(c => Math.min(c + 1, 6));
        return p + 17;
      });
    }, 200);
    setTimeout(() => setStage("captioning"), 1800);
  };

  const updateFile = (id: string, field: keyof UploadedFile, value: string | boolean | string[]) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const togglePlatform = (id: string, platform: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id !== id) return f;
      const has = f.platforms.includes(platform);
      if (has && f.platforms.length === 1) return f; // keep at least one
      return { ...f, platforms: has ? f.platforms.filter(p => p !== platform) : [...f.platforms, platform] };
    }));
  };

  const statusDot = (status: string) => {
    if (status === "connected") return "var(--success)";
    if (status === "expiring") return "var(--warning)";
    return "var(--error)";
  };

  const activeStep = stageIndex(stage);

  return (
    <div>
      <Header
        title="Bulk Upload"
        subtitle="Select a page, drop your images, add captions — save to Drafts"
      />

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((step, i) => (
          <div key={step.n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                style={{
                  backgroundColor: i < activeStep ? "var(--success)" : i === activeStep ? "var(--primary)" : "var(--surface)",
                  color: i <= activeStep ? "white" : "var(--text-muted)",
                }}
              >
                {i < activeStep ? "✓" : step.n}
              </div>
              <span className="text-[12px] font-medium" style={{
                color: i < activeStep ? "var(--success)" : i === activeStep ? "var(--text)" : "var(--text-muted)",
              }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-10 h-px mx-3" style={{ backgroundColor: i < activeStep ? "var(--success)" : "var(--border-light)", opacity: i < activeStep ? 0.5 : 1 }} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: SELECT PAGE ── */}
      {stage === "select-page" && (
        <div>
          <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
            Which page are you uploading for?
          </p>
          <div className="relative mb-4 max-w-2xl">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search pages..."
              value={pageSearch}
              onChange={e => setPageSearch(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[13px] outline-none"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            {pageSearch && (
              <button onClick={() => setPageSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            {filteredPages.length === 0 && (
              <div className="col-span-2 py-8 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
                No pages match &ldquo;{pageSearch}&rdquo;
              </div>
            )}
            {filteredPages.map(page => (
              <button
                key={page.id}
                onClick={() => handleSelectPage(page.id)}
                disabled={page.status === "disconnected"}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all"
                style={{
                  backgroundColor: "var(--surface)", borderColor: "var(--border)",
                  opacity: page.status === "disconnected" ? 0.45 : 1,
                  cursor: page.status === "disconnected" ? "not-allowed" : "pointer",
                }}
                onMouseEnter={e => { if (page.status !== "disconnected") (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0" style={{ backgroundColor: page.color }}>
                  {page.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold truncate" style={{ color: "var(--text)" }}>{page.name}</span>
                    {page.status === "expiring" && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "var(--warning)" }}>Expiring</span>}
                    {page.status === "disconnected" && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "var(--error)" }}>Disconnected</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusDot(page.status) }} />
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{page.followers} followers · {page.platforms.join(" + ")}</span>
                  </div>
                </div>
                {page.status !== "disconnected" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[11px]" style={{ color: "var(--text-muted)" }}>
            Money Matters is disconnected — reconnect it in{" "}
            <a href="/settings/connections" className="underline" style={{ color: "var(--primary)" }}>Connected IDs</a> first.
          </p>
        </div>
      )}

      {/* ── STEP 2: DROPZONE ── */}
      {stage === "upload" && selectedPageData && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: selectedPageData.color }}>
              {selectedPageData.avatar}
            </div>
            <div>
              <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{selectedPageData.name}</span>
              <span className="text-[12px] ml-2" style={{ color: "var(--text-muted)" }}>{selectedPageData.platforms.join(" + ")}</span>
            </div>
            <button onClick={() => { setSelectedPage(null); setStage("select-page"); }} className="ml-2 text-[11px] px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
              Change
            </button>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => { e.preventDefault(); setIsDragging(false); startUpload(); }}
            onClick={startUpload}
            className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
            style={{ minHeight: 300, borderColor: isDragging ? "var(--primary)" : "var(--border)", backgroundColor: isDragging ? "rgba(255,107,43,0.06)" : "var(--surface)" }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: isDragging ? "rgba(255,107,43,0.15)" : "var(--surface-hover)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isDragging ? "var(--primary)" : "var(--text-muted)" }}>
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>
              {isDragging ? "Drop to upload" : "Drag & drop your images or videos"}
            </p>
            <p className="text-[12px] mb-5" style={{ color: "var(--text-muted)" }}>
              or click to browse · JPG, PNG, MP4, MOV · Images max 10MB · Videos max 100MB
            </p>
            <div className="px-5 py-2.5 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: "var(--primary)", color: "white" }}>
              Browse Files
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOADING ── */}
      {stage === "uploading" && selectedPageData && (
        <div className="rounded-2xl border p-10 flex flex-col items-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", minHeight: 280 }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: selectedPageData.color + "22" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: selectedPageData.color }}>
              {selectedPageData.avatar}
            </div>
          </div>
          <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>Uploading to {selectedPageData.name}</p>
          <p className="text-[12px] mb-6" style={{ color: "var(--text-muted)" }}>{uploadCount} of 6 files...</p>
          <div className="w-80 h-2 rounded-full mb-2" style={{ backgroundColor: "var(--surface-hover)" }}>
            <div className="h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: "var(--primary)" }} />
          </div>
          <p className="text-[11px] mb-6" style={{ color: "var(--text-muted)" }}>{Math.min(progress, 100)}%</p>
          <div className="flex flex-col gap-1.5 w-80">
            {INITIAL_FILES.slice(0, uploadCount).map(f => (
              <div key={f.id} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--success)", flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>{f.name}</span>
                <span className="text-[10px] ml-auto" style={{ color: "var(--text-muted)" }}>{f.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3: CAPTION EDITOR ── */}
      {stage === "captioning" && selectedPageData && (
        <div>
          {/* Header bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: selectedPageData.color }}>
                {selectedPageData.avatar}
              </div>
              <div>
                <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{selectedPageData.name}</span>
                <span className="text-[12px] ml-2" style={{ color: "var(--text-muted)" }}>6 files uploaded</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: captionedCount > 0 ? "var(--success)" : "var(--text-muted)" }}>
                {captionedCount} of {files.length} captioned
              </span>
              <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(captionedCount / files.length) * 100}%`, backgroundColor: "var(--success)" }} />
              </div>
            </div>
          </div>

          {/* File rows */}
          <div className="flex flex-col gap-3">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="rounded-xl border overflow-hidden"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: file.caption.trim() ? "rgba(74,222,128,0.2)" : "var(--border)",
                }}
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div
                    className="flex-shrink-0 rounded-xl flex items-center justify-center relative"
                    style={{ width: 96, height: 96, backgroundColor: "var(--surface-hover)" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
                      {file.type === "reel"
                        ? <><polygon points="5 3 19 12 5 21 5 3" /></>
                        : <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>
                      }
                    </svg>
                    {/* type badge */}
                    <span
                      className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: file.type === "reel" ? "rgba(139,92,246,0.8)" : "rgba(14,165,233,0.8)", color: "white" }}
                    >
                      {file.type === "reel" ? "REEL" : "PHOTO"}
                    </span>
                    {/* index */}
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
                      {idx + 1}
                    </span>
                  </div>

                  {/* Caption + controls */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                    {/* Filename */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{file.name} · {file.size}</span>
                      {/* Platform toggles */}
                      <div className="flex items-center gap-1">
                        {["FB", "IG", "TH"].map(p => (
                          <button
                            key={p}
                            onClick={() => togglePlatform(file.id, p)}
                            className="text-[10px] font-bold px-2 py-0.5 rounded transition-all"
                            style={{
                              backgroundColor: file.platforms.includes(p) ? "rgba(255,107,43,0.15)" : "var(--surface-hover)",
                              color: file.platforms.includes(p) ? "var(--primary)" : "var(--text-muted)",
                              border: `1px solid ${file.platforms.includes(p) ? "rgba(255,107,43,0.3)" : "transparent"}`,
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Caption textarea */}
                    <textarea
                      rows={2}
                      placeholder="Write a caption... (or skip and add later in Drafts)"
                      value={file.caption}
                      onChange={e => updateFile(file.id, "caption", e.target.value)}
                      className="w-full text-[13px] px-3 py-2.5 rounded-xl border outline-none resize-none"
                      style={{
                        backgroundColor: "var(--bg)",
                        borderColor: file.caption.trim() ? "rgba(74,222,128,0.3)" : "var(--border-light)",
                        color: "var(--text)",
                        lineHeight: 1.5,
                      }}
                    />

                    {/* Copyright scan result */}
                    {(() => {
                      const scan = COPYRIGHT_SCAN[file.id];
                      if (!scan || scan.status === "scanning") return (
                        <div className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--text-muted)" }} />
                          Scanning for copyright issues...
                        </div>
                      );
                      if (scan.status === "clear") return (
                        <div className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(74,222,128,0.08)", color: "#4ADE80" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          No copyright issues detected
                        </div>
                      );
                      if (scan.status === "possible_match") return (
                        <div className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(251,191,36,0.08)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.2)" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                          Possible match: {scan.match} — may affect distribution
                        </div>
                      );
                      return (
                        <div className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                          Copyright detected: {scan.match} — post may be muted or removed
                        </div>
                      );
                    })()}

                    {/* Thread toggle + input */}
                    <div>
                      {!file.showThread ? (
                        <button
                          onClick={() => updateFile(file.id, "showThread", true)}
                          className="text-[11px] flex items-center gap-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                          + Add thread comment
                        </button>
                      ) : (
                        <input
                          type="text"
                          placeholder="Thread comment (optional)..."
                          value={file.thread}
                          onChange={e => updateFile(file.id, "thread", e.target.value)}
                          autoFocus
                          className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
                          style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text)" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom action bar */}
          <div
            className="sticky bottom-0 flex items-center justify-between mt-4 px-5 py-4 rounded-xl border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-4 text-[12px]" style={{ color: "var(--text-muted)" }}>
              <span>{files.filter(f => f.caption.trim()).length} captions written</span>
              <span>·</span>
              <span>{files.filter(f => f.thread.trim()).length} thread comments</span>
              <span>·</span>
              <span>{files.length - files.filter(f => f.caption.trim()).length} still empty</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStage("done")}
                className="text-[12px] px-4 py-2 rounded-xl"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}
              >
                Skip — Add Captions in Drafts
              </button>
              <button
                onClick={() => setStage("done")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
                style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
              >
                Save {files.length} Posts to Drafts
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: DONE ── */}
      {stage === "done" && selectedPageData && (
        <div className="rounded-2xl border p-10 flex flex-col items-center text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", minHeight: 300 }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(74,222,128,0.12)" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--success)" }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-[18px] font-bold mb-1" style={{ color: "var(--text)" }}>
            {files.length} posts saved to Drafts
          </p>
          <p className="text-[13px] mb-2" style={{ color: "var(--text-secondary)" }}>
            for <strong>{selectedPageData.name}</strong>
          </p>
          <p className="text-[12px] mb-8 max-w-sm" style={{ color: "var(--text-muted)" }}>
            {captionedCount > 0
              ? `${captionedCount} posts already have captions. ${files.length - captionedCount > 0 ? `${files.length - captionedCount} still need captions — finish them in Drafts.` : "All captioned — ready to schedule!"}`
              : "Head to Drafts to add captions, then schedule when ready."}
          </p>
          <div className="flex items-center gap-6 mb-8">
            {[
              { label: "Photos", value: files.filter(f => f.type === "photo").length },
              { label: "Reels", value: files.filter(f => f.type === "reel").length },
              { label: "Captioned", value: captionedCount },
              { label: "Needs Caption", value: files.length - captionedCount },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-[20px] font-bold" style={{ color: stat.label === "Needs Caption" && stat.value > 0 ? "var(--warning)" : "var(--text)" }}>{stat.value}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                </div>
                {i < arr.length - 1 && <div className="w-px h-8" style={{ backgroundColor: "var(--border-light)" }} />}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStage("auto-preview")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold text-white"
              style={{ backgroundColor: "#22c55e", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Auto-Schedule {files.length} Posts
            </button>
            <a href="/drafts" className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold border"
              style={{ backgroundColor: "transparent", color: "var(--text-secondary)", borderColor: "var(--border)" }}>
              Go to Drafts
            </a>
            <button
              onClick={() => { setStage("upload"); setProgress(0); setUploadCount(0); setFiles(INITIAL_FILES); }}
              className="px-5 py-3 rounded-xl text-[13px] font-medium"
              style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}
            >
              Upload More
            </button>
          </div>
        </div>
      )}

      {/* ── AUTO-PREVIEW ── */}
      {stage === "auto-preview" && selectedPageData && (
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: selectedPageData.color }}>
              {selectedPageData.avatar}
            </div>
            <div>
              <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{selectedPageData.name}</span>
              <span className="text-[12px] ml-2" style={{ color: "var(--text-muted)" }}>· Auto-slot preview</span>
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            {/* Info banner */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ backgroundColor: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.2)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span className="text-[12px]" style={{ color: "#4ADE80" }}>
                Posts will fill the next {files.length} available slots · Every 2h · EST · Quiet hours (11PM–7AM) skipped
              </span>
            </div>

            {/* Slot rows */}
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {files.map((file, i) => (
                <div key={file.id} className="flex items-center gap-4 px-5 py-3.5">
                  {/* thumbnail placeholder */}
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
                      {file.type === "reel"
                        ? <polygon points="5 3 19 12 5 21 5 3" />
                        : <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] truncate" style={{ color: "var(--text)" }}>
                      {file.caption.trim() ? file.caption.slice(0, 55) + "…" : <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No caption yet — add in Drafts</span>}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{file.name} · {file.type === "reel" ? "Reel" : "Photo"}</p>
                  </div>
                  {/* Slot */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-semibold" style={{ color: "#4ADE80" }}>{AUTO_SLOTS[i % AUTO_SLOTS.length].time}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{AUTO_SLOTS[i % AUTO_SLOTS.length].tz}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" className="flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              ))}
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between mt-5 px-5 py-4 rounded-xl border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              {files.length} posts · {files.filter(f => f.caption.trim()).length} captioned · {files.filter(f => !f.caption.trim()).length} need captions
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStage("done")}
                className="text-[12px] px-4 py-2 rounded-xl border"
                style={{ backgroundColor: "transparent", color: "var(--text-secondary)", borderColor: "var(--border)" }}
              >
                ← Back
              </button>
              <button
                onClick={() => window.location.href = "/queue"}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white"
                style={{ backgroundColor: "#22c55e", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Confirm — Add to Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

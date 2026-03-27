"use client";
import { useState } from "react";
import Header from "@/components/Header";
import UploadDropzone from "@/components/UploadDropzone";
import BulkGrid from "@/components/BulkGrid";

type Stage = "empty" | "uploading" | "ready";

export default function BulkUploadPage() {
  const [stage, setStage] = useState<Stage>("empty");
  const [progress, setProgress] = useState(0);
  const [selectedPage, setSelectedPage] = useState("history-uncovered");

  const handleUpload = () => {
    setStage("uploading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setStage("ready");
          return 100;
        }
        return p + 12;
      });
    }, 200);
  };

  return (
    <div>
      <Header
        title="Bulk Upload"
        subtitle="Upload multiple images and videos, edit captions, and schedule in bulk"
        actions={
          stage === "ready" ? (
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Add to Queue
            </button>
          ) : undefined
        }
      />

      {/* Page selector */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
          Target Page
        </label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="text-[13px] px-4 py-2.5 rounded-xl border outline-none min-w-[220px]"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-light)", color: "var(--text)" }}
        >
          <option value="history-uncovered">History Uncovered</option>
          <option value="daily-health">Daily Health Tips</option>
          <option value="techbyte">TechByte</option>
          <option value="fitness-factory">Fitness Factory</option>
          <option value="laugh-central">Laugh Central</option>
          <option value="know-her-name">Know Her Name</option>
        </select>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
          Connected &middot; FB + IG + Threads
        </div>
      </div>

      {/* Content */}
      {stage === "empty" && <UploadDropzone onUpload={handleUpload} />}

      {stage === "uploading" && (
        <div
          className="rounded-xl border p-10 text-center"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-8 mb-8">
              {[
                { label: "Uploading", done: progress >= 100 },
                { label: "Processing", done: false },
                { label: "Ready", done: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: s.done ? "var(--success)" : i === 0 ? "var(--primary)" : "var(--surface-active)",
                      color: s.done || i === 0 ? "white" : "var(--text-muted)",
                    }}
                  >
                    {s.done ? "✓" : i + 1}
                  </div>
                  <span className="text-[12px] font-medium" style={{ color: s.done ? "var(--success)" : i === 0 ? "var(--text)" : "var(--text-muted)" }}>
                    {s.label}
                  </span>
                  {i < 2 && <div className="w-8 h-px ml-2" style={{ backgroundColor: "var(--border-light)" }} />}
                </div>
              ))}
            </div>
            <div className="w-full h-2 rounded-full mb-3" style={{ backgroundColor: "var(--surface-active)" }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: "var(--primary)" }} />
            </div>
            <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
              Uploading {Math.min(Math.round((progress / 100) * 8), 8)} of 8 files...
            </p>
          </div>
        </div>
      )}

      {stage === "ready" && (
        <div>
          {/* Upload success bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 rounded-xl mb-4"
            style={{ backgroundColor: "var(--success-bg)", border: "1px solid rgba(74, 222, 128, 0.15)" }}
          >
            <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--success)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              <span style={{ color: "var(--text-secondary)" }}>8 files uploaded successfully. Edit captions and schedule below.</span>
            </div>
            <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>
              + Add more files
            </button>
          </div>

          {/* Schedule controls */}
          <div
            className="flex items-center gap-4 px-5 py-3.5 rounded-xl mb-4 border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>Auto-fill schedule:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Every</span>
              <select className="text-[12px] px-3 py-1.5 rounded-lg border outline-none" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text)" }}>
                <option>1 hour</option>
                <option>1.5 hours</option>
                <option>2 hours</option>
                <option>3 hours</option>
                <option>4 hours</option>
              </select>
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>starting</span>
              <input type="text" defaultValue="9:00 AM" className="text-[12px] px-3 py-1.5 rounded-lg border outline-none w-24 text-center" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text)" }} />
            </div>

            <div className="h-5 w-px mx-1" style={{ backgroundColor: "var(--border-light)" }} />

            <div className="flex items-center gap-2">
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Distribution:</span>
              <select className="text-[12px] px-3 py-1.5 rounded-lg border outline-none" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text)" }}>
                <option>Even spread</option>
                <option>Alternate</option>
                <option>Manual</option>
              </select>
            </div>

            <button className="ml-auto text-[12px] font-semibold px-4 py-1.5 rounded-lg" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
              Apply
            </button>
          </div>

          {/* Grid */}
          <BulkGrid />

          {/* Bottom bar */}
          <div
            className="flex items-center justify-between mt-4 px-5 py-4 rounded-xl border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-6">
              <div className="text-[13px]">
                <span style={{ color: "var(--text-muted)" }}>Total: </span>
                <span className="font-semibold" style={{ color: "var(--text)" }}>8 posts</span>
              </div>
              <div className="text-[13px]">
                <span style={{ color: "var(--text-muted)" }}>Span: </span>
                <span className="font-semibold" style={{ color: "var(--text)" }}>~16 hours</span>
              </div>
              <div className="text-[13px]">
                <span style={{ color: "var(--text-muted)" }}>Cross-posting: </span>
                <span className="font-semibold" style={{ color: "var(--text)" }}>6 IG, 5 Threads</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-[13px] font-medium px-4 py-2.5 rounded-xl" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }}>
                Save as Draft
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
                Add 8 Posts to Queue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

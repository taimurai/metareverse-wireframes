"use client";
import { useState } from "react";

interface UploadDropzoneProps {
  onUpload: (count: number) => void;
}

export default function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className="rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200"
      style={{
        borderColor: dragging ? "var(--primary)" : "var(--border-light)",
        backgroundColor: dragging ? "var(--primary-muted)" : "transparent",
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); onUpload(8); }}
      onClick={() => onUpload(8)}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: "var(--primary-muted)" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>
        Drag & drop files here
      </div>
      <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
        or click to browse. Supports JPG, PNG, GIF, MP4, MOV
      </p>
      <div className="flex items-center justify-center gap-4 text-[11px]" style={{ color: "var(--text-muted)" }}>
        <span>Images: max 10MB</span>
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--text-muted)" }} />
        <span>Videos: max 100MB</span>
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--text-muted)" }} />
        <span>Mix of images & videos OK</span>
      </div>
    </div>
  );
}

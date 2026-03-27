"use client";
import Modal from "../Modal";

interface Props { open: boolean; onClose: () => void; }

export default function PartialSuccessModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Partial Success" subtitle="Some platforms failed for this post" size="md"
      footer={<button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }} onClick={onClose}>Done</button>}
    >
      <div className="py-2">
        {/* Post preview */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "var(--bg)" }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: "#F59E0B" }}>MM</div>
          <div>
            <p className="text-[12px] font-medium line-clamp-1" style={{ color: "var(--text)" }}>5 Investment Tips for 2025 that every beginner should know...</p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Money Matters &middot; Dec 14, 2:00 PM</p>
          </div>
        </div>

        {/* Platform results */}
        <div className="space-y-2 mb-5">
          {[
            { platform: "Facebook", code: "FB", color: "#4A90D9", status: "success", detail: "Post published successfully", postUrl: "fb.com/post/123" },
            { platform: "Instagram", code: "IG", color: "#E1306C", status: "failed", detail: "Token expired — re-authentication required", postUrl: null },
            { platform: "Threads", code: "TH", color: "#9494A8", status: "failed", detail: "Rate limited — retry in 5 minutes", postUrl: null },
            { platform: "Comments (2)", code: "💬", color: "#6366F1", status: "success", detail: "Both comments posted", postUrl: null },
          ].map((p) => (
            <div key={p.platform} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ backgroundColor: p.color + "22", color: p.color }}>{p.code}</span>
                <div>
                  <p className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{p.platform}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{p.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {p.status === "success" ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Published
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>Failed</span>
                    <button className="text-[11px] font-semibold px-3 py-1 rounded-lg text-white" style={{ backgroundColor: "var(--primary)" }}>Retry</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

"use client";
import { useState } from "react";
import Modal from "../Modal";

interface Props { open: boolean; onClose: () => void; }

export default function ReconnectModal({ open, onClose }: Props) {
  const [step, setStep] = useState<"confirm" | "loading" | "done">("confirm");

  const handleReconnect = () => {
    setStep("loading");
    setTimeout(() => setStep("done"), 2000);
  };
  const handleDone = () => { setStep("confirm"); onClose(); };

  return (
    <Modal open={open} onClose={handleDone} title="Reconnect Pages" subtitle="Re-authenticate to restore posting access" size="sm">
      {step === "confirm" && (
        <div className="py-2">
          <div className="px-4 py-3 rounded-xl mb-4" style={{ backgroundColor: "var(--warning-bg)", border: "1px solid rgba(251, 191, 36, 0.15)" }}>
            <div className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0" style={{ color: "var(--warning)" }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <p className="text-[12px] font-medium" style={{ color: "var(--warning)" }}>Token expired</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>3 pages are disconnected. 8 scheduled posts are paused.</p>
              </div>
            </div>
          </div>

          <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
            One OAuth flow will restore all pages tied to this Facebook account:
          </p>

          <div className="space-y-1.5 mb-6">
            {[
              { name: "Money Matters", status: "expired", posts: 5 },
              { name: "TechByte", status: "expiring", posts: 2 },
              { name: "Parenting Hub", status: "expiring", posts: 1 },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between px-4 py-2.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.status === "expired" ? "var(--error)" : "var(--warning)" }} />
                  <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{p.name}</span>
                </div>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{p.posts} posts paused</span>
              </div>
            ))}
          </div>

          <button onClick={handleReconnect} className="w-full py-3 rounded-xl text-[14px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
            Reconnect All via Facebook
          </button>
          <p className="text-[11px] text-center mt-3" style={{ color: "var(--text-muted)" }}>Paused posts will automatically resume after reconnection.</p>
        </div>
      )}

      {step === "loading" && (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Reconnecting to Facebook...</p>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--success-bg)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: "var(--success)" }}><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>All Pages Reconnected</p>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-secondary)" }}>8 paused posts have been resumed.</p>
          <button onClick={handleDone} className="w-full py-3 rounded-xl text-[14px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>Done</button>
        </div>
      )}
    </Modal>
  );
}

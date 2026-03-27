"use client";
import { useState } from "react";
import Modal from "../Modal";

interface Props { open: boolean; onClose: () => void; }

export default function ConnectFacebookModal({ open, onClose }: Props) {
  const [step, setStep] = useState<"start" | "loading" | "permissions" | "success">("start");

  const handleConnect = () => {
    setStep("loading");
    setTimeout(() => setStep("permissions"), 1500);
  };

  const handleGrant = () => {
    setStep("loading");
    setTimeout(() => setStep("success"), 1200);
  };

  const handleDone = () => { setStep("start"); onClose(); };

  return (
    <Modal open={open} onClose={handleDone} title="Connect Facebook" subtitle="Link your Facebook account to manage Pages" size="md">
      {step === "start" && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#1877F222" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </div>
          <p className="text-[14px] font-medium mb-2" style={{ color: "var(--text)" }}>Connect your Facebook profile</p>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-secondary)" }}>
            We&apos;ll access your managed Pages, linked Instagram, and Threads accounts.
          </p>
          <button
            onClick={handleConnect}
            className="w-full py-3 rounded-xl text-[14px] font-semibold text-white"
            style={{ backgroundColor: "#1877F2" }}
          >
            Continue with Facebook
          </button>
          <p className="text-[11px] mt-4" style={{ color: "var(--text-muted)" }}>
            We only request permissions needed for posting. Your login credentials are never stored.
          </p>
        </div>
      )}

      {step === "loading" && (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Connecting to Facebook...</p>
        </div>
      )}

      {step === "permissions" && (
        <div className="py-2">
          <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
            MetaReverse needs the following permissions:
          </p>
          <div className="space-y-2 mb-6">
            {[
              { perm: "pages_show_list", desc: "List all pages you manage", required: true },
              { perm: "pages_read_engagement", desc: "Read page metrics", required: true },
              { perm: "pages_manage_posts", desc: "Create, edit, delete posts", required: true },
              { perm: "pages_read_user_content", desc: "Read comments on posts", required: true },
              { perm: "pages_manage_metadata", desc: "Access page settings", required: true },
              { perm: "instagram_basic", desc: "Access linked Instagram", required: false },
              { perm: "instagram_content_publish", desc: "Post to Instagram", required: false },
              { perm: "threads_basic", desc: "Access Threads profile", required: false },
              { perm: "threads_content_publish", desc: "Post to Threads", required: false },
            ].map((p) => (
              <div key={p.perm} className="flex items-center justify-between px-4 py-2.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                <div className="flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--success)" }}><polyline points="20 6 9 17 4 12" /></svg>
                  <div>
                    <div className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{p.desc}</div>
                    <div className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{p.perm}</div>
                  </div>
                </div>
                {p.required && <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>Required</span>}
              </div>
            ))}
          </div>
          <button
            onClick={handleGrant}
            className="w-full py-3 rounded-xl text-[14px] font-semibold text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Grant Permissions
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--success-bg)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--success)" }}><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <p className="text-[16px] font-semibold mb-2" style={{ color: "var(--text)" }}>Connected Successfully!</p>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-secondary)" }}>
            Found 7 Pages, 5 Instagram accounts, and 4 Threads profiles.
          </p>
          <div className="space-y-1.5 mb-6 text-left">
            {["History Uncovered", "Daily Health Tips", "TechByte", "Fitness Factory"].map((p) => (
              <div key={p} className="flex items-center gap-2.5 px-4 py-2 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
                <span className="text-[12px]" style={{ color: "var(--text)" }}>{p}</span>
                <div className="flex gap-1 ml-auto">
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#1877F222", color: "#4A90D9" }}>FB</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#E1306C22", color: "#E1306C" }}>IG</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--border-light)", color: "var(--text-secondary)" }}>TH</span>
                </div>
              </div>
            ))}
            <p className="text-[11px] px-4 pt-1" style={{ color: "var(--text-muted)" }}>+ 3 more pages</p>
          </div>
          <button onClick={handleDone} className="w-full py-3 rounded-xl text-[14px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
            Go to Dashboard
          </button>
        </div>
      )}
    </Modal>
  );
}

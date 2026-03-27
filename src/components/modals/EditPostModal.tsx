"use client";
import Modal from "../Modal";

interface Props { open: boolean; onClose: () => void; }

export default function EditPostModal({ open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Scheduled Post"
      subtitle="History Uncovered &middot; Scheduled for Dec 15, 9:00 AM"
      size="lg"
      footer={
        <>
          <button className="px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }} onClick={onClose}>Cancel</button>
          <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>Save Changes</button>
        </>
      }
    >
      <div className="space-y-5 py-2">
        {/* Media */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Media</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FF6B2B" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div>
              <p className="text-[12px] font-medium" style={{ color: "var(--text)" }}>sunset_beach.jpg</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>1200 x 628 &middot; 2.4 MB</p>
              <button className="text-[11px] font-medium mt-1" style={{ color: "var(--primary)" }}>Replace media</button>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Caption</label>
          <textarea
            className="w-full text-[13px] p-3.5 rounded-xl border resize-none outline-none"
            style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text)", minHeight: "100px" }}
            defaultValue="Did you know that the largest wave ever recorded was 1,720 feet tall? Here are 5 more ocean facts that will blow your mind..."
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>118/2,200 (IG limit)</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>118/500 (Threads limit)</span>
          </div>
        </div>

        {/* Thread Comments */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Thread Comments (FB only)</label>
          <textarea
            className="w-full text-[13px] p-3.5 rounded-xl border resize-none outline-none"
            style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text)", minHeight: "70px" }}
            defaultValue={"1. The ocean covers 71% of Earth\n2. The deepest point is 36,000 ft"}
            placeholder="1. First comment&#10;2. Second comment"
          />
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>2/12 comments &middot; 8,000 chars per comment max</span>
        </div>

        {/* Schedule + Toggles */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Schedule</label>
            <input
              type="text"
              defaultValue="Dec 15, 2024 — 9:00 AM"
              className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border outline-none"
              style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Thumbnail</label>
            <button className="w-full text-[13px] px-3.5 py-2.5 rounded-xl border text-left" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text-secondary)" }}>
              Auto (first frame) ▼
            </button>
          </div>
        </div>

        {/* Cross-post toggles */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-3 block" style={{ color: "var(--text-muted)" }}>Cross-posting</label>
          <div className="flex gap-4">
            {[
              { label: "Facebook", code: "FB", color: "#1877F2", enabled: true, locked: true },
              { label: "Instagram", code: "IG", color: "#E1306C", enabled: true, locked: false },
              { label: "Threads", code: "TH", color: "#9494A8", enabled: true, locked: false },
            ].map((p) => (
              <div key={p.code} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: p.color + "22", color: p.color }}>{p.code}</span>
                <span className="text-[12px]" style={{ color: "var(--text)" }}>{p.label}</span>
                <label className="relative inline-flex cursor-pointer ml-2">
                  <input type="checkbox" defaultChecked={p.enabled} disabled={p.locked} className="sr-only peer" />
                  <div className="w-8 h-[18px] rounded-full" style={{ backgroundColor: p.enabled ? "var(--primary)" : "var(--surface-active)" }}>
                    <div className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform" style={{ transform: p.enabled ? "translateX(14px)" : "translateX(0)" }} />
                  </div>
                </label>
                {p.locked && <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>Always on</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

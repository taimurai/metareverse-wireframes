"use client";
import Modal from "../Modal";

interface Props { open: boolean; onClose: () => void; }

export default function RetryModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Retry Post" subtitle="Choose what to retry" size="sm"
      footer={
        <>
          <button className="px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }} onClick={onClose}>Cancel</button>
          <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>Retry Selected</button>
        </>
      }
    >
      <div className="py-2">
        <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
          Select which platforms to retry for this post:
        </p>
        <div className="space-y-2 mb-4">
          {[
            { label: "Retry full post (Facebook + all)", desc: "Re-publishes the entire post to all platforms", checked: false },
            { label: "Retry Instagram only", desc: "Re-attempt Instagram cross-post", checked: true },
            { label: "Retry Threads only", desc: "Re-attempt Threads cross-post", checked: true },
            { label: "Retry failed comments only", desc: "Re-post comments that failed", checked: false },
          ].map((opt, i) => (
            <label key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer" style={{ backgroundColor: "var(--bg)" }}>
              <input type="checkbox" defaultChecked={opt.checked} className="mt-0.5 rounded accent-orange-500" />
              <div>
                <p className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{opt.label}</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="px-4 py-2.5 rounded-xl" style={{ backgroundColor: "var(--primary-muted)" }}>
          <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            Retry uses exponential backoff: 1min → 5min → 30min → manual
          </p>
        </div>
      </div>
    </Modal>
  );
}

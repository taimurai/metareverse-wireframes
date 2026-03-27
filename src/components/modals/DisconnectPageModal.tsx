"use client";
import Modal from "../Modal";

interface Props { open: boolean; onClose: () => void; }

export default function DisconnectPageModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Disconnect Page" size="sm"
      footer={
        <>
          <button className="px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }} onClick={onClose}>Cancel</button>
          <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--error)" }}>Disconnect Page</button>
        </>
      }
    >
      <div className="py-2">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--error-bg)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--error)" }}><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          </div>
          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: "var(--text)" }}>Disconnect &quot;Money Matters&quot;?</p>
            <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
              This will remove the page from your dashboard. Historical data will be retained.
            </p>
          </div>
        </div>

        <div className="px-4 py-3 rounded-xl mb-4" style={{ backgroundColor: "var(--error-bg)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
          <div className="flex items-center gap-2 mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--error)" }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span className="text-[12px] font-semibold" style={{ color: "var(--error)" }}>12 scheduled posts will be deleted</span>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            Scheduled posts cannot be recovered after disconnecting.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: "var(--text-secondary)" }}>Scheduled posts</span>
            <span className="font-medium" style={{ color: "var(--error)" }}>12 will be deleted</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: "var(--text-secondary)" }}>Published posts history</span>
            <span className="font-medium" style={{ color: "var(--success)" }}>Retained</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: "var(--text-secondary)" }}>Performance metrics</span>
            <span className="font-medium" style={{ color: "var(--success)" }}>Retained</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

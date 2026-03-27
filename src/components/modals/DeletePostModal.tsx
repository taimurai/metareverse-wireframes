"use client";
import Modal from "../Modal";

interface Props { open: boolean; onClose: () => void; }

export default function DeletePostModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Post" size="sm"
      footer={
        <>
          <button className="px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-secondary)" }} onClick={onClose}>Cancel</button>
          <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--error)" }}>Delete Post</button>
        </>
      }
    >
      <div className="py-2">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--error-bg)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--error)" }}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: "var(--text)" }}>Are you sure you want to delete this post?</p>
            <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>This action cannot be undone. The post will be removed from all scheduled platforms.</p>
          </div>
        </div>

        <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--bg)" }}>
          <p className="text-[12px] line-clamp-2" style={{ color: "var(--text)" }}>
            &quot;Did you know that the largest wave ever recorded was 1,720 feet tall? Here are 5 more ocean facts...&quot;
          </p>
          <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
            History Uncovered &middot; Scheduled Dec 15, 9:00 AM &middot; FB + IG + Threads
          </p>
        </div>
      </div>
    </Modal>
  );
}

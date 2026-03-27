type Status = "scheduled" | "published" | "partial" | "failed" | "disconnected" | "draft" | "connected";

const config: Record<Status, { bg: string; text: string; dot: string; label: string }> = {
  scheduled: { bg: "rgba(148, 148, 168, 0.1)", text: "#9494A8", dot: "#9494A8", label: "Scheduled" },
  published: { bg: "var(--success-bg)", text: "var(--success)", dot: "var(--success)", label: "Published" },
  partial: { bg: "var(--warning-bg)", text: "var(--warning)", dot: "var(--warning)", label: "Partial" },
  failed: { bg: "var(--error-bg)", text: "var(--error)", dot: "var(--error)", label: "Failed" },
  disconnected: { bg: "var(--error-bg)", text: "var(--error)", dot: "var(--error)", label: "Disconnected" },
  draft: { bg: "rgba(148, 148, 168, 0.1)", text: "#9494A8", dot: "#9494A8", label: "Draft" },
  connected: { bg: "var(--success-bg)", text: "var(--success)", dot: "var(--success)", label: "Connected" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {c.label}
    </span>
  );
}

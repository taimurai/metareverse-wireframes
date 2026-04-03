interface AlertBannerProps {
  type: "warning" | "danger" | "info";
  message: string;
  action?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const styles = {
  warning: { bg: "var(--warning-bg)", border: "var(--warning)", text: "var(--warning)", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  )},
  danger: { bg: "var(--error-bg)", border: "var(--error)", text: "var(--error)", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  )},
  info: { bg: "rgba(99, 102, 241, 0.1)", border: "#6366F1", text: "#818CF8", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  )},
};

export default function AlertBanner({ type, message, action, onAction, onDismiss }: AlertBannerProps) {
  const s = styles[type];
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}22` }}
    >
      <div className="flex items-center gap-2.5 text-[13px]" style={{ color: s.text }}>
        {s.icon}
        <span style={{ color: "var(--text-secondary)" }}>{message}</span>
      </div>
      <div className="flex items-center gap-3">
        {action && (
          <button
            onClick={onAction}
            className="text-[12px] font-semibold px-3.5 py-1.5 rounded-lg"
            style={{ backgroundColor: s.border, color: "white" }}
          >
            {action}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

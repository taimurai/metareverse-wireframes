interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export default function KPICard({ label, value, change, changeType = "neutral", icon }: KPICardProps) {
  const changeColor =
    changeType === "up"
      ? { color: "var(--success)", bg: "var(--success-bg)" }
      : changeType === "down"
      ? { color: "var(--error)", bg: "var(--error-bg)" }
      : { color: "var(--text-muted)", bg: "transparent" };
  const arrow = changeType === "up" ? "+" : changeType === "down" ? "" : "";

  return (
    <div
      className="rounded-xl p-5 border relative overflow-hidden group"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Subtle gradient accent on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, var(--primary-muted), transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}
          >
            {icon}
          </div>
          {change && (
            <span
              className="text-[11px] font-semibold px-2 py-1 rounded-md"
              style={{ color: changeColor.color, backgroundColor: changeColor.bg }}
            >
              {arrow}{change}
            </span>
          )}
        </div>
        <div className="text-[26px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
          {value}
        </div>
        <div className="text-[12px] mt-1 font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

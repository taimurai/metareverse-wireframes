"use client";

const apiMetrics = [
  { label: "Graph API Latency",   value: "214ms",  status: "healthy",  threshold: "<500ms"   },
  { label: "Publish Error Rate",  value: "1.8%",   status: "healthy",  threshold: "<5%"      },
  { label: "Rate Limit Headroom", value: "74%",    status: "healthy",  threshold: ">20%"     },
  { label: "Queue Backlog (>5m)", value: "3 posts", status: "healthy", threshold: "<10"      },
  { label: "Token Exp. (7 days)", value: "342 IDs", status: "warning", threshold: "Monitor"  },
  { label: "Token Exp. (14d)",    value: "891 IDs", status: "warning", threshold: "Monitor"  },
];

const expiryByAccount = [
  { account: "GrowthLab Agency",  expiring: 12, soonest: "2 days",  pages: 89  },
  { account: "ByteForge",         expiring: 8,  soonest: "3 days",  pages: 201 },
  { account: "ViralBurst",        expiring: 6,  soonest: "5 days",  pages: 67  },
  { account: "ContentCo",         expiring: 4,  soonest: "6 days",  pages: 12  },
  { account: "LoopAgency",        expiring: 3,  soonest: "7 days",  pages: 47  },
];

const failuresByError = [
  { error: "API Timeout (60s)",         count: 184, pct: 52, color: "var(--warning)"  },
  { error: "Token Expired",             count: 94,  pct: 27, color: "var(--error)"    },
  { error: "Content Policy Violation",  count: 48,  pct: 14, color: "#A78BFA"         },
  { error: "Media Format Error",        count: 25,  pct: 7,  color: "var(--primary)"  },
];

const storageWarnings = [
  { account: "ByteForge",    used: "93.1 GB", cap: "100 GB", pct: 93 },
  { account: "NovaTech Media", used: "78.4 GB", cap: "100 GB", pct: 78 },
  { account: "ViralBurst",   used: "61.2 GB", cap: "100 GB", pct: 61 },
];

export default function SystemHealthPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>System Health</h1>
          <span className="text-[12px] px-3 py-1 rounded-full font-semibold"
            style={{ background: "var(--success-bg)", color: "var(--success)" }}>
            ● All systems operational
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Facebook API status · Token expiry pipeline · Publish failure analysis
        </p>
      </div>

      {/* API Health grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {apiMetrics.map(m => (
          <div key={m.label} className="rounded-xl p-4 flex items-center gap-4"
            style={{ background: "var(--surface)", border: `1px solid ${m.status === "warning" ? "var(--warning)" : "var(--border)"}` }}>
            <div className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: m.status === "healthy" ? "var(--success)" : "var(--warning)" }} />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] mb-0.5" style={{ color: "var(--text-muted)" }}>{m.label}</div>
              <div className="text-[16px] font-bold" style={{ color: m.status === "warning" ? "var(--warning)" : "var(--text)" }}>
                {m.value}
              </div>
            </div>
            <div className="text-[10px] px-2 py-0.5 rounded-md"
              style={{ background: "var(--surface-active)", color: "var(--text-muted)" }}>
              {m.threshold}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Token expiry timeline */}
        <div className="col-span-2 rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Token Expiry — Next 14 Days</h3>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>342 IDs expiring</span>
          </div>
          {/* Timeline bars */}
          <div className="space-y-2 mb-4">
            {[
              { day: "Today",    count: 4  },
              { day: "Tomorrow", count: 18 },
              { day: "Day 3",    count: 31 },
              { day: "Day 4",    count: 22 },
              { day: "Day 5",    count: 45 },
              { day: "Day 6",    count: 28 },
              { day: "Day 7",    count: 31 },
            ].map(d => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="text-[11px] w-20 shrink-0" style={{ color: "var(--text-muted)" }}>{d.day}</span>
                <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--surface-active)" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${(d.count / 45) * 100}%`, background: d.count > 30 ? "var(--error)" : "var(--warning)" }} />
                </div>
                <span className="text-[11px] w-12 text-right" style={{ color: "var(--text-secondary)" }}>{d.count} IDs</span>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            ⚑ Accounts with expiring tokens will see posting failures unless owners reconnect via Connected IDs.
          </p>
        </div>

        {/* Failure breakdown */}
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>Failure Breakdown</h3>
          <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>Last 24 hours · 351 total failures</p>
          <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-4">
            {failuresByError.map(f => (
              <div key={f.error} style={{ width: `${f.pct}%`, background: f.color }} />
            ))}
          </div>
          {failuresByError.map(f => (
            <div key={f.error} className="flex items-center justify-between py-2"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: f.color }} />
                <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{f.error}</span>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{f.count}</span>
                <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>{f.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top expiry accounts */}
        <div className="rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Accounts: Most Tokens Expiring</span>
          </div>
          {expiryByAccount.map((a, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: i < expiryByAccount.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div>
                <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{a.account}</div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{a.pages} pages · soonest: {a.soonest}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                  {a.expiring} IDs
                </span>
                <button className="text-[11px] px-2 py-1 rounded-md"
                  style={{ background: "var(--surface-active)", color: "var(--text-secondary)" }}>Notify</button>
              </div>
            </div>
          ))}
        </div>

        {/* Storage warnings */}
        <div className="rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Storage Pressure</span>
          </div>
          {storageWarnings.map((s, i) => (
            <div key={i} className="px-5 py-4"
              style={{ borderBottom: i < storageWarnings.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{s.account}</span>
                <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{s.used} / {s.cap}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-active)" }}>
                <div className="h-full rounded-full"
                  style={{ width: `${s.pct}%`, background: s.pct > 90 ? "var(--error)" : "var(--warning)" }} />
              </div>
              <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                {s.pct}% used · {100 - s.pct}% remaining
              </div>
            </div>
          ))}
          <div className="px-5 py-3 text-[11px]" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
            Storage cap (100 GB) is a placeholder — to be defined when Professional plan limits are finalised.
          </div>
        </div>
      </div>
    </div>
  );
}

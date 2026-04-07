"use client";

const alerts = [
  { type: "error",   account: "NovaTech Media",    msg: "Billing payment failed — card declined", time: "2m ago" },
  { type: "error",   account: "GrowthLab Agency",  msg: "12 Posting IDs expiring in 3 days — no action taken", time: "14m ago" },
  { type: "warning", account: "ContentCo",         msg: "No posts published in 18 days — churn risk", time: "1h ago" },
  { type: "warning", account: "ViralBurst",        msg: "API error rate 14% this hour (threshold: 5%)", time: "2h ago" },
  { type: "info",    account: "ByteForge",         msg: "Storage 93% used — 7% headroom remaining", time: "3h ago" },
];

const recentSignups = [
  { name: "PixelPulse", plan: "Trial", pages: 4,   date: "Today, 9:14 AM" },
  { name: "MindfulMedia", plan: "Trial", pages: 2, date: "Today, 7:02 AM" },
  { name: "GrowthStack", plan: "Pro",   pages: 22, date: "Yesterday" },
  { name: "LoopAgency",  plan: "Pro",   pages: 47, date: "Yesterday" },
];

const churnRisk = [
  { name: "ContentCo",     lastPost: "18d ago", plan: "Pro",  pages: 12, mrr: "$99" },
  { name: "SocialSprint",  lastPost: "12d ago", plan: "Pro",  pages: 8,  mrr: "$99" },
  { name: "MediaDash",     lastPost: "9d ago",  plan: "Pro",  pages: 31, mrr: "$99" },
];

const kpis = [
  { label: "Active Accounts",   value: "1,284",  sub: "+23 this week",   color: "var(--primary)",  icon: "👥" },
  { label: "Total Pages",        value: "84,210", sub: "+841 this week",  color: "var(--success)",  icon: "📄" },
  { label: "Posts (Last 24h)",   value: "21,840", sub: "↑ 8% vs yesterday", color: "#A78BFA",      icon: "📤" },
  { label: "MRR",                value: "$127.1k",sub: "+$2.4k vs last month", color: "var(--success)", icon: "💰" },
  { label: "API Error Rate",     value: "1.8%",   sub: "Normal · <5% threshold", color: "var(--success)", icon: "⚡" },
  { label: "Tokens Expiring 7d", value: "342",    sub: "Across 48 accounts", color: "var(--warning)", icon: "🔑" },
];

export default function AdminCommandCenter() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>Command Center</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Platform overview · 1,284 active accounts · Last updated just now
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-xl mb-1">{k.icon}</div>
            <div className="text-xl font-bold mb-0.5" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[11px] font-medium mb-0.5" style={{ color: "var(--text)" }}>{k.label}</div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Alerts inbox */}
        <div className="col-span-2 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Alerts Inbox</span>
              <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                5 active
              </span>
            </div>
            <button className="text-[12px]" style={{ color: "var(--text-muted)" }}>Mark all read</button>
          </div>
          <div>
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5"
                style={{ borderBottom: i < alerts.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="mt-0.5 w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: a.type === "error" ? "var(--error)" : a.type === "warning" ? "var(--warning)" : "var(--primary)",
                    marginTop: "5px"
                  }} />
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>{a.account}</span>
                  <span className="text-[12px] ml-2" style={{ color: "var(--text-secondary)" }}>{a.msg}</span>
                </div>
                <div className="text-[11px] shrink-0 ml-2" style={{ color: "var(--text-muted)" }}>{a.time}</div>
                <button className="text-[11px] px-2 py-1 rounded-md shrink-0"
                  style={{ background: "var(--surface-active)", color: "var(--text-secondary)" }}>
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* MRR sparkline stub */}
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--text)" }}>MRR Trend</div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--success)" }}>$127,140</div>
            <div className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>↑ +$2,410 vs last month (+1.9%)</div>
            {/* Sparkline bars */}
            <div className="flex items-end gap-1 h-10">
              {[72,75,74,77,78,80,82,85,86,88,90,92,95,96,98,100,99,101,102,104,106,107,108,109,110,112,114,116,120,127].map((v, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all"
                  style={{ height: `${(v / 127) * 100}%`, background: i === 29 ? "var(--success)" : "var(--surface-active)" }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
              <span>30d ago</span><span>Today</span>
            </div>
          </div>

          {/* Churn risk */}
          <div className="rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Churn Risk</span>
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>3 accounts</span>
            </div>
            {churnRisk.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: i < churnRisk.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{r.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Last post {r.lastPost} · {r.pages} pages</div>
                </div>
                <button className="text-[11px] px-2 py-1 rounded-md"
                  style={{ background: "var(--surface-active)", color: "var(--text-secondary)" }}>View</button>
              </div>
            ))}
          </div>

          {/* New signups */}
          <div className="rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>New Signups</span>
            </div>
            {recentSignups.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: i < recentSignups.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{s.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.pages} pages · {s.date}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: s.plan === "Trial" ? "var(--primary-muted)" : "var(--success-bg)",
                    color: s.plan === "Trial" ? "var(--primary)" : "var(--success)",
                  }}>
                  {s.plan}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

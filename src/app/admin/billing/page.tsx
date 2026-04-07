"use client";

const planDist = [
  { plan: "Professional", count: 1198, pct: 93, color: "var(--success)" },
  { plan: "Trial",        count: 64,   pct: 5,  color: "var(--primary)" },
  { plan: "Suspended",    count: 22,   pct: 2,  color: "var(--error)"   },
];

const failedPayments = [
  { account: "NovaTech Media",   email: "ali@novatech.com",   amount: "$99", reason: "Card declined",        date: "Apr 3, 2026", retries: 1 },
  { account: "SkyDash Agency",   email: "ops@skydash.io",     amount: "$99", reason: "Insufficient funds",   date: "Apr 2, 2026", retries: 2 },
  { account: "MediaForge",       email: "h@mediaforge.pk",    amount: "$99", reason: "Card expired",         date: "Mar 31, 2026", retries: 0 },
];

const upcomingRenewals = [
  { account: "GrowthStack",   plan: "Pro", amount: "$99", date: "Apr 7" },
  { account: "LoopAgency",    plan: "Pro", amount: "$99", date: "Apr 8" },
  { account: "ByteForge",     plan: "Pro", amount: "$99", date: "Apr 9" },
  { account: "ViralBurst",    plan: "Pro", amount: "$99", date: "Apr 10" },
  { account: "ContentCo",     plan: "Pro", amount: "$99", date: "Apr 10" },
];

const mrrData = [102,104,106,107,108,109,110,112,114,116,120,127];
const mrrLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec (proj)"];

export default function BillingPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>Billing & Revenue</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Platform-wide financial overview</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "MRR",              value: "$127,140", sub: "↑ +$2,410 (+1.9%) vs last month", color: "var(--success)"  },
          { label: "ARR (annualised)", value: "$1.53M",   sub: "Projected based on current MRR",  color: "var(--success)"  },
          { label: "Paying Accounts",  value: "1,198",    sub: "93% of all accounts on paid plan", color: "var(--primary)"  },
          { label: "Trial Conversion", value: "68%",      sub: "Of trials converted last 30 days",  color: "var(--primary)"  },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>{k.label}</div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* MRR chart */}
        <div className="col-span-2 rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>MRR Over Time</h3>
            <span className="text-[11px] px-2 py-1 rounded-md" style={{ background: "var(--surface-active)", color: "var(--text-muted)" }}>Last 12 months</span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {mrrData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md transition-all"
                  style={{ height: `${(v / 127) * 100}%`, background: i === mrrData.length - 1 ? "rgba(12,106,255,0.3)" : "var(--primary)", opacity: i === mrrData.length - 1 ? 0.6 : 1 }} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2">
            {mrrLabels.map((l, i) => (
              <div key={i} className="flex-1 text-center text-[9px]" style={{ color: "var(--text-muted)" }}>{l}</div>
            ))}
          </div>
        </div>

        {/* Plan distribution */}
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text)" }}>Plan Distribution</h3>
          <div className="flex gap-1 h-6 rounded-full overflow-hidden mb-4">
            {planDist.map(p => (
              <div key={p.plan} style={{ width: `${p.pct}%`, background: p.color }} />
            ))}
          </div>
          {planDist.map(p => (
            <div key={p.plan} className="flex items-center justify-between py-2"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{p.plan}</span>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{p.count}</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.pct}%</div>
              </div>
            </div>
          ))}
          <div className="mt-3 pt-3 flex items-center justify-between">
            <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Churn Rate (30d)</span>
            <span className="text-[13px] font-semibold" style={{ color: "var(--warning)" }}>3.2%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Failed payments */}
        <div className="rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Failed Payments</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "var(--error-bg)", color: "var(--error)" }}>3 pending</span>
          </div>
          {failedPayments.map((f, i) => (
            <div key={i} className="px-5 py-3.5"
              style={{ borderBottom: i < failedPayments.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{f.account}</span>
                  <span className="text-[11px] ml-2" style={{ color: "var(--text-muted)" }}>{f.email}</span>
                </div>
                <span className="text-[13px] font-semibold" style={{ color: "var(--error)" }}>{f.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{f.reason} · {f.date} · {f.retries} retries</span>
                <button className="text-[11px] px-2 py-1 rounded-md"
                  style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>Retry</button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming renewals */}
        <div className="rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Upcoming Renewals (7 days)</span>
          </div>
          {upcomingRenewals.map((r, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: i < upcomingRenewals.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{r.account}</span>
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{r.date}</span>
              <span className="text-[13px] font-semibold" style={{ color: "var(--success)" }}>{r.amount}</span>
            </div>
          ))}
          <div className="px-5 py-3 text-[12px]" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
            128 total renewals in the next 30 days · Projected: $12,672
          </div>
        </div>
      </div>
    </div>
  );
}

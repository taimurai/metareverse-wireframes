"use client";
import { useState } from "react";
import Link from "next/link";

const accounts = [
  { id: "acc_001", name: "NovaTech Media",   owner: "ali@novatech.com",    plan: "Pro",   pages: 142, team: 8,  status: "active",    health: "broken",   mrr: "$99",  lastActive: "2m ago",  storage: "78%" },
  { id: "acc_002", name: "GrowthLab Agency", owner: "sarah@growthlab.io",  plan: "Pro",   pages: 89,  team: 12, status: "active",    health: "warning",  mrr: "$99",  lastActive: "8m ago",  storage: "34%" },
  { id: "acc_003", name: "ContentCo",        owner: "md@contentco.pk",     plan: "Pro",   pages: 12,  team: 3,  status: "active",    health: "warning",  mrr: "$99",  lastActive: "18d ago", storage: "12%" },
  { id: "acc_004", name: "PixelPulse",       owner: "h@pixelpulse.io",     plan: "Trial", pages: 4,   team: 1,  status: "trial",     health: "healthy",  mrr: "$0",   lastActive: "3h ago",  storage: "4%"  },
  { id: "acc_005", name: "ByteForge",        owner: "ops@byteforge.com",   plan: "Pro",   pages: 201, team: 14, status: "active",    health: "warning",  mrr: "$99",  lastActive: "1h ago",  storage: "93%" },
  { id: "acc_006", name: "MindfulMedia",     owner: "n@mindful.co",        plan: "Trial", pages: 2,   team: 1,  status: "trial",     health: "healthy",  mrr: "$0",   lastActive: "6h ago",  storage: "2%"  },
  { id: "acc_007", name: "SocialSprint",     owner: "k@socialsprint.net",  plan: "Pro",   pages: 8,   team: 4,  status: "active",    health: "warning",  mrr: "$99",  lastActive: "12d ago", storage: "19%" },
  { id: "acc_008", name: "ViralBurst",       owner: "z@viralburst.io",     plan: "Pro",   pages: 67,  team: 9,  status: "active",    health: "broken",   mrr: "$99",  lastActive: "30m ago", storage: "55%" },
  { id: "acc_009", name: "GrowthStack",      owner: "t@growthstack.com",   plan: "Pro",   pages: 22,  team: 5,  status: "active",    health: "healthy",  mrr: "$99",  lastActive: "45m ago", storage: "28%" },
  { id: "acc_010", name: "LoopAgency",       owner: "m@loopagency.io",     plan: "Pro",   pages: 47,  team: 7,  status: "active",    health: "healthy",  mrr: "$99",  lastActive: "20m ago", storage: "41%" },
  { id: "acc_011", name: "MediaDash",        owner: "r@mediadash.co",      plan: "Pro",   pages: 31,  team: 6,  status: "active",    health: "warning",  mrr: "$99",  lastActive: "9d ago",  storage: "37%" },
  { id: "acc_012", name: "TrendBlast",       owner: "a@trendblast.pk",     plan: "Pro",   pages: 56,  team: 10, status: "suspended", health: "broken",   mrr: "$0",   lastActive: "3d ago",  storage: "61%" },
];

const planColors: Record<string, { bg: string; color: string }> = {
  Pro:   { bg: "var(--success-bg)",  color: "var(--success)"  },
  Trial: { bg: "var(--primary-muted)", color: "var(--primary)" },
  Free:  { bg: "var(--surface-active)", color: "var(--text-muted)" },
};

const healthColors: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  healthy: { bg: "var(--success-bg)",  color: "var(--success)", dot: "var(--success)", label: "Healthy" },
  warning: { bg: "var(--warning-bg)",  color: "var(--warning)", dot: "var(--warning)", label: "At Risk"  },
  broken:  { bg: "var(--error-bg)",    color: "var(--error)",   dot: "var(--error)",   label: "Broken"   },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  active:    { bg: "var(--success-bg)",       color: "var(--success)"   },
  trial:     { bg: "var(--primary-muted)",    color: "var(--primary)"   },
  suspended: { bg: "var(--error-bg)",         color: "var(--error)"     },
  churned:   { bg: "var(--surface-active)",   color: "var(--text-muted)"},
};

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = accounts.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.owner.toLowerCase().includes(search.toLowerCase())) return false;
    if (planFilter !== "all" && a.plan !== planFilter) return false;
    if (healthFilter !== "all" && a.health !== healthFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>Accounts</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            1,284 total · 1,198 active · 64 trial · 22 suspended
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "var(--primary)" }}>
          + Create Account
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text" placeholder="Search accounts…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        {/* Plan filter */}
        {(["all","Pro","Trial","Free"] as const).map(p => (
          <button key={p} onClick={() => setPlanFilter(p)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
            style={{
              background: planFilter === p ? "var(--surface-active)" : "var(--surface)",
              color: planFilter === p ? "var(--text)" : "var(--text-muted)",
              border: "1px solid var(--border)"
            }}>
            {p === "all" ? "All Plans" : p}
          </button>
        ))}

        <div className="w-px h-5" style={{ background: "var(--border)" }} />

        {/* Health filter */}
        {(["all","healthy","warning","broken"] as const).map(h => (
          <button key={h} onClick={() => setHealthFilter(h)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
            style={{
              background: healthFilter === h ? "var(--surface-active)" : "var(--surface)",
              color: healthFilter === h ? "var(--text)" : "var(--text-muted)",
              border: "1px solid var(--border)"
            }}>
            {h === "all" ? "All Health" : h.charAt(0).toUpperCase() + h.slice(1)}
          </button>
        ))}

        <div className="w-px h-5" style={{ background: "var(--border)" }} />

        {/* Status filter */}
        {(["all","active","trial","suspended"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
            style={{
              background: statusFilter === s ? "var(--surface-active)" : "var(--surface)",
              color: statusFilter === s ? "var(--text)" : "var(--text-muted)",
              border: "1px solid var(--border)"
            }}>
            {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
              {["Account", "Owner", "Plan", "Pages", "Team", "Status", "Health", "Storage", "MRR", "Last Active", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => {
              const h = healthColors[a.health];
              const s = statusColors[a.status];
              const p = planColors[a.plan];
              return (
                <tr key={a.id}
                  style={{
                    background: i % 2 === 0 ? "var(--surface)" : "var(--bg-deep)",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none"
                  }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: "var(--primary)" }}>
                        {a.name[0]}
                      </div>
                      <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-secondary)" }}>{a.owner}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: p.bg, color: p.color }}>{a.plan}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium" style={{ color: "var(--text)" }}>{a.pages}</td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>{a.team}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: s.bg, color: s.color }}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: h.dot }} />
                      <span className="text-[12px]" style={{ color: h.color }}>{h.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-active)" }}>
                        <div className="h-full rounded-full"
                          style={{
                            width: a.storage,
                            background: parseInt(a.storage) > 80 ? "var(--error)" : parseInt(a.storage) > 60 ? "var(--warning)" : "var(--primary)"
                          }} />
                      </div>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{a.storage}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium" style={{ color: "var(--success)" }}>{a.mrr}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-muted)" }}>{a.lastActive}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/accounts/${a.id}`}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                        style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>
                        View
                      </Link>
                      <button className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                        style={{ background: "var(--surface-active)", color: "var(--text-secondary)" }}>
                        Impersonate
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          Showing {filtered.length} of 1,284 accounts
        </p>
        <div className="flex items-center gap-2">
          {["1","2","3","…","128"].map(p => (
            <button key={p} className="w-8 h-8 rounded-md text-[12px] font-medium"
              style={{
                background: p === "1" ? "var(--primary)" : "var(--surface)",
                color: p === "1" ? "white" : "var(--text-muted)",
                border: "1px solid var(--border)"
              }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

const events = [
  { id: 1, admin: "Taimur Mirza",  action: "Impersonated account",         target: "NovaTech Media",      detail: "Session: 4m 12s — read-only mode",     time: "Today, 10:24 AM", type: "impersonate" },
  { id: 2, admin: "Taimur Mirza",  action: "Suspended account",            target: "TrendBlast",          detail: "Reason: Non-payment — 3 retries failed", time: "Today, 9:51 AM",  type: "danger"      },
  { id: 3, admin: "Taimur Mirza",  action: "Applied discount",             target: "GrowthStack",         detail: "20% off for 3 months — support request",  time: "Today, 9:14 AM",  type: "billing"     },
  { id: 4, admin: "Taimur Mirza",  action: "Enabled feature flag",         target: "bulk_approval",       detail: "Scope: Global",                         time: "Today, 8:30 AM",  type: "flag"        },
  { id: 5, admin: "Taimur Mirza",  action: "Impersonated account",         target: "ByteForge",           detail: "Session: 12m 04s — read-only mode",     time: "Yesterday, 4:10 PM", type: "impersonate" },
  { id: 6, admin: "Taimur Mirza",  action: "Sent message to account owner", target: "ContentCo",          detail: "Re: Inactivity for 18 days",            time: "Yesterday, 2:44 PM", type: "message"    },
  { id: 7, admin: "Taimur Mirza",  action: "Created account",              target: "MindfulMedia",        detail: "Trial plan · 2 pages",                  time: "Yesterday, 7:02 AM", type: "create"     },
  { id: 8, admin: "Taimur Mirza",  action: "Forced plan change",           target: "SkyDash Agency",      detail: "Trial → Professional (manual override)", time: "Apr 2, 2026",     type: "billing"     },
  { id: 9, admin: "Taimur Mirza",  action: "Disabled feature flag",        target: "threads_publishing",  detail: "Disabled for: GlobalReach Inc.",         time: "Apr 1, 2026",     type: "flag"        },
  { id: 10, admin: "Taimur Mirza", action: "Added internal note",          target: "MediaDash",           detail: "Note: Owner contacted via WhatsApp re: churn", time: "Mar 31, 2026", type: "note"   },
  { id: 11, admin: "Taimur Mirza", action: "Deleted account",              target: "OldAgency2022",       detail: "Reason: Owner request — data purged",   time: "Mar 30, 2026",    type: "danger"      },
];

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  impersonate: { icon: "👤", color: "var(--warning)",  label: "Impersonation" },
  danger:      { icon: "⚠️", color: "var(--error)",    label: "Destructive"   },
  billing:     { icon: "💰", color: "var(--success)",  label: "Billing"       },
  flag:        { icon: "🚩", color: "var(--primary)",  label: "Feature Flag"  },
  message:     { icon: "✉️", color: "#A78BFA",         label: "Message"       },
  create:      { icon: "✨", color: "var(--success)",  label: "Created"       },
  note:        { icon: "📝", color: "var(--text-muted)", label: "Note"        },
};

export default function AuditLogPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = events.filter(e => {
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (search && !e.target.toLowerCase().includes(search.toLowerCase()) && !e.action.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>Audit Log</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Complete record of all super admin actions. Immutable and tamper-evident.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search actions…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg text-sm w-56"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        {["all", "impersonate", "danger", "billing", "flag", "message", "create"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium"
            style={{
              background: typeFilter === t ? "var(--surface-active)" : "var(--surface)",
              color: typeFilter === t ? "var(--text)" : "var(--text-muted)",
              border: "1px solid var(--border)"
            }}>
            {t === "all" ? "All Events" : typeConfig[t]?.label ?? t}
          </button>
        ))}

        <div className="ml-auto">
          <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
              {["Type", "Admin", "Action", "Target", "Detail", "Time"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const tc = typeConfig[e.type];
              return (
                <tr key={e.id}
                  style={{
                    background: i % 2 === 0 ? "var(--surface)" : "var(--bg-deep)",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none"
                  }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{tc.icon}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: e.type === "danger" ? "var(--error-bg)" : e.type === "impersonate" ? "var(--warning-bg)" : "var(--surface-active)",
                          color: tc.color
                        }}>
                        {tc.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-medium" style={{ color: "var(--text)" }}>{e.admin}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-secondary)" }}>{e.action}</td>
                  <td className="px-4 py-3 text-[12px] font-medium" style={{ color: "var(--primary)" }}>{e.target}</td>
                  <td className="px-4 py-3 text-[11px]" style={{ color: "var(--text-muted)" }}>{e.detail}</td>
                  <td className="px-4 py-3 text-[11px]" style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>{e.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>
        Showing {filtered.length} of {events.length} events · Audit log is append-only and cannot be edited or deleted.
      </p>
    </div>
  );
}

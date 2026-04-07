"use client";
import { useState } from "react";

const account = {
  name: "NovaTech Media",
  owner: "Ali Hassan",
  email: "ali@novatech.com",
  plan: "Professional",
  planPrice: "$99/mo",
  status: "active",
  health: "broken",
  pages: 142,
  team: 8,
  storage: "78%",
  storageMB: "78.4 GB",
  apiCalls: "241,840",
  postsThisMonth: 1840,
  postsLastMonth: 1620,
  mrr: "$99",
  nextBilling: "May 4, 2026",
  paymentMethod: "Visa ···· 4242",
  joined: "Jan 12, 2025",
  lastActive: "2 minutes ago",
  trialEnd: null,
};

const pages = [
  { name: "TechByte", status: "healthy",  posts: 124, lastPost: "1h ago",  tokens: 2 },
  { name: "NovaNation", status: "broken", posts: 89,  lastPost: "3d ago",  tokens: 0 },
  { name: "PixelDrop", status: "healthy", posts: 201, lastPost: "30m ago", tokens: 3 },
  { name: "ThinkFeed", status: "warning", posts: 44,  lastPost: "6d ago",  tokens: 1 },
];

const activityLog = [
  { event: "Posting ID expired (ID #FB-0023)",     time: "2h ago",   type: "error"   },
  { event: "Team member invited: raza@novatech.com", time: "1d ago",  type: "info"    },
  { event: "15 posts published successfully",       time: "1d ago",   type: "success" },
  { event: "Storage warning: 78% used",             time: "2d ago",   type: "warning" },
  { event: "Bulk Upload: 24 posts queued",          time: "3d ago",   type: "info"    },
];

const TABS = ["Overview", "Pages", "Billing", "Activity Log", "Support"];

export default function AccountDetailPage() {
  const [tab, setTab] = useState("Overview");
  const [showImpersonateConfirm, setShowImpersonateConfirm] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
            style={{ background: "var(--primary)" }}>N</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{account.name}</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "var(--success-bg)", color: "var(--success)" }}>Active</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "var(--error-bg)", color: "var(--error)" }}>Broken</span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {account.owner} · {account.email} · Joined {account.joined}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg text-[12px] font-medium"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            Send Message
          </button>
          <button onClick={() => setShowImpersonateConfirm(true)}
            className="px-3 py-2 rounded-lg text-[12px] font-medium"
            style={{ background: "var(--warning-bg)", color: "var(--warning)", border: "1px solid var(--warning)" }}>
            Impersonate Account
          </button>
          <button className="px-3 py-2 rounded-lg text-[12px] font-medium"
            style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}>
            Suspend
          </button>
        </div>
      </div>

      {/* Impersonate confirm */}
      {showImpersonateConfirm && (
        <div className="mb-5 p-4 rounded-xl flex items-start gap-3"
          style={{ background: "var(--warning-bg)", border: "1px solid var(--warning)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--warning)", marginTop: "1px", flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div className="flex-1">
            <p className="text-[13px] font-medium mb-0.5" style={{ color: "var(--warning)" }}>
              You are about to enter NovaTech Media as Owner (Taimur Mirza)
            </p>
            <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
              This session will be logged in the Audit Log. You have read access and limited write access. The account owner will not be notified.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setShowImpersonateConfirm(false)}
              className="px-3 py-1.5 rounded-md text-[12px]"
              style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>Cancel</button>
            <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white"
              style={{ background: "var(--warning)" }}>Enter Account</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "var(--surface)" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-all"
            style={{
              background: tab === t ? "var(--surface-active)" : "transparent",
              color: tab === t ? "var(--text)" : "var(--text-muted)"
            }}>{t}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "Overview" && (
        <div>
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Pages Connected", value: account.pages, color: "var(--primary)" },
              { label: "Posts This Month", value: `${account.postsThisMonth}`, sub: `${account.postsLastMonth} last month`, color: "var(--text)" },
              { label: "Storage Used", value: account.storageMB, sub: account.storage + " of quota", color: parseInt(account.storage) > 80 ? "var(--error)" : "var(--text)" },
              { label: "API Calls (Month)", value: account.apiCalls, color: "var(--text)" },
            ].map(k => (
              <div key={k.label} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>{k.label}</div>
                <div className="text-xl font-bold" style={{ color: k.color }}>{k.value}</div>
                {k.sub && <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{k.sub}</div>}
              </div>
            ))}
          </div>

          {/* Two col */}
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h3 className="text-[13px] font-semibold mb-4" style={{ color: "var(--text)" }}>Account Details</h3>
              {[
                ["Plan",           account.plan + " · " + account.planPrice],
                ["Next Billing",   account.nextBilling],
                ["Payment Method", account.paymentMethod],
                ["MRR",            account.mrr],
                ["Team Members",   account.team],
                ["Last Active",    account.lastActive],
              ].map(([k,v]) => (
                <div key={k} className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h3 className="text-[13px] font-semibold mb-4" style={{ color: "var(--text)" }}>Recent Activity</h3>
              {activityLog.map((e, i) => (
                <div key={i} className="flex items-start gap-3 py-2"
                  style={{ borderBottom: i < activityLog.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{
                      background: e.type === "error" ? "var(--error)" : e.type === "warning" ? "var(--warning)" : e.type === "success" ? "var(--success)" : "var(--primary)"
                    }} />
                  <div className="flex-1">
                    <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{e.event}</p>
                  </div>
                  <span className="text-[11px] shrink-0" style={{ color: "var(--text-muted)" }}>{e.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pages tab */}
      {tab === "Pages" && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                {["Page", "Status", "Posts (30d)", "Last Post", "Posting IDs"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--bg-deep)", borderBottom: "1px solid var(--border)" }}>
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: "var(--text)" }}>{p.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{ background: p.status === "healthy" ? "var(--success)" : p.status === "warning" ? "var(--warning)" : "var(--error)" }} />
                      <span className="text-[12px]" style={{ color: p.status === "healthy" ? "var(--success)" : p.status === "warning" ? "var(--warning)" : "var(--error)" }}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>{p.posts}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: "var(--text-muted)" }}>{p.lastPost}</td>
                  <td className="px-5 py-3">
                    <span className="text-[12px] px-2 py-0.5 rounded-full"
                      style={{ background: p.tokens === 0 ? "var(--error-bg)" : "var(--surface-active)", color: p.tokens === 0 ? "var(--error)" : "var(--text-secondary)" }}>
                      {p.tokens === 0 ? "No active IDs" : `${p.tokens} active`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 text-[12px]" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
            Showing 4 of 142 pages · <button className="underline" style={{ color: "var(--primary)" }}>View all in account</button>
          </div>
        </div>
      )}

      {/* Billing tab */}
      {tab === "Billing" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-[13px] font-semibold mb-4" style={{ color: "var(--text)" }}>Current Plan</h3>
            <div className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>Professional</div>
            <div className="text-2xl font-bold mb-4" style={{ color: "var(--success)" }}>$99 / month</div>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg text-[12px] font-medium"
                style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>
                Change Plan
              </button>
              <button className="px-3 py-2 rounded-lg text-[12px] font-medium"
                style={{ background: "var(--surface-active)", color: "var(--text-secondary)" }}>
                Apply Discount
              </button>
              <button className="px-3 py-2 rounded-lg text-[12px] font-medium"
                style={{ background: "var(--surface-active)", color: "var(--text-secondary)" }}>
                Extend Trial
              </button>
            </div>
          </div>
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-[13px] font-semibold mb-4" style={{ color: "var(--text)" }}>Invoice History</h3>
            {[
              { date: "Apr 4, 2026", amount: "$99", status: "Paid" },
              { date: "Mar 4, 2026", amount: "$99", status: "Paid" },
              { date: "Feb 4, 2026", amount: "$99", status: "Paid" },
              { date: "Jan 4, 2026", amount: "$99", status: "Paid" },
            ].map((inv, i) => (
              <div key={i} className="flex items-center justify-between py-2"
                style={{ borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{inv.date}</span>
                <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{inv.amount}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background: "var(--success-bg)", color: "var(--success)" }}>{inv.status}</span>
                <button className="text-[11px]" style={{ color: "var(--primary)" }}>Download</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log tab */}
      {tab === "Activity Log" && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {activityLog.concat(activityLog).map((e, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3"
              style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--bg-deep)", borderBottom: "1px solid var(--border)" }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: e.type === "error" ? "var(--error)" : e.type === "warning" ? "var(--warning)" : e.type === "success" ? "var(--success)" : "var(--primary)" }} />
              <span className="text-[12px] flex-1" style={{ color: "var(--text-secondary)" }}>{e.event}</span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{e.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Support tab */}
      {tab === "Support" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-[13px] font-semibold mb-4" style={{ color: "var(--text)" }}>Support Tools</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowImpersonateConfirm(true)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-left"
                style={{ background: "var(--warning-bg)", border: "1px solid var(--warning)" }}>
                <span className="text-lg">👤</span>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--warning)" }}>Impersonate Account</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Enter as Owner. Session logged in Audit Log.</div>
                </div>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-left"
                style={{ background: "var(--surface-active)", border: "1px solid var(--border)" }}>
                <span className="text-lg">✉️</span>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Send Message</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>In-app message to account owner</div>
                </div>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-left"
                style={{ background: "var(--surface-active)", border: "1px solid var(--border)" }}>
                <span className="text-lg">📝</span>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Add Internal Note</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Visible to super admins only</div>
                </div>
              </button>
            </div>
          </div>
          <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-[13px] font-semibold mb-1" style={{ color: "var(--text)" }}>Danger Zone</h3>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>These actions are irreversible. Proceed with caution.</p>
            <div className="flex flex-col gap-3">
              <button className="px-4 py-2.5 rounded-lg text-[12px] font-medium text-left"
                style={{ background: "var(--warning-bg)", color: "var(--warning)", border: "1px solid var(--warning)" }}>
                Suspend Account — block all logins and publishing
              </button>
              <button className="px-4 py-2.5 rounded-lg text-[12px] font-medium text-left"
                style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}>
                Delete Account — permanently remove all data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

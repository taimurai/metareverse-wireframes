"use client";
import { useState } from "react";
import Header from "@/components/Header";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "billing">("profile");

  const tabs = [
    { id: "profile" as const, label: "Profile" },
    { id: "team" as const, label: "Team Members" },
    { id: "billing" as const, label: "Billing & Plan" },
  ];

  const teamMembers = [
    { name: "Taimur Asghar", email: "taimur@metareverse.com", role: "Owner", status: "active", lastActive: "Now" },
    { name: "Sarah Khan", email: "sarah@partner-a.com", role: "Manager", status: "active", lastActive: "3 hours ago" },
    { name: "Ahmed Raza", email: "ahmed@partner-b.com", role: "Publisher", status: "active", lastActive: "1 day ago" },
    { name: "Fatima Ali", email: "fatima@team.com", role: "Viewer", status: "pending", lastActive: "Invited" },
  ];

  return (
    <div className="flex flex-col">
        <Header />
        <main className="flex-1 p-8 max-w-[900px] mx-auto w-full">
          <h1 className="text-[28px] font-bold mb-1" style={{ color: "var(--text)" }}>Account Settings</h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Manage your profile, team, and subscription</p>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 rounded-lg w-fit" style={{ backgroundColor: "var(--surface)" }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeTab === t.id ? "var(--primary)" : "transparent",
                  color: activeTab === t.id ? "white" : "var(--text-muted)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Personal Information</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Full Name</label>
                    <input type="text" defaultValue="Taimur Asghar" className="w-full px-3 py-2.5 rounded-lg text-sm border-0 outline-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                    <input type="email" defaultValue="taimur@metareverse.com" className="w-full px-3 py-2.5 rounded-lg text-sm border-0 outline-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Phone</label>
                    <input type="tel" defaultValue="+92 300 1234567" className="w-full px-3 py-2.5 rounded-lg text-sm border-0 outline-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Timezone</label>
                    <select className="w-full px-3 py-2.5 rounded-lg text-sm border-0 outline-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }}>
                      <option>Asia/Karachi (PKT)</option>
                      <option>America/New_York (EST)</option>
                      <option>America/Los_Angeles (PST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>
                <button className="mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                  Save Changes
                </button>
              </div>

              <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Security</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>Password</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>Last changed 45 days ago</div>
                    </div>
                    <button className="text-sm px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>Two-Factor Authentication</div>
                      <div className="text-xs text-green-400">Enabled via authenticator app</div>
                    </div>
                    <button className="text-sm px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
                      Manage
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-400/20 p-6" style={{ backgroundColor: "var(--surface)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-4 text-red-400">Danger Zone</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>Delete Account</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Permanently delete your account and all data</div>
                  </div>
                  <button className="text-sm px-3 py-1.5 rounded-lg text-red-400 border border-red-400/30">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Team Members ({teamMembers.length})</div>
                  <button className="px-3 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                    + Invite Member
                  </button>
                </div>
                <div className="space-y-2">
                  {teamMembers.map(m => (
                    <div key={m.email} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: m.role === "Owner" ? "var(--primary)" : "#6366F1" }}>
                        {m.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{m.name}</span>
                          {m.status === "pending" && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300">Pending</span>}
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{m.email}</span>
                      </div>
                      <select className="text-xs rounded-lg px-2 py-1.5 border-0 outline-0" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
                        <option selected={m.role === "Owner"}>Owner</option>
                        <option selected={m.role === "Manager"}>Manager</option>
                        <option selected={m.role === "Publisher"}>Publisher</option>
                        <option selected={m.role === "Viewer"}>Viewer</option>
                      </select>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{m.lastActive}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Role Permissions</div>
                <div className="overflow-hidden rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                        <th className="text-left p-3 font-medium" style={{ color: "var(--text-muted)" }}>Permission</th>
                        <th className="text-center p-3 font-medium" style={{ color: "var(--text-muted)" }}>Owner</th>
                        <th className="text-center p-3 font-medium" style={{ color: "var(--text-muted)" }}>Manager</th>
                        <th className="text-center p-3 font-medium" style={{ color: "var(--text-muted)" }}>Publisher</th>
                        <th className="text-center p-3 font-medium" style={{ color: "var(--text-muted)" }}>Viewer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { perm: "View analytics", owner: true, manager: true, publisher: true, viewer: true },
                        { perm: "View revenue", owner: true, manager: false, publisher: false, viewer: false },
                        { perm: "Create & schedule posts", owner: true, manager: true, publisher: true, viewer: false },
                        { perm: "Manage pages", owner: true, manager: true, publisher: false, viewer: false },
                        { perm: "Manage team", owner: true, manager: false, publisher: false, viewer: false },
                        { perm: "Billing & subscription", owner: true, manager: false, publisher: false, viewer: false },
                      ].map(r => (
                        <tr key={r.perm} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                          <td className="p-3" style={{ color: "var(--text)" }}>{r.perm}</td>
                          <td className="text-center p-3">{r.owner ? "✅" : "—"}</td>
                          <td className="text-center p-3">{r.manager ? "✅" : "—"}</td>
                          <td className="text-center p-3">{r.publisher ? "✅" : "—"}</td>
                          <td className="text-center p-3">{r.viewer ? "✅" : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Current Plan</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: "var(--text)" }}>Growth</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>$49<span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>/mo</span></div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Billed monthly</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                  <div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Pages</div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: "var(--text)" }}>7 / 25</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Posts/month</div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: "var(--text)" }}>847 / Unlimited</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Team members</div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: "var(--text)" }}>4 / 10</div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                    Upgrade Plan
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                    View All Plans
                  </button>
                </div>
              </div>

              <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Payment Method</div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">VISA</div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>•••• •••• •••• 4242</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>Expires 08/2027</div>
                    </div>
                  </div>
                  <button className="text-sm px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
                    Update
                  </button>
                </div>
              </div>

              <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Recent Invoices</div>
                <div className="space-y-2">
                  {[
                    { date: "Mar 1, 2026", amount: "$49.00", status: "paid" },
                    { date: "Feb 1, 2026", amount: "$49.00", status: "paid" },
                    { date: "Jan 1, 2026", amount: "$49.00", status: "paid" },
                  ].map(inv => (
                    <div key={inv.date} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                      <span className="text-sm" style={{ color: "var(--text)" }}>{inv.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{inv.amount}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full text-green-400 bg-green-400/10">Paid</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}

"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { ROLE_CONFIG, BATCH_CONFIG, type Role, type BatchId } from "@/contexts/RoleContext";

type Member = { name: string; email: string; roles: Role[]; batches: BatchId[]; status: "active"|"pending"; lastActive: string };

const INITIAL_MEMBERS: Member[] = [
  { name: "Taimur Asghar",  email: "taimur@metareverse.com", roles: ["owner"],               batches: ["all"],               status: "active",  lastActive: "Now" },
  { name: "Bilal Mehmood",  email: "bilal@metareverse.com",  roles: ["co-owner"],             batches: ["all"],               status: "active",  lastActive: "1 hour ago" },
  { name: "Sarah Khan",     email: "sarah@partner-a.com",    roles: ["publisher","approver"], batches: ["batch-a"],           status: "active",  lastActive: "3 hours ago" },
  { name: "Ahmed Raza",     email: "ahmed@partner-b.com",    roles: ["publisher"],            batches: ["batch-b"],           status: "active",  lastActive: "1 day ago" },
  { name: "Nida Jafri",    email: "nida@partner-b.com",      roles: ["analyst"],              batches: ["batch-b"],           status: "active",  lastActive: "5 hours ago" },
  { name: "Aisha Siddiqui",email: "aisha@partner-c.com",    roles: ["manager","publisher"],  batches: ["batch-c"],           status: "active",  lastActive: "2 days ago" },
  { name: "Fatima Ali",    email: "fatima@team.com",          roles: ["publisher"],            batches: ["batch-a","batch-b"], status: "pending", lastActive: "Invited" },
];

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "billing">("profile");
  const [teamMembers, setTeamMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [draftEdits, setDraftEdits] = useState<Record<string, { roles: Role[]; batches: BatchId[] }>>({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", roles: [] as Role[], batches: [] as BatchId[] });
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState("");
  const [transferConfirmEmail, setTransferConfirmEmail] = useState("");
  const [transferDone, setTransferDone] = useState(false);
  const [showCoOwnerModal, setShowCoOwnerModal] = useState(false);
  const [coOwnerInviteName, setCoOwnerInviteName] = useState("");
  const [coOwnerInviteEmail, setCoOwnerInviteEmail] = useState("");

  const tabs = [
    { id: "profile" as const, label: "Profile" },
    { id: "team" as const, label: "Team Members" },
    { id: "billing" as const, label: "Billing & Plan" },
  ];

  const showToast = (msg: string) => { setSavedToast(msg); setTimeout(() => setSavedToast(null), 2500); };

  const getDraft = (email: string, member: Member) =>
    draftEdits[email] ?? { roles: member.roles, batches: member.batches };

  const updateDraft = (email: string, member: Member, field: "roles" | "batches", value: Role[] | BatchId[]) => {
    const current = getDraft(email, member);
    setDraftEdits(prev => ({ ...prev, [email]: { ...current, [field]: value } }));
  };

  const saveMember = (email: string) => {
    const draft = draftEdits[email];
    if (!draft) return;
    setTeamMembers(prev => prev.map(m => m.email === email ? { ...m, ...draft } : m));
    setDraftEdits(prev => { const n = { ...prev }; delete n[email]; return n; });
    setExpandedMember(null);
    showToast("Changes saved");
  };

  const removeMember = (email: string) => {
    setTeamMembers(prev => prev.filter(m => m.email !== email));
    setExpandedMember(null);
    showToast("Member removed");
  };

  const resendInvite = (email: string) => showToast(`Invite resent to ${email}`);

  const cancelInvite = (email: string) => {
    setTeamMembers(prev => prev.filter(m => m.email !== email));
    showToast("Invite cancelled");
  };

  const sendInvite = () => {
    if (!inviteForm.name || !inviteForm.email || inviteForm.roles.length === 0 || inviteForm.batches.length === 0) return;
    setTeamMembers(prev => [...prev, { ...inviteForm, status: "pending", lastActive: "Invited" }]);
    setInviteForm({ name: "", email: "", roles: [], batches: [] });
    setShowInviteModal(false);
    showToast(`Invite sent to ${inviteForm.email}`);
  };

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
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>Transfer Ownership</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>Hand full account ownership to another team member — you become a Manager</div>
                    </div>
                    <button onClick={() => setShowTransferModal(true)} className="text-sm px-3 py-1.5 rounded-lg flex-shrink-0" style={{ color: "#FBBF24", border: "1px solid rgba(251,191,36,0.3)" }}>
                      Transfer
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        Co-Owners
                        {teamMembers.filter(m => m.roles.includes("co-owner")).length > 0 && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316" }}>
                            {teamMembers.filter(m => m.roles.includes("co-owner")).length} active
                          </span>
                        )}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {teamMembers.filter(m => m.roles.includes("co-owner")).length > 0
                          ? teamMembers.filter(m => m.roles.includes("co-owner")).map(m => m.name).join(", ")
                          : "Grant a trusted partner full access — except ownership transfer"}
                      </div>
                    </div>
                    <button onClick={() => setShowCoOwnerModal(true)} className="text-sm px-3 py-1.5 rounded-lg flex-shrink-0" style={{ color: "#F97316", border: "1px solid rgba(249,115,22,0.3)" }}>
                      Manage
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
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
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="space-y-6">
              {/* Toast */}
              {savedToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-xl" style={{ backgroundColor: "#1A1A2E", border: "1px solid var(--border)" }}>
                  ✓ {savedToast}
                </div>
              )}

              {/* Members list */}
              <div className="rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Team Members ({teamMembers.length})</div>
                  <button onClick={() => setShowInviteModal(true)} className="px-3 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                    + Invite Member
                  </button>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {teamMembers.map(m => {
                    const isExpanded = expandedMember === m.email;
                    const isOwner = m.roles[0] === "owner" || m.roles[0] === "co-owner";
                    const isYou = m.email === "taimur@metareverse.com";
                    const initials = m.name.split(" ").map(n => n[0]).join("");
                    const primaryColor = ROLE_CONFIG[m.roles[0]].color;
                    const draft = getDraft(m.email, m);
                    const hasDraft = !!draftEdits[m.email];
                    return (
                      <div key={m.email}>
                        <div className="flex items-center gap-4 px-6 py-4">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{m.name}</span>
                              {isYou && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(255,107,43,0.15)", color: "var(--primary)" }}>You</span>}
                              {m.status === "pending" && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>Pending</span>}
                              {m.roles.map(r => (
                                <span key={r} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${ROLE_CONFIG[r].color}18`, color: ROLE_CONFIG[r].color }}>
                                  {ROLE_CONFIG[r].label}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{m.email}</span>
                              {m.batches.map(b => b !== "all" && (
                                <span key={b} className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${BATCH_CONFIG[b].color}12`, color: BATCH_CONFIG[b].color }}>
                                  {BATCH_CONFIG[b].label.split(" — ")[1] ?? BATCH_CONFIG[b].label}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-[11px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>{m.lastActive}</span>
                          {m.status === "pending" ? (
                            <div className="flex gap-1.5">
                              <button onClick={() => resendInvite(m.email)} className="text-[11px] px-2.5 py-1.5 rounded-lg font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>Resend</button>
                              <button onClick={() => cancelInvite(m.email)} className="text-[11px] px-2.5 py-1.5 rounded-lg font-medium" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>Cancel</button>
                            </div>
                          ) : !isOwner && !isYou && (
                            <button onClick={() => setExpandedMember(isExpanded ? null : m.email)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: hasDraft ? "rgba(255,107,43,0.12)" : "var(--surface-hover)", color: hasDraft ? "var(--primary)" : "var(--text-muted)" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                          )}
                        </div>
                        {/* Expanded edit panel */}
                        {isExpanded && (
                          <div className="px-6 pb-5 border-t" style={{ borderColor: "var(--border)", backgroundColor: "rgba(0,0,0,0.15)" }}>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                              {/* Roles */}
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Roles (select all that apply)</div>
                                <div className="space-y-1.5">
                                  {(["manager","publisher","approver","analyst"] as Role[]).map(r => {
                                    const active = draft.roles.includes(r);
                                    const toggle = () => {
                                      const next = active ? draft.roles.filter(x => x !== r) : [...draft.roles, r];
                                      if (next.length > 0) updateDraft(m.email, m, "roles", next);
                                    };
                                    return (
                                      <button key={r} onClick={toggle} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left" style={{ backgroundColor: active ? `${ROLE_CONFIG[r].color}15` : "var(--surface-hover)" }}>
                                        <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: active ? ROLE_CONFIG[r].color : "var(--border)", backgroundColor: active ? ROLE_CONFIG[r].color : "transparent" }}>
                                          {active && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                                        </div>
                                        <span className="text-[12px] font-medium" style={{ color: active ? ROLE_CONFIG[r].color : "var(--text-secondary)" }}>{ROLE_CONFIG[r].label}</span>
                                        <span className="text-[10px] ml-auto" style={{ color: "var(--text-muted)" }}>
                                          {r === "co-owner" ? "Full access · no ownership transfer" : r === "publisher" ? "Upload & schedule" : r === "approver" ? "Review posts" : r === "manager" ? "Pages · team (scope = batch access)" : "View reports"}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              {/* Batch access */}
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Batch Access</div>
                                <div className="space-y-1.5">
                                  {(["batch-a","batch-b","batch-c"] as BatchId[]).map(b => {
                                    const active = draft.batches.includes(b);
                                    const toggle = () => {
                                      const next = active ? draft.batches.filter(x => x !== b) : [...draft.batches, b];
                                      if (next.length > 0) updateDraft(m.email, m, "batches", next as BatchId[]);
                                    };
                                    return (
                                      <button key={b} onClick={toggle} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left" style={{ backgroundColor: active ? `${BATCH_CONFIG[b].color}12` : "var(--surface-hover)" }}>
                                        <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: active ? BATCH_CONFIG[b].color : "var(--border)", backgroundColor: active ? BATCH_CONFIG[b].color : "transparent" }}>
                                          {active && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                                        </div>
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: BATCH_CONFIG[b].color }} />
                                        <span className="text-[12px]" style={{ color: active ? BATCH_CONFIG[b].color : "var(--text-secondary)" }}>{BATCH_CONFIG[b].label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                                {/* Manager scope comparison */}
                                {draft.roles.includes("manager") && (
                                  <div className="mt-2 rounded-lg overflow-hidden text-[10.5px]" style={{ border: "1px solid rgba(96,165,250,0.2)" }}>
                                    <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: "rgba(96,165,250,0.08)" }}>
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                      <span style={{ color: "var(--text-muted)" }}>
                                        This member will be a{" "}
                                        <strong style={{ color: "#60A5FA" }}>
                                          {draft.batches.length >= 3 ? "Global Manager" : "Batch Manager"}
                                        </strong>
                                        {" "}— scope is determined by batch count
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-0" style={{ backgroundColor: "var(--surface)" }}>
                                      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>Capability</div>
                                      <div className="px-3 py-1.5 text-[10px] font-semibold text-center" style={{ color: "#60A5FA", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>Global Manager<br/><span className="font-normal normal-case tracking-normal" style={{ color: "var(--text-muted)" }}>(all 3 batches)</span></div>
                                      <div className="px-3 py-1.5 text-[10px] font-semibold text-center" style={{ color: "#94A3B8", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>Batch Manager<br/><span className="font-normal normal-case tracking-normal" style={{ color: "var(--text-muted)" }}>(1–2 batches)</span></div>
                                      {[
                                        ["Upload & schedule posts", "✅ All pages", "✅ Batch pages only"],
                                        ["Approve posts", "✅ All batches", "✅ Batch only"],
                                        ["Manage pages & settings", "✅ All batches", "✅ Batch only"],
                                        ["Manage team members", "✅ Platform-wide", "— Not allowed"],
                                        ["Invite new members", "✅", "—"],
                                        ["View reports", "✅ All batches", "✅ Batch only"],
                                        ["View RPM", "✅", "✅"],
                                        ["View revenue / billing", "—", "—"],
                                      ].map(([cap, global, batch], i) => (
                                        <div key={i} className="contents">
                                          <div className="px-3 py-1.5" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>{cap}</div>
                                          <div className="px-3 py-1.5 text-center" style={{ color: global.startsWith("✅") ? "#4ADE80" : "#EF4444", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>{global}</div>
                                          <div className="px-3 py-1.5 text-center" style={{ color: batch.startsWith("✅") ? "#4ADE80" : "#EF4444", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>{batch}</div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="px-3 py-2 text-[10px]" style={{ backgroundColor: "rgba(96,165,250,0.04)", color: "var(--text-muted)" }}>
                                      Currently:{" "}
                                      <strong style={{ color: draft.batches.length >= 3 ? "#60A5FA" : "#94A3B8" }}>
                                        {draft.batches.length >= 3 ? "Global Manager" : "Batch Manager"}
                                      </strong>
                                      {" "}— {draft.batches.length >= 3 ? "add to all 3 batches to unlock team management" : `add to all 3 batches to promote to Global Manager`}
                                    </div>
                                  </div>
                                )}
                                {/* Multi-batch note */}
                                {draft.batches.length > 1 && !draft.roles.includes("manager") && (
                                  <div className="mt-2 px-3 py-2 rounded-lg text-[10.5px]" style={{ backgroundColor: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.18)", color: "var(--text-muted)" }}>
                                    <strong style={{ color: "#FBBF24" }}>Multi-batch access</strong> — sees a merged view of all assigned batches. Can upload/draft for any page in their batches.
                                  </div>
                                )}
                                <div className="flex gap-2 mt-3">
                                  <button onClick={() => saveMember(m.email)} className="flex-1 py-2 rounded-lg text-[12px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                                    Save Changes
                                  </button>
                                  <button onClick={() => { removeMember(m.email); }} className="px-3 py-2 rounded-lg text-[12px] font-semibold" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Role Permissions table */}
              <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Role Permissions</div>
                <div className="overflow-hidden rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                        <th className="text-left p-3 font-medium" style={{ color: "var(--text-muted)" }}>Permission</th>
                        {(["owner","co-owner","manager","publisher","approver","analyst"] as Role[]).map(r => (
                          <th key={r} className="text-center p-3 font-medium" style={{ color: ROLE_CONFIG[r].color }}>{ROLE_CONFIG[r].label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { perm: "View analytics",          owner: true,  manager: true,  publisher: true,  approver: true,  analyst: true  },
                        { perm: "View revenue",            owner: true,  manager: false, publisher: false, approver: false, analyst: false },
                        { perm: "Create & schedule posts", owner: true,  manager: true,  publisher: true,  approver: false, analyst: false },
                        { perm: "Approve / reject posts",  owner: true,  manager: true,  publisher: false, approver: true,  analyst: false },
                        { perm: "Manage pages (own batch)", owner: true,  manager: true,  publisher: false, approver: false, analyst: false },
                        { perm: "Manage team (global only)",owner: true, manager: false, publisher: false, approver: false, analyst: false },
                        { perm: "Billing & subscription",  owner: true,  "co-owner": true, manager: false, publisher: false, approver: false, analyst: false },
                      ].map(row => (
                        <tr key={row.perm} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                          <td className="p-3" style={{ color: "var(--text)" }}>{row.perm}</td>
                          {(["owner","co-owner","manager","publisher","approver","analyst"] as Role[]).map(r => (
                            <td key={r} className="text-center p-3">
                              {(row as any)[r] ?? (r === "co-owner" ? row["owner"] : false) ? (
                                <span className="text-[13px]">✅</span>
                              ) : (
                                <span style={{ color: "var(--text-muted)" }}>—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Invite Modal */}
          {showInviteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
              <div className="w-[480px] rounded-2xl p-6 shadow-2xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>Invite Team Member</h2>
                  <button onClick={() => setShowInviteModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>Full Name</label>
                      <input value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Zara Ahmed" className="w-full px-3 py-2.5 rounded-lg text-sm outline-0 border-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }} />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                      <input value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} placeholder="zara@team.com" type="email" className="w-full px-3 py-2.5 rounded-lg text-sm outline-0 border-0" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)" }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Roles</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["manager","publisher","approver","analyst"] as Role[]).map(r => {
                        const active = inviteForm.roles.includes(r);
                        return (
                          <button key={r} onClick={() => setInviteForm(f => ({ ...f, roles: active ? f.roles.filter(x => x !== r) : [...f.roles, r] }))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-left"
                            style={{ backgroundColor: active ? `${ROLE_CONFIG[r].color}15` : "var(--surface-hover)", border: `1px solid ${active ? `${ROLE_CONFIG[r].color}40` : "transparent"}` }}>
                            <div className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: active ? ROLE_CONFIG[r].color : "var(--border)", backgroundColor: active ? ROLE_CONFIG[r].color : "transparent" }}>
                              {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <span className="text-[12px] font-medium" style={{ color: active ? ROLE_CONFIG[r].color : "var(--text-secondary)" }}>{ROLE_CONFIG[r].label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Batch Access</label>
                    <div className="space-y-1.5">
                      {(["batch-a","batch-b","batch-c"] as BatchId[]).map(b => {
                        const active = inviteForm.batches.includes(b);
                        return (
                          <button key={b} onClick={() => setInviteForm(f => ({ ...f, batches: active ? f.batches.filter(x => x !== b) : [...f.batches, b] as BatchId[] }))}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left"
                            style={{ backgroundColor: active ? `${BATCH_CONFIG[b].color}12` : "var(--surface-hover)", border: `1px solid ${active ? `${BATCH_CONFIG[b].color}30` : "transparent"}` }}>
                            <div className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: active ? BATCH_CONFIG[b].color : "var(--border)", backgroundColor: active ? BATCH_CONFIG[b].color : "transparent" }}>
                              {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: BATCH_CONFIG[b].color }} />
                            <span className="text-[12px]" style={{ color: active ? BATCH_CONFIG[b].color : "var(--text-secondary)" }}>{BATCH_CONFIG[b].label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setShowInviteModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>Cancel</button>
                    <button onClick={sendInvite}
                      disabled={!inviteForm.name || !inviteForm.email || inviteForm.roles.length === 0 || inviteForm.batches.length === 0}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                      style={{ backgroundColor: "var(--primary)" }}>
                      Send Invite
                    </button>
                  </div>
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

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 mx-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            {!transferDone ? (<>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(251,191,36,0.12)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Transfer Account Ownership</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>This action is permanent and cannot be undone</div>
                </div>
              </div>

              <div className="my-4 px-3 py-2.5 rounded-lg text-[11.5px] space-y-1" style={{ backgroundColor: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)", color: "var(--text-secondary)" }}>
                <div>• The selected member becomes the new Owner — full access including billing and revenue</div>
                <div>• Your account is downgraded to <strong style={{ color: "var(--text)" }}>Global Manager</strong> — you keep all ops access but lose billing and revenue visibility</div>
                <div>• All team assignments, pages, and data remain unchanged</div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>Transfer ownership to</label>
                  <select
                    value={transferTarget}
                    onChange={e => setTransferTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-[13px]"
                    style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    <option value="">Select a team member…</option>
                    {teamMembers.filter(m => m.status === "active" && !m.roles.includes("owner") && !m.roles.includes("co-owner")).map(m => (
                      <option key={m.email} value={m.email}>{m.name} — {m.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>Confirm by typing the recipient&apos;s email</label>
                  <input
                    type="email"
                    placeholder="their@email.com"
                    value={transferConfirmEmail}
                    onChange={e => setTransferConfirmEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-[13px]"
                    style={{ backgroundColor: "var(--bg)", border: `1px solid ${transferConfirmEmail && transferConfirmEmail === transferTarget ? "#4ADE80" : "var(--border)"}`, color: "var(--text)" }}
                  />
                  {transferConfirmEmail && transferTarget && transferConfirmEmail !== transferTarget && (
                    <div className="text-[11px] mt-1" style={{ color: "#EF4444" }}>Email doesn&apos;t match the selected member</div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowTransferModal(false); setTransferTarget(""); setTransferConfirmEmail(""); }} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  Cancel
                </button>
                <button
                  disabled={!transferTarget || transferConfirmEmail !== transferTarget}
                  onClick={() => setTransferDone(true)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold"
                  style={{ backgroundColor: transferTarget && transferConfirmEmail === transferTarget ? "#EF4444" : "var(--surface-hover)", color: transferTarget && transferConfirmEmail === transferTarget ? "white" : "var(--text-muted)", opacity: !transferTarget || transferConfirmEmail !== transferTarget ? 0.5 : 1 }}
                >
                  Transfer Ownership
                </button>
              </div>
            </>) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(74,222,128,0.12)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>Ownership transferred</div>
                <div className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>
                  {teamMembers.find(m => m.email === transferTarget)?.name} is now the Owner. You are now a Global Manager.
                </div>
                <button onClick={() => { setShowTransferModal(false); setTransferDone(false); setTransferTarget(""); setTransferConfirmEmail(""); }} className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Co-Owner Modal */}
      {showCoOwnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Manage Co-Owners</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Co-owners have full platform access including billing — except ownership transfer.</div>
              </div>
              <button onClick={() => { setShowCoOwnerModal(false); setCoOwnerInviteName(""); setCoOwnerInviteEmail(""); }} className="text-[18px] leading-none" style={{ color: "var(--text-muted)" }}>×</button>
            </div>

            {/* Current co-owners */}
            {teamMembers.filter(m => m.roles.includes("co-owner")).length > 0 && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Current Co-Owners</div>
                <div className="space-y-1.5">
                  {teamMembers.filter(m => m.roles.includes("co-owner")).map(m => (
                    <div key={m.email} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
                      <div>
                        <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{m.name}</span>
                        <span className="text-[11px] ml-2" style={{ color: "var(--text-muted)" }}>{m.email}</span>
                      </div>
                      <button
                        onClick={() => setTeamMembers(prev => prev.filter(x => x.email !== m.email))}
                        className="text-[11px] px-2 py-1 rounded-md" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invite by email */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Invite by Email</div>
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Full name"
                  value={coOwnerInviteName}
                  onChange={e => setCoOwnerInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-[13px]"
                  style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
                <input
                  type="email"
                  placeholder="their@email.com"
                  value={coOwnerInviteEmail}
                  onChange={e => setCoOwnerInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-[13px]"
                  style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowCoOwnerModal(false); setCoOwnerInviteName(""); setCoOwnerInviteEmail(""); }} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  Cancel
                </button>
                <button
                  disabled={!coOwnerInviteName || !coOwnerInviteEmail.includes("@")}
                  onClick={() => {
                    const newCoOwner: Member = { name: coOwnerInviteName, email: coOwnerInviteEmail, roles: ["co-owner"], batches: ["all"], status: "pending", lastActive: "Invited" };
                    setTeamMembers(prev => [...prev, newCoOwner]);
                    setCoOwnerInviteName("");
                    setCoOwnerInviteEmail("");
                    setShowCoOwnerModal(false);
                    setSavedToast("Co-owner invite sent");
                    setTimeout(() => setSavedToast(null), 3000);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white"
                  style={{ backgroundColor: (coOwnerInviteName && coOwnerInviteEmail.includes("@")) ? "#F97316" : "var(--surface-hover)", opacity: (coOwnerInviteName && coOwnerInviteEmail.includes("@")) ? 1 : 0.5 }}>
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

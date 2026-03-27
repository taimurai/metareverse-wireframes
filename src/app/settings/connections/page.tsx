"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Connection {
  id: string;
  fbUserId: string;
  name: string;
  email: string;
  role: "owner" | "user";
  pagesManaged: { id: string; name: string; avatar: string; color: string }[];
  connectedDate: string;
  lastActive: string;
  status: "active" | "expired" | "revoked";
}

const CONNECTIONS: Connection[] = [
  {
    id: "c1", fbUserId: "100089...", name: "Taimur Asghar", email: "taimur@metareverse.com", role: "owner",
    pagesManaged: [
      { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6" },
      { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
      { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6" },
      { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B" },
      { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1" },
      { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899" },
      { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9" },
    ],
    connectedDate: "Jan 12, 2026", lastActive: "2 minutes ago", status: "active",
  },
  {
    id: "c2", fbUserId: "100092...", name: "Sarah Khan", email: "sarah@partner-a.com", role: "user",
    pagesManaged: [
      { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6" },
      { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899" },
      { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1" },
    ],
    connectedDate: "Feb 5, 2026", lastActive: "3 hours ago", status: "active",
  },
  {
    id: "c3", fbUserId: "100095...", name: "Ahmed Raza", email: "ahmed@partner-b.com", role: "user",
    pagesManaged: [
      { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
      { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6" },
    ],
    connectedDate: "Feb 18, 2026", lastActive: "1 day ago", status: "expired",
  },
];

export default function ConnectedIDs() {
  const [selected, setSelected] = useState<string | null>(null);

  const conn = CONNECTIONS.find(c => c.id === selected);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[240px]">
        <Header />
        <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold" style={{ color: "var(--text)" }}>Connected IDs</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Facebook accounts connected to MetaReverse with their page access</p>
            </div>
            <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
              + Connect Facebook Account
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Total Connected</div>
              <div className="text-2xl font-bold mt-1" style={{ color: "var(--text)" }}>{CONNECTIONS.length}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Facebook accounts</div>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Active Tokens</div>
              <div className="text-2xl font-bold mt-1 text-green-400">{CONNECTIONS.filter(c => c.status === "active").length}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>of {CONNECTIONS.length} connected</div>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Needs Attention</div>
              <div className="text-2xl font-bold mt-1 text-red-400">{CONNECTIONS.filter(c => c.status !== "active").length}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>expired or revoked</div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_380px] gap-8">
            {/* Left: Connections List */}
            <div className="space-y-3">
              {CONNECTIONS.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className="flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all"
                  style={{
                    backgroundColor: selected === c.id ? "var(--surface-hover)" : "var(--surface)",
                    borderColor: selected === c.id ? "var(--primary)" : c.status !== "active" ? "rgba(239,68,68,0.3)" : "var(--border)",
                  }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: c.role === "owner" ? "var(--primary)" : "#6366F1" }}>
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{c.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${c.role === "owner" ? "text-amber-300 bg-amber-400/15" : "text-blue-300 bg-blue-400/15"}`}>
                        {c.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{c.email}</span>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>·</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{c.pagesManaged.length} pages</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      c.status === "active" ? "text-green-400 bg-green-400/10" :
                      c.status === "expired" ? "text-red-400 bg-red-400/10" :
                      "text-gray-400 bg-gray-400/10"
                    }`}>
                      ● {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{c.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Detail Panel */}
            <div className="rounded-xl border p-6 h-fit sticky top-24" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              {conn ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: conn.role === "owner" ? "var(--primary)" : "#6366F1" }}>
                      {conn.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: "var(--text)" }}>{conn.name}</h3>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{conn.email}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "var(--text-muted)" }}>Facebook User ID</span>
                        <span className="font-mono text-xs" style={{ color: "var(--text)" }}>{conn.fbUserId}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span style={{ color: "var(--text-muted)" }}>Role</span>
                        <span className="font-medium capitalize" style={{ color: "var(--text)" }}>{conn.role}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span style={{ color: "var(--text-muted)" }}>Connected</span>
                        <span style={{ color: "var(--text)" }}>{conn.connectedDate}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span style={{ color: "var(--text-muted)" }}>Last active</span>
                        <span style={{ color: "var(--text)" }}>{conn.lastActive}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                        Pages Managed ({conn.pagesManaged.length})
                      </div>
                      <div className="space-y-2">
                        {conn.pagesManaged.map(p => (
                          <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: p.color }}>
                              {p.avatar}
                            </div>
                            <span className="text-sm" style={{ color: "var(--text)" }}>{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {conn.status !== "active" && (
                      <button className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-red-500">
                        Reconnect Account
                      </button>
                    )}

                    {conn.role !== "owner" && (
                      <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                        <button className="w-full py-2 rounded-lg text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors">
                          Revoke Access
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-3xl mb-3">🔗</div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>Select a connection</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Click an account to view details and manage access</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

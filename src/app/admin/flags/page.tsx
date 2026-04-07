"use client";
import { useState } from "react";

type Flag = {
  key: string;
  label: string;
  description: string;
  scope: "global" | "per-plan" | "per-account";
  enabledFor: string;
  status: boolean;
  tag?: string;
};

const defaultFlags: Flag[] = [
  {
    key: "threads_publishing",
    label: "Threads Publishing",
    description: "Enable Threads API publishing for accounts. Currently in beta — requires Manual activation.",
    scope: "per-account",
    enabledFor: "14 accounts",
    status: false,
    tag: "Beta",
  },
  {
    key: "performance_rotation",
    label: "Performance-Based Rotation",
    description: "Activate performance-based Posting ID rotation algorithm when the algorithm ships. Currently all accounts use Round Robin regardless of their UI selection.",
    scope: "global",
    enabledFor: "All accounts",
    status: false,
    tag: "Deferred v2",
  },
  {
    key: "visual_duplicate_detection",
    label: "Visual Similarity Duplicate Detection",
    description: "Detect duplicate posts using image similarity (not just SHA-256 hash). Computationally expensive — enable per account only.",
    scope: "per-account",
    enabledFor: "2 accounts",
    status: false,
    tag: "Deferred v2",
  },
  {
    key: "bulk_approval",
    label: "Bulk Approval in Approvals Inbox",
    description: "Allow approvers to approve/reject multiple posts at once with a single confirmation.",
    scope: "global",
    enabledFor: "All accounts",
    status: true,
    tag: "Beta",
  },
  {
    key: "ai_captions",
    label: "AI Caption Suggestions",
    description: "Suggest captions using AI based on the uploaded media. Opt-in per account.",
    scope: "per-plan",
    enabledFor: "Pro plan",
    status: false,
    tag: "Roadmap",
  },
  {
    key: "advanced_analytics",
    label: "Advanced Analytics Dashboard",
    description: "Extended analytics with per-post attribution, audience breakdown, and custom date ranges beyond 90 days.",
    scope: "per-plan",
    enabledFor: "Pro plan",
    status: false,
    tag: "Roadmap",
  },
  {
    key: "multi_admin",
    label: "Multiple Super Admins",
    description: "Allow more than one Super Admin user to access this portal with role-based permissions.",
    scope: "global",
    enabledFor: "Platform-level",
    status: false,
    tag: "Roadmap",
  },
  {
    key: "white_label",
    label: "White Label Mode",
    description: "Allow accounts to replace MetaReverse branding with their own. Hides all MetaReverse references in the UI.",
    scope: "per-account",
    enabledFor: "0 accounts",
    status: false,
    tag: "Roadmap",
  },
];

const tagColors: Record<string, { bg: string; color: string }> = {
  "Beta":       { bg: "var(--primary-muted)", color: "var(--primary)" },
  "Deferred v2":{ bg: "var(--surface-active)", color: "var(--text-muted)" },
  "Roadmap":    { bg: "rgba(167,139,250,0.15)", color: "#A78BFA" },
};

const scopeColors: Record<string, { bg: string; color: string }> = {
  "global":      { bg: "var(--success-bg)",  color: "var(--success)"  },
  "per-plan":    { bg: "var(--warning-bg)",  color: "var(--warning)"  },
  "per-account": { bg: "var(--primary-muted)", color: "var(--primary)" },
};

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<Flag[]>(defaultFlags);

  function toggle(key: string) {
    setFlags(prev => prev.map(f => f.key === key ? { ...f, status: !f.status } : f));
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>Feature Flags</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Enable or disable features per account, per plan, or globally — without a code deploy.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6">
        {Object.entries(scopeColors).map(([scope, c]) => (
          <div key={scope} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {scope === "global" ? "Global" : scope === "per-plan" ? "Per Plan" : "Per Account"}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {flags.map(flag => {
          const sc = scopeColors[flag.scope];
          const tc = flag.tag ? tagColors[flag.tag] : null;
          return (
            <div key={flag.key} className="rounded-xl p-5 flex items-start gap-4"
              style={{
                background: "var(--surface)",
                border: `1px solid ${flag.status ? "var(--success)" : "var(--border)"}`,
                opacity: 1,
              }}>
              {/* Toggle */}
              <button onClick={() => toggle(flag.key)}
                className="relative mt-0.5 w-10 h-6 rounded-full shrink-0 transition-all"
                style={{ background: flag.status ? "var(--success)" : "var(--surface-active)" }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: flag.status ? "20px" : "4px" }} />
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{flag.label}</span>
                  {tc && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: tc.bg, color: tc.color }}>{flag.tag}</span>}
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: sc.bg, color: sc.color }}>
                    {flag.scope === "global" ? "Global" : flag.scope === "per-plan" ? "Per Plan" : "Per Account"}
                  </span>
                </div>
                <p className="text-[12px] mb-2" style={{ color: "var(--text-secondary)" }}>{flag.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Enabled for: <span style={{ color: "var(--text-secondary)" }}>{flag.enabledFor}</span>
                  </span>
                  {flag.scope === "per-account" && (
                    <button className="text-[11px] px-2 py-0.5 rounded-md"
                      style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>
                      Manage accounts →
                    </button>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="shrink-0 text-right">
                <div className="text-[12px] font-semibold" style={{ color: flag.status ? "var(--success)" : "var(--text-muted)" }}>
                  {flag.status ? "Enabled" : "Disabled"}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {flag.key}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

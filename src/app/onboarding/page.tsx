"use client";
import { useState } from "react";

type Step = "welcome" | "connect" | "oauth-loading" | "select-pages" | "configuring" | "done";

const FB_PAGES = [
  { id: "p1", name: "Laugh Central", category: "Comedy", followers: "3.2M", avatar: "LC", color: "#8B5CF6", ig: true, checked: true },
  { id: "p2", name: "History Uncovered", category: "Education", followers: "2.4M", avatar: "HU", color: "#FF6B2B", ig: true, checked: true },
  { id: "p3", name: "TechByte", category: "Technology", followers: "1.1M", avatar: "TB", color: "#14B8A6", ig: true, checked: true },
  { id: "p4", name: "Money Matters", category: "Finance", followers: "680K", avatar: "MM", color: "#F59E0B", ig: false, checked: true },
  { id: "p5", name: "Daily Health Tips", category: "Health", followers: "420K", avatar: "DH", color: "#6366F1", ig: false, checked: false },
  { id: "p6", name: "Fitness Factory", category: "Fitness", followers: "310K", avatar: "FF", color: "#EC4899", ig: true, checked: false },
  { id: "p7", name: "Know Her Name", category: "Women's History", followers: "136", avatar: "KH", color: "#0EA5E9", ig: true, checked: false },
  { id: "p8", name: "Daily Memes HQ", category: "Entertainment", followers: "890K", avatar: "DM", color: "#F43F5E", ig: false, checked: false },
  { id: "p9", name: "Science Unlocked", category: "Science", followers: "220K", avatar: "SU", color: "#10B981", ig: true, checked: false },
];

const STEPS = ["Connect", "Select Pages", "Configure", "Done"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
              style={{
                backgroundColor: i < current ? "var(--success)" : i === current ? "var(--primary)" : "var(--surface-hover)",
                color: i <= current ? "white" : "var(--text-muted)",
              }}>
              {i < current
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : i + 1}
            </div>
            <span className="text-[10px] mt-1 font-medium whitespace-nowrap" style={{ color: i === current ? "var(--primary)" : "var(--text-muted)" }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-16 h-px mx-2 mb-4 transition-all" style={{ backgroundColor: i < current ? "var(--success)" : "var(--border)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [pages, setPages] = useState(FB_PAGES);
  const [configProgress, setConfigProgress] = useState(0);
  const [timezone, setTimezone] = useState("Asia/Karachi (PKT)");
  const [interval, setInterval] = useState("1.5 hrs");
  const [monetization, setMonetization] = useState(true);

  const selectedCount = pages.filter(p => p.checked).length;

  const togglePage = (id: string) => setPages(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  const selectAll = () => setPages(prev => prev.map(p => ({ ...p, checked: true })));
  const selectNone = () => setPages(prev => prev.map(p => ({ ...p, checked: false })));

  const startOAuth = () => {
    setStep("oauth-loading");
    setTimeout(() => setStep("select-pages"), 2200);
  };

  const startConfiguring = () => {
    setStep("configuring");
    setConfigProgress(0);
    const timer = setInterval(() => {
      setConfigProgress(p => {
        if (p >= 100) { clearInterval(timer); setStep("done"); return 100; }
        return p + 8;
      });
    }, 160);
  };

  const stepIndex = step === "welcome" || step === "connect" || step === "oauth-loading" ? 0
    : step === "select-pages" ? 1
    : step === "configuring" ? 2
    : 3;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: "var(--bg)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-[14px]" style={{ backgroundColor: "var(--primary)" }}>MR</div>
        <span className="text-[18px] font-bold" style={{ color: "var(--text)" }}>MetaReverse</span>
      </div>

      <div className="w-full max-w-[600px]">

        {/* ── WELCOME ── */}
        {step === "welcome" && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(255,107,43,0.1)", border: "1px solid rgba(255,107,43,0.2)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--primary)" }}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <h1 className="text-[28px] font-bold mb-3" style={{ color: "var(--text)" }}>Welcome to MetaReverse</h1>
            <p className="text-[15px] leading-relaxed mb-8 max-w-[420px] mx-auto" style={{ color: "var(--text-muted)" }}>
              Let&apos;s get your Facebook pages connected. It takes about 2 minutes.
            </p>
            <div className="flex flex-col gap-3 max-w-[320px] mx-auto mb-8">
              {[
                { n: "1", label: "Connect your Facebook account" },
                { n: "2", label: "Select which pages to manage" },
                { n: "3", label: "Configure posting preferences" },
              ].map(item => (
                <div key={item.n} className="flex items-center gap-3 text-left px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ backgroundColor: "var(--primary)" }}>{item.n}</div>
                  <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{item.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep("connect")}
              className="px-8 py-3 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
              Get Started
            </button>
          </div>
        )}

        {/* ── CONNECT ── */}
        {step === "connect" && (
          <div>
            <StepBar current={0} />
            <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--text)" }}>Connect your Facebook account</h2>
            <p className="text-[14px] mb-8" style={{ color: "var(--text-muted)" }}>
              We use Facebook&apos;s official OAuth. MetaReverse never stores your Facebook password.
            </p>

            {/* Permission list */}
            <div className="rounded-2xl border mb-6 overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Permissions requested</span>
              </div>
              {[
                { icon: "📄", label: "Manage your Pages", desc: "Read page info, post on your behalf" },
                { icon: "📊", label: "View Page Insights", desc: "Access analytics and performance data" },
                { icon: "💰", label: "Content Monetization", desc: "View earnings and RPM data" },
                { icon: "📸", label: "Instagram Basic", desc: "Cross-post to connected Instagram accounts" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[18px]">{p.icon}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{p.label}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{p.desc}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--success)" }}><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              ))}
            </div>

            <button onClick={startOAuth}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-[15px] font-semibold mb-4 transition-all hover:opacity-90"
              style={{ backgroundColor: "#1877F2", color: "white" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Continue with Facebook
            </button>
            <p className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
              You&apos;ll be redirected to Facebook to authorize access. We only request the permissions listed above.
            </p>
          </div>
        )}

        {/* ── OAUTH LOADING ── */}
        {step === "oauth-loading" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#1877F2" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Connecting to Facebook…</span>
            </div>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Fetching your pages and permissions</p>
          </div>
        )}

        {/* ── SELECT PAGES ── */}
        {step === "select-pages" && (
          <div>
            <StepBar current={1} />
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-[22px] font-bold" style={{ color: "var(--text)" }}>Select pages to manage</h2>
                <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>We found {pages.length} pages on your Facebook account</p>
              </div>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-[12px] px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: "var(--surface)", color: "var(--primary)", border: "1px solid var(--border)" }}>All</button>
                <button onClick={selectNone} className="text-[12px] px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>None</button>
              </div>
            </div>

            <div className="rounded-2xl border overflow-hidden mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              {pages.map((page, i) => (
                <div key={page.id}
                  onClick={() => togglePage(page.id)}
                  className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all border-b last:border-0"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: page.checked ? "rgba(255,107,43,0.04)" : "transparent",
                  }}
                  onMouseEnter={e => !page.checked && (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
                  onMouseLeave={e => !page.checked && (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {/* Checkbox */}
                  <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ backgroundColor: page.checked ? "var(--primary)" : "transparent", border: `1.5px solid ${page.checked ? "var(--primary)" : "var(--border)"}` }}>
                    {page.checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: page.color }}>{page.avatar}</div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{page.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>{page.category}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{page.followers} followers</span>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "#1877F2" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                      </span>
                      {page.ig && (
                        <span className="text-[11px]" style={{ color: "#E1306C" }}>+ Instagram</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                <strong style={{ color: "var(--text)" }}>{selectedCount}</strong> page{selectedCount !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={startConfiguring}
                disabled={selectedCount === 0}
                className="px-6 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "var(--primary)", boxShadow: selectedCount > 0 ? "0 4px 14px var(--primary-glow)" : "none" }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── CONFIGURING ── */}
        {step === "configuring" && (
          <div>
            <StepBar current={2} />
            <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--text)" }}>Configure your preferences</h2>
            <p className="text-[13px] mb-6" style={{ color: "var(--text-muted)" }}>These apply as defaults for all {selectedCount} pages. You can override per-page in Settings.</p>

            <div className="flex flex-col gap-4 mb-8">
              {/* Timezone */}
              <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Default Timezone</label>
                <select value={timezone} onChange={e => setTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none"
                  style={{ backgroundColor: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)" }}>
                  {["Asia/Karachi (PKT)","America/New_York (EST)","America/Los_Angeles (PST)","Europe/London (GMT)","Asia/Dubai (GST)","Asia/Kolkata (IST)"].map(tz => (
                    <option key={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              {/* Post interval */}
              <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Default Post Interval</label>
                <p className="text-[12px] mb-3" style={{ color: "var(--text-muted)" }}>Used by Auto-fill Schedule in Bulk Upload</p>
                <div className="flex gap-2 flex-wrap">
                  {["30 min","1 hr","1.5 hrs","2 hrs","2.5 hrs","3 hrs","4 hrs"].map(opt => (
                    <button key={opt} onClick={() => setInterval(opt)}
                      className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                      style={{ backgroundColor: interval === opt ? "var(--primary)" : "var(--surface-hover)", color: interval === opt ? "white" : "var(--text-secondary)" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monetization */}
              <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--text)" }}>Enable Content Monetization tracking</div>
                    <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>Track RPM, earnings, and monetized views via Meta Content Monetization API</div>
                  </div>
                  <button onClick={() => setMonetization(m => !m)}
                    className="relative w-11 h-6 rounded-full transition-all flex-shrink-0 ml-4"
                    style={{ backgroundColor: monetization ? "var(--primary)" : "var(--surface-hover)" }}>
                    <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                      style={{ left: monetization ? "calc(100% - 22px)" : "2px" }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Importing progress */}
            {configProgress > 0 && configProgress < 100 && (
              <div className="mb-6 rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>Importing {selectedCount} pages…</span>
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{configProgress}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                  <div className="h-full rounded-full transition-all duration-200" style={{ width: `${configProgress}%`, backgroundColor: "var(--primary)" }} />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep("select-pages")} className="px-5 py-2.5 rounded-xl text-[13px] font-medium" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                ← Back
              </button>
              <button onClick={startConfiguring}
                className="px-6 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
                Import {selectedCount} Pages
              </button>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {step === "done" && (
          <div className="text-center">
            <StepBar current={3} />
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--success)" }}><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-[26px] font-bold mb-2" style={{ color: "var(--text)" }}>You&apos;re all set!</h2>
            <p className="text-[14px] mb-2" style={{ color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text)" }}>{selectedCount} pages</strong> imported and ready to manage
            </p>
            <p className="text-[13px] mb-10" style={{ color: "var(--text-muted)" }}>
              Analytics will start populating within 24 hours as Meta syncs your data.
            </p>

            {/* Summary */}
            <div className="text-left rounded-2xl border mb-8 overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>What&apos;s ready</span>
              </div>
              {[
                { icon: "✅", label: `${selectedCount} pages connected`, sub: "Facebook" + (pages.filter(p => p.checked && p.ig).length > 0 ? ` + Instagram (${pages.filter(p => p.checked && p.ig).length} pages)` : "") },
                { icon: "⏰", label: "Default posting interval set", sub: interval },
                { icon: "🌍", label: "Timezone configured", sub: timezone },
                { icon: "💰", label: "Revenue tracking", sub: monetization ? "Enabled — earnings will appear in Reports" : "Disabled" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[17px]">{item.icon}</span>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{item.label}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <a href="/"
                className="block w-full py-3.5 rounded-xl text-[14px] font-semibold text-white text-center transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
                Go to Dashboard →
              </a>
              <a href="/upload"
                className="block w-full py-3 rounded-xl text-[13px] font-medium text-center"
                style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                Start uploading posts
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

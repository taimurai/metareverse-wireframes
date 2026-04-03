"use client";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = "/"; }, 1500);
  };

  const handleFacebook = () => {
    setFbLoading(true);
    setTimeout(() => { setFbLoading(false); window.location.href = "/"; }, 1800);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setForgotSent(true); }, 1200);
  };

  const pwStrength = password.length === 0 ? 0 : password.length < 4 ? 1 : password.length < 8 ? 2 : password.length < 12 ? 3 : 4;
  const pwLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const pwColor = ["", "var(--error)", "var(--warning)", "#60A5FA", "var(--success)"][pwStrength];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg)" }}>
      {/* Left: Branding */}
      <div className="hidden lg:flex w-[480px] flex-col justify-between p-12 relative overflow-hidden" style={{ backgroundColor: "var(--bg-deep)", borderRight: "1px solid var(--border)" }}>
        {/* Glow */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none opacity-20" style={{ background: "radial-gradient(circle, #FF6B2B 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none opacity-10" style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "var(--primary)" }}>MR</div>
            <span className="text-xl font-bold" style={{ color: "var(--text)" }}>MetaReverse</span>
          </div>
          <h2 className="text-[30px] font-bold leading-tight mb-4" style={{ color: "var(--text)" }}>
            Publish smarter.<br />Earn more.
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            The operations platform for publishers managing 10 to 10,000 Facebook pages.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          {[
            { icon: "💰", title: "Cross-page revenue tracking", desc: "Aggregate earnings, RPM, and monetization across your entire portfolio" },
            { icon: "📤", title: "Bulk upload & auto-schedule", desc: "Upload 100 posts and space them automatically in seconds" },
            { icon: "💬", title: "Threaded comment queues", desc: "Sequential comments that maximize reach on every post" },
            { icon: "📊", title: "Real insights", desc: "Facebook-grade analytics — views, followers, clicks, earnings" },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
              <span className="text-[20px] mt-0.5">{f.icon}</span>
              <div>
                <div className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text)" }}>{f.title}</div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex -space-x-2">
              {["#FF6B2B","#8B5CF6","#14B8A6","#EC4899"].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: c, borderColor: "var(--surface)" }}>
                  {["TM","SK","AR","FA"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="text-[12px] font-semibold" style={{ color: "var(--text)" }}>Trusted by 1,200+ publishers</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Managing 45,000+ Facebook pages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "var(--primary)" }}>MR</div>
            <span className="text-xl font-bold" style={{ color: "var(--text)" }}>MetaReverse</span>
          </div>

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <>
              <h1 className="text-[24px] font-bold mb-1" style={{ color: "var(--text)" }}>Welcome back</h1>
              <p className="text-[14px] mb-8" style={{ color: "var(--text-muted)" }}>Sign in to your MetaReverse account</p>

              <button onClick={handleFacebook} disabled={fbLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[14px] font-semibold mb-6 transition-all hover:opacity-90 disabled:opacity-70"
                style={{ backgroundColor: "#1877F2", color: "white" }}>
                {fbLoading
                  ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                }
                {fbLoading ? "Connecting…" : "Continue with Facebook"}
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>or sign in with email</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required
                    className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none transition-colors"
                    style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>Password</label>
                    <button type="button" onClick={() => setMode("forgot")} className="text-[12px] hover:opacity-70" style={{ color: "var(--primary)" }}>Forgot password?</button>
                  </div>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                      className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none pr-10"
                      style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                      onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100" style={{ color: "var(--text-muted)" }}>
                      {showPass
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Signing in…</span>
                    : "Sign In"}
                </button>
              </form>

              <p className="text-center mt-6 text-[13px]" style={{ color: "var(--text-muted)" }}>
                Don&apos;t have an account?{" "}
                <button onClick={() => setMode("signup")} className="font-semibold hover:opacity-70" style={{ color: "var(--primary)" }}>Sign up free</button>
              </p>
            </>
          )}

          {/* ── SIGNUP ── */}
          {mode === "signup" && (
            <>
              <h1 className="text-[24px] font-bold mb-1" style={{ color: "var(--text)" }}>Create your account</h1>
              <p className="text-[14px] mb-8" style={{ color: "var(--text-muted)" }}>Start managing your Meta pages at scale</p>

              <button onClick={handleFacebook} disabled={fbLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[14px] font-semibold mb-6 transition-all hover:opacity-90 disabled:opacity-70"
                style={{ backgroundColor: "#1877F2", color: "white" }}>
                {fbLoading
                  ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                }
                {fbLoading ? "Connecting…" : "Sign up with Facebook"}
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>or sign up with email</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>First Name</label>
                    <input type="text" placeholder="Taimur" required
                      className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none"
                      style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                      onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>Last Name</label>
                    <input type="text" placeholder="Asghar" required
                      className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none"
                      style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                      onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required
                    className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none"
                    style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                </div>
                <div>
                  <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8}
                      className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none pr-10"
                      style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                      onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100" style={{ color: "var(--text-muted)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {password.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: pwStrength >= i ? pwColor : "var(--border)" }} />
                      ))}
                      <span className="text-[10px] font-medium ml-1" style={{ color: pwColor }}>{pwLabel}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>How many pages do you manage?</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none"
                    style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>
                    <option>1–10 pages</option>
                    <option>11–50 pages</option>
                    <option>51–100 pages</option>
                    <option>100–500 pages</option>
                    <option>500+ pages</option>
                  </select>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Creating account…</span>
                    : "Create Account"}
                </button>
                <p className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
                  By signing up you agree to our <a href="#" className="underline" style={{ color: "var(--text-secondary)" }}>Terms</a> and <a href="#" className="underline" style={{ color: "var(--text-secondary)" }}>Privacy Policy</a>
                </p>
              </form>

              <p className="text-center mt-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="font-semibold hover:opacity-70" style={{ color: "var(--primary)" }}>Sign in</button>
              </p>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === "forgot" && (
            <>
              <button onClick={() => setMode("login")} className="flex items-center gap-1.5 text-[12px] mb-8 hover:opacity-70" style={{ color: "var(--text-muted)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                Back to sign in
              </button>

              {forgotSent ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--success)" }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <h2 className="text-[20px] font-bold mb-2" style={{ color: "var(--text)" }}>Check your email</h2>
                  <p className="text-[14px] mb-6" style={{ color: "var(--text-muted)" }}>
                    We sent a reset link to <strong style={{ color: "var(--text)" }}>{email}</strong>
                  </p>
                  <button onClick={() => { setMode("login"); setForgotSent(false); }} className="text-[13px] font-medium hover:opacity-70" style={{ color: "var(--primary)" }}>
                    Back to sign in
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-[24px] font-bold mb-1" style={{ color: "var(--text)" }}>Reset password</h1>
                  <p className="text-[14px] mb-8" style={{ color: "var(--text-muted)" }}>Enter your email and we&apos;ll send a reset link</p>
                  <form onSubmit={handleForgot} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required
                        className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none"
                        style={{ backgroundColor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
                        onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
                        onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
                      {loading
                        ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Sending…</span>
                        : "Send Reset Link"}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

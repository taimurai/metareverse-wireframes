"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg)" }}>
      {/* Left: Branding */}
      <div className="hidden lg:flex w-[480px] flex-col justify-between p-12" style={{ backgroundColor: "var(--surface)" }}>
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "var(--primary)" }}>MR</div>
            <span className="text-xl font-bold" style={{ color: "var(--text)" }}>MetaReverse</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight mb-4" style={{ color: "var(--text)" }}>
            Publish smarter.<br />Scale faster.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            The operations platform for publishers managing 100+ Meta pages.
            Bulk scheduling, cross-page analytics, revenue tracking, and threaded comments — all in one place.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
            <span className="text-2xl">📊</span>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>Cross-page revenue tracking</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Aggregate earnings across all your pages</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>Bulk upload & auto-schedule</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Upload 100 posts and space them automatically</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
            <span className="text-2xl">💬</span>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>Threaded comment queues</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Schedule sequential comments for engagement</div>
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

          {mode === "login" && (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Welcome back</h1>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Sign in to your MetaReverse account</p>

              <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border mb-4 text-sm font-medium transition-colors hover:opacity-90" style={{ backgroundColor: "#1877F2", borderColor: "#1877F2", color: "white" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Continue with Facebook
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                  <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-lg text-sm border outline-0 focus:ring-2 focus:ring-blue-500/30" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Password</label>
                    <button onClick={() => setMode("forgot")} className="text-xs font-medium" style={{ color: "var(--primary)" }}>Forgot?</button>
                  </div>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg text-sm border outline-0 focus:ring-2 focus:ring-blue-500/30" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <Link href="/">
                  <button className="w-full py-3 rounded-lg text-sm font-semibold text-white mt-2" style={{ backgroundColor: "var(--primary)" }}>
                    Sign In
                  </button>
                </Link>
              </div>

              <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
                Don&apos;t have an account?{" "}
                <button onClick={() => setMode("signup")} className="font-medium" style={{ color: "var(--primary)" }}>Sign up</button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Create your account</h1>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Start managing your Meta pages at scale</p>

              <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border mb-4 text-sm font-medium transition-colors hover:opacity-90" style={{ backgroundColor: "#1877F2", borderColor: "#1877F2", color: "white" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Sign up with Facebook
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>First Name</label>
                    <input type="text" placeholder="Taimur" className="w-full px-4 py-3 rounded-lg text-sm border outline-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Last Name</label>
                    <input type="text" placeholder="Asghar" className="w-full px-4 py-3 rounded-lg text-sm border outline-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                  <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-lg text-sm border outline-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Password</label>
                  <input type="password" placeholder="Min. 8 characters" className="w-full px-4 py-3 rounded-lg text-sm border outline-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>How many pages do you manage?</label>
                  <select className="w-full px-4 py-3 rounded-lg text-sm border outline-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}>
                    <option>1-10 pages</option>
                    <option>11-50 pages</option>
                    <option>51-100 pages</option>
                    <option>100+ pages</option>
                  </select>
                </div>
                <button className="w-full py-3 rounded-lg text-sm font-semibold text-white mt-2" style={{ backgroundColor: "var(--primary)" }}>
                  Create Account
                </button>
              </div>

              <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="font-medium" style={{ color: "var(--primary)" }}>Sign in</button>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Reset password</h1>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Enter your email and we&apos;ll send you a reset link</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                  <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-lg text-sm border outline-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <button className="w-full py-3 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--primary)" }}>
                  Send Reset Link
                </button>
              </div>

              <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
                Remember your password?{" "}
                <button onClick={() => setMode("login")} className="font-medium" style={{ color: "var(--primary)" }}>Sign in</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    section: null,
    items: [
      {
        label: "Command Center", href: "/admin",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
        exact: true,
      },
      {
        label: "Accounts", href: "/admin/accounts",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      },
      {
        label: "Billing & Revenue", href: "/admin/billing",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      },
      {
        label: "System Health", href: "/admin/system",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      },
      {
        label: "Feature Flags", href: "/admin/flags",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
      },
      {
        label: "Audit Log", href: "/admin/audit",
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
      },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-screen w-[230px] flex flex-col z-50"
        style={{ background: "var(--bg-deep)", borderRight: "1px solid var(--border)" }}
      >
        {/* Brand — Super Admin badge */}
        <div className="px-5 h-16 flex items-center gap-3 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs"
            style={{ background: "var(--primary)" }}>MR</div>
          <div>
            <div className="text-[13px] font-semibold leading-tight" style={{ color: "var(--text)" }}>MetaReverse</div>
            <div className="text-[10px] font-medium tracking-wide uppercase"
              style={{ color: "var(--primary)", background: "var(--primary-muted)", padding: "1px 6px", borderRadius: "4px", display: "inline-block", marginTop: "1px" }}>
              Super Admin
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {nav.map((group, gi) => (
            <div key={gi} className="mb-2">
              {group.section && (
                <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {group.section}
                </div>
              )}
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] font-medium transition-all"
                    style={{
                      color: active ? "var(--text)" : "var(--text-secondary)",
                      background: active ? "var(--surface-active)" : "transparent",
                    }}
                  >
                    <span style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Back to app */}
        <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <Link href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-medium w-full"
            style={{ color: "var(--text-muted)", background: "var(--surface)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Platform
          </Link>
          <div className="mt-3 px-3 py-2 rounded-lg" style={{ background: "var(--surface)" }}>
            <div className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>Taimur Mirza</div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Platform Owner</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-[230px] flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}

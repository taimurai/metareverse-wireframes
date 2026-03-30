"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    section: null,
    items: [
      { label: "Dashboard", href: "/", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      )},
      { label: "Bulk Upload", href: "/upload", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      )},
      { label: "Single Post", href: "/post", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      )},
      { label: "Queue", href: "/queue", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      )},
      { label: "Drafts", href: "/drafts", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      )},
      { label: "Failed Posts", href: "/failed-posts", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      )},
      { label: "Reports", href: "/reports", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
      ), children: [
        { label: "Overview", href: "/reports" },
        { label: "Results", href: "/reports/results" },
        { label: "Earnings", href: "/reports/earnings" },
        { label: "Batches", href: "/reports/batches" },
      ]},
    ],
  },
  {
    section: "SETTINGS",
    items: [
      { label: "Page Settings", href: "/settings/pages", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      )},
      { label: "Connected IDs", href: "/settings/connections", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      )},
      { label: "Account", href: "/settings/account", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      )},
    ],
  },
  {
    section: "WIREFRAME PAGES",
    items: [
      { label: "Login / Signup", href: "/login", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
      )},
      { label: "Onboarding", href: "/onboarding", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      )},
      { label: "Page Report", href: "/reports/page", icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      )},
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${collapsed ? "w-[68px]" : "w-[250px]"} flex flex-col z-50`}
      style={{
        backgroundColor: "var(--bg-deep)",
        borderRight: "1px solid var(--border)",
        transition: "width 0.2s ease",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ backgroundColor: "var(--primary)" }}
            >
              MR
            </div>
            <span className="font-semibold text-[15px] tracking-tight" style={{ color: "var(--text)" }}>
              MetaReverse
            </span>
          </div>
        )}
        {collapsed && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm mx-auto"
            style={{ backgroundColor: "var(--primary)" }}
          >
            MR
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pt-2">
        {navItems.map((section, si) => (
          <div key={si} className={si > 0 ? "mt-6" : ""}>
            {section.section && !collapsed && (
              <div
                className="px-3 mb-2 text-[10px] font-semibold tracking-[0.1em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                {section.section}
              </div>
            )}
            {section.section && collapsed && (
              <div className="mx-3 mb-2 border-t" style={{ borderColor: "var(--border-light)" }} />
            )}
            <div className="space-y-0.5">
              {section.items.map((item: any) => {
                const active = pathname === item.href;
                const hasChildren = item.children && !collapsed;
                const childActive = item.children?.some((c: any) => pathname === c.href);
                const isOpen = active || childActive;
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium relative group ${
                        collapsed ? "justify-center" : ""
                      }`}
                      style={{
                        color: isOpen ? "var(--primary)" : "var(--text-secondary)",
                        backgroundColor: isOpen ? "var(--primary-muted)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isOpen) {
                          e.currentTarget.style.backgroundColor = "var(--surface)";
                          e.currentTarget.style.color = "var(--text)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isOpen) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "var(--text-secondary)";
                        }
                      }}
                    >
                      {isOpen && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                      )}
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                    {hasChildren && isOpen && (
                      <div className="ml-8 mt-0.5 space-y-0.5">
                        {item.children.map((child: any) => {
                          const cActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-3 py-1.5 rounded-md text-[12px] font-medium"
                              style={{
                                color: cActive ? "var(--primary)" : "var(--text-muted)",
                                backgroundColor: cActive ? "rgba(12, 106, 255, 0.06)" : "transparent",
                              }}
                              onMouseEnter={(e) => { if (!cActive) e.currentTarget.style.color = "var(--text-secondary)"; }}
                              onMouseLeave={(e) => { if (!cActive) e.currentTarget.style.color = "var(--text-muted)"; }}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ color: "var(--text-muted)", backgroundColor: "var(--surface)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* User */}
      <div className="px-3 pb-4 pt-2">
        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${collapsed ? "justify-center" : ""}`}
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--primary), #4A9EFF)" }}
          >
            T
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>Taimur</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Owner</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

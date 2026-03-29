"use client";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Reports",
    href: "/reports",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "Queue",
    href: "/queue",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    label: "Alerts",
    href: "/failed-posts",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

export default function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#1A1A2E" }}>
      {/* Slim top bar */}
      <div
        className="flex items-center justify-between px-4 h-12 flex-shrink-0"
        style={{ backgroundColor: "#2D2D44", borderBottom: "1px solid #3A3A52" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[13px]"
            style={{ backgroundColor: "#FF6B2B" }}
          >
            M
          </div>
          <span className="text-[14px] font-semibold" style={{ color: "#F0F0F5" }}>
            MetaReverse
          </span>
        </div>
        <button style={{ color: "#9494A8" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-16">
        {children}
      </div>

      {/* Bottom nav */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around"
        style={{
          backgroundColor: "#2D2D44",
          borderTop: "1px solid #3A3A52",
          height: "64px",
          zIndex: 50,
        }}
      >
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
              style={{ color: active ? "#FF6B2B" : "#9494A8" }}
            >
              {tab.icon}
              {active && (
                <span className="text-[10px] font-semibold" style={{ color: "#FF6B2B" }}>
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

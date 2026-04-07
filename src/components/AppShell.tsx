"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileShell from "@/components/MobileShell";
import DesktopOnlyBanner from "@/components/DesktopOnlyBanner";
import { useIsMobile } from "@/hooks/useIsMobile";
import { RoleProvider } from "@/contexts/RoleContext";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/onboarding", "/admin"];

const MOBILE_ALLOWED_ROUTES = ["/", "/reports", "/reports/results", "/reports/earnings", "/reports/page", "/failed-posts"];

function isMobileAllowed(pathname: string): boolean {
  return MOBILE_ALLOWED_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(route + "/") || pathname.startsWith(route + "?");
  });
}

// Queue is view-only on mobile — allowed
const MOBILE_VIEWONLY_ROUTES = ["/queue"];

function isMobileViewOnly(pathname: string): boolean {
  return MOBILE_VIEWONLY_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isAuth = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

  // Auth routes: full-screen on both
  if (isAuth) {
    return <>{children}</>;
  }

  // Desktop: existing sidebar layout
  if (!isMobile) {
    return (
      <RoleProvider>
        <Sidebar />
        <main className="ml-[250px] min-h-screen p-8 pt-6">{children}</main>
      </RoleProvider>
    );
  }

  // Mobile: check if route is allowed or desktop-only
  const allowed = isMobileAllowed(pathname) || isMobileViewOnly(pathname);

  if (!allowed) {
    return <DesktopOnlyBanner />;
  }

  return (
    <RoleProvider>
      <MobileShell>{children}</MobileShell>
    </RoleProvider>
  );
}

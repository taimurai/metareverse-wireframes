"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="ml-[250px] min-h-screen p-8 pt-6">{children}</main>
    </>
  );
}

"use client";
import { useRouter } from "next/navigation";

export default function DesktopOnlyBanner() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: "#1A1A2E" }}>
      <div className="mb-6" style={{ color: "#9494A8" }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>
      <h2 className="text-[20px] font-bold mb-2" style={{ color: "#F0F0F5" }}>
        This feature is desktop only
      </h2>
      <p className="text-[14px] mb-8 max-w-[280px]" style={{ color: "#9494A8" }}>
        For the best experience, schedule and manage posts from your desktop.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 rounded-xl text-[14px] font-semibold text-white"
        style={{ backgroundColor: "#FF6B2B" }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}

"use client";
import StatusBadge from "./StatusBadge";

interface Page {
  id: string;
  name: string;
  category: string;
  followers: string;
  views: string;
  engagement: string;
  reach: string;
  status: "connected" | "disconnected";
  platforms: { fb: boolean; ig: boolean; threads: boolean };
  change: string;
  changeType: "up" | "down" | "neutral";
  avatar: string;
}

const mockPages: Page[] = [
  { id: "1", name: "History Uncovered", category: "History & Facts", followers: "2.4M", views: "18.2M", engagement: "4.2%", reach: "12.1M", status: "connected", platforms: { fb: true, ig: true, threads: true }, change: "+12%", changeType: "up", avatar: "HU" },
  { id: "2", name: "Daily Health Tips", category: "Health & Wellness", followers: "890K", views: "5.6M", engagement: "3.8%", reach: "4.2M", status: "connected", platforms: { fb: true, ig: true, threads: false }, change: "+8%", changeType: "up", avatar: "DH" },
  { id: "3", name: "TechByte", category: "Technology", followers: "1.2M", views: "9.1M", engagement: "2.9%", reach: "6.8M", status: "connected", platforms: { fb: true, ig: false, threads: true }, change: "-3%", changeType: "down", avatar: "TB" },
  { id: "4", name: "Fitness Factory", category: "Sports & Fitness", followers: "650K", views: "3.2M", engagement: "5.1%", reach: "2.4M", status: "connected", platforms: { fb: true, ig: true, threads: true }, change: "+22%", changeType: "up", avatar: "FF" },
  { id: "5", name: "Money Matters", category: "Finance & Money", followers: "1.8M", views: "7.4M", engagement: "2.1%", reach: "5.9M", status: "disconnected", platforms: { fb: true, ig: true, threads: false }, change: "-1%", changeType: "down", avatar: "MM" },
  { id: "6", name: "Laugh Central", category: "Humor & Memes", followers: "3.1M", views: "24.5M", engagement: "6.8%", reach: "18.2M", status: "connected", platforms: { fb: true, ig: true, threads: true }, change: "+31%", changeType: "up", avatar: "LC" },
  { id: "7", name: "Parenting Hub", category: "Parenting & Family", followers: "420K", views: "1.8M", engagement: "4.5%", reach: "1.2M", status: "connected", platforms: { fb: true, ig: false, threads: false }, change: "+5%", changeType: "up", avatar: "PH" },
];

const avatarColors = ["#FF6B2B", "#6366F1", "#EC4899", "#14B8A6", "#F59E0B", "#8B5CF6", "#06B6D4"];

export default function PageTable() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="relative flex-1 max-w-[280px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search pages..."
            className="w-full text-[13px] pl-9 pr-3 py-2 rounded-lg border outline-none"
            style={{
              backgroundColor: "var(--bg)",
              borderColor: "var(--border-light)",
              color: "var(--text)",
            }}
          />
        </div>
        <select
          className="text-[13px] px-3 py-2 rounded-lg border outline-none appearance-none pr-8"
          style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text-secondary)" }}
        >
          <option>All Categories</option>
          <option>History & Facts</option>
          <option>Health & Wellness</option>
          <option>Technology</option>
        </select>
        <select
          className="text-[13px] px-3 py-2 rounded-lg border outline-none appearance-none pr-8"
          style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-light)", color: "var(--text-secondary)" }}
        >
          <option>Sort: Views</option>
          <option>Sort: Engagement</option>
          <option>Sort: Followers</option>
          <option>Sort: Change</option>
        </select>
        <div className="ml-auto text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
          {mockPages.length} pages
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
            <th className="px-5 py-3 font-medium w-10">
              <input type="checkbox" className="rounded accent-orange-500" />
            </th>
            <th className="px-5 py-3 font-medium">Page</th>
            <th className="px-5 py-3 font-medium">Platforms</th>
            <th className="px-5 py-3 font-medium text-right">Views</th>
            <th className="px-5 py-3 font-medium text-right">Engagement</th>
            <th className="px-5 py-3 font-medium text-right">Reach</th>
            <th className="px-5 py-3 font-medium text-right">Change</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody>
          {mockPages.map((page, idx) => (
            <tr
              key={page.id}
              className="group cursor-pointer"
              style={{ borderBottom: "1px solid var(--border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <td className="px-5 py-3.5">
                <input type="checkbox" className="rounded accent-orange-500" />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}
                  >
                    {page.avatar}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: "var(--text)" }}>{page.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {page.category} &middot; {page.followers}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#1877F222", color: "#4A90D9" }}>FB</span>
                  {page.platforms.ig && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#E1306C22", color: "#E1306C" }}>IG</span>}
                  {page.platforms.threads && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--border-light)", color: "var(--text-secondary)" }}>TH</span>}
                </div>
              </td>
              <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{page.views}</td>
              <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{page.engagement}</td>
              <td className="px-5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{page.reach}</td>
              <td className="px-5 py-3.5 text-right">
                <span
                  className="text-[12px] font-semibold tabular-nums"
                  style={{ color: page.changeType === "up" ? "var(--success)" : "var(--error)" }}
                >
                  {page.change}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge status={page.status} />
              </td>
              <td className="px-5 py-3.5">
                <button
                  className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-active)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

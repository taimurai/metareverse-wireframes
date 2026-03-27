"use client";
import { useState } from "react";
import Header from "@/components/Header";
import PostPreviewModal from "@/components/modals/PostPreviewModal";
import PageBatchSelector from "@/components/PageBatchSelector";

interface QueuePost {
  id: string;
  thumbnail: string;
  caption: string;
  page: { name: string; avatar: string; color: string };
  platforms: ("fb" | "ig" | "th")[];
  scheduledAt: string;
  scheduledDate: string;
  type: "photo" | "reel" | "text";
  status: "scheduled" | "publishing" | "failed" | "draft";
  comments: string[];
}

const MOCK_QUEUE: QueuePost[] = [
  { id: "q1", thumbnail: "", caption: "The forgotten queen who ruled an empire for 40 years — yet history barely remembers her name...", page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" }, platforms: ["fb", "ig", "th"], scheduledAt: "Today, 2:30 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: ["Thread 1: She was born in a small village...", "Thread 2: By age 20, she had already..."] },
  { id: "q2", thumbnail: "", caption: "When your code works on the first try and you don't trust it 😭", page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" }, platforms: ["fb", "ig"], scheduledAt: "Today, 4:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q3", thumbnail: "", caption: "5 exercises you're doing wrong — and the simple fixes that double your results", page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" }, platforms: ["fb"], scheduledAt: "Today, 5:30 PM", scheduledDate: "Mar 27, 2026", type: "reel", status: "scheduled", comments: ["Fix #1: Squats — stop leaning forward", "Fix #2: Deadlifts — engage your lats"] },
  { id: "q4", thumbnail: "", caption: "Apple just leaked their next chip — and it's not what anyone expected", page: { name: "TechByte", avatar: "TB", color: "#14B8A6" }, platforms: ["fb", "ig", "th"], scheduledAt: "Today, 7:00 PM", scheduledDate: "Mar 27, 2026", type: "photo", status: "draft", comments: [] },
  { id: "q5", thumbnail: "", caption: "This 3,000-year-old artifact was found in a farmer's backyard. What it reveals changes everything we know about ancient trade routes.", page: { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" }, platforms: ["fb", "ig"], scheduledAt: "Tomorrow, 9:00 AM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: ["The artifact was a bronze seal...", "Archaeologists believe it proves..."] },
  { id: "q6", thumbnail: "", caption: "POV: You mass a typo in a work email and hit send before noticing", page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" }, platforms: ["fb", "ig", "th"], scheduledAt: "Tomorrow, 11:00 AM", scheduledDate: "Mar 28, 2026", type: "reel", status: "scheduled", comments: [] },
  { id: "q7", thumbnail: "", caption: "3 signs your body is telling you to drink more water — most people ignore #2", page: { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" }, platforms: ["fb"], scheduledAt: "Tomorrow, 1:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "scheduled", comments: ["Sign 1: Dark yellow urine", "Sign 2: Persistent headaches", "Sign 3: Dry skin that won't improve"] },
  { id: "q8", thumbnail: "", caption: "The $5 coffee habit is NOT why you're broke. Here's what actually matters for building wealth.", page: { name: "Money Matters", avatar: "MM", color: "#F59E0B" }, platforms: ["fb", "ig"], scheduledAt: "Tomorrow, 3:00 PM", scheduledDate: "Mar 28, 2026", type: "photo", status: "failed", comments: [] },
  { id: "q9", thumbnail: "", caption: "She was told women couldn't be scientists. She won two Nobel Prizes.", page: { name: "Know Her Name", avatar: "KH", color: "#0EA5E9" }, platforms: ["fb", "th"], scheduledAt: "Mar 29, 10:00 AM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: ["Marie Curie's early life in Warsaw...", "Her discovery of radium changed medicine forever"] },
  { id: "q10", thumbnail: "", caption: "The only 3 supplements actually backed by science — everything else is marketing", page: { name: "Fitness Factory", avatar: "FF", color: "#EC4899" }, platforms: ["fb", "ig"], scheduledAt: "Mar 29, 2:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q11", thumbnail: "", caption: "My WiFi password is stronger than most of my life decisions", page: { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" }, platforms: ["fb", "ig", "th"], scheduledAt: "Mar 29, 5:00 PM", scheduledDate: "Mar 29, 2026", type: "photo", status: "scheduled", comments: [] },
  { id: "q12", thumbnail: "", caption: "This free tool replaces 5 paid apps — and nobody is talking about it", page: { name: "TechByte", avatar: "TB", color: "#14B8A6" }, platforms: ["fb", "ig"], scheduledAt: "Mar 30, 9:00 AM", scheduledDate: "Mar 30, 2026", type: "reel", status: "scheduled", comments: ["App 1: Notion replaces Trello + Google Docs", "App 2: Figma replaces Sketch + InVision"] },
];

const platformIcons: Record<string, { label: string; color: string }> = {
  fb: { label: "FB", color: "#1877F2" },
  ig: { label: "IG", color: "#E1306C" },
  th: { label: "TH", color: "#000" },
};

const typeColors: Record<string, string> = {
  photo: "#0C6AFF",
  reel: "#EC4899",
  text: "#9494A8",
};

export default function QueuePage() {
  const [filter, setFilter] = useState<"all" | "scheduled" | "draft" | "failed">("all");
  const [selectedPage, setSelectedPage] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<QueuePost | null>(null);

  const pages = [
    { id: "all", name: "All Pages" },
    { id: "hu", name: "History Uncovered" },
    { id: "lc", name: "Laugh Central" },
    { id: "tb", name: "TechByte" },
    { id: "ff", name: "Fitness Factory" },
    { id: "dh", name: "Daily Health Tips" },
    { id: "mm", name: "Money Matters" },
    { id: "khn", name: "Know Her Name" },
  ];

  const pageIdToName: Record<string, string> = { hu: "History Uncovered", lc: "Laugh Central", tb: "TechByte", ff: "Fitness Factory", dh: "Daily Health Tips", mm: "Money Matters", khn: "Know Her Name" };
  const batchPages: Record<string, string[]> = { b1: ["lc", "ff", "dh"], b2: ["hu", "tb", "mm"], b3: ["khn"] };

  const getFilteredNames = (): string[] | null => {
    if (selectedPage === "all") return null;
    if (batchPages[selectedPage]) return batchPages[selectedPage].map(id => pageIdToName[id]);
    return [pageIdToName[selectedPage]].filter(Boolean);
  };

  const filterNames = getFilteredNames();

  const filtered = MOCK_QUEUE.filter(p => {
    if (filter !== "all" && p.status !== filter) return false;
    if (filterNames && !filterNames.includes(p.page.name)) return false;
    return true;
  });

  const matchesScope = (p: QueuePost) => !filterNames || filterNames.includes(p.page.name);

  const counts = {
    all: MOCK_QUEUE.filter(matchesScope).length,
    scheduled: MOCK_QUEUE.filter(p => p.status === "scheduled" && matchesScope(p)).length,
    draft: MOCK_QUEUE.filter(p => p.status === "draft" && matchesScope(p)).length,
    failed: MOCK_QUEUE.filter(p => p.status === "failed" && matchesScope(p)).length,
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedPosts);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedPosts(next);
  };

  const selectAll = () => {
    if (selectedPosts.size === filtered.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filtered.map(p => p.id)));
    }
  };

  // Group by date
  const grouped = filtered.reduce<Record<string, QueuePost[]>>((acc, post) => {
    const key = post.scheduledDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {});

  return (
    <div>
      <Header
        title="Queue"
        subtitle={`${counts.all} posts queued across ${new Set(MOCK_QUEUE.map(p => p.page.name)).size} pages`}
        actions={
          <div className="flex items-center gap-3">
            {selectedPosts.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                  {selectedPosts.size} selected
                </span>
                <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
                  Reschedule
                </button>
                <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>
                  Remove
                </button>
              </div>
            )}
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
              onClick={() => window.location.href = "/upload"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Posts
            </button>
          </div>
        }
      />

      {/* Filters bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
          {(["all", "scheduled", "draft", "failed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{
                backgroundColor: filter === f ? "var(--primary)" : "transparent",
                color: filter === f ? "white" : "var(--text-secondary)",
              }}
            >
              {f === "all" ? "All" : f === "scheduled" ? "Scheduled" : f === "draft" ? "Drafts" : "Failed"}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                backgroundColor: filter === f ? "rgba(255,255,255,0.2)" : "var(--surface-hover)",
                color: filter === f ? "white" : "var(--text-muted)",
              }}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Page filter */}
          <PageBatchSelector
            selected={selectedPage}
            onChange={(id) => setSelectedPage(id)}
          />

        </div>
      </div>

      {/* Queue grid header */}
      <div className="rounded-t-xl border border-b-0" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="grid items-center px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", gridTemplateColumns: "36px 3fr 120px 60px 90px 140px 60px 32px" }}>
          <div>
            <input
              type="checkbox"
              checked={selectedPosts.size === filtered.length && filtered.length > 0}
              onChange={selectAll}
              className="rounded"
              style={{ accentColor: "var(--primary)" }}
            />
          </div>
          <div>Post</div>
          <div>Page</div>
          <div>To</div>
          <div>Status</div>
          <div>Scheduled</div>
          <div>Threads</div>
          <div></div>
        </div>
      </div>

      {/* Queue rows grouped by date */}
      <div className="rounded-b-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ backgroundColor: "var(--surface)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--primary-muted)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3 className="text-[16px] font-semibold mb-1" style={{ color: "var(--text)" }}>No posts in queue</h3>
            <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>Upload content or create a single post to get started</p>
            <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
              Go to Bulk Upload
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([date, posts]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{date}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>{posts.length}</span>
              </div>

              {posts.map((post) => (
                <div key={post.id}>
                  <div
                    className="grid items-center px-4 py-3 border-b transition-all cursor-pointer"
                    style={{
                      backgroundColor: selectedPosts.has(post.id) ? "var(--primary-muted)" : dragOverId === post.id ? "var(--surface-hover)" : "var(--surface)",
                      borderColor: "var(--border)",
                      gridTemplateColumns: "36px 3fr 120px 60px 90px 140px 60px 32px",
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOverId(post.id); }}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={() => setDragOverId(null)}
                    onClick={() => setPreviewPost(post)}
                  >
                    {/* Checkbox */}
                    <div onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedPosts.has(post.id)}
                        onChange={() => toggleSelect(post.id)}
                        style={{ accentColor: "var(--primary)" }}
                      />
                    </div>

                    {/* Post: type emoji + thumbnail + caption */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[16px] shrink-0">{post.type === "photo" ? "📷" : post.type === "reel" ? "🎬" : "📝"}</span>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: "var(--surface-hover)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <p className="text-[12px] font-medium truncate" style={{ color: "var(--text)" }}>
                        {post.caption}
                      </p>
                    </div>

                    {/* Page */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: post.page.color }}>
                        {post.page.avatar}
                      </div>
                      <span className="text-[11px] font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                        {post.page.name}
                      </span>
                    </div>

                    {/* Platforms — icon logos */}
                    <div className="flex items-center gap-1.5">
                      {post.platforms.map(p => (
                        <span key={p} title={platformIcons[p].label}>
                          {p === "fb" && <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                          {p === "ig" && <svg width="16" height="16" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                          {p === "th" && <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.181 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-5.602.04-8.196 3.2-8.257 8.358v.457c.504 5.07 3.278 7.957 8.254 7.957h.023c2.627-.02 4.643-.64 6.163-1.898.93-.77 1.614-1.742 2.033-2.89l1.98.676c-.56 1.54-1.46 2.82-2.674 3.803C18.14 23.02 15.478 23.978 12.186 24z"/><path d="M12.167 17.053c-3.091 0-5.15-2.514-5.15-5.053 0-2.54 2.059-5.054 5.15-5.054 3.092 0 5.15 2.514 5.15 5.054 0 2.539-2.058 5.053-5.15 5.053zm0-8.14c-1.843 0-3.183 1.394-3.183 3.087 0 1.693 1.34 3.087 3.183 3.087 1.844 0 3.184-1.394 3.184-3.087 0-1.693-1.34-3.087-3.184-3.087z"/></svg>}
                        </span>
                      ))}
                    </div>

                    {/* Status */}
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 w-fit" style={{
                        backgroundColor: post.status === "scheduled" ? "var(--success-bg)" : post.status === "failed" ? "var(--error-bg)" : post.status === "draft" ? "var(--warning-bg)" : "var(--primary-muted)",
                        color: post.status === "scheduled" ? "var(--success)" : post.status === "failed" ? "var(--error)" : post.status === "draft" ? "var(--warning)" : "var(--primary)",
                      }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{
                          backgroundColor: post.status === "scheduled" ? "var(--success)" : post.status === "failed" ? "var(--error)" : post.status === "draft" ? "var(--warning)" : "var(--primary)",
                        }} />
                        {post.status}
                      </span>
                    </div>

                    {/* Schedule time */}
                    <div className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                      {post.scheduledAt}
                    </div>

                    {/* Thread comments count */}
                    <div className="flex items-center gap-1">
                      {post.comments.length > 0 ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          {post.comments.length}
                        </span>
                      ) : (
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </div>

                    {/* Drag handle */}
                    <div
                      draggable
                      className="cursor-grab active:cursor-grabbing flex items-center justify-center"
                      onClick={e => e.stopPropagation()}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                        <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                        <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                        <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                      </svg>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Post Preview Modal */}
      {previewPost && (
        <PostPreviewModal post={previewPost} onClose={() => setPreviewPost(null)} />
      )}

      {/* Queue summary bar */}
      <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{counts.scheduled} scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--warning)" }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{counts.draft} drafts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--error)" }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{counts.failed} failed</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Next publish:</span>
          <span className="text-[12px] font-semibold" style={{ color: "var(--primary)" }}>Today, 2:30 PM</span>
        </div>
      </div>
    </div>
  );
}

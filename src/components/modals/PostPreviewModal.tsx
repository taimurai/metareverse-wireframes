"use client";
import { useState } from "react";
import Modal from "../Modal";

interface PostData {
  id: string;
  thumbnail: string;
  caption: string;
  page: { name: string; avatar: string; color: string };
  platforms: ("fb" | "ig" | "th")[];
  scheduledAt: string;
  scheduledDate: string;
  type: "photo" | "reel" | "text";
  status: "scheduled" | "publishing" | "failed" | "draft" | "published";
  comments: string[];
}

const platformLabels: Record<string, { label: string; color: string; full: string }> = {
  fb: { label: "FB", color: "#1877F2", full: "Facebook" },
  ig: { label: "IG", color: "#E1306C", full: "Instagram" },
  th: { label: "TH", color: "#000", full: "Threads" },
};

const typeColors: Record<string, string> = {
  photo: "#0C6AFF",
  reel: "#EC4899",
  text: "#9494A8",
};

export default function PostPreviewModal({ post, onClose }: { post: PostData; onClose: () => void }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [activeTab, setActiveTab] = useState<"preview" | "comments" | "settings">("preview");
  const [previewPlatform, setPreviewPlatform] = useState<"fb" | "ig" | "th">(post.platforms[0] || "fb");

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment("");
    }
  };

  return (
    <Modal open={true} title="" onClose={onClose}>
      <div style={{ margin: "-24px -24px 0" }}>
        {/* Header with page info */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ backgroundColor: post.page.color }}>
              {post.page.avatar}
            </div>
            <div>
              <span className="text-[14px] font-semibold block" style={{ color: "var(--text)" }}>{post.page.name}</span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{post.scheduledAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{
              backgroundColor: post.status === "scheduled" ? "var(--success-bg)" : post.status === "failed" ? "var(--error-bg)" : "var(--warning-bg)",
              color: post.status === "scheduled" ? "var(--success)" : post.status === "failed" ? "var(--error)" : "var(--warning)",
            }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{
                backgroundColor: post.status === "scheduled" ? "var(--success)" : post.status === "failed" ? "var(--error)" : "var(--warning)",
              }} />
              {post.status}
            </span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md uppercase" style={{
              backgroundColor: `${typeColors[post.type]}15`,
              color: typeColors[post.type],
            }}>
              {post.type}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b" style={{ borderColor: "var(--border)" }}>
          {(["preview", "comments", "settings"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-3 text-[12px] font-medium relative"
              style={{ color: activeTab === tab ? "var(--primary)" : "var(--text-muted)" }}
            >
              {tab === "preview" ? "Preview" : tab === "comments" ? `Comments (${comments.length})` : "Settings"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "var(--primary)" }} />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {activeTab === "preview" && (
            <div>
              {/* Platform preview tabs */}
              <div className="flex items-center gap-1 mb-4 p-1 rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
                {post.platforms.map(p => (
                  <button
                    key={p}
                    onClick={() => setPreviewPlatform(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all"
                    style={{
                      backgroundColor: previewPlatform === p ? platformLabels[p].color : "transparent",
                      color: previewPlatform === p ? "white" : "var(--text-muted)",
                    }}
                  >
                    {platformLabels[p].full}
                  </button>
                ))}
              </div>

              {/* Facebook-style preview */}
              {previewPlatform === "fb" && (
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#242526", border: "1px solid #3a3b3c" }}>
                  {/* FB Header */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: post.page.color }}>
                      {post.page.avatar}
                    </div>
                    <div>
                      <span className="text-[14px] font-semibold block" style={{ color: "#e4e6eb" }}>{post.page.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[12px]" style={{ color: "#b0b3b8" }}>{post.scheduledAt}</span>
                        <span className="text-[12px]" style={{ color: "#b0b3b8" }}>·</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#b0b3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#b0b3b8"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="px-4 pb-3">
                    <p className="text-[14px] leading-[20px]" style={{ color: "#e4e6eb" }}>{post.caption}</p>
                  </div>

                  {/* Image */}
                  <div className="w-full aspect-[4/3] flex items-center justify-center" style={{ backgroundColor: "#3a3b3c" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b0b3b8" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>

                  {/* Reactions bar */}
                  <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid #3a3b3c" }}>
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: "#1877F2" }}>👍</span>
                        <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: "#ED4956" }}>❤️</span>
                      </div>
                      <span className="text-[13px] ml-1" style={{ color: "#b0b3b8" }}>Preview</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px]" style={{ color: "#b0b3b8" }}>0 Comments</span>
                      <span className="text-[13px]" style={{ color: "#b0b3b8" }}>0 Shares</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-around px-4 py-2">
                    {["👍 Like", "💬 Comment", "↗️ Share"].map(action => (
                      <span key={action} className="text-[14px] font-medium py-1.5 px-4 rounded-md" style={{ color: "#b0b3b8" }}>{action}</span>
                    ))}
                  </div>

                  {/* Thread preview */}
                  {comments.length > 0 && (
                    <div className="px-4 py-3" style={{ borderTop: "1px solid #3a3b3c" }}>
                      <span className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#b0b3b8" }}>Threaded Comments Preview</span>
                      {comments.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 mt-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ backgroundColor: post.page.color }}>
                            {post.page.avatar}
                          </div>
                          <div className="px-3 py-2 rounded-2xl" style={{ backgroundColor: "#3a3b3c" }}>
                            <span className="text-[12px] font-semibold block" style={{ color: "#e4e6eb" }}>{post.page.name}</span>
                            <span className="text-[13px]" style={{ color: "#e4e6eb" }}>{c}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Instagram-style preview */}
              {previewPlatform === "ig" && (
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#000", border: "1px solid #262626" }}>
                  {/* IG Header */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: post.page.color, border: "2px solid #c13584" }}>
                      {post.page.avatar}
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: "#f5f5f5" }}>{post.page.name.toLowerCase().replace(/\s+/g, '')}</span>
                    <div className="ml-auto">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#f5f5f5"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="w-full aspect-square flex items-center justify-center" style={{ backgroundColor: "#1a1a1a" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>

                  {/* Action icons */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </div>

                  {/* Caption */}
                  <div className="px-4 pb-3">
                    <p className="text-[13px] leading-[18px]">
                      <span className="font-semibold mr-1" style={{ color: "#f5f5f5" }}>{post.page.name.toLowerCase().replace(/\s+/g, '')}</span>
                      <span style={{ color: "#f5f5f5" }}>{post.caption}</span>
                    </p>
                  </div>

                  {/* Comments */}
                  {comments.length > 0 && (
                    <div className="px-4 pb-3">
                      <span className="text-[13px] mb-2 block" style={{ color: "#a8a8a8" }}>View all {comments.length} comments</span>
                      {comments.slice(0, 2).map((c, i) => (
                        <p key={i} className="text-[13px] leading-[18px] mt-1">
                          <span className="font-semibold mr-1" style={{ color: "#f5f5f5" }}>{post.page.name.toLowerCase().replace(/\s+/g, '')}</span>
                          <span style={{ color: "#f5f5f5" }}>{c}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="px-4 pb-3">
                    <span className="text-[11px] uppercase" style={{ color: "#a8a8a8" }}>{post.scheduledAt}</span>
                  </div>
                </div>
              )}

              {/* Threads-style preview */}
              {previewPlatform === "th" && (
                <div className="rounded-xl overflow-hidden p-4" style={{ backgroundColor: "#101010", border: "1px solid #333" }}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: post.page.color }}>
                        {post.page.avatar}
                      </div>
                      {comments.length > 0 && <div className="w-[2px] flex-1 mt-2 rounded-full" style={{ backgroundColor: "#333" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold" style={{ color: "#f5f5f5" }}>{post.page.name.toLowerCase().replace(/\s+/g, '')}</span>
                        <span className="text-[12px]" style={{ color: "#777" }}>{post.scheduledAt}</span>
                      </div>
                      <p className="text-[14px] leading-[20px] mt-1" style={{ color: "#f5f5f5" }}>{post.caption}</p>

                      {post.type !== "text" && (
                        <div className="w-full aspect-[4/3] rounded-xl mt-3 flex items-center justify-center" style={{ backgroundColor: "#1a1a1a" }}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-5 mt-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Thread replies */}
                  {comments.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: post.page.color }}>
                          {post.page.avatar}
                        </div>
                        {i < comments.length - 1 && <div className="w-[2px] flex-1 mt-2 rounded-full" style={{ backgroundColor: "#333" }} />}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold" style={{ color: "#f5f5f5" }}>{post.page.name.toLowerCase().replace(/\s+/g, '')}</span>
                        </div>
                        <p className="text-[14px] leading-[20px] mt-0.5" style={{ color: "#f5f5f5" }}>{c}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Schedule bar below preview */}
              <div className="flex items-center gap-3 p-3 rounded-lg mt-4" style={{ backgroundColor: "var(--surface)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{post.scheduledAt}</span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>·</span>
                <div className="flex items-center gap-1">
                  {post.platforms.map(p => (
                    <span key={p} className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${platformLabels[p].color}20`, color: platformLabels[p].color }}>
                      {platformLabels[p].label}
                    </span>
                  ))}
                </div>
                <button className="ml-auto text-[11px] font-medium" style={{ color: "var(--primary)" }}>Change</button>
              </div>

              {/* Thread count */}
              {comments.length > 0 && (
                <button onClick={() => setActiveTab("comments")} className="flex items-center gap-2 w-full p-3 rounded-lg mt-2 text-left" style={{ backgroundColor: "var(--primary-muted)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span className="text-[12px] font-medium" style={{ color: "var(--primary)" }}>{comments.length} threaded comments</span>
                  <span className="ml-auto text-[11px]" style={{ color: "var(--primary)" }}>Manage →</span>
                </button>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Threaded Comments</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Comments will be posted sequentially under the main post</p>
                </div>
              </div>

              {/* Comment list */}
              <div className="space-y-2 mb-4">
                {comments.map((comment, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg group" style={{ backgroundColor: "var(--surface)" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--text)" }}>{comment}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Edit</button>
                        <button className="text-[10px] font-medium" style={{ color: "var(--error)" }} onClick={() => setComments(comments.filter((_, j) => j !== i))}>Delete</button>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>•</span>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Posts as comment #{i + 1}</span>
                      </div>
                    </div>
                    <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" draggable>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                        <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                        <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                        <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addComment()}
                  placeholder="Type a threaded comment..."
                  className="flex-1 px-4 py-3 rounded-xl text-[12px] border outline-none"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                />
                <button
                  onClick={addComment}
                  className="px-4 py-3 rounded-xl text-[12px] font-semibold text-white shrink-0"
                  style={{ backgroundColor: "var(--primary)", opacity: newComment.trim() ? 1 : 0.4 }}
                >
                  Add
                </button>
              </div>

              {comments.length === 0 && (
                <div className="flex flex-col items-center py-8">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }} className="mb-3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <p className="text-[13px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>No threaded comments yet</p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Add comments to create an engagement thread under this post</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-5">
              {/* First comment scheduling */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>First Comment Delay</label>
                <select className="w-full px-4 py-3 rounded-xl text-[12px] border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}>
                  <option>Immediately after post</option>
                  <option>1 minute after post</option>
                  <option>5 minutes after post</option>
                  <option>15 minutes after post</option>
                </select>
              </div>

              {/* Comment interval */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Comment Interval</label>
                <select className="w-full px-4 py-3 rounded-xl text-[12px] border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}>
                  <option>30 seconds between comments</option>
                  <option>1 minute between comments</option>
                  <option>2 minutes between comments</option>
                  <option>5 minutes between comments</option>
                </select>
              </div>

              {/* Cross-post settings */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-3 block" style={{ color: "var(--text-muted)" }}>Cross-post Threads</label>
                <div className="space-y-3">
                  {post.platforms.map(p => (
                    <div key={p} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: platformLabels[p].color }} />
                        <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{platformLabels[p].full}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-8 h-[18px] rounded-full peer peer-checked:after:translate-x-[14px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-[14px] after:w-[14px] after:transition-all" style={{ backgroundColor: "var(--surface-hover)" }}>
                          <div className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full transition-transform" style={{ backgroundColor: "var(--primary)" }} />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[12px] font-medium block" style={{ color: "var(--text)" }}>Remove from queue</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>This will unschedule the post but keep it as a draft</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>
                    Unschedule
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
            Close
          </button>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg text-[12px] font-medium border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Edit Post
            </button>
            <button className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white" style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

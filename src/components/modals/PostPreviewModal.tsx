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
  status: "scheduled" | "publishing" | "failed" | "draft";
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
              {/* Media preview */}
              <div className="w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "var(--surface-hover)" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>

              {/* Caption */}
              <div className="mb-5">
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Caption</label>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text)" }}>{post.caption}</p>
              </div>

              {/* Publishing to */}
              <div className="mb-5">
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Publishing to</label>
                <div className="flex items-center gap-2">
                  {post.platforms.map(p => (
                    <span key={p} className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{
                      backgroundColor: `${platformLabels[p].color}15`,
                      color: platformLabels[p].color,
                    }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: platformLabels[p].color }} />
                      {platformLabels[p].full}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>Schedule</label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{post.scheduledAt}</span>
                  <button className="ml-auto text-[11px] font-medium" style={{ color: "var(--primary)" }}>Change</button>
                </div>
              </div>

              {/* Quick thread preview */}
              {comments.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Thread ({comments.length} comments)</label>
                    <button onClick={() => setActiveTab("comments")} className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>Manage →</button>
                  </div>
                  <div className="space-y-1">
                    {comments.slice(0, 2).map((c, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>{i + 1}</span>
                        <span className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>{c}</span>
                      </div>
                    ))}
                    {comments.length > 2 && (
                      <button onClick={() => setActiveTab("comments")} className="text-[11px] font-medium pl-8" style={{ color: "var(--text-muted)" }}>
                        +{comments.length - 2} more...
                      </button>
                    )}
                  </div>
                </div>
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

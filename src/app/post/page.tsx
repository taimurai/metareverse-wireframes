"use client";
import { useState } from "react";
import Header from "@/components/Header";
import PostPreviewModal from "@/components/modals/PostPreviewModal";
import PageBatchSelector from "@/components/PageBatchSelector";

type PostType = "photo" | "reel" | "text";

const pages = [
  { id: "hu", name: "History Uncovered", avatar: "HU", color: "#FF6B2B", platforms: ["fb", "ig", "th"] },
  { id: "lc", name: "Laugh Central", avatar: "LC", color: "#8B5CF6", platforms: ["fb", "ig"] },
  { id: "tb", name: "TechByte", avatar: "TB", color: "#14B8A6", platforms: ["fb", "ig", "th"] },
  { id: "ff", name: "Fitness Factory", avatar: "FF", color: "#EC4899", platforms: ["fb"] },
  { id: "dh", name: "Daily Health Tips", avatar: "DH", color: "#6366F1", platforms: ["fb"] },
  { id: "mm", name: "Money Matters", avatar: "MM", color: "#F59E0B", platforms: ["fb", "ig"] },
  { id: "khn", name: "Know Her Name", avatar: "KH", color: "#0EA5E9", platforms: ["fb", "th"] },
];

const CAPTION_LIMITS: Record<string, number> = { fb: 63206, ig: 2200, th: 500 };

export default function SinglePostPage() {
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [postType, setPostType] = useState<PostType>("photo");
  const [caption, setCaption] = useState("");
  const [publishTo, setPublishTo] = useState<Record<string, boolean>>({ fb: true, ig: true, th: true });
  const [scheduleType, setScheduleType] = useState<"now" | "schedule">("schedule");
  const [scheduleDate, setScheduleDate] = useState("2026-03-28");
  const [scheduleTime, setScheduleTime] = useState("14:30");
  const [threadComments, setThreadComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [mediaUploaded, setMediaUploaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activePlatforms = Object.entries(publishTo).filter(([k, v]) => v && selectedPage.platforms.includes(k)).map(([k]) => k);
  const minLimit = Math.min(...activePlatforms.map(p => CAPTION_LIMITS[p] || 99999));
  const captionOverLimit = caption.length > minLimit;

  const addComment = () => {
    if (newComment.trim()) {
      setThreadComments([...threadComments, newComment.trim()]);
      setNewComment("");
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (postType !== "text" && !mediaUploaded) errs.media = "Upload an image or video";
    if (!caption.trim()) errs.caption = "Caption is required";
    if (captionOverLimit) errs.caption = `Caption exceeds ${minLimit} character limit`;
    if (activePlatforms.length === 0) errs.platforms = "Select at least one platform";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Would submit to queue
    }
  };

  return (
    <div>
      <Header
        title="Create Post"
        subtitle="Compose and schedule a single post"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {scheduleType === "now" ? "Publish Now" : "Add to Queue"}
            </button>
          </div>
        }
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* Left: Main editor */}
        <div className="space-y-5">

          {/* Page selector */}
          <div className="flex items-center gap-4">
            <label className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>Publishing as</label>
            <PageBatchSelector
              mode="page-only"
              selected={selectedPage.id}
              onChange={(id) => {
                const found = pages.find(p => p.id === id);
                if (found) setSelectedPage(found);
              }}
            />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Connected: {selectedPage.platforms.map(p => p.toUpperCase()).join(" + ")}
              </span>
            </div>
          </div>

          {/* Post type selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: "var(--surface)" }}>
            {(["photo", "reel", "text"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setPostType(t); if (t === "text") setMediaUploaded(false); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium capitalize transition-all"
                style={{
                  backgroundColor: postType === t ? "var(--primary)" : "transparent",
                  color: postType === t ? "white" : "var(--text-secondary)",
                }}
              >
                {t === "photo" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                {t === "reel" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
                {t === "text" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                {t}
              </button>
            ))}
          </div>

          {/* Media upload */}
          {postType !== "text" && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: errors.media ? "var(--error)" : "var(--border)" }}>
              {!mediaUploaded ? (
                <div
                  onClick={() => setMediaUploaded(true)}
                  className="flex flex-col items-center justify-center py-16 cursor-pointer transition-all hover:brightness-110"
                  style={{ backgroundColor: "var(--surface)", borderStyle: "dashed" }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--primary-muted)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <span className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>
                    {postType === "photo" ? "Upload Image" : "Upload Video"}
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {postType === "photo" ? "JPG, PNG, GIF — max 10MB" : "MP4, MOV — max 100MB"}
                  </span>
                  {errors.media && <span className="text-[11px] mt-2" style={{ color: "var(--error)" }}>{errors.media}</span>}
                </div>
              ) : (
                <div className="relative">
                  <div className="w-full aspect-[16/9] flex items-center justify-center" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--text-muted)" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <button
                    onClick={() => setMediaUploaded(false)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "white" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase" style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "white" }}>
                    {postType}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Caption */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: errors.caption ? "var(--error)" : "var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Caption</label>
              <span className="text-[11px] font-medium" style={{ color: captionOverLimit ? "var(--error)" : "var(--text-muted)" }}>
                {caption.length.toLocaleString()} / {minLimit.toLocaleString()}
                {activePlatforms.length > 1 && (
                  <span className="ml-1" style={{ color: "var(--text-muted)" }}>
                    (limited by {activePlatforms.find(p => CAPTION_LIMITS[p] === minLimit)?.toUpperCase()})
                  </span>
                )}
              </span>
            </div>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write your caption..."
              rows={5}
              className="w-full bg-transparent border-none outline-none resize-none text-[13px] leading-relaxed"
              style={{ color: "var(--text)" }}
            />
            {errors.caption && <span className="text-[11px] mt-1 block" style={{ color: "var(--error)" }}>{errors.caption}</span>}
          </div>

          {/* Thread comments */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Threaded Comments</label>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>Posted sequentially as comments under your post</p>
              </div>
              {threadComments.length > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
                  {threadComments.length} comment{threadComments.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Existing comments */}
            {threadComments.length > 0 && (
              <div className="space-y-2 mb-3">
                {threadComments.map((comment, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg group" style={{ backgroundColor: "var(--bg)" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5" style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)" }}>
                      {i + 1}
                    </div>
                    <p className="text-[12px] flex-1 leading-relaxed" style={{ color: "var(--text)" }}>{comment}</p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: "var(--text-muted)" }}>Edit</button>
                      <button
                        onClick={() => setThreadComments(threadComments.filter((_, j) => j !== i))}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ color: "var(--error)" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment input */}
            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addComment()}
                placeholder="Add a threaded comment..."
                className="flex-1 px-4 py-2.5 rounded-xl text-[12px] border outline-none"
                style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
              <button
                onClick={addComment}
                className="px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white shrink-0"
                style={{ backgroundColor: "var(--primary)", opacity: newComment.trim() ? 1 : 0.4 }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Right: Sidebar controls */}
        <div className="space-y-4">

          {/* Publish to */}
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: errors.platforms ? "var(--error)" : "var(--border)" }}>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-3 block" style={{ color: "var(--text-muted)" }}>Publish to</label>
            <div className="space-y-2.5">
              {[
                { id: "fb", label: "Facebook", color: "#1877F2", always: true },
                { id: "ig", label: "Instagram", color: "#E1306C" },
                { id: "th", label: "Threads", color: "#999" },
              ].map(p => {
                const available = selectedPage.platforms.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${!available ? "opacity-30 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: publishTo[p.id] && available ? `${p.color}10` : "var(--bg)" }}
                  >
                    <input
                      type="checkbox"
                      checked={publishTo[p.id] && available}
                      onChange={e => !p.always && available && setPublishTo({ ...publishTo, [p.id]: e.target.checked })}
                      disabled={p.always || !available}
                      style={{ accentColor: p.color }}
                    />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{p.label}</span>
                    {p.always && <span className="text-[9px] ml-auto px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>Always on</span>}
                    {!available && <span className="text-[9px] ml-auto" style={{ color: "var(--text-muted)" }}>Not connected</span>}
                  </label>
                );
              })}
            </div>
            {errors.platforms && <span className="text-[11px] mt-2 block" style={{ color: "var(--error)" }}>{errors.platforms}</span>}
          </div>

          {/* Schedule */}
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-3 block" style={{ color: "var(--text-muted)" }}>Schedule</label>
            <div className="flex items-center gap-1 p-1 rounded-lg mb-3" style={{ backgroundColor: "var(--bg)" }}>
              {(["schedule", "now"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setScheduleType(s)}
                  className="flex-1 py-2 rounded-md text-[11px] font-medium capitalize"
                  style={{
                    backgroundColor: scheduleType === s ? "var(--primary)" : "transparent",
                    color: scheduleType === s ? "white" : "var(--text-muted)",
                  }}
                >
                  {s === "schedule" ? "Schedule" : "Publish Now"}
                </button>
              ))}
            </div>
            {scheduleType === "schedule" && (
              <div className="space-y-2">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-[12px] border outline-none"
                  style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)", colorScheme: "dark" }}
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-[12px] border outline-none"
                  style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)", colorScheme: "dark" }}
                />
              </div>
            )}
            {scheduleType === "now" && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: "var(--warning-bg)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--warning)" }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span className="text-[11px]" style={{ color: "var(--warning)" }}>Will publish immediately when submitted</span>
              </div>
            )}
          </div>

          {/* Thread settings */}
          {threadComments.length > 0 && (
            <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-3 block" style={{ color: "var(--text-muted)" }}>Thread Settings</label>
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] mb-1.5 block" style={{ color: "var(--text-secondary)" }}>First comment delay</span>
                  <select className="w-full px-3 py-2 rounded-lg text-[12px] border" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                    <option>Immediately</option>
                    <option>1 minute</option>
                    <option>5 minutes</option>
                    <option>15 minutes</option>
                  </select>
                </div>
                <div>
                  <span className="text-[11px] mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Between comments</span>
                  <select className="w-full px-3 py-2 rounded-lg text-[12px] border" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                    <option>30 seconds</option>
                    <option>1 minute</option>
                    <option>2 minutes</option>
                    <option>5 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnail selector (reels only) */}
          {postType === "reel" && mediaUploaded && (
            <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-3 block" style={{ color: "var(--text-muted)" }}>Thumbnail</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="aspect-[9/16] rounded-lg flex items-center justify-center cursor-pointer border-2 transition-all"
                    style={{
                      backgroundColor: "var(--surface-hover)",
                      borderColor: i === 1 ? "var(--primary)" : "transparent",
                    }}
                  >
                    <span className="text-[9px] font-medium" style={{ color: "var(--text-muted)" }}>Frame {i}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-2 py-2 rounded-lg text-[11px] font-medium border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                Upload Custom
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--primary-muted)" }}>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Page</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>{selectedPage.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Type</span>
                <span className="font-medium capitalize" style={{ color: "var(--text)" }}>{postType}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Platforms</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>{activePlatforms.map(p => p.toUpperCase()).join(", ") || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Schedule</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>{scheduleType === "now" ? "Immediately" : `${scheduleDate} ${scheduleTime}`}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Threads</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>{threadComments.length} comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PostPreviewModal
          post={{
            id: "preview",
            thumbnail: "",
            caption: caption || "Your caption will appear here...",
            page: { name: selectedPage.name, avatar: selectedPage.avatar, color: selectedPage.color },
            platforms: activePlatforms as ("fb" | "ig" | "th")[],
            scheduledAt: scheduleType === "now" ? "Now" : `${scheduleDate} ${scheduleTime}`,
            scheduledDate: scheduleDate,
            type: postType,
            status: "draft",
            comments: threadComments,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

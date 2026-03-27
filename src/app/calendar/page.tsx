"use client";
import { useState } from "react";
import Header from "@/components/Header";
import PostPreviewModal from "@/components/modals/PostPreviewModal";

interface CalendarPost {
  id: string;
  caption: string;
  page: { name: string; avatar: string; color: string };
  platforms: ("fb" | "ig" | "th")[];
  time: string;
  type: "photo" | "reel" | "text";
  status: "scheduled" | "draft" | "failed" | "published";
  comments: string[];
}

// Generate calendar posts spread across the month
function getCalendarPosts(): Record<string, CalendarPost[]> {
  const posts: Record<string, CalendarPost[]> = {};
  const pages = [
    { name: "History Uncovered", avatar: "HU", color: "#FF6B2B" },
    { name: "Laugh Central", avatar: "LC", color: "#8B5CF6" },
    { name: "TechByte", avatar: "TB", color: "#14B8A6" },
    { name: "Fitness Factory", avatar: "FF", color: "#EC4899" },
    { name: "Daily Health Tips", avatar: "DH", color: "#6366F1" },
    { name: "Money Matters", avatar: "MM", color: "#F59E0B" },
    { name: "Know Her Name", avatar: "KH", color: "#0EA5E9" },
  ];
  const captions = [
    "The forgotten queen who ruled an empire for 40 years",
    "When your code works on the first try 😭",
    "5 exercises you're doing wrong — and the fixes",
    "Apple just leaked their next chip",
    "3 signs your body needs more water",
    "The $5 coffee habit is NOT why you're broke",
    "She was told women couldn't be scientists",
    "This free tool replaces 5 paid apps",
    "POV: You mass a typo in a work email",
    "The only 3 supplements backed by science",
    "A 3,000-year-old artifact found in a backyard",
    "My WiFi password is stronger than my life decisions",
    "Mark Spitz shaved his mustache in a locked room",
    "In China's Jilin province, seven dogs escaped",
    "Spending time alone is often misunderstood",
  ];
  const times = ["8:00 AM", "9:30 AM", "11:00 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM", "9:00 PM"];
  const types: ("photo" | "reel" | "text")[] = ["photo", "photo", "photo", "reel", "photo", "photo", "reel", "photo", "photo"];

  let idx = 0;
  for (let d = 1; d <= 31; d++) {
    const key = `2026-03-${String(d).padStart(2, "0")}`;
    const count = d <= 26 ? (d % 3 === 0 ? 4 : d % 2 === 0 ? 3 : 2) : (d % 2 === 0 ? 2 : 1);
    const dayPosts: CalendarPost[] = [];
    for (let i = 0; i < count; i++) {
      const page = pages[(idx + i) % pages.length];
      const isPast = d <= 27;
      dayPosts.push({
        id: `cal-${d}-${i}`,
        caption: captions[(idx + i) % captions.length],
        page,
        platforms: i % 3 === 0 ? ["fb", "ig", "th"] : i % 2 === 0 ? ["fb", "ig"] : ["fb"],
        time: times[(idx + i) % times.length],
        type: types[(idx + i) % types.length],
        status: isPast ? "published" : d === 28 ? "scheduled" : "scheduled",
        comments: i % 2 === 0 ? ["Thread comment 1", "Thread comment 2"] : [],
      });
    }
    posts[key] = dayPosts;
    idx += count;
  }
  return posts;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const typeColors: Record<string, string> = { photo: "#0C6AFF", reel: "#EC4899", text: "#9494A8" };

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [view, setView] = useState<"month" | "week">("month");
  const [selectedPage, setSelectedPage] = useState("all");
  const [previewPost, setPreviewPost] = useState<CalendarPost | null>(null);
  const [dragPost, setDragPost] = useState<{ post: CalendarPost; fromDate: string } | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const calendarPosts = getCalendarPosts();

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

  // Build calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays: { day: number; month: "prev" | "current" | "next"; dateKey: string }[] = [];

  // Previous month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarDays.push({ day: d, month: "prev", dateKey: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, month: "current", dateKey: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }

  // Next month padding
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    calendarDays.push({ day: d, month: "next", dateKey: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const today = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-28`;

  const getPostsForDate = (dateKey: string) => {
    const dayPosts = calendarPosts[dateKey] || [];
    if (selectedPage === "all") return dayPosts;
    return dayPosts.filter(p => p.page.name === pageIdToName[selectedPage]);
  };

  const totalScheduled = Object.values(calendarPosts).flat().filter(p => p.status === "scheduled").length;
  const totalPublished = Object.values(calendarPosts).flat().filter(p => p.status === "published").length;

  // Week view: get current week
  const todayDate = 28;
  const todayDayOfWeek = new Date(2026, 2, 28).getDay();
  const weekStart = todayDate - todayDayOfWeek;
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = weekStart + i;
    if (d < 1 || d > 31) return null;
    return { day: d, dateKey: `2026-03-${String(d).padStart(2, "0")}` };
  }).filter(Boolean) as { day: number; dateKey: string }[];

  return (
    <div>
      <Header
        title="Calendar"
        subtitle={`${totalScheduled} scheduled · ${totalPublished} published this month`}
        actions={
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 14px var(--primary-glow)" }}
            onClick={() => window.location.href = "/upload"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Posts
          </button>
        }
      />

      {/* Controls bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Month navigation */}
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="text-[15px] font-semibold px-3 min-w-[160px] text-center" style={{ color: "var(--text)" }}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <button
            onClick={() => { setCurrentMonth(2); setCurrentYear(2026); }}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium"
            style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center p-1 rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
            {(["month", "week"] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 py-1.5 rounded-md text-[11px] font-medium capitalize"
                style={{
                  backgroundColor: view === v ? "var(--primary)" : "transparent",
                  color: view === v ? "white" : "var(--text-muted)",
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Page filter */}
          <select
            value={selectedPage}
            onChange={e => setSelectedPage(e.target.value)}
            className="px-3 py-2 rounded-lg text-[12px] font-medium border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
          >
            {pages.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Month view */}
      {view === "month" && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {/* Weekday headers */}
          <div className="grid grid-cols-7">
            {WEEKDAYS.map(day => (
              <div key={day} className="px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((cell, i) => {
              const dayPosts = getPostsForDate(cell.dateKey);
              const isToday = cell.dateKey === today && cell.month === "current";
              const isOtherMonth = cell.month !== "current";

              return (
                <div
                  key={i}
                  className="min-h-[120px] p-1.5 border-b border-r relative"
                  style={{
                    backgroundColor: dragOverDate === cell.dateKey ? "var(--primary-muted)" : isToday ? "rgba(12, 106, 255, 0.06)" : "var(--bg)",
                    borderColor: "var(--border)",
                    opacity: isOtherMonth ? 0.35 : 1,
                  }}
                  onDragOver={e => { e.preventDefault(); setDragOverDate(cell.dateKey); }}
                  onDragLeave={() => setDragOverDate(null)}
                  onDrop={() => { setDragOverDate(null); setDragPost(null); }}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "text-white" : ""}`}
                      style={{
                        backgroundColor: isToday ? "var(--primary)" : "transparent",
                        color: isToday ? "white" : isOtherMonth ? "var(--text-muted)" : "var(--text-secondary)",
                      }}
                    >
                      {cell.day}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="text-[9px] font-medium px-1 rounded" style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
                        {dayPosts.length}
                      </span>
                    )}
                  </div>

                  {/* Post pills */}
                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 3).map(post => (
                      <div
                        key={post.id}
                        draggable
                        onDragStart={() => setDragPost({ post, fromDate: cell.dateKey })}
                        onClick={() => setPreviewPost(post)}
                        className="flex items-center gap-1 px-1.5 py-1 rounded-md cursor-pointer transition-all hover:brightness-125"
                        style={{ backgroundColor: `${post.page.color}20` }}
                      >
                        <div className="w-3 h-3 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: post.page.color }}>
                          <span className="text-[5px] font-bold text-white">{post.page.avatar[0]}</span>
                        </div>
                        <span className="text-[9px] font-medium truncate" style={{ color: "var(--text)" }}>
                          {post.time}
                        </span>
                        <span className="text-[8px] font-bold px-1 rounded shrink-0" style={{ backgroundColor: `${typeColors[post.type]}20`, color: typeColors[post.type] }}>
                          {post.type === "photo" ? "P" : post.type === "reel" ? "R" : "T"}
                        </span>
                        {post.status === "published" && (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" className="shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                    ))}
                    {dayPosts.length > 3 && (
                      <span className="text-[9px] font-medium px-1.5 block" style={{ color: "var(--text-muted)" }}>
                        +{dayPosts.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week view */}
      {view === "week" && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="grid grid-cols-7">
            {weekDays.map(wd => {
              const dayPosts = getPostsForDate(wd.dateKey);
              const isToday = wd.day === 28;

              return (
                <div key={wd.day} className="border-r" style={{ borderColor: "var(--border)" }}>
                  {/* Day header */}
                  <div className="px-3 py-3 text-center border-b" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: "var(--text-muted)" }}>
                      {WEEKDAYS[new Date(2026, 2, wd.day).getDay()]}
                    </span>
                    <span
                      className={`text-[18px] font-bold mt-1 w-9 h-9 flex items-center justify-center rounded-full mx-auto ${isToday ? "text-white" : ""}`}
                      style={{
                        backgroundColor: isToday ? "var(--primary)" : "transparent",
                        color: isToday ? "white" : "var(--text)",
                      }}
                    >
                      {wd.day}
                    </span>
                  </div>

                  {/* Posts list */}
                  <div className="p-2 space-y-1.5 min-h-[400px]" style={{ backgroundColor: isToday ? "rgba(12, 106, 255, 0.04)" : "var(--bg)" }}>
                    {dayPosts.map(post => (
                      <div
                        key={post.id}
                        draggable
                        onClick={() => setPreviewPost(post)}
                        className="p-2 rounded-lg cursor-pointer transition-all hover:brightness-110 border"
                        style={{ backgroundColor: `${post.page.color}10`, borderColor: `${post.page.color}30` }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ backgroundColor: post.page.color }}>
                            {post.page.avatar[0]}
                          </div>
                          <span className="text-[10px] font-semibold" style={{ color: "var(--text)" }}>{post.time}</span>
                          {post.status === "published" && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" className="ml-auto"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </div>
                        <p className="text-[10px] leading-[14px] line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                          {post.caption}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          {post.platforms.map(p => (
                            <span key={p} className="text-[7px] font-bold px-1 rounded" style={{
                              backgroundColor: p === "fb" ? "#1877F220" : p === "ig" ? "#E1306C20" : "#33333380",
                              color: p === "fb" ? "#1877F2" : p === "ig" ? "#E1306C" : "#999",
                            }}>
                              {p.toUpperCase()}
                            </span>
                          ))}
                          <span className="text-[7px] font-bold px-1 rounded ml-auto" style={{ backgroundColor: `${typeColors[post.type]}20`, color: typeColors[post.type] }}>
                            {post.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 px-2">
        <div className="flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Published</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Scheduled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold px-1.5 rounded" style={{ backgroundColor: `${typeColors.photo}20`, color: typeColors.photo }}>P</span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Photo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold px-1.5 rounded" style={{ backgroundColor: `${typeColors.reel}20`, color: typeColors.reel }}>R</span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Reel</span>
        </div>
        <span className="text-[11px] ml-auto" style={{ color: "var(--text-muted)" }}>Drag posts to reschedule</span>
      </div>

      {/* Post Preview Modal */}
      {previewPost && (
        <PostPreviewModal
          post={{
            ...previewPost,
            thumbnail: "",
            scheduledAt: previewPost.time,
            scheduledDate: "",
          }}
          onClose={() => setPreviewPost(null)}
        />
      )}
    </div>
  );
}

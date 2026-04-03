# UI/UX Designer Deliverables — Phase 1 + Phase 2 Complete List

---

# PHASE 1: POSTING UTILITY + DATA CAPTURE

---

## P1-A. CUSTOMER-FACING PAGES (23 Pages)

### Auth Pages (5)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 1 | **Login** | Email/password fields, Google OAuth button, "Forgot password" link, 2FA input (conditional) | Default, Error (invalid credentials), Locked out (5 failed attempts → 15min), 2FA prompt |
| 2 | **Signup** | Email/password/confirm fields, Google OAuth button, terms checkbox | Default, Validation errors (email exists, weak password, mismatch) |
| 3 | **Verify Email** | Confirmation message, resend button | Pending verification, Verified (redirect), Link expired (resend CTA) |
| 4 | **Forgot Password** | Email input, submit button | Default, Email sent confirmation, Email not found |
| 5 | **Reset Password** | New password/confirm fields | Default, Success, Link expired, Already used |

### Core Pages (6)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 6 | **Dashboard (All Pages)** | Hero metrics (views, engagement, reach, revenue — owner only), page list table, filters/sort/search, bulk select, tabs (All Pages / Scheduled Queue / Failed Posts), token expiry banner, disconnected pages banner | Empty (no pages connected — CTA to connect FB), Populated, Filtered, Banner states (token warning, disconnect warning, payment grace) |
| 7 | **Bulk Upload** | Page selector, two tabs (Media / Text), drag-drop upload zone, Airtable-style grid, auto-fill schedule controls, distribution dropdown, "Add to Queue" button, progress indicators | Empty (pre-upload), Uploading (progress bar), Processing (thumbnail generation), Ready (grid populated), Failed uploads banner, Grid editing mode |
| 8 | **Single Post Creation** | Page selector, media upload (or text-only toggle), caption field, thread-in-comments field, date/time picker, IG toggle, Threads toggle, thumbnail selector (for video), submit button | New post form, Validation errors, Submitting, Success |
| 9 | **Queue** | Unified grid (type, media, caption, IG/Threads toggles, schedule, drag handle), auto-fill schedule controls, distribution dropdown, bulk edit button, "Submit X posts" button | Empty, Populated, Reordering (drag ghost), Bulk selection active, Preflight validation overlay |
| 10 | **Calendar** | Month/Week/Day views, toggle buttons, post dots with status colors (⚪ Scheduled, 🟢 Published, 🟡 Partial, 🔴 Failed), page filter, status filter, drag-to-reschedule | Month view, Week view, Day view (post list), Filtered, Drag-reschedule feedback |
| 11 | **Failed Posts** | List of failed/partial posts, error reasons, retry buttons, platform-by-platform status | Empty (no failures), List with errors, Retrying state |

### Management Pages (4)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 12 | **Page List / All Pages** | Table of all connected pages, per-page metrics, status indicators (🟢🟡🔴), settings icon per row, search, sort/filter | Empty, Populated, Filtered |
| 13 | **Page Settings** | Quiet hours toggle + time range, default posting interval selector (1h/2h/4h), auto-post to IG toggle, auto-post to Threads toggle, timezone selector, "Local time vs Page time" toggle | Default values, Custom configured |
| 14 | **Connected IDs (FB User Accounts)** | List of connected Facebook profiles, status per account, pages under each, reconnect/disconnect actions | All healthy, Some expiring (🟡), Some expired (🔴) |
| 15 | **ID Settings** | Per-connected-account settings, reconnect button, disconnect button | Healthy, Expiring, Expired |

### Reports Pages (2)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 16 | **Reporting Overview** | Aggregate performance summary across all pages within retention window, KPI cards, trends | Free tier (7-day data, page-level only), Paid tier (90-day data, all pages aggregated) |
| 17 | **Page Report** | Per-page metrics, recent posts list, basic trends within retention window | With data, No data yet |

### Settings Pages (3)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 18 | **Account Settings** | Profile info, email, password change, 2FA enable/disable, session list (device, location, last active), "Log out all devices" | Default, 2FA setup flow |
| 19 | **Billing & Subscription** | Current plan, account count, monthly cost breakdown, upgrade/downgrade, cancel, payment method (Stripe) | Free plan, Paid plan, Grace period warning, Payment failed |
| 20 | **Invoices** | Invoice history table, download buttons, email receipts | With invoices, Empty |

### Legal Pages (2)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 21 | **Terms of Service** | Static legal content | — |
| 22 | **Privacy Policy** | Static legal content | — |

### Support Pages (1)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 23 | **Help / FAQ** | FAQ accordion, contact/support info | — |

---

## P1-B. SUPERADMIN PORTAL PAGES (11 Pages)

| # | Page | Key Elements |
|---|------|-------------|
| 1 | **SuperAdmin Login** | Email/password + mandatory 2FA (TOTP) |
| 2 | **SuperAdmin Dashboard** | Platform health: worker queue depth, publish success/failure rate, avg publish latency, retry counts, Meta API error rate |
| 3 | **Tenant List** | All customers: plan, account count, status (active/grace/downgraded), last activity, search/filter |
| 4 | **Tenant Detail** | Tenant profile, users, connected FB accounts, connected pages, operational status, disable/enable tenant |
| 5 | **User Detail** | User profile, activity, disable/enable user |
| 6 | **Connections Overview** | User Accounts and Pages per tenant, token status |
| 7 | **Job Monitor** | Publishing jobs list: status, queue depth, filters |
| 8 | **Job Detail** | Execution logs, retry history, requeue button |
| 9 | **Billing Overview** | Stripe sync status, payment failures, grace periods |
| 10 | **Audit Log Viewer** | Filterable logs: actor, timestamp, action, target entity, before/after |
| 11 | **Support Access Control** | Enable/disable support access per tenant, reason field, time-limited window |

---

## P1-C. MODALS (12)

### Must-Have Modals (11)
| # | Modal | Trigger | Key Elements |
|---|-------|---------|-------------|
| 1 | **Connect Facebook (OAuth)** | "Connect Facebook" CTA on empty dashboard or Connected IDs page | OAuth flow initiation, permission list, loading state, success/failure |
| 2 | **Reconnect All** | Token expired banner "Reconnect All" button | Single OAuth flow to restore all pages under that User Account, loading, success |
| 3 | **Edit Scheduled Post** | Click post in calendar or queue | Same fields as creation: caption, comments, media (swap), thumbnail, schedule, IG/Threads toggles. Save/Cancel |
| 4 | **Delete Post Confirmation** | Delete action on any post | Warning text, confirm/cancel buttons |
| 5 | **Disconnect Page Confirmation** | Disconnect action on a page | Shows count of scheduled posts that will be deleted, destructive action warning, confirm/cancel |
| 6 | **Preflight Validation** | Before "Submit X posts" | Issues list with ❌ blockers and ⚠️ warnings, per-issue actions (Fix / View / Skip IG / Skip Threads), Fix All / Submit Anyway / Cancel |
| 7 | **Bulk Edit Captions** | Multi-select rows → "Bulk Edit" | Action dropdown (template, prefix, suffix, find & replace, clear), preview ("X of Y captions will change"), template variables ({caption}, {date}, {count}), Apply/Cancel |
| 8 | **Partial Success Details** | Click partial post | Platform-by-platform results (FB ✅, IG ❌, Threads ✅ etc.), per-platform retry buttons |
| 9 | **Retry Confirmation** | Retry action on failed/partial post | What will be retried (full post vs specific platforms vs comments only), confirm/cancel |
| 10 | **Upgrade Paywall** | Free user adds 4th account | Plan comparison, pricing, Stripe checkout CTA |
| 11 | **Payment Failed / Grace Period** | Payment failure event | Warning message, retry payment, grace period countdown, what happens after grace |

### Should-Have Modal (1)
| # | Modal | Trigger | Key Elements |
|---|-------|---------|-------------|
| 12 | **Video Thumbnail Selector** | Click thumbnail in grid for video posts | 3 auto-generated options (start/middle/end), custom upload option, select/confirm |

---

## P1-D. REUSABLE UI COMPONENTS (20)

### Must-Have Components (18)
| # | Component | Usage | Design Notes |
|---|-----------|-------|-------------|
| 1 | **App Shell (Sidebar + Header)** | All authenticated pages | Sidebar nav, user menu, responsive collapse |
| 2 | **Page List Table/Grid** | Dashboard, Page List | Sortable columns, row actions, bulk select checkboxes |
| 3 | **Filters + Search** | Dashboard, Calendar, Queue, Reports | Filter dropdowns, search input, active filter chips |
| 4 | **KPI Cards** | Dashboard, Reports | Metric value, label, trend indicator (% change), icon |
| 5 | **Status Badge** | Throughout | States: Scheduled (gray), Published (green), Partial (yellow), Failed (red), Disconnected, Draft |
| 6 | **Button Set** | Throughout | Primary, Secondary, Danger, Disabled, Loading variants |
| 7 | **Modal Base** | All 12 modals | Header, body, footer (actions), close button, overlay |
| 8 | **Toast / Alert Banners** | Throughout | Success, Warning, Error, Info. Dismissible. Auto-dismiss for success |
| 9 | **Upload Dropzone** | Bulk Upload, Single Post | Drag-drop area, file browser fallback, accepted formats text, multi-file support |
| 10 | **Progress Bar** | Bulk Upload | Determinate (X of Y files), stage labels (Uploading → Processing → Ready) |
| 11 | **Airtable-Style Grid** | Bulk Upload, Queue | Scrollable, resizable columns, inline editing, row selection, header actions |
| 12 | **Editable Cells (Text Areas)** | Grid captions, comments | Click-to-edit, expandable rows for long content, character counter |
| 13 | **Drag Handle + Row Reorder** | Grid, Queue | ⋮⋮ grab handle, ghost row while dragging, drop zone highlight, schedule auto-recalc |
| 14 | **Date/Time Picker** | Schedule fields, Calendar | Date selector, time selector, timezone-aware display |
| 15 | **Calendar Grid** | Calendar page | Month/Week/Day layouts, post count badges, status-colored dots, drag targets |
| 16 | **Platform Toggle Checkboxes** | Grid, Single Post, Queue | FB (always on), IG checkbox, Threads checkbox, inline warnings (⚠️) |
| 17 | **Character Counter** | Caption fields, comment fields | Live count, yellow warning near limit, red when exceeded, per-platform limits |
| 18 | **Error Inline Cell Indicator** | Grid cells | Red border, error icon, tooltip with message (e.g., "Policy blocked: sexually suggestive content detected") |

### Should-Have Components (2)
| # | Component | Usage |
|---|-----------|-------|
| 19 | **Loading Skeleton** | All data-loading states |
| 20 | **Pagination** | Long lists (page list, invoices, audit logs) |

---

## P1-E. EMPTY / EDGE / ERROR STATES (12)

| # | State | Where |
|---|-------|-------|
| 1 | Empty dashboard (no pages connected) | Dashboard |
| 2 | Empty queue (no posts scheduled) | Queue |
| 3 | Empty calendar (no posts) | Calendar |
| 4 | Empty failed posts (no failures) | Failed Posts |
| 5 | Upload errors banner (X files failed) | Bulk Upload |
| 6 | Token expiring banner (7 days) | Dashboard top |
| 7 | Token expired / Pages disconnected banner | Dashboard top |
| 8 | Payment failed / Grace period banner | Dashboard top |
| 9 | Free tier limitations (disabled features) | Bulk Upload, Queue, Calendar actions |
| 10 | Rate limited / Queued waiting state | Queue |
| 11 | Publishing locked state (no edits allowed) | Post edit |
| 12 | IG/Threads unavailable (permissions not granted) | Grid toggles |

---

## P1-F. NOTIFICATION DESIGNS (6)

| # | Type | Channel | Content |
|---|------|---------|---------|
| 1 | Token expiring (7 days) | In-app banner | Yellow warning + "Reconnect soon" |
| 2 | Token expiring (1 day) | Email | Urgency warning |
| 3 | Page disconnected | Email + in-app banner | Red badge + "Reconnect" CTA |
| 4 | Post failed | In-app banner (dashboard) | Error details + retry action |
| 5 | Payment failed | Email | Retry payment CTA |
| 6 | Payment successful | Email receipt | Invoice summary |

---

## PHASE 1 TOTALS

| Category | Count |
|----------|-------|
| Customer Pages | 23 |
| SuperAdmin Pages | 11 |
| Modals | 12 |
| Reusable Components | 20 |
| Empty/Edge/Error States | 12 |
| Notification Designs | 6 |
| **PHASE 1 TOTAL** | **84** |

---
---

# PHASE 2: INTELLIGENCE LAYER + STRATEGY REPORTS

---

## P2-A. NAVIGATION UPDATE

The main sidebar navigation must be updated to include the new Phase 2 "Strategy" section:

```
Dashboard          (Phase 1 — unchanged)
Calendar           (Phase 1 — unchanged)
Upload             (Phase 1 — unchanged)
──────────────────
Strategy (NEW)
  ├── Advanced Dashboard
  ├── Strategy Reports
  │     ├── Generate New
  │     └── Report History
  ├── Competitors
  │     ├── My Competitors
  │     └── Add Competitor
  └── Trends / Trendolizer
        ├── Rising
        ├── Emerging
        └── Watch List
──────────────────
Settings
  ├── Pages          (Updated: now includes Setup status)
  ├── Tokens (NEW)
  ├── Alerts (NEW)
  └── Account        (Phase 1 — unchanged)
```

Also add:
- **Global Token Balance Display** in header: `[Tokens: 245] [Buy]` — persistent across all pages
- Low balance warning state (triggers at <20 tokens)

---

## P2-B. PAGE SETUP WIZARD (6 Steps + Confirmation)

| # | Screen | Key Elements | States |
|---|--------|-------------|--------|
| 1 | **Setup Required Gate** | Page name, "This takes about 2 minutes", [Start Setup] CTA | Blocking (can't generate report without setup), Voluntary (from settings) |
| 2 | **Step 1: Niche Selection** | Progress ●○○○○○, auto-detected niche with [Confirm]/[Change], manual radio list (16 niches + "Other" text field) | Auto-detected, Manual selection |
| 3 | **Step 2: Sub-Niche Selection** | Progress ●●○○○○, multi-select checkboxes (niche-specific options), contextual tip | Selected, None selected (skip) |
| 4 | **Step 3: Competitor Assignment** | Progress ●●●○○○, suggested competitors with checkboxes + follower counts, "Add your own" URL input, running token total + balance display | Suggestions loaded, Custom entry, Token cost preview |
| 5 | **Step 4: Page Goals** | Progress ●●●●○○, single-select radio (Grow Engagement / Grow Reach / Grow Followers / Maximize Revenue / Balanced Growth), sub-descriptions | Selected |
| 6 | **Step 5: Content Preferences** | Progress ●●●●●○, "Content to avoid" checkboxes (7 options), "Format restrictions" checkboxes (4 options) | Selections made, None (skip) |
| 7 | **Step 6: Page Branding (Optional)** | Progress ●●●●●●, logo upload dropzone, watermark position grid (4 corners), size selector (S/M/L), opacity slider (50–100%), live preview, watermark mode toggle, optional brand colors + visual style selector | Logo uploaded + preview, No logo (skip) |
| 8 | **Setup Complete** | Summary of all configured settings, token deduction + new balance, [Generate Strategy Report — 50 tokens] CTA, [Back to Dashboard] | — |

---

## P2-C. ADVANCED DASHBOARD (9 Modules + Overview)

| # | Screen / Module | Key Elements | States |
|---|----------------|-------------|--------|
| 1 | **Dashboard Home** | Header with page dropdown + time period dropdown (7d/30d/90d), token balance, 2-column grid of modules | First-time (empty modules with CTAs), Populated, Filtered |
| 2 | **Module 1: Portfolio Health Score** | Circular score (0–100), color-coded (Green 80+/Yellow 60+/Orange 40+/Red <40), breakdown bullets, month-over-month delta, [i] info button, expandable detail (5 weighted components), contextual upsell | Score displayed, Expandable detail, Upsell triggered (<70) |
| 3 | **Module 2: Page Rankings** | 3 tabs (Top Performers / Fastest Growing / Needs Attention), sortable table (rank, handle, engagement rate, vs-niche delta, trend), per-page [Get Report →] CTA | Tab selected, Sorted, "Needs Attention" highlighted |
| 4 | **Module 3: Top Content (Cross-Page)** | Post cards (thumbnail, text, handle, date, engagement, shares, comments), "X.Xx your average" badge, expandable "Why it worked" (hook type, topic, format, timing, emotion), [View All →] | Collapsed, Expanded per-post, Upsell (pattern detected) |
| 5 | **Module 4: Content Type Breakdown** | Table (Format, Posts count, Avg Engagement, vs Your Avg %, vs Niche %), horizontal bar chart, auto-insight text | Default, Upsell (format underperforming) |
| 6 | **Module 5: Best Posting Times Heatmap** | 7×7 heatmap grid (days × time slots), 3-tier legend (◉ Best / ● Good / · Below avg), "Your Sweet Spots" ranked list, worst-time warning | Default, Warning shown |
| 7 | **Module 6: Underperformers Alert** | "By Content Type" section, "By Timing" section, "Worst Posts This Month" list (thumbnail, text, % vs avg) | With underperformers, No issues |
| 8 | **Module 7: Niche Benchmarking** | Niche label + pages tracked, comparison table (Metric / You / Niche Avg / Status), niche rank linear scale (Top 10%/25%/50%), strengths & weaknesses bullets | Default, No competitors ([Add Competitors] CTA) |
| 9 | **Module 8: Revenue Dashboard** | Owner-only visibility, total earnings + MoM delta, per-page earnings bar chart, RPM trend line chart, insight text | With data, No revenue data, Upsell (RPM declining) |
| 10 | **Module 9: Trends Over Time** | Multi-line chart (Engagement/Reach/Followers), "Key Changes" annotation list (event + date + impact %) | Default, No sufficient data |

---

## P2-D. STRATEGY REPORT SCREENS (8)

| # | Screen | Key Elements | States |
|---|--------|-------------|--------|
| 1 | **Generate Report — Page Selection** | Scope selector (All Pages / Single Page), page dropdown, cost display (50 tokens), current balance | Default, Insufficient tokens |
| 2 | **Eligibility: Not Enough Data** | Progress tracker per requirement (posts: X/10, days active: X/14, competitors), "Estimated ready: ~X days", [Notify me when ready], no tokens charged | Partially met, Fully blocked |
| 3 | **Eligibility: Add Competitors First** | Explanation of benefit, radio (Generate without / Add first), [Add Competitors] / [Continue without] | — |
| 4 | **Report Generation Loading** | Page name, step-by-step checklist with checkmarks (Gathering data → Analyzing competitors → Comparing niche → Generating recommendations), progress bar, "~30 seconds" | In-progress (per step) |
| 5 | **Strategy Report View (Full)** | Header (page name, niche, date), 4 sections: **TEST THESE** (2–5 items), **KILL THESE** (0–3 items), **WATCH THESE** (0–3 items), **Performance vs Niche Benchmark Table** + rank. Per-item: confidence badge (🟢/🟡), evidence bullets, [View example], response buttons. Footer: [👍/👎], [Download PDF], [Share], [Leave detailed feedback — earn 10 tokens] | Full report, Low-signal variant (only WATCH items), Zero-state per section |
| 6 | **Report History** | Filter (page dropdown, time dropdown), report list (date, page, item counts: X TEST • X KILL • X WATCH), [View Report], [Generate New Report] CTA | With reports, Empty |
| 7 | **Historical Report View** | Staleness banner ("X days old / Data may no longer be current"), [View Report] / [Generate Fresh — 50 tokens], "Your Responses" section showing past per-item responses + outcomes | Fresh, Stale |
| 8 | **Low-Signal Report Variant** | Special label at top, explanation ("No urgent changes, keep current strategy"), tokens-still-charged notice | — |

### Strategy Report Per-Item Response Buttons
| Section | Buttons | After-Click Behavior |
|---------|---------|---------------------|
| **TEST** | [I'll try this] / [Not for me] / [Already doing] | "I'll try this" → "We'll check back in 2 weeks (5 tokens if you respond)". "Not for me" → optional reason (Not my style / Too resource-intensive / Tried before / Other) |
| **KILL** | [I'll stop this] / [Disagree] / [Need more info] | Similar follow-ups |
| **WATCH** | [Keep watching] / [Not interested] / [I'll test early] | Similar follow-ups |

---

## P2-E. COMPETITOR MANAGEMENT SCREENS (5)

| # | Screen | Key Elements | States |
|---|--------|-------------|--------|
| 1 | **Competitors List** | "Your Competitors (X/5)" header, per-competitor cards (handle, niche, followers, last updated), [View Insights] / [Remove] per card, [+ Add Competitor] with token cost | Populated, Empty (suggestions + CTA), Max reached (5/5) |
| 2 | **Add Competitor** | URL input OR search by name, cost: 20 tokens, current balance display, [Cancel] / [Add Competitor] | Default, Validation loading, Not found error, Confirm |
| 3 | **Competitor Validation Loading** | "Checking @PageName...", step checklist (Page found / Public page / Fetching data) | In progress |
| 4 | **Confirm Competitor** | Preview card (handle, niche, followers, post frequency), "Is this the right page?", [Cancel] / [Confirm — 20 tokens] | — |
| 5 | **Competitor Insights Detail** | Handle + niche + followers, performance (engagement rate, post frequency, "vs You" delta), top posts (last 30 days), content strategy patterns (video %, posting times, hook types), recent changes | With data, Insufficient data |

---

## P2-F. TRENDOLIZER SCREENS (4)

| # | Screen | Key Elements | States |
|---|--------|-------------|--------|
| 1 | **Trendolizer Dashboard** | Niche selector, "Last updated" timestamp. 3 sections: **Rising Now** (fast-moving, velocity %), **Emerging** (early signals), **Watch List** (user-saved). Per-trend card: topic, velocity %, sources, [👍/👎] rating, [Get Content Ideas — 15 tokens] | Populated, Empty per section, No trends in niche |
| 2 | **Trend Deep Dive Confirmation** | Topic name, cost: 15 tokens, what you'll get (5 angles, hooks, format rec, timing), [Cancel] / [Get Ideas] | — |
| 3 | **Trend Content Ideas Output** | "Suggested Angles" list (up to 5): angle title/hook, recommended format, hook type. "Best Time to Post" recommendation. [Save to Ideas] / [Use in Phase 3] | — |
| 4 | **Trend Alerts Setup** | Alert frequency radio (Real-time / Daily / Weekly), notify via checkboxes (In-app / Email), minimum velocity threshold dropdown, [Save Preferences] | Configured, Default |

---

## P2-G. TOKEN ECONOMY SCREENS (6)

| # | Screen | Key Elements | States |
|---|--------|-------------|--------|
| 1 | **Token Confirmation Modal** | Action name + cost, current balance + balance after, [Cancel] / [Confirm] | Sufficient balance, Insufficient (redirects to Buy) |
| 2 | **Buy Tokens** | Current balance + required amount, 3 packages: 50 tokens $4.99 / 200 tokens $14.99 (⭐ Most Popular, Save 25%) / 500 tokens $29.99 (Best Value, Save 40%), [Cancel] | From insufficient balance, From settings |
| 3 | **Stripe Payment** | Package selected + price, Stripe checkout | — |
| 4 | **Purchase Complete** | Tokens added, new balance, [Continue to action] | — |
| 5 | **Token Balance (Settings)** | Current balance, breakdown (purchased vs subscription vs free), [Buy More], expiry notes | — |
| 6 | **Token History** | Transaction log: date, action, tokens spent/earned, balance after | With transactions, Empty |

---

## P2-H. FEEDBACK SYSTEM SCREENS (8 Touchpoints)

| # | Touchpoint | Location | Key Elements |
|---|-----------|----------|-------------|
| 1 | **Report Overall Rating** | Bottom of every Strategy Report | [👍 Yes] / [👎 No]. After 👎: reason list (5 options + Other text field) |
| 2 | **Per-Item Response Buttons** | Each report item (TEST/KILL/WATCH) | 3 buttons per item type (see P2-D above). After-click follow-ups |
| 3 | **2-Week Follow-Up** | In-app notification + dedicated screen | "Did you try [recommendation]?" → [Yes] / [No] / [Remind me later]. If Yes: "How did it perform?" → [🚀 Better] / [➡️ Same] / [📉 Worse] → "+5 tokens" confirmation |
| 4 | **Trend Rating** | Each trend card in Trendolizer | [👍 Useful] / [👎 Not relevant] |
| 5 | **Niche Correction** | Auto-detection prompt | "We detected [Niche]. Correct?" → [✓ Yes] / [✗ No + dropdown] |
| 6 | **Open Text Feedback** | Bottom of Strategy Report | "Have detailed feedback? (earn 10 tokens)", large textarea, min 50 chars, [Submit for 10 tokens] |
| 7 | **Churn Survey** | Modal on 30-day inactivity | "We noticed you haven't used Strategy Reports lately (earn 20 tokens)", 5 radio reasons, [Submit for 20 tokens] / [Remind me later] / [Don't ask again] |
| 8 | **Token Value Check** | Inline after any token spend | "Worth it?" [👍 Yes] / [👎 No] — non-blocking, inline |

---

## P2-I. ONBOARDING / FIRST-TIME SCREENS (2)

| # | Screen | Key Elements | States |
|---|--------|-------------|--------|
| 1 | **Welcome to Phase 2 Modal** | "Your Intelligence Layer is Ready", feature checklist (Dashboard, Reports, Competitors, Trends), "Your tokens: 100 (starter bonus)", [Start Tour] / [Skip] | — |
| 2 | **Guided Tour Overlay (5 Steps)** | Spotlight/highlight overlay per step: Dashboard Overview → Niche Benchmark → Strategy Reports → Add Competitors → Trend Alerts. [Next] / [Finish Tour] | Per step |

---

## P2-J. UPDATED SETTINGS SCREENS (3 New/Updated)

| # | Screen | Key Elements | States |
|---|--------|-------------|--------|
| 1 | **Page Configuration Settings (Edit Setup)** | Edit any of the 6 wizard sections post-completion, same components as wizard but in settings panel form, branding sub-section | Fully configured, Partially configured |
| 2 | **Token Balance & History** | (See P2-G items 5 & 6 above) | — |
| 3 | **Alert Preferences** | Alerts enabled toggle, frequency radio, channels checkboxes, velocity threshold dropdown | Configured, Default |

---

## P2-K. PHASE 2 MODALS (20)

| # | Modal | Trigger | Key Actions |
|---|-------|---------|-------------|
| 1 | **Setup Required Gate** | Strategy Report request on unconfigured page | [Start Setup] |
| 2 | **Welcome to Phase 2** | First Phase 2 access | [Start Tour] / [Skip] |
| 3 | **Guided Tour Overlay** | [Start Tour] | [Next] ×5, [Finish] |
| 4 | **Token Confirmation** | Any token spend | [Cancel] / [Confirm] |
| 5 | **Insufficient Tokens** | Token spend with low balance | Package options, [Cancel] |
| 6 | **Buy Tokens** | Low balance / settings | 3 packages, [Cancel] |
| 7 | **Stripe Checkout** | Package selected | Payment form |
| 8 | **Purchase Complete** | Payment success | [Continue] |
| 9 | **Add Competitor** | [+ Add Competitor] | URL/search input, cost |
| 10 | **Competitor Validation Loading** | After add submission | Progress checklist |
| 11 | **Competitor Not Found Error** | Invalid URL | [Try Again] |
| 12 | **Confirm Competitor** | Valid competitor found | [Cancel] / [Confirm — 20 tokens] |
| 13 | **Competitor Added** | Confirmation | [Add Another] / [Done] |
| 14 | **Trend Deep Dive Confirmation** | [Get Content Ideas] | [Cancel] / [Get Ideas — 15 tokens] |
| 15 | **Not Enough Data Gate** | <10 posts on report gen | Progress tracker, [Notify me] |
| 16 | **Add Competitors Recommendation** | No competitors on report gen | [Add] / [Continue without] |
| 17 | **Churn Survey** | 30-day inactivity | Reason list, [Submit for 20 tokens] |
| 18 | **Download Image Options** | Download button on post | With/without watermark radio |
| 19 | **Niche Correction** | Auto-detection prompt | [Yes] / [No + dropdown] |
| 20 | **2-Week Follow-Up** | 14 days after "I'll try" | Performance outcome buttons |

---

## P2-L. NEW REUSABLE COMPONENTS (16)

| # | Component | Usage | Design Notes |
|---|-----------|-------|-------------|
| 1 | **Confidence Badge** | Strategy Report items | 🟢 High / 🟡 Medium pill labels |
| 2 | **Token Cost Display** | Before every token spend action | Persistent cost + balance preview |
| 3 | **Contextual Upsell Block** | Every dashboard module | "💡 [Insight] → [Tease] → [CTA — X tokens]" pattern. Max 1 per module |
| 4 | **Step Progress Indicator** | Setup Wizard | ●●○○○○ dot progression |
| 5 | **Heatmap Cell** | Best Posting Times | ◉ Best (2x+) / ● Good (above avg) / · Below avg |
| 6 | **Page Status Card** | Dashboard, Page List | 🟢 Fully configured / 🟡 Partially configured / ⚪ Not configured — with handle, niche, competitor count, watermark status |
| 7 | **Trend Card** | Trendolizer | Topic, velocity %, direction arrow, sources, [👍/👎], [Get Ideas] CTA |
| 8 | **Report Item Card** | Strategy Report | TEST/KILL/WATCH sections with confidence badge, evidence bullets, response buttons, expandable detail |
| 9 | **Competitor Card** | Competitors List | Handle, niche, followers, last updated, [View Insights] / [Remove] |
| 10 | **Watermark Position Grid** | Page Setup Step 6, Page Settings | 4-corner visual selector with live preview |
| 11 | **Token Reward Notification** | After feedback submissions | "+X tokens added to your balance" inline confirmation |
| 12 | **Niche Rank Visualizer** | Niche Benchmarking module | Linear percentile scale with "You" marker position (Top 10%/25%/50%) |
| 13 | **Content Post Card** | Top Content module | Thumbnail + metrics + expandable "Why it worked" |
| 14 | **Opacity Slider** | Page Branding | 50–100% range slider with live preview |
| 15 | **Color Picker** | Page Branding | Primary/Secondary brand colors, [Auto-detect from logo] |
| 16 | **Visual Style Selector** | Page Branding | 4 style thumbnails (Minimal / Bold / Colorful / Professional) |

---

## P2-M. PHASE 2 EMPTY / EDGE STATES (8)

| # | State | Where |
|---|-------|-------|
| 1 | No reports yet — "Generate your first report" + CTA | Report History, Dashboard |
| 2 | No competitors — "Add competitors for better insights" + CTA | Competitors List, Niche Benchmarking |
| 3 | No trends in niche — "No trending topics right now" | Trendolizer |
| 4 | Page ineligible — "Need more posts for insights" + progress bar | Report Generation |
| 5 | Insufficient tokens for action | Token Confirmation |
| 6 | Low-signal period — report has only WATCH items | Strategy Report |
| 7 | First-time dashboard — empty modules with onboarding CTAs | Advanced Dashboard |
| 8 | Setup incomplete — blocking gate before intelligence features | Strategy Report, Dashboard page cards |

---

## P2-N. PHASE 2 NOTIFICATION DESIGNS (4)

| # | Type | Channel | Content |
|---|------|---------|---------|
| 1 | 2-week follow-up reminder | In-app notification card | "2 weeks ago we suggested: [rec]. How did it go?" + [View Follow-up] |
| 2 | Report ready (from "Notify me") | In-app + Email | "Your page now has enough data for a Strategy Report" |
| 3 | Trend alert | In-app / Email (per preference) | "New rising trend in [Niche]: [Topic] (+X%)" |
| 4 | Low token balance (<20) | In-app banner | "Running low on tokens" + [Buy More] |

---

## PHASE 2 TOTALS

| Category | Count |
|----------|-------|
| New/Updated Pages | 30 |
| New Modals | 20 |
| New Reusable Components | 16 |
| Setup Wizard Steps | 8 (6 steps + gate + confirmation) |
| Dashboard Modules | 9 (each with detail/expanded views) |
| Feedback Touchpoints | 8 |
| Empty/Edge States | 8 |
| Notification Designs | 4 |
| **PHASE 2 TOTAL** | **~103** |

---
---

# GRAND TOTAL — BOTH PHASES

| Category | Phase 1 | Phase 2 | Combined |
|----------|---------|---------|----------|
| Customer Pages | 23 | 30 | 53 |
| SuperAdmin Pages | 11 | — | 11 |
| Modals | 12 | 20 | 32 |
| Reusable Components | 20 | 16 | 36 |
| Empty/Edge/Error States | 12 | 8 | 20 |
| Notification Designs | 6 | 4 | 10 |
| **TOTALS** | **84** | **~103** | **~187** |

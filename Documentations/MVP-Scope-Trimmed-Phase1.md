# MVP Scope — Phase 1 (Trimmed)
## Social Media Posting Tool — Design Deliverables for UI/UX

**Original Phase 1 scope:** 84 deliverables
**Trimmed MVP scope:** ~47 deliverables (44% reduction)
**Goal:** Ship the core posting utility that beats Publer, defer infrastructure/admin UI

---

## WHAT'S CUT AND WHY

| Deferred | Reason | When to Add |
|----------|--------|-------------|
| SuperAdmin Portal (11 pages) | Use Django admin instead | When 100+ tenants |
| Billing & Subscription page | Manual onboarding, Stripe Payment Links | After first 50 users |
| Invoices page | Stripe dashboard handles this | With billing UI |
| Upgrade Paywall modal | No paywall if manual onboarding | With billing UI |
| Payment Failed modal | Only needed with automated billing | With billing UI |
| Image Policy Checker (Rekognition) | Manual review at low scale | When scale demands |
| Terms of Service page | Link to hosted doc (Notion/Google Doc) | When legal requires |
| Privacy Policy page | Link to hosted doc | When legal requires |
| Help / FAQ page | Use Intercom/Crisp or Notion | Post-launch |
| ID Settings page | Merge into Connected IDs | If needed |
| 2FA setup flow | Optional, add later | Post-launch |
| Reporting Overview page | Nice-to-have | Post-launch |
| Page Report page | Nice-to-have | Post-launch |
| Partial Success Details modal | Simple error message first | Post-launch |
| Retry Confirmation modal | Direct retry, no confirmation | Post-launch |
| Grace period logic | Only with automated billing | With billing UI |
| Audit Log | Django admin covers this | With SuperAdmin portal |
| Loading Skeleton component | Use spinners initially | Post-launch polish |
| Pagination component | Scrolling works at low scale | When needed |
| Error Inline Cell Indicator | Toast/banner errors first | Post-launch polish |

---

## SHIP FIRST — MVP PAGES (14)

### Auth Pages (4)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 1 | **Login** | Email/password fields, Google OAuth button, "Forgot password" link | Default, Error (invalid credentials), Locked out (5 attempts, 15min) |
| 2 | **Signup** | Email/password/confirm fields, Google OAuth button, terms checkbox | Default, Validation errors (email exists, weak password, mismatch) |
| 3 | **Verify Email** | Confirmation message, resend button | Pending, Verified (redirect), Link expired (resend CTA) |
| 4 | **Forgot / Reset Password** | Email input (forgot), new password fields (reset) | Default, Email sent, Success, Link expired |

### Core Pages (6)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 5 | **Dashboard** | Hero metrics (views, engagement, reach), page list table, filters/sort/search, tabs (All Pages / Scheduled Queue / Failed Posts), token expiry banner, disconnect banner | Empty (CTA to connect FB), Populated, Filtered, Banner states |
| 6 | **Bulk Upload** | Page selector, two tabs (Media / Text), drag-drop upload zone, Airtable-style grid, auto-fill schedule controls, distribution dropdown, "Add to Queue" button, progress indicators | Empty, Uploading (progress bar), Processing (thumbnails), Ready (grid), Failed uploads banner |
| 7 | **Single Post Creation** | Page selector, media upload (or text-only), caption, thread-in-comments, date/time picker, IG toggle, Threads toggle, thumbnail selector (video), submit | New form, Validation errors, Submitting, Success |
| 8 | **Queue** | Unified grid (type, media, caption, IG/Threads toggles, schedule, drag handle), auto-fill schedule, distribution dropdown, bulk edit button, "Submit X posts" button | Empty, Populated, Reordering, Bulk selection, Preflight overlay |
| 9 | **Calendar** | Month/Week/Day views, post dots with status colors (gray=Scheduled, green=Published, yellow=Partial, red=Failed), page filter, status filter, drag-to-reschedule | Month/Week/Day views, Filtered, Drag feedback |
| 10 | **Failed Posts** | Failed/partial posts list, error reasons, retry buttons, platform-by-platform status | Empty, List with errors, Retrying |

### Management Pages (2)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 11 | **Page Settings** | Quiet hours toggle + time range, default posting interval (1h/2h/4h), auto-post to IG toggle, auto-post to Threads toggle, timezone selector | Default, Configured |
| 12 | **Connected IDs** | List of connected Facebook profiles, status per account, pages under each, reconnect/disconnect actions | All healthy, Expiring, Expired |

### Settings Pages (2)
| # | Page | Key Elements | States |
|---|------|-------------|--------|
| 13 | **Account Settings** | Profile info, email, password change, session list (device, location, last active), "Log out all devices" | Default |
| 14 | **Billing (Simplified)** | Current plan display, account count, "Contact us to upgrade" or Stripe Payment Link | Free, Paid |

---

## SHIP FIRST — MVP MODALS (8)

| # | Modal | Trigger | Key Elements |
|---|-------|---------|-------------|
| 1 | **Connect Facebook (OAuth)** | "Connect Facebook" CTA | OAuth flow, permission list, loading, success/failure |
| 2 | **Reconnect All** | Token expired banner | Single OAuth flow, restores all pages, loading, success |
| 3 | **Edit Scheduled Post** | Click post in calendar/queue | Caption, comments, media swap, thumbnail, schedule, IG/Threads toggles, Save/Cancel |
| 4 | **Delete Post Confirmation** | Delete action on post | Warning text, confirm/cancel |
| 5 | **Disconnect Page Confirmation** | Disconnect action on page | Scheduled post count warning, confirm/cancel |
| 6 | **Preflight Validation** | Before "Submit X posts" | Issues list (blockers + warnings), Fix/View/Skip actions, Fix All/Submit Anyway/Cancel |
| 7 | **Bulk Edit Captions** | Multi-select rows, "Bulk Edit" | Template/prefix/suffix/find-replace/clear, preview count, variables ({caption}, {date}, {count}) |
| 8 | **Video Thumbnail Selector** | Click video thumbnail in grid | 3 auto options (start/middle/end), custom upload, select/confirm |

---

## SHIP FIRST — MVP COMPONENTS (16)

| # | Component | Usage |
|---|-----------|-------|
| 1 | **App Shell (Sidebar + Header)** | All authenticated pages — sidebar nav, user menu, responsive |
| 2 | **Page List Table/Grid** | Dashboard — sortable columns, row actions, bulk select |
| 3 | **Filters + Search** | Dashboard, Calendar, Queue — dropdowns, search input, filter chips |
| 4 | **KPI Cards** | Dashboard — metric value, label, trend indicator |
| 5 | **Status Badge** | Throughout — Scheduled (gray), Published (green), Partial (yellow), Failed (red), Disconnected, Draft |
| 6 | **Button Set** | Throughout — Primary, Secondary, Danger, Disabled, Loading variants |
| 7 | **Modal Base** | All 8 modals — header, body, footer, close button, overlay |
| 8 | **Toast / Alert Banners** | Throughout — Success, Warning, Error, Info. Dismissible |
| 9 | **Upload Dropzone** | Bulk Upload, Single Post — drag-drop, file browser, format hints |
| 10 | **Progress Bar** | Bulk Upload — determinate (X of Y), stage labels |
| 11 | **Airtable-Style Grid** | Bulk Upload, Queue — scrollable, resizable columns, inline editing, row selection |
| 12 | **Drag Handle + Row Reorder** | Grid, Queue — grab handle, ghost row, drop zone highlight, schedule recalc |
| 13 | **Date/Time Picker** | Scheduling — date + time, timezone-aware |
| 14 | **Calendar Grid** | Calendar — Month/Week/Day, post count badges, status dots, drag targets |
| 15 | **Platform Toggle Checkboxes** | Grid, Single Post, Queue — FB (always on), IG checkbox, Threads checkbox, inline warnings |
| 16 | **Character Counter** | Caption/comment fields — live count, yellow warning near limit, red when exceeded |

---

## SHIP FIRST — EMPTY/ERROR STATES (6)

| # | State | Where |
|---|-------|-------|
| 1 | Empty dashboard (no pages connected) | Dashboard — CTA to connect Facebook |
| 2 | Empty queue (no posts scheduled) | Queue — CTA to bulk upload or create post |
| 3 | Upload errors banner (X files failed) | Bulk Upload — retry/skip actions |
| 4 | Token expiring banner (7 days) | Dashboard top — yellow warning + "Reconnect soon" |
| 5 | Pages disconnected banner | Dashboard top — red badge + "Reconnect All" CTA |
| 6 | Publishing locked state | Post edit — no edits while publishing |

---

## SHIP FIRST — NOTIFICATIONS (3)

| # | Type | Channel | Content |
|---|------|---------|---------|
| 1 | Token expiring (7 days / 1 day) | In-app banner + Email | Warning + "Reconnect" CTA |
| 2 | Page disconnected | In-app banner + Email | Red badge + "Reconnect All" |
| 3 | Post failed | In-app banner | Error details + retry action |

---

## MVP TOTALS

| Category | Full Phase 1 | MVP | Cut |
|----------|-------------|-----|-----|
| Customer Pages | 23 | **14** | -9 |
| SuperAdmin Pages | 11 | **0** | -11 |
| Modals | 12 | **8** | -4 |
| Reusable Components | 20 | **16** | -4 |
| Empty/Error States | 12 | **6** | -6 |
| Notifications | 6 | **3** | -3 |
| **TOTAL** | **84** | **47** | **-37** |

---

## POST-LAUNCH ADDITIONS (Ship Second — Weeks 2-6)

**Priority 1 (Week 2-3):**
- Billing & Subscription page + Upgrade Paywall modal + Payment Failed modal
- Invoices page
- Reporting Overview + Page Report

**Priority 2 (Week 4-5):**
- Partial Success Details modal
- Retry Confirmation modal
- Loading Skeleton + Pagination components
- Error Inline Cell Indicator
- Free tier gating UI

**Priority 3 (Week 6+):**
- SuperAdmin Portal (start with 3-4 critical screens: dashboard, tenant list, job monitor)
- Image Policy Checker integration
- Help / FAQ page
- Terms / Privacy pages (custom)
- 2FA setup flow
- Audit Log viewer

---

## DESIGN SPRINT SUGGESTION

| Sprint | Duration | Deliverables | Focus |
|--------|----------|-------------|-------|
| Sprint 1 | Week 1-2 | App Shell, Button Set, Modal Base, Status Badge, KPI Cards, Toast/Banners | Design system foundation |
| Sprint 2 | Week 2-3 | Login, Signup, Verify Email, Reset Password, Dashboard (empty + populated) | Auth + first screen |
| Sprint 3 | Week 3-4 | Airtable Grid, Upload Dropzone, Progress Bar, Drag Handle, Character Counter, Platform Toggles | Core components |
| Sprint 4 | Week 4-5 | Bulk Upload page, Single Post page, Queue page | Core workflows |
| Sprint 5 | Week 5-6 | Calendar, Failed Posts, Page Settings, Connected IDs, Account Settings | Remaining pages |
| Sprint 6 | Week 6-7 | All 8 modals, Date/Time Picker, Filters + Search | Modals + utilities |
| Sprint 7 | Week 7 | Empty states, error states, notifications, responsive review | Polish |

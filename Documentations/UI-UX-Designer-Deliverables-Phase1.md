# UI/UX Designer Deliverables — Phase 1 Complete List

## A. CUSTOMER-FACING PAGES (23 Pages)

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

## B. SUPERADMIN PORTAL PAGES (11 Pages)

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

## C. MODALS (12)

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

## D. REUSABLE UI COMPONENTS (20)

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

## E. EMPTY / EDGE / ERROR STATES TO DESIGN

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

## F. NOTIFICATION DESIGNS

| # | Type | Channel | Content |
|---|------|---------|---------|
| 1 | Token expiring (7 days) | In-app banner | Yellow warning + "Reconnect soon" |
| 2 | Token expiring (1 day) | Email | Urgency warning |
| 3 | Page disconnected | Email + in-app banner | Red badge + "Reconnect" CTA |
| 4 | Post failed | In-app banner (dashboard) | Error details + retry action |
| 5 | Payment failed | Email | Retry payment CTA |
| 6 | Payment successful | Email receipt | Invoice summary |

---

## TOTALS

| Category | Count |
|----------|-------|
| Customer Pages | 23 |
| SuperAdmin Pages | 11 |
| Modals | 12 |
| Reusable Components | 20 |
| Empty/Edge/Error States | 12 |
| Notification Designs | 6 |
| **TOTAL DESIGN DELIVERABLES** | **84** |

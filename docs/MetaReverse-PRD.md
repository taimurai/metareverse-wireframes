# MetaReverse — Product Requirements Document

**Version:** 1.0 (final pre-build)
**Date:** April 4, 2026
**Status:** Pre-build — wireframe complete
**Audiences:** Project Manager, Developer, UI/UX Designer

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Target Users & Personas](#3-target-users--personas)
4. [Assumptions & Constraints](#4-assumptions--constraints)
5. [Information Architecture](#5-information-architecture)
6. [User Roles & Permissions](#6-user-roles--permissions)
7. [Feature Specifications](#7-feature-specifications)
8. [Data Models & Entities](#8-data-models--entities)
9. [Content Lifecycle & State Machines](#9-content-lifecycle--state-machines)
10. [Third-Party Integrations](#10-third-party-integrations)
11. [Key User Flows](#11-key-user-flows)
12. [Notifications & Alerts](#12-notifications--alerts)
13. [Mobile & Responsive Behavior](#13-mobile--responsive-behavior)
14. [Design System](#14-design-system)
15. [Deferred to v2](#15-deferred-to-v2)
16. [Open Questions](#16-open-questions)
17. [Glossary](#17-glossary)

---

## 1. Executive Summary

### What MetaReverse Is

MetaReverse is a multi-page social media management platform for operators who manage large portfolios of Facebook, Instagram, and Threads pages — typically 20 to 100+ pages distributed across multiple teams or partners. It is a single web application providing content scheduling, approval workflows, team access control, and revenue intelligence for accounts at scale.

### Who It Is For

The primary operator is a business running monetized Facebook/Instagram page portfolios with separate teams assigned to different page groups (batches). Secondary users include content publishers, content approvers, analysts, and partner managers who each need scoped access to specific pages.

### Three Core Problems It Solves

1. **Content Operations at Scale** — Upload, schedule, and approve posts across many pages simultaneously with enforced approval workflows and automated publishing.
2. **Revenue Intelligence** — Track earnings, RPM, and monetization health per page, per Posting ID, and per batch without requiring financial transparency across the entire team.
3. **Team Access Control** — Grant scoped access to team members and partners (by batch) without exposing sensitive financial data, cross-batch page data, or operational configuration to unauthorized roles.

### Current Project Status

Wireframe complete, pre-build. An interactive wireframe is available. No production code exists at the time this PRD is written.

### Intended Tech Stack (inferred from documentation)

The documentation does not specify a framework. However, the design system references Tailwind CSS utility classes (`rounded-xl`, `p-5`) and the platform stores active batch and role state in `localStorage`. The tech stack is to be determined by the development team. The PRD is stack-agnostic.

---

## 2. Goals & Success Metrics

### Goal 1 — Enable content publishing at scale with zero manual errors

Operators must be able to upload, schedule, and publish posts to 20+ pages simultaneously without posts being missed, double-posted, or published at the wrong time.

**Success metrics:**
- Publish success rate >= 98% across all scheduled posts
- Zero incidents of duplicate content published (SHA-256 duplicate detection enforced)
- Failed posts resolved within the session they are flagged (retry and edit paths available inline)

### Goal 2 — Enforce access control so each team member sees only what they need

No publisher should see another batch's content, no analyst should see financial data, and no team member should be able to perform actions outside their role.

**Success metrics:**
- Zero UI exposure of revenue or RPM data to Publisher, Approver, or Analyst roles (verified by role-switched testing)
- Batch scoping enforced at data layer, not just UI layer
- Approver cannot access upload or settings screens

### Goal 3 — Surface revenue and performance data clearly for the Owner

The Owner must be able to review portfolio earnings, RPM, per-page performance, and Posting ID health in one place without exporting to spreadsheets.

**Success metrics:**
- All revenue KPIs accessible from Dashboard and Reports within 2 clicks
- Health score formula applied consistently to all Posting IDs
- Reports load within 3 seconds for portfolios of up to 100 pages

### Goal 4 — Approval workflows prevent unapproved content from going live

When a page has Approval Required enabled, no post can publish without explicit approval. Overdue posts must never silently publish with a stale timestamp.

**Success metrics:**
- Zero posts published on Approval-Required pages without explicit approve action
- Overdue approval fallback panel displayed 100% of the time when approving a post past its scheduled time

---

## 3. Target Users & Personas

### Persona 1 — The Owner (Taimur)

**Who they are:** The business owner running the entire page portfolio. Has full platform access.

**Primary job inside MetaReverse:** Monitor revenue and operations across all batches, resolve issues, configure pages and Posting IDs, manage the full team.

**What they need to accomplish:**
- Review portfolio RPM and earnings daily
- Onboard new pages and connected Facebook accounts
- Invite and manage all team members
- Approve or reject any post across any page
- Monitor Posting ID health and retire underperforming accounts
- Resolve billing and storage issues

**What they must never see or do:** Nothing is hidden from the Owner. They have full platform access.

**Day-in-the-life workflow:**
1. Open Dashboard, review today's KPI cards (Revenue, RPM, Network Views, Operations Pulse)
2. Check alert banners for disconnected pages or expiring tokens
3. Check Failed Posts for any publish failures from overnight queue
4. Review Reports > Earnings for weekly revenue movement
5. Spot-check By Posting ID for declining health scores
6. Approve any pending posts in the Approvals inbox
7. End of week: review Batches tab to compare partner performance

---

### Persona 2 — The Co-Owner

**Who they are:** A second operator-level user trusted with nearly all Owner capabilities.

**Primary job inside MetaReverse:** Operate the platform at the same level as the Owner with the exception of ownership transfer and Co-Owner management.

**What they need to accomplish:** Everything the Owner does except managing other Co-Owners and transferring ownership.

**What they must never see or do:**
- Cannot invite or remove other Co-Owners
- Cannot remove the primary Owner
- Cannot transfer ownership

**Day-in-the-life workflow:** Identical to the Owner's workflow. The Co-Owner is invited via Profile > Danger Zone, not via Team Members.

---

### Persona 3 — The Manager (Sarah / Ahmed / Aisha)

**Who they are:** A trusted partner lead or senior operator managing one or more batches. May be promoted to Global Manager automatically when assigned a third batch.

**Primary job inside MetaReverse:** Manage content, team, and page settings within their assigned batches. Monitor RPM and operational health for their scope.

**What they need to accomplish:**
- Upload, schedule, and approve content for their batch pages
- Manage team members within their batch scope
- Configure page settings, Posting IDs, and approval workflows within their batch
- Monitor RPM and performance in Reports (but not revenue or earnings)

**What they must never see or do:**
- Cannot view revenue, earnings, or payout data
- Cannot access billing settings
- Cannot invite another Manager (only Owner/Co-Owner can do that)
- Cannot view content or settings outside their assigned batches (Batch Manager)

**Day-in-the-life workflow:**
1. Open Dashboard, check Operations Pulse for their batch
2. Review Approvals inbox for pending posts
3. Check Queue for today's schedule
4. Resolve any Failed Posts for their batch pages
5. Weekly: review Reports > Results and Reports > Batches for performance

---

### Persona 4 — The Publisher (Fatima)

**Who they are:** A content creator responsible for uploading and scheduling posts. May be assigned to multiple batches.

**Primary job inside MetaReverse:** Upload media, write captions, and submit posts for approval or queue them for scheduling.

**What they need to accomplish:**
- Upload single posts or bulk batches to pages in their batch
- Submit drafts for approval or schedule them directly (if Approval Required is off)
- Monitor their own posts in Drafts, Queue, and Failed Posts
- Edit and resubmit rejected posts

**What they must never see or do:**
- Cannot see other publishers' posts
- Cannot approve or reject any post
- Cannot access Reports, Page Settings, Connected IDs, or Account Settings
- Cannot see revenue, RPM, or monetization data

**Day-in-the-life workflow:**
1. Open Drafts to see any rejected or change-requested posts from previous day
2. Edit and resubmit flagged drafts
3. Open Bulk Upload, select a page, upload today's content batch
4. Write captions, check character counters per platform
5. Save to Drafts or submit for approval
6. Check Queue to confirm scheduled posts for the day

---

### Persona 5 — The Approver (Sarah — stacked role)

**Who they are:** A reviewer responsible for approving or rejecting content before it publishes. May hold Publisher role simultaneously.

**Primary job inside MetaReverse:** Review submitted drafts and decide whether to approve, reject, or request changes.

**What they need to accomplish:**
- Review all pending posts in their batch's Approvals inbox
- Approve posts, optionally scheduling them at approval time if no schedule was set
- Reject or request changes with clear feedback
- Handle overdue approvals using the fallback panel

**What they must never see or do:**
- Cannot upload or create posts (unless also a Publisher)
- Cannot access Reports, Page Settings, Connected IDs, or Account Settings
- Cannot see revenue, RPM, or payout data

**Day-in-the-life workflow:**
1. Open Approvals, check Pending tab badge count
2. Review each pending post: caption, media, platforms, scheduled time
3. Approve, reject, or request changes
4. If a post is overdue (amber badge visible), use the fallback panel to reschedule or publish immediately
5. Read-only check of Queue to confirm approved posts are scheduled correctly

---

### Persona 6 — The Analyst (Nida)

**Who they are:** A reporting user who only needs to read performance data for their batch.

**Primary job inside MetaReverse:** Monitor content performance and engagement metrics for their assigned batch.

**What they need to accomplish:**
- View Reports > Overview, Results, and Batches for their batch
- Monitor views, interactions, reach, and engagement trends
- View Dashboard limited to Network Views and Operations Pulse

**What they must never see or do:**
- Cannot upload, approve, or manage anything
- Cannot access Earnings tab, revenue figures, RPM, or payout data
- Cannot access By Posting ID tab (blocked by product decision — exposes operator identity data)
- Cannot access any settings pages

**Day-in-the-life workflow:**
1. Open Reports > Overview, select batch and desired period
2. Review per-page performance grid
3. Switch to Results for time-series charts
4. Switch to Batches for cross-batch comparison

---

## 4. Assumptions & Constraints

### Platform Dependencies

- The platform requires an active Facebook Developer App with Graph API access to function
- Instagram and Threads posting is done via Facebook's Connected Business tools (not separate Instagram API credentials)
- All Posting IDs are Facebook user accounts (not Facebook Pages themselves) — the user account makes API calls on behalf of the page

### API Constraints

- **Facebook Graph API rate limits** prevent live-polling of follower counts for portfolios of 100+ pages. Follower counts are cached and refreshed every 24 hours.
- **Facebook API publish call timeout:** 60 seconds. If no response is received within 60 seconds, the post is marked as Temporary Issue in Failed Posts.
- **Token expiry:** Facebook user tokens expire and require periodic reconnection. Token state is tracked per Posting ID.
- **Checkpoints:** Facebook may flag Posting ID accounts for unusual activity, requiring identity verification before posting resumes.
- **Threads:** Scheduling is fully supported. Threads has no monetization support — revenue and RPM are not tracked for Threads posts.

### Business Constraints

- An Owner account is singular — there is one Owner per platform installation
- Co-Owner is the only other platform-wide role; it can only be invited via Profile > Danger Zone
- Managers cannot invite other Managers — only Owner or Co-Owner can
- Batch deletion is blocked if the batch contains any active pages
- Cannot enable Approval Required on a page if no Approver is assigned to that batch
- Cannot remove the last Approver from a batch with Approval Required active

### Known Facebook/Instagram/Threads API Limitations

- No real copyright scan integration in v1 — copyright scan UI is a mock state
- Visual similarity duplicate detection is deferred (computationally expensive)
- Performance-based Posting ID rotation algorithm is not defined — v1 defaults to Round Robin

### Decisions Deferred to v2

- Professional plan limits (page count, team seats, storage caps)
- Free trial and onboarding flow
- Performance-based rotation algorithm
- Visual similarity duplicate detection

---

## 5. Information Architecture

### Full Sitemap

```
/ (Dashboard)
  └── All roles — desktop and mobile

/upload (Bulk Upload)
  └── Owner, Co-Owner, Manager, Publisher — desktop only
  └── Step 1: Select Page
  └── Step 2: Upload Media
  └── Step 3: Add Captions
  └── Step 4: Schedule / Save to Drafts

/post (Single Post)
  └── Owner, Co-Owner, Manager, Publisher — desktop only

/drafts (Drafts)
  └── Owner, Co-Owner, Manager, Publisher, Approver — desktop only

/approvals (Approvals)
  └── Owner, Co-Owner, Manager, Approver — desktop only

/queue (Queue)
  └── Owner, Co-Owner, Manager, Publisher, Approver — desktop (mobile: view-only)

/failed-posts (Failed Posts)
  └── Owner, Co-Owner, Manager, Publisher — desktop and mobile

/reports (Reports — Overview)
  └── Owner, Co-Owner, Manager, Analyst — desktop and mobile
  └── /reports/results
  └── /reports/earnings (Owner, Co-Owner only)
  └── /reports/id-performance (Owner, Co-Owner, Manager only)
  └── /reports/batches
  └── /reports/page?id=... (Per-Page deep dive)

/settings/pages (Page Settings)
  └── Owner, Co-Owner, Manager — desktop only

/settings/connections (Connected IDs)
  └── Owner, Co-Owner, Manager — desktop only

/settings/account (Account Settings)
  └── Owner, Co-Owner, Manager — desktop only
  └── Tab: Profile
  └── Tab: Team Members
  └── Tab: Billing & Plan (Owner, Co-Owner only)
```

### Route Access Summary

| Route | Roles | Device |
|-------|-------|--------|
| `/` | All roles | Desktop + Mobile |
| `/upload` | Owner, Co-Owner, Manager, Publisher | Desktop only |
| `/post` | Owner, Co-Owner, Manager, Publisher | Desktop only |
| `/drafts` | Owner, Co-Owner, Manager, Publisher, Approver | Desktop only |
| `/approvals` | Owner, Co-Owner, Manager, Approver | Desktop only |
| `/queue` | Owner, Co-Owner, Manager, Publisher, Approver | Desktop + Mobile (view-only) |
| `/failed-posts` | Owner, Co-Owner, Manager, Publisher | Desktop + Mobile |
| `/reports` | Owner, Co-Owner, Manager, Analyst | Desktop + Mobile |
| `/reports/results` | Owner, Co-Owner, Manager, Analyst | Desktop + Mobile |
| `/reports/earnings` | Owner, Co-Owner | Desktop + Mobile |
| `/reports/id-performance` | Owner, Co-Owner, Manager | Desktop + Mobile |
| `/reports/batches` | Owner, Co-Owner, Manager, Analyst | Desktop + Mobile |
| `/reports/page?id=...` | Owner, Co-Owner, Manager, Analyst | Desktop + Mobile |
| `/settings/pages` | Owner, Co-Owner, Manager | Desktop only |
| `/settings/connections` | Owner, Co-Owner, Manager | Desktop only |
| `/settings/account` | Owner, Co-Owner, Manager | Desktop only |

---

## 6. User Roles & Permissions

Roles are stackable — one person can hold multiple roles simultaneously (e.g., Publisher + Approver on Batch A). Roles are per-batch except for Owner and Co-Owner, which are platform-wide.

---

### Owner

**Scope:** Platform-wide — all batches, all pages.

**Capabilities:**
- Full dashboard with all KPIs including revenue and RPM
- Create, schedule, and publish posts on any page
- Approve or reject any post on any page
- Add, remove, and configure all pages
- Manage all team members — invite, assign roles, change batches, remove
- View Earnings tab in Reports (revenue, RPM, payout data)
- Access all settings including billing, Connected IDs, and Account Settings
- See monetization status and payout status per page
- Invite Co-Owner via Profile > Danger Zone
- Retire Posting IDs

**Cannot do:** Nothing is blocked for the Owner.

**UI elements shown:** All elements. Revenue KPI card, RPM KPI card, Revenue column, Earnings tab, Monetization badges, Payout badges, all sidebar nav items, all report tabs.

---

### Co-Owner

**Scope:** Platform-wide — identical to Owner except for ownership management.

**Capabilities:**
- Full billing access
- Create, schedule, and publish posts on any page
- Approve or reject any post
- Add Managers and all other team member roles (not Co-Owner)
- Access all settings including Connected IDs

**Cannot do:**
- Transfer ownership
- Invite or remove other Co-Owners
- Remove the primary Owner

**How invited:** Via Owner's Profile > Danger Zone only. Not via Team Members.

**UI elements shown:** Same as Owner except Co-Owner management section in Danger Zone is hidden.

---

### Manager (Global Manager / Batch Manager)

**Scope:**
- **Batch Manager:** Assigned to 1–2 batches. Invite/remove team members for assigned batches only.
- **Global Manager:** Automatically assigned when a third batch is added. Invite/remove team members platform-wide.
- Auto-upgrade: When Owner or Co-Owner assigns a third batch to a Batch Manager, the platform automatically upgrades them to Global Manager. No manual flag required.

**Capabilities:**
- Dashboard with RPM visible, revenue hidden
- Create, schedule, and publish posts within scope
- Approve or reject posts (no separate Approver role needed)
- Add/remove pages and configure page settings within scope
- Manage team members within scope (invite, assign roles, remove)
- View all Reports tabs except Earnings
- See RPM and monetization status (not revenue or payout)

**Cannot do:**
- View revenue, Earnings tab, or payout data
- Access billing settings
- Invite another Manager (neither Global nor Batch)
- Invite Co-Owner

**UI elements shown:** RPM card, RPM column, monetization badges. Revenue card, Earnings tab, Revenue column, and Billing tab hidden.

---

### Publisher

**Scope:** Assigned batch(es) only — sees only pages in their batch.

**Capabilities:**
- Upload posts via Bulk Upload and Single Post (page selector shows only batch pages)
- View and manage their own drafts
- View their own scheduled posts in Queue
- View basic Dashboard (Network Views + Operations Pulse only)
- View Top Performers (views only, no revenue)
- View and retry their own failed posts in Failed Posts

**Cannot do:**
- Approve or reject posts
- See other publishers' posts in Drafts, Queue, or Failed Posts
- Access Reports, Page Settings, Connected IDs, or Account Settings
- See revenue, RPM, monetization status, or payout data

**UI elements shown:** Upload, Drafts, Queue, Failed Posts in sidebar. No revenue, RPM, or monetization UI.

---

### Approver

**Scope:** Assigned batch(es) only.

**Capabilities:**
- View Approvals inbox — only posts from their batch
- Approve or reject posts with optional notes
- Request changes with written feedback
- View all Drafts in their batch (not just their own)
- View Queue in their batch (read-only)
- View basic Dashboard for their batch

**Cannot do:**
- Upload or create posts (unless also a Publisher via stacked roles)
- Access Reports, Page Settings, Connected IDs, or Account Settings
- See revenue, RPM, or payout data
- Reschedule posts in Queue

**Self-approval:** A user holding both Publisher + Approver roles can approve their own posts. No self-approval prohibition.

**UI elements shown:** Approvals, Drafts, Queue (read-only) in sidebar. No upload, no settings, no revenue.

---

### Analyst

**Scope:** Assigned batch(es) only.

**Capabilities:**
- View Reports > Overview, Results, Batches for their batch
- View Dashboard (Network Views and Operations Pulse) for their batch

**Cannot do:**
- Upload, approve, or manage anything
- Access Earnings tab, revenue figures, RPM, or payout data
- Access By Posting ID tab (product decision — exposes operator identity data)
- Access any settings pages

**UI elements shown:** Reports in sidebar only (Overview, Results, Batches sub-tabs only). All operational nav items hidden.

---

### Permission Matrix

| Feature / UI Element | Owner | Co-Owner | Global Mgr | Batch Mgr | Publisher | Approver | Analyst |
|----------------------|-------|----------|------------|-----------|-----------|----------|---------|
| View Dashboard | Full | Full | Batch, no revenue | Batch, no revenue | Limited | Limited | Limited |
| Revenue KPI card | Yes | Yes | No | No | No | No | No |
| RPM KPI card | Yes | Yes | Yes | Yes | No | No | No |
| Network Views card | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Operations Pulse card | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Revenue column (All Pages table) | Yes | Yes | No | No | No | No | No |
| RPM column (All Pages table) | Yes | Yes | Yes | Yes | No | No | No |
| Monetization + payout badges | Yes | Yes | Yes | Yes | No | No | No |
| Top Performers — revenue column | Yes | Yes | Yes | Yes | No | No | No |
| Bulk Upload | Yes | Yes | Yes | Yes | Yes | No | No |
| Single Post | Yes | Yes | Yes | Yes | Yes | No | No |
| Drafts — own posts | Yes | Yes | Yes | Yes | Yes | No | No |
| Drafts — all batch posts | Yes | Yes | Yes | Yes | No | Yes | No |
| Approvals inbox | Yes | Yes | Yes | Yes | No | Yes | No |
| Approve/Reject posts | Yes | Yes | Yes | Yes | No | Yes | No |
| Queue — own posts | Yes | Yes | Yes | Yes | Yes | No | No |
| Queue — all batch posts (read) | Yes | Yes | Yes | Yes | No | Yes | No |
| Queue — reschedule/edit | Yes | Yes | Yes | Yes | No | No | No |
| Failed Posts — own | Yes | Yes | Yes | Yes | Yes | No | No |
| Failed Posts — all batch | Yes | Yes | Yes | Yes | No | No | No |
| Reports — Overview | Yes | Yes | Yes | Yes | No | No | Yes |
| Reports — Results | Yes | Yes | Yes | Yes | No | No | Yes |
| Reports — Earnings | Yes | Yes | No | No | No | No | No |
| Reports — By Posting ID | Yes | Yes | Yes | Yes | No | No | No |
| Reports — Batches | Yes | Yes | Yes | Yes | No | No | Yes |
| Page Settings | Yes | Yes | Yes | Yes | No | No | No |
| Connected IDs | Yes | Yes | Yes | Yes | No | No | No |
| Account Settings (all tabs) | Yes | Yes | Yes | Yes | No | No | No |
| Account Settings (Team tab only) | Yes | Yes | Yes | Yes | No | No | No |
| Billing & Plan tab | Yes | Yes | No | No | No | No | No |
| Invite team members | Yes | Yes | Scoped | Scoped | No | No | No |
| Invite Manager | Yes | Yes | No | No | No | No | No |
| Invite Co-Owner | Yes | No | No | No | No | No | No |
| Batch context banner | No | No | Yes | Yes | Yes | Yes | Yes |
| Multi-batch switcher (sidebar) | No | No | If 2+ batches | If 2+ batches | If 2+ batches | If 2+ batches | If 2+ batches |

---

## 7. Feature Specifications

### 7.1 Dashboard

**Route:** `/`
**Access:** All roles (content filtered by role)
**Device:** Desktop and Mobile

#### Purpose
Operational home screen providing a real-time health summary of all pages with KPIs, alert banners, queue status, and performance highlights.

#### Alert Banners
Displayed at the top of the page, above KPI cards. Conditionally shown based on system state.

- **Disconnected page warning:** "Money Matters is disconnected. Posts are paused." — shown when a page has no active Posting ID.
- **Token expiry warning:** "TechByte token expires in 5 days. Reconnect in Connected IDs." — shown when a Posting ID token expires within 7 days.
- Banners are batch-scoped: non-Owner users see only banners for pages in their active batch. A Publisher on Partner A will not see a Partner B warning.
- Multiple banners can stack vertically.
- Banners are dismissible per session.

#### KPI Period Selector
Four options: Today / Yesterday / Last 7 Days / Last 28 Days. All KPI cards update dynamically when the period changes. Default is Last 7 Days.

#### KPI Cards
Displayed as a top row of cards. Visible cards depend on role:

| Card | Owner/Co-Owner | Manager | Publisher/Approver/Analyst |
|------|----------------|---------|---------------------------|
| Revenue | Yes | No | No |
| RPM | Yes | Yes | No |
| Network Views | Yes | Yes | Yes |
| Operations Pulse | Yes | Yes | Yes |

- **Revenue card:** Total portfolio revenue for the selected period with percentage change vs prior period.
- **RPM card:** Average RPM across all monetized pages.
- **Network Views card:** Total views across all pages.
- **Operations Pulse card:** Quick health counts — scheduled posts today, failed posts count, expiring tokens count.

#### Page Health Widget
Grid of page cards. Scoped to user's active batch for non-Owner roles. Each card shows:
- Page avatar, name, follower count (24h cached — hover shows "last updated X hours ago" tooltip)
- Views (7-day) with trend arrow (up/flat/down)
- Queue count (next 24 hours)
- Monetization status badge (Owner/Manager only): Eligible / Restricted / Suspended / In Review
- Payout status badge (Owner/Manager only): Paid / Pending / On Hold
- Health indicator dot: green (healthy), amber (declining or expiring token), red (disconnected or failed)

**Empty state:** "No pages connected yet. Add a page in Page Settings."
**Loading state:** Skeleton cards matching grid layout.

#### All Pages Table
Sortable table of pages visible to the user's role. Labelled "Batch Pages" for non-Owner users.

Columns visible by role:

| Column | Owner/Co-Owner | Manager | Others |
|--------|----------------|---------|--------|
| Page | Yes | Yes | Yes |
| Followers | Yes | Yes | Yes |
| Revenue | Yes | No | No |
| RPM | Yes | Yes | No |
| Views (7d) | Yes | Yes | Yes |
| Queue | Yes | Yes | Yes |
| Status | Yes | Yes | Yes |

**Status column** shows the page status badge (Token Expired / Token Expiring / Needs Setup / Paused / Inactive / Ready).

Sorting: any column, ascending/descending. Default sort: Views descending.

**Empty state:** "No pages in this batch."

#### Top Performers
Shows top 3 posts by views in the selected period. All roles see this section.
- Shows: page avatar, caption snippet, views count, post type
- Revenue column visible to Owner and Manager only
- Publisher/Approver/Analyst see views only

#### Declining Performance
Shows pages with the largest percentage drop in RPM or views vs prior period. RPM column visible to Owner/Manager only. Other roles see views-based decline only.

---

### 7.2 Bulk Upload

**Route:** `/upload`
**Access:** Owner, Co-Owner, Manager, Publisher
**Device:** Desktop only

#### Purpose
4-step wizard for uploading and scheduling batches of content to a single page.

#### Step 1 — Select Page
- Searchable list of available pages
- Non-Owner roles see only pages in their active batch
- Each page shows: avatar, name, follower count, platforms enabled (FB/IG/TH), connection status
- Disconnected pages: displayed with disabled state (grayed out) and inline note "Disconnected — cannot post"
- Clicking a page selects it and advances to Step 2
- **Loading state:** Skeleton list items
- **Empty state (no pages in batch):** "No pages available. Contact your manager to get access."

#### Step 2 — Upload Media
- Drag-and-drop zone. Also clickable to open file picker.
- Accepted formats: JPG, PNG, GIF, MP4, MOV
- File limits: Images 10MB max, Videos 100MB max
- Each uploaded file appears in a list showing:
  - File name, size, and type (photo / reel)
  - Platform selection toggles (FB / IG / TH) — at least one required per file
  - Copyright scan status badge: Clear (green) / Possible Match (amber) / Match Found (red)
    - **Important:** Copyright scan is a mock UI state in v1. No real scan integration. The badge displays a static simulated state.
  - Duplicate detection warning: amber warning banner shown if the same file (by SHA-256 hash) already exists in Drafts or Queue for the selected page. Message: "This file is already in your Drafts/Queue for [Page Name]."
- Files can be individually removed via a remove button (X icon)
- On file upload error: red error badge per failed file + per-file Retry button. The user does not restart from Step 1.
- **Storage full block:** If storage limit is reached, uploads are blocked with banner: "Storage limit reached — upgrade your plan or delete unused media."
- "Continue" button active once at least 1 file is successfully uploaded

#### Step 3 — Add Captions
- Each file gets its own caption textarea
- Per-platform character counter shown below each textarea (only for active platforms on that file):
  - Facebook: X / 63,206 — green when under 80%, amber 80–99%, red over limit
  - Instagram: X / 2,200
  - Threads: X / 500
- Copyright scan result displayed per file
- Duplicate warning with amber border shown above flagged files
- Thread toggle (Facebook only): enables a comment chain input below the main caption
- "Continue" button active once all captions are filled for files with required captions

#### Step 4 — Schedule / Save to Drafts
- Auto-schedule slots derived from the selected page's Active Hours and post interval setting
- Blue info row: "Times shown in [TZ] — from [source]" with precedence note: "Page timezone → account timezone → platform default"
- Slot times shown in page's timezone (not operator's local time)
- Select one or more slots (multi-select)
- "Save to Drafts" button saves all files with captions and selected slots as draft posts
- Brief upload progress animation/spinner while saving
- **Success state:** Toast notification: "X posts saved to Drafts." Navigation stays on step 4 briefly then resets to Step 1.
- **Error state:** Toast: "Failed to save. Try again." — all selections preserved.

---

### 7.3 Single Post

**Route:** `/post`
**Access:** Owner, Co-Owner, Manager, Publisher
**Device:** Desktop only

#### Purpose
Create and schedule a single post with full control over media, caption, platforms, and timing.

#### Left Column — Editor
- **Page selector:** Dropdown to choose which page to post to. Filtered to active batch for non-Owner.
- **Media type tabs:** Photo / Reel / Text
- **Media upload:** Drag-drop or click. Single file. Same format/size limits as Bulk Upload.
- **Caption textarea:** Real-time per-platform character counters per active platform. Same counter logic as Bulk Upload.
- **Platform toggles:** Enable/disable FB, IG, TH independently. At least one required.
- **Schedule options:**
  - "Publish Now" — posts immediately on save
  - "Schedule" — reveals a date/time picker
  - Manual posts outside Active Hours display an orange warning: "This post is outside Active Hours — may underperform." Manual posts are not hard-blocked.
- **Thread/Comments section (Facebook only):** Expand to add up to 3 threaded comments, 8,000 characters each.

#### Right Column — Preview Sidebar
- Page info: avatar, name, category
- Active platform badges
- Live post preview updating as caption changes
- Character count warnings per platform
- Schedule summary ("Scheduled for [time] [timezone]" or "Publishing now")

#### Header Actions
- **Preview button:** Opens full-screen preview modal. Shows how the post looks on each active platform.
- **Publish Now / Add to Queue button:** Primary green CTA. Label changes based on schedule option:
  - "Publish Now" if immediate
  - "Add to Queue" if scheduled

#### States
- **Success:** Toast "Post added to Queue" or "Post published."
- **Error:** Toast "Failed to add to Queue. Try again."
- **Disconnected page selected:** Platform toggles for the disconnected platform are disabled with tooltip "Page disconnected."
- **Storage full:** Upload area blocked with same message as Bulk Upload.

---

### 7.4 Drafts

**Route:** `/drafts`
**Access:** Owner, Co-Owner, Manager, Publisher, Approver
**Device:** Desktop only

#### Purpose
View and manage all saved draft posts before they are submitted or scheduled.

#### Role Context Banner
Non-Owner users see a blue info banner at the top:
- Publisher: "Showing your drafts only — drafts you uploaded to [Batch Name]"
- Approver: "Showing all drafts in [Batch Name]"
- Manager: "Showing all drafts in [Batch Name]"

#### Scoping
- Publishers see only drafts they created
- Approvers and Managers see all drafts in their active batch
- Owner and Co-Owner see all drafts across all batches

#### Draft Card Display
Each draft shows: thumbnail, caption snippet, page name, platforms (FB/IG/TH badges), post type, created date, and current status badge.

#### Actions Per Draft
- **Edit:** Opens edit modal (caption, media, platforms, schedule). Available for all roles with edit permissions (Publisher edits own; Manager/Owner edit any).
- **Delete:** Removes draft with a confirmation dialog. Irreversible.
- **Schedule:** Opens date/time picker. On confirm, draft moves to Queue with Scheduled status.
- **Submit for Approval:** Sends draft to Approvals inbox. Publisher can submit without a schedule — the Approver sets the schedule at approval time.

#### Disconnected Page — Draft Behavior
If the draft's target page becomes disconnected after the draft was saved:
- Draft displays an amber warning badge: "Page disconnected — cannot be submitted or scheduled"
- Submit for Approval and Schedule buttons are disabled
- Delete is the only available action
- Draft is not auto-deleted — manual deletion required

#### Bulk Actions
Checkboxes on each draft card enable selection. Bulk action bar appears when 1+ drafts selected:
- Bulk Delete (with confirmation)
- Bulk Schedule (shared date/time picker)
- Bulk Submit for Approval

#### Empty State
"No drafts yet. Upload content to get started." with a link to Bulk Upload.

#### Loading State
Skeleton card grid matching the draft card layout.

---

### 7.5 Approvals

**Route:** `/approvals`
**Access:** Owner, Co-Owner, Manager, Approver
**Device:** Desktop only

#### Purpose
Review queue for posts requiring sign-off before publishing.

#### Sidebar Badge
A numeric badge on the Approvals sidebar item shows the count of pending approvals in the user's scope.

#### Filter Tabs
- **Pending** (default) — posts awaiting review
- **Approved** — posts that have been approved
- **Rejected** — posts that were rejected
- **Changes Requested** — posts sent back for edits

#### Post Card Display
Each post card shows:
- Thumbnail preview
- Full caption (expandable if long)
- Page name and avatar
- Platforms targeted
- Post type (photo/reel)
- Submitted by (team member name)
- Submitted timestamp
- Scheduled publish time
- **Overdue badge:** Amber badge "Overdue" shown if scheduled time has already passed
- Current status badge

#### Approval Actions
All actions appear in the action footer of the review modal (opened by clicking the post card):

**Approve:**
- If post is not overdue: marks post approved, optional note field, post moves to Queue. Toast: "Post approved."
- If post is overdue: normal Approve button is replaced by the Overdue Fallback Panel (see below).

**Reject:**
- Opens rejection reason modal with a required text field
- On confirm: post moves to Rejected tab, reason stored, publisher notified

**Request Changes:**
- Opens modal with a required text field
- On confirm: post returned to publisher as Draft (fully editable), original reason stored, publisher notified
- Publishers can resubmit unlimited times — no cap on resubmission attempts

#### Overdue Approval Fallback Panel
Shown when an approver attempts to approve a post whose scheduled time has already passed. Replaces the normal action footer inside the review modal.

Display:
- Amber warning: "Scheduled time has passed — this post was due [original scheduled time]"
- Two mutually exclusive radio options:
  1. **Reschedule to next Active Hours slot** (default selected) — queues post for next available Active Hours window. Shows the calculated time: e.g., "Tomorrow, 8:00 AM EST"
  2. **Publish immediately** — fires post immediately. If current time is outside Active Hours, shows orange warning: "Outside Active Hours — may underperform."
- Confirm button label updates dynamically:
  - "Approve & Reschedule to Tomorrow, 8:00 AM EST"
  - "Approve & Publish Now"
- Back button (← Back) returns to normal review view without committing

**Overdue + Active Hours Disabled:** If Active Hours is not enabled for the page and the post is overdue, the post enters a manual queue — it does not publish automatically. Owner or Manager must manually reschedule it.

#### Simultaneous Review Handling
If two approvers open the same post simultaneously and one acts first, the second sees: "Already reviewed by [Name] — [Approved/Rejected]". Action buttons (Approve / Reject / Request Changes) are disabled for the second reviewer.

#### Approver Removal Guards
- Cannot enable Approval Required on a page if no Approver is assigned to that batch. A guard popup appears: "No Approver assigned to this batch. Add an Approver before enabling approval required."
- Cannot remove the last Approver from a batch with Approval Required active on any page in that batch. Remove button is disabled with tooltip: "This batch has Approval Required active. Assign another Approver first."
- If an Approver is removed, their pending posts stay in the queue, visible to other eligible batch reviewers.

#### Empty State (Pending tab)
"No posts pending approval. Check back later."

---

### 7.6 Queue

**Route:** `/queue`
**Access:** Owner, Co-Owner, Manager, Publisher (own posts), Approver (batch, read-only)
**Device:** Desktop and Mobile (view-only on mobile)

#### Purpose
All scheduled posts awaiting publish, organized by page or date.

#### Role Context Banner
Non-Owner users see a blue info banner:
- Publisher: "Showing your posts only — posts you uploaded to [Batch Name]"
- Approver: "Showing all posts in [Batch Name]"

#### View Options
- Group by Page or Group by Date (toggle)
- Paginated by date at scale
- Search by caption (text search input)

#### Post Card Display
Each post shows: thumbnail, caption snippet, page name, platforms, scheduled time, and status badge.

**Status indicators:**
- **Scheduled** — blue dot. Awaiting publish time.
- **Publishing** — animated spinner. API call in progress.
- **Published** — green checkmark. Post is live.
- **Failed** — red badge. Publish attempt errored. (Link to Failed Posts.)
- **Paused** — gray left border. Post cannot publish because the Posting ID expired or page was disconnected mid-approval.
  - Sub-badge: "Posting ID expired" (red)
  - Sub-badge: "Publisher notified" (blue) if publisher has been notified
  - Resume button displayed — clicking Resume moves the post back to Scheduled status
  - Nothing auto-resumes — manual Resume always required
- **Reconnect Required** — Separate from Failed Posts. Authentication issue (token expired mid-publish). Does not appear in Failed Posts list. Shown in Queue with a reconnect action linking to Connected IDs.

#### Disconnected Page Behavior
When a page is disconnected:
- All its queued posts are auto-paused and grayed out
- Owner/Manager see an option to delete those posts
- Posts are not deleted automatically

#### Actions (Owner/Manager only)
- Edit post (opens edit modal)
- Delete / cancel scheduling (confirmation required)
- Reschedule (date/time picker)
- Bulk reschedule or bulk cancel

#### Publisher Actions
- View only — no edit, reschedule, or delete

#### Approver Actions
- Read-only view to monitor approved posts

---

### 7.7 Failed Posts

**Route:** `/failed-posts`
**Access:** Owner, Co-Owner, Manager, Publisher
**Device:** Desktop and Mobile

#### Purpose
Posts that failed to publish are auto-categorized here for resolution.

#### Scoping
- Publishers see only their own failed posts
- Managers and Owner/Co-Owner see all batch/all failed posts

#### Category Tabs

| Tab | Color | Description | Recovery Action |
|-----|-------|-------------|-----------------|
| Temporary Issue | Amber | API timeout (60s), rate limit | Retry |
| Reconnect Needed | Red | Token expired or account disconnected | Reconnect |
| Needs Editing | Purple | Content policy violation, media error | Edit & Requeue |

**Note:** Posts where the token expires mid-publish appear as Reconnect Required in Queue — they do not appear in Failed Posts.

#### Per-Post Display
- Thumbnail, caption, page, platforms
- Scheduled time, failed time
- Category badge with specific error message
- Action button

#### Actions
- **Retry:** Re-attempts publish immediately. Shows spinner then success/fail toast.
- **Reconnect:** Redirects to Connected IDs for the relevant account.
- **Edit & Requeue:** Opens edit modal. On save, post re-enters Queue with Scheduled status.

#### Bulk Actions
- Select multiple posts with checkboxes
- **Retry All** or **Retry Selected**: Shows a summary toast after attempt: "X succeeded, Y still failing."
- **Bulk Dismiss**: Removes posts from Failed Posts list (does not retry).

#### Empty State (per tab)
"No [category] failures. Your posts are publishing smoothly."

---

### 7.8 Reports

**Route:** `/reports` (and sub-routes)
**Access:** Owner, Co-Owner, Manager (no Earnings), Analyst (Overview, Results, Batches only)
**Device:** Desktop and Mobile

Shared controls across all report tabs:
- Page/Batch selector — scope to single page, all pages, or a batch
- Platform switcher — Facebook / Instagram / Threads
- Period toggle — 7 Days / 28 Days / 90 Days

#### 7.8a Reports — Overview (`/reports`)

Cross-portfolio performance summary.

**Revenue Summary Card (Owner/Co-Owner only):**
- Weekly revenue with % change
- Monthly revenue with % change
- Average RPM with change
- Total monetized views

**Per-Page Revenue Grid (Owner/Co-Owner):**
Each page card shows: revenue this period, RPM, views, growth %, monetization status, sparkline trend chart.

**Per-Page Views Grid (Manager/Analyst):**
Same layout without revenue/RPM columns.

**Recent Posts Section:**
Top performing posts across the portfolio sorted by views. Revenue column visible to Owner/Co-Owner/Manager only.

#### 7.8b Results (`/reports/results`)

Time-series charts for key metrics.

2-column chart grid:
- Views over time
- Interactions over time
- Reach over time
- Clicks over time

Each chart shows: current value, change %, line chart with date labels.

All charts respond to page/platform/period selectors.

#### 7.8c Earnings (`/reports/earnings`) — Owner/Co-Owner Only

Revenue-focused analytics. Hidden from all other roles.

**RPM Formula:** `RPM = (Total Revenue / Total Views) × 1000`. Revenue is the gross payout before platform cut.

**Earnings Type Tabs:**
- Total Revenue
- CPM Revenue
- Network Revenue
- Other Revenue

Each tab shows: current value + change %, large line chart, breakdown table (Page → Revenue → RPM → Views → Growth → Status).

**Top Earning Content:** List of highest-earning posts with earnings, views, page, and caption snippet.

#### 7.8d By Posting ID (`/reports/id-performance`) — Owner, Co-Owner, Manager only

Performance broken down by connected Facebook account. Intentionally blocked for Analyst role — exposes connected account names, emails, and User IDs.

**Per ID card:**
- Name, email, Facebook User ID
- Status badge (Active / Expired)
- Health score (0–100) with label: Healthy (70–100) / Declining (40–69) / Replace (0–39)
- Total reach, posts this month, trend indicator

**Health Score Formula:**
```
score = round((ID_reach_28d / max_reach_28d_on_account) × 100)
```
- `ID_reach_28d` — total reach for this Posting ID over the last 28 days
- `max_reach_28d_on_account` — highest 28-day reach of any Posting ID on the same account
- Scores are relative to the account's own best performer, not an absolute benchmark

**Expandable detail:** Weekly reach chart, top performing page for this ID, worst performing page, recommendation text.

#### 7.8e Batches (`/reports/batches`)

Cross-batch comparison. Per batch card shows:
- Batch name, page count
- Revenue (Owner/Co-Owner only), RPM (Owner/Manager), total views, growth %, engagement rate
- Health status and improvement recommendation
- 4-week revenue trend chart
- Portfolio contribution %

Pages within batch: grid table with revenue, RPM, views, growth, engagement, status.

#### 7.8f Per-Page Report (`/reports/page?id=...`)

Deep-dive for a single page. Linked from per-page cards across Reports.

**Header:** Page name, category, follower count, platform.

**KPI Cards (3-column):** Views, Viewers, Interactions (Reactions/Comments/Shares breakdown), Clicks, CTR %, Earnings (Owner/Co-Owner only).

**Posts Table:** All posts for the page.
- Columns: Post (thumbnail + caption), Type, Date, Views, Interactions, Clicks, Engagement %, CTR %, Earnings (Owner/Co-Owner only)
- 10 posts per page, paginated

---

### 7.9 Page Settings

**Route:** `/settings/pages`
**Access:** Owner, Co-Owner, Manager
**Device:** Desktop only

#### Purpose
Configure all settings for each managed page.

#### Page List
Each page shown in an expandable accordion card with a status badge:

| Status | Color | Condition |
|--------|-------|-----------|
| Token Expired | Red | Token expired or all Posting IDs expired |
| Token Expiring | Amber | Token expires within 7 days |
| Needs Setup | Orange | Auto-post off AND no posts this week |
| Paused | Gray | Auto-post off but has posted before |
| Inactive | Amber | Auto-post on but no posts this week |
| Ready | Green | Auto-post on and posting activity detected |

#### Per-Page Configuration Sections

**Auto-Post Settings:**
- Enable auto-post toggle
- Platform toggles (FB, IG, TH — independent)
- Post interval dropdown: 1, 2, 3, 4, 6, 8 hours
  - Interval anchor: first post fires at start of Active Hours. Subsequent posts fire exactly N hours after previous. Slots falling outside Active Hours are skipped; sequence resumes next day at start of Active Hours.
- Timezone selector
- Active Hours toggle: "Posts only sent during this window"
  - From time selector — Until time selector
  - Hard block: auto-scheduled posts outside Active Hours are held and fire at the next valid slot. Not a preference — a hard block.
  - Manual posts outside Active Hours: warning shown but not blocked.

**Posting IDs (Facebook Accounts):**
List of connected Facebook accounts used to post to this page:
- Name, email, Facebook User ID (masked), status, posts this week, avg reach, reach trend, last used, primary badge
- Rotation settings:
  - Rotate IDs toggle
  - Rotation mode: Round Robin / Performance-based
    - Performance-based in v1 defaults to Round Robin until algorithm ships. Selection is visible in UI but does not change behavior.
- Edit and Remove buttons per ID

**Approval Workflow:**
- Require Approval toggle
- Approvers list (read-only) — automatically shows all team members with Owner, Manager, or Approver role
- "Manage in Team Settings →" link
- Guard: Cannot enable Require Approval if no Approver assigned (popup directs to add Approver)
- Auto-publish is always ON — no manual publish trigger exists

**Page Team Section:**
Two sub-sections:
- **From Batch (read-only):** Members with access via batch assignment. Shows name, roles, "inherited" badge. Cannot be edited here.
- **Direct Access:** Members added directly to this page. Shows role and Remove button.
- Add options: "Add from team" (existing members) or "Invite by email" (inline form: name, email, role selector; Send Invite disabled until all fields filled).

---

### 7.10 Connected IDs

**Route:** `/settings/connections`
**Access:** Owner, Co-Owner, Manager
**Device:** Desktop only

#### Purpose
Manage Facebook user accounts connected to the platform for posting.

#### Per-Account Card
- Name, email, Facebook User ID (masked: 100089...)
- Role (owner/user)
- Pages managed (avatar grid)
- Connected date, last active
- Status: Active (green) / Expired (red) / Revoked

#### Checkpoint Alert
If a Facebook account is flagged:
- Red alert banner: reason + explanation
- "Verify identity on Facebook" action button

#### Page Stats Table (within account)
For each page this ID is used on: page name, posts this week, avg reach, reach trend, rotation slot, rotation enabled toggle.

#### Actions
- **Retire:** Stops the account from receiving new posts. Confirmation modal required. All historical data (reach, health score, post history, revenue) is preserved. "Disconnect" is not a concept in this product — Retire is the only removal action. Available to Owner, Co-Owner, and Manager.
- **Verify:** Opens Facebook verification flow for checkpointed accounts.
- **Edit settings:** Update account configuration.

#### Bulk Connect Flow
Clicking "+ Connect Facebook Account" opens a multi-step modal:

1. **OAuth Loading** — Facebook OAuth handshake animation (simulated 1.8s)
2. **Select Pages** — checklist of available Facebook pages. Already-connected pages grayed out with "Connected" badge. Select 1+ new pages.
3. **Importing** — progress bar
4. **Per-Page Setup** — one setup card per imported page:
   - Progress: "Setting up page 1 of X"
   - Batch selector (each page independently assigned)
   - Timezone selector
   - Post interval
   - "Next Page →" button
5. **Done** — success screen listing all newly connected pages

---

### 7.11 Account Settings

**Route:** `/settings/account`
**Access:** Owner, Co-Owner, Manager (Team tab only for all; Billing tab for Owner/Co-Owner)
**Device:** Desktop only

#### Tab 1 — Profile
- Name, email, profile picture upload
- Default timezone preference
- Email notification preferences
- Two-factor authentication toggle
- Account status and creation date
- **Danger Zone (Owner only):** Invite Co-Owner via email input.

#### Tab 2 — Team Members
Full team management. See Section 7.12.

#### Tab 3 — Billing & Plan (Owner/Co-Owner only)
- Current plan: Professional ($99/month)
- Plan feature list
- Usage stats: pages in use, team members, storage used/total
- Next billing date
- Payment method on file
- Upgrade/change plan button
- Invoice history table: date, amount, status, Download button

**Storage full:** Banner across upload screens when storage is full: "Storage limit reached — upgrade your plan or delete unused media." Hard block on all new uploads until storage is freed or plan upgraded.

**Storage accounting:** Only media files (video and images) count toward storage. Captions and metadata excluded. Draft media counts from moment of upload, not at publish time.

---

### 7.12 Team Management

**Route:** `/settings/account` (Team Members tab)
**Access:** Owner (full), Manager (within scope)
**Device:** Desktop only

#### Team Member List
Each member row:
- Name, email
- Role pills (e.g., Publisher + Approver)
- Batch pills (e.g., Partner A, Partner B)
- Status badge: Active or Pending Invitation
- Last active timestamp
- "You" badge on the logged-in user's own row — cannot be edited or removed by self

#### Editing a Member
Click expand chevron on any member row (not Owner or self):
- Roles section: checkboxes for each role (minimum 1 required)
- Batch Access section: checkboxes for each batch (minimum 1 required)
- Save Changes — success toast: "Member updated."
- Remove Member — confirmation dialog. On confirm: success toast "Member removed."

**Global Manager auto-upgrade:** When a third batch is checked for a Batch Manager, the platform automatically recognizes them as a Global Manager. No manual flag needed.

#### Pending Invitations
Pending member rows show Resend and Cancel buttons instead of the expand chevron. Resending generates a fresh 7-day invite link and immediately invalidates the old one.

#### Invite Member Modal
Click "Invite Member":
- Name field (required)
- Email field (required)
- Role selection — multi-select grid (Publisher, Approver, Analyst, Manager)
  - Manager role only shown to Owner/Co-Owner (Managers cannot invite other Managers)
  - Co-Owner role not in this modal — invited via Danger Zone only
- Batch selection — multi-select list
- Send Invite button: disabled until name, email, at least 1 role, and 1 batch filled
- On send: member added as Pending, toast: "Invite sent to [email]."

**Invite link expiry:** 7 days. After 7 days the link is dead — member must be reinvited.

#### Role Permissions Reference Table
Static read-only reference table below the member list showing all roles and capabilities. For operator reference during role assignment.

---

### 7.13 Role Switcher / Batch Switcher

#### Role Switcher (Wireframe Demo Tool)
Located at the bottom of the sidebar. Accessible to operator/presenter for demo purposes.

1. Click role pill in sidebar bottom
2. Modal opens:
   - Switch Role: buttons for Owner, Manager, Publisher, Approver, Analyst
   - Batch Scope (non-Owner): select which batch to simulate
3. Selecting role + batch immediately updates the entire UI:
   - Sidebar items collapse/expand
   - KPI cards show/hide
   - Batch context banner appears/hides
   - Upload page selector filters to batch pages
4. Role and batch saved in localStorage, persist across navigations

#### Multi-Batch Switcher (Production Feature)
Users assigned to more than one batch see a batch switcher in the sidebar, in the same area as the role switcher pill.

- Displays the currently active batch name
- Clicking opens a popover listing all batches assigned to the user
- One click switches the active batch
- Switching updates all scoped views globally: Upload page selector, Drafts, Queue, Approvals, Dashboard, Reports
- Active batch saved in localStorage and persists within the session
- Batch Context Banner updates to reflect the active batch

Users with only one batch do not see the switcher — only a static non-interactive Batch Context Banner.

---

## 8. Data Models & Entities

### Page

| Field | Type | Notes |
|-------|------|-------|
| id | string | Internal UUID |
| name | string | Display name |
| batch_id | string | FK to Batch |
| platforms | string[] | ["fb", "ig", "th"] |
| follower_count | integer | Cached, refreshed every 24h |
| follower_count_updated_at | datetime | Last cache refresh |
| timezone | string | e.g., "America/New_York" |
| post_interval | integer | Hours: 1, 2, 3, 4, 6, 8 |
| auto_post_enabled | boolean | |
| active_hours_enabled | boolean | |
| active_hours_from | time | e.g., "08:00" |
| active_hours_until | time | e.g., "20:00" |
| require_approval | boolean | |
| rotation_enabled | boolean | |
| rotation_mode | enum | "round_robin" / "performance" (v1 defaults round_robin) |
| monetization_status | enum | "eligible" / "restricted" / "suspended" / "in_review" |
| payout_status | enum | "paid" / "pending" / "on_hold" |
| status | enum | Computed: "token_expired" / "token_expiring" / "needs_setup" / "paused" / "inactive" / "ready" |

### Batch

| Field | Type | Notes |
|-------|------|-------|
| id | string | Internal UUID |
| name | string | e.g., "Partner A — Lifestyle" |
| color | string | Hex color token |
| pages | Page[] | Pages in this batch |

**Deletion constraints:** Batch cannot be deleted if it contains active pages OR if any team member has active drafts in that batch. Both conditions must be cleared before deletion is permitted. The delete button is greyed out with a tooltip indicating which condition is blocking.

### Post

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| page_id | string | FK to Page |
| batch_id | string | FK to Batch (denormalized for scoping) |
| created_by | string | FK to TeamMember |
| media_url | string | Stored media file URL |
| media_type | enum | "photo" / "reel" / "text" |
| file_hash | string | SHA-256 hash for duplicate detection |
| caption_fb | string | |
| caption_ig | string | |
| caption_th | string | |
| platforms | string[] | Active platforms for this post |
| thread_comments | string[] | Up to 3 FB thread comments |
| state | enum | See Content Lifecycle |
| scheduled_at | datetime | Null if no schedule set |
| approved_by | string | FK to TeamMember |
| approved_at | datetime | |
| rejected_reason | string | |
| changes_requested_note | string | |
| failed_category | enum | "temporary" / "reconnect_needed" / "needs_editing" |
| failed_error_message | string | |
| failed_at | datetime | |
| published_at | datetime | |
| copyright_scan_status | enum | "clear" / "possible_match" / "match_found" (mock in v1) |
| created_at | datetime | |
| updated_at | datetime | |

### Draft

A Draft is a Post with state = "draft". No separate entity.

### PostingID

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| account_id | string | FK to ConnectedAccount |
| page_id | string | FK to Page |
| facebook_user_id | string | Masked in UI |
| name | string | Account display name |
| email | string | |
| status | enum | "active" / "expired" / "revoked" / "retired" |
| rotation_slot | integer | Order in rotation |
| is_primary | boolean | |
| connected_at | datetime | |
| last_active_at | datetime | |
| posts_this_week | integer | |
| avg_reach | float | |
| reach_trend | enum | "up" / "down" / "flat" |
| reach_28d | float | Used in health score |
| health_score | integer | Computed 0–100 |
| is_retired | boolean | Once retired, never un-retired |

### TeamMember

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| name | string | |
| email | string | |
| roles | enum[] | ["owner", "co_owner", "manager", "publisher", "approver", "analyst"] |
| batch_ids | string[] | Batches this member is assigned to |
| status | enum | "active" / "pending" |
| invite_token | string | 7-day expiry token |
| invite_expires_at | datetime | |
| last_active_at | datetime | |
| created_at | datetime | |

### Report (aggregated data, not a persisted entity per post)

Reports are computed queries over Post, PostingID, and Page data. No separate Report entity. Key computed fields:
- `RPM = (revenue / views) × 1000` — revenue is gross payout
- `health_score = round((ID_reach_28d / max_reach_28d_on_account) × 100)`

### HealthScore

Computed per PostingID, not stored as a separate entity. Computed on demand from reach data.

### Approval

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| post_id | string | FK to Post |
| reviewed_by | string | FK to TeamMember (null until reviewed) |
| action | enum | "approved" / "rejected" / "changes_requested" |
| note | string | Optional |
| reviewed_at | datetime | |
| is_overdue | boolean | Computed: scheduled_at < reviewed_at |

### InviteLink

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| team_member_id | string | FK to TeamMember |
| token | string | Unique random token |
| expires_at | datetime | 7 days from creation |
| created_at | datetime | |
| invalidated_at | datetime | Set when resend is triggered |

---

## 9. Content Lifecycle & State Machines

### All Post States

| State | Meaning | Visible to |
|-------|---------|-----------|
| Draft | Saved, not yet submitted or scheduled | Creator (Publisher), Approver/Manager in batch, Owner |
| Submitted | Submitted for approval, awaiting review | Approver, Manager, Owner |
| Pending Approval | In the Approvals inbox | Approver, Manager, Owner |
| Approved | Approved; waiting to be queued | Not a stable visible state — transitions immediately |
| Queued/Scheduled | Approved and queued, waiting for publish time | Publisher (own), Approver/Manager (batch), Owner |
| Paused | Queued but cannot publish — Posting ID expired or page disconnected | Publisher (own), Manager, Owner |
| Reconnect Required | Authentication expired mid-publish | Manager, Owner |
| Publishing | API call in flight | Manager, Owner |
| Published | Successfully posted | All roles with Queue/Reports access |
| Rejected | Reviewed and rejected | Creator (Publisher), Manager, Owner |
| Changes Requested | Returned to publisher with notes | Creator, Manager, Owner |
| Failed — Temporary Issue | Publish failed: API timeout or rate limit | Publisher (own), Manager, Owner |
| Failed — Reconnect Needed | Publish failed: token expired | Manager, Owner (not Publisher for reconnect actions) |
| Failed — Needs Editing | Publish failed: policy violation or media error | Publisher (own), Manager, Owner |

### State Transition Diagram

```
[Upload / Single Post]
        ↓
     DRAFT ←──────────────────── REJECTED
        ↓                              ↑
  (Submit for Approval)         (Reject action)
        ↓                              │
  PENDING APPROVAL ──────────────────→ ┘
        ↓
  (Approve action)
        ↓
  QUEUED / SCHEDULED ←── (Reschedule by Owner/Manager)
        ↓
  (Posting ID expires while queued)
        ↓
     PAUSED ──→ (Manual Resume by Owner/Manager) ──→ QUEUED
        ↓ (if page disconnected, stays Paused until reconnected + manual Resume)

  QUEUED ──→ PUBLISHING ──→ PUBLISHED
                    ↓
              (60s timeout or API error)
                    ↓
         FAILED (Temporary Issue / Reconnect Needed / Needs Editing)
                    ↓
         (Retry) ──→ PUBLISHING
         (Edit & Requeue) ──→ QUEUED
                    ↓
  PUBLISHING ──→ (token expires mid-call) ──→ RECONNECT REQUIRED (in Queue)

  PENDING APPROVAL ──→ (Changes Requested) ──→ DRAFT (publisher edits, resubmits)
  PENDING APPROVAL ──→ (Overdue: no Active Hours) ──→ MANUAL QUEUE
```

### Transition Triggers

| From | To | Triggered By |
|------|----|-------------|
| (New upload) | Draft | Publisher, Manager, Owner |
| Draft | Pending Approval | Publisher (Submit), Manager/Owner (direct submit) |
| Draft | Queued | Manager, Owner (direct schedule without approval) |
| Pending Approval | Approved → Queued | Approver, Manager, Owner |
| Pending Approval | Rejected | Approver, Manager, Owner |
| Pending Approval | Changes Requested → Draft | Approver, Manager, Owner |
| Queued | Paused | System (Posting ID expires) |
| Paused | Queued | Manager, Owner (manual Resume) |
| Queued | Publishing | System (at scheduled time) |
| Publishing | Published | System (API success) |
| Publishing | Failed | System (API error or 60s timeout) |
| Publishing | Reconnect Required | System (token expires during call) |
| Failed | Publishing | Manager, Owner, Publisher (Retry) |
| Failed | Queued | Manager, Owner, Publisher (Edit & Requeue) |
| Rejected | Draft | System (automatic on rejection) — Publisher must edit and resubmit |

### State-Specific Rules

- **Auto-publish is always ON.** There is no manual publish trigger. Once a post reaches Queued state with a scheduled time, it publishes automatically at that time.
- **Paused posts never auto-resume.** Manual Resume is always required.
- **Rejected posts return to Draft.** The publisher can resubmit unlimited times.
- **Reconnect Required is a Queue state, not a Failed Posts category.** It is handled via Connected IDs, not the Failed Posts screen.

---

## 10. Third-Party Integrations

### Facebook Graph API

**Purpose:** Post content (photo, video, text) to Facebook Pages; retrieve page stats (views, reach, engagement, revenue, RPM); manage Posting ID token lifecycle.

**Auth method:** OAuth 2.0 via Facebook Login. Long-lived user access tokens for Posting IDs. Tokens expire periodically and must be refreshed by reconnecting the account.

**Key actions:**
- `POST /v{n}/{page-id}/feed` — text and photo posts
- `POST /v{n}/{page-id}/videos` — video/reel posts
- `GET /v{n}/{page-id}/insights` — views, reach, engagement metrics
- `GET /v{n}/me/accounts` — fetch pages accessible to a user account (used in Bulk Connect flow)

**Known constraints:**
- Rate limits prevent live follower count polling at 100+ pages — 24h cache enforced
- API publish calls timeout after 60 seconds — trigger Temporary Issue in Failed Posts
- Token expiry requires user action (cannot be refreshed silently after a certain point)
- Checkpoint events (unusual activity flags) block posting until identity verification

**Failure handling:**
- 60s timeout → Failed Posts (Temporary Issue) with message "Publish timeout — retry."
- Token expired before publish → Reconnect Needed in Failed Posts
- Token expired mid-publish → Reconnect Required state in Queue (not Failed Posts)
- Checkpoint detected → Red alert banner in Connected IDs with "Verify identity on Facebook" CTA

### Instagram (via Facebook Connected Business)

**Purpose:** Post photo and reel content to Instagram Business accounts connected to Facebook Pages. Retrieve Instagram-specific metrics.

**Auth method:** Same OAuth flow as Facebook — Instagram accounts linked via Facebook Business Manager.

**Key actions:** Same Graph API endpoints, Instagram-specific paths.

**Known constraints:**
- Instagram caption max: 2,200 characters
- No separate Threads integration — Threads handled below

**Failure handling:** Same as Facebook.

### Threads API

**Purpose:** Post text and media to Threads accounts linked to Instagram.

**Auth method:** Threads API (Meta), connected via same OAuth flow.

**Key actions:**
- Create and publish Threads posts
- Schedule Threads posts (full parity with Facebook and Instagram scheduling)

**Known constraints:**
- Threads caption max: 500 characters
- **Threads has no monetization.** Revenue and RPM are never tracked for Threads posts.
- No earnings data available for Threads.

**Failure handling:** Same retry/categorization logic as Facebook and Instagram.

---

## 11. Key User Flows

### Flow 1 — Bulk Upload & Schedule

1. Navigate to Bulk Upload (`/upload`)
2. Step 1: Search for and select the target page. Non-Owner roles see only batch pages. Disconnected pages are shown disabled.
3. Step 2: Drag-drop or click to upload media. Toggle platforms per file. Review copyright scan badge (mock in v1).
4. If a file triggers duplicate detection (SHA-256 match in Drafts/Queue): amber warning shown. User can remove the file or proceed with acknowledgment.
5. If a file fails to upload: red error badge on that file, per-file retry button. Other files unaffected.
6. If storage is full: uploads blocked with upgrade prompt. Flow cannot proceed.
7. Step 3: Fill captions per file. Monitor per-platform character counters. Add Facebook thread comments if needed.
8. Step 4: Select auto-schedule slots (displayed in page timezone). Click "Save to Drafts."
9. Toast: "X posts saved to Drafts." Posts appear in Drafts.

**Alternate path — Approval Required enabled on page:**
After saving to Drafts, publisher must open Drafts and click "Submit for Approval" on each post (or use bulk submit). Posts move to Approvals inbox.

**Alternate path — No approval required:**
Publisher can click "Schedule" from Drafts to move directly to Queue.

---

### Flow 2 — Single Post Creation

1. Navigate to Single Post (`/post`)
2. Select page from dropdown (filtered by batch)
3. Select media type tab (Photo / Reel / Text)
4. Upload media file (or write text only)
5. Toggle platform destinations (FB / IG / TH)
6. Write caption; monitor character counters
7. Select "Publish Now" or "Schedule" with date/time
8. If schedule is outside Active Hours: orange warning shown but not blocked
9. Click "Add to Queue" / "Publish Now"
10. Toast: "Post added to Queue" or "Post published."

---

### Flow 3 — Approval Workflow

**Standard approval:**
1. Publisher submits a draft for approval (Drafts → Submit for Approval)
2. Post moves to Approvals inbox under Pending tab
3. Badge count increments in sidebar for eligible reviewers
4. Approver (or Manager/Owner) opens Approvals, clicks the post card
5. Reviews caption, media, platforms, and scheduled time
6. Options:
   - **Approve (not overdue):** Post moves to Queue. Optional note. Toast: "Post approved."
   - **Reject:** Opens rejection reason modal. Post returns to Rejected tab. Publisher notified.
   - **Request Changes:** Opens text modal. Post returns to publisher as Draft. Publisher edits and resubmits unlimited times.

**Overdue approval:**
7. Post has an amber "Overdue" badge — scheduled time has passed
8. Clicking Approve opens the Overdue Fallback Panel instead of normal approval
9. Two options presented:
   - **Reschedule to next Active Hours slot** (default): Post queued for next valid slot
   - **Publish immediately**: Post fires immediately; orange warning if outside Active Hours
10. Approver selects option and clicks confirm ("Approve & Reschedule" or "Approve & Publish Now")
11. Back button available to return to normal review without committing

**Simultaneous review race condition:**
- Two approvers open the same post simultaneously
- First to click an action wins — the action completes normally
- Second approver sees: "Already reviewed by [Name] — [Action]" with all action buttons disabled

**Overdue + Active Hours disabled:**
- Post enters manual queue
- Owner/Manager must manually reschedule it before it publishes

---

### Flow 4 — Failed Post Resolution

1. Navigate to Failed Posts (`/failed-posts`)
2. Posts auto-categorized:
   - **Temporary Issue (amber):** Click Retry. Spinner shows. Success toast: "Post republished." Post returns to Queue or Published. Failure toast: "Retry failed. Error: [message]."
   - **Reconnect Needed (red):** Click Reconnect → redirected to Connected IDs for the relevant account → reconnect via Facebook OAuth → return to Failed Posts → Retry
   - **Needs Editing (purple):** Click Edit & Requeue → edit modal opens → fix caption/media → Save → post re-enters Queue
3. Bulk retry: Select multiple Temporary Issue posts → Retry Selected → summary toast: "X succeeded, Y still failing."

---

### Flow 5 — Reconnect Required Resolution

1. Post in Queue shows Reconnect Required status (token expired mid-publish)
2. Owner/Manager sees the post with a Reconnect action button
3. Click Reconnect → redirect to Connected IDs
4. Find the flagged account → Verify or reconnect via OAuth
5. Return to Queue → post status updates
6. Manually trigger retry or reschedule as appropriate

---

### Flow 6 — Revenue Review (Owner)

1. Open Dashboard → review today's Revenue KPI, RPM, Network Views
2. Navigate to Reports → Overview
3. Revenue Summary Card shows weekly and monthly totals with % change
4. Per-page revenue grid shows per-page earnings, RPM, and sparklines
5. Click Earnings tab for full breakdown by type (Total / CPM / Network / Other)
6. Sort Earnings table by revenue or RPM to find top and bottom performers
7. Navigate to By Posting ID tab to review health scores
8. Navigate to Batches tab to compare partner performance
9. If a Posting ID has a low health score, navigate to Connected IDs to retire it

---

### Flow 7 — Configure a New Page

1. Navigate to Page Settings (`/settings/pages`)
2. Click Add Page
3. Connect via Facebook OAuth
4. Page appears in list with "Needs Setup" status
5. Expand page accordion
6. Enable auto-post toggle
7. Select platforms (FB / IG / TH)
8. Set post interval
9. Set timezone
10. Enable Active Hours and set window
11. Add Posting IDs (Facebook accounts) — either from existing Connected IDs or add new
12. Enable rotation if multiple IDs added; set rotation mode
13. Enable Approval Required if needed (guard fires if no Approver assigned)
14. Save settings — page status updates to Ready

---

### Flow 8 — Bulk Connect Facebook Pages

1. Navigate to Connected IDs (`/settings/connections`)
2. Click "+ Connect Facebook Account"
3. OAuth Loading modal (1.8s simulation)
4. Select Pages modal: checklist of Facebook pages. Already-connected pages grayed out with "Connected" badge.
5. Select new pages, click "Import X Pages"
6. Progress bar modal
7. Per-Page Setup — one at a time:
   - "Setting up page 1 of X"
   - Assign to batch
   - Set timezone
   - Set post interval
   - "Next Page →"
8. Done screen lists all newly connected pages
9. Pages now visible in Page Settings with "Needs Setup" status

---

### Flow 9 — Invite a Team Member

1. Navigate to Account Settings → Team Members
2. Click "Invite Member"
3. Enter name and email
4. Select role(s) — Manager option only visible to Owner/Co-Owner
5. Select batch(es)
6. Click Send Invite (disabled until all required fields filled)
7. Toast: "Invite sent to [email]."
8. Member appears as Pending in list
9. If not accepted within 7 days: Owner clicks Resend. New 7-day link generated, old link invalidated.
10. On acceptance: status changes to Active.

---

### Flow 10 — Retire a Posting ID

1. Navigate to Connected IDs
2. Find the Posting ID to retire
3. Click Retire button
4. Confirmation modal: "Retiring this ID will stop it from receiving new posts. All historical data is preserved."
5. Click confirm
6. Posting ID status updates to Retired. No longer receives new posts.
7. All historical reach, health score, post history, and revenue data remains in Reports.
8. Health score continues to be visible in By Posting ID report tab.

---

### Flow 11 — Multi-Batch User Switching Active Batch

1. User (e.g., Fatima) is assigned to Partner A — Lifestyle and Partner B — Education
2. Current active batch is displayed in the sidebar bottom and in the Batch Context Banner at top of page
3. Click batch switcher in sidebar
4. Popover opens listing both batches
5. Click "Partner B — Education"
6. Active batch switches immediately
7. All scoped views update:
   - Batch Context Banner: "Partner B — Education · History Uncovered, TechByte, Money Matters"
   - Drafts: shows only Partner B drafts
   - Queue: shows only Partner B posts
   - Approvals: shows only Partner B pending approvals
   - Upload page selector: shows only Partner B pages
   - Dashboard: filtered to Partner B
   - Reports: filtered to Partner B
8. Active batch saved in localStorage, persists until switched again

---

## 12. Notifications & Alerts

### Alert Banners (Dashboard — top of page)

| Trigger | Message | Recipient | Location | Dismissible |
|---------|---------|-----------|----------|-------------|
| Page has no active Posting ID | "[Page Name] is disconnected. Posts are paused." | Owner, Manager (in scope), Publisher (in scope) | Dashboard top | Yes, per session |
| Posting ID token expires within 7 days | "[Page Name] token expires in X days. Reconnect in Connected IDs." | Owner, Manager (in scope) | Dashboard top | Yes, per session |
| Storage full | "Storage limit reached — upgrade your plan or delete unused media." | Owner, Co-Owner | Upload screens | No — persists until resolved |

### Sidebar Badge

| Trigger | Badge Location | Recipient |
|---------|----------------|-----------|
| Pending approval count > 0 | Approvals nav item | Owner, Co-Owner, Manager, Approver |

### Toast Notifications

| Trigger | Message | Duration |
|---------|---------|----------|
| Draft(s) saved | "X posts saved to Drafts." | 3s |
| Post added to Queue | "Post added to Queue." | 3s |
| Post published | "Post published." | 3s |
| Post approved | "Post approved." | 3s |
| Post rejected | "Post rejected." | 3s |
| Changes requested | "Changes requested — returned to publisher." | 3s |
| Member invited | "Invite sent to [email]." | 3s |
| Member updated | "Member updated." | 3s |
| Member removed | "Member removed." | 3s |
| Retry succeeded | "Post republished." | 3s |
| Retry failed | "Retry failed. Error: [message]." | 5s |
| Bulk retry summary | "X succeeded, Y still failing." | 5s |
| Posting ID retired | "Posting ID retired. Historical data preserved." | 3s |
| Invite resent | "New invite sent. Previous link invalidated." | 3s |

### Inline Warnings

| Trigger | Message | Location | Dismissible |
|---------|---------|----------|-------------|
| Draft target page disconnected | "Page disconnected — cannot be submitted or scheduled" | Draft card (amber badge) | No — persists |
| Post outside Active Hours (manual) | "This post is outside Active Hours — may underperform." | Single Post, Queue reschedule | Yes |
| Overdue approval | "Scheduled time has passed — this post was due [original time]." | Approvals — review modal | No |
| Overdue + publish immediately outside Active Hours | "Outside Active Hours — may underperform." | Approval fallback panel | No |
| Duplicate file detected | "This file is already in your Drafts/Queue for [Page Name]." | Bulk Upload Step 2 (amber border) | User can remove file |
| File upload error | "Upload failed. [Retry]" | Per-file badge in Bulk Upload Step 2 | Per-file retry |
| Storage full on upload attempt | "Storage limit reached — upgrade your plan or delete unused media." | Bulk Upload, Single Post | No |
| Simultaneous review already acted on | "Already reviewed by [Name] — [Action]." | Approvals modal | No — informational |
| Batch deletion blocked (active pages) | "Reassign all pages before deleting this batch." | Batch management (tooltip on disabled delete button) | N/A |
| Batch deletion blocked (active drafts) | "Team members have active drafts in this batch. Clear drafts before deleting." | Batch management (tooltip on disabled delete button) | N/A |
| Enable Approval Required without Approver | "No Approver assigned to this batch. Add an Approver before enabling approval required." | Page Settings — guard popup | Dismissed by closing popup |
| Remove last Approver while Approval Required active | "This batch has Approval Required active. Assign another Approver first." | Team Management (tooltip on disabled remove button) | N/A |
| Facebook checkpoint on Connected ID | "[Reason + explanation]" + "Verify identity on Facebook" CTA | Connected IDs — red alert banner | No — persists until resolved |

### Email Notifications

Transactional email is in scope for v1. The platform sends emails for the following events. Email service provider is to be selected by the development team (e.g., SendGrid, Resend, Postmark).

| Trigger | Recipient | Subject / Content |
|---------|-----------|-------------------|
| Team invite sent | Invited user (email address entered in invite form) | Invite link to join MetaReverse + role and batch they've been assigned. Link expires in 7 days. |
| Invite resent | Invited user | New invite link. Previous link has been invalidated. |
| Post rejected | Publisher who submitted the post | Post title/thumbnail + rejection reason provided by the reviewer |
| Changes requested | Publisher who submitted the post | Post title/thumbnail + change request note from the reviewer |
| Post approved | Publisher who submitted the post | Confirmation that post was approved and is now in Queue |
| Approver assigned to batch | New Approver | Notification that they have been assigned Approver access to [Batch Name] |

All emails link back to the relevant screen in the app (e.g., rejection email links to the draft). Email copy is to be finalized by the product owner before build.

---

## 13. Mobile & Responsive Behavior

### Mobile-Supported Routes

| Route | Mobile Support | Notes |
|-------|---------------|-------|
| `/` (Dashboard) | Full | Bottom tab nav, single-column layout, horizontal page health scroll |
| `/queue` | View-only | No edit/reschedule/cancel actions |
| `/failed-posts` | Full | Categorized list with action buttons |
| `/reports` | Full | Responsive charts and tables |
| `/reports/results` | Full | |
| `/reports/earnings` | Full | Owner/Co-Owner only |
| `/reports/id-performance` | Full | |
| `/reports/batches` | Full | |
| `/reports/page?id=...` | Full | |

### Desktop-Only Routes

Accessing these on mobile shows a "Desktop Required" banner: "This feature requires a desktop browser."

- `/upload` (Bulk Upload)
- `/post` (Single Post)
- `/drafts` (Drafts)
- `/approvals` (Approvals)
- `/settings/pages` (Page Settings)
- `/settings/connections` (Connected IDs)
- `/settings/account` (Account Settings)

### Mobile Layout Differences

- **Sidebar:** Replaced by a bottom navigation bar with icon-only items for available routes
- **KPI cards:** Stacked single-column; simplified layout
- **Page health widget:** Horizontal scroll with dot indicators for pagination
- **All Pages table:** Reduced columns; horizontal scroll
- **Charts:** Responsive — resize to full width
- **Action buttons:** Full-width tap targets

---

## 14. Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0C6AFF` | Buttons, active states, links, selected nav items |
| Success | `#4ADE80` | Published state, connected status, approved state |
| Warning | `#FBBF24` | Expiring tokens, pending states, overdue badges |
| Error | `#EF4444` | Failed posts, disconnected pages, rejected state |

### Role Pill Colors

| Role | Color | Hex |
|------|-------|-----|
| Owner | Orange | `#FF6B2B` |
| Co-Owner | Orange (same) | `#FF6B2B` |
| Manager | Green | `#4ADE80` |
| Publisher | Blue | `#3B82F6` |
| Approver | Amber | `#FBBF24` |
| Analyst | Indigo | `#6366F1` |

Role pills are small rounded-full tags displayed inline next to member names. They use the hex as background color with white or dark text for contrast.

### Batch Colors

| Batch | Color | Hex |
|-------|-------|-----|
| Partner A — Lifestyle | Purple | `#8B5CF6` |
| Partner B — Education | Orange | `#FF6B2B` |
| Partner C — Women's | Sky Blue | `#0EA5E9` |

Batch pills use the same pill format as role pills with the batch color as background.

### Typography Scale

| Element | Size | Weight | Case |
|---------|------|--------|------|
| Page title | 22px | Semibold | Normal |
| Section heading | 15px | Semibold | Normal |
| Body | 13px | Regular | Normal |
| Caption / label | 12px | Regular | Normal |
| Micro label | 11px | Medium | Uppercase |

### Spacing & Layout Conventions

- Base spacing unit: 4px (Tailwind-style scale: 4px, 8px, 12px, 16px, 20px, 24px)
- Card padding: 20px (`p-5`)
- Section gaps: 24px
- Page horizontal padding: 24px desktop, 16px mobile
- Sidebar width (expanded): 250px
- Sidebar width (collapsed, icon-only): 68px

### Border Radius

| Element | Radius |
|---------|--------|
| Cards | 12px (`rounded-xl`) |
| Modals | 16px (`rounded-2xl`) |
| Buttons | 8px (`rounded-lg`) |
| Pills (role/batch/status) | 9999px (`rounded-full`) |
| Input fields | 6px (`rounded-md`) |

### Status Badge Styles

| Status | Style |
|--------|-------|
| Published | Green dot + "Published" text |
| Scheduled | Blue dot + "Scheduled" text |
| Draft | Gray dot + "Draft" text |
| Pending | Amber dot + "Pending" text |
| Rejected | Red dot + "Rejected" text |
| Failed | Red left border accent + red badge |
| Paused | Gray left border accent + gray badge + red/blue sub-badges |
| Reconnect Required | Red left border accent + distinct red badge |
| Disconnected | Red dot + "Disconnected" text |
| Token Expiring | Amber dot + "Expiring" text |
| Token Expired | Red dot + "Expired" text |

### Card & Container Patterns

- **Standard card:** White/surface background, 1px solid border (`var(--border)`), 12px radius, 20px padding
- **Alert banner:** Full-width, color-coded background (red/amber/blue by type), 8px vertical padding, icon + message + optional CTA
- **Accordion card (Page Settings):** Collapsed shows page name + status badge. Expanded shows full config sections stacked vertically with 1px dividers.
- **Expandable row (Team Members):** Collapsed shows member summary. Expanded shows role/batch checkboxes and actions.

### Modal Patterns

- **Backdrop:** Semi-transparent dark overlay with blur effect
- **Container:** Centered, 16px radius, white/surface background
- **Width:** Narrow modals (confirmation, notes) 400–480px. Wide modals (review, setup) 600–720px.
- **Structure:** Header (title + close X), scrollable body, sticky action footer
- **Close:** X icon top-right, click outside to close (except destructive confirmations — must use buttons)

---

## 15. Deferred to v2

| Item | Description | Why Deferred | Needs Deciding Before Scoping |
|------|-------------|--------------|-------------------------------|
| Professional plan limits | Page count cap, team seat limits, storage caps, feature gates for the $99/month plan | Not yet defined by business | Business decision: what is the cap? What happens at cap — hard block or upsell? |
| Free trial / onboarding flow | Trial duration, trial-to-paid conversion, onboarding steps, empty state guidance for new accounts | Not yet scoped | Trial length, conversion mechanism, whether onboarding is a wizard or progressive |
| Performance-based rotation algorithm | How Posting ID rotation slots are allocated based on reach/views performance — scoring window, slot weighting, rebalancing frequency | Algorithm not defined; v1 defaults to Round Robin when Performance-based is selected | Scoring window (7d/28d?), weighting method, how often slots rebalance, tie-breaking logic |
| Visual similarity duplicate detection | Detecting when the same image is uploaded with minor edits (crop, filter, resize) — v1 only does SHA-256 hash (exact bytes) | Computationally expensive, requires ML model integration | Tooling choice, acceptable false positive rate, user experience for borderline matches |

---

## 16. Open Questions

| # | Question | Blocks v1 Build? | Resolution Path |
|---|----------|-----------------|----------------|
| 1 | What is the Professional plan storage cap in GB? | Deferred — storage hard block UI is built but threshold is TBD | Storage cap will be defined when Professional plan limits are scoped (see Section 15) |
| 2 | What is the exact behavior when a post is in Publishing state and the user navigates away? Does the spinner persist across pages? | Can be resolved during build | Decide on real-time update mechanism (polling, WebSocket, SSE) for queue status updates |
| 3 | Can a Publisher delete a rejected draft, or only edit and resubmit? | Can be resolved during build | Implied yes (Publisher can delete own drafts) — confirm before building rejected-state actions |
| 4 | Is the Threads API integration using the official Meta Threads API or a workaround? | Dev to confirm | Confirm Meta Threads API availability and access requirements before starting integration |
| 5 | Does the health score update in real time or on a schedule (e.g., daily)? | Can be resolved during build | Define the refresh cadence for reach_28d data used in the formula |
| 6 | What does "Approved" post state look like to the Publisher? Do they receive an in-app notification or just see queue status change? | Post-launch acceptable | Decide on publisher notification UX for approval outcomes |

---

## 17. Glossary

**Batch**
A named group of pages assigned to a partner or team. The unit of access control in MetaReverse. Team members are assigned to one or more batches and can only see and manage pages within those batches. The Owner sees all batches.

**Posting ID**
A Facebook user account connected to the platform and used to make API calls to post content to a specific page. Also called a "Connected ID." A page can have multiple Posting IDs for rotation. Posting IDs are never "disconnected" — they are Retired.

**Rotation**
The process of distributing posts across multiple Posting IDs for a single page. Two modes: Round Robin (even distribution in sequence) and Performance-based (allocation weighted by reach — algorithm deferred to v2). Round Robin is the default and the only active behavior in v1.

**Active Hours**
A configurable time window per page during which auto-scheduled posts are permitted to publish. Posts outside this window are held and fire at the next available slot within Active Hours. This is a hard block for auto-scheduled posts. Manual posts get a warning but are not blocked.

**RPM**
Revenue Per Mille (per 1,000 views). Calculated as `(Total Revenue / Total Views) × 1000`. Revenue is the gross payout from Facebook before any platform cut. Visible to Owner, Co-Owner, and Manager. Hidden from Publisher, Approver, and Analyst.

**Health Score**
A 0–100 score per Posting ID measuring its relative reach performance. Formula: `round((ID_reach_28d / max_reach_28d_on_account) × 100)`. Scores are relative to the account's own best-performing Posting ID, not an absolute benchmark. Labels: Healthy (70–100), Declining (40–69), Replace (0–39).

**Overdue Approval**
An approval action taken after the post's scheduled publish time has already passed. Triggers the Overdue Fallback Panel, which requires the approver to make an explicit decision: reschedule to the next Active Hours slot, or publish immediately.

**Paused Post**
A post in the Queue that cannot publish because the Posting ID expired or the page was disconnected between approval and publish time. A Paused post has a gray left border and sub-badges in the Queue. It never auto-resumes — manual Resume by Owner/Manager is always required.

**Reconnect Required**
A Queue state (not a Failed Posts category) indicating that a Facebook token expired while an API publish call was already in flight. The post remains in Queue with a Reconnect Required badge and requires the Owner/Manager to reconnect the account via Connected IDs.

**Retire**
The only way to remove a Posting ID from active use. Retiring stops the account from receiving new posts but preserves all historical data — reach, health score, post history, and revenue figures remain visible in Reports. "Disconnect" is not a concept in this product.

**Global Manager**
A Manager assigned to 3 or more batches. Has platform-wide team management permissions (can invite and remove team members across all batches). Automatically promoted from Batch Manager when a third batch is assigned — no manual flag required.

**Batch Manager**
A Manager assigned to 1 or 2 batches. Can invite and remove team members only within their assigned batches. Automatically upgraded to Global Manager when assigned a third batch.

**Co-Owner**
A second platform-wide operator with nearly identical permissions to the Owner. Can manage everything except Co-Owner management and ownership transfer. Invited exclusively via Owner's Profile > Danger Zone. Cannot be invited from the Team Members screen.

**Post Interval**
The frequency of auto-scheduled posts for a page. Set in hours: 1, 2, 3, 4, 6, or 8. The anchor point for intervals is the start of Active Hours — the first post fires at Active Hours start, and each subsequent post fires exactly N hours after the previous.

**Duplicate Detection**
The system that checks whether an uploaded file has already been uploaded for the same page. Uses SHA-256 hashing — if the file bytes match exactly, it is flagged as a duplicate regardless of filename. Visual similarity detection (for edited/cropped versions of the same image) is deferred to v2.

**Copyright Scan**
A per-file scan that checks uploaded media for potential copyright violations. In v1, the copyright scan is a mock UI state — the badge (Clear / Possible Match / Match Found) is simulated and not connected to a real scanning integration.

**Storage**
The platform's media file storage quota. Only media files (video and images) count. Captions and metadata do not. Draft media consumes storage from the moment it is uploaded, not when it is published. When storage is full, all new uploads are hard-blocked until storage is freed or the plan is upgraded.

---

*MetaReverse PRD v1.0 (final pre-build) — April 4, 2026*
*This document is the single source of truth for v1 build. For wireframe reference: https://wireframes-seven-rouge.vercel.app*

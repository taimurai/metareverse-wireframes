# MetaReverse — Complete Product Documentation
**Version:** 1.7
**Last Updated:** April 3, 2026
**Audience:** Product team, developers, partners, and new team members

### Changelog
- **v1.7** — Batch deletion guard extended to include active drafts; Manager can retire Posting ID confirmed; email notifications in scope for v1
- **v1.6** — Multi-batch sidebar switcher spec, Active Hours hard block explicit
- **v1.5** — Delta audit fixes: health score formula, post interval anchor, performance rotation TBD, disconnected draft behavior, Global Manager auto-upgrade, permission matrix Co-Owner column
- **v1.4** — Remaining audit decisions incorporated (batch rules, publishing, storage, invite, concurrent approval)
- **v1.3** — Audit decisions incorporated (roles, post lifecycle, calculations, UX)
- **v1.2** — Initial complete documentation

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Core Concepts](#2-core-concepts)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Batch Access Control](#4-batch-access-control)
5. [Navigation & Sidebar](#5-navigation--sidebar)
6. [Dashboard](#6-dashboard)
7. [Bulk Upload](#7-bulk-upload)
8. [Single Post](#8-single-post)
9. [Drafts](#9-drafts)
10. [Approvals](#10-approvals)
11. [Queue](#11-queue)
12. [Failed Posts](#12-failed-posts)
13. [Reports](#13-reports)
    - Overview
    - Results
    - Earnings (Owner only)
    - By Posting ID
    - Batches
    - Per-Page Report
14. [Page Settings](#14-page-settings)
15. [Connected IDs](#15-connected-ids)
16. [Account Settings](#16-account-settings)
17. [Team Management](#17-team-management)
18. [Role Switcher (Wireframe Demo)](#18-role-switcher-wireframe-demo)
19. [Key User Flows](#19-key-user-flows)
20. [Mobile Support](#20-mobile-support)
21. [Permission Matrix](#21-permission-matrix)
22. [Design System](#22-design-system)
23. [Deferred Decisions](#23-deferred-decisions)

---

## 1. Product Overview

**MetaReverse** is a multi-page social media management platform built for operators who manage large portfolios of Facebook, Instagram, and Threads pages — typically 20–100+ pages distributed across multiple teams or partners.

The platform solves three core problems:

1. **Content Operations** — Upload, schedule, and approve posts at scale across many pages
2. **Revenue Intelligence** — Track earnings, RPM, and monetization health per page and per batch
3. **Team Access Control** — Grant scoped access to team members, partners, and analysts without exposing sensitive data across the entire portfolio

### Pages in the Demo (7 pages across 3 batches)

| ID | Page Name | Batch | Platforms | Followers |
|----|-----------|-------|-----------|-----------|
| lc | Laugh Central | Partner A — Lifestyle | FB, IG | 3.2M |
| ff | Fitness Factory | Partner A — Lifestyle | FB, IG | 310K |
| dh | Daily Health Tips | Partner A — Lifestyle | FB | 420K |
| hu | History Uncovered | Partner B — Education | FB, IG, TH | 2.4M |
| tb | TechByte | Partner B — Education | FB, IG, TH | 1.1M |
| mm | Money Matters | Partner B — Education | FB, IG | 680K |
| khn | Know Her Name | Partner C — Women's | FB | 136K |

---

## 2. Core Concepts

### Pages
A "page" is a connected Facebook/Instagram/Threads page. Each page has:
- A connected Facebook account (Posting ID) used to post content
- Monetization status (eligible, restricted, suspended)
- A health status based on revenue, RPM, and token state
- Configurable auto-post settings, scheduling windows, and approval workflows

### Posting IDs (Connected Facebook Accounts)
Each page uses a Facebook user account to post content via the Facebook API. These are called **Posting IDs** or **Connected IDs**. A page can have multiple Posting IDs for rotation — spreading posts across accounts to manage reach and throttling.

### Batches
A **batch** is a named group of pages assigned to a partner or team. It is the unit of access control — team members are assigned to one or more batches and can only see/manage pages within those batches. The Owner sees all batches.

### Content Workflow
```
Upload → Drafts → [Approvals] → Queue → Published
                                  ↓
                              Failed Posts (if error)
```

---

## 3. User Roles & Permissions

Roles are **stackable** — one person can hold multiple roles simultaneously (e.g., Publisher + Approver on Batch A). Roles are assigned per batch, not platform-wide (except Owner and platform-level Manager).

### 👑 Owner
- **Scope:** Platform-wide — all batches, all pages
- **Who:** The account holder running the platform
- **Access:**
  - Full Dashboard with all KPIs including revenue and RPM
  - Create, schedule, and publish posts on any page
  - Approve or reject any post on any page
  - Add/remove pages, configure all page settings
  - Manage all team members — invite, assign roles, change batches, remove
  - View Earnings tab in Reports (revenue, RPM, payout data)
  - Access all settings including billing and Connected IDs
  - See monetization status and payout status per page
- **Dashboard shows:** Revenue KPI, RPM KPI, Monetization badges, Payout status, All Pages table with all columns

---

### 🟠 Co-Owner
- **Scope:** Platform-wide — same as Owner except ownership transfer and Co-Owner management
- **Who:** A second operator-level user trusted with nearly full access
- **Access:**
  - Full billing access (same as Owner)
  - Create, schedule, and publish posts on any page
  - Approve or reject any post
  - Add Managers and all other team member roles
  - Access all settings including Connected IDs
- **Cannot:**
  - Transfer ownership
  - Invite or remove other Co-Owners
  - Remove the primary Owner
- **How to invite:** Co-Owner is invited via **Profile → Danger Zone** (not from the Team Members tab)

---

### 🟢 Manager
- **Scope:** Platform-wide OR scoped to assigned batch(es)
- **Who:** A trusted operator or partner lead
- **Two tiers based on batch assignment:**
  - **Global Manager** — assigned to 3 or more batches; can invite and remove team members platform-wide
  - **Batch Manager** — assigned to 1–2 batches; can invite/remove team members for their assigned batch(es) only
- **Auto-upgrade:** When an Owner or Co-Owner assigns a third batch to a Batch Manager, the platform automatically upgrades them to Global Manager scope. No manual flag or override is needed — the platform detects batch count and applies the correct scope automatically.
- **Access:**
  - Dashboard with RPM visible, but revenue hidden
  - Create, schedule, and publish posts within scope
  - Approve or reject posts (no separate Approver role needed)
  - Add/remove pages and configure page settings within scope
  - Manage team members — invite, assign roles, remove (within scope)
  - View all Reports tabs except Earnings
  - See RPM and monetization status but NOT revenue or payout data
- **Cannot:**
  - View revenue, earnings tab, or payout data
  - Access billing settings
  - Invite another Manager (neither Global nor Batch)
  - Invite a role higher than themselves (cannot invite Co-Owner)
- **Note:** Only Owner and Co-Owner can add Managers

---

### 🔵 Publisher
- **Scope:** Assigned batch(es) only — sees only pages in their batch
- **Who:** A content creator uploading and scheduling posts
- **Access:**
  - Upload posts (Bulk Upload / Single Post) — page selector shows only batch pages
  - View and manage their own drafts
  - View their own scheduled posts in Queue
  - View basic Dashboard (Network Views + Operations Pulse only — no revenue/RPM)
  - Top Performers shows views only (no revenue)
- **Cannot:**
  - Approve or reject posts
  - See other publishers' posts in Drafts or Queue
  - Access Reports, Page Settings, Connected IDs, Account Settings
  - See revenue, RPM, monetization status, or payout data

**A-08 — Publisher Failed Posts scoping:** Publishers see only their own failed posts in Failed Posts — same scoping rules as Drafts and Queue. They cannot see failed posts from other publishers.

---

### 🟡 Approver
- **Scope:** Assigned batch(es) only
- **Who:** A reviewer responsible for gatekeeping content before it goes live
- **Access:**
  - View Approvals inbox — only posts from their batch
  - Approve or reject posts with optional notes
  - View all Drafts in their batch (not just their own)
  - View Queue in their batch (read-only)
  - View basic Dashboard for their batch
- **Cannot:**
  - Upload or create posts
  - Access Reports, Page Settings, Connected IDs, or Account Settings
  - See revenue, RPM, or payout data
- **Stacked roles (Publisher + Approver):** A user holding both Publisher and Approver roles CAN approve their own posts. There is no self-approval prohibition.

**A-07 — Approver Queue access:** Approvers have read-only access to the Queue. They can view posts they have approved in order to monitor status, but they cannot reschedule. Rescheduling is an Owner/Manager action only.

---

### 🟣 Analyst
- **Scope:** Assigned batch(es) only
- **Who:** A reporting/analytics user with read-only access to performance data
- **Access:**
  - View Reports (Overview, Results, Batches tabs) for their batch
  - View Dashboard (views + operations only) for their batch
- **Cannot:**
  - Upload, approve, or manage anything
  - Access Earnings tab, revenue figures, RPM, or payout data
  - Access any settings pages
  - Access the **By Posting ID** report tab — intentionally blocked by product decision (not a bug)

---

## 4. Batch Access Control

### Batch Structure

| Batch | Pages | Example Team |
|-------|-------|-------------|
| All Batches (Owner only) | All 7 pages | Taimur (Owner) |
| Partner A — Lifestyle | Laugh Central, Fitness Factory, Daily Health Tips | Sarah (Publisher + Approver), Fatima (Publisher) |
| Partner B — Education | History Uncovered, TechByte, Money Matters | Ahmed (Publisher), Nida (Analyst), Fatima (Publisher) |
| Partner C — Women's | Know Her Name | Aisha (Manager + Publisher) |

### How Batch Scoping Works
- **Upload:** Publisher's page selector only shows pages from their batch
- **Drafts:** Publisher sees only their own drafts; Approver sees all drafts in batch
- **Approvals:** Approver inbox is scoped to their batch only
- **Queue:** Publisher sees their own posts; Approver/Manager see full batch
- **Reports:** Data filtered to assigned batch for non-Owner roles
- **Dashboard:** Batch context banner shown for all non-Owner roles

### Batch Context Banner
Non-Owner users see a banner at the top of every page showing which batch they are currently scoped to. Example:
> 🟣 Partner A — Lifestyle · Laugh Central, Fitness Factory, Daily Health Tips

### Multi-Batch Switcher
Users assigned to more than one batch (e.g. Fatima on Partner A and Partner B) see a **batch switcher in the sidebar**, located in the same area as the role switcher pill at the bottom of the sidebar.

- Displays the currently active batch name
- Clicking opens a small popover listing all batches the user is assigned to — one click switches the active batch
- Switching batch updates all scoped views globally: Upload page selector, Drafts, Queue, Approvals, Dashboard, and Reports all reflect the newly selected batch immediately
- The active batch is saved in localStorage and persists across page navigations within the session
- The Batch Context Banner at the top of each page updates to reflect the active batch
- Users with only one batch assigned do not see the switcher — the banner is shown but is not interactive

### B-07 — Batch Deletion Guard
Batch deletion is blocked if either of the following conditions is true:
1. The batch contains any active pages — tooltip: "Reassign all pages before deleting this batch."
2. Any team member has active drafts in the batch — tooltip: "Team members have active drafts in this batch. Clear drafts before deleting."

Both conditions must be cleared before deletion is permitted. The delete button remains greyed out until both are resolved.

---

## 5. Navigation & Sidebar

The sidebar is the primary navigation. It collapses to an icon-only mode (68px wide) and expands to full mode (250px). State persists across sessions.

### Navigation Items by Role

| Nav Item | Owner | Co-Owner | Manager | Publisher | Approver | Analyst |
|----------|-------|----------|---------|-----------|----------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bulk Upload | ✅ | ✅ | ✅ | ✅ | — | — |
| Single Post | ✅ | ✅ | ✅ | ✅ | — | — |
| Drafts | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Approvals | ✅ | ✅ | ✅ | — | ✅ | — |
| Queue | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Failed Posts | ✅ | ✅ | ✅ | ✅ | — | — |
| Reports | ✅ | ✅ | ✅ | — | — | ✅ |
| Page Settings | ✅ | ✅ | ✅ | — | — | — |
| Connected IDs | ✅ | ✅ | ✅ | — | — | — |
| Account Settings | ✅ | ✅ | ✅ | — | — | — |

### Reports Sub-navigation

| Tab | Owner | Co-Owner | Manager | Analyst |
|-----|-------|----------|---------|---------|
| Overview | ✅ | ✅ | ✅ | ✅ |
| Results | ✅ | ✅ | ✅ | ✅ |
| Earnings | ✅ | ✅ | — | — |
| By Posting ID | ✅ | ✅ | ✅ | — |
| Batches | ✅ | ✅ | ✅ | ✅ |

### Sidebar Bottom
- **Role switcher pill** — shows current role and batch. Click to open the role/batch switcher modal.
- **User profile card** — shows avatar, name, and role

---

## 6. Dashboard

**Route:** `/`
**Access:** All roles (content filtered by role)

The Dashboard is the operational home screen. It shows a real-time health summary of all pages with KPIs, alerts, and queue status.

### Alert Banners (top of page)
Conditionally shown based on system state:
- **Disconnected page warning** — e.g., "Money Matters is disconnected. Posts are paused."
- **Token expiry warning** — e.g., "TechByte token expires in 5 days. Reconnect in Connected IDs."
- Banners are **batch-scoped** — non-Owner users only see alerts for pages in their batch. A batch-a Publisher will not see a Money Matters (batch-b) disconnect warning.

### KPI Period Selector
Four options: **Today / Yesterday / Last 7 Days / Last 28 Days**
All KPI cards update dynamically when the period changes.

### KPI Cards (top row)
Visible cards depend on role:

| Card | Owner | Manager | Publisher/Approver/Analyst |
|------|-------|---------|---------------------------|
| Revenue | ✅ | — | — |
| RPM | ✅ | ✅ | — |
| Network Views | ✅ | ✅ | ✅ |
| Operations Pulse | ✅ | ✅ | ✅ |

**Revenue card** — Total portfolio revenue for the selected period with % change vs prior period
**RPM card** — Average RPM across all monetized pages
**Network Views** — Total views across all pages
**Operations Pulse** — Quick health counts: scheduled posts today, failed posts, expiring tokens

### Page Health Widget
Grid of page cards (scoped to user's batch for non-Owner roles). Each card shows:
- Page avatar, name, follower count
- Views (7-day) with trend arrow
- Queue count (next 24 hours)
- **Monetization status badge** (Owner/Manager only): Eligible / Restricted / Suspended / In Review
- **Payout status badge** (Owner/Manager only): ✓ Paid / ⏳ Pending / ⊘ On Hold
- Health indicator dot (green/amber/red)

**C-07 — Follower counts:** Follower counts are cached and refreshed every 24 hours. A "last updated X hours ago" tooltip appears on hover over any follower count. Live pulling was rejected due to Facebook API rate limits at 100+ pages.

### All Pages Table
Sortable table listing pages visible to the user's role (scoped to batch for non-Owner). Labelled "Batch Pages" for non-Owner users. Columns:

| Column | Owner | Manager | Others |
|--------|-------|---------|--------|
| Page | ✅ | ✅ | ✅ |
| Followers | ✅ | ✅ | ✅ |
| Revenue | ✅ | — | — |
| RPM | ✅ | ✅ | — |
| Views (7d) | ✅ | ✅ | ✅ |
| Queue | ✅ | ✅ | ✅ |
| Status | ✅ | ✅ | ✅ |

### Top Performers
Shows top 3 posts by views in the selected period. Visible to all roles.
- Shows: page avatar, caption snippet, views count, post type
- **Revenue column** (Owner/Manager only): earnings per post

### Declining Performance
Shows pages with falling RPM or views. RPM column visible to Owner/Manager only.

---

## 7. Bulk Upload

**Route:** `/upload`
**Access:** Owner, Manager, Publisher

A 4-step wizard for uploading and scheduling batches of content.

### Step 1 — Select Page
- Searchable list of available pages
- Pages filtered by batch for non-Owner roles (Publisher only sees their batch pages)
- Each page shows: avatar, name, follower count, platforms, connection status
- Disconnected pages are shown with a disabled state and an inline note
- Clicking a page selects it and advances to Step 2

### Step 2 — Upload Media
- **Drag-and-drop zone** — supports JPG, PNG, GIF, MP4, MOV
- File limits: Images 10MB, Videos 100MB
- Uploaded files appear in a list showing:
  - File name, size, and type (photo / reel)
  - Platform selection toggles (FB / IG / TH) — at least 1 required
  - **Copyright scan status**: ✅ Clear / ⚠ Possible Match / ❌ Match Found
    - **Note:** Copyright scan is a mock UI state in the current wireframe. It is not connected to a real integration yet. Will be defined when the real integration is scoped.
  - **Duplicate detection**: amber warning if the same file is already in Drafts or Queue for the selected page
- Files can be individually removed

**B-12 — Duplicate detection method:** Duplicate detection uses SHA-256 file hash. Same bytes = same file = flagged as duplicate. Filename-based detection was rejected (too easy to fool by renaming). Visual similarity detection is deferred to v2 (too computationally expensive).

**E-02 — File upload failure handling:** If one or more files fail to upload in Step 2, only the failed files are retried — the user does not restart from Step 1 (which would lose all other files). Each failed file shows a red error badge and a per-file retry button. The user can proceed to Step 3 with the successfully uploaded files and retry failed files without losing progress.
- "Continue" button advances to Step 3 once at least 1 file is uploaded

### Step 3 — Add Captions
- Each file gets its own caption editor
- **Per-platform character counter** shown below each textarea:
  - FB: X / 63,206 — green (under 80%), amber (80–99%), red (over limit)
  - IG: X / 2,200
  - TH: X / 500
- Only shows counter for platforms the file is targeted to
- **Copyright scan result** displayed per file (clear/match/flagged)
- **Duplicate warning** shown above flagged files with amber border
- **Thread toggle** (Facebook only) — adds a comment chain input below caption
- "Continue" button advances to Step 4 once all required captions are filled

### Step 4 — Schedule / Save to Drafts
- Shows available auto-schedule slots based on the selected page's timezone
- A blue info row displays: "Times shown in [TZ] — from [source]" with a right-aligned precedence note: "Page timezone → account timezone → platform default"
- Slot times are shown in the page's timezone (e.g., EST, PST, CST) — not the operator's local time
- Select one or more time slots
- "Save to Drafts" button saves all files with captions and schedule to Drafts
- Upload progress animation shown briefly

---

## 8. Single Post

**Route:** `/post`
**Access:** Owner, Manager, Publisher

Create and schedule a single post with full control over media, caption, platforms, and timing.

### Left Column — Editor
- **Page selector** — dropdown to choose which page to post to (filtered by batch for non-Owner)
- **Media type** — tabs: Photo / Reel / Text
- **Media upload** — drag-drop or click to upload a single file
- **Caption textarea** — with real-time per-platform character counters
- **Platform toggles** — enable/disable FB, IG, TH for this post
- **Schedule options** — "Publish Now" or "Schedule" (with date and time picker)
- **Thread/Comments section** (Facebook only) — add up to 3 threaded comments below the post (8,000 chars each)

### Right Column — Preview Sidebar
- Page info (avatar, name, category)
- Active platform badges
- Live post preview that updates as caption changes
- Character count warnings
- Schedule summary

### Header Actions
- **Preview** button — opens a full preview modal
- **Publish Now / Add to Queue** — green primary action button

---

## 9. Drafts

**Route:** `/drafts`
**Access:** Owner, Manager, Publisher, Approver

All saved draft posts. Publishers see only their own drafts. Approvers and Managers see all drafts in their batch.

### Role Context Banner
Non-Owner users see a blue info banner at the top:
- **Publisher:** "Showing your drafts only — drafts you uploaded to [Batch Name]"
- **Approver:** "Showing all drafts in [Batch Name]"

### What's Shown
- List or grid of draft posts
- Each draft shows: thumbnail, caption snippet, page, platforms, post type, created date

### Actions Per Draft
- **Edit** — opens edit modal (caption, media, platforms, schedule)
- **Delete** — removes draft with confirmation
- **Schedule** — opens date/time picker and moves to Queue
- **Submit for Approval** — sends to the Approvals inbox

**B-10 — Submit draft without schedule:** Publishers can submit a draft for approval without setting a schedule time. The schedule is left blank at submission. The Approver or Manager sets the schedule at the time of approval.

### Disconnected Page — Draft Behavior
If a draft's target page becomes disconnected after the draft was saved:
- The draft shows an **amber warning badge**: "Page disconnected — cannot be submitted or scheduled"
- **Submit for Approval** and **Schedule** actions are disabled
- **Delete** is the only available action
- The draft is not auto-deleted — manual deletion is required
- This mirrors the Paused state behavior in Queue, applied earlier in the lifecycle

### Bulk Actions
- Select multiple drafts with checkboxes
- Bulk delete, bulk schedule, bulk submit for approval

---

## 10. Approvals

**Route:** `/approvals`
**Access:** Owner, Manager, Approver

Review queue for posts that require sign-off before publishing. Badge in sidebar shows pending count.

### Filter Tabs
- **Pending** (default) — posts awaiting review
- **Approved** — posts that have been approved
- **Rejected** — posts that were rejected
- **Changes Requested** — posts sent back to the publisher for edits

### Per-Post Display
- Thumbnail preview
- Full caption
- Page name and avatar
- Platforms targeted (FB, IG, TH)
- Post type (photo/reel)
- Submitted by (team member name)
- Submitted timestamp
- Scheduled publish time — **Overdue** badge shown in amber if the scheduled time has already passed
- Current status badge

### Approval Actions
- **Approve** — marks post approved; optional note field; post moves to Queue (see Overdue Fallback below)
- **Reject** — opens rejection reason modal; post flagged as rejected with reason
- **Request Changes** — opens modal with text field; post returned to publisher as a Draft (fully editable). The Publisher can resubmit unlimited times — there is no cap on resubmission attempts.

### Who Can Approve
Approval rights are based on role — **Owner**, **Manager**, and **Approver** can all approve posts. This is inherited automatically from role assignment, not configured per page.

### E-05 — Simultaneous Approval
If two Approvers attempt to review the same post at the same time, **first action wins**. The second Approver sees a notice: "Already reviewed by [Name] — [Approved/Rejected]" and the action buttons (Approve / Reject / Request Changes) are disabled. This prevents a simultaneous approval from overwriting a rejection or vice versa.

### Approver Removal Rules
- If an Approver is removed from the team, their pending posts remain in the Approvals queue for other Approvers in the same batch to pick up.
- A notification is sent when there is no remaining Approver for a batch.
- **Constraints:**
  - Cannot remove the last Approver from a batch if Approval is enabled for any page in that batch.
  - Cannot enable "Require Approval" on a page if no Approver is assigned to that batch — a guard popup appears directing the Owner to add an Approver first.

**E-06 — Manager removed with pending approvals:** If a Manager is removed while they have posts pending their review, those posts stay in the queue and remain visible to other eligible reviewers in the batch. The same rule applies as for Approver removal — approvals are batch-visible, not assigned to individuals. No posts are orphaned or lost.

### Overdue Approval Fallback

If an approver reviews a post **after its scheduled time has already passed**, clicking Approve does not immediately queue it. Instead, a fallback panel replaces the action footer inside the Review modal:

**The panel shows:**
- An amber warning: "Scheduled time has passed — this post was due [original time]"
- Two mutually exclusive options:

| Option | Behaviour | Default? |
|--------|-----------|---------|
| **Reschedule to next Active Hours slot** | Post is queued for the page's next available Active Hours window (e.g. Tomorrow, 8:00 AM EST). Respects the page's posting restrictions. | ✅ Yes |
| **Publish immediately** | Post fires right away. If the current time is outside the page's Active Hours, an orange warning is shown: "Outside Active Hours — may underperform." | No |

**Confirm button** updates dynamically based on the chosen option:
- "✓ Approve & Reschedule to Tomorrow, 8:00 AM EST"
- "✓ Approve & Publish Now"

A **← Back** button returns to the normal review without committing.

**Why this matters:** Without this gate, approving a late post would silently queue it with a stale timestamp, potentially firing at 2 AM or outside the page's Active Hours window. The fallback ensures every overdue approval is an explicit, informed decision.

### Overdue Approval — Active Hours Disabled
If a post misses its scheduled time because it was not approved in time, AND **Active Hours is disabled** for that page:
- The post goes to a **manual queue** — it does not post immediately.
- The Owner or Manager must manually trigger it.
- It waits for an explicit reschedule decision before auto-publishing.

---

## 11. Queue

**Route:** `/queue`
**Access:** Owner, Manager, Publisher (own posts only), Approver (batch view, read-only)

All scheduled posts awaiting publish. View by page or by date.

### Role Context Banner
Non-Owner users see a blue info banner at the top:
- **Publisher:** "Showing your posts only — posts you uploaded to [Batch Name]"
- **Approver/Analyst:** "Showing all posts in [Batch Name]"

### What's Shown
- Posts grouped by page or by date (toggleable); **paginated by date** at scale
- Posts can be searched by caption using the search box
- Each post shows: thumbnail, caption snippet, page, platforms, scheduled time, status
- Status indicators:
  - **Scheduled** — blue, awaiting publish time
  - **Publishing** — animated spinner, in progress
  - **Published** — green checkmark
  - **Failed** — red, publish attempt errored (see Failed Posts)
  - **Paused** — gray left border, distinct from Failed. Used when a post is approved and ready but cannot publish because the page's Posting ID expired or was disconnected mid-approval. Sub-badges shown: "⚠ Posting ID expired" (red) and optionally "✓ Publisher notified" (blue).
  - **Reconnect Required** — separate from Failed Posts; indicates an authentication issue (e.g. Facebook token expired mid-publish) that requires the page to be reconnected. Does NOT appear in the Failed Posts list.

### Disconnected Page Behavior
When a page is disconnected from Facebook:
- All its drafts and queued posts are **auto-paused** and grayed out in the Queue.
- The Owner/Manager sees an option to delete those posts.
- Posts are **not deleted automatically** — manual deletion is required.

### Posting ID Expires Before Publish
If a Posting ID expires between the time a post is approved and its scheduled publish time:
- The post is **held** (not failed) and displayed with a **Paused** status in the Queue.
- The post waits until an Owner or Manager manually clicks **Resume** after a new Posting ID is configured.
- Nothing resumes automatically — manual action is always required.

### Paused State Recovery
- Paused posts display a **Resume** button.
- Clicking Resume manually moves the post back to **Scheduled** status.
- Posts do **not** auto-resume when the underlying issue is resolved — manual Resume is always required.

### Publisher View
- Only sees their own scheduled posts
- Cannot see other publishers' posts

### Approver/Manager View
- Sees all scheduled posts in their batch

### Actions (Owner/Manager only)
- Edit post (opens edit modal)
- Delete / cancel scheduling
- Reschedule (move to different time)
- Bulk reschedule or bulk cancel

---

## 12. Failed Posts

**Route:** `/failed-posts`
**Access:** Owner, Manager, Publisher

Posts that failed to publish are automatically categorized and surfaced here for resolution.

### Categories (Filter Tabs)

| Category | Color | Description | Action |
|----------|-------|-------------|--------|
| Temporary Issue | Amber | API timeout, rate limit, etc. — retryable errors | Retry |
| Reconnect Needed | Red | Token expired or account disconnected | Reconnect |
| Needs Editing | Purple | Content policy violation, media error | Edit & Requeue |

**Note:** Posts where the Facebook token expires **mid-publish** (while the API call is in flight) enter a **"Reconnect Required"** state in the Queue and do NOT appear in Failed Posts. Failed Posts covers temporary/retryable errors only. Authentication issues that require page reconnection are handled separately.

### Per-Post Display
- Thumbnail, caption, page, platforms
- Scheduled time and failed time
- Category badge with error message
- Action button (Retry / Reconnect / Edit & Requeue)

### Actions
- **Retry** — re-attempts publish immediately; shows spinner then success/fail toast
- **Reconnect** — redirects to Connected IDs for the relevant account
- **Edit & Requeue** — opens edit modal; on save, post re-enters Queue

### Bulk Actions
- Select multiple posts → Bulk Retry or Bulk Dismiss
- After clicking **Retry All** or **Retry Selected**, a summary toast is shown: "X succeeded, Y still failing" — not a silent list refresh.

### B-09 — Publishing Timeout
Facebook API calls timeout after 60 seconds. If no response is received within 60 seconds, the post moves to Failed Posts under the **Temporary Issue** category with the error message: "Publish timeout — retry."

---

## 13. Reports

**Route:** `/reports` and sub-routes
**Access:** Owner, Manager, Analyst (no Earnings for non-Owner)

Analytics hub with multiple sub-tabs covering performance, revenue, and content insights.

---

### Threads (TH) Integration Notes
- Threads supports **scheduling** at full parity with Facebook and Instagram.
- Threads does **not** support revenue tracking — there is no monetization on Threads. Revenue/RPM data is not reported for Threads posts.
- All other features (caption, media, posting) are at parity with FB/IG.

---

### 13a. Overview (`/reports`)

Cross-portfolio performance summary.

**Controls:**
- Page/Batch selector — scope data to a single page, all pages, or a batch
- Platform switcher — Facebook / Instagram / Threads
- Period toggle — 7 Days / 28 Days / 90 Days

**Revenue Summary Card (Owner only):**
- Weekly revenue with % change
- Monthly revenue with % change
- Average RPM with change
- Total monetized views

**Per-Page Revenue Grid:**
Each page card shows: revenue this period, RPM, views, growth %, monetization status, and a sparkline trend chart.

**Recent Posts Section:**
Top performing posts across the portfolio, sorted by views.

---

### 13b. Results (`/reports/results`)

Time-series chart view for key performance metrics.

- **2-column chart grid:**
  - Views over time
  - Interactions over time
  - Reach over time
  - Clicks over time
- Each chart shows: current value, change %, and line chart with date labels
- All charts respond to the page/platform/period selectors in the header

---

### 13c. Earnings (`/reports/earnings`) — Owner Only

Revenue-focused analytics. Hidden for all non-Owner roles.

**RPM Formula:**
> RPM = (Total Revenue ÷ Total Views) × 1000

"Revenue" in this formula is the **gross payout** (before platform cut).

**Earnings Type Tabs:**
- Total Revenue
- CPM Revenue
- Network Revenue
- Other Revenue

**Per tab shows:**
- Current value + change %
- Large line chart showing earnings over time
- Breakdown table: Page → Revenue → RPM → Views → Growth → Status

**Top Earning Content section:**
List of highest-earning posts with earnings, views, page, and caption snippet.

---

### 13d. By Posting ID (`/reports/id-performance`)

Performance analytics broken down by connected Facebook account (Posting ID).

**Access:** Owner and Manager only. Analyst role is intentionally blocked from this tab (product decision, not a bug). Excluded because By Posting ID exposes connected Facebook account names, emails, and User IDs — operational identity data outside the Analyst's remit.

**Per ID card shows:**
- Name, email, Facebook User ID
- Status badge (active/expired)
- Health score (0–100) with label: Healthy / Declining / Replace
- Total reach, posts this month, trend indicator (↑ ↓ ~)

**Health Score:** Derived from performance data — not manually set.

> `score = round((ID_reach_28d / max_reach_28d_on_account) × 100)`

- `ID_reach_28d` — total reach for this Posting ID over the last 28 days
- `max_reach_28d_on_account` — the highest 28-day reach of any Posting ID on the same account
- Result is rounded to the nearest integer (0–100)
- Scores are relative to the account's own best performer, not an absolute benchmark

**Expandable detail section:**
- Weekly reach chart
- Top performing page for this ID
- Worst performing page
- Recommendation (e.g., "Keep as primary")

**Health Scores in demo:**
| ID | Name | Score | Status |
|----|------|-------|--------|
| c1 | Taimur Asghar | 88 | Healthy |
| c2 | Sarah Khan | 72 | Declining |
| c3 | Ahmed Raza | 22 | Replace |

---

### 13e. Batches (`/reports/batches`)

Compare performance and revenue across batch groups.

**Per batch card shows:**
- Batch name and page count
- Revenue, RPM, total views, growth %, engagement rate
- Health status with explanation and improvement recommendation
- 4-week revenue trend chart
- Portfolio contribution %

**Pages within batch:**
Grid table showing all pages in the batch with: revenue, RPM, views, growth, engagement, status.

---

### 13f. Per-Page Report (`/reports/page?id=...`)

Deep-dive analytics for a single page.

**Header:**
- Page name, category, follower count, platform

**KPI Cards (3-column grid):**
- Views, Viewers, Interactions (with Reactions/Comments/Shares breakdown)
- Clicks, CTR %
- Earnings (Owner only)

**Posts Table:**
All posts for the page with sortable columns:
- Post (thumbnail + caption), Type, Date, Views, Interactions, Clicks, Engagement %, CTR %, Earnings (Owner only)
- 10 posts per page, paginated

---

## 14. Page Settings

**Route:** `/settings/pages`
**Access:** Owner, Manager

Configure all settings for each managed page.

### Page Status Badges
Each page card in the list shows a computed status badge:

| Status | Color | Condition |
|--------|-------|-----------|
| Token Expired | Red | Token is expired or all Posting IDs are expired |
| Token Expiring | Amber | Token expires within 7 days |
| Needs Setup | Orange | Auto-post is off AND no posts this week |
| Paused | Gray | Auto-post is off but has posted before |
| Inactive | Amber | Auto-post is on but no posts this week |
| Ready | Green | Auto-post on and posting activity detected |

### Per-Page Configuration Card
Each page is shown in an expandable accordion card. Configuration sections:

#### Auto-Post Settings
- **Enable auto-post** toggle — activates automated scheduling
- **Platforms** — toggle FB, IG, TH independently per page
- **Post interval** — dropdown: 1, 2, 3, 4, 6, 8 hours
  - The interval means **exact clock intervals**, not a minimum gap.
  - **Anchor point:** The first post fires at the start of Active Hours. Each subsequent post fires exactly N hours after the previous one. If a slot falls outside Active Hours it is skipped and the next slot within Active Hours is used.
  - Example: Active Hours start at 8:00 AM, 2h interval → 8:00 AM, 10:00 AM, 12:00 PM, 2:00 PM… A slot at 10:00 PM that falls outside Active Hours (end: 8:00 PM) is skipped; the sequence resumes the next day at 8:00 AM.
- **Timezone** — selector
- **Active Hours** (formerly "Quiet Hours") — toggle to restrict posting to a specific window
  - "Posts only sent during this window"
  - From: [time selector] — Until: [time selector]
  - **Auto-scheduled posts that would fire outside Active Hours are not published — they are held and fire at the next available slot within Active Hours.** This is a hard block, not a soft preference.
  - If a Publisher manually triggers a post **outside Active Hours**, a warning is shown: "This post is outside Active Hours." The Publisher can choose to override and post anyway. Manual posts are not hard-blocked.

#### Posting IDs (Facebook Accounts)
List of connected Facebook accounts used to post to this page:
- Name, email, Facebook User ID (masked), status, posts this week, avg reach, reach trend, last used, primary badge
- **Rotation settings:**
  - Rotate IDs toggle
  - Rotation mode: Round Robin / Performance-based
    - **Performance-based rotation (v1 — TBD):** The performance-based option is available as a UI selection in v1, but the allocation algorithm has not been defined yet. Selecting Performance-based in v1 defaults to Round Robin behavior until the algorithm ships. The algorithm will be scoped separately — see Section 23 (Deferred Decisions).
- Edit and Remove buttons per ID

#### Approval Workflow
- **Require Approval toggle** — On = posts need approval before publishing; Off = posts go straight to Queue
- **Approvers list (read-only)** — automatically shows all team members with Owner, Manager, or Approver role. Managed in Team Settings.
- Note: "Manage in Team Settings →" link for changing who can approve

**B-11 — Auto-publish is always ON:** Once a post is approved it enters the Queue and publishes automatically at its scheduled time. There is no manual publish trigger. The "Auto-publish on approval" toggle has been removed from Page Settings entirely.

#### Page Team Section
Each page has a dedicated team panel showing two groups:

**From Batch (read-only):**
- Members who have access via their batch assignment
- Shows name, role(s), and "inherited" badge
- Cannot be edited here — managed in Team Settings

**Direct Access:**
- Members added directly to this specific page (overrides batch)
- Shows role and Remove button

**Add options:**
- **Add from team** — shows existing team members not yet assigned to this page; click to add
- **Invite by email** — inline form: name, email, role selector; Send Invite disabled until all fields filled

---

## 15. Connected IDs

**Route:** `/settings/connections`
**Access:** Owner, Manager

Manage the Facebook user accounts connected to the platform for posting.

### Per-Account Card
- Name, email, Facebook User ID (masked: 100089...)
- Role (owner/user)
- Pages managed (avatar grid showing which pages this ID is used for)
- Connected date, last active
- Status: Active (green) / Expired (red) / Revoked

### Checkpoint Alert
If an account is flagged by Facebook (e.g., unusual posting activity):
- Red alert banner shows reason and explanation
- "Verify identity on Facebook" action button

### Page Stats Table (within account)
For each page this ID is used on:
- Page name, posts this week, avg reach, reach trend (↑↓~), rotation slot, rotation enabled toggle

### Actions
- **Retire** — stops the account from receiving new posts (confirmation modal). Historical data is preserved. See E-07 below.
- **Verify** — opens Facebook verification flow (if checkpointed)
- **Edit settings** — update account configuration

**E-07 — Retire ID:** "Retire" is the only ID removal action. Retiring a Posting ID stops it from receiving new posts but all historical data (reach, health score, post history, revenue) is preserved in reports. "Disconnect" as a concept has been removed from the product — all UI references are renamed to "Retire."

### Bulk Connect Flow
Clicking **+ Connect Facebook Account** opens a multi-step modal for onboarding multiple pages at once:

1. **OAuth Loading** — simulates Facebook OAuth handshake (1.8s)
2. **Select Pages** — checklist of all available Facebook pages found on the account
   - Already-connected pages shown grayed out with a "Connected" badge
   - Select 1 or more new pages to import
3. **Importing** — progress bar showing import progress
4. **Per-Page Setup** — for each newly imported page, a setup card appears one at a time:
   - Progress indicator: "Setting up page 1 of 3"
   - **Batch selector** — assign this page to a batch (Partner A / B / C)
   - **Timezone selector** — set the page's posting timezone
   - **Post interval** — how often to auto-post
   - "Next Page →" advances to the next page in the import
   - Each page can be assigned to a different batch and timezone
5. **Done** — success screen listing all newly connected pages

---

## 16. Account Settings

**Route:** `/settings/account`
**Access:** Owner, Manager (Team tab only available to both)

Three-tab settings panel.

### Tab 1 — Profile
- Name, email, profile picture upload
- Default timezone preference
- Email notification settings
- Two-factor authentication toggle
- Account status and creation date

### Tab 2 — Team Members
See [Section 17 — Team Management](#17-team-management) for full details.

### Tab 3 — Billing & Plan
- Current plan: **Professional** ($99/month)
- Plan feature list
- Usage stats: pages in use, team members, storage
- Next billing date
- Payment method on file
- Upgrade/change plan button
- Invoice history table: date, amount, status, Download button

**C-10 — Storage accounting:** Only media files (video and images) count toward storage. Captions and metadata are excluded. Draft media counts from the moment it is uploaded — not when it is published. Uploading a file to Drafts consumes storage immediately.

**F-03 — Storage full — hard block:** When storage is full, uploads are blocked entirely. A banner is shown across upload screens: "Storage limit reached — upgrade your plan or delete unused media." Users cannot upload any new files until storage is freed or the plan is upgraded.

---

## 17. Team Management

**Route:** `/settings/account` (Team Members tab)
**Access:** Owner (full), Manager (can manage members within their scope)

### Team Member List
Each member row shows:
- Name and email
- Role pills (e.g., Publisher + Approver)
- Batch pills (e.g., Partner A, Partner B)
- Status badge: Active or Pending Invitation
- Last active timestamp
- **"You" badge** on the logged-in user's own row (cannot be edited or removed)

### Editing a Member
Click the expand chevron on any member row (except Owner and yourself):
- **Roles section** — checkboxes for each role (minimum 1 required)
  - Owner, Manager, Publisher, Approver, Analyst
- **Batch Access section** — checkboxes for each batch (minimum 1 required)
  - Partner A — Lifestyle, Partner B — Education, Partner C — Women's
- **Save Changes** — commits edits with a success toast
- **Remove Member** — removes from team with a confirmation toast

### Pending Invitations
Pending members show **Resend** and **Cancel** buttons instead of the expand chevron.

**E-04 — Invite link expiry:** Invite links expire after 7 days. The Owner can resend from the pending member row — resending generates a fresh 7-day link and immediately invalidates the old one. The member row remains in Pending status until the invite is accepted.

### Invite Member Modal
Click "Invite Member" to open:
- Name field
- Email field
- Role selection — multi-select grid (Publisher, Approver, Analyst, Manager, Owner)
- Batch selection — multi-select list (Partner A, Partner B, Partner C)
- **Send Invite** button — disabled until name, email, at least 1 role, and 1 batch are filled
- On send: member added as Pending, success toast shown

### Role Permissions Reference Table
Below the member list, a read-only reference table shows all 5 roles and what each can do. Useful for operators when deciding what role to assign.

---

## 18. Role Switcher (Wireframe Demo)

A demo tool for simulating how the UI adapts per role. Accessible to the operator/presenter only.

### How to Use
1. Click the role pill in the bottom of the sidebar
2. A modal opens with two sections:
   - **Switch Role** — buttons for Owner, Manager, Publisher, Approver, Analyst
   - **Batch Scope** — shown for non-Owner roles; select which batch to simulate
3. Selecting a role + batch immediately updates the entire UI:
   - Sidebar items collapse/expand based on role
   - KPI cards show/hide based on permissions
   - Batch context banner appears for non-Owner
   - Upload page selector filters to batch pages
4. Role and batch are saved in localStorage and persist across page navigations

---

## 19. Key User Flows

### Flow 1 — Bulk Upload and Schedule
1. Navigate to **Bulk Upload**
2. Search for and select the target page (filtered to batch if non-Owner)
3. Drag-drop or click to upload media files
4. Toggle platforms per file; review copyright scan results
5. Fill captions for each file; monitor per-platform character counters
6. If a file is flagged as duplicate (already in Drafts/Queue), resolve before continuing
7. Choose auto-schedule slots
8. Click **Save to Drafts**
9. Posts appear in Drafts awaiting approval or scheduling

---

### Flow 2 — Approval Workflow
1. Publisher submits a draft for approval
2. Approver (or Manager/Owner) sees it in the **Approvals** inbox under "Pending"
3. Posts whose scheduled time has passed show an amber **Overdue** badge next to the timestamp
4. Approver reviews caption, media, platforms, and schedule
5. Options:
   - **Approve** — see step 6 below
   - **Reject** — post flagged; rejection reason sent to publisher
   - **Request Changes** — post returned to publisher with comment
6. If the post is **not overdue**: post moves to Queue; optionally add a note
7. If the post **is overdue**: a fallback panel appears — approver must choose:
   - **Reschedule to next Active Hours slot** (default, safe) — queued for e.g. Tomorrow 8:00 AM
   - **Publish immediately** — fires now; orange warning shown if outside Active Hours
8. If changes requested, publisher edits the draft and resubmits
9. Once in Queue, post publishes at scheduled time automatically (auto-publish is always ON)

---

### Flow 3 — Handle Failed Posts
1. Navigate to **Failed Posts**
2. Posts are auto-categorized:
   - **Temporary Issue** → click Retry
   - **Reconnect Needed** → click Reconnect → Facebook auth flow → re-attempt
   - **Needs Editing** → click Edit & Requeue → fix issue → save → re-enters Queue
3. Retry attempts show a loading spinner
4. Success toast confirms resolution; post moves back to Queue or Published

---

### Flow 4 — Revenue Review (Owner)
1. Navigate to **Reports → Overview**
2. Revenue summary card shows portfolio totals (weekly + monthly)
3. Per-page grid shows revenue, RPM, views, growth per page
4. Click **Earnings tab** for full revenue breakdown
5. Switch between Total Revenue / CPM / Network / Other
6. Earnings table sortable by revenue, RPM, views, growth
7. Switch to **By Posting ID** to assess account health scores
8. Switch to **Batches** to compare partner batch performance

---

### Flow 5 — Configure a New Page
1. Navigate to **Settings → Page Settings**
2. Click **Add Page**
3. Connect a Facebook page via OAuth
4. Page appears in the list — click to expand
5. Enable auto-post, select platforms, set posting interval and timezone
6. Set Active Hours window if needed
7. Add Posting IDs (Facebook accounts) for this page
8. Enable rotation if multiple IDs are added
9. Configure approval workflow (required or not)
10. Save settings

---

### Flow 7 — Bulk Connect Facebook Pages
1. Navigate to **Settings → Connected IDs**
2. Click **+ Connect Facebook Account**
3. OAuth handshake completes — available pages shown as a checklist
4. Already-connected pages are grayed out
5. Select new pages to import and click **Import X Pages**
6. Progress bar shows import in progress
7. Per-page setup begins — for each page one at a time:
   - Assign to a batch (each page can go to a different batch)
   - Set timezone and post interval
   - Click **Next Page →**
8. After last page, Done screen confirms all newly connected pages
9. Pages are now visible in Page Settings with "Needs Setup" status until auto-post is configured

---

### Flow 6 — Invite a Team Member
1. Navigate to **Settings → Account → Team Members**
2. Click **Invite Member**
3. Enter name and email
4. Select roles (e.g., Publisher + Approver)
5. Select batch(es) they should have access to (e.g., Partner A — Lifestyle)
6. Click **Send Invite** — button is disabled until all fields are filled
7. Member appears as Pending in the list
8. Once they accept, status changes to Active

---

## 20. Mobile Support

### Mobile-Supported Routes
- **Dashboard** (`/`) — full mobile layout with bottom tab nav, hero revenue card, page health scroll dots
- **Reports** (`/reports`, `/reports/results`, `/reports/earnings`, `/reports/page`, `/reports/id-performance`) — responsive charts and tables
- **Failed Posts** (`/failed-posts`) — categorized list with action buttons
- **Queue** (`/queue`) — view-only post list

### Desktop-Only Routes
Attempting to access these on mobile shows a "Desktop Required" banner:
- Bulk Upload
- Single Post
- Drafts
- Approvals
- All Settings pages

### Mobile Layout Differences
- Sidebar is replaced by a bottom navigation bar
- Single-column card stacking
- Horizontal scroll for page health indicators
- Simplified KPI cards

---

## 21. Permission Matrix

### Feature Access by Role

| Feature | Owner | Co-Owner | Manager | Publisher | Approver | Analyst |
|---------|-------|----------|---------|-----------|----------|---------|
| View dashboard | ✅ Full | ✅ Full | ✅ No revenue | ✅ Limited | ✅ Limited | ✅ Limited |
| View revenue & earnings | ✅ | ✅ | — | — | — | — |
| View RPM | ✅ | ✅ | ✅ | — | — | — |
| View monetization status | ✅ | ✅ | ✅ | — | — | — |
| View payout status | ✅ | ✅ | ✅ | — | — | — |
| Upload & schedule posts | ✅ | ✅ | ✅ | ✅ | — | — |
| Approve / reject posts | ✅ | ✅ | ✅ | — | ✅ | — |
| Manage pages & settings | ✅ | ✅ | ✅ | — | — | — |
| Manage team members | ✅ | ✅ (Manager and below only) | ✅ (within scope) | — | — | — |
| View Reports | ✅ All tabs | ✅ All tabs | ✅ No Earnings | — | — | ✅ Overview, Results, Batches only (By Posting ID blocked) |
| Billing & subscription | ✅ | ✅ | — | — | — | — |
| Connected IDs | ✅ | ✅ | ✅ | — | — | — |

### UI Elements by Role

| UI Element | Owner | Co-Owner | Manager | Publisher | Approver | Analyst |
|-----------|-------|----------|---------|-----------|----------|---------|
| Revenue KPI card | ✅ | ✅ | — | — | — | — |
| RPM KPI card | ✅ | ✅ | ✅ | — | — | — |
| Revenue column in All Pages table | ✅ | ✅ | — | — | — | — |
| RPM column in All Pages table | ✅ | ✅ | ✅ | — | — | — |
| Monetization + payout badges | ✅ | ✅ | ✅ | — | — | — |
| Earnings tab in Reports | ✅ | ✅ | — | — | — | — |
| Top Performers revenue column | ✅ | ✅ | ✅ | Views only | Views only | Views only |
| Batch context banner | — | — | ✅ | ✅ | ✅ | ✅ |
| Upload, Drafts, Queue in sidebar | ✅ | ✅ | ✅ | ✅ | — | — |
| Approvals in sidebar | ✅ | ✅ | ✅ | — | ✅ | — |
| Reports in sidebar | ✅ | ✅ | ✅ | — | — | ✅ |
| Page Settings, Connected IDs | ✅ | ✅ | ✅ | — | — | — |
| Account Settings | ✅ | ✅ | ✅ | — | — | — |

---

## 22. Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0C6AFF` | Buttons, active states, links |
| Success | `#4ADE80` | Published, connected, approved states |
| Warning | `#FBBF24` | Expiring tokens, pending states |
| Error | `#EF4444` | Failed posts, disconnected, rejected |
| Owner color | `#FF6B2B` | Owner role pill |
| Manager color | `#4ADE80` | Manager role pill |
| Publisher color | `#3B82F6` | Publisher role pill |
| Approver color | `#FBBF24` | Approver role pill |
| Analyst color | `#6366F1` | Analyst role pill |

### Batch Colors

| Batch | Color |
|-------|-------|
| Partner A — Lifestyle | `#8B5CF6` (purple) |
| Partner B — Education | `#FF6B2B` (orange) |
| Partner C — Women's | `#0EA5E9` (blue) |

### Typography

| Element | Size | Weight |
|---------|------|--------|
| Page title | 22px | Semibold |
| Section heading | 15px | Semibold |
| Body | 13px | Regular |
| Caption/label | 12px | Regular |
| Micro label | 11px | Medium, uppercase |

### Status Badges

| Status | Style |
|--------|-------|
| Published | Green dot + text |
| Scheduled | Blue dot + text |
| Draft | Grey dot + text |
| Failed | Red left border + badge |
| Paused | Gray left border + badge + sub-badges |
| Pending | Amber dot + text |
| Disconnected | Red dot + text |
| Expiring | Amber dot + text |

### Cards & Containers
- Card background: `var(--surface)`
- Card border: 1px solid `var(--border)`
- Card radius: `rounded-xl` (12px)
- Card padding: `p-5` (20px)
- Modal radius: `rounded-2xl`
- Modal backdrop: blur + semi-transparent overlay

---

---

## 23. Deferred Decisions

The following product areas are acknowledged but not yet defined. They will be scoped in a future documentation update.

| # | Topic | Notes |
|---|-------|-------|
| 1 | Professional plan limits ($99/month) | Page count, team seat limits, storage caps, and feature gates TBD |
| 2 | Free trial / onboarding flow | Trial duration, trial-to-paid conversion, and onboarding steps TBD |
| 3 | Performance-based rotation algorithm | How Posting ID slots are allocated based on views/reach performance. v1 defaults to Round Robin when Performance-based is selected. Algorithm TBD — will require defining the scoring window, slot weighting, and rebalancing frequency. |

---

*This document covers the full scope of the MetaReverse platform as built in the interactive wireframe. For live access, visit the wireframe at https://wireframes-seven-rouge.vercel.app*

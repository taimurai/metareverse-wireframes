# MetaReverse — Team Feedback & Feature Status
**Last updated:** April 3, 2026
**Live wireframe:** https://wireframes-seven-rouge.vercel.app

---

## Round 1 Feedback — Built ✅

| # | Feedback | Feature Built | Status |
|---|----------|--------------|--------|
| 1 | Dashboard needs operational health view per page | Page Health & Monetization widget — 7-page grid with monetization status, flags, copyright strikes, distribution restricted, payout status | ✅ Live |
| 2 | Payout status show hojae to maza ajae | Payout status badges on each page card: ✓ Paid / ⏳ Pending / ⊘ On Hold | ✅ Live |
| 3 | Pre-post copyright alert when uploading | Copyright scan result per file in captioning stage (✅ Clear / ⚠ Possible match / ❌ Match found) | ✅ Live |
| 4 | ID Checkpoint diagnosis when token expires | Checkpoint Diagnosis panel on Connected IDs page for expired/flagged accounts | ✅ Live |
| 5 | Caption length indicator | Per-platform char count with green/amber/red status (FB: 63,206 / IG: 2,200 / TH: 500) | ✅ Live |
| 6 | Duplicate content detection | Warns if same file is already in Drafts/Queue for selected page (amber border + banner) | ✅ Live |
| 7 | Active hours instead of quiet hours | Renamed to "Active Hours" with flipped framing: "Posts only sent during this window" | ✅ Live |
| 8 | KPI cards need Today / Yesterday view | 4-option toggle: Today / Yesterday / 7 Days / 28 Days with dynamic KPI data per period | ✅ Live |

---

## Round 2 Feedback — Built ✅

| # | Feedback | Feature Built | Status |
|---|----------|--------------|--------|
| 1 | Sidebar order doesn't follow workflow logic | Reordered: Upload → Drafts → Approvals → Queue → Failed Posts → Reports | ✅ Live |
| 2 | By Posting ID missing from Reports nav | Added "By Posting ID" sub-item under Reports in sidebar | ✅ Live |
| 3 | Batch Groups missing from Page Settings nav | Added "Batch Groups" sub-item under Page Settings in sidebar | ✅ Live |

---

## Role-Based Access Control (RBAC)

### Overview

MetaReverse uses **batch-scoped teams**. A "batch" is a named group of pages assigned to a partner or team. Access is granted at the batch level — team members only see pages in their assigned batch(es). The Owner sees everything.

Roles are **stackable** — one person can hold multiple roles (e.g. Publisher + Approver on Batch A).

---

### Role Definitions

#### 👑 Owner
- **Scope:** Platform-wide (all batches, all pages)
- **Who this is:** The account holder / operator running the platform
- **What they can do:**
  - Full Dashboard with all KPIs including revenue and RPM
  - Create, schedule, and publish posts on any page
  - Approve or reject any post on any page
  - Add/remove pages, configure all page settings
  - Manage all team members — invite, assign roles, change batches, remove
  - View Earnings tab in Reports (revenue, RPM, payout data)
  - Access all settings including billing and connected IDs
  - See monetization status and payout status per page

#### 🟢 Manager
- **Scope:** Platform-wide OR scoped to assigned batch(es)
- **Who this is:** A trusted operator or partner lead managing a set of pages
- **What they can do:**
  - Dashboard with RPM visible but revenue hidden
  - Create, schedule, and publish posts on pages in their scope
  - Approve or reject posts (implicit right — no Approver role needed)
  - Add/remove pages, configure page settings in their scope
  - Manage team members — invite, assign roles, remove (within their scope)
  - View all Reports tabs except Earnings
  - See RPM and monetization status but NOT revenue figures or payout status
- **What they cannot do:**
  - View revenue, earnings tab, or payout data
  - Access billing settings

#### 🔵 Publisher
- **Scope:** Assigned batch(es) only — sees only pages in their batch
- **Who this is:** A content creator uploading and scheduling posts
- **What they can do:**
  - Upload posts (Bulk Upload / Single Post) — page selector shows only their batch pages
  - View and manage their own drafts
  - View their own scheduled posts in Queue
  - View basic Dashboard (Network Views + Operations Pulse only — no revenue/RPM)
  - Top Performers shows views only (no revenue)
- **What they cannot do:**
  - Approve or reject posts
  - See other publishers' posts in Drafts or Queue
  - Access Reports, Page Settings, Connected IDs, Account Settings
  - See revenue, RPM, monetization status, or payout data

#### 🟡 Approver
- **Scope:** Assigned batch(es) only
- **Who this is:** A reviewer responsible for gatekeeping content before it goes live
- **What they can do:**
  - View Approvals inbox — only posts from their batch
  - Approve or reject posts with comments
  - View all Drafts in their batch (not just own)
  - View Queue in their batch (read-only)
  - View basic Dashboard for their batch
- **What they cannot do:**
  - Upload or create posts
  - Access Reports, Page Settings, Connected IDs, or Account Settings
  - See revenue, RPM, or payout data

#### 🟣 Analyst
- **Scope:** Assigned batch(es) only
- **Who this is:** A reporting/analytics user with read-only access to performance data
- **What they can do:**
  - View Reports (Overview, Results, Batches tabs) for their batch
  - View Dashboard (views + operations only) for their batch
- **What they cannot do:**
  - Upload, approve, or manage anything
  - Access Earnings tab, revenue figures, RPM, or payout data
  - Access any settings pages

---

### Permission Matrix

| Permission | Owner | Manager | Publisher | Approver | Analyst |
|-----------|-------|---------|-----------|----------|---------|
| View dashboard | ✅ | ✅ | ✅ (limited) | ✅ (limited) | ✅ (limited) |
| View revenue & earnings | ✅ | — | — | — | — |
| View RPM | ✅ | ✅ | — | — | — |
| View monetization status | ✅ | ✅ | — | — | — |
| View payout status | ✅ | ✅ | — | — | — |
| Upload & schedule posts | ✅ | ✅ | ✅ | — | — |
| Approve / reject posts | ✅ | ✅ | — | ✅ | — |
| Manage pages & settings | ✅ | ✅ | — | — | — |
| Manage team members | ✅ | ✅ | — | — | — |
| View all reports tabs | ✅ | ✅ (no Earnings) | — | — | ✅ (limited) |
| Billing & subscription | ✅ | — | — | — | — |
| Connected IDs | ✅ | ✅ | — | — | — |

---

### Batch Access Control

Batches are named groups of pages. Each non-Owner user is assigned to one or more batches and can only see pages within those batches.

| Batch | Pages | Typical Team |
|-------|-------|-------------|
| **All Batches** (Owner only) | All 7 pages | Taimur (Owner) |
| **Partner A — Lifestyle** | Laugh Central, Fitness Factory, Daily Health Tips | Sarah (Publisher + Approver), Fatima (Publisher) |
| **Partner B — Education** | History Uncovered, TechByte, Money Matters | Ahmed (Publisher), Nida (Analyst), Fatima (Publisher) |
| **Partner C — Women's** | Know Her Name | Aisha (Manager + Publisher) |

---

### What Changes in the UI Per Role

| UI Element | Owner | Manager | Publisher | Approver | Analyst |
|-----------|-------|---------|-----------|----------|---------|
| Revenue KPI card | ✅ | — | — | — | — |
| RPM KPI card | ✅ | ✅ | — | — | — |
| Revenue column in All Pages table | ✅ | — | — | — | — |
| RPM column in All Pages table | ✅ | ✅ | — | — | — |
| Monetization + payout badges (Page Health) | ✅ | ✅ | — | — | — |
| Earnings tab in Reports nav | ✅ | — | — | — | — |
| Top Performers shows revenue | ✅ | ✅ | views only | views only | views only |
| Batch context banner | — | ✅ | ✅ | ✅ | ✅ |
| Sidebar: Upload, Drafts, Queue | ✅ | ✅ | ✅ | — | — |
| Sidebar: Approvals | ✅ | ✅ | — | ✅ | — |
| Sidebar: Reports | ✅ | ✅ | — | — | ✅ |
| Sidebar: Page Settings, Connected IDs | ✅ | ✅ | — | — | — |
| Sidebar: Account Settings | ✅ | ✅ | — | — | — |

---

## Team Management Features

### Account Settings → Team Members Tab

| Feature | Description |
|---------|-------------|
| Member list | Shows all team members with role pills and batch pills |
| "You" badge | Logged-in user is highlighted with an orange "You" badge |
| Expandable edit panel | Click the chevron on any member (except Owner/yourself) to edit |
| Stackable role checkboxes | Toggle multiple roles per member — minimum 1 required |
| Batch checkboxes | Toggle batch access — minimum 1 required |
| Save Changes | Commits edits immediately with a toast confirmation |
| Remove member | Removes from team with confirmation toast |
| Pending invites | Show "Resend" and "Cancel" action buttons instead of expand |
| Invite Member modal | Full modal: name, email, role selection, batch selection |
| Send Invite validation | Disabled until name, email, at least 1 role, and 1 batch are filled |
| Role Permissions table | Reference table showing all 5 roles and their permissions |

### Page Settings → Page Team Section

Each page panel now shows a dedicated Page Team section:

| Section | Description |
|---------|-------------|
| From Batch | Read-only list of members who have access via their batch assignment. Shows role(s) and "inherited" badge. Cannot be edited here. |
| Direct Access | Members added directly to this specific page (overrides batch). Shows Remove button. |
| Add from team | Opens list of existing team members not yet on this page — click to add |
| Invite by email | Inline form: name, email, and role selector. Send Invite disabled until all fields filled. Success toast on send. |

### Approval Workflow (Page Settings)

Simplified to 3 controls only:

| Control | Description |
|---------|-------------|
| Require Approval toggle | On = posts need approval before publishing. Off = posts go straight to queue. |
| Approvers list (read-only) | Shows all members with Owner, Manager, or Approver role. Inherited automatically. Managed via Team Settings. |
| Auto-publish on approval | On = post goes live at scheduled time once approved. Off = approver must manually publish. |

> **Why approvers are read-only here:** Who can approve is determined by role assignment (Owner/Manager/Approver), not configured per page. This prevents duplicate/conflicting settings across two places.

---

## Role Switcher (Wireframe Demo)

The sidebar includes a role switcher for demonstrating how the UI adapts per role:

- Click the current role pill in the sidebar to open the switcher
- Select any role (Owner / Manager / Publisher / Approver / Analyst)
- For non-Owner roles, a batch selector appears to choose which batch to simulate
- The entire UI adapts immediately: nav collapses, KPIs hide/show, batch context banner appears
- Role and batch are persisted in localStorage across page navigations

---

## Known Gaps — Still To Build

| # | Item | Who It Affects | Priority |
|---|------|---------------|----------|
| 1 | Upload page: page selector filtered to Publisher's batch pages | Publisher | High |
| 2 | Approvals page: inbox scoped to Approver's assigned batch | Approver | High |
| 3 | Queue: Publisher sees own posts only; Approver/Manager sees full batch | Publisher, Approver | High |
| 4 | Drafts: Publisher sees own drafts only | Publisher | High |
| 5 | Reports: data scoped to assigned batch for non-Owner roles | All non-Owner | Medium |

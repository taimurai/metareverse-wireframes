# TRD Compliance Checklist — Phase 1 Wireframes

**Source:** Technical Requirement Document (1).docx (Locked)
**Status:** Tracking what's built vs what's remaining

---

## 8.1 Customer Pages / Screens (23) — TRD LOCKED

| # | Page | TRD Status | Wireframe | Notes |
|---|------|-----------|-----------|-------|
| 1 | Login | MUST | ❌ Not built | |
| 2 | Signup | MUST | ❌ Not built | |
| 3 | Verify Email | MUST | ❌ Not built | |
| 4 | Forgot Password | MUST | ❌ Not built | |
| 5 | Reset Password | MUST | ❌ Not built | |
| 6 | Dashboard (All Pages) | MUST | ✅ Built | KPI cards, page table, 3 tabs, alerts |
| 7 | Bulk Upload | MUST | ✅ Built | Dropzone, Airtable grid, schedule controls, Media/Text tabs |
| 8 | Single Post Creation | MUST | ❌ Not built | |
| 9 | Queue | MUST | ❌ Not built | |
| 10 | Calendar | MUST | ❌ Not built | |
| 11 | Failed Posts | MUST | ❌ Not built | (preview in Dashboard tab, needs dedicated page) |
| 12 | Page List / All Pages | MUST | ⚠️ Partial | Part of Dashboard, may need separate if distinct |
| 13 | Page Settings | MUST | ❌ Not built | |
| 14 | Connected IDs (FB User Accounts) | MUST | ❌ Not built | |
| 15 | ID Settings | SHOULD | ❌ Not built | |
| 16 | Reporting Overview | SHOULD | ❌ Not built | |
| 17 | Page Report | SHOULD | ❌ Not built | |
| 18 | Account Settings | MUST | ❌ Not built | |
| 19 | Billing & Subscription | MUST | ❌ Not built | |
| 20 | Invoices | SHOULD | ❌ Not built | |
| 21 | Terms | MUST | ❌ Not built | |
| 22 | Privacy | MUST | ❌ Not built | |
| 23 | Help / FAQ | SHOULD | ❌ Not built | |

**Progress: 2/23 built (+ 1 partial)**

---

## 8.2 Customer Modals (12) — TRD LOCKED

| # | Modal | TRD Status | Wireframe | Notes |
|---|-------|-----------|-----------|-------|
| 1 | Connect Facebook (OAuth start) | MUST | ❌ Not built | |
| 2 | Reconnect All (token expired) | MUST | ❌ Not built | |
| 3 | Edit Scheduled Post | MUST | ❌ Not built | |
| 4 | Delete Post confirmation | MUST | ❌ Not built | |
| 5 | Disconnect Page confirmation | MUST | ❌ Not built | |
| 6 | Preflight Validation issues list | MUST | ❌ Not built | |
| 7 | Bulk Edit Captions | MUST | ❌ Not built | |
| 8 | Partial Success Details | MUST | ❌ Not built | |
| 9 | Retry Confirmation / Options | MUST | ❌ Not built | |
| 10 | Upgrade Paywall | MUST | ❌ Not built | |
| 11 | Payment Failed / Grace Period | MUST | ❌ Not built | |
| 12 | Video Thumbnail Selector | SHOULD | ❌ Not built | |

**Progress: 0/12 built**

---

## 8.3 Reusable UI Components (20) — TRD LOCKED

| # | Component | TRD Status | Wireframe | Notes |
|---|-----------|-----------|-----------|-------|
| 1 | App shell (sidebar, header) | MUST | ✅ Built | |
| 2 | Page list table/grid | MUST | ✅ Built | |
| 3 | Filters + search | MUST | ✅ Built | |
| 4 | KPI cards | MUST | ✅ Built | |
| 5 | Status badge | MUST | ✅ Built | |
| 6 | Button set (primary/secondary/danger) | MUST | ✅ Built | |
| 7 | Modal base | MUST | ❌ Not built | |
| 8 | Toast/alerts | MUST | ✅ Built | AlertBanner component |
| 9 | Upload dropzone | MUST | ✅ Built | |
| 10 | Progress bar | MUST | ✅ Built | |
| 11 | Airtable-style grid | MUST | ✅ Built | |
| 12 | Editable cells (text areas) | MUST | ✅ Built | |
| 13 | Drag handle and row reorder | MUST | ✅ Built | |
| 14 | Date/time picker | MUST | ⚠️ Partial | Display only, no picker modal |
| 15 | Calendar grid | MUST | ❌ Not built | |
| 16 | Platform toggle checkboxes (FB/IG/Threads) | MUST | ✅ Built | |
| 17 | Character counter | MUST | ✅ Built | |
| 18 | Error inline cell indicator | MUST | ❌ Not built | |
| 19 | Loading skeleton | SHOULD | ❌ Not built | |
| 20 | Pagination | SHOULD | ❌ Not built | |

**Progress: 13/20 built (+ 1 partial)**

---

## 8.4 SuperAdmin Portal (11 pages) — TRD LOCKED

| # | Page | Wireframe | Notes |
|---|------|-----------|-------|
| 1 | SuperAdmin Login (mandatory 2FA) | ❌ Not built | |
| 2 | SuperAdmin Dashboard (health overview) | ❌ Not built | |
| 3 | Tenant List | ❌ Not built | |
| 4 | Tenant Detail | ❌ Not built | |
| 5 | User Detail | ❌ Not built | |
| 6 | Connections Overview | ❌ Not built | |
| 7 | Job Monitor | ❌ Not built | |
| 8 | Job Detail | ❌ Not built | |
| 9 | Billing Overview | ❌ Not built | |
| 10 | Audit Log Viewer | ❌ Not built | |
| 11 | Support Access Control | ❌ Not built | |

**Progress: 0/11 built**

---

## TRD Functional Requirements Coverage (Section 7)

| Module | TRD Section | Wireframe Coverage |
|--------|------------|-------------------|
| 7.1 Onboarding & Auth | Signup, Login, Password reset, 2FA, Sessions | ❌ No auth screens |
| 7.2 OAuth & Page Connection | Connect FB, discover pages, multi-accounts, permission denial | ❌ No OAuth modal |
| 7.3 Dashboard | Hero metrics, page list, filters, quick nav tabs | ✅ Built |
| 7.4 Bulk Upload | Media/Text tabs, grid, thumbnails, schedule, distribution, bulk actions | ✅ Built |
| 7.5 Single Post Creation | Image/Video/Text, caption, comments, schedule, validation | ❌ Not built |
| 7.6 Queue Management | Unified queue, schedule rules, edit/delete scheduled | ❌ Not built |
| 7.7 Calendar Operations | Day/Week/Month views, click/drag/filter | ❌ Not built |
| 7.8 Post States | Draft→Scheduled→Publishing→Published/Partial/Failed | ⚠️ Status badges only |
| 7.9 Failed Post Handling | Failed view, error reasons, retry per-platform | ⚠️ Dashboard tab preview only |
| 7.10 Preflight Validation | Blockers/warnings, image policy checker, fix paths | ❌ Not built |
| 7.11 Per-Page Settings | Quiet hours, interval, auto-post toggles, timezone | ❌ Not built |
| 7.12 Page Management | Disconnect page, connected IDs management | ❌ Not built |
| 7.13 Token Expiry & Reconnection | Warning timeline, reconnect UX, paused posts | ⚠️ Alert banners only |
| 7.14 Billing & Subscription | Stripe, plans, feature gating, payment failure | ❌ Not built |
| 7.15 Notifications | In-app banners, email templates | ⚠️ Alert banners only |
| 7.16 Reporting | Overview, page report | ❌ Not built |
| 7.17 SuperAdmin Portal | All 11 screens | ❌ Not built |

---

## OVERALL PROGRESS

| Category | Total (TRD) | Built | Remaining |
|----------|------------|-------|-----------|
| Customer Pages | 23 | 2 | **21** |
| Customer Modals | 12 | 0 | **12** |
| Reusable Components | 20 | 13 | **7** |
| SuperAdmin Pages | 11 | 0 | **11** |
| **TOTAL** | **66** | **15** | **51** |

**Completion: 23%**

---

## RECOMMENDED BUILD ORDER (remaining 51 items)

### Sprint 1: Auth + Core Flows
1. Login page
2. Signup page
3. Verify Email page
4. Forgot / Reset Password pages
5. Modal base component
6. Connect Facebook (OAuth) modal

### Sprint 2: Core Pages
7. Single Post Creation page
8. Queue page (unified scheduling workspace)
9. Calendar page + Calendar grid component
10. Failed Posts page (dedicated)
11. Date/time picker component

### Sprint 3: Modals
12. Edit Scheduled Post modal
13. Delete Post confirmation modal
14. Preflight Validation modal
15. Bulk Edit Captions modal
16. Video Thumbnail Selector modal
17. Error inline cell indicator component

### Sprint 4: Management + Settings
18. Page Settings page
19. Connected IDs page
20. ID Settings page
21. Account Settings page
22. Reconnect All modal
23. Disconnect Page confirmation modal

### Sprint 5: Billing + Reports
24. Billing & Subscription page
25. Invoices page
26. Upgrade Paywall modal
27. Payment Failed / Grace Period modal
28. Reporting Overview page
29. Page Report page

### Sprint 6: Legal + Support + Polish
30. Terms page
31. Privacy page
32. Help / FAQ page
33. Partial Success Details modal
34. Retry Confirmation modal
35. Loading skeleton component
36. Pagination component

### Sprint 7: SuperAdmin Portal
37-47. All 11 SuperAdmin screens

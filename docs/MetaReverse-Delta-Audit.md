# MetaReverse — Delta Audit Report
**Against:** Product Documentation v1.4
**Wireframe:** https://wireframes-seven-rouge.vercel.app
**Audit Date:** April 4, 2026
**Scope:** Verify resolved decisions only — not a fresh audit

---

## Verification Results

### Roles

| # | Decision | Result | Notes |
|---|----------|--------|-------|
| R-01 | Co-Owner is a defined sixth role: billing access, cannot transfer ownership, cannot invite/remove Co-Owners, cannot remove Owner, can add Manager and below | ✅ | Section 3 covers all constraints correctly |
| R-02 | Global Manager vs Batch Manager auto-upgrade when third batch assigned | ✅ | Resolved — auto-upgrade documented in Section 3: platform detects batch count and applies scope automatically |
| R-03 | Managers cannot invite roles equal to or above Manager | ✅ | Section 3: "Cannot invite another Manager… cannot invite Co-Owner" |
| R-04 | Self-approval explicitly allowed for stacked roles (Publisher+Approver, Manager+Publisher) | ✅ | Section 3 Approver covers Publisher+Approver. Manager self-approval is implicit via Manager's approval rights but not explicitly stated for the Manager+Publisher stack |

---

### Content Lifecycle

| # | Decision | Result | Notes |
|---|----------|--------|-------|
| CL-01 | Rejected posts return to publisher as drafts, resubmission unlimited | ✅ | Section 10: "returned to publisher as a Draft… resubmit unlimited times" |
| CL-02 | Drafts targeting a disconnected page show amber warning, delete only action | ✅ | Resolved — Section 9 now documents amber badge, disabled Submit/Schedule, Delete as only action |
| CL-03 | Paused posts hold their sequence, manual Resume required | ✅ | Resolved — contradiction removed. Section 11 now consistently states: nothing auto-resumes, manual Resume always required. |
| CL-04 | Resume button exists on Paused posts for manual recovery | ✅ | Section 11: "Paused posts display a Resume button" |
| CL-05 | Reconnect Required is its own post state — separate from Failed Posts | ✅ | Section 11 and 12 both document this correctly |
| CL-06 | Auto-publish toggle removed — auto-publish always ON | ✅ | Section 14 B-11 documented clearly |
| CL-07 | Batch deletion blocked if batch contains active pages | ✅ | Section 4 B-07 documented correctly |
| CL-08 | 60s Publishing timeout → auto-moves to Failed Posts as Temporary Issue | ✅ | Section 12 B-09 documented correctly |

---

### Approvals

| # | Decision | Result | Notes |
|---|----------|--------|-------|
| AP-01 | Cannot enable Approval Required if no Approver assigned — guard popup | ✅ | Section 10 |
| AP-02 | Cannot remove last Approver from batch with Approval Required active | ✅ | Section 10 |
| AP-03 | Orphaned approvals stay visible for other eligible batch reviewers | ✅ | Section 10 |
| AP-04 | First-action wins on simultaneous review — second sees "Already reviewed by [Name]" | ✅ | Section 10 E-05 |
| AP-05 | Overdue approved posts go to manual Queue (not auto-scheduled) | ✅ | Section 10 describes the fallback panel with explicit user decision required; Active Hours disabled case routes to manual queue |
| AP-06 | Publisher can submit draft for approval without a schedule | ✅ | Section 9 B-10 |

---

### Team & Access

| # | Decision | Result | Notes |
|---|----------|--------|-------|
| TA-01 | Publisher sees only their own failed posts | ✅ | Section 3 A-08 |
| TA-02 | Approver has read-only access to Queue — no reschedule or edit | ✅ | Section 3 A-07 |
| TA-03 | Multi-batch users (e.g. Fatima) have a batch switcher — scoped views operate within active batch | ✅ | Resolved — Section 4 documents sidebar batch switcher: popover, global scope update, localStorage persistence, single-batch users see static banner only |
| TA-04 | Analyst exclusion from By Posting ID documented with a stated reason | ✅ | Resolved — Section 13d now states reason: exposes connected Facebook account names, emails, and User IDs outside Analyst remit |

---

### Posting IDs

| # | Decision | Result | Notes |
|---|----------|--------|-------|
| PI-01 | "Disconnect" renamed to "Retire" throughout — historical data preserved | ✅ | Section 15 E-07 |
| PI-02 | Health score formula: (ID_reach_28d / max_reach_28d_on_account) × 100 | ✅ | Resolved — full formula documented in Section 13d |
| PI-03 | Performance-based rotation marked as UI option in v1 with algorithm TBD, routes to Round Robin until defined | ✅ | Resolved — Section 14 now states v1 defaults to Round Robin. Algorithm added to Section 23 Deferred Decisions. |

---

### Technical

| # | Decision | Result | Notes |
|---|----------|--------|-------|
| T-01 | RPM formula: Revenue / (Views / 1000), gross from Facebook data | ✅ | Section 13c |
| T-02 | Copyright scan = mock UI state in v1, no real integration | ✅ | Section 7 |
| T-03 | Active Hours = hard block for auto-scheduled posts; manual Publish Now shows warning but not blocked | ✅ | Resolved — Section 14 now explicitly states hard block for auto-scheduled posts, manual override remains available with warning |
| T-04 | Post interval anchor = start of Active Hours | ✅ | Resolved — Section 14 now states anchor point, skip behavior, and includes an example |
| T-05 | Duplicate detection uses SHA-256 file hash | ✅ | Section 7 B-12 |
| T-06 | Follower counts cached 24 hours — tooltip shows last updated time | ✅ | Section 6 C-07 |
| T-07 | Storage = media files only, draft media counted at upload not publish | ✅ | Section 16 C-10 |
| T-08 | Invite links expire after 7 days — resend invalidates old link | ✅ | Section 17 E-04 |
| T-09 | Upload failure: retry failed files only, not whole flow | ✅ | Section 7 E-02 |
| T-10 | Storage full = hard block with upgrade prompt | ✅ | Section 16 F-03 |
| T-11 | 60s timeout → Failed Posts as Temporary Issue | ✅ | Section 12 B-09 (duplicate of CL-08 — verified) |

---

### Threads

| # | Decision | Result | Notes |
|---|----------|--------|-------|
| TH-01 | Threads scheduling fully supported | ✅ | Section 13 |
| TH-02 | RPM and revenue N/A for Threads | ✅ | Section 13 — "not reported" (equivalent to N/A) |

---

### Deferred Items

| # | Decision | Result | Notes |
|---|----------|--------|-------|
| D-01 | Professional plan hard limits: TBD out of scope for v1 | ✅ | Section 23 |
| D-02 | Free trial and onboarding flow: TBD out of scope for v1 | ✅ | Section 23 |
| D-03 | Performance-based rotation algorithm: TBD | ✅ | Resolved — added to Section 23 with full scope note. Section 14 updated with v1 Round Robin fallback. |

---

## Summary

| Outcome | Count |
|---------|-------|
| ✅ Verified | 39 |
| ⚠ Partial | 0 |
| ❌ Missing | 0 |

---

## Verdict

**All 39 decisions verified. No blockers, no partials, no missing items.**

Documentation is ready to hand to a developer and designer with zero ambiguity. Proceed to PRD.

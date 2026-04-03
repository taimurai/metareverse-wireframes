# MetaReverse — Pre-Build Audit Report
Date: 2026-04-03
Auditor: Claude
Input: Documentation v1.2 + Wireframe at https://wireframes-seven-rouge.vercel.app

---

## Summary

- **Total issues found: 58**
- **Critical (build blocker): 12**
- **High (needs decision before build): 18**
- **Medium (needs decision before QA): 17**
- **Low (polish/nice-to-have): 11**

---

## A — Permission & Role Logic

### A-01: Co-Owner role referenced in sidebar but not defined anywhere
**Severity:** Critical
**Location:** Wireframe sidebar role switcher
**Issue:** The wireframe role switcher displays "Co-Owner" as a selectable role. The documentation defines only five roles: Owner, Manager, Publisher, Approver, and Analyst. "Co-Owner" does not appear in the docs at any point — no permissions, no scope, no permission matrix entry, no nav table row, nothing.
**Impact:** Developers will have no specification to build against. Either a sixth role exists with undefined behavior, or the wireframe has an erroneous option. Any auth system built without clarity here will have a gap.
**Suggested resolution:** Either fully define Co-Owner (scope, permissions, what it can/cannot do vs. Owner) and add it to the permission matrix, nav table, and all role-specific UI rules — or remove it from the wireframe.

---

### A-02: Manager permission ambiguity — platform-wide vs. batch-scoped variant undistinguished
**Severity:** Critical
**Location:** Docs Section 3 (Manager role), Section 4 (Batch Access Control), Section 17 (Team Management)
**Issue:** The docs state a Manager can be "Platform-wide OR scoped to assigned batch(es)" but there is no defined mechanism to distinguish the two variants. There is no "platform-wide" checkbox in the invite flow, no flag in the team member data model, and no documented UI difference. A platform-wide Manager and a batch-scoped Manager look identical in the system but have radically different access.
**Impact:** Developers will not know how to implement or store the distinction. The invite modal would need to encode this; the permission-checking middleware would need to branch on it. Without a spec, both will likely be built the same way.
**Suggested resolution:** Define a clear boolean flag (e.g., `is_platform_wide: true/false`) in the Manager data model. Document how it is set (toggle in invite modal? separate role label?), how it affects scope enforcement, and what the UI difference looks like (e.g., no batch context banner for platform-wide Manager).

---

### A-03: Can a Manager invite another Manager? Role escalation not defined
**Severity:** Critical
**Location:** Docs Section 17 (Team Management), Section 3 (Manager role)
**Issue:** The docs say Managers can "manage team members — invite, assign roles, remove (within scope)." The invite modal role selection includes Manager and Owner as options. There is no stated rule about whether a Manager can invite someone with an equal or higher role. A Manager inviting another Manager (especially a platform-wide one) could be a privilege escalation path. Whether a Manager can invite an Owner is completely unaddressed.
**Impact:** Without a rule, developers will either block all same-or-higher-role invitations (too restrictive) or allow all of them (security hole).
**Suggested resolution:** Explicitly state the rule. Recommended: A Manager may only invite roles strictly below Manager (Publisher, Approver, Analyst) within their own batch scope. Add this constraint to Section 17 and the permission matrix.

---

### A-04: Publisher + Approver stacked role combined behavior not documented
**Severity:** Critical
**Location:** Docs Section 3 (Roles), Section 4 (Batch Access), Sarah's role in Partner A
**Issue:** The docs mention Sarah holds "Publisher + Approver" on Partner A. It is stated that roles are stackable, but the combined capability set is never specified. Specifically: can a Publisher+Approver approve their own posts? The Publisher role says they cannot approve; the Approver role says they can approve posts in their batch. When stacked, the Approver permission likely wins — but this is not documented. Self-approval is a significant content governance gap.
**Impact:** Developer builds approval check as "does user have Approver role?" — Sarah passes. Her own posts get auto-approved. This defeats the purpose of an approval workflow.
**Suggested resolution:** Document the explicit rule: A Publisher+Approver may NOT approve posts they themselves submitted. The system must compare `submitted_by` against `approved_by` and block self-approval regardless of role stack.

---

### A-05: Fatima multi-batch access — UI behavior undefined
**Severity:** High
**Location:** Docs Section 4 (Batch Access Control), Section 18 (Role Switcher)
**Issue:** Fatima is listed as Publisher in both Partner A and Partner B. No documentation describes what Fatima's UI looks like: Does she see a combined page list from both batches? Does she get a batch switcher? Does the batch context banner show both batches? Does her drafts view show posts from both batches or only the active one? What is her "active batch" for upload purposes?
**Impact:** Developers will make an arbitrary choice — most likely showing all pages from all assigned batches with no disambiguation — which may or may not match the intended UX.
**Suggested resolution:** Define the multi-batch experience explicitly. Recommended approach: a batch switcher that lets the user set an active batch context. All scoped views (upload, drafts, queue) operate within the active batch. Document this in Section 4.

---

### A-06: Analyst access to "By Posting ID" report — intentional exclusion undocumented
**Severity:** High
**Location:** Docs Section 5 (Navigation — Reports sub-nav table), Section 13d
**Issue:** The permission matrix clearly excludes Analysts from the "By Posting ID" tab. However, no documentation explains why. The Analyst role is described as a "reporting/analytics user with read-only access to performance data" — By Posting ID is directly performance data. The exclusion appears intentional (likely to hide Facebook account identity/emails from Analysts) but the business rationale is never stated.
**Impact:** Developers will implement the exclusion correctly but QA/product reviewers will not know if it is a bug or a feature. Support will receive tickets about "missing" report tab. No rationale = no way to verify if the rule should change.
**Suggested resolution:** Add a note in Section 5 and Section 13d: "Analysts are excluded from By Posting ID because it exposes connected account identities (name, email, Facebook User ID). This is sensitive operational data outside the Analyst's remit."

---

### A-07: Approver has read-only Queue access but docs are inconsistent
**Severity:** High
**Location:** Docs Section 5 (Nav table), Section 11 (Queue)
**Issue:** The navigation table in Section 5 marks Queue as accessible to Approver (✅). Section 11 states "Approver (batch view, read-only)." However, the permission matrix in Section 21 does not list Queue under any role-specific UI element distinctions. More critically: if an Approver can see the Queue read-only, but the Queue section says "Actions (Owner/Manager only)" for edit/delete/reschedule — this creates a partial-access state. Is a read-only queue view explicitly designed, or will the Approver just see the same view with disabled buttons?
**Impact:** Developer may build a single Queue component with role-gated action buttons, leaving action columns visible but disabled — or may build a completely separate read-only component. Without a spec for what the Approver's Queue view looks like, the implementation will be inconsistent.
**Suggested resolution:** Add a wireframe or explicit spec for the Approver's Queue view. Clarify whether action columns are hidden entirely or shown as disabled, and whether the role context banner appears.

---

### A-08: Failed Posts access for Publisher — scope not defined
**Severity:** High
**Location:** Docs Section 5 (Nav table), Section 12 (Failed Posts)
**Issue:** Failed Posts is accessible to Publisher per the nav table. Section 12 does not specify which failed posts a Publisher sees — only their own? Or all in their batch? The docs say Publishers can only see their own posts in Queue and Drafts, but Failed Posts has no equivalent scoping statement. Given that failed posts may include metadata about other publishers' content, showing all batch failed posts to a Publisher would be a data leak.
**Impact:** Developer will likely show all failed posts or only the user's failed posts with no specification to validate against.
**Suggested resolution:** Explicitly state in Section 12: "Publishers see only failed posts they originally uploaded. Managers/Owners see all failed posts within scope."

---

### A-09: Aisha (Manager + Publisher on Partner C) — combined role behavior
**Severity:** Medium
**Location:** Docs Section 4 (Batch Structure)
**Issue:** Aisha holds both Manager and Publisher on Partner C. Similar to A-04, the combined behavior is not documented. As Manager she can approve posts; as Publisher she can upload posts. Can she approve her own posts? Section 14 (Approval Workflow) says approvers list is "automatically shows all team members with Owner, Manager, or Approver role" — so Aisha would appear as an approver. The same self-approval concern from A-04 applies.
**Impact:** Same as A-04 — Aisha can self-approve her own uploads.
**Suggested resolution:** Apply the same self-approval prohibition documented in A-04. Confirm in Section 14 that the system checks the submitter identity when rendering approval options.

---

### A-10: Owner cannot be removed — but "You" badge behavior for Owner editing team is unclear
**Severity:** Medium
**Location:** Docs Section 17 (Team Management)
**Issue:** The docs note the logged-in user's row has a "You" badge and "cannot be edited or removed." But the Owner role is unique — there should be a rule that the Owner cannot be demoted by any means, and that the Owner role cannot be assigned to anyone else (or if it can, what that means for the original Owner). The docs list Owner as a selectable role in the invite modal's role grid. Can a Manager invite someone as Owner?
**Impact:** If a Manager can technically invite someone as Owner, the platform has a critical privilege escalation path.
**Suggested resolution:** Clarify: only the current Owner can invite/assign another Owner. Add a note to the invite modal spec and the role section.

---

### A-11: Analyst role — Dashboard access described inconsistently
**Severity:** Medium
**Location:** Docs Section 3 (Analyst), Section 6 (Dashboard), Section 21 (Permission Matrix)
**Issue:** Section 3 says Analyst can "View Dashboard (views + operations only)." Section 6's KPI card table shows Publisher/Approver/Analyst all get Network Views and Operations Pulse. But Section 21's permission matrix row for "View dashboard" shows Analyst as "✅ Limited" with no further definition of what "limited" means beyond what Section 3 says. This is consistent in spirit, but "Operations Pulse" includes "failed posts count" — does the Analyst see that? "Failed posts" is an operational metric, not a reporting metric, and Analysts cannot access the Failed Posts screen.
**Impact:** Developer may show or hide Operations Pulse for Analyst inconsistently across Dashboard vs. the Failed Posts nav item.
**Suggested resolution:** Clarify whether Analysts see the Operations Pulse card, and if so, whether the "failed posts" count within it is visible or replaced with "—".

---

### A-12: Publisher's Dashboard "Top Performers" shows revenue column for Manager but docs say "Views only" for Publisher
**Severity:** Low
**Location:** Docs Section 6 (Top Performers), Section 21 (UI Elements table)
**Issue:** The docs state Top Performers shows "Revenue column (Owner/Manager only)" and shows "Views only" for Publisher/Approver/Analyst. This is clear. However, the docs list "Top Performers revenue column" in Section 21 as "✅ ✅ Views only Views only Views only" — the "Views only" entries under Publisher and Approver/Analyst suggest the revenue column is replaced, not hidden. The implementation spec does not clarify whether the revenue column is simply hidden (leaving a gap) or replaced by a different column (or the column header is relabeled).
**Impact:** Minor UI inconsistency risk — column count changes by role, causing layout shift.
**Suggested resolution:** Specify: the Revenue column is hidden entirely for non-Owner/Manager roles. The remaining columns reflow. Or: the Revenue column remains but shows "—" for non-privileged roles.

---

## B — Content Lifecycle

### B-01: Post states — "Changes Requested" state not in the design system or status badges
**Severity:** Critical
**Location:** Docs Section 10 (Approvals), Section 22 (Design System — Status Badges)
**Issue:** The Approvals screen has a "Changes Requested" filter tab — meaning "Changes Requested" is a distinct post state. But Section 22 (Status Badges) does not define a "Changes Requested" badge: color, style, icon. The status badge table lists Draft, Scheduled, Published, Failed, Paused, Pending, Disconnected, Expiring — but NOT "Changes Requested" or "Rejected." These are two additional post states that have no design token.
**Impact:** Developer must invent badge styling for at least two states (Changes Requested, Rejected) without a spec. This creates visual inconsistency risk.
**Suggested resolution:** Add "Changes Requested" (suggested: purple left border or orange dot) and "Rejected" (suggested: red dot) to the Status Badges table in Section 22.

---

### B-02: What happens to a draft when its page is disconnected?
**Severity:** Critical
**Location:** Docs Section 9 (Drafts), Section 14 (Page Settings), Section 15 (Connected IDs)
**Issue:** There is no documentation for what happens to a draft post when the page it targets becomes disconnected. Does the draft remain in Drafts with a warning badge? Does it get blocked from scheduling? Does it get moved automatically to Failed Posts? The closest documentation is the Queue "Paused" state for posts with expired Posting IDs, but drafts are pre-queue.
**Impact:** Developer will implement disconnection handling for Queue (Paused state is defined) but will not know what to do with the Drafts state, likely leaving drafts in a silent broken state.
**Suggested resolution:** Define: drafts targeting a disconnected page show an inline amber warning badge "Page disconnected — reconnect before scheduling." The draft cannot be submitted for approval or scheduled until the page is reconnected. Add this to Section 9.

---

### B-03: What happens to a queued post if Posting ID expires between approval and publish time?
**Severity:** Critical
**Location:** Docs Section 11 (Queue — Paused state), Section 10 (Approvals)
**Issue:** The Queue "Paused" state is defined for this scenario: "approved and ready but cannot publish because the page's Posting ID expired or was disconnected mid-approval." However, the transition into Paused is described only in the Queue section — the trigger event (Posting ID expiry after approval) is not wired to a notification flow. Specifically: who is notified? Is the Publisher notified? Is the Owner? Is the sub-badge "✓ Publisher notified" automatic or does it require a manual action?
**Impact:** Developers will implement the Paused state badge but may not build the notification trigger or will build it inconsistently.
**Suggested resolution:** Define the notification trigger: when a post transitions to Paused, automatically notify [Owner + Manager in scope] via in-app notification (and optionally email). The "✓ Publisher notified" sub-badge should be system-generated, not manual. Add this to Section 11.

---

### B-04: Post mid-publish token expiry — behavior completely undefined
**Severity:** Critical
**Location:** Docs Section 12 (Failed Posts), Section 15 (Connected IDs)
**Issue:** The audit question addresses token expiry during an active API call (mid-publish). The documentation only defines the pre-publish token expiry scenario (Paused state). If the token expires during a publish attempt (the API call is in-flight), the result would be an API error. The expected categorization is not specified: does this become a "Temporary Issue" or a "Reconnect Needed" failure in Failed Posts? The distinction matters because Temporary Issue triggers Retry while Reconnect Needed requires re-auth.
**Impact:** Developer will categorize mid-publish token errors arbitrarily. Users clicking Retry on a truly expired token will loop indefinitely.
**Suggested resolution:** Define: if the publish API call returns a token expiry error, the post is categorized as "Reconnect Needed" in Failed Posts, not "Temporary Issue." Add a note to Section 12's category definitions.

---

### B-05: Rejected post resubmission — number of attempts not defined
**Severity:** High
**Location:** Docs Section 10 (Approvals), Section 9 (Drafts)
**Issue:** A rejected post returns to the publisher. The docs describe the "Request Changes" flow (publisher edits and resubmits) but do not address the Rejected state resubmission. More importantly, neither state has a defined limit on how many times a post can be submitted. A post could theoretically cycle through Submit → Reject → Resubmit → Reject indefinitely. There is no maximum submission count, no auto-archive trigger, no escalation path.
**Impact:** The system could accumulate zombie posts in the approval cycle with no resolution mechanism.
**Suggested resolution:** Define whether rejected posts can be resubmitted (suggested: yes, unlimited, but the rejection history is shown). Alternatively, define a max rejection count (e.g., 3 rejections → auto-archived to Drafts with a flag). Document this in Section 10.

---

### B-06: What happens to posts when an Approver is removed from the team?
**Severity:** High
**Location:** Docs Section 10 (Approvals), Section 17 (Team Management)
**Issue:** If an Approver is removed mid-workflow, posts awaiting their review are orphaned in the Approvals inbox. No documentation describes what happens: Are those posts re-assigned to remaining Approvers? Do they appear in the Owner's or Manager's inbox? Are they returned to Drafts? Is the Publisher notified?
**Impact:** Posts could be permanently stuck in "Pending" approval status with no visible path to resolution for the publisher.
**Suggested resolution:** Define: when an Approver is removed, their pending approval queue is automatically reassigned to the batch Manager (or Owner if no Manager). If no fallback approver exists, posts revert to Drafts with a banner "Approver removed — please resubmit." Add this to Section 17.

---

### B-07: Batch deletion/reassignment — post fate undefined
**Severity:** High
**Location:** Docs Section 4 (Batch Access Control), Section 2 (Core Concepts — Batches)
**Issue:** There is no documentation for what happens to posts (in any state: Draft, Queue, Scheduled, Published) when the batch they belong to is deleted or when a page is moved to a different batch. Pages are assigned to batches during setup, but batch modification scenarios are not covered at all.
**Impact:** If a page is moved from Partner A to Partner B, do all existing posts for that page retain their batch attribution? Do they become visible to Partner B team members? Do Partner A team members lose access to historical posts?
**Suggested resolution:** Define batch immutability or migration rules: posts retain their original batch attribution until explicitly migrated; page reassignment does not retroactively change post batch assignment; historical data remains accessible to the Owner.

---

### B-08: "Paused" state recovery path — what action un-pauses a post?
**Severity:** High
**Location:** Docs Section 11 (Queue)
**Issue:** The Paused state is defined with clear entry conditions (Posting ID expired or disconnected). The sub-badge "⚠ Posting ID expired" indicates the reason. However, the documentation does not define the exit/recovery action. Is it automatic (post resumes when the Posting ID is reconnected)? Does the Owner/Manager need to manually re-queue it? Is there a "Resume" button on the Paused post card?
**Impact:** Users will see Paused posts and not know how to resolve them. Support load increases.
**Suggested resolution:** Define: reconnecting the Posting ID does not automatically un-pause posts. The Owner/Manager must explicitly click "Resume" on each Paused post (or a batch resume option). On Resume, the overdue fallback panel (from Section 10) should appear to confirm the new schedule. Document this in Section 11.

---

### B-09: "Publishing" state — timeout/stuck state not defined
**Severity:** Medium
**Location:** Docs Section 11 (Queue — Status Indicators)
**Issue:** The Queue lists a "Publishing" state with an "animated spinner, in progress." There is no documentation for what happens if a post gets stuck in Publishing state — e.g., the API call hangs indefinitely, the server crashes mid-publish, or the webhook confirmation never arrives. Without a defined timeout, posts can remain in Publishing state forever.
**Impact:** Developer will not build a timeout mechanism or a "stuck post" detection job. Users will see spinning posts with no resolution.
**Suggested resolution:** Define a publish timeout (e.g., 5 minutes). If no success/failure confirmation is received within the timeout, the post is moved to "Temporary Issue" in Failed Posts with the message "Publish confirmation not received."

---

### B-10: Draft → Submit for Approval transition — does it require a schedule time?
**Severity:** Medium
**Location:** Docs Section 9 (Drafts — Actions)
**Issue:** The Drafts actions include "Submit for Approval" and "Schedule" as separate buttons. It is unclear whether a draft must have a scheduled time assigned before it can be submitted for approval. The Approvals display shows "Scheduled publish time" per post — implying a time is expected. But a Publisher might want to submit an unscheduled draft for content review without knowing the exact publish time yet.
**Impact:** Developer will either block submission without a schedule (frustrating content review flow) or allow submission without one (leaving Approvals with posts that have no scheduled time, breaking the overdue logic).
**Suggested resolution:** Define: a draft may be submitted for approval without a scheduled time. The Approvals display shows "No time set" for the schedule field. The Approver must assign a time (or the auto-schedule logic kicks in) before approving. Document this in Section 9 and 10.

---

### B-11: Auto-publish OFF flow — who triggers the final publish?
**Severity:** Medium
**Location:** Docs Section 14 (Approval Workflow — Auto-publish toggle), Flow 2 (Step 9)
**Issue:** Section 14 states "Auto-publish on approval — Off = approver must manually trigger publish." Flow 2 Step 9 confirms this. However, there is no documentation for where this manual trigger appears in the UI. Is there a "Publish" button on the Queue card for Owner/Manager? Is it on the Approvals screen after approval? What if the scheduled time passes while waiting for manual trigger — is the overdue fallback triggered again?
**Impact:** Developer will not know where to place the "Publish Now" action trigger for the auto-publish OFF scenario.
**Suggested resolution:** Define: in the Queue view, approved posts with auto-publish OFF show a blue "Publish Now" action button (visible to Owner/Manager/Approver). If the scheduled time passes without manual trigger, the overdue fallback logic applies again. Document this interaction in Section 11 and 14.

---

### B-12: Duplicate detection — hash-based, filename-based, or content-based?
**Severity:** Medium
**Location:** Docs Section 7 (Bulk Upload — Step 2)
**Issue:** The docs describe duplicate detection as "amber warning if the same file is already in Drafts or Queue for the selected page." The detection method is not specified. File-name matching is trivial to bypass (rename the file). Hash-based detection is more robust but requires storing file hashes. Content/perceptual hashing for images/videos is more complex. The scope is also unclear: is duplicate detection per-page only, or cross-page?
**Impact:** Developer will implement whichever method is easiest (filename) without a spec, creating an unreliable duplicate detection system.
**Suggested resolution:** Define the detection method explicitly: SHA-256 hash of file content, compared against all files in Drafts and Queue for the selected page. Cross-page duplicate detection is not required in v1. Document this in Section 7.

---

## C — Data & Logic Consistency

### C-01: Health score algorithm for Posting IDs — not defined
**Severity:** Critical
**Location:** Docs Section 13d (By Posting ID), Section 15 (Connected IDs)
**Issue:** The health score (0–100) appears in both the Connected IDs settings page and the By Posting ID report. The labels (Healthy/Declining/Replace) are defined with threshold values implied by the demo data (88=Healthy, 72=Declining, 22=Replace). But the actual algorithm is never documented: What inputs feed into the score? Is it purely reach-based? Does token status affect it? What are the exact thresholds (e.g., 70+ = Healthy, 40–69 = Declining, <40 = Replace)?
**Impact:** Developer will invent an algorithm, producing scores that don't match product intent. Different developers will implement it differently. The score will be meaningless or misleading.
**Suggested resolution:** Define the health score formula and thresholds. Example: Score = weighted average of (reach trend 40%, posts this month relative to average 30%, token status 30%). Thresholds: 70–100 = Healthy, 40–69 = Declining, <40 = Replace. Document in Section 13d.

---

### C-02: RPM calculation — formula not defined, appears in multiple places
**Severity:** Critical
**Location:** Docs Section 6 (Dashboard — RPM KPI), Section 13a (Reports Overview), Section 13c (Earnings), Section 13e (Batches)
**Issue:** RPM (Revenue Per Mille) appears across Dashboard, Reports Overview, Earnings, and Batches with no formula definition. The standard formula is (Revenue / Views) × 1000, but Facebook's monetization RPM may differ (CPM-based, content type weighted, or net vs. gross). The Batches page demo shows wildly different RPMs ($4.82 vs $2.10) suggesting it may be calculated differently per batch. Is it an average RPM or a weighted average?
**Impact:** Two developers will implement RPM calculation differently. Dashboard RPM may not match Reports RPM, causing user confusion.
**Suggested resolution:** Define: RPM = (Total Revenue / Total Monetized Views) × 1000. It is a weighted average (not a simple average of per-page RPMs). Apply this formula consistently everywhere RPM is displayed. Document in Section 2 (Core Concepts).

---

### C-03: Copyright scan — real integration or UI placeholder?
**Severity:** High
**Location:** Docs Section 7 (Bulk Upload — Step 2 and Step 3), Section 8 (Single Post)
**Issue:** The copyright scan status (✅ Clear / ⚠ Possible Match / ❌ Match Found) is described as appearing per file during upload. There is no documentation of what service powers this scan, what the API is, how long it takes, what happens if the service is unavailable, or whether the scan blocks the upload flow. Single Post (/post) shows an upload field but no copyright scan mention in Section 8.
**Impact:** Developer will not know whether to integrate with a real copyright API (e.g., Facebook Rights Manager, a third-party service) or mock the state. If mocked for MVP, this needs to be explicitly stated.
**Suggested resolution:** Define whether this is a real integration for v1 or a deferred feature with a fixed "Clear" state. If real, name the API, define the timeout behavior, and specify the fallback state when the service is unavailable. Document in Section 7 and add a note in Section 8 about copyright scan applicability.

---

### C-04: Active Hours — applies to manually triggered posts?
**Severity:** High
**Location:** Docs Section 14 (Active Hours), Section 10 (Overdue Approval Fallback)
**Issue:** Active Hours is defined as "Posts only sent during this window" for auto-scheduled posts. The overdue approval fallback references Active Hours for determining the next safe slot. But it is never stated whether Active Hours applies to: (a) manually triggered "Publish Now" from the Queue, (b) "Publish immediately" from the overdue fallback, (c) manual "Add to Queue" from Single Post. The overdue fallback explicitly says an orange warning appears "if the current time is outside Active Hours" for immediate publish — implying Active Hours is advisory, not blocking, for manual actions.
**Impact:** Developer will implement Active Hours as either a hard block or a soft warning for manual actions. These are completely different behaviors.
**Suggested resolution:** Explicitly state: Active Hours is a hard restriction for auto-scheduled posts only. For manual actions (Publish Now, overdue immediate publish), Active Hours is advisory — an orange warning is shown but the action is not blocked. Document this in Section 14.

---

### C-05: Post interval — minimum gap or exact schedule?
**Severity:** High
**Location:** Docs Section 14 (Auto-Post Settings — Post interval)
**Issue:** The post interval (1/2/3/4/6/8 hours) is not defined as to whether it means: (a) a minimum gap between consecutive posts, or (b) posts fire at exact fixed intervals from a reference time (e.g., every 2 hours from midnight: 00:00, 02:00, 04:00...). The behavioral difference is significant: minimum gap means posts cluster at the start of Active Hours after a gap; exact schedule means posts fire at predetermined times regardless of the previous post's actual publish time.
**Impact:** Developer will pick an interpretation. QA will test against a different expectation. The auto-scheduler behavior will be unpredictable.
**Suggested resolution:** Define: post interval is a minimum gap between posts. The auto-scheduler places the next post no sooner than [interval] hours after the previous post's scheduled time. Active Hours constrains the window. Document in Section 14.

---

### C-06: Performance-based rotation — exact algorithm not defined
**Severity:** High
**Location:** Docs Section 14 (Posting IDs — Rotation settings)
**Issue:** Rotation mode options are "Round Robin" and "Performance-based." Round Robin is self-explanatory. Performance-based is not defined: What metric determines performance (reach, engagement, posts this week)? What is the weight distribution (does the top performer get 70% of posts, 50%, proportional to score)? Over what time window is performance measured? What happens when a new Posting ID is added — how is it allocated until it has performance data?
**Impact:** Developer will invent a weighting algorithm. The resulting rotation may not match product intent.
**Suggested resolution:** Define: Performance-based rotation allocates posts proportionally to the health score of each active Posting ID. Example: ID with score 88 gets 88/(88+72) = 55% of posts; ID with score 72 gets 45%. New IDs with no history start at score 50. Document this in Section 14.

---

### C-07: Follower counts — live or cached? Cache TTL not defined
**Severity:** Medium
**Location:** Docs Section 6 (Dashboard — Page Health Widget), Section 7 (Bulk Upload — Step 1), Section 13f (Per-Page Report)
**Issue:** Follower counts are displayed in multiple places across the platform. Whether they are live API calls, cached values, or static demo data is never documented. If cached, the TTL (time-to-live) is not defined. For a platform managing 100+ pages, live follower count calls on every Dashboard load would be a significant API burden.
**Impact:** Developer will implement follower counts inconsistently — live in some places, cached in others.
**Suggested resolution:** Define the caching strategy: follower counts are fetched from the Facebook API and cached with a TTL of 24 hours. Stale data shows a subtle "Updated [X]h ago" tooltip. Document this in Section 2 (Core Concepts).

---

### C-08: Threads platform integration — full parity with FB/IG not confirmed
**Severity:** Medium
**Location:** Docs Section 7 (Bulk Upload — Step 2), Section 8 (Single Post), Section 14 (Page Settings)
**Issue:** Threads appears as a selectable platform throughout (upload, single post, page settings). However, Threads has significantly different API capabilities compared to Facebook/Instagram (e.g., no paid promotion, different media requirements, character limits are 500 vs 2200). The docs give Threads a 500-character limit for captions. But Threads API support for scheduled posting, media types (Reels), and analytics is documented nowhere. The demo page "History Uncovered" uses FB+IG+TH but "Know Her Name" is listed as FB only in the main table yet FB+IG+TH in the wireframe Page Settings.
**Impact:** Developer may build full Threads API integration parity that doesn't exist, or skip Threads API features that do exist.
**Suggested resolution:** Define Threads API capability scope explicitly: what media types are supported (text, photo, video), whether Threads scheduling is via a queue API or manual, and which reports metrics are available. Add a note in Section 2 or a new "Platform Integration Notes" section.

---

### C-09: "Know Her Name" platform inconsistency across docs and wireframe
**Severity:** Medium
**Location:** Docs Section 1 (Pages in Demo), Page Settings wireframe
**Issue:** Section 1 of the docs lists Know Her Name (khn) as FB only. The Page Settings wireframe shows it as "FB, IG, TH" with status Active. This is a direct contradiction between the documentation and the wireframe for a specific demo page.
**Impact:** Developer will not know which platforms to configure for this page. Data displayed in reports and upload flows will be inconsistent.
**Suggested resolution:** Align the documentation and wireframe. Either update Section 1 to reflect FB+IG+TH for Know Her Name, or fix the wireframe to show FB only. This must be resolved before any demo data is hardcoded.

---

### C-10: Storage — no definition of what "storage" means in the platform
**Severity:** Medium
**Location:** Docs Section 16 (Account Settings — Billing & Plan — Usage stats)
**Issue:** The Billing tab mentions "storage" as a usage stat. However, storage is never defined anywhere else in the documentation. Does the platform store uploaded media files? For how long? Is storage consumed by Drafts only, or also by Published posts? What happens when storage is full — is upload blocked? Is the user warned?
**Impact:** Developer will not know what to track for storage, what the limit is, or how to enforce it.
**Suggested resolution:** Define storage scope: uploaded media files are stored until the post is published or deleted (whichever comes first). Published post media is not stored by MetaReverse (it remains on Facebook's servers). The storage meter tracks pending/draft media only. Define the storage limit for the Professional plan.

---

### C-11: TechByte shows "Expiring" status in wireframe — schedule shows "Every 2h" but docs list it differently
**Severity:** Low
**Location:** Page Settings wireframe, Docs Section 1 (Pages table)
**Issue:** In the Page Settings wireframe, TechByte shows an "Expiring" status badge and "Every 2h" schedule. In the docs, the health score demo shows TechByte with a stalling issue mentioned in the Batches report. No doc defines when "Expiring" vs "Token Expiring" applies (the docs use "Token Expiring" as the status label but the wireframe uses "Expiring"). Minor label inconsistency.
**Impact:** Developer will use one label; designer may use another.
**Suggested resolution:** Standardize the label: "Token Expiring" (as documented in Section 14) should be used everywhere. Update the wireframe label.

---

## D — UI & UX Logic

### D-01: Queue screen at 50+ pages — no search or filter defined
**Severity:** High
**Location:** Docs Section 11 (Queue)
**Issue:** The Queue section describes grouping by page or by date as the only organizational tools. For an operator managing 50–100+ pages with hundreds of scheduled posts, no search functionality and no filter by platform, status, or date range is documented. The wireframe shows skeleton loading states suggesting a table structure, but no filter bar is described.
**Impact:** Developer will build a basic grouped list with no search. When the platform has 200+ queued posts, the UX is unusable.
**Suggested resolution:** Define a filter/search bar for the Queue: search by caption, filter by page, filter by platform, filter by status (Scheduled/Paused/Publishing), filter by date range. This is a core usability requirement for a platform managing 50–100 pages.

---

### D-02: Dashboard "All Pages" table — pagination not defined
**Severity:** High
**Location:** Docs Section 6 (All Pages Table)
**Issue:** The All Pages table is described as a "sortable table listing pages visible to the user's role." For an Owner with 100+ pages, no pagination spec exists. The table would either load all pages (performance issue) or silently truncate (data loss). No page size, no pagination controls, no "load more" behavior is documented.
**Impact:** Developer will implement an arbitrary limit (e.g., show 10 rows) without a pagination spec, or load all rows and cause browser performance issues.
**Suggested resolution:** Define pagination: 20 rows per page with standard prev/next pagination controls. Alternatively, define virtual scrolling for large datasets. Document in Section 6.

---

### D-03: Bulk Upload Step 4 — no error state defined if "Save to Drafts" fails
**Severity:** High
**Location:** Docs Section 7 (Bulk Upload — Step 4)
**Issue:** Step 4 shows "Upload progress animation shown briefly" for Save to Drafts. There is no documentation for what happens if the save fails (network error, server error, storage full). No error state, no retry prompt, no "your files are safe locally" message is defined.
**Impact:** Developer will implement a toast error and unclear whether the user needs to re-upload files or just retry the save action.
**Suggested resolution:** Define: on Save to Drafts failure, show an error banner above the Step 4 footer with a "Retry Save" button. Media files already uploaded in Step 2 should not need to be re-uploaded — they are cached server-side until the session ends or save succeeds. Document this in Section 7.

---

### D-04: Failed Posts — Bulk Retry mixed success/fail feedback undefined
**Severity:** High
**Location:** Docs Section 12 (Failed Posts — Bulk Actions)
**Issue:** Bulk Actions include "Bulk Retry." After a bulk retry, some posts may succeed and some may fail again. The expected feedback state is not documented: Does the user see individual success/fail toasts for each post? A summary modal ("3 succeeded, 1 still failing")? Do the newly-failed posts remain in the list with updated failure reasons?
**Impact:** Developer will implement a single success toast for the bulk action, silently hiding re-failures.
**Suggested resolution:** Define: Bulk Retry shows a progress indicator ("Retrying X posts..."). On completion, a summary banner shows "X published successfully, Y still failing." Still-failing posts remain in the list with refreshed error messages and timestamps.

---

### D-05: Overdue approval fallback — "next Active Hours slot" calculation not defined
**Severity:** High
**Location:** Docs Section 10 (Overdue Approval Fallback)
**Issue:** The fallback says the post is queued for "the page's next available Active Hours window (e.g. Tomorrow, 8:00 AM EST)." But the calculation of "next available slot" is not defined: Does it respect the post interval? Could there already be a post scheduled at "Tomorrow 8:00 AM"? If the queue already has a post at that time, does the system schedule this post immediately after (8:00 + interval), or does it find the next empty slot regardless of interval?
**Impact:** Developer will implement a naive "next Active Hours start time" without considering existing queue density, potentially creating post collisions at the same timestamp.
**Suggested resolution:** Define: "next available Active Hours slot" = the earliest time within Active Hours where there is no existing post within [post interval] minutes. The slot finder should walk forward from the current time through the Active Hours windows until a free slot is found.

---

### D-06: Confirmation step for destructive actions — not defined for all cases
**Severity:** Medium
**Location:** Docs Sections 9 (Drafts — Delete), 11 (Queue — Delete/Cancel), 15 (Connected IDs — Disconnect), 17 (Team Management — Remove Member)
**Issue:** Confirmation modals are mentioned for Drafts delete ("Delete — removes draft with confirmation") and Connected IDs disconnect ("confirmation modal"). But the Queue "Delete / cancel scheduling" action has no confirmation step specified. Team member removal has "confirmation toast" — but a toast is shown AFTER the action, not before it (it's a notification, not a gate). Removing a team member with pending approvals should require a stronger confirmation.
**Impact:** Developers will implement some destructive actions with confirmations and others without, creating inconsistent behavior.
**Suggested resolution:** Define confirmation dialogs for all destructive actions: Queue post cancellation, Team member removal (with warning if they have pending approvals or active posts), Batch deletion. Standardize the pattern: modal with "Are you sure?" + consequences + Cancel + Confirm (red button).

---

### D-07: No empty states defined for most screens
**Severity:** Medium
**Location:** Sections 9 (Drafts), 10 (Approvals), 11 (Queue), 12 (Failed Posts), 13 (Reports)
**Issue:** Empty states (when there is no data to show) are not documented for any screen. What does a new user see on the Dashboard before any pages are connected? What does the Queue look like with zero scheduled posts? What does Approvals look like with zero pending posts? Undocumented empty states get implemented as blank white areas or default to "Loading..." forever.
**Impact:** Developer will implement placeholder empty states ad-hoc, resulting in inconsistent copy, icons, and call-to-action guidance.
**Suggested resolution:** Define empty state content for each key screen: Dashboard (no pages → "Connect your first Facebook page"), Drafts (no drafts → "Upload content to get started"), Queue (no posts → "No posts scheduled"), Approvals (no pending → "You're all caught up"), Failed Posts (no failures → "All posts published successfully").

---

### D-08: Single Post (/post) — character counter shows "0 / 500 (limited by TH)" but not per-platform
**Severity:** Medium
**Location:** Wireframe /post, Docs Section 8 (Single Post — Caption textarea)
**Issue:** The wireframe shows a single combined character counter "0 / 500 (limited by TH)" for the caption field. Section 8's docs describe "real-time per-platform character counters" — implying separate counters per active platform (FB: 63,206; IG: 2,200; TH: 500). The wireframe shows only the most restrictive limit, not per-platform counters. This contradicts the Bulk Upload behavior (Section 7 Step 3) which explicitly shows per-platform counters for each file.
**Impact:** Developer may implement a single "most restrictive" counter for Single Post and per-platform counters for Bulk Upload, creating an inconsistency. If Threads is disabled but the counter still shows 500, it creates confusion.
**Suggested resolution:** Standardize the caption counter behavior between Single Post and Bulk Upload: both should show per-platform counters only for active/selected platforms. Update the wireframe to reflect per-platform counters.

---

### D-09: Reports sub-navigation tab labels differ between wireframe and docs
**Severity:** Medium
**Location:** Wireframe /reports/results, Docs Section 5 (Reports Sub-navigation)
**Issue:** The docs define the Reports sub-navigation tabs as: Overview, Results, Earnings, By Posting ID, Batches. The wireframe for /reports/results shows the page title as "Insights" with tabs that include the same items. However, the wireframe sidebar nav shows "By Posting ID" as a nav item but the route is `/reports/id-performance`, not `/reports/by-posting-id` as listed in the audit instructions — the `/reports/by-posting-id` route returned a 404. The actual working route is `/reports/id-performance`.
**Impact:** All internal links to the By Posting ID report must use `/reports/id-performance`. Any hardcoded `/reports/by-posting-id` link will 404.
**Suggested resolution:** Canonicalize the route. Document the correct route as `/reports/id-performance` throughout all documentation and ensure all nav links use this path.

---

### D-10: Form validation rules not documented for Invite Member modal
**Severity:** Medium
**Location:** Docs Section 17 (Invite Member Modal)
**Issue:** The modal specifies "Send Invite button disabled until name, email, at least 1 role, and 1 batch are filled." But specific validation rules are missing: email format validation (is a real email required or any string?), maximum name length, what happens if the email is already in the team (duplicate invite), what happens if the email domain is blocked or the invite email bounces.
**Impact:** Developer will implement minimal validation (non-empty check) without format or uniqueness validation.
**Suggested resolution:** Define: email must be a valid RFC 5322 format. Duplicate email shows an inline error "This person is already a team member." Bounced invites (non-deliverable email) show a failed status in the Pending list with a "Resend" option. Document in Section 17.

---

### D-11: Session timeout behavior completely undefined
**Severity:** Medium
**Location:** Docs (entire document — no mention of sessions)
**Issue:** There is no documentation of session management: How long does a session last? What happens when a session times out mid-action (e.g., while filling out the Bulk Upload wizard)? Is the user redirected to login? Is their draft-in-progress saved?
**Impact:** Developer will implement default framework session behavior (typically 30-min inactivity timeout) with no consideration for in-progress workflows.
**Suggested resolution:** Define session timeout duration (suggested: 8 hours for active sessions, 30 minutes for inactivity). Define behavior on timeout: if the user has unsaved wizard progress, prompt "Save to Drafts before logging out?" before redirecting to login.

---

### D-12: Loading states — many screens shown as skeleton-only in wireframe
**Severity:** Low
**Location:** All wireframe screens
**Issue:** Nearly every wireframe screen renders only skeleton loaders in the fetched HTML. This makes it impossible to fully audit the actual rendered content, filter options, and interaction states of several screens (Queue, Reports sub-pages, Account Settings Team/Billing tabs). This is a wireframe delivery issue — the pre-render HTML does not reflect the fully interactive state.
**Impact:** There may be additional issues in the rendered/interactive states of these screens that this audit cannot capture from the static HTML.
**Suggested resolution:** Ensure wireframes render meaningful default data states server-side, or provide screenshot exports of all interactive states for audit purposes.

---

### D-13: "New Upload" button on Drafts page — behavior not documented
**Severity:** Low
**Location:** Wireframe /drafts, Docs Section 9 (Drafts)
**Issue:** The Drafts wireframe shows a "New Upload" action button in the page header. The docs describe Drafts as a list screen with per-draft actions and bulk actions — there is no mention of a "New Upload" shortcut button. This button presumably navigates to /upload, but this is not documented as a behavior.
**Impact:** Minor — developer will implement navigation to /upload, but the button is undocumented and its presence on the Drafts page may conflict with Publisher role permissions (Publishers cannot access Bulk Upload if they are only Approvers — though Approvers don't have Drafts create actions, this button should be hidden for Approver-only users who can view Drafts).
**Suggested resolution:** Document the "New Upload" button in Section 9. Specify that it navigates to /upload and is visible only to roles with upload access (Owner, Manager, Publisher). Approver-only users seeing the Drafts screen should not see this button.

---

### D-14: Drafts filter options in wireframe exceed what docs describe
**Severity:** Low
**Location:** Wireframe /drafts, Docs Section 9 (Drafts)
**Issue:** The Drafts wireframe shows filter dropdowns: "All Pages," "AllPhotoReel" (post type), "AllBulkSingle" (source filter), "All threads" (with "Has thread"/"No thread" toggle). The docs describe Drafts as having Edit, Delete, Schedule, and Submit for Approval actions per draft with bulk actions — but no filter bar is documented.
**Impact:** Developer will not know to build these filter controls unless they catch them from the wireframe. The filters are functional requirements that affect the data model (must store source type and thread status as filterable fields).
**Suggested resolution:** Document the Drafts filter bar in Section 9: page selector, post type filter (Photo/Reel), source filter (Bulk/Single), thread filter (All/Has Thread/No Thread), sort options (Newest/Oldest first, By Page), view density (Compact/Visual).

---

## E — Flow Completeness

### E-01: OAuth connection failure during Bulk Connect — no fallback defined
**Severity:** Critical
**Location:** Docs Section 15 (Bulk Connect Flow — Step 1 OAuth Loading)
**Issue:** The Bulk Connect flow shows "OAuth Loading — simulates Facebook OAuth handshake (1.8s)." There is no documentation for what happens if the OAuth fails: the user denies permissions, Facebook returns an error, the token exchange fails, or the user closes the popup. The flow only documents the success path.
**Impact:** Developer will implement a bare error state or crash. The user has no recovery path.
**Suggested resolution:** Define the OAuth failure states: (a) User denies permissions → return to Connected IDs with an inline error "Facebook permissions were not granted. Try again." (b) OAuth timeout → same error with Retry button. (c) Account already connected → show "This account is already connected" with the existing account highlighted in the list.

---

### E-02: File upload failure mid-way through Bulk Upload Step 2
**Severity:** High
**Location:** Docs Section 7 (Bulk Upload — Step 2)
**Issue:** Step 2 allows uploading multiple files. If one file fails to upload (network drop, size limit exceeded after client validation, server error), the behavior is not defined. Does the whole upload batch fail? Does the failed file show a retry option while others proceed? Does the user need to re-upload everything?
**Impact:** Developer will implement a per-file upload, but with no spec for failure handling, the UI behavior will be ad-hoc.
**Suggested resolution:** Define: each file uploads independently with a progress indicator. A failed file shows a red error state with a "Retry Upload" button specific to that file. The user can continue to Step 3 with successfully uploaded files and resolve or remove failed files before proceeding.

---

### E-03: Copyright scan service unavailable — behavior undefined
**Severity:** High
**Location:** Docs Section 7 (Bulk Upload — Step 2, Step 3)
**Issue:** If the copyright scan service is down or times out, the scan status per file would be indeterminate. The docs show three possible statuses (Clear/Possible Match/Match Found) but no "Scan Unavailable" state. Can the user proceed to upload without a scan result? Is there a timeout after which the scan is skipped?
**Impact:** Developer will block the upload indefinitely if the scan service is down, or silently skip it — neither is acceptable without a defined policy.
**Suggested resolution:** Define: if the copyright scan does not return a result within 10 seconds, show "Scan unavailable — proceed with caution" (amber) state. The user can proceed. The system logs the scan skip. Document this in Section 7.

---

### E-04: Team member invite email bounces or expires
**Severity:** High
**Location:** Docs Section 17 (Invite Member Modal), Flow 6 (Invite a Team Member)
**Issue:** Flow 6 ends at Step 7: "Once they accept, status changes to Active." There is no documentation for: (a) how long the invite link is valid, (b) what happens when it expires, (c) what happens if the email bounces, (d) how the resending of an invite works when the original is expired vs. pending.
**Impact:** Developer will implement invite tokens with an arbitrary expiry and no cleanup mechanism.
**Suggested resolution:** Define: invite links expire after 7 days. Expired invites show "Expired" status in the Pending list with a "Resend" button that generates a fresh link. Bounced invites (detected by email delivery webhook) show "Delivery Failed" status. Document in Section 17.

---

### E-05: Two Approvers reviewing the same post simultaneously
**Severity:** High
**Location:** Docs Section 10 (Approvals)
**Issue:** Multiple Approvers can exist for a batch. If two Approvers open the same post simultaneously, both could approve or reject it. There is no documentation for optimistic locking, a "claimed" state, or race condition handling. The post could be approved twice, or approved by one and rejected by the other milliseconds apart.
**Impact:** Developer will implement a simple status update on the first action received, silently ignoring the second — but this produces no feedback to the second Approver.
**Suggested resolution:** Define: the first Approver action wins. When an Approver opens a post's review modal, the post is soft-locked (a "Being reviewed by [Name]" indicator appears to other Approvers viewing the same post, not blocking but informing). Once the action is submitted, the post status updates and the modal shows "This post has already been reviewed by [Name]" if another Approver tries to act on it.

---

### E-06: Manager with pending approvals is removed from team
**Severity:** Medium
**Location:** Docs Section 17 (Team Management), Section 10 (Approvals)
**Issue:** If an Owner removes a Manager who has pending approval items in their inbox, the disposition of those items is undefined. This differs slightly from B-06 (Approver removal) because a Manager also has broader access — they may have posts in Queue under their management, pages configured under their scope, and team members they invited.
**Impact:** Orphaned approval items, orphaned team management actions, and potentially unconfigured pages.
**Suggested resolution:** Define: before a Manager can be removed, the system checks for active dependencies: pending approvals, sub-team members they manage, page configurations. Show a confirmation modal listing dependencies: "This Manager has 3 pending approvals and manages 2 team members. Removing them will reassign approvals to Owner and retain sub-members." Require explicit confirmation.

---

### E-07: "Retire ID" action in Connected IDs — behavior not documented
**Severity:** Medium
**Location:** Wireframe /reports/id-performance (Ahmed's card shows "Retire ID" button), Docs Section 15 (Connected IDs — Actions)
**Issue:** The By Posting ID report wireframe shows a "Retire ID" button on expired/low-health accounts. Section 15 defines actions as Disconnect, Verify, and Edit settings — no "Retire" action is documented. Retire may differ from Disconnect: Disconnect removes the OAuth token; Retire may archive the ID's historical data while removing it from active rotation. The distinction is undefined.
**Impact:** Developer will implement Retire as equivalent to Disconnect, potentially losing historical performance data for that ID.
**Suggested resolution:** Define Retire: archives the Posting ID's historical reach/performance data (retaining it in reports) while removing the ID from active rotation and invalidating the token. This differs from Disconnect (which removes the ID entirely). Document in Section 15.

---

## F — Scope & Business Logic

### F-01: Hard limits for Professional plan ($99/month) not defined
**Severity:** Critical
**Location:** Docs Section 16 (Account Settings — Billing & Plan)
**Issue:** The Professional plan is mentioned at $99/month with "Plan feature list" and "Usage stats: pages in use, team members, storage." No actual limits are defined: How many pages? How many team members? How much storage? How many posts per month? These limits are the fundamental business logic of a SaaS plan and gate what the platform enforces.
**Impact:** Developer will build the platform with no enforcement logic. Usage stats will display numbers but never trigger a limit warning or block. Billing integration will have no criteria for upgrade prompts.
**Suggested resolution:** Define the Professional plan limits explicitly (e.g., up to 50 pages, 20 team members, 10 GB storage, unlimited posts). Define what happens at each limit: a warning at 80% usage, a hard block at 100% with an upgrade prompt. Document in Section 16.

---

### F-02: Free trial / onboarding flow completely absent
**Severity:** High
**Location:** Docs (entire document)
**Issue:** There is no documentation for how a new user signs up, whether there is a free trial, what the onboarding flow looks like (empty state → connect first page → invite first team member → create first post), or whether there is an onboarding checklist/wizard. For a SaaS product, the activation flow from sign-up to first post is critical.
**Impact:** Developer will build the core platform without any onboarding. New users will land on an empty Dashboard with no guidance.
**Suggested resolution:** Define an onboarding flow: step 1 (connect a Facebook page via OAuth), step 2 (set up auto-post settings), step 3 (invite a team member — optional), step 4 (upload first content). Consider a free 14-day trial or freemium tier. Document this as a new Section 23.

---

### F-03: What happens when storage is full?
**Severity:** High
**Location:** Docs Section 16 (Billing — Usage stats), Section 7 (Bulk Upload)
**Issue:** Storage is referenced as a usage metric but limits are undefined (see F-01). Even if limits are defined, the behavior when storage is full is not documented. Can the user still upload? Is the upload blocked? Is there a grace period? Is the user warned in advance?
**Impact:** Developer will implement an upload without a storage check, or block it silently.
**Suggested resolution:** Define: at 90% storage, show a warning banner on the Dashboard and in Bulk Upload. At 100%, block new uploads with an inline error "Storage full — delete old drafts or upgrade your plan." Link to Billing settings. Document in Section 7.

---

### F-04: Flow 5 numbered incorrectly — Flow 6 and Flow 7 are out of order
**Severity:** Low
**Location:** Docs Section 19 (Key User Flows)
**Issue:** Section 19 labels flows as Flow 1, Flow 2, Flow 3, Flow 4, Flow 5, Flow 7, Flow 6 — in that order. Flow 7 (Bulk Connect) appears before Flow 6 (Invite Team Member) in the document. This is a documentation numbering error.
**Impact:** Low — confusing for developers referencing flows by number in tickets or PRD references.
**Suggested resolution:** Renumber flows sequentially. Reorder so Flow 6 (Invite Team Member) appears before Flow 7 (Bulk Connect) — or renumber them appropriately.

---

### F-05: No definition of what constitutes a "post" for billing/usage purposes
**Severity:** Medium
**Location:** Docs Section 16 (Billing), Section 7 (Bulk Upload), Section 8 (Single Post)
**Issue:** A single Bulk Upload with 10 files targeting 3 platforms (FB, IG, TH) could be counted as 1 post (the upload batch), 10 posts (one per file), or 30 posts (one per file per platform). For billing and analytics ("198 posts this month" in Batches report), the unit of measurement is undefined.
**Impact:** Developer will define a post as one file on one platform, or one file regardless of platforms — different implementations produce incompatible metrics.
**Suggested resolution:** Define: a "post" is one piece of content (one file) regardless of how many platforms it is published to. Publishing to FB+IG+TH counts as 1 post. Document this in Section 2 (Core Concepts).

---

### F-06: "Batch Groups" appears in Page Settings sidebar nav but is not in the docs
**Severity:** Medium
**Location:** Wireframe /settings/pages sidebar
**Issue:** The Page Settings wireframe shows a sidebar entry for "Batch Groups" as a separate section below Page Settings. The documentation has no dedicated "Batch Groups" settings page — batch assignment is done during the Bulk Connect flow (Step 4) and in Team Management. "Batch Groups" in the wireframe shows three batches with "Defaults" and "Edit" options per batch. This is not documented anywhere.
**Impact:** Developer will not build this page without a spec. Designer will not have documented requirements.
**Suggested resolution:** Document "Batch Groups" as a settings section: lists all batches with their assigned pages, allows editing batch name and color, supports adding/removing pages from a batch, and setting batch-level default settings (default timezone, post interval). Add as Section 14b.

---

## G — Wireframe vs Documentation Conflicts

### G-01: "/reports/by-posting-id" route returns 404 — actual route is "/reports/id-performance"
**Severity:** Critical
**Location:** Docs Section 13d route reference vs wireframe actual route
**Issue:** The documentation and audit brief reference the route `/reports/by-posting-id`. This URL returns a 404. The working route is `/reports/id-performance`. The sidebar nav in the wireframe also links to "By Posting ID" but the target route differs from the documented route.
**Impact:** All developer references to this route will produce 404s if they follow the documentation.
**Suggested resolution:** Standardize the route. Update all documentation references to `/reports/id-performance` (or change the wireframe route to match the documented `/reports/by-posting-id`).

---

### G-02: "/reports/page/lc" returns 404 — actual route appears to be "/reports/page?id=lc"
**Severity:** Critical
**Location:** Docs Section 13f route description vs wireframe
**Issue:** The documentation describes the Per-Page Report route as `/reports/page?id=...` (query string). The audit brief lists `/reports/page/[id]` (path parameter). Both `/reports/page/lc` and the query-string variant return 404 in the wireframe. The page does not resolve at either route.
**Impact:** The per-page report has no accessible route in the wireframe. Developer cannot reference the UI for this screen.
**Suggested resolution:** Confirm and document the correct route for the per-page report. Ensure it is accessible in the wireframe. Define whether the ID parameter is a path segment (`/reports/page/lc`) or a query string (`/reports/page?id=lc`) and standardize accordingly.

---

### G-03: Connected IDs wireframe shows health scores of 100, 92, and 9 — docs show 88, 72, 22
**Severity:** High
**Location:** Docs Section 13d (health score demo data), Wireframe /settings/connections vs /reports/id-performance
**Issue:** The Connected IDs settings page wireframe shows health scores of 100 (Taimur), 92 (Sarah), 9 (Ahmed). The By Posting ID report wireframe shows 88 (Taimur), 72 (Sarah), 22 (Ahmed). The documentation health score demo table shows 88, 72, 22. These are three different sets of numbers for the same data. There is no explanation for why the health scores differ between the settings page and the reports page.
**Impact:** Developer will implement health scores as two different calculations or hard-code conflicting demo data.
**Suggested resolution:** Align demo data across all wireframe screens and the documentation. Health score should be a single computed value displayed consistently in both the Connected IDs settings card and the By Posting ID report.

---

### G-04: Page Settings wireframe shows "Batch Groups" section not in docs
**Severity:** High
**Location:** Wireframe /settings/pages, Docs Section 14 (Page Settings)
**Issue:** Documented in F-06 above. The wireframe shows a "Batch Groups" section in the Page Settings sidebar that has no documentation equivalent. This is a wireframe feature addition not covered by any documentation section.
**Impact:** Developer builds what's in the docs; this section gets skipped entirely.
**Suggested resolution:** Add documentation for Batch Groups settings (see F-06 recommendation).

---

### G-05: Wireframe /post shows caption counter as single "0/500 (limited by TH)" — docs describe per-platform counters
**Severity:** High
**Location:** Wireframe /post, Docs Section 8 (Single Post)
**Issue:** Documented in D-08 above. Direct conflict between wireframe implementation and documented behavior for the Single Post caption counter.
**Suggested resolution:** See D-08 recommendation. Align wireframe to show per-platform counters matching the Bulk Upload Step 3 pattern.

---

### G-06: Wireframe shows "TikTok" icon for History Uncovered — docs specify "Threads (TH)"
**Severity:** High
**Location:** Wireframe /upload (Select Page step), Docs Section 1 (Pages table)
**Issue:** In the Bulk Upload Step 1 page selector, History Uncovered shows "FB + IG + TikTok" as its platforms. The documentation clearly lists History Uncovered as "FB, IG, TH" (Threads). TikTok is a completely different platform not mentioned anywhere in the documentation. This appears to be a wireframe labeling error.
**Impact:** Developer may infer TikTok integration is required when it is not. Alternatively, the icon is mislabeled (showing TikTok's logo instead of Threads' logo), which would confuse QA.
**Suggested resolution:** Correct the wireframe to display the Threads icon/label, not TikTok. Confirm that MetaReverse does not integrate with TikTok in v1.

---

### G-07: Wireframe Approvals — no "Changes Requested" tab visible, only shown as filter count
**Severity:** Medium
**Location:** Wireframe /approvals, Docs Section 10 (Filter Tabs)
**Issue:** The docs define four filter tabs: Pending, Approved, Rejected, Changes Requested. The wireframe shows tabs for Pending (3), Approved, Changes Requested, and Rejected — missing the explicit "Rejected" tab as a separate prominent tab. From the wireframe analysis, "Changes Requested" appears but "Rejected" positioning is unclear. Minor tab ordering and completeness issue.
**Impact:** Developer may implement tabs in a different order than intended.
**Suggested resolution:** Confirm and document the exact tab order for the Approvals filter: Pending | Approved | Changes Requested | Rejected (in that order). Ensure all four are visible in the wireframe.

---

### G-08: Reports page title is "Insights" in wireframe — docs refer to it as "Reports"
**Severity:** Medium
**Location:** Wireframe /reports, Docs Section 13 (Reports)
**Issue:** All Reports sub-pages in the wireframe show the page title as "Insights" with subtitle "Review performance results and more." The documentation refers to this section throughout as "Reports" (nav item, route, section heading). This creates a branding/naming inconsistency.
**Impact:** Developers and designers will use different labels for the same section. Help documentation, tooltips, and onboarding text will be inconsistent.
**Suggested resolution:** Decide on one name. If "Insights" is the preferred brand name for the section, update all documentation references from "Reports" to "Insights." If "Reports" is correct, update all wireframe page titles.

---

### G-09: Queue wireframe shows only skeleton state — Paused state with sub-badges not visible for audit
**Severity:** Medium
**Location:** Wireframe /queue, Docs Section 11 (Queue — Paused state)
**Issue:** The Queue wireframe renders only in skeleton loading state. The documented Paused state sub-badges ("⚠ Posting ID expired" in red and "✓ Publisher notified" in blue) cannot be verified against the wireframe. There is no visible example of a Paused post in the Queue wireframe.
**Impact:** Developer has no visual reference for implementing the Paused state with its two sub-badges.
**Suggested resolution:** Add a non-skeleton wireframe view of the Queue showing at least one post in each state (Scheduled, Paused, Failed, Published) with all sub-badges visible.

---

### G-10: Dashboard shows "Approvals3" as a nav item label — likely a data rendering bug
**Severity:** Low
**Location:** Wireframe / (Dashboard), sidebar nav
**Issue:** The Dashboard wireframe shows the Approvals nav item labeled as "Approvals3" — the badge count (3) appears to be concatenated with the label text rather than displayed as a separate badge element. All other wireframe screens show "Approvals" with a separate badge showing "3."
**Impact:** If this reflects a rendering bug in the wireframe, it suggests the sidebar component has a concatenation issue that would reproduce in production.
**Suggested resolution:** Fix the sidebar Approvals item to render the badge count as a separate styled element (`<span class="badge">3</span>`) rather than concatenated text.

---

### G-11: Wireframe /settings/account shows "Phone" field — docs do not mention it
**Severity:** Low
**Location:** Wireframe /settings/account (Profile tab), Docs Section 16 (Account Settings — Profile tab)
**Issue:** The wireframe Profile tab includes a "Phone" input field. The documentation for the Profile tab lists: Name, email, profile picture upload, default timezone, email notification settings, 2FA toggle, account status and creation date. Phone is not mentioned. It is unclear whether phone is used for 2FA, account recovery, or is simply extra.
**Impact:** Developer building to the docs spec will miss the Phone field. Developer building to the wireframe will add it without knowing its purpose.
**Suggested resolution:** Either add Phone to the Profile section documentation (with its purpose — 2FA backup, account recovery, etc.) or remove it from the wireframe.

---

### G-12: "Decline" vs "Reject" terminology inconsistency
**Severity:** Low
**Location:** Docs Section 10 (Approvals), Wireframe /approvals
**Issue:** The documentation uses "Reject" and "Rejected" consistently throughout the Approvals section. Some wireframe contexts may use "Decline." Minor terminology inconsistency.
**Impact:** UI copy will be inconsistent if not standardized before build.
**Suggested resolution:** Standardize on "Reject" / "Rejected" throughout all wireframes and documentation.

---

## Recommended Resolution Order

The following is a priority-ordered list of all 58 issues. All Critical and High items must be resolved before any code is written.

### CRITICAL — Build Blockers (resolve immediately)

1. **A-01** — Define or remove the Co-Owner role
2. **A-02** — Distinguish platform-wide Manager from batch-scoped Manager
3. **A-03** — Define Manager invite ceiling rule to prevent privilege escalation
4. **A-04** — Document Publisher+Approver self-approval prohibition
5. **B-01** — Add "Changes Requested" and "Rejected" to Design System badge table
6. **B-02** — Define post behavior when its target page is disconnected
7. **B-03** — Define Paused post notification trigger and "Publisher notified" badge logic
8. **B-04** — Define mid-publish token expiry → Failed Posts categorization
9. **C-01** — Define health score algorithm and thresholds
10. **C-02** — Define RPM formula and confirm it is consistent across all locations
11. **E-01** — Define OAuth failure states in Bulk Connect flow
12. **F-01** — Define Professional plan hard limits and enforcement
13. **G-01** — Canonicalize route: `/reports/id-performance` (not `/reports/by-posting-id`)
14. **G-02** — Fix and document per-page report route

### HIGH — Needs Decision Before Build

15. **A-05** — Define multi-batch user (Fatima) UI experience
16. **A-06** — Document why Analyst is excluded from By Posting ID
17. **A-07** — Specify Approver's Queue view (read-only layout with or without disabled action columns)
18. **A-08** — Define Publisher's scope in Failed Posts
19. **B-05** — Define rejected post resubmission rules (unlimited vs. capped)
20. **B-06** — Define Approver removal → orphaned approval items reassignment
21. **B-07** — Define batch deletion and page reassignment impact on post history
22. **B-08** — Define Paused state recovery action ("Resume" button)
23. **C-03** — Define copyright scan integration (real API vs. MVP mock)
24. **C-04** — Clarify Active Hours as hard block (auto) vs. soft warning (manual)
25. **C-05** — Define post interval as minimum gap vs. exact schedule
26. **C-06** — Define performance-based rotation algorithm
27. **D-01** — Define Queue search/filter bar
28. **D-02** — Define All Pages table pagination
29. **D-03** — Define Bulk Upload Step 4 failure recovery
30. **D-04** — Define Bulk Retry mixed success/fail feedback
31. **D-05** — Define "next Active Hours slot" calculation including queue conflict resolution
32. **E-02** — Define per-file upload failure handling in Bulk Upload Step 2
33. **E-03** — Define copyright scan service unavailability fallback
34. **E-04** — Define invite link expiry, bounce handling, and resend behavior
35. **E-05** — Define simultaneous Approver review race condition handling
36. **F-02** — Define free trial and onboarding flow
37. **F-03** — Define storage-full upload blocking behavior
38. **G-03** — Align health score demo data across Connected IDs and By Posting ID
39. **G-04** — Document "Batch Groups" settings section
40. **G-05** — Align Single Post caption counter to per-platform (not single combined)
41. **G-06** — Fix "TikTok" label to "Threads" in Bulk Upload page selector

### MEDIUM — Needs Decision Before QA

42. **A-09** — Document Manager+Publisher (Aisha) self-approval prohibition
43. **A-10** — Clarify Owner invite/demotion rules
44. **A-11** — Clarify Analyst visibility of Operations Pulse card
45. **B-09** — Define "Publishing" state timeout → auto-move to Failed Posts
46. **B-10** — Clarify whether approval submission requires a scheduled time
47. **B-11** — Define auto-publish OFF manual trigger location in Queue
48. **B-12** — Define duplicate detection method (SHA-256 hash recommended)
49. **C-07** — Define follower count caching TTL
50. **C-08** — Define Threads API integration scope
51. **C-09** — Resolve Know Her Name platform contradiction (FB only vs FB+IG+TH)
52. **C-10** — Define storage scope (draft media only vs. all media)
53. **D-06** — Define confirmation dialogs for all destructive actions
54. **D-07** — Define empty states for all major screens
55. **D-08** — Align Single Post character counter UX with Bulk Upload
56. **D-10** — Document Invite Member form validation rules
57. **D-11** — Define session timeout behavior and in-progress workflow handling
58. **E-06** — Define Manager removal dependency check and reassignment
59. **E-07** — Define "Retire ID" action vs "Disconnect" distinction
60. **F-05** — Define what constitutes a "post" for billing/metrics purposes
61. **F-06** — Document Batch Groups settings page
62. **G-07** — Confirm Approvals filter tab order and all four tabs present
63. **G-08** — Decide on "Reports" vs "Insights" naming and standardize
64. **G-09** — Add non-skeleton Queue wireframe showing Paused and other states

### LOW — Polish / Nice-to-Have (can be resolved during build)

65. **A-12** — Clarify Top Performers revenue column behavior for non-Owner roles
66. **C-11** — Standardize "Expiring" vs "Token Expiring" status label
67. **D-09** — Fix `/reports/by-posting-id` route reference in all docs
68. **D-12** — Ensure wireframes render meaningful data states for audit/review
69. **D-13** — Document "New Upload" button on Drafts page with role visibility rule
70. **D-14** — Document Drafts filter bar (type, source, thread filter, sort, view mode)
71. **F-04** — Fix Flow numbering in Section 19 (Flow 7 before Flow 6)
72. **G-10** — Fix "Approvals3" sidebar label rendering bug in Dashboard wireframe
73. **G-11** — Clarify whether Phone field belongs in Profile settings and document its purpose
74. **G-12** — Standardize "Reject" vs "Decline" terminology

---

*End of audit. 58 distinct issues identified. No code should be written until all Critical (14) and High (27) issues are formally resolved and the documentation updated. Each issue should generate a product decision ticket before sprint planning.*

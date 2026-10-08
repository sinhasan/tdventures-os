# Claude Parallel Sprint Note: Conversion OS

Status: Approved parallel sprint
Owner: Claude for UI only
Supervisor: ChatGPT
Repo: tdventures-os

## Objective

Speed up the Conversion OS frontend while ChatGPT owns Common Auth, CDB, backend API contracts, CRM, and cutover safety.

Claude should improve the Conversion UI so that it clearly shows triangulated intelligence from Founder Vault, pitch deck evidence, staging application data, and future CRM/investor feedback.

## Allowed scope

Claude may work on:

1. Conversion OS UI polish
2. Founder Vault screen layout
3. Pitch deck upload UI presentation
4. Triangulated report display
5. Leading signals section
6. Contradictions and missing evidence section
7. CRM-ready summary layout
8. Deal Desk handoff display
9. Responsive fixes
10. Copy cleanup

Claude may use local mock data only.

## Not allowed

Claude must not touch:

1. Authentication
2. Token handling
3. Common DB / CDB tables
4. Backend APIs
5. Payment
6. Reveal logic
7. Staging production logic
8. CRM backend
9. Deployment settings
10. GitHub secrets or environment variables
11. Cashfree
12. Domain/DNS/cutover

Claude should not add new packages unless explicitly approved.

## Required UI concept

The Conversion report should show that the system triangulates multiple sources:

Founder Vault
+
Pitch Deck Evidence
+
Staging Application
+
Future CRM / Investor Feedback

The user should see that the output is not a generic score. It is a structured investment-readiness signal.

## Suggested frontend sections

1. Input Source Matrix
   - Founder Vault
   - Pitch Deck
   - Staging Application
   - CRM Feedback coming soon

2. Triangulated Scorecard
   - Pitch deck quality
   - Narrative clarity
   - Fundraise readiness
   - Investor fit
   - Traction strength
   - Founder-market fit

3. Leading Signals
   - label
   - strength
   - evidence
   - source
   - recommended action

4. Contradictions
   - Founder claim
   - Deck evidence
   - Interpretation
   - Action required

5. Missing Evidence
   - What is missing
   - Why it matters
   - Deal Desk request

6. Investor-Ready Summary
   - Short investor-facing brief

7. CRM-Ready Summary
   - Internal opportunity summary

8. Deal Desk Recommendation
   - Proceed
   - Request evidence
   - Rework narrative
   - Not ready yet

## Current product language to preserve

Use these terms consistently:

- Founder Vault
- Conversion OS
- Conversion Signal Engine
- CDB Signal Layer
- Common Intelligence DB
- Execute Deal Desk
- Stores intelligence, not documents
- Founder applies
- Conversion analyzes
- Deal Desk executes
- CRM tracks

## Current implementation note

The current app is frontend/local. The pitch deck upload UI does not yet perform real backend extraction. Claude can improve the UI and mock report, but must not pretend that backend extraction is already live.

Any UI copy should say:
- Pitch deck evidence
- Deck analysis preview
- Backend extraction will connect through /api/conversion/analyze

## Build requirement

Before handing back, Claude must run:

npm run build

Claude must provide:
- files changed
- summary of visual changes
- confirmation that no auth, DB, payment, reveal, deployment, or CRM backend files were touched

## Safety instruction

Do not use inline style patches for button colors. A prior inline style change caused a React runtime crash. Use className-only changes unless approved.

Do not break the existing Execute Deal Desk button or handoff flow.

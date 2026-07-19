# TD Conversion OS - Common Intelligence DB Strategy

## Product Doctrine

Conversion OS is not a pitch deck storage product.
Conversion OS is the intelligence layer between founder application, paid access, AI signal assessment, Deal Desk execution, CRM, and investor deal flow.

Core principle: Store the assessment, not the attachment.

## Target Flow

Founder applies on staging.
Common Auth identity is created or matched.
Founder gets paid Conversion access.
Founder updates profile or uploads deck temporarily for analysis.
AI extracts intelligence.
Temporary file is deleted.
Structured signals are saved to the Common Intelligence DB.
Deal Desk receives CRM-ready handoff.
Investors see assessed intelligence as part of curated deal flow.
Investor feedback becomes validation signal.

## Access Rule

Conversion OS access should be allowed only when the user has applied through staging and has an active paid Conversion plan.
Conversion should not depend on old reveal entitlement logic.

Initial simple plans: Founder Intelligence Plan and Investor Intelligence Plan.

## What CDB Means

CDB means Common Intelligence DB.
It connects application data, auth, conversion signals, Deal Desk, CRM, investor deal flow, and investor feedback.

## What We Store

Store founder identity, contact, startup name, sector, stage, raise amount, target investor type, application answers, scores, risk flags, traction signals, market signals, founder-market fit notes, investment thesis, concerns, CRM-ready summary, IC note, next best action, Deal Desk status, signal version, created date, updated date, and investor feedback signals.

## What We Do Not Store

Do not store pitch deck files, projection spreadsheets, financial models, legal documents, heavy PDFs, raw confidential attachments, or raw extracted deck text by default.

Temporary upload is allowed only for analysis: receive file, extract intelligence, generate structured signal report, delete temporary file, and save only structured output.

## Signal Versioning

Signals should update only when something meaningful changes: pitch summary, traction proof, raise amount, updated pitch deck, target investor type, investor feedback, or Deal Desk assessment.
The CDB should preserve current signal, previous signal version, last updated date, and reason for update.

## Deal Desk Handoff

The Conversion Signal Engine should produce founder brief, conversion score, investor confidence, risk level, risk flags, CRM-ready summary, IC note, next best action, follow-up task, and Deal Desk status.

## Investor Deal Flow Intelligence

Investors should see TD-assessed deal intelligence, not just uploaded documents.
Investor-facing output can include startup summary, sector, stage, raise amount, founder contact, TD Conversion score, narrative clarity, traction signal, risk signal, investor-fit logic, TD assessment summary, request pitch deck action, and ask follow-up question action.

## Investor Feedback Loop

Investor actions should become validation signals: viewed, requested deck, asked question, marked interested, rejected, rejection reason, requested call, and changed status after call.

## Backend / AI Rule

AI may read documents temporarily. CDB stores only structured intelligence. Files are deleted after processing. Raw extracted text is not stored by default.

## Strategic Positioning

TD Ventures is not building another data room.
TD Ventures is building an intelligence-led deal discovery and execution system.
The asset is founder application data, TD-assessed startup signals, investor validation feedback, and CRM execution history.

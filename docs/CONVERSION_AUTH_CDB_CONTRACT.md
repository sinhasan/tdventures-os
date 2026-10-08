# TD Conversion OS - Auth and CDB Contract

## Purpose

This document converts the Conversion CDB strategy into an implementation contract for auth, paid access, database tables, API routes, and CRM handoff.

## Access Rule

A user can access Conversion OS only when both conditions are true:
1. The user has applied through the staging application flow.
2. The user has an active paid Conversion plan.

Conversion OS should not use old reveal-count entitlement logic.

## Initial Plans

Founder Intelligence Plan: gives founders access to Founder Vault, Conversion Review, signal report, and Deal Desk handoff.
Investor Intelligence Plan: gives investors access to curated deal intelligence, founder contact, signal summary, and feedback actions.

## Core Tables

Recommended future tables: users, applications, startups, conversion_plans, conversion_entitlements, conversion_signals, signal_versions, deal_desk_handoffs, investor_feedback_signals.

## Conversion Signals

conversion_signals should store structured intelligence only: scores, risk flags, traction signals, market signals, investor-fit logic, CRM-ready summary, IC note, next best action, and signal version.

## File Handling Rule

Pitch decks and documents may be uploaded only as temporary analysis inputs. They should be deleted after intelligence extraction. Raw extracted text should not be stored by default.

## Future API Routes

POST /api/conversion/analyze - analyze founder input or temporary deck upload.
GET /api/conversion/signal/current - return current signal for authenticated user.
POST /api/conversion/handoff - create Deal Desk handoff from current signal.
GET /api/investor/deal-flow - return curated investor-facing deal intelligence.
POST /api/investor/feedback - capture investor validation signal.

## CRM Handoff

Deal Desk handoff should eventually create or update a CRM opportunity with founder brief, score, risk level, IC note, next action, and follow-up task.

## Strategic Boundary

Conversion OS stores intelligence, not confidential documents. The long-term asset is the Common Intelligence DB, strengthened by application data, AI signals, CRM actions, and investor feedback.

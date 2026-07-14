# TD Venture Conversion AI Contract

## Purpose

The Conversion workspace turns startup inputs into structured investment signals.

Claude may build UI with mock data.  
ChatGPT owns backend, auth, DB, OpenAI integration, and final wiring.

---

## Ownership Rules

Claude may build:

- UI screens
- Vault components
- Signal cards
- Mock data flows
- Static feature modules
- Props and TypeScript interfaces

Claude must not change:

- Auth system
- Login flow
- Token storage
- Backend API contract
- Database schema
- Reveal logic
- Payment logic
- Production deployment setup

ChatGPT owns:

- Auth
- DB
- API contract
- OpenAI integration
- VPS/Git/deployment safety
- Final integration across Visibility, Conversion, and Execution workspaces

---

## Workspace Map

Visibility:

- staging.tdventure.vc
- Public discovery, marketplace, profiles, matching surface

Conversion:

- tdventures-os
- Startup vault
- Pitch deck quality
- Fundraise readiness
- Narrative clarity
- Investor-fit signals

Execution:

- crm.tdventure.vc
- CRM Deal Desk
- Opportunities
- Notes
- Follow-up pack
- IC readiness
- Risk radar
- Timeline

---

## Auth Contract

All production Conversion APIs will use the shared TD Venture auth model.

Token storage:

```text
localStorage.tdventure_token

## Auth Check
GET /api/auth/me
Authorization: Bearer <tdventure_token>

##Primary AI Engine
Production Conversion scoring will use OpenAI as the primary AI engine.

Gemini/OpenRouter may remain as optional experiments or fallback only.

## API Route
POST /api/conversion/analyze
Authorization: Bearer <tdventure_token>
Content-Type: application/json

## Request Shape
{
  "startup_id": "optional-existing-startup-id",
  "analysis_type": "pitch_deck",
  "startup_name": "Example Startup",
  "sector": "AI SaaS",
  "stage": "Seed",
  "funding_ask": "₹2 crore",
  "pitch_summary": "Short founder-provided summary",
  "deck_text": "Extracted text from pitch deck or uploaded document",
  "traction_notes": "Revenue, users, pilots, LOIs, growth notes",
  "target_investor_profile": "Optional investor thesis or sector focus"
}

## Required Response Shape


{
  "pitch_deck_quality": 78,
  "narrative_clarity": 84,
  "fundraise_readiness": 69,
  "investor_fit": 72,
  "traction_strength": 61,
  "risk_level": "Moderate",
  "risk_flags": [
    "Traction proof needs strengthening",
    "Financial assumptions need clearer evidence"
  ],
  "next_best_action": "Improve traction and financial model slides before investor outreach.",
  "crm_summary": "Promising startup, but not yet IC-ready without stronger proof of traction."
}

## Field Rules

Scores must be numbers from 0 to 100.
Allowed risk levels:

Low
Moderate
High
Critical

risk_flags must be short, practical risk statements.

next_best_action must be one clear next action.

crm_summary must be reusable later inside Execution CRM.

## Mock Data Rule

Until backend integration is complete, Claude may use this mock response:

{
  "pitch_deck_quality": 78,
  "narrative_clarity": 84,
  "fundraise_readiness": 69,
  "investor_fit": 72,
  "traction_strength": 61,
  "risk_level": "Moderate",
  "risk_flags": [
    "Traction proof needs strengthening",
    "Financial assumptions need clearer evidence"
  ],
  "next_best_action": "Improve traction and financial model slides before investor outreach.",
  "crm_summary": "Promising startup, but not yet IC-ready without stronger proof of traction."
}

## Integration Rule

Conversion signals must eventually be stored in the shared backend DB.

Execution CRM may reuse these fields inside:

Investment Confidence
Operating Score
Risk Radar
IC Readiness
Follow-up Pack
Chief of Staff Brief


## Do Not Build Yet

Do not build final auth, DB tables, OpenAI calls, or production API wiring inside UI-only work.


## 
This is safe because it only adds documentation to the GitHub repo. Vercel may redeploy, but no app runtime code changes.

## ---

## Claude Work Instructions

Claude should build UI and feature modules only.

Claude may create:

- Login screen UI
- Startup Vault UI
- Pitch deck upload UI
- Pitch deck quality card
- Narrative clarity card
- Fundraise readiness card
- Investor-fit card
- Risk flag card
- Next-best-action card
- Mock data
- TypeScript interfaces
- Reusable components

Claude must not create or modify:

- Auth
- Token storage
- Backend login
- Database schema
- Production API wiring
- Payment/reveal logic
- Deployment settings

---

## Future Conversion Signal Fields

These fields will later be stored in the shared backend database:

- pitch_deck_quality
- narrative_clarity
- fundraise_readiness
- investor_fit
- traction_strength
- risk_level
- risk_flags
- next_best_action
- crm_summary

---

## Future Event Names

The shared backend may later record these events:

- profile_created
- vault_item_uploaded
- deck_uploaded
- deck_scored
- conversion_signal_created
- investor_matched
- contact_revealed
- opportunity_started
- followup_logged
- ic_note_created

---

## Future API Routes

Planned backend-owned routes:

```http
POST /api/conversion/analyze
GET /api/conversion/signals/:startup_id
POST /api/conversion/vault/upload
GET /api/conversion/vault/:startup_id

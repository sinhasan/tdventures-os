# Conversion Signal Contract

Status: MVP cutover contract
Owner: ChatGPT
Repo: tdventures-os

## Purpose

Conversion OS must not be only a UI demo. Before cutover, it must generate triangulated fundraising intelligence from Founder Vault data, uploaded pitch deck evidence, and staging application data. Later, CRM activity and investor feedback should strengthen the same signal.

The goal is to create investor-ready intelligence, not document storage.

## Core principle

Store intelligence, not documents.

Pitch decks, PDFs, spreadsheets, and raw extracted text may be used temporarily for analysis. By default, the system should not store raw files or raw extracted text. The durable asset is the structured signal: scores, risks, contradictions, missing evidence, summaries, recommendations, and Deal Desk actions.

## Required input sources

1. Founder Vault
   - Startup name
   - Sector
   - Stage
   - Raise amount
   - Pitch summary
   - Traction proof
   - Risk notes
   - Target investor type

2. Staging application snapshot
   - Founder identity
   - Startup profile
   - Contact details
   - Sector/stage
   - Application status
   - Payment/access entitlement when required

3. Uploaded pitch deck or document
   - Temporary analysis input only
   - Extracted text used only to generate signal
   - Raw file and raw extracted text not stored by default

4. Future validation sources
   - CRM notes
   - Deal Desk status
   - Investor feedback
   - Founder updates

## Required triangulation

Conversion output must compare:

Founder Vault claim
vs
Pitch deck evidence
vs
Staging application data
vs
later CRM or investor feedback

Example:
Founder Vault says revenue traction exists.
Pitch deck has no revenue slide or customer proof.
Output should flag missing evidence, lower traction strength, and create a Deal Desk follow-up.

## MVP signal fields

The backend response and stored CDB signal should contain:

```json
{
  "startup_id": "",
  "application_id": "",
  "signal_version": 1,
  "source_versions": {
    "founder_vault": "v1",
    "application_snapshot": "v1",
    "deck_analysis": "v1"
  },
  "confidence_level": "Low | Medium | High",
  "scores": {
    "pitch_deck_quality": 0,
    "narrative_clarity": 0,
    "fundraise_readiness": 0,
    "investor_fit": 0,
    "traction_strength": 0,
    "founder_market_fit": 0
  },
  "risk_level": "Low | Moderate | High",
  "risk_flags": [],
  "leading_signals": [],
  "contradictions": [],
  "missing_evidence": [],
  "investment_thesis": "",
  "investor_summary": "",
  "crm_summary": "",
  "next_best_action": "",
  "deal_desk_recommendation": "",
  "created_at": ""
}
```

## Leading signals

Leading signals should be short, actionable observations that predict fundraising readiness. Examples:

- Clear ICP and buyer pain
- Revenue or pilot proof exists
- Founder-market fit is credible
- Raise amount matches stage
- Deck has clear use of funds
- Market wedge is specific
- Risk evidence is acknowledged
- Investor fit is narrow enough to act on

Each leading signal should have:
- label
- strength
- evidence
- source
- recommended action

## Contradictions

Contradictions should identify mismatches between sources.

Examples:
- Vault claims paid traction, but deck shows only pilots.
- Vault says enterprise SaaS, but deck ICP is consumer.
- Raise amount says seed, but traction looks pre-seed.
- Target investor type is broad and not sector-specific.

## Missing evidence

Missing evidence should identify what the Deal Desk must request before investor outreach.

Examples:
- No revenue slide
- No customer proof
- No pricing model
- No use-of-funds breakdown
- No competitive map
- No founder background proof
- No fundraising ask clarity

## Required API contract

Future backend endpoint:

POST /api/conversion/analyze

Inputs:
- authenticated user token
- startup_id or application_id
- Founder Vault JSON
- optional pitch deck file
- optional analysis mode

Output:
- full Conversion Signal JSON
- temporary processing metadata
- saved signal id when persistence is enabled

## CRM / Deal Desk handoff

POST /api/conversion/handoff should take the latest signal and create or update CRM opportunity data with:

- startup name
- founder identity
- conversion score
- risk level
- leading signals
- missing evidence
- CRM summary
- investor summary
- next best action
- follow-up task
- Deal Desk recommendation

## Cutover readiness rule

Conversion is ready for cutover only when:

1. Founder Vault data can generate a signal.
2. Pitch deck upload can generate evidence.
3. Output is triangulated, not a single generic score.
4. Signals are saved to CDB.
5. Raw files are not stored by default.
6. Deal Desk handoff works.
7. CRM can display the signal.
8. Build and rollback are verified.

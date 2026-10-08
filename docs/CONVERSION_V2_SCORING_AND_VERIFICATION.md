# TD Venture Conversion V2

## Purpose

Conversion V2 turns the canonical startup application, the 20-dimension
founder evidence profile, an optional pitch deck, and sector context into one
evidence-backed signal for Deal Desk. It separates founder claims from
independent AI interpretation and publishes the scoring logic used in the
result.

## Evidence sources

1. Canonical startup profile in `tdventure_prod`
2. Latest submitted Founder Evidence Profile revision
3. Optional pitch deck supplied for the current analysis
4. Sector Intelligence context

Selecting a filename is not evidence ingestion. The backend must receive and
interpret the actual file. A missing deck is recorded as **Not supplied** and
is not silently scored as a zero-quality deck.

PDF decks are analysed using extracted text and page images. PPTX decks are
analysed as text-only files; charts and embedded visuals may not be available
to the model. PDF is therefore the recommended format for complete deck
analysis.

## Twenty dimensions

Each dimension has a founder rating from 1–5 and an independent AI rating from
1–5:

1. Idea & innovation
2. Solution
3. Timing
4. Market wedge
5. Secret sauce
6. TAM
7. Durability
8. Team
9. Distribution
10. Regulatory readiness
11. Revenue
12. Third-year projection
13. Traction
14. Profitability
15. Business model
16. Ownership & A-Team
17. Scalability
18. Funding history
19. Investor exit
20. Funding instrument

The founder and AI totals are each normalized naturally to 100 because twenty
dimensions × five points = 100.

## Published score

The founder contribution is capped at 40 points. The OpenAI evidence
contribution is capped at 60 points.

```text
OpenAI contribution = 0.60 × OpenAI Evidence Score
Founder contribution before sector = 0.40 × Founder Claim Score
```

Sector Intelligence is a penalty rule, not a bonus:

- Sector structural score of 70 or more: no adjustment.
- Sector structural score below 70: deduct 10 points from the founder's
  40-point contribution.
- The founder contribution cannot fall below zero.

```text
Conversion Score =
  0.60 × OpenAI Evidence Score
  + max(0, 0.40 × Founder Claim Score + Sector Adjustment)
```

The score is rounded and constrained to 0–100.

## Gap Analysis and claim handling

The report preserves both scores and shows the gap rather than hiding it:

- **Broadly aligned**: founder and AI totals are within 14 points.
- **Founder optimistic**: founder total exceeds AI total by 15 or more.
- **Founder conservative**: AI total exceeds founder total by 15 or more.
- **Material contradiction**: the evidence contains contradictions or the AI
  detects a high anomaly level.

Each dimension is labelled Missing, Claimed, AI-supported, or Contradicted.
The system generates targeted interview questions for evidence gaps and
contradictions. The **Accept Claims** workspace lets the founder answer those
questions without changing the independent AI score.

## Profile verification

Every startup may proceed to Execution whether or not TD Ventures has verified
the profile.

- Default: **Profile Not Verified**, displayed in destructive red.
- After the internal human verification workflow:
  **★ Verified Profile by TD Ventures**, displayed in neon.

Only an authorized internal operator can award the verified state. Founder
answers alone never self-verify a profile.

Profile verification is not investment due diligence, an endorsement, or an
assurance of investment performance. Formal investor diligence remains a
separate process.

## Auditability

The current signal stores:

- the Founder Evidence Profile revision;
- deck filename, hash, analysis mode, and limitations;
- all twenty AI assessments and evidence states;
- the founder, AI, and sector components of the score;
- the full scoring formula;
- Gap Analysis classification;
- generated interview questions and submitted responses;
- verification status, scope, operator, accepted claim keys, and timestamp.

OpenAI analysis requests use structured output and `store: false`. A new
evidence revision or a new deck analysis creates a new signal; it does not
silently rewrite the history of an earlier result.

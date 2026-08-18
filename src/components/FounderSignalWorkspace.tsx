import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileText,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import type {
  ConversionV2Analysis,
  ConversionV2ContextResponse
} from '../lib/conversionApi';

type WorkspaceAction = () => void;

type FounderSignalDashboardProps = {
  context: ConversionV2ContextResponse | null;
  analysis: ConversionV2Analysis | null;
  deckFile: File | null;
  onCollect: WorkspaceAction;
  onAnalyse: WorkspaceAction;
  onImprove: WorkspaceAction;
  onVerify: WorkspaceAction;
  onDealDesk: WorkspaceAction;
};

const READINESS_KEYS = [
  'revenue',
  'third_year_projection',
  'traction',
  'profitability',
  'business_model',
  'ownership_and_team',
  'scalability',
  'funding_history',
  'investor_exit',
  'funding_instrument'
];

const NARRATIVE_KEYS = [
  'idea',
  'solution',
  'timing',
  'market_wedge',
  'secret_sauce',
  'distribution'
];

const RISK_KEYS = [
  'durability',
  'regulatory_readiness',
  'profitability',
  'ownership_and_team',
  'funding_instrument'
];

function claimMap(context: ConversionV2ContextResponse | null) {
  return new Map(
    (context?.evidence?.claims || []).map((claim) => [claim.key, claim])
  );
}

function groupScore(
  context: ConversionV2ContextResponse | null,
  keys: string[]
) {
  const claims = claimMap(context);
  const values = keys
    .map((key) => Number(claims.get(key)?.rating || 0))
    .filter((value) => value > 0);

  if (!values.length) return null;
  return Math.round(
    (values.reduce((sum, value) => sum + value, 0) / values.length) * 20
  );
}

function scoreTone(score: number | null) {
  if (score == null) return 'text-slate-500';
  if (score >= 80) return 'text-[#D4FF00]';
  if (score >= 60) return 'text-amber-300';
  return 'text-red-300';
}

function ProgressBar({
  value,
  tone = 'neon'
}: {
  value: number;
  tone?: 'neon' | 'amber' | 'red';
}) {
  const colour =
    tone === 'amber'
      ? 'bg-amber-300'
      : tone === 'red'
        ? 'bg-red-400'
        : 'bg-[#D4FF00]';

  return (
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
      <div
        className={`h-full rounded-full ${colour}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  caption,
  score
}: {
  label: string;
  value: React.ReactNode;
  caption: string;
  score?: number | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <div className={`mt-2 text-xl font-black ${scoreTone(score ?? null)}`}>
        {value}
      </div>
      <p className="mt-1 text-[11px] leading-4 text-slate-500">{caption}</p>
      {score != null && (
        <ProgressBar
          value={score}
          tone={score >= 80 ? 'neon' : score >= 60 ? 'amber' : 'red'}
        />
      )}
    </div>
  );
}

export function FounderSignalDashboard({
  context,
  analysis,
  deckFile,
  onCollect,
  onAnalyse,
  onImprove,
  onVerify,
  onDealDesk
}: FounderSignalDashboardProps) {
  const evidence = context?.evidence;
  const profile = context?.profile;
  const completed = Number(evidence?.completion_count || 0);
  const founderScore =
    evidence?.founder_claim_score == null
      ? null
      : Number(evidence.founder_claim_score);
  const narrative =
    analysis?.narrative_clarity ?? groupScore(context, NARRATIVE_KEYS);
  const readiness =
    analysis?.fundraise_readiness ?? groupScore(context, READINESS_KEYS);
  const traction =
    analysis?.traction_strength ??
    groupScore(context, ['traction', 'revenue', 'profitability']);
  const riskReadiness = groupScore(context, RISK_KEYS);
  const riskLabel =
    analysis?.risk_level ||
    (riskReadiness == null
      ? 'Awaiting data'
      : riskReadiness >= 80
        ? 'Low declared risk'
        : riskReadiness >= 60
          ? 'Moderate declared risk'
          : 'High declared risk');
  const verification = analysis?.profile_verification;
  const verified = verification?.status === 'profile_verified';

  return (
    <div className="space-y-5 animate-fade-in">
      <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-[#D4FF00]">
              03 · Present
            </p>
            <h1 className="mt-1.5 text-2xl font-black text-white">
              Conversion Terminal · {profile?.startup_name || 'Startup'}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-5 text-slate-400">
              Submitted founder evidence is visible immediately. It remains
              founder-declared until independent analysis and optional
              verification are completed.
            </p>
          </div>
          <div
            className={`rounded-xl border px-4 py-3 ${
              verified
                ? 'border-[#D4FF00]/55 bg-[#D4FF00]/10'
                : 'border-red-500/55 bg-red-950/25'
            }`}
          >
            <p
              className={`text-xs font-black ${
                verified ? 'text-[#D4FF00]' : 'text-red-300'
              }`}
            >
              {verified
                ? '★ Verified Profile by TD Ventures'
                : 'Profile Not Verified'}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              Verification is optional and never blocks Deal Desk.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {[
            ['01', 'Collect', completed === 20 ? 'Complete' : `${completed}/20`],
            ['02', 'Apply AI Intelligence', analysis ? 'Complete' : 'Required next step'],
            ['03', 'Present', 'Current'],
            ['04', 'Improvement Plan', analysis ? 'Ready' : 'After analysis'],
            ['05', 'Verify', verified ? 'Verified' : 'Optional'],
            ['06', 'Deal Desk', analysis ? 'Graduated ✓' : 'Locked · AI review required']
          ].map(([number, label, state]) => (
            <div
              key={label}
              className={`rounded-xl border px-3 py-2.5 ${
                label === 'Present'
                  ? 'border-[#D4FF00]/45 bg-[#D4FF00]/8'
                  : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              <p className="text-[9px] font-mono text-slate-600">{number}</p>
              <p className="mt-0.5 text-xs font-black text-white">{label}</p>
              <p className="mt-0.5 text-[10px] text-slate-500">{state}</p>
            </div>
          ))}
        </div>
      </section>

      {!analysis && completed === 20 && (
        <section className="rounded-2xl border border-[#D4FF00]/45 bg-[#D4FF00]/[0.06] px-5 py-4">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.22em] text-[#D4FF00]">
            Graduation requirement
          </p>
          <h2 className="mt-1.5 text-base font-black text-white">
            20/20 Founder Evidence Complete · Independent AI Review Required
          </h2>
          <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-400">
            Your founder evidence is self-declared. Complete one independent AI review
            to create the versioned Conversion Signal used by Deal Desk.
            <strong className="text-slate-200"> Pitch deck is optional</strong>
            {' '}— supplying one strengthens the assessment but is not required to graduate.
          </p>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">
        <MetricCard
          label={analysis ? 'Conversion score' : 'Founder claim score'}
          value={
            analysis
              ? `${analysis.conversion_score}/100`
              : founderScore == null
                ? 'Not submitted'
                : `${founderScore}/100`
          }
          score={analysis?.conversion_score ?? founderScore}
          caption={
            analysis
              ? '60% independent AI + adjusted founder contribution'
              : 'Self-declared; independent AI validation pending'
          }
        />
        <MetricCard
          label="Evidence completion"
          value={`${completed}/20`}
          score={completed * 5}
          caption={`${evidence?.evidence_count || 0} evidence fields supplied`}
        />
        <MetricCard
          label="Traction signal"
          value={traction == null ? 'Awaiting data' : `${traction}/100`}
          score={traction}
          caption={analysis ? 'Independent assessment' : 'Derived from submitted claims'}
        />
        <MetricCard
          label="Narrative clarity"
          value={narrative == null ? 'Awaiting data' : `${narrative}/100`}
          score={narrative}
          caption={analysis ? 'Independent assessment' : 'Founder-declared baseline'}
        />
        <MetricCard
          label="Fundraise readiness"
          value={readiness == null ? 'Awaiting data' : `${readiness}/100`}
          score={readiness}
          caption={analysis ? 'Independent assessment' : 'Founder-declared baseline'}
        />
        <MetricCard
          label="Risk assessment"
          value={riskLabel}
          score={
            analysis
              ? analysis.risk_level === 'Low'
                ? 90
                : analysis.risk_level === 'Moderate'
                  ? 65
                  : 35
              : riskReadiness
          }
          caption={analysis ? 'Independent risk view' : 'Derived; validation pending'}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-cyan-300" />
            <h2 className="text-base font-black text-white">
              Submitted data snapshot
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ['Sector', profile?.sector || 'Not set'],
              ['Stage', profile?.stage || 'Not set'],
              ['Geography', profile?.geography || 'Not set'],
              ['Raise', profile?.ask_usd ? `USD ${profile.ask_usd}` : 'Not set'],
              ['Application', evidence ? `Revision ${evidence.revision}` : 'Not found'],
              [
                'Pitch deck',
                analysis?.deck_assessment?.status ||
                  (deckFile ? deckFile.name : 'Not supplied')
              ]
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-800 bg-slate-950/65 p-3"
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                  {label}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
          <div className="flex items-center gap-2">
            {analysis ? (
              <CheckCircle2 className="h-4 w-4 text-[#D4FF00]" />
            ) : (
              <Sparkles className="h-4 w-4 text-amber-300" />
            )}
            <h2 className="text-base font-black text-white">Next action</h2>
          </div>
          <p className="mt-3 text-sm leading-5 text-slate-400">
            {analysis
              ? analysis.next_best_action
              : completed === 20
                ? 'Your 20/20 founder evidence is complete. Run the required independent AI review to create the Deal Desk Conversion Signal. A pitch deck is optional and strengthens the assessment when supplied.'
                : 'Complete the Startup Apply evidence record before analysis.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onCollect}
              className="rounded-lg border border-slate-700 px-3 py-2 text-[11px] font-black text-slate-200"
            >
              View collected data
            </button>
            <button
              type="button"
              onClick={analysis ? onDealDesk : onAnalyse}
              className="inline-flex items-center gap-1 rounded-lg bg-[#D4FF00] px-3 py-2 text-[11px] font-black text-slate-950"
            >
              {analysis ? 'Continue to Deal Desk' : 'Apply AI Intelligence'}
              <ArrowRight className="h-3 w-3" />
            </button>
            {analysis && !verified && (
              <button
                type="button"
                onClick={onVerify}
                className="rounded-lg border border-cyan-400/35 px-3 py-2 text-[11px] font-black text-cyan-200"
              >
                Request verification
              </button>
            )}
            {analysis && (
              <button
                type="button"
                onClick={onImprove}
                className="rounded-lg border border-[#D4FF00]/35 px-3 py-2 text-[11px] font-black text-[#D4FF00]"
              >
                View improvement plan
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export function FounderEvidenceRecord({
  context,
  compact = false
}: {
  context: ConversionV2ContextResponse | null;
  compact?: boolean;
}) {
  const evidence = context?.evidence;
  const claims = evidence?.claims || [];

  if (!evidence) {
    return (
      <section className="rounded-2xl border border-amber-400/30 bg-amber-950/10 p-5">
        <div className="flex items-center gap-2 text-amber-200">
          <ShieldAlert className="h-4 w-4" />
          <h2 className="text-sm font-black">No submitted evidence record</h2>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Complete and submit the Startup Apply form to populate Conversion.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-[#D4FF00]">
            Collect · Application evidence
          </p>
          <h2 className="mt-1.5 text-xl font-black text-white">
            20-question Founder Evidence Record
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Founder-declared data · revision {evidence.revision} · not an
            independent investment opinion
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-lg border border-[#D4FF00]/35 bg-[#D4FF00]/8 px-3 py-2 text-xs font-black text-[#D4FF00]">
            {evidence.founder_claim_score}/100
          </span>
          <span className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-black text-white">
            {evidence.completion_count}/20 complete
          </span>
        </div>
      </div>

      <div
        className={`mt-4 grid gap-2 ${
          compact
            ? 'sm:grid-cols-2 xl:grid-cols-4'
            : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {claims.map((claim, index) => (
          <div
            key={claim.key}
            className="rounded-xl border border-slate-800 bg-slate-950/65 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] font-mono text-slate-600">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-0.5 truncate text-xs font-black text-slate-200">
                  {claim.label}
                </p>
              </div>
              <span
                className={`shrink-0 text-sm font-black ${
                  claim.rating >= 4
                    ? 'text-[#D4FF00]'
                    : claim.rating === 3
                      ? 'text-amber-300'
                      : 'text-red-300'
                }`}
              >
                {claim.rating}/5
              </span>
            </div>
            <ProgressBar
              value={claim.rating * 20}
              tone={
                claim.rating >= 4
                  ? 'neon'
                  : claim.rating === 3
                    ? 'amber'
                    : 'red'
              }
            />
            {!compact && (
              <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-slate-500">
                {claim.evidence || 'Rating supplied without supporting text.'}
              </p>
            )}
            <p className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-600">
              <FileText className="h-3 w-3" />
              {claim.evidence ? 'Evidence supplied' : 'Claim only'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

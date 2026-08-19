import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Compass,
  Eye,
  FileSearch,
  GitCompareArrows,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow
} from 'lucide-react';
import {
  getInvestorConversionContext,
  getInvestorConversionStartups,
  getInvestorStartupSignal,
  type InvestorConversionContextResponse,
  type InvestorConversionStartup,
  type InvestorSafeSignalResponse
} from '../lib/conversionApi';

import type {
  ConversionV2Analysis
} from '../lib/conversionApi';

export type InvestorDecisionView =
  | 'dashboard'
  | 'investor_discover'
  | 'investor_matches'
  | 'investor_framework'
  | 'investor_execution';

type InvestorDecisionWorkspaceProps = {
  view: InvestorDecisionView;
  accountName: string;
  investorProfileLinked: boolean;
  analysis?: ConversionV2Analysis | null;
  onDiscoverStartups: () => void;
  onOpenDealDesk: () => void;
  onOpenSelectedStartupDealDesk: (
    startupId: string
  ) => void;
  onOpenPricing: () => void;
};

const MARKETPLACE_URL =
  'https://staging.tdventure.vc/app';

const INVESTOR_APPLY_URL =
  'https://staging.tdventure.vc/signup/investor';

type MandateSignalKey =
  | 'investment_thesis'
  | 'founder_qualities'
  | 'pursuit_criteria'
  | 'market_opportunity'
  | 'moat_expectation'
  | 'market_risks'
  | 'traction_expectation'
  | 'economics_expectation'
  | 'evidence_required'
  | 'capital_strategy'
  | 'capital_outcomes'
  | 'decision_engagement';

type MandatePillar = {
  number: string;
  label: string;
  fields: MandateSignalKey[];
  icon: React.ComponentType<{
    className?: string;
  }>;
};

const mandateSignalLabels:
  Record<MandateSignalKey, string> = {
    investment_thesis: 'Investment thesis',
    founder_qualities: 'Founder qualities',
    pursuit_criteria: 'Pursuit criteria',

    market_opportunity: 'Market opportunity',
    moat_expectation: 'Moat expectation',
    market_risks: 'Market risks',

    traction_expectation: 'Traction expectation',
    economics_expectation: 'Economics expectation',
    evidence_required: 'Evidence required',

    capital_strategy: 'Capital strategy',
    capital_outcomes: 'Capital outcomes',
    decision_engagement: 'Decision & engagement'
  };

const pillars: MandatePillar[] = [
  {
    number: '01',
    label: 'Thesis & Founder Fit',
    fields: [
      'investment_thesis',
      'founder_qualities',
      'pursuit_criteria'
    ],
    icon: Target
  },
  {
    number: '02',
    label: 'Market & Moat',
    fields: [
      'market_opportunity',
      'moat_expectation',
      'market_risks'
    ],
    icon: Compass
  },
  {
    number: '03',
    label: 'Operating Evidence',
    fields: [
      'traction_expectation',
      'economics_expectation',
      'evidence_required'
    ],
    icon: FileSearch
  },
  {
    number: '04',
    label: 'Capital & Return Readiness',
    fields: [
      'capital_strategy',
      'capital_outcomes',
      'decision_engagement'
    ],
    icon: Scale
  }
];

const viewCopy: Record<
  InvestorDecisionView,
  {
    eyebrow: string;
    title: string;
    body: string;
  }
> = {
  dashboard: {
    eyebrow: 'Investor Decision Intelligence',
    title:
      'Move from startup discovery to evidence-backed conviction.',
    body:
      'Use Conversion to understand the evidence. Founder, AI and TD Admin assessments remain independent so investor judgment stays sovereign.'
  },

  investor_discover: {
    eyebrow: '01 · Discover',
    title:
      'Enter through real startup records — not a demo portfolio.',
    body:
      'Discover startups through the Private Marketplace, then use Conversion to understand the evidence behind the opportunity.'
  },

  investor_matches: {
    eyebrow: '02 · Compare',
    title:
      'Turn broad matching into a focused decision queue.',
    body:
      'Match Fit is the starting point. Conversion evidence, investor fit, risk and your own judgment determine which startups deserve attention.'
  },

  investor_framework: {
    eyebrow: '03 · Evaluate',
    title:
      'Use consistent questions without surrendering investor instinct.',
    body:
      'The diligence framework creates guardrails. Founder, AI and TD Admin assessments remain distinct and are never merged into an artificial investment verdict.'
  },

  investor_execution: {
    eyebrow: '04 · Execute',
    title:
      'Move conviction into an accountable Deal Desk workflow.',
    body:
      'Once an opportunity deserves engagement, Deal Desk carries it through outreach, meetings, diligence, decision and funding.'
  }
};

function scoreText(
  value: number | null | undefined
): string {
  return typeof value === 'number'
    ? `${Math.round(value)} / 100`
    : 'Awaiting signal';
}

function verificationText(
  analysis?: ConversionV2Analysis | null
): string {
  const verification =
    analysis?.profile_verification;

  if (!verification) {
    return 'Not assessed';
  }

  if (
    verification.status ===
    'profile_verified'
  ) {
    return 'TDV verified';
  }

  if (
    verification.status ===
    'verification_declined'
  ) {
    return 'Verification declined';
  }

  return 'Not verified';
}

function riskTone(
  risk?: string | null
): string {
  if (risk === 'Low') {
    return 'text-emerald-300';
  }

  if (risk === 'High') {
    return 'text-rose-300';
  }

  return 'text-amber-300';
}

function ExternalLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-5 text-xs font-black uppercase tracking-wider text-slate-200 transition hover:border-[#D4FF00]/60 hover:text-[#D4FF00]"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone = 'text-[#D4FF00]'
}: {
  label: string;
  value: string;
  detail: string;
  tone?: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-[#0c1222]/80 p-5">
      <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-3 text-xl font-black ${tone}`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {detail}
      </p>
    </article>
  );
}

export function InvestorDecisionWorkspace({
  view,
  accountName,
  investorProfileLinked,
  analysis,
  onDiscoverStartups,
  onOpenDealDesk,
  onOpenSelectedStartupDealDesk,
  onOpenPricing
}: InvestorDecisionWorkspaceProps) {
  const copy = viewCopy[view];

  const [investorContext, setInvestorContext] =
    useState<InvestorConversionContextResponse | null>(null);

  const [investorContextLoading, setInvestorContextLoading] =
    useState(true);

  const [investorContextError, setInvestorContextError] =
    useState('');

  useEffect(() => {
    let mounted = true;

    async function loadInvestorContext() {
      setInvestorContextLoading(true);
      setInvestorContextError('');

      try {
        const result =
          await getInvestorConversionContext();

        if (mounted) {
          setInvestorContext(result);
        }
      } catch (error) {
        if (mounted) {
          setInvestorContextError(
            error instanceof Error
              ? error.message
              : 'Investor mandate could not be loaded.'
          );
        }
      } finally {
        if (mounted) {
          setInvestorContextLoading(false);
        }
      }
    }

    void loadInvestorContext();

    return () => {
      mounted = false;
    };
  }, []);

  const mandateProfile =
    investorContext?.profile;

  const mandateAnswers =
    investorContext?.evidence?.answers || {};

  const rawMandateAnswer = (
    key: string
  ): string => {
    const value = mandateAnswers[key];

    if (
      value === null ||
      value === undefined
    ) {
      return '';
    }

    return String(value).trim();
  };

  /*
   * V1 historical evidence is never overwritten.
   *
   * Only directly compatible information is reused
   * while an investor completes the V2 mandate.
   * Missing V2 signals remain Awaiting.
   */
  const legacyDecisionEngagement = [
    rawMandateAnswer(
      'decision_process_timeline'
    ),
    rawMandateAnswer(
      'engagement_offered'
    )
  ]
    .filter(Boolean)
    .join(' · ');

  const effectiveMandateAnswers:
    Record<MandateSignalKey, string> = {

      investment_thesis:
        rawMandateAnswer(
          'investment_thesis'
        ) ||
        String(
          mandateProfile
            ?.investment_thesis ||
          ''
        ).trim(),

      founder_qualities:
        rawMandateAnswer(
          'founder_qualities'
        ),

      pursuit_criteria:
        rawMandateAnswer(
          'pursuit_criteria'
        ),

      market_opportunity:
        rawMandateAnswer(
          'market_opportunity'
        ),

      moat_expectation:
        rawMandateAnswer(
          'moat_expectation'
        ),

      market_risks:
        rawMandateAnswer(
          'market_risks'
        ),

      traction_expectation:
        rawMandateAnswer(
          'traction_expectation'
        ),

      economics_expectation:
        rawMandateAnswer(
          'economics_expectation'
        ),

      evidence_required:
        rawMandateAnswer(
          'evidence_required'
        ),

      capital_strategy:
        rawMandateAnswer(
          'capital_strategy'
        ) ||
        rawMandateAnswer(
          'follow_on_policy'
        ),

      capital_outcomes:
        rawMandateAnswer(
          'capital_outcomes'
        ),

      decision_engagement:
        rawMandateAnswer(
          'decision_engagement'
        ) ||
        legacyDecisionEngagement
    };

  const mandateCompletion =
    Object.values(
      effectiveMandateAnswers
    ).filter(
      value => value.trim().length > 0
    ).length;

  const mandateAwaiting =
    Math.max(
      0,
      12 - mandateCompletion
    );

  const mandateReadiness =
    Math.round(
      (mandateCompletion / 12) * 100
    );

  const mandateReady =
    mandateCompletion === 12;

  const mandateRibbonText =
    mandateReady
      ? (
          'INVESTOR MANDATE READY · ' +
          '12 OF 12 SIGNALS SUPPLIED · ' +
          'FULL INVESTMENT LENS AVAILABLE ' +
          'FOR OPPORTUNITY FIT AND ' +
          'FOUNDER PITCH GUIDANCE'
        )
      : (
          'COMPLETE YOUR INVESTOR MANDATE · ' +
          `${mandateCompletion} OF 12 SIGNALS SUPPLIED · ` +
          `${mandateAwaiting} AWAITING · ` +
          'COMPLETE THE REMAINING SIGNALS ' +
          'FOR MORE PRECISE OPPORTUNITY FIT ' +
          'AND FOUNDER PITCH GUIDANCE'
        );

  const mandateBuckets =
    pillars.map(pillar => {
      const supplied =
        pillar.fields.filter(
          field =>
            effectiveMandateAnswers[
              field
            ].trim().length > 0
        ).length;

      const awaiting =
        3 - supplied;

      const state:
        'Supported' |
        'Partial' |
        'Awaiting' =
          supplied === 3
            ? 'Supported'
            : supplied > 0
              ? 'Partial'
              : 'Awaiting';

      return {
        ...pillar,
        supplied,
        awaiting,
        state
      };
    });

  const [investorStartups, setInvestorStartups] =
    useState<InvestorConversionStartup[]>([]);

  const [
    investorStartupsLoading,
    setInvestorStartupsLoading
  ] = useState(true);

  const [
    investorStartupsError,
    setInvestorStartupsError
  ] = useState('');

  const [
    selectedInvestorStartupId,
    setSelectedInvestorStartupId
  ] = useState('');

  const [
    investorStartupSignal,
    setInvestorStartupSignal
  ] = useState<InvestorSafeSignalResponse | null>(null);

  const [
    investorSignalLoading,
    setInvestorSignalLoading
  ] = useState(false);

  const [
    investorSignalError,
    setInvestorSignalError
  ] = useState('');

  async function loadInvestorStartups() {
    setInvestorStartupsLoading(true);
    setInvestorStartupsError('');

    try {
      const result =
        await getInvestorConversionStartups();

      const rows =
        Array.isArray(result.startups)
          ? result.startups
          : [];

      setInvestorStartups(rows);

      setSelectedInvestorStartupId(
        current => {
          if (
            current &&
            rows.some(
              item =>
                item.startup_id === current
            )
          ) {
            return current;
          }

          return rows[0]?.startup_id || '';
        }
      );
    } catch (error) {
      setInvestorStartupsError(
        error instanceof Error
          ? error.message
          : 'Investor startup queue could not be loaded.'
      );
    } finally {
      setInvestorStartupsLoading(false);
    }
  }

  useEffect(() => {
    void loadInvestorStartups();
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!selectedInvestorStartupId) {
      setInvestorStartupSignal(null);
      setInvestorSignalError('');
      return;
    }

    async function loadSignal() {
      setInvestorSignalLoading(true);
      setInvestorSignalError('');

      try {
        const result =
          await getInvestorStartupSignal(
            selectedInvestorStartupId
          );

        if (mounted) {
          setInvestorStartupSignal(result);
        }
      } catch (error) {
        if (mounted) {
          setInvestorStartupSignal(null);

          setInvestorSignalError(
            error instanceof Error
              ? error.message
              : 'Conversion signal could not be loaded.'
          );
        }
      } finally {
        if (mounted) {
          setInvestorSignalLoading(false);
        }
      }
    }

    void loadSignal();

    return () => {
      mounted = false;
    };
  }, [selectedInvestorStartupId]);

  const selectedInvestorStartup =
    investorStartups.find(
      item =>
        item.startup_id ===
        selectedInvestorStartupId
    ) || null;

  const currentInvestorSignal =
    investorStartupSignal?.signal || null;

  const currentInvestorScores =
    currentInvestorSignal?.scores || {};

  const decisionScore = (
    key: string
  ) => {
    const value =
      currentInvestorScores[key];

    if (
      typeof value === 'number' &&
      Number.isFinite(value)
    ) {
      return `${Math.round(value)}/100`;
    }

    if (
      typeof value === 'string' &&
      value.trim()
    ) {
      return value;
    }

    return '—';
  };

  const mandateValue = (
    key: string,
    fallback?: string | number | null
  ) => {
    const value =
      mandateAnswers[key] ??
      fallback ??
      '';

    return String(value).trim() || 'Not provided';
  };

  const mandateUsd = (
    value?: string | number | null
  ) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return 'Not provided';
    }

    const numeric = Number(
      String(value).replace(/,/g, '')
    );

    if (!Number.isFinite(numeric)) {
      return String(value);
    }

    return `USD ${numeric.toLocaleString()}`;
  };
  const hasSignal = Boolean(analysis);

  const tdAdminScore =
    analysis?.profile_verification
      ?.td_verified_score ??
    analysis?.profile_verification
      ?.td_admin_score ??
    null;

  return (
    <div className="space-y-5 animate-fade-in">

      <style>{`
        @keyframes tdvInvestorMandateMarquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .tdv-investor-mandate-ribbon {
            animation: none !important;
          }
        }
      `}</style>

      {/* INVESTOR MANDATE MOVING RIBBON */}
      <div
        className={`overflow-hidden rounded-xl border ${
          mandateReady
            ? (
                'border-[#D4FF00]/35 ' +
                'bg-[#D4FF00]/10'
              )
            : (
                'border-amber-300/30 ' +
                'bg-amber-300/[0.07]'
              )
        }`}
      >
        <div
          className="tdv-investor-mandate-ribbon flex w-max min-w-full items-center py-2.5"
          style={{
            animation:
              'tdvInvestorMandateMarquee 24s linear infinite'
          }}
        >
          <span
            className={`shrink-0 px-8 text-[10px] font-mono font-black uppercase tracking-[0.2em] ${
              mandateReady
                ? 'text-[#D4FF00]'
                : 'text-amber-200'
            }`}
          >
            {mandateRibbonText}
          </span>

          <span
            aria-hidden="true"
            className={`shrink-0 px-8 text-[10px] font-mono font-black uppercase tracking-[0.2em] ${
              mandateReady
                ? 'text-[#D4FF00]'
                : 'text-amber-200'
            }`}
          >
            {mandateRibbonText}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-[#D4FF00]/30 bg-[#080d16] p-6 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(212,255,0,0.11),transparent_30%),radial-gradient(circle_at_12%_85%,rgba(34,211,238,0.08),transparent_32%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">

          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.32em] text-[#D4FF00]">
              {copy.eyebrow}
            </p>

            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white md:text-4xl">
              {copy.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              {copy.body}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onDiscoverStartups}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D4FF00] px-5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_24px_rgba(212,255,0,0.22)] transition hover:brightness-110"
              >
                Discover Startups
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onOpenDealDesk}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/45 bg-cyan-400/5 px-5 text-xs font-black uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/10"
              >
                Open Deal Desk
                <Workflow className="h-4 w-4" />
              </button>

              <ExternalLink
                href={MARKETPLACE_URL}
              >
                Private Marketplace
              </ExternalLink>
            </div>
          </div>

          {/* INVESTOR IDENTITY */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-slate-500">
              Investor access
            </p>

            <div className="mt-4 flex items-start gap-3">
              {investorProfileLinked ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#D4FF00]" />
              ) : (
                <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-300" />
              )}

              <div>
                <p className="font-black text-white">
                  {investorProfileLinked
                    ? 'Investor mandate linked'
                    : 'Complete your investor mandate'}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {investorProfileLinked
                    ? `${accountName}, your sector, stage, geography and ticket preferences can follow you into matching and evaluation.`
                    : 'A complete investor profile improves startup ranking and creates a useful decision queue.'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {!investorProfileLinked && (
                <ExternalLink
                  href={INVESTOR_APPLY_URL}
                >
                  Complete Investor Profile
                </ExternalLink>
              )}

              <button
                type="button"
                onClick={onOpenPricing}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-4 text-xs font-black uppercase tracking-wider text-slate-300 hover:border-[#D4FF00]/60 hover:text-[#D4FF00]"
              >
                Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REAL STARTUP SIGNAL */}
      {hasSignal && analysis ? (
        <>
          <section>
            <div className="mb-3">
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-[#D4FF00]">
                Canonical Conversion Signal
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                What the current evidence says.
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
                These are decision-support signals,
                not an investment recommendation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                label="Conversion Score"
                value={scoreText(
                  analysis.conversion_score
                )}
                detail="Evidence-backed Conversion assessment."
              />

              <MetricCard
                label="Fundraise Readiness"
                value={scoreText(
                  analysis.fundraise_readiness
                )}
                detail="How prepared the company is to engage investors."
                tone="text-cyan-300"
              />

              <MetricCard
                label="Investor Fit"
                value={scoreText(
                  analysis.investor_fit
                )}
                detail="Alignment with likely investor profiles and stage."
                tone="text-indigo-300"
              />

              <MetricCard
                label="Risk / Confidence"
                value={`${analysis.risk_level} risk`}
                detail={`AI confidence: ${analysis.confidence_level}`}
                tone={riskTone(
                  analysis.risk_level
                )}
              />
            </div>
          </section>

          {/* PARALLEL ASSESSMENTS */}
          <section className="grid gap-4 xl:grid-cols-2">

            <div className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
              <div className="flex items-center gap-2">
                <GitCompareArrows className="h-5 w-5 text-cyan-300" />

                <div>
                  <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-cyan-300">
                    Independent assessments
                  </p>

                  <h3 className="mt-1 font-black text-white">
                    Three views. Never merged.
                  </h3>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Founder
                  </p>

                  <p className="mt-2 text-xl font-black text-white">
                    {scoreText(
                      analysis.founder_claim_score
                    )}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Founder-declared assessment
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    AI evidence
                  </p>

                  <p className="mt-2 text-xl font-black text-cyan-300">
                    {scoreText(
                      analysis.ai_evidence_score
                    )}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Independent AI interpretation
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    TD Admin
                  </p>

                  <p className="mt-2 text-xl font-black text-[#D4FF00]">
                    {scoreText(tdAdminScore)}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    {verificationText(
                      analysis
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs leading-5 text-slate-300">
                Founder, AI and TD Admin assessments
                remain parallel evidence tracks.
                Investor judgment is independent.
              </div>
            </div>

            {/* INVESTOR SUMMARY */}
            <div className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-[#D4FF00]" />

                <div>
                  <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-[#D4FF00]">
                    Investor summary
                  </p>

                  <h3 className="mt-1 font-black text-white">
                    Decision context
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-300">
                {analysis.investor_summary ||
                  'Investor summary is not yet available for this startup.'}
              </p>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-slate-500">
                  Next best action
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-white">
                  {analysis.next_best_action ||
                    'Continue evidence review.'}
                </p>
              </div>
            </div>
          </section>

          {/* SIGNALS + RISK */}
          <section className="grid gap-4 xl:grid-cols-2">

            <div className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-[#D4FF00]">
                Leading signals
              </p>

              <h3 className="mt-2 text-xl font-black text-white">
                Evidence worth noticing.
              </h3>

              <div className="mt-4 space-y-2">
                {analysis.leading_signals?.length ? (
                  analysis.leading_signals.map(
                    (item, index) => (
                      <div
                        key={`${item.signal}-${index}`}
                        className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-bold text-white">
                            {item.signal}
                          </p>

                          <span className="rounded-md border border-cyan-400/20 bg-cyan-400/5 px-2 py-1 text-[9px] font-black uppercase text-cyan-300">
                            {item.strength}
                          </span>
                        </div>

                        <p className="mt-1 text-[10px] text-slate-500">
                          Evidence status:{' '}
                          {item.evidence_status}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-xs text-slate-500">
                    No leading signals recorded yet.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-amber-300">
                Risk flags
              </p>

              <h3 className="mt-2 text-xl font-black text-white">
                Questions requiring investor attention.
              </h3>

              <div className="mt-4 space-y-2">
                {analysis.risk_flags?.length ? (
                  analysis.risk_flags.map(
                    (flag, index) => (
                      <div
                        key={`${flag}-${index}`}
                        className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs leading-5 text-amber-100"
                      >
                        {flag}
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
                    No current risk flags recorded.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* HANDOFF */}
          <section className="rounded-3xl border border-cyan-400/25 bg-cyan-400/5 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-cyan-300">
                  Deal Desk handoff
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  Convert evidence into an accountable opportunity.
                </h3>

                <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-300">
                  {analysis.deal_desk_recommendation ||
                    'When investor interest is established, move the opportunity into Deal Desk for engagement and execution.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (selectedInvestorStartupId) {
                    onOpenSelectedStartupDealDesk(
                      selectedInvestorStartupId
                    );
                    return;
                  }

                  onOpenDealDesk();
                }}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:brightness-110"
              >
                Open Deal Desk
                <Workflow className="h-4 w-4" />
              </button>
            </div>
          </section>
        </>
      ) : (

        /* EMPTY CANONICAL STATE */
        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">

          <div className="flex items-start gap-4">
            <Eye className="mt-1 h-6 w-6 shrink-0 text-[#D4FF00]" />

            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-[#D4FF00]">
                Canonical startup signal
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Select a startup before evaluating it.
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                No demo portfolio, fabricated score or
                automatic investment verdict is shown here.
                Once a real startup Conversion signal is
                available, its readiness, investor fit,
                risk, confidence and evidence signals
                appear here.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onDiscoverStartups}
                  className="rounded-xl bg-[#D4FF00] px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950"
                >
                  Discover Startups
                </button>

                <button
                  type="button"
                  onClick={onOpenDealDesk}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300"
                >
                  Open Deal Desk
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PLATFORM GUARDRAILS */}
        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-[#D4FF00]">
                Canonical Investor Mandate
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                The mandate you defined in APPLY.
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
                One investor profile follows you across TD Venture.
                Conversion does not ask you to recreate your mandate.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-right">

              <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
                APPLY evidence
              </p>

              <p className="mt-1 text-lg font-black text-[#D4FF00]">
                {investorContext?.evidence?.completion_count || 0}/12
              </p>

            </div>
          </div>


          {investorContextLoading ? (

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-xs text-slate-400">
              Loading your canonical investor mandate...
            </div>

          ) : investorContextError ? (

            <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-xs text-amber-200">
              {investorContextError}
            </div>

          ) : (

            <>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">


                <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">

                  <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-cyan-300">
                    01 · Investment mandate
                  </p>

                  <div className="mt-4 space-y-4 text-xs">

                    <div>
                      <p className="text-slate-500">
                        Sectors
                      </p>
                      <p className="mt-1 font-bold text-white">
                        {mandateValue(
                          'sectors',
                          mandateProfile?.sector
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Stages
                      </p>
                      <p className="mt-1 font-bold text-white">
                        {mandateValue(
                          'stages',
                          mandateProfile?.stage
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Geographies
                      </p>
                      <p className="mt-1 font-bold text-white">
                        {mandateValue(
                          'geographies',
                          mandateProfile?.geography
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Investment thesis
                      </p>
                      <p className="mt-1 leading-5 text-slate-300">
                        {mandateValue(
                          'investment_thesis',
                          mandateProfile?.investment_thesis
                        )}
                      </p>
                    </div>

                  </div>
                </article>


                <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">

                  <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-[#D4FF00]">
                    02 · Capital capacity
                  </p>

                  <div className="mt-4 space-y-4 text-xs">

                    <div className="grid grid-cols-2 gap-3">

                      <div>
                        <p className="text-slate-500">
                          Minimum ticket
                        </p>

                        <p className="mt-1 font-bold text-white">
                          {mandateUsd(
                            mandateAnswers.ticket_min_usd ||
                            mandateProfile?.ticket_min_usd
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">
                          Maximum ticket
                        </p>

                        <p className="mt-1 font-bold text-white">
                          {mandateUsd(
                            mandateAnswers.ticket_max_usd ||
                            mandateProfile?.ticket_max_usd
                          )}
                        </p>
                      </div>

                    </div>

                    <div>
                      <p className="text-slate-500">
                        Follow-on policy
                      </p>

                      <p className="mt-1 leading-5 text-slate-300">
                        {mandateValue(
                          'follow_on_policy'
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Annual deployment capacity
                      </p>

                      <p className="mt-1 font-bold text-white">
                        {mandateUsd(
                          mandateAnswers.annual_deployment_usd
                        )}
                      </p>
                    </div>

                  </div>
                </article>


                <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">

                  <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-purple-300">
                    03 · Decision & engagement
                  </p>

                  <div className="mt-4 space-y-4 text-xs">

                    <div>
                      <p className="text-slate-500">
                        Evaluation criteria
                      </p>

                      <p className="mt-1 leading-5 text-slate-300">
                        {mandateValue(
                          'evaluation_criteria'
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Evidence required
                      </p>

                      <p className="mt-1 leading-5 text-slate-300">
                        {mandateValue(
                          'evidence_required'
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Decision process timeline
                      </p>

                      <p className="mt-1 leading-5 text-slate-300">
                        {mandateValue(
                          'decision_process_timeline'
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Engagement offered
                      </p>

                      <p className="mt-1 leading-5 text-slate-300">
                        {mandateValue(
                          'engagement_offered'
                        )}
                      </p>
                    </div>

                  </div>
                </article>

              </div>


              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-xs leading-5 text-slate-300">

                <strong className="text-cyan-200">
                  Investor context, not investor scoring.
                </strong>{' '}

                Your mandate guides fit and prioritisation.
                Founder, AI and TD Admin assessments remain
                independent signals.

              </div>

            </>

          )}

        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-[#D4FF00]">
                Startup Decision Intelligence
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Read the opportunity before making the decision.
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
                Select a startup already authorised for your investor
                profile. Conversion exposes decision signals—not the
                founder's private working workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadInvestorStartups()}
              disabled={investorStartupsLoading}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-[#D4FF00]/60 hover:text-[#D4FF00] disabled:opacity-40"
            >
              {investorStartupsLoading
                ? 'Refreshing…'
                : 'Refresh opportunities'}
            </button>

          </div>


          {investorStartupsError && (

            <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 text-xs text-rose-300">
              {investorStartupsError}
            </div>

          )}


          {!investorStartupsLoading &&
           !investorStartupsError &&
           investorStartups.length === 0 && (

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">

              <p className="font-bold text-white">
                No authorised startup opportunities yet.
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Discover startups through your existing TD Venture
                investor workflow. Conversion will not create a
                parallel access list.
              </p>

              <button
                type="button"
                onClick={onDiscoverStartups}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#D4FF00] px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950"
              >
                Discover Startups
                <ArrowUpRight className="h-4 w-4" />
              </button>

            </div>

          )}


          {investorStartups.length > 0 && (

            <>
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

                <label className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-slate-500">
                  Selected opportunity
                </label>

                <select
                  value={selectedInvestorStartupId}
                  onChange={event =>
                    setSelectedInvestorStartupId(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-[#080d16] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#D4FF00]/70"
                >
                  {investorStartups.map(item => (

                    <option
                      key={item.startup_id}
                      value={item.startup_id}
                    >
                      {item.startup_name || 'Startup'}
                      {' · '}
                      {item.sector || 'Sector not recorded'}
                      {' · '}
                      {item.stage || 'Stage not recorded'}
                    </option>

                  ))}
                </select>


                {selectedInvestorStartup && (

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Startup
                      </p>
                      <p className="mt-1 text-xs font-bold text-white">
                        {selectedInvestorStartup.startup_name || 'Startup'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Sector
                      </p>
                      <p className="mt-1 text-xs font-bold text-white">
                        {selectedInvestorStartup.sector || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Stage
                      </p>
                      <p className="mt-1 text-xs font-bold text-white">
                        {selectedInvestorStartup.stage || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Match Fit
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#D4FF00]">
                        {selectedInvestorStartup.match_score == null
                          ? '—'
                          : `${Math.round(
                              selectedInvestorStartup.match_score
                            )}/100`}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Identity boundary
                      </p>
                      <p className="mt-1 text-xs font-bold text-white">
                        {selectedInvestorStartup.revealed
                          ? 'Revealed'
                          : 'Protected'}
                      </p>
                    </div>

                  </div>

                )}

              </div>


              {investorSignalLoading ? (

                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-xs text-slate-400">
                  Loading current Conversion intelligence...
                </div>

              ) : investorSignalError ? (

                <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-xs text-amber-200">
                  {investorSignalError}
                </div>

              ) : !currentInvestorSignal ? (

                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">

                  <p className="font-bold text-white">
                    No current Conversion signal for this startup.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    The match remains available, but Conversion will
                    not invent readiness, fit, confidence or risk
                    values until a canonical startup analysis exists.
                  </p>

                </div>

              ) : (

                <>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                    {[
                      [
                        'Conversion Score',
                        decisionScore('conversion_score')
                      ],
                      [
                        'Fundraise Readiness',
                        decisionScore('fundraise_readiness')
                      ],
                      [
                        'Investor Fit',
                        decisionScore('investor_fit')
                      ],
                      [
                        'Confidence',
                        currentInvestorSignal.confidence_level || '—'
                      ],
                      [
                        'Risk',
                        currentInvestorSignal.risk_level || '—'
                      ]
                    ].map(([label, value]) => (

                      <div
                        key={label}
                        className="rounded-2xl border border-slate-800 bg-slate-950/65 p-4"
                      >
                        <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
                          {label}
                        </p>

                        <p className="mt-2 text-lg font-black text-white">
                          {value}
                        </p>
                      </div>

                    ))}

                  </div>


                  <div className="mt-4 grid gap-4 lg:grid-cols-2">

                    <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">

                      <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-cyan-300">
                        Leading signals
                      </p>

                      <div className="mt-4 space-y-3">

                        {currentInvestorSignal.leading_signals?.length ? (

                          currentInvestorSignal.leading_signals.map(
                            (item, index) => (

                              <div
                                key={`${item.signal || 'signal'}-${index}`}
                                className="rounded-xl border border-slate-800 bg-[#080d16] p-3"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">

                                  <p className="text-xs font-bold text-white">
                                    {item.signal || 'Signal'}
                                  </p>

                                  <span className="text-[9px] font-mono uppercase text-[#D4FF00]">
                                    {item.strength || 'Recorded'}
                                  </span>

                                </div>

                                {item.evidence_status && (
                                  <p className="mt-1 text-[10px] text-slate-500">
                                    Evidence: {item.evidence_status}
                                  </p>
                                )}

                              </div>

                            )
                          )

                        ) : (

                          <p className="text-xs text-slate-500">
                            No leading signals recorded.
                          </p>

                        )}

                      </div>

                    </article>


                    <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">

                      <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-amber-300">
                        Risk & evidence gaps
                      </p>

                      <div className="mt-4 space-y-4">

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Risk flags
                          </p>

                          {currentInvestorSignal.risk_flags?.length ? (

                            <ul className="mt-2 space-y-1 text-xs text-slate-300">
                              {currentInvestorSignal.risk_flags.map(
                                (flag, index) => (
                                  <li key={`${flag}-${index}`}>
                                    • {flag}
                                  </li>
                                )
                              )}
                            </ul>

                          ) : (

                            <p className="mt-2 text-xs text-slate-500">
                              No current risk flags.
                            </p>

                          )}
                        </div>


                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Missing evidence
                          </p>

                          {currentInvestorSignal.missing_evidence?.length ? (

                            <p className="mt-2 text-xs text-slate-300">
                              {
                                currentInvestorSignal
                                  .missing_evidence.length
                              } evidence item(s) remain open.
                            </p>

                          ) : (

                            <p className="mt-2 text-xs text-slate-500">
                              No missing-evidence items recorded.
                            </p>

                          )}
                        </div>

                      </div>

                    </article>

                  </div>


                  <div className="mt-4 grid gap-4 lg:grid-cols-2">

                    <article className="rounded-2xl border border-[#D4FF00]/20 bg-[#D4FF00]/5 p-5">

                      <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-[#D4FF00]">
                        Investor summary
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-200">
                        {currentInvestorSignal.investor_summary ||
                          'No investor summary recorded.'}
                      </p>

                    </article>


                    <article className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

                      <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-cyan-300">
                        Next best action
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-200">
                        {currentInvestorSignal.next_best_action ||
                          currentInvestorSignal.deal_desk_recommendation ||
                          'Continue evidence review.'}
                      </p>

                    </article>

                  </div>


                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/65 p-4">

                    <p className="max-w-3xl text-[11px] leading-5 text-slate-400">
                      Investor-safe projection only. Founder private
                      workspace, raw evidence, application snapshots
                      and contact details are not exposed here.
                    </p>

                    <button
                      type="button"
                      onClick={onOpenDealDesk}
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#D4FF00] px-4 text-xs font-black uppercase tracking-wider text-slate-950"
                    >
                      Open Deal Desk
                      <Workflow className="h-4 w-4" />
                    </button>

                  </div>

                </>

              )}

            </>

          )}

        </section>

      <section className="grid gap-4 md:grid-cols-3">

        <MetricCard
          label="Independent Evidence"
          value="Founder · AI · TD Admin"
          detail="Parallel assessments remain distinct."
          tone="text-cyan-300"
        />

        <MetricCard
          label="Qualification Guardrail"
          value="Deal Desk"
          detail="Opportunity qualification is computed from canonical Match Fit, Conversion and independent Diamond inputs — not a hard-coded investor score."
        />

        <MetricCard
          label="Reveal Boundary"
          value="Identity protected"
          detail="Conversion evidence does not bypass Marketplace reveal and access rules."
          tone="text-amber-300"
        />
      </section>

      {/* INVESTOR MANDATE FRAMEWORK */}
      <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">

        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">

          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-[#D4FF00]">
              Investor mandate
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Four decision lenses · twelve investor signals.
            </h2>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
              Missing information stays Awaiting.
              Awaiting is not a negative assessment and
              never changes a startup's canonical score.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <div className="rounded-xl border border-[#D4FF00]/25 bg-[#D4FF00]/5 px-4 py-3">
              <p className="text-[9px] font-mono font-black uppercase tracking-[0.18em] text-slate-500">
                Mandate Readiness
              </p>

              <p className="mt-1 text-xl font-black text-[#D4FF00]">
                {mandateCompletion}/12
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                {mandateReadiness}% supplied
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3">
              <p className="text-[9px] font-mono font-black uppercase tracking-[0.18em] text-slate-500">
                Awaiting
              </p>

              <p
                className={`mt-1 text-xl font-black ${
                  mandateAwaiting === 0
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }`}
              >
                {mandateAwaiting}
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                investor signals
              </p>
            </div>

          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          {mandateBuckets.map(
            bucket => {

              const Icon =
                bucket.icon;

              const stateTone =
                bucket.state ===
                'Supported'
                  ? 'text-emerald-300'
                  : bucket.state ===
                      'Partial'
                    ? 'text-amber-300'
                    : 'text-slate-500';

              return (
                <article
                  key={bucket.number}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
                >

                  <div className="flex items-center justify-between gap-3">

                    <span className="font-mono text-xs font-black text-[#D4FF00]">
                      {bucket.number}
                    </span>

                    <Icon className="h-5 w-5 text-slate-500" />

                  </div>

                  <h3 className="mt-4 font-black text-white">
                    {bucket.label}
                  </h3>

                  <div className="mt-2 flex items-center justify-between gap-2">

                    <span
                      className={`text-[10px] font-mono font-black uppercase tracking-wider ${stateTone}`}
                    >
                      {bucket.state}
                    </span>

                    <span className="text-[10px] font-mono text-slate-500">
                      {bucket.supplied}/3 supplied
                    </span>

                  </div>

                  <div className="mt-4 space-y-3">

                    {bucket.fields.map(
                      field => {

                        const value =
                          effectiveMandateAnswers[
                            field
                          ];

                        const supplied =
                          value.trim()
                            .length > 0;

                        return (
                          <div
                            key={field}
                            className="rounded-xl border border-slate-800/80 bg-[#080d16] p-3"
                          >

                            <div className="flex items-start justify-between gap-2">

                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {
                                  mandateSignalLabels[
                                    field
                                  ]
                                }
                              </p>

                              <span
                                className={`shrink-0 text-[9px] font-mono font-black uppercase ${
                                  supplied
                                    ? 'text-emerald-300'
                                    : 'text-amber-300'
                                }`}
                              >
                                {supplied
                                  ? 'Supplied'
                                  : 'Awaiting'}
                              </span>

                            </div>

                            <p
                              className={`mt-2 max-h-16 overflow-hidden text-[11px] leading-5 ${
                                supplied
                                  ? 'text-slate-300'
                                  : 'italic text-slate-600'
                              }`}
                            >
                              {supplied
                                ? value
                                : 'Awaiting investor input'}
                            </p>

                          </div>
                        );
                      }
                    )}

                  </div>

                </article>
              );
            }
          )}

        </div>

        <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 md:flex-row md:items-center">

          <div className="flex items-start gap-3">

            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

            <div>
              <p className="text-xs font-black text-cyan-100">
                More evidence improves precision — not investor quality.
              </p>

              <p className="mt-1 max-w-3xl text-[11px] leading-5 text-slate-400">
                TD Venture uses supplied mandate signals
                to improve opportunity relevance and
                founder pitch guidance. Missing signals
                remain Awaiting. Investor judgment
                remains sovereign.
              </p>
            </div>

          </div>

          {!mandateReady && (
            <a
              href={INVESTOR_APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4FF00] px-4 text-[10px] font-black uppercase tracking-wider text-slate-950 transition hover:brightness-110"
            >
              Complete mandate
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}

        </div>

      </section>

    </div>
  );
}

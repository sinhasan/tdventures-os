import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Compass,
  FileSearch,
  RefreshCw,
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


import InvestorDecisionIntelligencePanel from './InvestorDecisionIntelligencePanel';

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


type MandateKey =
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


type BucketId =
  | 'thesis'
  | 'market'
  | 'operating'
  | 'capital';


type QuestionDefinition = {
  number: number;
  key: MandateKey;
  bucket: BucketId;
  label: string;
  prompt: string;
};


type BucketDefinition = {
  id: BucketId;
  number: string;
  label: string;
  fields: MandateKey[];
  guidance: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};


const INVESTOR_APPLY_URL =
  'https://tdventure.vc/signup/investor';


const QUESTIONS: QuestionDefinition[] = [
  {
    number: 1,
    key: 'investment_thesis',
    bucket: 'thesis',
    label: 'Investment thesis',
    prompt:
      'What businesses do you back, avoid, and why?'
  },
  {
    number: 2,
    key: 'founder_qualities',
    bucket: 'thesis',
    label: 'Founder qualities',
    prompt:
      'What founder characteristics create conviction?'
  },
  {
    number: 3,
    key: 'pursuit_criteria',
    bucket: 'thesis',
    label: 'Pursuit criteria',
    prompt:
      'What makes you pursue an opportunity despite visible risks?'
  },

  {
    number: 4,
    key: 'market_opportunity',
    bucket: 'market',
    label: 'Market opportunity',
    prompt:
      'What market characteristics make an opportunity attractive?'
  },
  {
    number: 5,
    key: 'moat_expectation',
    bucket: 'market',
    label: 'Moat expectation',
    prompt:
      'What constitutes credible defensibility?'
  },
  {
    number: 6,
    key: 'market_risks',
    bucket: 'market',
    label: 'Market risks',
    prompt:
      'What competitive, regulatory or structural conditions concern you?'
  },

  {
    number: 7,
    key: 'traction_expectation',
    bucket: 'operating',
    label: 'Traction expectation',
    prompt:
      'What traction do you expect relative to stage?'
  },
  {
    number: 8,
    key: 'economics_expectation',
    bucket: 'operating',
    label: 'Economics expectation',
    prompt:
      'What revenue, margin or unit-economics evidence matters?'
  },
  {
    number: 9,
    key: 'evidence_required',
    bucket: 'operating',
    label: 'Evidence required',
    prompt:
      'What evidence must exist before deeper diligence?'
  },

  {
    number: 10,
    key: 'capital_strategy',
    bucket: 'capital',
    label: 'Capital strategy',
    prompt:
      'How do you think about initial deployment and follow-on capital?'
  },
  {
    number: 11,
    key: 'capital_outcomes',
    bucket: 'capital',
    label: 'Capital outcomes',
    prompt:
      'What should invested capital accomplish and what milestones matter?'
  },
  {
    number: 12,
    key: 'decision_engagement',
    bucket: 'capital',
    label: 'Decision & engagement',
    prompt:
      'How do you evaluate, decide and engage after investment?'
  }
];


const BUCKETS: BucketDefinition[] = [
  {
    id: 'thesis',
    number: '01',
    label: 'Thesis & Founder Fit',
    fields: [
      'investment_thesis',
      'founder_qualities',
      'pursuit_criteria'
    ],
    guidance:
      'A founder should explain why this problem matters, why this team is unusually suited to solve it, and why the opportunity deserves pursuit even when visible risks remain.',
    icon: Target
  },
  {
    id: 'market',
    number: '02',
    label: 'Market & Moat',
    fields: [
      'market_opportunity',
      'moat_expectation',
      'market_risks'
    ],
    guidance:
      'A founder should show the shape and quality of the market, how defensibility can develop, and demonstrate awareness of competitive, regulatory and structural threats.',
    icon: Compass
  },
  {
    id: 'operating',
    number: '03',
    label: 'Operating Evidence',
    fields: [
      'traction_expectation',
      'economics_expectation',
      'evidence_required'
    ],
    guidance:
      'A founder should present stage-appropriate traction, explain the economics that matter, and support important claims with evidence the investor can inspect.',
    icon: FileSearch
  },
  {
    id: 'capital',
    number: '04',
    label: 'Capital & Return Readiness',
    fields: [
      'capital_strategy',
      'capital_outcomes',
      'decision_engagement'
    ],
    guidance:
      'A founder should connect capital requested to measurable milestones, explain what success looks like after deployment, and make the diligence and engagement path easy to understand.',
    icon: Scale
  }
];


const VIEW_COPY: Record<
  InvestorDecisionView,
  {
    eyebrow: string;
    title: string;
    body: string;
  }
> = {
  dashboard: {
    eyebrow: 'Investor Terminal',
    title: 'Your investment lens at a glance.',
    body:
      'Mandate readiness, decision lenses, opportunity context and the next action — without repeating the detailed workspaces.'
  },

  investor_discover: {
    eyebrow: '01 · Investment Mandate',
    title: 'Twelve questions define how you look at opportunity.',
    body:
      'Each answer remains an independent investor signal. Missing information stays Awaiting. The four decision lenses are derived only after the twelve questions.'
  },

  investor_matches: {
    eyebrow: '02 · Founder Pitch Lens',
    title: 'Turn your mandate into guidance founders can respond to.',
    body:
      'The same investor signals are translated into what a founder should prove. This is guidance, not investor scoring and not a prediction of investment outcome.'
  },

  investor_framework: {
    eyebrow: '03 · Startup Fit',
    title: 'Compare a real startup signal with your investment lens.',
    body:
      'Canonical startup scores remain unchanged. Investor Match Fit, Conversion evidence, risks and mandate context are displayed separately.'
  },

  investor_execution: {
    eyebrow: '04 · Decision & Execution',
    title: 'Move from evidence to an accountable next action.',
    body:
      'Review risk, missing evidence, investor context and the next best action before moving an opportunity into Deal Desk.'
  }
};


function cleanText(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value).trim();
}


function shortText(
  value: string,
  max = 220
): string {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max).trim()}…`;
}


function money(
  value: unknown
): string {
  const numeric = Number(value);

  if (
    !Number.isFinite(numeric) ||
    numeric <= 0
  ) {
    return 'Awaiting';
  }

  return `USD ${numeric.toLocaleString()}`;
}


function scoreText(
  value: unknown
): string {
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
    return value.trim();
  }

  return 'Awaiting';
}


function SectionHeader({
  eyebrow,
  title,
  body
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-[#D4FF00]">
        {eyebrow}
      </p>

      <h1 className="mt-2 text-2xl font-black text-white md:text-3xl">
        {title}
      </h1>

      <p className="mt-3 max-w-4xl text-xs leading-5 text-slate-400">
        {body}
      </p>
    </div>
  );
}


function Metric({
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
    <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">
      <p className="text-[9px] font-mono font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className={`mt-2 text-xl font-black ${tone}`}>
        {value}
      </p>

      <p className="mt-2 text-[11px] leading-5 text-slate-400">
        {detail}
      </p>
    </article>
  );
}


function ScopeCard({
  profile
}: {
  profile: any;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
      <div>
        <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-cyan-300">
          Structured mandate scope
        </p>

        <h2 className="mt-2 text-xl font-black text-white">
          Where you invest.
        </h2>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          [
            'Sector',
            cleanText(profile?.sector) || 'Awaiting'
          ],
          [
            'Stage',
            cleanText(profile?.stage) || 'Awaiting'
          ],
          [
            'Geography',
            cleanText(profile?.geography) || 'Awaiting'
          ],
          [
            'Minimum ticket',
            money(profile?.ticket_min_usd)
          ],
          [
            'Maximum ticket',
            money(profile?.ticket_max_usd)
          ]
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-800 bg-slate-950/65 p-4"
          >
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              {label}
            </p>

            <p className="mt-2 text-xs font-bold leading-5 text-slate-200">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}


function QuestionCard({
  question,
  value
}: {
  question: QuestionDefinition;
  value: string;
}) {
  const supplied = Boolean(value);

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#D4FF00]/30 bg-[#D4FF00]/5 font-mono text-xs font-black text-[#D4FF00]">
            {String(question.number).padStart(2, '0')}
          </div>

          <div>
            <p className="text-xs font-black text-white">
              {question.label}
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-400">
              {question.prompt}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-mono font-black uppercase tracking-wider ${
            supplied
              ? 'border-emerald-400/25 bg-emerald-400/5 text-emerald-300'
              : 'border-amber-400/25 bg-amber-400/5 text-amber-300'
          }`}
        >
          {supplied ? 'Supplied' : 'Awaiting'}
        </span>
      </div>

      <div className="mt-4 border-t border-slate-800 pt-4">
        {supplied ? (
          <p className="text-sm leading-6 text-slate-200">
            {value}
          </p>
        ) : (
          <p className="text-sm italic text-slate-600">
            Awaiting investor input
          </p>
        )}
      </div>
    </article>
  );
}


function BucketCards({
  answers
}: {
  answers: Record<MandateKey, string>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {BUCKETS.map(bucket => {
        const Icon = bucket.icon;

        const supplied =
          bucket.fields.filter(
            field =>
              Boolean(
                cleanText(answers[field])
              )
          ).length;

        const state =
          supplied === 3
            ? 'Supported'
            : supplied > 0
              ? 'Partial'
              : 'Awaiting';

        const tone =
          state === 'Supported'
            ? 'text-emerald-300'
            : state === 'Partial'
              ? 'text-amber-300'
              : 'text-slate-500';

        return (
          <article
            key={bucket.id}
            className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5"
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

            <div className="mt-2 flex items-center justify-between">
              <span
                className={`text-[10px] font-mono font-black uppercase tracking-wider ${tone}`}
              >
                {state}
              </span>

              <span className="text-[10px] font-mono text-slate-500">
                {supplied}/3 signals
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {bucket.fields.map(field => {
                const q =
                  QUESTIONS.find(
                    item => item.key === field
                  );

                const value =
                  cleanText(answers[field]);

                return (
                  <div
                    key={field}
                    className="rounded-xl border border-slate-800/80 bg-[#080d16] px-3 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {q?.label || field}
                      </p>

                      <span
                        className={`text-[9px] font-mono uppercase ${
                          value
                            ? 'text-emerald-300'
                            : 'text-amber-300'
                        }`}
                      >
                        {value
                          ? 'Supplied'
                          : 'Awaiting'}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                      {value
                        ? shortText(value, 180)
                        : 'Awaiting investor input'}
                    </p>
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </div>
  );
}


export function InvestorDecisionWorkspace({
  view,
  accountName,
  investorProfileLinked,
  analysis: _analysis,
  onDiscoverStartups,
  onOpenDealDesk,
  onOpenSelectedStartupDealDesk,
  onOpenPricing: _onOpenPricing
}: InvestorDecisionWorkspaceProps) {

  const copy =
    VIEW_COPY[view];

  const [
    investorContext,
    setInvestorContext
  ] = useState<
    InvestorConversionContextResponse | null
  >(null);

  const [
    investorContextLoading,
    setInvestorContextLoading
  ] = useState(true);

  const [
    investorContextError,
    setInvestorContextError
  ] = useState('');


  const [
    investorStartups,
    setInvestorStartups
  ] = useState<
    InvestorConversionStartup[]
  >([]);

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
  ] = useState<
    InvestorSafeSignalResponse | null
  >(null);

  const [
    investorSignalLoading,
    setInvestorSignalLoading
  ] = useState(false);

  const [
    investorSignalError,
    setInvestorSignalError
  ] = useState('');

  const [
    refreshing,
    setRefreshing
  ] = useState(false);

  const [
    lastRefreshedAt,
    setLastRefreshedAt
  ] = useState('');


  useEffect(() => {
    let mounted = true;

    async function loadContext() {
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

    void loadContext();

    return () => {
      mounted = false;
    };
  }, []);


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

      return rows;
    } catch (error) {
      setInvestorStartupsError(
        error instanceof Error
          ? error.message
          : 'Investor startup queue could not be loaded.'
      );

      return [];
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
              : 'Startup Conversion signal could not be loaded.'
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


  const profile =
    (investorContext?.profile || {}) as any;

  const evidence =
    (investorContext?.evidence || {}) as any;

  const rawAnswers =
    (evidence?.answers || {}) as
      Record<string, unknown>;

  const rubricVersion =
    cleanText(
      evidence?.rubric_version
    );


  const answers =
    useMemo(() => {

      const direct = (
        key: string
      ) =>
        cleanText(
          rawAnswers[key]
        );

      const v2 =
        rubricVersion ===
        'investor-evidence-v2';

      const decisionLegacy = [
        direct(
          'decision_process_timeline'
        ),
        direct(
          'engagement_offered'
        )
      ]
        .filter(Boolean)
        .join(' · ');

      const result:
        Record<MandateKey, string> = {

          investment_thesis:
            direct(
              'investment_thesis'
            ) ||
            cleanText(
              profile?.investment_thesis
            ),

          founder_qualities:
            v2
              ? direct(
                  'founder_qualities'
                )
              : '',

          pursuit_criteria:
            v2
              ? direct(
                  'pursuit_criteria'
                )
              : '',

          market_opportunity:
            v2
              ? direct(
                  'market_opportunity'
                )
              : '',

          moat_expectation:
            v2
              ? direct(
                  'moat_expectation'
                )
              : '',

          market_risks:
            v2
              ? direct(
                  'market_risks'
                )
              : '',

          traction_expectation:
            v2
              ? direct(
                  'traction_expectation'
                )
              : '',

          economics_expectation:
            v2
              ? direct(
                  'economics_expectation'
                )
              : '',

          evidence_required:
            direct(
              'evidence_required'
            ),

          capital_strategy:
            v2
              ? direct(
                  'capital_strategy'
                )
              : direct(
                  'follow_on_policy'
                ),

          capital_outcomes:
            v2
              ? direct(
                  'capital_outcomes'
                )
              : '',

          decision_engagement:
            v2
              ? direct(
                  'decision_engagement'
                )
              : decisionLegacy
        };

      return result;

    }, [
      rawAnswers,
      rubricVersion,
      profile?.investment_thesis
    ]);


  const mandateCompletion =
    Object.values(
      answers
    ).filter(Boolean).length;

  const mandateAwaiting =
    Math.max(
      0,
      12 - mandateCompletion
    );

  const supportedBuckets =
    BUCKETS.filter(
      bucket =>
        bucket.fields.every(
          field =>
            Boolean(
              answers[field]
            )
        )
    ).length;


  const selectedStartup =
    (
      investorStartups.find(
        item =>
          item.startup_id ===
          selectedInvestorStartupId
      ) || null
    ) as any;

  const currentSignal =
    (
      investorStartupSignal?.signal ||
      null
    ) as any;

  const currentScores =
    (
      currentSignal?.scores ||
      {}
    ) as Record<string, unknown>;

  const leadingSignals =
    Array.isArray(
      currentSignal?.leading_signals
    )
      ? currentSignal.leading_signals
      : [];

  const riskFlags =
    Array.isArray(
      currentSignal?.risk_flags
    )
      ? currentSignal.risk_flags
      : [];

  const missingEvidence =
    Array.isArray(
      currentSignal?.missing_evidence
    )
      ? currentSignal.missing_evidence
      : [];

  const missingEvidenceText = (
    value: unknown
  ): string => {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      const record =
        value as Record<string, unknown>;

      const primary =
        record.item ??
        record.label ??
        record.detail ??
        record.issue ??
        record.field;

      if (
        primary !== undefined &&
        primary !== null
      ) {
        const label = cleanText(primary);

        const priority =
          typeof record.priority === 'string'
            ? record.priority.trim()
            : '';

        return priority
          ? `${label} · ${priority} priority`
          : label;
      }
    }

    return cleanText(value);
  };


  async function refreshOpportunityData() {
    setRefreshing(true);

    try {
      const rows =
        await loadInvestorStartups();

      const target =
        selectedInvestorStartupId &&
        rows.some(
          item =>
            item.startup_id ===
            selectedInvestorStartupId
        )
          ? selectedInvestorStartupId
          : rows[0]?.startup_id || '';

      if (target) {
        const result =
          await getInvestorStartupSignal(
            target
          );

        setInvestorStartupSignal(result);
      }

      setLastRefreshedAt(
        new Date().toLocaleTimeString()
      );
    } finally {
      setRefreshing(false);
    }
  }


  const StartupSelector = () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">
      <label className="text-[9px] font-mono font-black uppercase tracking-[0.18em] text-slate-500">
        Startup
      </label>

      <select
        value={
          selectedInvestorStartupId
        }
        onChange={event =>
          setSelectedInvestorStartupId(
            event.target.value
          )
        }
        className="mt-2 w-full rounded-xl border border-slate-700 bg-[#080d16] px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]/60"
      >
        {investorStartups.length === 0 && (
          <option value="">
            No startup available
          </option>
        )}

        {investorStartups.map(item => {
          const row = item as any;

          return (
            <option
              key={item.startup_id}
              value={item.startup_id}
            >
              {
                cleanText(
                  row.startup_name
                ) ||
                cleanText(row.name) ||
                item.startup_id
              }
            </option>
          );
        })}
      </select>

      {investorStartupsLoading && (
        <p className="mt-2 text-[10px] text-slate-500">
          Loading opportunity records...
        </p>
      )}

      {investorStartupsError && (
        <p className="mt-2 text-[10px] text-rose-300">
          {investorStartupsError}
        </p>
      )}
    </div>
  );


  /*
   * VIEW 0 — INVESTOR TERMINAL
   */
  if (view === 'dashboard') {
    return (
      <div className="space-y-5 animate-fade-in">

        <section className="rounded-3xl border border-[#D4FF00]/25 bg-[#080d16] p-6">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            body={copy.body}
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Mandate readiness"
              value={`${mandateCompletion}/12`}
              detail={
                mandateAwaiting
                  ? `${mandateAwaiting} investor signals Awaiting.`
                  : 'Full investor mandate supplied.'
              }
            />

            <Metric
              label="Decision lenses"
              value={`${supportedBuckets}/4`}
              detail="Buckets fully supported by supplied investor signals."
              tone="text-cyan-300"
            />

            <Metric
              label="Opportunity records"
              value={String(
                investorStartups.length
              )}
              detail="Canonical startup records available to this investor workspace."
              tone="text-violet-300"
            />

            <Metric
              label="Profile plane"
              value={
                investorProfileLinked
                  ? 'Linked'
                  : 'Awaiting'
              }
              detail="Identity and profile remain separate from investor judgment."
              tone={
                investorProfileLinked
                  ? 'text-emerald-300'
                  : 'text-amber-300'
              }
            />
          </div>
        </section>

        <ScopeCard
          profile={profile}
        />

        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-[#D4FF00]">
                Four decision lenses
              </p>

              <h2 className="mt-2 text-xl font-black text-white">
                Derived from the twelve mandate questions.
              </h2>
            </div>

            <p className="text-[10px] text-slate-500">
              Missing = Awaiting · not negative
            </p>
          </div>

          <div className="mt-5">
            <BucketCards
              answers={answers}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-cyan-300">
            Next action
          </p>

          <p className="mt-2 text-sm font-bold text-white">
            {mandateCompletion < 12
              ? `Complete the remaining ${mandateAwaiting} mandate signal${mandateAwaiting === 1 ? '' : 's'} to improve opportunity precision.`
              : selectedStartup
                ? 'Your mandate is ready. Review Startup Fit before moving into Decision & Execution.'
                : 'Your mandate is ready. Select a startup in Startup Fit.'}
          </p>

          <p className="mt-2 text-[11px] leading-5 text-slate-400">
            More investor evidence improves precision.
            It does not make the investor better and it
            does not change a startup's canonical score.
          </p>
        </section>

      </div>
    );
  }


  /*
   * VIEW 1 — INVESTMENT MANDATE
   */
  if (view === 'investor_discover') {
    return (
      <div className="space-y-5 animate-fade-in">

        <section className="rounded-3xl border border-[#D4FF00]/25 bg-[#080d16] p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <SectionHeader
              eyebrow={copy.eyebrow}
              title={copy.title}
              body={copy.body}
            />

            <div className="shrink-0 rounded-2xl border border-[#D4FF00]/25 bg-[#D4FF00]/5 px-5 py-4">
              <p className="text-[9px] font-mono font-black uppercase tracking-[0.18em] text-slate-500">
                Mandate readiness
              </p>

              <p className="mt-1 text-2xl font-black text-[#D4FF00]">
                {mandateCompletion}/12
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                {mandateAwaiting} Awaiting
              </p>
            </div>
          </div>
        </section>

        <ScopeCard
          profile={profile}
        />

        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-[#D4FF00]">
              Twelve investor questions
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              One question · one answer · one signal.
            </h2>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
              These are shown sequentially rather than
              compressed into three columns. Historical
              V1 information is reused only where the
              meaning is directly compatible.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {QUESTIONS.map(question => (
              <QuestionCard
                key={question.key}
                question={question}
                value={
                  answers[
                    question.key
                  ]
                }
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-cyan-300">
            Derived mandate
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Four lenses derived from the twelve answers.
          </h2>

          <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
            The bucket is the synthesis layer.
            It never replaces the original investor answer.
          </p>

          <div className="mt-5">
            <BucketCards
              answers={answers}
            />
          </div>

          {mandateCompletion < 12 && (
            <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-black text-amber-200">
                  {mandateAwaiting} signal{mandateAwaiting === 1 ? '' : 's'} Awaiting.
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Complete the investor mandate to improve
                  opportunity relevance and founder pitch guidance.
                </p>
              </div>

              <a
                href={INVESTOR_APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4FF00] px-4 text-[10px] font-black uppercase tracking-wider text-slate-950"
              >
                Complete mandate
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </section>

      </div>
    );
  }


  /*
   * VIEW 2 — FOUNDER PITCH LENS
   */
  if (view === 'investor_matches') {
    return (
      <div className="space-y-5 animate-fade-in">

        <section className="rounded-3xl border border-[#D4FF00]/25 bg-[#080d16] p-6">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            body={copy.body}
          />
        </section>

        <div className="space-y-4">
          {BUCKETS.map(bucket => {
            const Icon = bucket.icon;

            const supplied =
              bucket.fields.filter(
                field =>
                  Boolean(
                    answers[field]
                  )
              ).length;

            return (
              <section
                key={bucket.id}
                className="rounded-3xl border border-slate-800 bg-[#080d16] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#D4FF00]/25 bg-[#D4FF00]/5">
                    <Icon className="h-5 w-5 text-[#D4FF00]" />
                  </div>

                  <div>
                    <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-[#D4FF00]">
                      {bucket.number} · {supplied}/3 investor signals
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      {bucket.label}
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-2">
                  <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">
                    <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-cyan-300">
                      Investor lens
                    </p>

                    <div className="mt-4 space-y-4">
                      {bucket.fields.map(field => {
                        const question =
                          QUESTIONS.find(
                            q => q.key === field
                          );

                        const value =
                          answers[field];

                        return (
                          <div key={field}>
                            <div className="flex justify-between gap-3">
                              <p className="text-xs font-bold text-white">
                                {question?.label}
                              </p>

                              <span
                                className={`text-[9px] font-mono uppercase ${
                                  value
                                    ? 'text-emerald-300'
                                    : 'text-amber-300'
                                }`}
                              >
                                {value
                                  ? 'Supplied'
                                  : 'Awaiting'}
                              </span>
                            </div>

                            <p className="mt-1 text-[11px] leading-5 text-slate-400">
                              {value ||
                                'Awaiting investor input'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </article>

                  <article className="rounded-2xl border border-[#D4FF00]/20 bg-[#D4FF00]/5 p-5">
                    <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-[#D4FF00]">
                      What a founder should prove
                    </p>

                    <p className="mt-4 text-sm leading-6 text-slate-200">
                      {bucket.guidance}
                    </p>

                    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <p className="text-[10px] leading-5 text-slate-400">
                        This guidance is derived from the investor
                        decision lens. It is not a promise of funding
                        and does not alter the startup assessment.
                      </p>
                    </div>
                  </article>
                </div>
              </section>
            );
          })}
        </div>

      </div>
    );
  }


  /*
   * VIEW 3 — STARTUP FIT
   */
  if (view === 'investor_framework') {
    return (
      <div className="space-y-5 animate-fade-in">

        <section className="rounded-3xl border border-[#D4FF00]/25 bg-[#080d16] p-6">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            body={copy.body}
          />
        </section>

        <StartupSelector />

              <InvestorDecisionIntelligencePanel
                intelligence={
                  investorStartupSignal
                    ?.decision_intelligence
                    ?? null
                }
              />

        {investorSignalLoading ? (
          <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-8 text-center">
            <p className="text-sm text-slate-400">
              Loading canonical startup intelligence...
            </p>
          </section>
        ) : investorSignalError ? (
          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6">
            <p className="text-sm text-rose-200">
              {investorSignalError}
            </p>
          </section>
        ) : !selectedStartup ? (
          <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-8 text-center">
            <p className="text-sm text-slate-400">
              Select a startup to compare its canonical signal
              with your mandate.
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric
                label="Match Fit"
                value={scoreText(
                  selectedStartup?.match_score
                )}
                detail="Investor-specific Match Fit. Separate from the startup canonical score."
              />

              <Metric
                label="Conversion Score"
                value={scoreText(
                  currentScores.conversion_score
                )}
                detail="Canonical startup Conversion assessment."
                tone="text-cyan-300"
              />

              <Metric
                label="Fundraise Readiness"
                value={scoreText(
                  currentScores.fundraise_readiness
                )}
                detail="Startup readiness signal."
                tone="text-violet-300"
              />

              <Metric
                label="Investor Fit Signal"
                value={scoreText(
                  currentScores.investor_fit
                )}
                detail="Existing startup intelligence. It does not rewrite canonical scoring."
                tone="text-amber-300"
              />
            </section>

            <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.24em] text-[#D4FF00]">
                Your four investor lenses
              </p>

              <h2 className="mt-2 text-xl font-black text-white">
                Compare the mandate with the startup evidence.
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
                No artificial bucket score is invented here.
                Investor mandate and startup intelligence remain
                visible as separate evidence layers.
              </p>

              <div className="mt-5">
                <BucketCards
                  answers={answers}
                />
              </div>
            </section>

            <div className="grid gap-4 xl:grid-cols-2">
              <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-cyan-300">
                  Canonical leading signals
                </p>

                {leadingSignals.length ? (
                  <div className="mt-4 space-y-3">
                    {leadingSignals.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="rounded-xl border border-slate-800 bg-slate-950/65 p-4"
                        >
                          <div className="flex justify-between gap-3">
                            <p className="text-xs font-bold text-white">
                              {
                                cleanText(
                                  item?.signal
                                ) ||
                                cleanText(
                                  item?.label
                                ) ||
                                'Signal'
                              }
                            </p>

                            <span className="text-[9px] font-mono uppercase text-[#D4FF00]">
                              {
                                cleanText(
                                  item?.strength
                                ) ||
                                'Recorded'
                              }
                            </span>
                          </div>

                          {item?.evidence_status && (
                            <p className="mt-2 text-[10px] text-slate-500">
                              Evidence: {
                                cleanText(
                                  item.evidence_status
                                )
                              }
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Awaiting canonical leading signals.
                  </p>
                )}
              </section>

              <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-amber-300">
                  Risk & evidence
                </p>

                <div className="mt-4">
                  <p className="text-xs font-bold text-white">
                    Risk flags
                  </p>

                  {riskFlags.length ? (
                    <div className="mt-2 space-y-2">
                      {riskFlags.map(
                        (flag: any, index: number) => (
                          <div
                            key={index}
                            className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs leading-5 text-amber-100"
                          >
                            {cleanText(flag)}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      No current risk flags recorded.
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold text-white">
                    Missing evidence
                  </p>

                  {missingEvidence.length ? (
                    <div className="mt-2 space-y-2">
                      {missingEvidence.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-slate-950/65 px-3 py-2 text-xs leading-5 text-slate-300"
                          >
                            {missingEvidenceText(item)}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      No missing-evidence items recorded.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    );
  }


  /*
   * VIEW 4 — DECISION & EXECUTION
   */
  return (
    <div className="space-y-5 animate-fade-in">

      <section className="rounded-3xl border border-[#D4FF00]/25 bg-[#080d16] p-6">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          body={copy.body}
        />
      </section>

      <StartupSelector />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-[#D4FF00]">
            Investor context
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            {cleanText(
              selectedStartup?.startup_name
            ) ||
              cleanText(
                selectedStartup?.name
              ) ||
              'Selected opportunity'}
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-200">
            {
              cleanText(
                currentSignal?.investor_summary
              ) ||
              'Awaiting investor-facing opportunity summary.'
            }
          </p>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-cyan-300">
            Next best action
          </p>

          <p className="mt-4 text-sm font-bold leading-6 text-white">
            {
              cleanText(
                currentSignal?.next_best_action
              ) ||
              'Review the current evidence and decide whether the opportunity deserves engagement.'
            }
          </p>

          <p className="mt-3 text-[11px] leading-5 text-slate-400">
            TD Venture presents signals and evidence.
            The investor remains the final decision-maker.
          </p>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-amber-300">
            Open risk
          </p>

          {riskFlags.length ? (
            <div className="mt-4 space-y-2">
              {riskFlags.map(
                (flag: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-5 text-amber-100"
                  >
                    {cleanText(flag)}
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No current risk flags recorded.
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-violet-300">
            Evidence still required
          </p>

          {missingEvidence.length ? (
            <div className="mt-4 space-y-2">
              {missingEvidence.map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/65 p-3 text-xs leading-5 text-slate-300"
                  >
                    {missingEvidenceText(item)}
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No missing-evidence items recorded.
            </p>
          )}
        </section>
      </div>

      <section className="rounded-3xl border border-[#D4FF00]/25 bg-[#080d16] p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-[#D4FF00]">
              Final workspace actions
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              Refresh, discover or move into execution.
            </h2>

            <p className="mt-2 max-w-2xl text-[11px] leading-5 text-slate-400">
              Opportunity data refreshes from canonical records.
              Mandate-driven reranking will be connected only after
              this investor structure is approved.
            </p>

            {lastRefreshedAt && (
              <p className="mt-2 text-[10px] font-mono text-emerald-300">
                Refreshed at {lastRefreshedAt}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                void refreshOpportunityData()
              }
              disabled={refreshing}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 text-[10px] font-black uppercase tracking-wider text-slate-200 transition hover:border-[#D4FF00]/60 hover:text-[#D4FF00] disabled:opacity-40"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? 'animate-spin'
                    : ''
                }`}
              />

              {refreshing
                ? 'Refreshing'
                : 'Refresh opportunity data'}
            </button>

            <button
              type="button"
              onClick={onDiscoverStartups}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/5 px-4 text-[10px] font-black uppercase tracking-wider text-cyan-200"
            >
              Discover Startups
              <ArrowUpRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (
                  selectedInvestorStartupId
                ) {
                  onOpenSelectedStartupDealDesk(
                    selectedInvestorStartupId
                  );

                  return;
                }

                onOpenDealDesk();
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D4FF00] px-4 text-[10px] font-black uppercase tracking-wider text-slate-950"
            >
              Open Deal Desk
              <Workflow className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

        <InvestorDecisionIntelligencePanel
          intelligence={
            investorStartupSignal
              ?.decision_intelligence
              ?? null
          }
        />

      <section className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Mandate"
          value={`${mandateCompletion}/12`}
          detail={`${mandateAwaiting} investor signal${mandateAwaiting === 1 ? '' : 's'} Awaiting.`}
        />

        <Metric
          label="Evidence boundary"
          value="Independent"
          detail="Startup canonical assessment and investor mandate remain separate."
          tone="text-cyan-300"
        />

        <Metric
          label="Decision authority"
          value="Investor"
          detail="TD Venture supports the decision; it does not make the investment decision."
          tone="text-emerald-300"
        />
      </section>

    </div>
  );
}

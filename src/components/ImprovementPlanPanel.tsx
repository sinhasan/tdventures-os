import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Target
} from 'lucide-react';
import type {
  ConversionDimensionAssessment,
  ConversionV2Analysis,
  ConversionV2ContextResponse
} from '../lib/conversionApi';

type Action = () => void;

type ImprovementPlanPanelProps = {
  analysis: ConversionV2Analysis | null;
  context: ConversionV2ContextResponse | null;
  onCollect: Action;
  onAnalyse: Action;
  onVerify: Action;
  onDealDesk: Action;
};

type PlanItem = {
  key: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  why: string;
  action: string;
  evidence: string;
  signal: string;
};

const SIGNAL_BY_DIMENSION: Record<string, string> = {
  idea: 'Narrative clarity',
  solution: 'Narrative clarity',
  timing: 'Investor fit',
  market_wedge: 'Investor fit',
  secret_sauce: 'Investor fit',
  tam: 'Market credibility',
  durability: 'Risk assessment',
  team: 'Execution confidence',
  distribution: 'Traction signal',
  regulatory_readiness: 'Risk assessment',
  revenue: 'Traction signal',
  third_year_projection: 'Fundraise readiness',
  traction: 'Traction signal',
  profitability: 'Fundraise readiness',
  business_model: 'Investor fit',
  ownership_and_team: 'Fundraise readiness',
  scalability: 'Investor fit',
  funding_history: 'Fundraise readiness',
  investor_exit: 'Investor fit',
  funding_instrument: 'Fundraise readiness'
};

function titleCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function assessmentStatus(assessment: ConversionDimensionAssessment) {
  if (assessment.evidence_status === 'AI-supported') return 'Evidence present';
  if (assessment.evidence_status === 'Contradicted') return 'Resolve contradiction';
  if (assessment.evidence_status === 'Missing') return 'Evidence missing';
  return 'Founder claim needs proof';
}

function assessmentPriority(assessment: ConversionDimensionAssessment) {
  if (
    assessment.evidence_status === 'Missing' ||
    assessment.evidence_status === 'Contradicted' ||
    assessment.ai_rating <= 1
  ) return 'High' as const;
  if (assessment.ai_rating <= 2) return 'Medium' as const;
  return 'Low' as const;
}

function buildPlan(analysis: ConversionV2Analysis): PlanItem[] {
  const plan: PlanItem[] = analysis.dimension_assessments
    .filter(
      (assessment) =>
        assessment.ai_rating <= 2 ||
        assessment.evidence_status === 'Missing' ||
        assessment.evidence_status === 'Contradicted'
    )
    .map((assessment) => ({
      key: assessment.key,
      title: titleCase(assessment.key),
      priority: assessmentPriority(assessment),
      status: assessmentStatus(assessment),
      why: assessment.rationale,
      action:
        assessment.interview_question ||
        `Strengthen the ${titleCase(assessment.key).toLowerCase()} claim with current, specific evidence.`,
      evidence: assessment.sources.length
        ? assessment.sources.join(', ')
        : 'Upload or record primary evidence in Collect.',
      signal: SIGNAL_BY_DIMENSION[assessment.key] || 'Conversion intelligence'
    }));

  const existing = new Set(
    plan.map((item) => item.title.trim().toLowerCase())
  );
  for (const missing of analysis.missing_evidence) {
    const normalized = missing.item.trim().toLowerCase();
    if (!normalized || existing.has(normalized)) continue;
    plan.push({
      key: `missing-${plan.length}`,
      title: missing.item,
      priority: missing.priority,
      status: 'Evidence required',
      why: 'This evidence was absent from the independent Conversion Review.',
      action: `Add ${missing.item.toLowerCase()} to the collected founder record or supporting deck.`,
      evidence: 'A dated document, operating metric, customer record or other primary proof.',
      signal: 'Evidence reliability'
    });
    existing.add(normalized);
  }

  const rank = { High: 0, Medium: 1, Low: 2 };
  return plan
    .sort((left, right) => rank[left.priority] - rank[right.priority])
    .slice(0, 8);
}

function priorityTone(priority: PlanItem['priority']) {
  if (priority === 'High') {
    return {
      rail: 'border-l-red-400',
      badge: 'border-red-400/35 bg-red-950/20 text-red-200'
    };
  }
  if (priority === 'Medium') {
    return {
      rail: 'border-l-amber-300',
      badge: 'border-amber-300/35 bg-amber-950/20 text-amber-100'
    };
  }
  return {
    rail: 'border-l-[#D4FF00]',
    badge: 'border-[#D4FF00]/35 bg-[#D4FF00]/5 text-[#D4FF00]'
  };
}

export function ImprovementPlanPanel({
  analysis,
  context,
  onCollect,
  onAnalyse,
  onVerify,
  onDealDesk
}: ImprovementPlanPanelProps) {
  if (!analysis) {
    return (
      <div className="space-y-5 animate-fade-in">
        <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-6">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#D4FF00]">
            04 · Improvement Plan
          </p>
          <h1 className="mt-2 text-2xl font-black text-white">
            Apply AI Intelligence to create your plan
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            The plan is generated from the stored Conversion Review. It does not
            make another AI call or consume another credit.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={onCollect} className="rounded-xl border border-slate-700 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-200">
              Review collected data
            </button>
            <button onClick={onAnalyse} className="rounded-xl bg-[#D4FF00] px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950">
              Apply AI Intelligence
            </button>
          </div>
        </section>
      </div>
    );
  }

  const plan = buildPlan(analysis);
  const qualified = analysis.conversion_score >= 66;
  const high = plan.filter((item) => item.priority === 'High').length;
  const medium = plan.filter((item) => item.priority === 'Medium').length;
  const supported = analysis.dimension_assessments.filter(
    (item) => item.evidence_status === 'AI-supported'
  ).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#D4FF00]">
              04 · Improvement Plan
            </p>
            <h1 className="mt-2 text-2xl font-black text-white">
              What to improve before investor engagement
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              A practical summary generated from the recorded analysis for{' '}
              <strong className="text-white">
                {context?.profile?.startup_name || 'this startup'}
              </strong>. Founder, AI and optional TD Admin assessments remain
              independent.
            </p>
          </div>
          <div className={`rounded-xl border px-4 py-3 ${qualified ? 'border-[#D4FF00]/45 bg-[#D4FF00]/5' : 'border-amber-300/35 bg-amber-950/10'}`}>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
              Automatic qualification
            </p>
            <p className={`mt-1 text-xl font-black ${qualified ? 'text-[#D4FF00]' : 'text-amber-200'}`}>
              {analysis.conversion_score}/100 · {qualified ? 'Qualified' : 'Below 66'}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              Founder judgment may still proceed to Deal Desk.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ['High priority', high, 'text-red-300'],
            ['Medium priority', medium, 'text-amber-200'],
            ['AI-supported', supported, 'text-[#D4FF00]'],
            ['Reliability', `${analysis.reliability_score}/100`, 'text-cyan-200']
          ].map(([label, value, tone]) => (
            <div key={String(label)} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
              <p className={`mt-2 text-xl font-black ${tone}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/25 bg-cyan-950/10 p-5">
        <div className="flex gap-3">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" />
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-cyan-100">Next best action</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{analysis.next_best_action}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4FF00]">Priority action sheet</p>
            <h2 className="mt-1 text-xl font-black text-white">Evidence, action and affected signal</h2>
          </div>
          <p className="text-xs text-slate-500">Current analysis · no additional AI credit</p>
        </div>

        <div className="space-y-3">
          {plan.length ? plan.map((item, index) => {
            const tone = priorityTone(item.priority);
            return (
              <article key={`${item.key}-${index}`} className={`rounded-2xl border border-slate-800 border-l-4 ${tone.rail} bg-[#0B1220] p-5`}>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${tone.badge}`}>{item.priority}</span>
                      <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">{item.status}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.why}</p>
                  </div>
                  <div className="min-w-48 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Signal affected</p>
                    <p className="mt-1 text-sm font-black text-cyan-100">{item.signal}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#D4FF00]">Recommended action</p>
                    <p className="mt-2 text-sm leading-5 text-slate-200">{item.action}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-200">Evidence to add</p>
                    <p className="mt-2 text-sm leading-5 text-slate-300">{item.evidence}</p>
                  </div>
                </div>
              </article>
            );
          }) : (
            <div className="flex gap-3 rounded-2xl border border-[#D4FF00]/30 bg-[#D4FF00]/5 p-5">
              <CheckCircle2 className="h-5 w-5 text-[#D4FF00]" />
              <p className="text-sm text-slate-200">No material evidence gaps were returned in the current review.</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <button onClick={onCollect} className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5 text-left transition hover:border-cyan-400/40">
          <FileCheck2 className="h-5 w-5 text-cyan-200" />
          <p className="mt-3 font-black text-white">Strengthen collected evidence</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Update the record or add a pitch deck, then run a new analysis when ready.</p>
        </button>
        <button onClick={onVerify} className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5 text-left transition hover:border-amber-300/40">
          <ShieldCheck className="h-5 w-5 text-amber-200" />
          <p className="mt-3 font-black text-white">Request optional verification</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">TD Admin verification remains a separate assessment and is never required for Execution.</p>
        </button>
        <button onClick={onDealDesk} className="rounded-2xl border border-[#D4FF00]/35 bg-[#D4FF00]/5 p-5 text-left transition hover:bg-[#D4FF00]/10">
          <Sparkles className="h-5 w-5 text-[#D4FF00]" />
          <p className="mt-3 font-black text-white">Proceed to Deal Desk</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Carry the versioned signal into Execution; founders may proceed even below the automatic 66 threshold.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#D4FF00]">Open Execution <ArrowRight className="h-3.5 w-3.5" /></span>
        </button>
      </section>

      {analysis.risk_flags.length > 0 && (
        <section className="rounded-2xl border border-red-400/25 bg-red-950/10 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-red-200">Risk flags to resolve</p>
              <ul className="mt-2 space-y-2">
                {analysis.risk_flags.map((flag) => <li key={flag} className="text-sm leading-5 text-slate-300">• {flag}</li>)}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

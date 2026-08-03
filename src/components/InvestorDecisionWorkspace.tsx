import React from 'react';
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
  onDiscoverStartups: () => void;
  onOpenDealDesk: () => void;
  onOpenPricing: () => void;
};

const MARKETPLACE_URL =
  'https://staging.tdventure.vc/app';
const INVESTOR_APPLY_URL =
  'https://staging.tdventure.vc/signup/investor';

const pillars = [
  {
    number: '01',
    label: 'Thesis & Founder Fit',
    detail:
      'Problem, founder insight, timing, wedge and differentiation.',
    icon: Target
  },
  {
    number: '02',
    label: 'Market & Moat',
    detail:
      'Market structure, durability, competition and regulatory exposure.',
    icon: Compass
  },
  {
    number: '03',
    label: 'Operating Evidence',
    detail:
      'Traction, revenue quality, distribution, retention and execution proof.',
    icon: FileSearch
  },
  {
    number: '04',
    label: 'Capital & Return Readiness',
    detail:
      'Ownership, instrument, use of funds, milestones and investor outcomes.',
    icon: Scale
  }
];

const viewCopy: Record<
  InvestorDecisionView,
  { eyebrow: string; title: string; body: string }
> = {
  dashboard: {
    eyebrow: 'Investor Decision Intelligence',
    title: 'Move from startup discovery to evidence-backed conviction.',
    body:
      'Use Conversion to understand the evidence. Use Deal Desk to compare, decide and execute. Founder, AI and TD Admin assessments remain independent so your judgment stays sovereign.'
  },
  investor_discover: {
    eyebrow: '01 · Discover',
    title: 'Enter through real startup records—not a demo portfolio.',
    body:
      'Open the startup universe in Deal Desk, filter the available records and select a company before going deeper into its evidence.'
  },
  investor_matches: {
    eyebrow: '02 · Compare',
    title: 'Turn broad matching into a focused decision queue.',
    body:
      'Match Fit is the starting point. Conversion evidence, AI interpretation and your own judgment determine which startups deserve attention.'
  },
  investor_framework: {
    eyebrow: '03 · Evaluate',
    title: 'Use consistent questions without surrendering investor instinct.',
    body:
      'The four diligence pillars create guardrails. They do not dictate an investment decision, and they never merge Founder, AI or TD Admin opinions.'
  },
  investor_execution: {
    eyebrow: '04 · Execute',
    title: 'Move conviction into an accountable Deal Desk workflow.',
    body:
      'Start an opportunity, retain private judgment, track the next action and progress from interest through diligence to a funded outcome.'
  }
};

function ExternalLink({
  href,
  children,
  primary = false
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        primary
          ? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D4FF00] px-5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_24px_rgba(212,255,0,0.22)] transition hover:brightness-110'
          : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-5 text-xs font-black uppercase tracking-wider text-slate-200 transition hover:border-[#D4FF00]/60 hover:text-[#D4FF00]'
      }
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

export function InvestorDecisionWorkspace({
  view,
  accountName,
  investorProfileLinked,
  onDiscoverStartups,
  onOpenDealDesk,
  onOpenPricing
}: InvestorDecisionWorkspaceProps) {
  const copy = viewCopy[view];

  return (
    <div className="space-y-5 animate-fade-in">
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
              <ExternalLink href={MARKETPLACE_URL}>
                Private Marketplace
              </ExternalLink>
            </div>
          </div>

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
                    ? `${accountName}, your profile can carry sector, stage, geography and ticket preferences into matching.`
                    : 'A complete investor profile improves startup ranking and creates a useful decision queue.'}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {!investorProfileLinked && (
                <ExternalLink href={INVESTOR_APPLY_URL}>
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

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: 'Independent evidence',
            value: 'Founder · AI · TD Admin',
            detail: 'Parallel assessments are displayed independently.',
            icon: GitCompareArrows,
            color: 'text-cyan-300'
          },
          {
            label: 'Qualification guardrail',
            value: '66 / 100',
            detail: 'Automatic threshold; human judgment can still advance a match.',
            icon: BrainCircuit,
            color: 'text-[#D4FF00]'
          },
          {
            label: 'Reveal boundary',
            value: 'Identity protected',
            detail: 'Use evidence first; reveal follows the platform access boundary.',
            icon: Eye,
            color: 'text-amber-300'
          }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-[#0c1222]/80 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-slate-500">
                  {item.label}
                </p>
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className={`mt-3 text-xl font-black ${item.color}`}>
                {item.value}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {item.detail}
              </p>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-[#080d16] p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-[#D4FF00]">
              Conviction framework
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Four questions before capital moves.
            </h2>
          </div>
          <p className="max-w-xl text-xs leading-5 text-slate-400">
            The fifth node is independent AI Intelligence. It interprets supplied
            evidence but never replaces the investor’s decision.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.number}
                className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-[#D4FF00]/45"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-[#D4FF00]">
                    {pillar.number}
                  </span>
                  <Icon className="h-5 w-5 text-slate-500 transition group-hover:text-[#D4FF00]" />
                </div>
                <h3 className="mt-4 font-black text-white">{pillar.label}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {pillar.detail}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3">
          <Sparkles className="h-5 w-5 shrink-0 text-cyan-300" />
          <p className="text-xs leading-5 text-slate-300">
            This checkpoint establishes the investor journey without inventing
            portfolio totals or scores. Startup-level assessments will populate
            only from canonical records and recorded evidence.
          </p>
        </div>
      </section>
    </div>
  );
}

import type {
  InvestorDecisionIntelligence
} from '../lib/conversionApi';

type Props = {
  intelligence?: InvestorDecisionIntelligence | null;
};

function stateLabel(
  state?: string | null
): string {
  switch (state) {
    case 'aligned':
      return 'Aligned';

    case 'partially_aligned':
      return 'Partially aligned';

    case 'outside_mandate':
      return 'Outside mandate';

    case 'mixed':
      return 'Mixed';

    case 'available':
      return 'Available';

    case 'awaiting':
      return 'Awaiting';

    default:
      return state || 'Awaiting';
  }
}

function stateClass(
  state?: string | null
): string {
  switch (state) {
    case 'aligned':
    case 'available':
      return (
        'border-emerald-400/25 ' +
        'bg-emerald-400/5 ' +
        'text-emerald-300'
      );

    case 'outside_mandate':
      return (
        'border-rose-400/25 ' +
        'bg-rose-400/5 ' +
        'text-rose-300'
      );

    case 'mixed':
    case 'partially_aligned':
      return (
        'border-amber-400/25 ' +
        'bg-amber-400/5 ' +
        'text-amber-300'
      );

    default:
      return (
        'border-slate-700 ' +
        'bg-slate-950/60 ' +
        'text-slate-400'
      );
  }
}

function valueText(value: unknown): string {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'Awaiting';
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(item => String(item))
      .filter(Boolean)
      .join(', ') || 'Awaiting';
  }

  if (typeof value === 'object') {
    const record =
      value as Record<string, unknown>;

    const minimum =
      record.minimum ??
      record.min;

    const maximum =
      record.maximum ??
      record.max;

    if (
      minimum !== undefined ||
      maximum !== undefined
    ) {
      return [
        minimum !== undefined
          ? `Min $${Number(minimum).toLocaleString()}`
          : null,

        maximum !== undefined
          ? `Max $${Number(maximum).toLocaleString()}`
          : null
      ]
        .filter(Boolean)
        .join(' · ');
    }
  }

  return 'Available';
}

export default function
InvestorDecisionIntelligencePanel({
  intelligence
}: Props) {
  if (!intelligence) {
    return null;
  }

  const alignment =
    Array.isArray(intelligence.alignment)
      ? intelligence.alignment
      : [];

  const signals =
    Array.isArray(
      intelligence.decision_signals
    )
      ? intelligence.decision_signals
      : [];

  const coverage =
    Array.isArray(
      intelligence.evidence_coverage
    )
      ? intelligence.evidence_coverage
      : [];

  const lenses =
    Array.isArray(
      intelligence.decision_lenses
    )
      ? intelligence.decision_lenses
      : [];

  const summary =
    intelligence.alignment_summary || {};

  const fitState =
    intelligence.fit_state || 'awaiting';

  const canonicalState =
    intelligence.canonical_conversion_state
      || 'awaiting';

  return (
    <section className="col-span-full rounded-3xl border border-cyan-400/20 bg-[#080d16] p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-cyan-300">
            Investor Decision Intelligence
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            Read this startup through your mandate.
          </h3>

          <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
            Investor-specific fit and evidence
            interpretation. This layer does not
            change Match Fit, the startup's
            canonical Conversion score,
            qualification, risk or leading signals.
          </p>
        </div>

        <div
          className={
            'shrink-0 rounded-xl border px-4 py-3 '
            + stateClass(fitState)
          }
        >
          <p className="text-[9px] font-mono font-black uppercase tracking-[0.18em] opacity-70">
            Mandate fit
          </p>

          <p className="mt-1 text-sm font-black">
            {stateLabel(fitState)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {alignment.length ? (
          alignment.map(item => (
            <article
              key={item.key}
              className={
                'rounded-2xl border p-4 '
                + stateClass(item.state)
              }
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-black text-white">
                  {item.label}
                </p>

                <span className="text-[9px] font-mono font-black uppercase tracking-wider">
                  {stateLabel(item.state)}
                </span>
              </div>

              <p className="mt-3 text-[10px] font-mono uppercase tracking-wider opacity-60">
                Startup
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-200">
                {valueText(item.startup_value)}
              </p>

              <p className="mt-3 text-[10px] font-mono uppercase tracking-wider opacity-60">
                Your mandate
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-300">
                {valueText(item.mandate_value)}
              </p>

              {item.detail && (
                <p className="mt-3 border-t border-white/5 pt-3 text-[11px] leading-5 text-slate-400">
                  {item.detail}
                </p>
              )}
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-xs text-slate-400">
            Structured mandate alignment is Awaiting.
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-white">
              Mandate alignment
            </p>

            <span className="text-[10px] font-mono text-slate-500">
              {Number(summary.aligned || 0)}/
              {Number(summary.dimensions || 4)}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {signals.length ? (
              signals.map((item, index) => (
                <div
                  key={`${item.signal || 'signal'}-${index}`}
                  className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-3 py-2.5"
                >
                  <p className="text-xs leading-5 text-slate-200">
                    {item.signal || 'Supported alignment'}
                  </p>

                  <p className="mt-1 text-[9px] font-mono uppercase tracking-wider text-emerald-300/70">
                    {item.evidence_status
                      || 'Structured data'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs leading-5 text-slate-500">
                No supported mandate alignment signal
                is available yet.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-xs font-black text-white">
            Evidence coverage
          </p>

          <div className="mt-4 space-y-2">
            {coverage.map(item => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 px-3 py-2.5"
              >
                <span className="text-xs text-slate-300">
                  {item.label}
                </span>

                <span
                  className={
                    'text-[9px] font-mono font-black uppercase '
                    + (
                      item.state === 'available'
                        ? 'text-emerald-300'
                        : 'text-slate-500'
                    )
                  }
                >
                  {stateLabel(item.state)}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-xs font-black text-white">
            Canonical Conversion
          </p>

          <div
            className={
              'mt-4 rounded-xl border px-4 py-4 '
              + stateClass(canonicalState)
            }
          >
            <p className="text-sm font-black">
              {canonicalState === 'available'
                ? 'Canonical signal available'
                : 'Awaiting founder Conversion'}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              {canonicalState === 'available'
                ? 'Independent startup Conversion intelligence can be read alongside your mandate.'
                : 'No founder Conversion signal is manufactured. Mandate fit remains available while canonical intelligence stays Awaiting.'}
            </p>
          </div>
        </article>
      </div>

      {lenses.length > 0 && (
        <article className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black text-white">
                Founder Pitch Lens
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                What this startup must demonstrate
                against your own decision framework.
              </p>
            </div>

            <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-300">
              Investor context · not startup scoring
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lenses.map(lens => (
              <div
                key={lens.key}
                className="rounded-xl border border-slate-800 bg-[#0c1222] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] font-black text-slate-200">
                    {lens.label}
                  </p>

                  <span
                    className={
                      'text-[8px] font-mono font-black uppercase tracking-wider '
                      + (
                        lens.startup_evidence_state
                          === 'available'
                          ? 'text-emerald-300'
                          : 'text-slate-600'
                      )
                    }
                  >
                    {stateLabel(
                      lens.startup_evidence_state
                    )}
                  </span>
                </div>

                <p className="mt-2 line-clamp-4 text-[11px] leading-5 text-slate-400">
                  {lens.investor_requirement
                    || 'Investor requirement Awaiting.'}
                </p>
              </div>
            ))}
          </div>
        </article>
      )}

      <div className="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-3 text-[10px] leading-5 text-slate-400">
        TD Venture exposes fit, evidence and
        uncertainty. The investor retains the
        investment decision.
      </div>
    </section>
  );
}

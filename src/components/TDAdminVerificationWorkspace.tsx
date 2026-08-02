import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  Lock,
  Save,
  ShieldCheck
} from 'lucide-react';
import {
  freezeTDAdminAssessment,
  getConversionAdminReview,
  getConversionAdminReviewQueue,
  saveTDAdminAssessment,
  type ConversionClaimReview,
  type FounderAssessmentClaim,
  type TDAdminDimensionAssessment
} from '../lib/conversionApi';

const ASSESSMENT_GROUPS = [
  {
    title: 'Thesis & differentiation',
    keys: ['idea', 'solution', 'timing', 'market_wedge', 'secret_sauce']
  },
  {
    title: 'Market & moat',
    keys: ['tam', 'durability', 'team', 'distribution', 'regulatory_readiness']
  },
  {
    title: 'Operating evidence',
    keys: ['revenue', 'third_year_projection', 'traction', 'profitability', 'business_model']
  },
  {
    title: 'Capital readiness',
    keys: ['ownership_and_team', 'scalability', 'funding_history', 'investor_exit', 'funding_instrument']
  }
] as const;

const EMPTY_ADMIN_ASSESSMENT: TDAdminDimensionAssessment = {
  rating: null,
  notes: '',
  evidence_status: 'not_reviewed'
};

function founderMap(claims: FounderAssessmentClaim[] | undefined) {
  return new Map((claims || []).map((claim) => [claim.key, claim]));
}

function statusLabel(status: string | null | undefined) {
  if (status === 'frozen') return 'Frozen';
  if (status === 'in_progress') return 'Draft in progress';
  return 'Not started';
}

function RatingRail({
  value,
  disabled,
  onChange
}: {
  value: number | null;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="TD Admin rating">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={disabled}
          onClick={() => onChange(rating)}
          className={`h-9 w-9 rounded-lg border text-xs font-black transition ${
            value === rating
              ? 'border-[#D4FF00] bg-[#D4FF00] text-slate-950 shadow-[0_0_14px_rgba(212,255,0,0.35)]'
              : 'border-slate-700 bg-slate-950/70 text-slate-400 hover:border-[#D4FF00]/60 hover:text-white'
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {rating}
        </button>
      ))}
    </div>
  );
}

export function ParallelAssessmentRecord({
  review,
  founderClaims,
  editable = false,
  assessments,
  onAssessmentChange
}: {
  review: ConversionClaimReview;
  founderClaims?: FounderAssessmentClaim[];
  editable?: boolean;
  assessments?: Record<string, TDAdminDimensionAssessment>;
  onAssessmentChange?: (key: string, value: TDAdminDimensionAssessment) => void;
}) {
  const founders = founderMap(founderClaims || review.founder_claims);
  const adminValues = assessments || review.td_admin_assessments || {};
  const frozen = review.td_admin_assessment_status === 'frozen';

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ['Founder assessment', 'Submitted and immutable', 'text-slate-300'],
          ['OpenAI assessment', 'Independent evidence track', 'text-cyan-300'],
          ['TD Admin assessment', frozen ? 'Frozen and immutable' : 'Optional human verification', 'text-[#D4FF00]']
        ].map(([label, detail, tone]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${tone}`}>{label}</p>
            <p className="mt-1 text-xs text-slate-500">{detail}</p>
          </div>
        ))}
      </div>

      {ASSESSMENT_GROUPS.map((group, groupIndex) => (
        <section key={group.title} className="rounded-3xl border border-slate-800 bg-[#080D1A] p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-cyan-300">
                {String(groupIndex + 1).padStart(2, '0')} · Verification block
              </p>
              <h3 className="mt-1 text-xl font-black text-white">{group.title}</h3>
            </div>
            <span className="rounded-full border border-slate-800 px-3 py-1 text-[10px] font-bold text-slate-500">5 dimensions</span>
          </div>

          <div className="space-y-4">
            {group.keys.map((key, index) => {
              const founder = founders.get(key);
              const ai = (review.claims || []).find((item) => item.key === key);
              const admin = adminValues[key] || EMPTY_ADMIN_ASSESSMENT;
              return (
                <article key={key} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/55">
                  <div className="grid gap-0 xl:grid-cols-[1fr_1fr]">
                    <div className="border-b border-slate-800 bg-slate-900/35 p-5 xl:border-b-0 xl:border-r">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-mono text-slate-600">{groupIndex * 5 + index + 1}/20 · FOUNDER</p>
                          <h4 className="mt-1 text-sm font-black text-slate-300">{founder?.label || key.replace(/_/g, ' ')}</h4>
                        </div>
                        <span className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-lg font-black text-slate-300">
                          {founder?.rating ?? '—'}<span className="text-xs text-slate-600">/5</span>
                        </span>
                      </div>
                      <p className="mt-3 min-h-[44px] text-xs leading-5 text-slate-500">
                        {founder?.evidence || 'Founder supplied a rating without supporting text.'}
                      </p>
                      <div className="mt-3 rounded-lg border border-cyan-950/80 bg-cyan-950/10 px-3 py-2 text-[10px] text-cyan-300/75">
                        OpenAI: {ai?.ai_rating ?? '—'}/5 · {ai?.evidence_status || 'Awaiting analysis'}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-[#D4FF00]">TD Admin</p>
                          <p className="mt-1 text-xs text-slate-500">Independent rating after founder discussion and evidence inspection</p>
                        </div>
                        {frozen && <Lock className="h-4 w-4 text-[#D4FF00]" />}
                      </div>
                      <div className="mt-4">
                        {editable ? (
                          <RatingRail
                            value={admin.rating}
                            disabled={frozen}
                            onChange={(rating) => onAssessmentChange?.(key, { ...admin, rating })}
                          />
                        ) : (
                          <span className={`inline-flex rounded-lg border px-3 py-2 text-lg font-black ${admin.rating == null ? 'border-slate-800 text-slate-600' : 'border-[#D4FF00]/50 text-[#D4FF00]'}`}>
                            {admin.rating ?? '—'}<span className="text-xs text-slate-600">/5</span>
                          </span>
                        )}
                      </div>
                      {editable ? (
                        <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr]">
                          <select
                            value={admin.evidence_status}
                            disabled={frozen}
                            onChange={(event) => onAssessmentChange?.(key, {
                              ...admin,
                              evidence_status: event.target.value as TDAdminDimensionAssessment['evidence_status']
                            })}
                            className="rounded-xl border border-slate-800 bg-[#080D1A] px-3 py-2 text-xs text-white outline-none focus:border-[#D4FF00] disabled:opacity-60"
                          >
                            <option value="not_reviewed">Not reviewed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="adjusted">Adjusted</option>
                            <option value="insufficient_evidence">Insufficient evidence</option>
                          </select>
                          <textarea
                            value={admin.notes}
                            disabled={frozen}
                            onChange={(event) => onAssessmentChange?.(key, { ...admin, notes: event.target.value })}
                            className="min-h-[76px] rounded-xl border border-slate-800 bg-[#080D1A] px-3 py-2 text-xs text-white outline-none focus:border-[#D4FF00] disabled:opacity-60"
                            placeholder="Record what was checked and why the TD rating was retained or adjusted."
                          />
                        </div>
                      ) : (
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          {admin.notes || 'No TD Admin assessment has been recorded.'}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function AdminVerificationWorkspace() {
  const [queue, setQueue] = useState<ConversionClaimReview[]>([]);
  const [summary, setSummary] = useState({ total: 0, not_started: 0, in_progress: 0, frozen: 0 });
  const [selected, setSelected] = useState<ConversionClaimReview | null>(null);
  const [assessments, setAssessments] = useState<Record<string, TDAdminDimensionAssessment>>({});
  const [scope, setScope] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const completed = useMemo(
    () => Object.values(assessments).filter((item) => item.rating != null).length,
    [assessments]
  );

  const hydrate = (review: ConversionClaimReview) => {
    setSelected(review);
    setAssessments(review.td_admin_assessments || {});
    setScope(review.td_admin_assessment_scope || review.verification_scope || '');
  };

  const loadQueue = async (preferredId?: string) => {
    setLoading(true);
    try {
      const response = await getConversionAdminReviewQueue();
      setQueue(response.items);
      setSummary(response.summary);
      const target = response.items.find((item) => item.id === preferredId) || response.items[0];
      if (target) hydrate(target);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Verification queue could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const openReview = async (reviewId: string) => {
    setLoading(true);
    setMessage('');
    try {
      hydrate(await getConversionAdminReview(reviewId));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Review could not be opened.');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    if (!selected) return;
    setSaving(true);
    setMessage('');
    try {
      const updated = await saveTDAdminAssessment(selected.id, assessments, scope);
      hydrate({ ...selected, ...updated });
      setMessage(`Draft saved · ${completed}/20 TD Admin ratings complete.`);
      await loadQueue(selected.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Draft could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const freeze = async () => {
    if (!selected || completed !== 20) {
      setMessage('Complete all 20 TD Admin ratings before freezing verification.');
      return;
    }
    if (scope.trim().length < 10) {
      setMessage('Describe the verification scope before freezing.');
      return;
    }
    if (!window.confirm('Freeze all 20 TD Admin ratings? This cannot be edited after confirmation.')) return;
    setSaving(true);
    setMessage('');
    try {
      const updated = await freezeTDAdminAssessment(selected.id, assessments, scope);
      hydrate({ ...selected, ...updated });
      setMessage('★ TD Admin verification frozen. Founder and Admin records are now immutable for this evidence revision.');
      await loadQueue(selected.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Verification could not be frozen.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !selected) {
    return <div className="flex min-h-[360px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#D4FF00]" /></div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#D4FF00]/30 bg-[#0c1222]/90 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#D4FF00]">TD Admin · Verify</p>
            <h1 className="mt-2 text-3xl font-black text-white">20-dimension Verification Queue</h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
              Compare the founder declaration with independent OpenAI evidence, record a separate TD Admin judgment, and freeze only after all 20 dimensions are complete.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              ['Queue', summary.total],
              ['New', summary.not_started],
              ['Draft', summary.in_progress],
              ['Frozen', summary.frozen]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="text-lg font-black text-white">{value}</p>
                <p className="text-[9px] uppercase tracking-wider text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {message && <div className="rounded-xl border border-cyan-900/70 bg-cyan-950/20 px-4 py-3 text-xs text-cyan-200">{message}</div>}

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-3 rounded-2xl border border-slate-800 bg-[#080D1A] p-3 xl:sticky xl:top-0 xl:max-h-[calc(100vh-160px)] xl:overflow-y-auto">
          {queue.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void openReview(item.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === item.id ? 'border-[#D4FF00]/70 bg-[#D4FF00]/5' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-white">{item.startup_name || 'Startup review'}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{item.sector || 'Sector not set'} · {item.stage || 'Stage not set'}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </div>
              <p className={`mt-3 text-[10px] font-black uppercase tracking-wider ${item.td_admin_assessment_status === 'frozen' ? 'text-[#D4FF00]' : 'text-cyan-300'}`}>
                {statusLabel(item.td_admin_assessment_status)}
              </p>
            </button>
          ))}
          {!queue.length && <p className="p-5 text-sm text-slate-500">No evidence-backed reviews are waiting.</p>}
        </aside>

        {selected ? (
          <main className="space-y-5">
            <section className="rounded-2xl border border-slate-800 bg-[#0c1222]/90 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">Evidence revision {selected.founder_evidence_revision}</p>
                  <h2 className="mt-1 text-2xl font-black text-white">{selected.startup_name}</h2>
                  <p className="mt-1 text-xs text-slate-500">{selected.founder_email} · {selected.sector} · {selected.stage}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-[10px] font-bold text-slate-400">{completed}/20 Admin</span>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-black ${selected.td_admin_assessment_status === 'frozen' ? 'border-[#D4FF00]/50 text-[#D4FF00]' : 'border-cyan-800 text-cyan-300'}`}>
                    {statusLabel(selected.td_admin_assessment_status)}
                  </span>
                </div>
              </div>
            </section>

            <ParallelAssessmentRecord
              review={selected}
              editable
              assessments={assessments}
              onAssessmentChange={(key, value) => setAssessments((current) => ({ ...current, [key]: value }))}
            />

            <section className="rounded-2xl border border-slate-800 bg-[#0c1222]/90 p-5">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-white">Verification scope</span>
                <textarea
                  value={scope}
                  disabled={selected.td_admin_assessment_status === 'frozen'}
                  onChange={(event) => setScope(event.target.value)}
                  className="mt-3 min-h-[110px] w-full rounded-xl border border-slate-800 bg-[#080D1A] px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00] disabled:opacity-60"
                  placeholder="State which identity, operational and documentary evidence was inspected."
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={saving || selected.td_admin_assessment_status === 'frozen'}
                  onClick={() => void saveDraft()}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-800 px-5 py-3 text-xs font-black uppercase tracking-wider text-cyan-200 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> Save draft
                </button>
                <button
                  type="button"
                  disabled={saving || completed !== 20 || selected.td_admin_assessment_status === 'frozen'}
                  onClick={() => void freeze()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D4FF00] px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {selected.td_admin_assessment_status === 'frozen' ? <Lock className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  {selected.td_admin_assessment_status === 'frozen' ? 'Verification frozen' : 'Freeze TD Verification'}
                </button>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <p className="text-xs leading-5 text-slate-500">
                  Founder, OpenAI and TD Admin assessments remain independent parallel records. TD Verification is not investment due diligence, an endorsement, or a promise of investment performance.
                </p>
              </div>
            </section>
          </main>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center text-sm text-slate-500">Select a review from the queue.</div>
        )}
      </div>
    </div>
  );
}

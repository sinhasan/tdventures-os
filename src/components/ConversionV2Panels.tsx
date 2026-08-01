import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  UploadCloud
} from 'lucide-react';
import type {
  ConversionClaimReview,
  ConversionProfileVerification,
  ConversionV2Analysis
} from '../lib/conversionApi';

type PitchDeckEvidencePanelProps = {
  file: File | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
};

export function PitchDeckEvidencePanel({
  file,
  disabled,
  onChange
}: PitchDeckEvidencePanelProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-[#0c1222]/90 p-6 shadow-2xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#D4FF00]">
            Pitch-deck evidence
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Add corroborating evidence
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Upload PDF or PPTX, up to 8 MB. PDF is recommended because charts
            and slide visuals can be assessed; PPTX analysis is text-only.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#D4FF00] px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950">
          <UploadCloud className="h-4 w-4" />
          {file ? 'Replace deck' : 'Choose deck'}
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            disabled={disabled}
            onChange={(event) => {
              onChange(event.target.files?.[0] || null);
              event.currentTarget.value = '';
            }}
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        {file ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-cyan-300" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · retained only
                  in this browser until analysis
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs font-bold text-red-300 hover:text-red-200"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No deck supplied. This will be reported as missing evidence—not as
            a zero-quality deck.
          </p>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        Privacy boundary: the raw file and extracted deck text are not stored
        in the TD Venture database. Only the resulting intelligence signal and
        a file fingerprint are retained.
      </p>
    </section>
  );
}

function VerificationBadge({
  verification
}: {
  verification: ConversionProfileVerification;
}) {
  const verified = verification.status === 'profile_verified';

  return (
    <div
      className={`rounded-2xl border p-4 ${
        verified
          ? 'border-[#D4FF00]/60 bg-[#D4FF00]/10 shadow-[0_0_24px_rgba(212,255,0,0.16)]'
          : 'border-red-500/60 bg-red-950/30'
      }`}
    >
      <div className="flex items-center gap-2">
        {verified ? (
          <ShieldCheck className="h-5 w-5 text-[#D4FF00]" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-400" />
        )}
        <p
          className={`text-sm font-black ${
            verified ? 'text-[#D4FF00]' : 'text-red-300'
          }`}
        >
          {verified
            ? '★ Verified Profile by TD Ventures'
            : 'Profile Not Verified'}
        </p>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        {verified
          ? (
              `Selected profile claims were verified${
                verification.verified_at
                  ? ` on ${new Date(
                      verification.verified_at
                    ).toLocaleDateString()}`
                  : ''
              }.`
            )
          : (
              'The founder may still proceed to Execution. Verification is an optional human service and is not an execution gate.'
            )}
      </p>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">
        {verification.disclaimer}
      </p>
    </div>
  );
}

export function ConversionV2ResultPanel({
  analysis,
  generatedAt
}: {
  analysis: ConversionV2Analysis;
  generatedAt: string;
}) {
  const dimensions = analysis.dimension_assessments || [];
  const sectorPenalty = analysis.sector_adjustment_points === -10;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#D4FF00]/35 bg-slate-950/75 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#D4FF00]">
              Evidence-backed Conversion Review
            </p>
          <h2 className="mt-2 text-2xl font-black text-white">
              Conversion Score {analysis.conversion_score}/100
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Generated {generatedAt}
            </p>
          </div>
          <VerificationBadge
            verification={analysis.profile_verification}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            ['Founder claim', `${analysis.founder_claim_score}/100`],
            ['OpenAI evidence', `${analysis.ai_evidence_score}/100`],
            ['60:40 base', `${analysis.weighted_base_score}/100`],
            [
              'Sector adjustment',
              sectorPenalty ? '−10 founder pts' : '0 · hot sector'
            ],
            ['Reliability', `${analysis.reliability_score}/100`]
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-800 bg-[#080D1A] p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {label}
              </p>
              <p
                className={`mt-2 text-lg font-black ${
                  label === 'Sector adjustment' && sectorPenalty
                    ? 'text-red-300'
                    : 'text-white'
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-[#080D1A] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-cyan-300">
                Gap Analysis
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                {analysis.gap_classification}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Founder − OpenAI gap: {analysis.founder_ai_gap > 0 ? '+' : ''}
                {analysis.founder_ai_gap} points.{' '}
                {analysis.behaviour_assessment?.explanation}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300">
              Anomaly level:{' '}
              <strong className="text-white">
                {analysis.behaviour_assessment?.anomaly_level}
              </strong>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-[#080D1A] p-5">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#D4FF00]">
              Sector Intelligence
            </p>
            <p className="mt-2 text-lg font-black text-white">
              {analysis.sector_intelligence?.structural_score}/100 ·{' '}
              {analysis.is_hot_sector ? 'Hot sector' : 'Not a hot sector'}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {analysis.sector_intelligence?.rationale}
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              A structural score of 70 or above keeps the founder contribution
              intact. Below 70 deducts 10 points from the founder’s 40-point
              component.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#080D1A] p-5">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-cyan-300">
              Pitch-deck evidence
            </p>
            <p className="mt-2 text-lg font-black text-white">
              {analysis.deck_assessment?.score == null
                ? 'Not supplied'
                : `${analysis.deck_assessment.score}/100`}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {analysis.deck_assessment?.limitation}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-[#080D1A] p-5">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
            Published scoring logic
          </p>
          <p className="mt-2 text-sm font-bold text-white">
            {analysis.score_formula?.rule}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {analysis.score_formula?.sector_adjustment_rule}
          </p>
        </div>
      </section>

      {dimensions.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-[#080D1A] p-6">
          <div>
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-cyan-300">
              Diamond Index + Investability
            </p>
            <h3 className="mt-2 text-xl font-black text-white">
              20-dimension evidence baseline
            </h3>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-800 text-[10px] uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-3 py-3">Dimension</th>
                  <th className="px-3 py-3">AI / 5</th>
                  <th className="px-3 py-3">Evidence</th>
                  <th className="px-3 py-3">Independent rationale</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((item) => (
                  <tr
                    key={item.key}
                    className="border-b border-slate-900 align-top"
                  >
                    <td className="px-3 py-4 font-bold text-white">
                      {item.key.replace(/_/g, ' ')}
                    </td>
                    <td className="px-3 py-4 font-black text-[#D4FF00]">
                      {item.ai_rating}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                          item.evidence_status === 'Contradicted'
                            ? 'bg-red-950/50 text-red-300'
                            : item.evidence_status === 'AI-supported'
                              ? 'bg-[#D4FF00]/10 text-[#D4FF00]'
                              : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {item.evidence_status}
                      </span>
                    </td>
                    <td className="px-3 py-4 leading-6 text-slate-400">
                      {item.rationale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

type AcceptClaimsPanelProps = {
  analysis: ConversionV2Analysis | null;
  review: ConversionClaimReview | null;
  responses: Record<string, string>;
  saving: boolean;
  onResponseChange: (claimKey: string, value: string) => void;
  onSubmit: () => void;
};

export function AcceptClaimsPanel({
  analysis,
  review,
  responses,
  saving,
  onResponseChange,
  onSubmit
}: AcceptClaimsPanelProps) {
  if (!analysis || !review) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#0c1222]/90 p-5">
        <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#D4FF00]">
          05 · Verify
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">
          Apply AI Intelligence first
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Optional verification begins with the Gap Analysis questions created
          from material evidence gaps, contradictions and rating anomalies.
        </p>
      </section>
    );
  }

  const questions = review.interview_questions || [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-[#0c1222]/90 p-5">
        <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#D4FF00]">
          05 · Verify
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">
          Gap Analysis & optional verification
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
          Respond to the questions generated from the Gap Analysis. Answers
          strengthen the review record but do not automatically create a
          verification badge.
        </p>
        <div className="mt-5">
          <VerificationBadge
            verification={analysis.profile_verification}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-800 bg-[#080D1A] p-6">
        {questions.length ? (
          questions.map((item, index) => (
            <label
              key={`${item.claim_key}-${index}`}
              className="block rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-white">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.reason}
                  </p>
                </div>
                <span className="rounded-full bg-red-950/40 px-3 py-1 text-[10px] font-bold text-red-300">
                  {item.priority}
                </span>
              </div>
              <p className="mt-4 text-sm font-bold leading-6 text-slate-200">
                {item.question}
              </p>
              <textarea
                value={responses[item.claim_key] || ''}
                onChange={(event) =>
                  onResponseChange(item.claim_key, event.target.value)
                }
                className="mt-3 min-h-[110px] w-full rounded-xl border border-slate-800 bg-[#080D1A] px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]"
                placeholder="Give a precise answer and identify the evidence TD Ventures may inspect."
              />
            </label>
          ))
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-[#D4FF00]/30 bg-[#D4FF00]/5 p-5">
            <CheckCircle2 className="h-5 w-5 text-[#D4FF00]" />
            <p className="text-sm text-slate-300">
              No material clarification question was generated.
            </p>
          </div>
        )}

        {questions.length > 0 && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="rounded-xl bg-[#D4FF00] px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving responses…' : 'Save interview responses'}
          </button>
        )}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
          <div>
            <h3 className="text-lg font-black text-white">
              TD Ventures Profile Verification
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              A TD Ventures reviewer may inspect selected claims, identity and
              supporting evidence and record the scope and date. Until then,
              the profile remains visibly marked in red as not verified.
              Execution remains available in either state.
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              This service is not investment due diligence, an endorsement, or
              assurance of investment performance. Formal investor diligence
              remains a separate process.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

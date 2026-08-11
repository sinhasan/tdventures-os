import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

type LaunchContext = {
  source?: string;
  purpose?: string;
  opportunity_id?: string;
  opportunity_code?: string | null;
  startup_id?: string;
  investor_id?: string;
  investor_name?: string;
  opportunity_status?: string;
};

type DocumentSpec = {
  key: string;
  label: string;
  accept: string;
  acceptLabel: string;
  maxBytes: number;
  maxLabel: string;
};

type StoredDocument = {
  document_key: string;
  original_filename: string;
  content_type?: string | null;
  size_bytes: number;
  sha256?: string;
  uploaded_at?: string;
  updated_at?: string;
};

type PackState = {
  opportunity_id: string;
  opportunity_code?: string | null;
  investor_id: string;
  investor_name: string;
  documents: StoredDocument[];
  documents_ready: number;
  share_approved: boolean;
};

const API_ROOT = String(
  import.meta.env.VITE_TDVENTURE_API_BASE ||
  'https://staging.tdventure.vc/api'
).replace(/\/+$/, '');

const DOCUMENTS: DocumentSpec[] = [
  {
    key: 'pitch_deck',
    label: 'Investor-safe Pitch Deck',
    accept:
      '.pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation',
    acceptLabel: 'PDF / PPTX',
    maxBytes: 2 * 1024 * 1024,
    maxLabel: '2 MB',
  },
  {
    key: 'business_plan',
    label: 'Business Plan',
    accept:
      '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    acceptLabel: 'PDF / DOCX',
    maxBytes: 500 * 1024,
    maxLabel: '500 KB',
  },
  {
    key: 'three_year_projections',
    label: '3-Year Financial Projections',
    accept:
      '.pdf,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    acceptLabel: 'PDF / XLSX',
    maxBytes: 500 * 1024,
    maxLabel: '500 KB',
  },
  {
    key: 'revenue_evidence',
    label: 'Revenue Evidence',
    accept:
      '.pdf,.xlsx,.png,.jpg,.jpeg,.webp,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/png,image/jpeg,image/webp',
    acceptLabel: 'PDF / XLSX / image',
    maxBytes: 500 * 1024,
    maxLabel: '500 KB',
  },
];

function getLaunchContext(): LaunchContext | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(
      'tdventure_conversion_launch_context'
    );

    if (!raw) return null;

    const value = JSON.parse(raw) as LaunchContext;

    if (
      value?.source !== 'deal_desk' ||
      value?.purpose !== 'gate0_document_pack' ||
      !value?.opportunity_id
    ) {
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

function getToken(): string {
  if (typeof window === 'undefined') return '';

  return String(
    window.localStorage.getItem('tdventure_token') || ''
  ).trim();
}

async function readError(
  response: Response
): Promise<string> {
  try {
    const body = await response.json();

    return String(
      body?.detail ||
      body?.message ||
      `Request failed (${response.status})`
    );
  } catch {
    return `Request failed (${response.status})`;
  }
}

async function fileToBase64(
  file: File
): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || '');
      const comma = result.indexOf(',');

      if (comma === -1) {
        reject(new Error('Could not prepare document.'));
        return;
      }

      resolve(result.slice(comma + 1));
    };

    reader.onerror = () => {
      reject(new Error('Could not read document.'));
    };

    reader.readAsDataURL(file);
  });
}

export function DealDeskGate0Pack() {
  const context = useMemo(
    () => getLaunchContext(),
    []
  );

  const [pack, setPack] = useState<PackState | null>(
    null
  );

  const [files, setFiles] = useState<
    Record<string, File | null>
  >({});

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [uploading, setUploading] = useState<
    Record<string, boolean>
  >({});

  const [consent, setConsent] = useState(false);
  const [loadingPack, setLoadingPack] = useState(false);
  const [savingConsent, setSavingConsent] =
    useState(false);

  const [message, setMessage] = useState('');

  const opportunityId =
    context?.opportunity_id || '';

  const investorName =
    pack?.investor_name ||
    context?.investor_name ||
    'this investor';

  const loadPack = async () => {
    if (!opportunityId) return;

    const token = getToken();

    if (!token) {
      setMessage(
        'TD Venture session is unavailable. Open Conversion again from TD Venture.'
      );
      return;
    }

    setLoadingPack(true);

    try {
      const response = await fetch(
        `${API_ROOT}/conversion/gate0/${encodeURIComponent(
          opportunityId
        )}/pack`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          await readError(response)
        );
      }

      const data = await response.json() as PackState;

      setPack(data);
      setConsent(Boolean(data.share_approved));
      setMessage('');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not load Gate 0 pack.'
      );
    } finally {
      setLoadingPack(false);
    }
  };

  useEffect(() => {
    if (context) {
      void loadPack();
    }
  }, [opportunityId]);

  if (!context) return null;

  const storedDocument = (
    key: string
  ): StoredDocument | undefined =>
    pack?.documents?.find(
      (item) => item.document_key === key
    );

  const handleFile = (
    spec: DocumentSpec,
    file: File | null
  ) => {
    if (!file) {
      setFiles((current) => ({
        ...current,
        [spec.key]: null,
      }));

      setErrors((current) => ({
        ...current,
        [spec.key]: '',
      }));

      return;
    }

    if (file.size > spec.maxBytes) {
      setFiles((current) => ({
        ...current,
        [spec.key]: null,
      }));

      setErrors((current) => ({
        ...current,
        [spec.key]:
          `${spec.label} must be no larger than ${spec.maxLabel}.`,
      }));

      return;
    }

    setFiles((current) => ({
      ...current,
      [spec.key]: file,
    }));

    setErrors((current) => ({
      ...current,
      [spec.key]: '',
    }));
  };

  const uploadDocument = async (
    spec: DocumentSpec
  ) => {
    const file = files[spec.key];

    if (!file || !opportunityId) return;

    const token = getToken();

    if (!token) {
      setErrors((current) => ({
        ...current,
        [spec.key]: 'TD Venture session unavailable.',
      }));
      return;
    }

    setUploading((current) => ({
      ...current,
      [spec.key]: true,
    }));

    setErrors((current) => ({
      ...current,
      [spec.key]: '',
    }));

    try {
      const contentBase64 = await fileToBase64(file);

      const response = await fetch(
        `${API_ROOT}/conversion/gate0/${encodeURIComponent(
          opportunityId
        )}/documents/${encodeURIComponent(spec.key)}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
            content_type:
              file.type || 'application/octet-stream',
            content_base64: contentBase64,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          await readError(response)
        );
      }

      setFiles((current) => ({
        ...current,
        [spec.key]: null,
      }));

      setConsent(false);

      setMessage(
        `${spec.label} saved. Any previous sharing approval has been cleared.`
      );

      await loadPack();
    } catch (error) {
      setErrors((current) => ({
        ...current,
        [spec.key]:
          error instanceof Error
            ? error.message
            : 'Could not save document.',
      }));
    } finally {
      setUploading((current) => ({
        ...current,
        [spec.key]: false,
      }));
    }
  };

  const savePermission = async (
    approved: boolean
  ) => {
    if (!opportunityId) return;

    if (approved && pack?.documents_ready !== 4) {
      setMessage(
        'All four Gate 0 documents must be saved before sharing can be approved.'
      );
      return;
    }

    if (approved && !consent) {
      setMessage(
        'Confirm the founder permission statement before approving sharing.'
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setMessage('TD Venture session unavailable.');
      return;
    }

    setSavingConsent(true);

    try {
      const response = await fetch(
        `${API_ROOT}/conversion/gate0/${encodeURIComponent(
          opportunityId
        )}/share-permission`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            approved,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          await readError(response)
        );
      }

      setMessage(
        approved
          ? `Sharing permission recorded for ${investorName}.`
          : 'Documents remain private. No investor sharing is authorised.'
      );

      await loadPack();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not record founder permission.'
      );
    } finally {
      setSavingConsent(false);
    }
  };

  const readyCount =
    pack?.documents_ready || 0;

  return (
    <section className="mt-5 rounded-2xl border border-[#D4FF00]/30 bg-[#080D1A] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.28em] text-[#D4FF00]">
            Deal Desk Gate 0
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            Gate 0 Document Pack
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Prepare the investor-safe documents requested for this
            specific Deal Desk opportunity with{' '}
            <span className="font-black text-white">
              {investorName}
            </span>.
          </p>

          {(pack?.opportunity_code ||
            context.opportunity_code) && (
            <p className="mt-2 font-mono text-[11px] text-slate-500">
              Opportunity{' '}
              {pack?.opportunity_code ||
                context.opportunity_code}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-black/30 px-4 py-3 text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Pack readiness
          </p>
          <p className="mt-1 text-lg font-black text-white">
            {loadingPack ? '…' : `${readyCount} / 4`}
          </p>

          {pack?.share_approved && (
            <p className="mt-1 text-[10px] font-black uppercase text-[#D4FF00]">
              Sharing approved
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-amber-300">
          Investor-safe documents only
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          Do not include confidential intellectual property, trade
          secrets, source code, passwords or credentials, personal or
          customer data, proprietary formulas or processes, or other
          sensitive information.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {DOCUMENTS.map((spec) => {
          const stored = storedDocument(spec.key);
          const selected = files[spec.key];
          const busy = Boolean(uploading[spec.key]);

          return (
            <div
              key={spec.key}
              className="rounded-xl border border-slate-800 bg-[#0B1220] p-4"
            >
              <p className="text-sm font-black text-white">
                {spec.label}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                {spec.acceptLabel} · maximum {spec.maxLabel}
              </p>

              {stored && (
                <div className="mt-3 rounded-lg border border-[#D4FF00]/20 bg-[#D4FF00]/5 px-3 py-2">
                  <p className="text-xs font-bold text-[#D4FF00]">
                    Saved
                  </p>
                  <p className="mt-1 break-all text-[11px] text-slate-300">
                    {stored.original_filename}
                  </p>
                </div>
              )}

              <input
                type="file"
                accept={spec.accept}
                disabled={busy}
                className="mt-3 block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
                onChange={(event) =>
                  handleFile(
                    spec,
                    event.target.files?.[0] || null
                  )
                }
              />

              {selected && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void uploadDocument(spec)
                  }
                  className="mt-3 rounded-lg bg-[#D4FF00] px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-950 disabled:opacity-50"
                >
                  {busy
                    ? 'Saving…'
                    : stored
                    ? 'Replace saved document'
                    : 'Save document'}
                </button>
              )}

              {errors[spec.key] && (
                <p className="mt-2 text-xs text-red-300">
                  {errors[spec.key]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-black/20 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            disabled={savingConsent}
            onChange={(event) =>
              setConsent(event.target.checked)
            }
            className="mt-1 h-4 w-4"
          />

          <span className="text-xs leading-5 text-slate-300">
            <strong className="text-white">
              Founder Permission to Share Gate 0 Documents.
            </strong>{' '}
            I am comfortable sharing these Gate 0 documents for this
            specific Deal Desk opportunity with {investorName}. I
            confirm that the documents are investor-safe versions and
            do not contain confidential IP, trade secrets, source
            code, credentials, personal/customer data, proprietary
            formulas or other sensitive information.
          </span>
        </label>

        <p className="mt-3 text-[11px] leading-5 text-slate-500">
          Saving documents does not share them with the investor.
          Founder permission and TD Venture Gate 0 verification are
          separate controls. TD verification does not create sharing
          permission.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={
              savingConsent ||
              !consent ||
              readyCount !== 4
            }
            onClick={() =>
              void savePermission(true)
            }
            className="rounded-xl bg-[#D4FF00] px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {savingConsent
              ? 'Recording…'
              : `Approve sharing with ${investorName}`}
          </button>

          <button
            type="button"
            disabled={savingConsent}
            onClick={() =>
              void savePermission(false)
            }
            className="rounded-xl border border-slate-700 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-300 disabled:opacity-40"
          >
            Not now — keep private
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-4 rounded-xl border border-slate-800 bg-black/30 px-4 py-3 text-xs text-slate-300">
          {message}
        </p>
      )}
    </section>
  );
}

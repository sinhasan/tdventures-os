const DEFAULT_TDVENTURE_API_BASE = 'https://staging.tdventure.vc/api';
const DEFAULT_TDVENTURE_PAYMENT_BASE = 'https://staging.tdventure.vc/payment.html';
const DEFAULT_TDVENTURE_WORKSPACE_URL = 'https://conversion.tdventure.vc/';

function withoutTrailingSlash(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

export const TDVENTURE_API_BASE = withoutTrailingSlash(
  String(import.meta.env.VITE_TDVENTURE_API_BASE || DEFAULT_TDVENTURE_API_BASE)
);

export const CONVERSION_API_BASE = `${TDVENTURE_API_BASE}/conversion`;

export const TDVENTURE_PAYMENT_BASE = String(
  import.meta.env.VITE_TDVENTURE_PAYMENT_BASE || DEFAULT_TDVENTURE_PAYMENT_BASE
).trim();

export const TDVENTURE_WORKSPACE_URL = String(
  import.meta.env.VITE_TDVENTURE_WORKSPACE_URL || DEFAULT_TDVENTURE_WORKSPACE_URL
).trim();

export type ConversionHealth = {
  status: string;
  module: string;
  principle: string;
  raw_file_stored: boolean;
  raw_extracted_text_stored: boolean;
};

export type ConversionSignalResponse = {
  ok: boolean;
  signal: unknown;
  storage_rule: {
    raw_file_stored: boolean;
    raw_extracted_text_stored: boolean;
  };
};

export type ConversionHandoffParams = {
  startup_id?: string;
  conversion_signal_id?: string;
  status?: string;
  crm_status?: string;
  follow_up_task?: string;
  owner_note?: string;
};

export type ConversionHandoffResponse = {
  ok: boolean;
  message: string;
  handoff: unknown;
  handoff_payload: unknown;
};

export type StartupIdentityResponse = {
  id?: string;
  startup_id?: string;
  startup_name?: string;
  email?: string;
  [key: string]: unknown;
};

export type PaymentIntentCreateResponse = {
  ok: boolean;
  intent_token: string;
  checkout_url: string;
  intent: {
    workspace: string;
    plan_code: string;
    display_name: string;
    status: string;
    provider: string;
    commercial_amount: string | number;
    amount_to_charge: string | number;
    currency: string;
    validity_days: number;
    credits_total: number;
    test_mode: boolean;
    customer_email: string;
    expires_at: string;
    paid_at: string | null;
    return_url: string;
    provider_session_id: string | null;
  };
};

export type WorkspaceLaunchExchangeResponse = {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  role: string;
  email_verified: boolean;
};

export type TdventureCurrentUser = {
  id: string;
  email: string;
  full_name?: string | null;
  role: string;
  created_at?: string | null;
};

export type ConversionWorkspaceAccess = {
  ok: boolean;
  allowed: boolean;
  role: string;
  profile_type: 'startup' | 'investor' | 'admin';
  profile_id: string | null;
};

export type ProfilePlaneStartupProfile = {
  id: string;
  email: string;
  is_active: boolean;
  startup_name?: string | null;
  founder_name?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  sector?: string | null;
  stage?: string | null;
  website?: string | null;
  pitch_summary?: string | null;
  ask?: string | null;
  linkedin_profile?: string | null;
  social_media_handles?: string | null;
};

export type ProfilePlaneResolution = {
  state:
    | 'linked'
    | 'claim_available'
    | 'application_required'
    | 'verification_required'
    | 'ambiguous';
  role?: string | null;
  profile_type?: 'startup' | 'investor' | 'admin' | null;
  profile_id?: string | null;
  profile?: ProfilePlaneStartupProfile | null;
  reason?: string | null;
};

export type ConversionPreviewAnalysis = {
  pitch_deck_quality: number;
  narrative_clarity: number;
  fundraise_readiness: number;
  risk_level: 'Low' | 'Moderate' | 'High';
  risk_flags: string[];
  next_best_action: string;
};

export type ConversionPreviewResponse = {
  ok: boolean;
  usage_type: 'preview';
  provider: string;
  model: string;
  analysis_version: string;
  generated_at: string;
  analysis: ConversionPreviewAnalysis;
  signal: null;
  preview_limitations: Record<string, string>;
  credits: {
    total: number;
    reserved: number;
    consumed: number;
    remaining: number;
    status: string;
  };
  storage_rule: {
    raw_file_stored: boolean;
    raw_extracted_text_stored: boolean;
    conversion_signal_saved: boolean;
  };
};

export type ConversionPreviewParams = {
  startupId: string;
  idempotencyKey: string;
  startupName?: string;
  sector?: string;
  stage?: string;
  raiseAmount?: string;
  pitchSummary: string;
  tractionProof?: string;
  riskNotes?: string;
  targetInvestor?: string;
};

export type ConversionDimensionAssessment = {
  key: string;
  ai_rating: number;
  evidence_status:
    | 'Missing'
    | 'Claimed'
    | 'AI-supported'
    | 'Contradicted';
  rationale: string;
  interview_question: string;
  sources: string[];
};

export type ConversionProfileVerification = {
  status:
    | 'not_verified'
    | 'profile_verified'
    | 'verification_declined';
  label: string;
  display_tone: 'destructive' | 'neon';
  execution_allowed: true;
  verified_at: string | null;
  verified_claim_count: number;
  accepted_claim_keys?: string[];
  scope: string | null;
  disclaimer: string;
};

export type ConversionV2Analysis = {
  founder_claim_score: number;
  ai_evidence_score: number;
  weighted_base_score: number;
  openai_contribution_points?: number;
  founder_contribution_before_sector?: number;
  founder_contribution_after_sector?: number;
  sector_adjustment_points: 0 | -10;
  sector_contribution_points?: number;
  is_hot_sector: boolean;
  conversion_score: number;
  founder_ai_gap: number;
  gap_classification: string;
  reliability_score: number;
  pitch_deck_quality: number | null;
  narrative_clarity: number;
  fundraise_readiness: number;
  investor_fit: number;
  traction_strength: number;
  confidence_level: 'Low' | 'Medium' | 'High';
  risk_level: 'Low' | 'Moderate' | 'High';
  risk_flags: string[];
  leading_signals: Array<{
    signal: string;
    strength: 'Weak' | 'Moderate' | 'Strong';
    evidence_status:
      | 'Missing'
      | 'Claimed'
      | 'Partially supported'
      | 'Supported';
  }>;
  contradictions: Array<{ field: string; issue: string }>;
  missing_evidence: Array<{
    item: string;
    priority: 'Low' | 'Medium' | 'High';
  }>;
  dimension_assessments: ConversionDimensionAssessment[];
  behaviour_assessment: {
    consistency_score: number;
    specificity_score: number;
    proof_discipline_score: number;
    anomaly_level: 'Low' | 'Moderate' | 'High';
    explanation: string;
  };
  sector_intelligence: {
    structural_score: number;
    confidence: 'Low' | 'Medium' | 'High';
    rationale: string;
  };
  deck_assessment: {
    status: 'Analysed' | 'Not supplied';
    score: number | null;
    analysis_mode: 'text_and_visual' | 'text_only' | 'not_assessed';
    filename: string | null;
    limitation: string;
  };
  interview_questions: Array<{
    claim_key: string;
    label: string;
    question: string;
    reason: string;
    priority: 'High' | 'Medium';
  }>;
  score_formula: {
    founder_weight: number;
    openai_weight: number;
    hot_sector_threshold: number;
    non_hot_sector_founder_penalty: number;
    sector_adjustment_rule: string;
    rule: string;
  };
  profile_verification: ConversionProfileVerification;
  investment_thesis: string;
  investor_summary: string;
  crm_summary: string;
  next_best_action: string;
  deal_desk_recommendation: string;
};

export type ConversionClaimReview = {
  id: string;
  startup_id: string;
  conversion_signal_id: string;
  review_status:
    | 'analysis_complete'
    | 'interview_required'
    | 'interview_submitted'
    | 'profile_verified'
    | 'verification_declined';
  claims: ConversionDimensionAssessment[];
  interview_questions: ConversionV2Analysis['interview_questions'];
  interview_responses: Record<string, string>;
  verification_scope: string | null;
  accepted_claim_keys: string[];
  verified_claim_count: number;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ConversionV2ContextResponse = {
  ok: boolean;
  profile: {
    id: string;
    startup_name: string;
    sector: string;
    stage: string;
    geography: string;
    city: string;
    country: string;
    ask_usd: string | null;
  };
  evidence: {
    id: string;
    rubric_version: string;
    revision: number;
    status: string;
    completion_count: number;
    evidence_count: number;
    founder_claim_score: number;
    facts: Record<string, unknown>;
    claims: Array<{
      key: string;
      label: string;
      rating: number;
      evidence: string;
    }>;
    updated_at: string;
  };
  current_analysis: ConversionV2Analysis | null;
  generated_at: string | null;
  claim_review: ConversionClaimReview | null;
};

export type ConversionV2Response = {
  ok: boolean;
  usage_type: 'preview' | 'paid';
  provider: string;
  model: string;
  analysis_version: string;
  generated_at: string;
  analysis: ConversionV2Analysis;
  signal: unknown | null;
  claim_review: ConversionClaimReview | null;
  credits: {
    total: number;
    reserved: number;
    consumed: number;
    remaining: number;
    status: string;
    expires_at?: string | null;
  };
  storage_rule: {
    raw_file_stored: false;
    raw_extracted_text_stored: false;
    conversion_signal_saved: boolean;
  };
};

export type ConversionV2Params = {
  startupId: string;
  usageType: 'preview' | 'paid';
  idempotencyKey?: string;
  pitchSummary?: string;
  tractionProof?: string;
  riskNotes?: string;
  targetInvestor?: string;
  deckFile?: File | null;
};

export type TdventureLoginResponse = {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  role: string;
  email_verified: boolean;
};

export function clearStoredTdventureToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('tdventure_token');
}

export async function loginTdventureAccount(
  email: string,
  password: string
): Promise<TdventureCurrentUser> {
  const body = new URLSearchParams();

  body.set('username', email.trim().toLowerCase());
  body.set('password', password);

  const response = await fetch(
    `${TDVENTURE_API_BASE}/auth/login`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    }
  );

  if (!response.ok) {
    const rawBody = await response.text();
    let message = rawBody.trim();

    if (message) {
      try {
        const parsed = JSON.parse(message) as {
          detail?: string;
          message?: string;
        };

        message =
          parsed.detail ||
          parsed.message ||
          message;
      } catch {
        // Preserve a plain-text backend response.
      }
    }

    throw new Error(
      message ||
      'Incorrect email or password.'
    );
  }

  const login =
    await response.json() as
      TdventureLoginResponse;

  const accessToken =
    String(login.access_token || '').trim();

  if (!accessToken) {
    throw new Error(
      'TD Venture login did not return a valid session.'
    );
  }

  window.localStorage.setItem(
    'tdventure_token',
    accessToken
  );

  try {
    return await getTdventureCurrentUser();
  } catch (error) {
    clearStoredTdventureToken();
    throw error;
  }
}

export type TdventureSessionInitialization = {
  token: string | null;
  exchanged: boolean;
};

let launchExchangePromise: Promise<string> | null = null;

export function getStoredTdventureToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('tdventure_token');
}

function scrubWorkspaceLaunchParameters(url: URL): void {
  url.searchParams.delete('launch');
  url.searchParams.delete('token');
  window.history.replaceState({}, document.title, url.toString());
}

async function exchangeWorkspaceLaunchToken(rawLaunchToken: string): Promise<string> {
  const response = await fetch(`${CONVERSION_API_BASE}/launch/exchange`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      launch_token: rawLaunchToken
    })
  });

  if (!response.ok) {
    const rawBody = await response.text();
    let message = rawBody.trim();

    if (message) {
      try {
        const parsed = JSON.parse(message) as { detail?: string; message?: string };
        message = parsed.detail || parsed.message || message;
      } catch {
        // Preserve a non-JSON backend error as received.
      }
    }

    throw new Error(
      message || `TD Venture launch exchange failed with API error ${response.status}`
    );
  }

  const data = (await response.json()) as WorkspaceLaunchExchangeResponse;
  const accessToken = String(data.access_token || '').trim();

  if (!accessToken) {
    throw new Error('TD Venture launch exchange did not return a session token.');
  }

  window.localStorage.setItem('tdventure_token', accessToken);
  return accessToken;
}

export async function initializeTdventureSessionFromLaunch():
  Promise<TdventureSessionInitialization> {
  if (typeof window === 'undefined') {
    return {
      token: null,
      exchanged: false
    };
  }

  if (launchExchangePromise) {
    return {
      token: await launchExchangePromise,
      exchanged: true
    };
  }

  const url = new URL(window.location.href);
  const rawLaunchToken = String(url.searchParams.get('launch') || '').trim();
  const hasLegacyUrlToken = url.searchParams.has('token');

  if (rawLaunchToken || hasLegacyUrlToken) {
    scrubWorkspaceLaunchParameters(url);
  }

  if (!rawLaunchToken) {
    if (hasLegacyUrlToken) {
      throw new Error(
        'Legacy token links are no longer accepted. Open Conversion again from TD Venture.'
      );
    }

    return {
      token: getStoredTdventureToken(),
      exchanged: false
    };
  }

  if (rawLaunchToken.length < 32 || rawLaunchToken.length > 512) {
    throw new Error('The TD Venture workspace launch link is invalid.');
  }

  launchExchangePromise = exchangeWorkspaceLaunchToken(rawLaunchToken);

  try {
    const token = await launchExchangePromise;
    return {
      token,
      exchanged: true
    };
  } catch (error) {
    window.localStorage.removeItem('tdventure_token');
    throw error;
  } finally {
    launchExchangePromise = null;
  }
}


async function tdventureRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await initializeTdventureSessionFromLaunch();
  const token = session.token || getStoredTdventureToken();

  if (!token) {
    throw new Error(
      'Your TD Venture session was not found. Please open Conversion from your TD Venture workspace.'
    );
  }

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${TDVENTURE_API_BASE}${normalizedPath}`, {
    ...options,
    credentials: 'include',
    headers
  });

  if (!response.ok) {
    const rawBody = await response.text();
    let message = rawBody.trim();

    if (message) {
      try {
        const parsed = JSON.parse(message) as { detail?: string; message?: string };
        message = parsed.detail || parsed.message || message;
      } catch {
        // Preserve a non-JSON backend error as received.
      }
    }

    throw new Error(
      message || `TD Venture API error ${response.status} ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getTdventureCurrentUser():
  Promise<TdventureCurrentUser> {
  return tdventureRequest<TdventureCurrentUser>('/auth/me');
}

export async function getConversionWorkspaceAccess():
  Promise<ConversionWorkspaceAccess> {
  return tdventureRequest<ConversionWorkspaceAccess>(
    '/conversion/access'
  );
}

type ProfilePlaneCurrentResponse = {
  ok: boolean;
  resolution: ProfilePlaneResolution;
};

export async function getCurrentProfilePlane():
  Promise<ProfilePlaneResolution> {
  const response =
    await tdventureRequest<ProfilePlaneCurrentResponse>(
      '/profile-plane/current'
    );

  if (!response || !response.resolution) {
    throw new Error(
      'TD Venture did not return a valid profile resolution.'
    );
  }

  return response.resolution;
}


async function conversionRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await initializeTdventureSessionFromLaunch();
  const token = session.token || getStoredTdventureToken();

  if (!token) {
    throw new Error('TD Venture authentication token was not found.');
  }

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${CONVERSION_API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const body = await response.text();
    const detail = body.trim() ? `: ${body}` : '';
    throw new Error(
      `Conversion API error ${response.status} ${response.statusText}${detail}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function checkConversionHealth(): Promise<ConversionHealth> {
  const response = await fetch(`${CONVERSION_API_BASE}/health`, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(
      `Conversion health failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<ConversionHealth>;
}

export function getCurrentConversionSignal(
  startupId: string
): Promise<ConversionSignalResponse> {
  const normalizedStartupId = startupId.trim();

  if (!normalizedStartupId) {
    return Promise.reject(
      new Error('A startup ID is required to load the current signal.')
    );
  }

  return conversionRequest<ConversionSignalResponse>(
    `/signal/current/${encodeURIComponent(normalizedStartupId)}`,
    { method: 'GET' }
  );
}

export function createConversionHandoff(
  params: ConversionHandoffParams
): Promise<ConversionHandoffResponse> {
  return conversionRequest<ConversionHandoffResponse>('/handoff', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
function createAnalysisIdempotencyKey(): string {
  const randomPart =
    typeof window !== 'undefined' &&
    window.crypto &&
    typeof window.crypto.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `conversion-preview-${randomPart}`;
}

export function runConversionPreview(
  params: ConversionPreviewParams
): Promise<ConversionPreviewResponse> {
  const startupId = params.startupId.trim();

  if (!startupId) {
    return Promise.reject(
      new Error('A canonical startup profile is required for Preview Analysis.')
    );
  }

  return conversionRequest<ConversionPreviewResponse>('/analyze', {
    method: 'POST',
    body: JSON.stringify({
      startup_id: startupId,
      usage_type: 'preview',
      idempotency_key: params.idempotencyKey || createAnalysisIdempotencyKey(),
      startup_name: params.startupName?.trim() || undefined,
      sector: params.sector?.trim() || undefined,
      stage: params.stage?.trim() || undefined,
      raise_amount: params.raiseAmount?.trim() || undefined,
      pitch_summary: params.pitchSummary.trim(),
      traction_proof: params.tractionProof?.trim() || undefined,
      risk_notes: params.riskNotes?.trim() || undefined,
      target_investor: params.targetInvestor?.trim() || undefined
    })
  });
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(
      new Error('The pitch deck could not be read.')
    );
    reader.onload = () => {
      const result = String(reader.result || '');
      const separator = result.indexOf(',');
      resolve(separator >= 0 ? result.slice(separator + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

export function getConversionV2Context(
  startupId: string
): Promise<ConversionV2ContextResponse> {
  return conversionRequest<ConversionV2ContextResponse>(
    `/context/${encodeURIComponent(startupId.trim())}`,
    { method: 'GET' }
  );
}

export async function runConversionV2(
  params: ConversionV2Params
): Promise<ConversionV2Response> {
  const startupId = params.startupId.trim();
  if (!startupId) {
    throw new Error(
      'A canonical startup profile is required for Conversion Review.'
    );
  }

  const deckFile = params.deckFile || null;
  if (deckFile && deckFile.size > 8 * 1024 * 1024) {
    throw new Error('Pitch deck must be no larger than 8 MB.');
  }

  const extension = deckFile
    ? deckFile.name.split('.').pop()?.toLowerCase()
    : '';
  if (deckFile && !['pdf', 'pptx'].includes(extension || '')) {
    throw new Error('Upload a PDF or PPTX pitch deck.');
  }

  const deckBase64 = deckFile
    ? await readFileAsBase64(deckFile)
    : undefined;

  return conversionRequest<ConversionV2Response>('/analyze-v2', {
    method: 'POST',
    body: JSON.stringify({
      startup_id: startupId,
      usage_type: params.usageType,
      idempotency_key:
        params.idempotencyKey || createAnalysisIdempotencyKey(),
      pitch_summary: params.pitchSummary?.trim() || undefined,
      traction_proof: params.tractionProof?.trim() || undefined,
      risk_notes: params.riskNotes?.trim() || undefined,
      target_investor: params.targetInvestor?.trim() || undefined,
      deck_filename: deckFile?.name,
      deck_mime_type: deckFile?.type,
      deck_base64: deckBase64
    })
  });
}

export async function getConversionClaimReview(
  startupId: string
): Promise<ConversionClaimReview | null> {
  const response = await conversionRequest<{
    ok: boolean;
    claim_review: ConversionClaimReview | null;
  }>(
    `/claim-review/${encodeURIComponent(startupId.trim())}`,
    { method: 'GET' }
  );
  return response.claim_review;
}

export async function saveConversionInterview(
  reviewId: string,
  responses: Record<string, string>
): Promise<ConversionClaimReview> {
  const result = await conversionRequest<{
    ok: boolean;
    claim_review: ConversionClaimReview;
  }>(
    `/claim-review/${encodeURIComponent(reviewId)}/interview`,
    {
      method: 'PUT',
      body: JSON.stringify({ responses })
    }
  );
  return result.claim_review;
}

function createPaymentIdempotencyKey(): string {
  const randomPart = (
    typeof window !== 'undefined'
    && window.crypto
    && typeof window.crypto.randomUUID === 'function'
  )
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `conversion-founder-${randomPart}`;
}

function validateCheckoutUrl(checkoutUrl: string): string {
  let expected: URL;
  let actual: URL;

  try {
    expected = new URL(TDVENTURE_PAYMENT_BASE);
    actual = new URL(checkoutUrl);
  } catch {
    throw new Error('The secure checkout URL is invalid.');
  }

  if (
    actual.protocol !== 'https:'
    || actual.origin !== expected.origin
    || actual.pathname !== expected.pathname
  ) {
    throw new Error(
      'The secure checkout URL did not match the approved TD Venture Payment Plane.'
    );
  }

  return actual.toString();
}

export async function startConversionFounderCheckout(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Secure checkout is available only in the browser.');
  }

  const startup = await tdventureRequest<StartupIdentityResponse>(
    '/startups/me',
    { method: 'GET' }
  );

  const startupId = (
    typeof startup.id === 'string'
      ? startup.id
      : (typeof startup.startup_id === 'string' ? startup.startup_id : '')
  ).trim();

  if (!startupId) {
    throw new Error(
      'No founder startup profile is linked to this TD Venture account.'
    );
  }

  let workspaceReturnUrl: string;

  try {
    const parsedWorkspaceUrl = new URL(TDVENTURE_WORKSPACE_URL);
    if (parsedWorkspaceUrl.protocol !== 'https:') {
      throw new Error();
    }
    workspaceReturnUrl = parsedWorkspaceUrl.toString();
  } catch {
    throw new Error('The Conversion workspace return URL is invalid.');
  }

  const paymentIntent = await tdventureRequest<PaymentIntentCreateResponse>(
    '/payment-plane/intents',
    {
      method: 'POST',
      body: JSON.stringify({
        plan_code: 'conversion_founder_2999',
        subject_id: startupId,
        idempotency_key: createPaymentIdempotencyKey(),
        return_url: workspaceReturnUrl
      })
    }
  );

  const checkoutUrl = validateCheckoutUrl(
    String(paymentIntent.checkout_url || '').trim()
  );

  window.location.assign(checkoutUrl);
}

export type DealDeskWorkspaceLaunchResponse = {
  ok: boolean;
  workspace: 'deal_desk';
  launch_url: string;
  expires_in_seconds: number;
  expires_at: string;
};

export async function createDealDeskWorkspaceLaunch():
  Promise<DealDeskWorkspaceLaunchResponse> {
  const session =
    await initializeTdventureSessionFromLaunch();

  const token =
    session.token || getStoredTdventureToken();

  if (!token) {
    throw new Error(
      'Your TD Venture session was not found. Open Conversion from Private Marketplace again.'
    );
  }

  const canonicalApiRoot =
    CONVERSION_API_BASE.replace(
      /\/conversion\/?$/,
      ''
    );

  const response = await fetch(
    `${canonicalApiRoot}/deal-desk/launch`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const rawBody = await response.text();
    let message = rawBody.trim();

    try {
      const parsed = JSON.parse(rawBody);

      if (
        parsed &&
        typeof parsed.detail === 'string'
      ) {
        message = parsed.detail;
      }
    } catch {
      // Preserve the plain-text backend message.
    }

    throw new Error(
      message ||
      'Could not open Deal Desk securely.'
    );
  }

  const data =
    await response.json() as
      DealDeskWorkspaceLaunchResponse;

  if (
    !data.launch_url ||
    !data.launch_url.startsWith(
      'https://crm.tdventure.vc/'
    )
  ) {
    throw new Error(
      'Deal Desk returned an invalid secure launch URL.'
    );
  }

  return data;
}

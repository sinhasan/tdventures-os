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

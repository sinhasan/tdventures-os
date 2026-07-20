export const CONVERSION_API_BASE = 'https://staging.tdventure.vc/api/conversion';

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

export function getStoredTdventureToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const url = new URL(window.location.href);
  const tokenFromUrl = url.searchParams.get('token');

  if (tokenFromUrl) {
    window.localStorage.setItem('tdventure_token', tokenFromUrl);
    url.searchParams.delete('token');
    window.history.replaceState({}, document.title, url.toString());
    return tokenFromUrl;
  }

  return window.localStorage.getItem('tdventure_token');
}

async function conversionRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredTdventureToken();

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

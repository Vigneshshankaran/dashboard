/**
 * client.ts — the "telephone" that talks to the backend server.
 *
 * One shared `request()` function handles everything every API call needs:
 *  - prefixes the backend address (VITE_API_BASE_URL from .env)
 *  - attaches your login token (unless `skipAuth` is set)
 *  - serializes JSON bodies and query parameters
 *  - turns bad responses into a typed ApiError
 *
 * The `client` object below is just a shorthand for the 5 HTTP verbs.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, any>;
  skipAuth?: boolean;
}

// ─── Automatic token refresh ──────────────────────────────────────────────────
// When the access token expires (HTTP 401), we silently exchange the refresh
// token for a new one and retry the request — the user never gets kicked out
// mid-session. If the refresh itself fails, we broadcast 'auth:expired' so the
// app can return to the login screen cleanly.

let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  // Single-flight: if several requests hit 401 at once, refresh only once
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { Accept: 'application/json', refreshToken },
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json().catch(() => null);
        const payload = data?.data ?? data;
        const newAccess = payload?.access_token;
        if (!newAccess) return false;
        localStorage.setItem('authToken', newAccess);
        if (payload?.refresh_token) {
          localStorage.setItem('refreshToken', payload.refresh_token);
        }
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

function notifySessionExpired() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  window.dispatchEvent(new Event('auth:expired'));
}

export async function request<T = any>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { method = 'GET', headers = {}, body, queryParams, skipAuth = false } = options;

  // Set up headers
  const requestHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...headers,
  };

  // Content type for JSON payloads
  if (body && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  // Inject Bearer token if present
  if (!skipAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Construct URL with query parameters
  let url = `${BASE_URL}${path}`;
  if (queryParams) {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Formulate Fetch RequestInit
  const init: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    init.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, init);

  // Access token expired? Refresh once and retry the original request.
  if (response.status === 401 && !skipAuth && !isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request<T>(path, options, true);
    }
    notifySessionExpired();
  }

  const text = await response.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    let errorMessage = '';
    if (data) {
      if (typeof data === 'string') {
        errorMessage = data;
      } else {
        errorMessage = data.message || data.errorMessage || data.error || JSON.stringify(data);
      }
    }
    if (!errorMessage) {
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const client = {
  get: <T = any>(path: string, queryParams?: Record<string, any>, headers?: Record<string, string>) =>
    request<T>(path, { method: 'GET', queryParams, headers }),

  post: <T = any>(path: string, body?: any, queryParams?: Record<string, any>, headers?: Record<string, string>) =>
    request<T>(path, { method: 'POST', body, queryParams, headers }),

  put: <T = any>(path: string, body?: any, queryParams?: Record<string, any>, headers?: Record<string, string>) =>
    request<T>(path, { method: 'PUT', body, queryParams, headers }),

  delete: <T = any>(path: string, queryParams?: Record<string, any>, headers?: Record<string, string>) =>
    request<T>(path, { method: 'DELETE', queryParams, headers }),

  patch: <T = any>(path: string, body?: any, queryParams?: Record<string, any>, headers?: Record<string, string>) =>
    request<T>(path, { method: 'PATCH', body, queryParams, headers }),
};

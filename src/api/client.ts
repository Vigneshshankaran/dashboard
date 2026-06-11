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

export async function request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
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
  const text = await response.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage = data?.message || data || `HTTP error! status: ${response.status}`;
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

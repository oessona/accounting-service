// Use NEXT_PUBLIC_API_URL when provided. During local development, fall back to
// http://localhost:8090 so API calls still work if the env wasn't picked up.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
  || (process.env.NODE_ENV === 'development' ? 'http://localhost:8090' : '')) as string;

type FetchOptions = RequestInit & { silent?: boolean };

async function apiFetch(path: string, opts: FetchOptions = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  // Helpful dev-time warning when API_BASE isn't configured and we're calling a relative path.
  if (!API_BASE && !path.startsWith('http')) {
    // eslint-disable-next-line no-console
    console.warn('[apiFetch] NEXT_PUBLIC_API_URL is not set — calling relative path', path);
  }

  // Get token from localStorage (works in browser, not in SSR)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const { silent, ...fetchOpts } = opts;
  
  // Build headers with token if available
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(fetchOpts.headers as Record<string, string> || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    credentials: 'include', // default to include cookies for Sanctum
    headers,
    ...fetchOpts,
  });

  if (!res.ok) {
    if (silent) return null;
    // Try to parse JSON error body, fall back to plain text if not JSON
    let body: any = null;
    let text: string | null = null;
    try {
      body = await res.clone().json();
    } catch (jsonErr) {
      try {
        text = await res.clone().text();
      } catch (textErr) {
        text = null;
      }
    }

    const message = (body && (body.message || body.error || JSON.stringify(body))) || text || res.statusText || 'Request failed';
    const err: any = new Error(`${res.status} ${message}`);
    err.status = res.status;
    err.body = body ?? text;
    err.url = url;
    throw err;
  }

  // try to parse json, otherwise return null
  return res.text().then((t) => {
    try {
      return t ? JSON.parse(t) : null;
    } catch (e) {
      return t;
    }
  });
}

export default apiFetch;
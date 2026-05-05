// Central API host configuration used by the frontend.
// - Use `VITE_API_URL` when set at build time (Railway/CI).
// - In development mode, default to `http://localhost:5001`.
// - In production, if no VITE_API_URL is provided, fall back to same-origin.

const MODE = import.meta.env.MODE;

const DEFAULT_LOCAL = 'http://localhost:5001';

// Support both Vite (`VITE_API_URL`) and CRA (`REACT_APP_API_URL`) env vars.
const viteHost = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : null;
const craHost = typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : null;

const API_HOST = (() => {
  if (viteHost) return viteHost;
  if (craHost) return craHost;
  if (MODE === 'development') return DEFAULT_LOCAL;
  if (typeof window !== 'undefined') return window.location.origin.replace(/\/$/, '');
  return '';
})();

const API_URL = `${API_HOST}/api`;

export { API_HOST, API_URL };

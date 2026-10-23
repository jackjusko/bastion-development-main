/**
 * REST client for the Bastion Express API.
 * Auth uses the custom `token` header, matching the Vue client.
 */
import Cookies from 'js-cookie';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';
export const TOKEN_COOKIE = 'token';

export function getToken(): string {
  return Cookies.get(TOKEN_COOKIE) || '';
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_COOKIE, token, { path: '/' });
}

export function clearToken(): void {
  Cookies.remove(TOKEN_COOKIE, { path: '/' });
}

export class ApiError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(`API ${status}: ${body}`);
    this.status = status;
    this.body = body;
  }
}

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('token', token);
  }
  const res = await fetch(`${API_URL}${path}`, { redirect: 'manual', ...options, headers });
  const text = await res.text();
  if (res.status === 307 || res.status === 302) {
    throw new ApiError(res.status, text);
  }
  if (!res.ok) {
    throw new ApiError(res.status, text);
  }
  if (!text) {
    return text as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export type Profile = {
  ID: number;
  NAME: string;
  ADMIN: number | null;
  PROFILEPICTURE: string;
  LOCATION: string | null;
  ISCOACH: number;
  COACHID: number;
  ABOUT: string;
};

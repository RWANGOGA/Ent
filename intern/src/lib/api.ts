// Thin browser client for the FastAPI backend.
//
// The static site is deployed to GitHub Pages where no backend runs, so the
// base URL is optional: when NEXT_PUBLIC_API_BASE_URL is unset the app keeps
// using the bundled seed. When it IS set (local dev against uvicorn, or once
// the API is hosted on Neon/Render), reads come from the database instead.
//
// The backend speaks snake_case; the UI types are camelCase. This module is the
// single translation boundary, so components never learn about either shape.
import { Org, Placement } from "../types";

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

export const isApiEnabled = API_BASE.length > 0;

// ---- Session token store ---------------------------------------------------

// The Bearer token lives in localStorage so a reload restores the session
// without hitting /auth/login again; /auth/me validates it on boot.
const TOKEN_KEY = "intern:token";

let _token: string | null =
  typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;

export function getToken(): string | null {
  return _token;
}

export function setToken(token: string | null): void {
  _token = token;
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode — session simply won't persist across reloads */
  }
}

function authHeader(): Record<string, string> {
  return _token ? { Authorization: `Bearer ${_token}` } : {};
}

// Typed error carrying the HTTP status so callers can branch (e.g. show the
// backend's "Incorrect email or password" on 401 instead of a generic failure).
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ---- Backend DTO shapes (snake_case) ---------------------------------------

interface ApiOrg {
  id: string;
  name: string;
  type: string;
  sector: string;
  loc: string;
  seal: string;
  about: string;
}

interface ApiPlacement {
  id: string;
  title: string;
  org_id: string;
  courses: string[];
  grade: string;
  loc: string;
  mode: string;
  duration: string;
  stipend: string;
  deadline: string;
  slots: number;
  status: string;
  applicants: number;
  docs: string[];
  testimonial: boolean;
  about: string;
  duties: string[];
  org: ApiOrg | null;
}

interface ApiListResponse<T> {
  total: number;
  items: T[];
}

// ---- Mappers ---------------------------------------------------------------

function mapOrg(o: ApiOrg): Org {
  return {
    id: o.id,
    name: o.name,
    type: o.type,
    sector: o.sector,
    loc: o.loc,
    seal: o.seal,
    about: o.about,
  };
}

function mapPlacement(p: ApiPlacement): Placement {
  return {
    id: p.id,
    title: p.title,
    orgId: p.org_id,
    courses: p.courses,
    grade: p.grade,
    loc: p.loc,
    mode: p.mode,
    duration: p.duration,
    stipend: p.stipend,
    deadline: p.deadline,
    slots: p.slots,
    status: p.status,
    applicants: p.applicants,
    docs: p.docs,
    testimonial: p.testimonial,
    about: p.about,
    duties: p.duties,
  };
}

// ---- Requests --------------------------------------------------------------

async function readError(res: Response, path: string): Promise<never> {
  // Prefer the backend's structured { detail } message; fall back to status.
  let detail = `API ${res.status} on ${path}`;
  try {
    const body = await res.json();
    if (body && typeof body.detail === "string") detail = body.detail;
  } catch {
    /* non-JSON error body — keep the status-derived message */
  }
  throw new ApiError(res.status, detail);
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", ...authHeader() },
  });
  if (!res.ok) await readError(res, path);
  return (await res.json()) as T;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) await readError(res, path);
  return (await res.json()) as T;
}

export interface Catalog {
  placements: Placement[];
  orgs: Org[];
}

// GET /placements -> placements plus the orgs referenced by them (deduped from
// the nested `org` the repository resolves, so we don't need a separate
// /organisations endpoint).
export async function fetchCatalog(): Promise<Catalog> {
  const data = await getJson<ApiListResponse<ApiPlacement>>("/placements");
  const placements = data.items.map(mapPlacement);
  const byId = new Map<string, Org>();
  for (const p of data.items) {
    if (p.org && !byId.has(p.org.id)) byId.set(p.org.id, mapOrg(p.org));
  }
  return { placements, orgs: [...byId.values()] };
}

// ---- Saved placements (bookmarks) -----------------------------------------

// GET /saved -> the ids this user has bookmarked.
export async function fetchSaved(userId: string): Promise<string[]> {
  const data = await getJson<{ saved_ids: string[] }>(
    `/saved?user_id=${encodeURIComponent(userId)}`
  );
  return data.saved_ids;
}

// POST /saved/toggle -> flips the bookmark and returns the new flag plus the
// full updated shortlist, so the client can reconcile without a second GET.
export async function toggleSavedApi(
  userId: string,
  placementId: string
): Promise<{ saved: boolean; savedIds: string[] }> {
  const data = await postJson<{ saved: boolean; saved_ids: string[] }>(
    "/saved/toggle",
    { user_id: userId, placement_id: placementId }
  );
  return { saved: data.saved, savedIds: data.saved_ids };
}

// ---- Applications ----------------------------------------------------------

export interface ApplicationDto {
  id: string;
  user_id: string;
  placement_id: string;
  status: string;
  statement: string;
  created_at: string;
}

// POST /applications -> submit (idempotent server-side: re-applying returns the
// existing record). Throws on 404 (unknown placement) or 409 (closed).
export async function applyApi(
  userId: string,
  placementId: string,
  statement: string
): Promise<ApplicationDto> {
  return postJson<ApplicationDto>("/applications", {
    user_id: userId,
    placement_id: placementId,
    statement,
  });
}

// ---- Subscription (host-org placement-fee plan) ---------------------------

export interface SubscriptionDto {
  org_id: string;
  plan: string;
  billing: string;
  seats: number;
  since: string;
  is_premium: boolean;
}

// GET /subscription -> the org's live plan (defaults to Free when none exists).
export async function fetchSubscription(orgId: string): Promise<SubscriptionDto> {
  return getJson<SubscriptionDto>(
    `/subscription?org_id=${encodeURIComponent(orgId)}`
  );
}

export async function activateSubscriptionApi(
  orgId: string,
  plan: string,
  billing: string,
  seats: number
): Promise<SubscriptionDto> {
  return postJson<SubscriptionDto>("/subscription/activate", {
    org_id: orgId,
    plan,
    billing,
    seats,
  });
}

export async function cancelSubscriptionApi(orgId: string): Promise<SubscriptionDto> {
  return postJson<SubscriptionDto>("/subscription/cancel", { org_id: orgId });
}

// ---- AI advisor ------------------------------------------------------------

// POST /advisor -> a Groq-generated reply grounded by the server-side matcher.
// Throws when Groq isn't configured (503) so the caller can fall back to the
// built-in deterministic assistant.
export async function askAdvisor(
  message: string,
  skills: string[],
  course: string,
  cgpa: number
): Promise<string> {
  const data = await postJson<{ reply: string }>("/advisor", {
    message,
    skills,
    course,
    cgpa,
  });
  return data.reply;
}

// ---- Auth (real accounts + tokens) ----------------------------------------

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface ApiAuthResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
}

// POST /auth/login -> stores the Bearer token and returns the safe user view.
// Throws ApiError(401, "Incorrect email or password") on bad credentials.
export async function loginApi(email: string, password: string): Promise<ApiUser> {
  const data = await postJson<ApiAuthResponse>("/auth/login", { email, password });
  setToken(data.access_token);
  return data.user;
}

// POST /auth/register -> creates the account and signs straight in.
export async function registerApi(
  email: string,
  name: string,
  role: string,
  password: string
): Promise<ApiUser> {
  const data = await postJson<ApiAuthResponse>("/auth/register", {
    email,
    name,
    role,
    password,
  });
  setToken(data.access_token);
  return data.user;
}

// GET /auth/me -> the current account for a stored token, or null when there is
// no token. Clears a token the server rejects so a stale session can't linger.
export async function fetchMe(): Promise<ApiUser | null> {
  if (!_token) return null;
  try {
    return await getJson<ApiUser>("/auth/me");
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      setToken(null);
    }
    return null;
  }
}

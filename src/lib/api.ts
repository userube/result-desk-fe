export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type SignupPayload = {
  schoolName: string;
  preferredSubdomain: string;
  ownerEmail: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function apiPost<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function refreshAuthToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("Refresh token is missing");
  const tokens = await apiPost<AuthResponse, { refreshToken: string }>("/auth/refresh", { refreshToken });
  storeAuthTokens(tokens);
  return tokens.accessToken;
}

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  return apiRequest<TResponse>(path);
}

export async function apiPut<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function apiPatch<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

async function apiRequest<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401 && getRefreshToken() && !path.includes("/auth/refresh")) {
    const nextToken = await refreshAuthToken();
    headers.set("Authorization", `Bearer ${nextToken}`);
    const retry = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
    const retryData = await retry.json().catch(() => null);
    if (retry.ok) return retryData as TResponse;
    const retryMessage = Array.isArray(retryData?.message) ? retryData.message.join(", ") : retryData?.message;
    throw new Error(retryMessage || "Request failed. Please login again.");
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    throw new Error(message || "Request failed. Please try again.");
  }

  return data as TResponse;
}

export function storeAuthTokens(tokens: AuthResponse) {
  window.localStorage.setItem("ewune_access_token", tokens.accessToken);
  window.localStorage.setItem("ewune_refresh_token", tokens.refreshToken);
}

export function getAccessToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("ewune_access_token") ?? "";
}

export function getRefreshToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("ewune_refresh_token") ?? "";
}

export function clearAuthTokens() {
  window.localStorage.removeItem("ewune_access_token");
  window.localStorage.removeItem("ewune_refresh_token");
}

export function hasAuthTokens() {
  return Boolean(getAccessToken() && getRefreshToken());
}

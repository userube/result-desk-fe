export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type SignupPayload = {
  schoolName: string;
  schoolEmail: string;
  phone: string;
  address: string;
  preferredSubdomain: string;
  currentAcademicSession: string;
  currentTerm: string;
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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => null);

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

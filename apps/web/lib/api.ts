import { apiUrl } from "./constants";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function apiFetch<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    credentials: "include",
    cache: "no-store"
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Request failed");
  }

  return (await response.json()) as ApiResponse<T>;
}

export async function postJson<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

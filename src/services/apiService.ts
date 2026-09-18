import { HttpError } from "@/lib/errors";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function postWithFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(res.status, res.statusText, data, res);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(res.status, res.statusText, data, res);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(res.status, res.statusText, data, res);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// TODO - move common logic with POST into single method
export async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(res.status, res.statusText, data, res);
  }

  return res.json() as Promise<T>;
}

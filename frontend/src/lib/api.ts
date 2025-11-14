import { Form } from "react-router-dom";

// export function setToken(token: string) {
//   localStorage.setItem('token', token)
// }
// export function getToken(): string | null {
//   return localStorage.getItem('token')
// }


const API = import.meta.env.VITE_API_URL;
// const API = import.meta.env.VITE_API_URL || "http://localhost:8000";


export async function api(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(`${API}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const text = await res.text();
      message = text || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

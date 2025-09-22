import axios, { AxiosHeaders } from "axios";

// BACKEND base URL comes from Vite env at build time
const BASE = import.meta.env.VITE_BACKEND_HOST?.replace(/\/$/, "") || "";

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,           // send cookies
});

const CSRF_ENDPOINT = "/api/csrf";
let mintingPromise: Promise<void> | null = null;
let csrfToken: string | null = null;

function readCookieToken(): string | null {
  return (
    document.cookie
      .split('; ')
      .find(part => part.startsWith('XSRF-TOKEN='))
      ?.split('=')[1] ?? null
  );
}

async function mintCsrfToken() {
  if (!mintingPromise) {
    mintingPromise = (async () => {
      try {
        const res = await fetch(`${BASE}${CSRF_ENDPOINT}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to mint CSRF token: ${res.status}`);
        }
        const data = await res.json().catch(() => ({}));
        const tokenFromResponse = typeof data?.csrfToken === "string" ? data.csrfToken : null;
        csrfToken = tokenFromResponse ?? readCookieToken();
        if (!csrfToken) {
          throw new Error("CSRF token missing from response");
        }
      } catch (error) {
        csrfToken = null;
        console.error("Failed to mint CSRF token", error);
        throw error;
      } finally {
        mintingPromise = null;
      }
    })();
  }
  return mintingPromise;
}

export async function ensureCsrfToken() {
  if (!csrfToken) {
    await mintCsrfToken();
  }
  if (!csrfToken) {
    csrfToken = readCookieToken();
  }
  if (!csrfToken) {
    throw new Error("Unable to acquire CSRF token");
  }
  return csrfToken;
}

// Attach CSRF token for state-changing requests
api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toUpperCase();
  if (["POST","PUT","PATCH","DELETE"].includes(method)) {
    if (!csrfToken) {
      await mintCsrfToken();
    }
    if (!csrfToken) {
      throw new Error("Missing CSRF token");
    }
    const headers = AxiosHeaders.from(config.headers);
    headers.set("X-CSRFToken", csrfToken);
    config.headers = headers;
  }
  return config;
});

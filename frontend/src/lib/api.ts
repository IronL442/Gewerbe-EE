import axios, { AxiosHeaders } from "axios";

// BACKEND base URL comes from Vite env at build time
const BASE = import.meta.env.VITE_BACKEND_HOST?.replace(/\/$/, "") || "";

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,           // send cookies
});

// Read CSRF cookie set by /api/csrf
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find(r => r.startsWith(name + "="))
    ?.split("=")[1] ?? "";
}

const CSRF_ENDPOINT = "/api/csrf";
let mintingPromise: Promise<void> | null = null;

async function mintCsrfToken() {
  if (!mintingPromise) {
    mintingPromise = fetch(`${BASE}${CSRF_ENDPOINT}`, {
      credentials: "include",
    })
      .then(() => undefined)
      .finally(() => {
        mintingPromise = null;
      });
  }
  return mintingPromise;
}

export async function ensureCsrfToken() {
  if (!getCookie("XSRF-TOKEN")) {
    await mintCsrfToken();
  }
}

// Attach CSRF token for state-changing requests
api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toUpperCase();
  if (["POST","PUT","PATCH","DELETE"].includes(method)) {
    const token = getCookie("XSRF-TOKEN");
    if (!token) {
      // fetch token once if missing/expired
      await mintCsrfToken();
    }
    const fresh = getCookie("XSRF-TOKEN");
    if (fresh) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("X-CSRFToken", fresh);
      config.headers = headers;
    }
  }
  return config;
});

import axios from "axios";

// BACKEND base URL comes from Vite env at build time
const BASE = import.meta.env.VITE_BACKEND_HOST?.replace(/\/$/, "") || "";

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,           // send cookies
  headers: { "Content-Type": "application/json" },
});

// Read CSRF cookie set by /api/csrf
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find(r => r.startsWith(name + "="))
    ?.split("=")[1] ?? "";
}

// Attach CSRF token for state-changing requests
api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toUpperCase();
  if (["POST","PUT","PATCH","DELETE"].includes(method)) {
    const token = getCookie("XSRF-TOKEN");
    if (!token) {
      // fetch token once if missing/expired
      await fetch(`${BASE}/api/csrf`, { credentials: "include" });
    }
    const fresh = getCookie("XSRF-TOKEN");
    if (fresh) (config.headers ??= {})["X-CSRFToken"] = fresh;
  }
  return config;
});
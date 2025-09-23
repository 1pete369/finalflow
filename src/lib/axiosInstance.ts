// client/src/lib/axiosInstance.ts
import axios, { AxiosError } from "axios";

const normalizeApiBase = (raw: string) => {
  // strip trailing slashes
  let url = raw.replace(/\/+$/, "");
  // strip accidental trailing /api
  url = url.replace(/\/api$/i, "");
  // append single /api
  return `${url}/api`;
};

const getBaseURL = () => {
  // If running in browser on localhost, force localhost API
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      /^192\.168\.\d+\.\d+$/.test(host) ||
      /^10\.\d+\.\d+\.\d+$/.test(host);
    if (isLocal) return "http://localhost:5001/api";
  }
  // On SSR or prod browser: prefer env (NO /api in the env var)
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  return normalizeApiBase(raw);
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // required for cross-site cookies
  timeout: 25000,
});

// Visibility for CORS / network problems
axiosInstance.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const url = error.config?.baseURL
      ? `${error.config.baseURL}${error.config.url ?? ""}`
      : error.config?.url;

    if (error.response) {
      console.error("API error", {
        status: error.response.status,
        data: error.response.data,
        url,
      });
    } else {
      console.error("Network/Blocked error", {
        message: error.message,
        code: (error as AxiosError).code,
        url,
      });
    }
    return Promise.reject(error);
  }
);

// Warm-up ping to reduce cold-start delays on free Render dynos
export const warmBackend = async () => {
  try {
    // Hit the server's healthz endpoint (outside /api path)
    const baseURL = getBaseURL().replace('/api', ''); // Remove /api from baseURL
    await axios.get(`${baseURL}/healthz`); // resolves to https://grindflow-server-1.onrender.com/healthz
  } catch {
    // ignore warm-up failures
  }
};

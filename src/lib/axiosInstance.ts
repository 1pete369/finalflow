import axios from "axios"

const getBaseURL = () => {
  // If running in browser on localhost, force localhost API
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    if (isLocal) return "http://localhost:5001/api"
  }
  // Otherwise prefer env
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
}

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 25000,
})

// Optional warm-up ping to reduce cold-start delays on free Render dynos
export const warmBackend = async () => {
  try {
    await axiosInstance.get("/healthz")
  } catch {
    // ignore
  }
}

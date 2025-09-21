import axios from "axios"

const getBaseURL = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
  }
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
  } catch (e) {
    // ignore
  }
}

import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: "/api", // Now it's same-origin (no localhost:5001)
  withCredentials: true,
});

import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // Direct backend URL
  withCredentials: true,
})

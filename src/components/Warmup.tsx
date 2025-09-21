"use client"

import { useEffect } from "react"
import { warmBackend } from "@/lib/axiosInstance"

export default function Warmup() {
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null

    const ping = async () => {
      try {
        await warmBackend()
      } catch (_e) {
        // ignore
      }
    }

    // immediate ping on mount
    ping()

    // ping every ~14 minutes to keep free dynos awake while app is open
    timer = setInterval(ping, 14 * 60 * 1000)

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [])

  return null
}



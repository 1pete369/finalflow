"use client"

import { axiosInstance } from "@/lib/axiosInstance"
import {
  authUserDataType,
  loginDataType,
  signupDataType,
} from "@/types/authTypes"
import { Loader2 } from "lucide-react"
import React, { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
// import { io, Socket } from "socket.io-client"

type authContextType = {
  isCheckingAuth: boolean
  isUpdatingProfile: boolean
  setIsUpdatingProfile: React.Dispatch<React.SetStateAction<boolean>>
  authUser: authUserDataType | null
  checkAuth: () => Promise<void>
  isSigningUp: boolean
  signup: (data: signupDataType) => Promise<void>
  isLoggingIn: boolean
  login: (data: loginDataType) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { media: string }) => Promise<void>
  // onlineUsers: string[]
  // webSocket: Socket | null
}

const authContext = createContext<authContextType | null>(null)

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const [authUser, setAuthUser] = useState<authUserDataType | null>(null)

  const [isSigningUp, setIsSigningUp] = useState(false)

  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // const [onlineUsers, setOnlineUsers] = useState<string[] | []>([])

  // const [webSocket, setWebSocket] = useState<Socket | null>(null)

  // const connectSocket = (user: authUserDataType) => {
  //   if (!user || webSocket?.connected) return

  //   console.log("Came to socket")
  //   const socket = io(process.env.NEXT_PUBLIC_BASE_URL!, {
  //     query: {
  //       userId: user._id
  //     }
  //   })
  //   socket.connect()
  //   console.log("Connected socket", socket)
  //   setWebSocket(socket)

  //   socket?.on("getOnlineUsers", (userIds) => {
  //     console.log("online users", userIds)
  //     setOnlineUsers(userIds)
  //   })
  // }

  // const disconnectSocket = () => {
  //   if (webSocket?.connected) webSocket.disconnect()
  // }

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/check")
      if (response) {
        setAuthUser(response.data)
        console.log("response", response)
        // connectSocket(response.data)
      } else {
        setAuthUser(null)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error at check Auth in provider", error)
        setAuthUser(null)
      } else {
        console.log("Unknown error at check Auth in provider", error)
      }
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const signup = async (data: signupDataType) => {
    setIsSigningUp(true)
    try {
      const response = await axiosInstance.post("/auth/signup", data)
      setAuthUser(response.data)
      console.log("Before toast")
      toast.success("Account created successfully!")
      // connectSocket(response.data)
      console.log("after toast")
    } catch (error) {
      console.log(error)
      const message =
        (typeof error === "object" && error &&
          // @ts-expect-error narrowing axios error
          (error.response?.data?.message || error.message)) ||
        "Failed to sign up. Please try again."
      toast.error(message)
    } finally {
      setIsSigningUp(false)
    }
  }

  const login = async (data: loginDataType) => {
    setIsLoggingIn(true)
    try {
      const response = await axiosInstance.post("/auth/login", data)
      setAuthUser(response.data)
      toast.success("Logged in successfully!")
      // connectSocket(response.data)
    } catch (error) {
      console.log(error)
      const message =
        (typeof error === "object" && error &&
          // @ts-expect-error narrowing axios error
          (error.response?.data?.message || error.message)) ||
        "Failed to log in. Please try again."
      toast.error(message)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout")
      setAuthUser(null)
      toast.success("Account logged out!")
      // disconnectSocket()
    } catch (error) {
      const message =
        (typeof error === "object" && error &&
          // @ts-expect-error narrowing axios error
          (error.response?.data?.message || error.message)) ||
        "Failed to log out. Please try again."
      toast.error(message)
    }
  }

  const updateProfile = async (data: { media: string }) => {
    try {
      const response = await axiosInstance.put("/auth/update-profile", data)
      setAuthUser(response.data)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.log(error)
      const message =
        (typeof error === "object" && error &&
          // @ts-expect-error narrowing axios error
          (error.response?.data?.message || error.message)) ||
        "Failed to update profile. Please try again."
      toast.error(message)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <Loader2 size="30" className="animate-spin text-primary-800" />
      </div>
    )
  }

  return (
    <authContext.Provider
      value={{
        isCheckingAuth,
        checkAuth,
        authUser,
        isSigningUp,
        signup,
        login,
        isLoggingIn,
        logout,
        updateProfile,
        isUpdatingProfile,
        setIsUpdatingProfile,
        // onlineUsers,
        // webSocket
      }}
    >
      {children}
    </authContext.Provider>
  )
}

export const useAuthContext = () => {
  const context: authContextType | null = useContext(authContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider")
  }
  return context
}

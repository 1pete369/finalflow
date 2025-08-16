"use client"

import { useAuthContext } from "@/context/useAuthContext"
import { signupDataType } from "@/types/authTypes"
import { validateEmail, validatePassword } from "@/utils/authFormValidators"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"

export default function SignUpPage() {
  const { authUser, isSigningUp, signup } = useAuthContext()

  if (authUser) {
    redirect("/")
  }

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mainError, setMainError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setName(name)
    const error = name.length >= 2 ? "" : "Name must be at least 2 letters"
    setNameError(error)
    setMainError("")
  }

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.trim()
    setUsername(username)
    const error =
      username.length >= 3 ? "" : "Username must be at least 3 characters"
    setUsernameError(error)
    setMainError("")
  }

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.trim()
    setEmail(email)
    setEmailError(validateEmail(email))
    setMainError("")
  }

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value.trim()
    setPassword(password)
    setPasswordError(validatePassword(password))
    setMainError("")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (
      email === "" ||
      emailError !== "" ||
      password === "" ||
      passwordError !== "" ||
      nameError !== "" ||
      name === "" ||
      usernameError !== "" ||
      username === ""
    ) {
      setMainError("Fill all the fields required!")
      return
    }
    const data: signupDataType = {
      fullName: name.trim(),
      username: username.trim(),
      email,
      password,
    }

    await signup(data)
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-0 grid lg:grid-cols-2 items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-300 transform rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-200 transform -rotate-12"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-indigo-100 transform rotate-90"></div>
      </div>

      {/* Left Side - Form */}
      <div className="relative z-10 flex justify-center items-center w-full px-4 lg:px-0 py-4 lg:py-0">
        <form className="w-full max-w-sm sm:max-w-md lg:max-w-md flex flex-col items-center gap-4 lg:gap-6 border-2 border-gray-800 px-5 sm:px-8 lg:px-10 py-8 lg:py-14 bg-white shadow-2xl relative">
          {/* Form Header */}
          <div className="text-center mb-4 lg:mb-6">
            {/* <div className="w-14 h-14 lg:w-14 lg:h-14 bg-indigo-700 flex items-center justify-center mb-3 mx-auto">
              <span className="text-white font-bold text-xl lg:text-xl">
                GF
              </span>
            </div> */}
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3 text-gray-900">
              Create account
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Start your decisive daily flow
            </p>
          </div>

          {/* Name Field */}
          <div className="w-full">
            <label
              htmlFor="name"
              className="block text-sm lg:text-sm font-semibold text-gray-700 mb-1.5 lg:mb-2"
            >
              Full Name
            </label>
            <input
              required
              type="text"
              id="name"
              className="w-full border-2 border-gray-300 focus:border-indigo-600 outline-none px-4 py-3 lg:py-4 placeholder:text-gray-400 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 text-base"
              placeholder="Enter your full name"
              autoComplete="off"
              value={name}
              onChange={handleName}
            />
            {nameError && (
              <p className="text-red-600 text-sm lg:text-sm mt-1.5 lg:mt-2 font-medium">
                {nameError}
              </p>
            )}
          </div>

          {/* Username Field */}
          <div className="w-full">
            <label
              htmlFor="username"
              className="block text-sm lg:text-sm font-semibold text-gray-700 mb-1.5 lg:mb-2"
            >
              Username
            </label>
            <input
              required
              type="text"
              id="username"
              className="w-full border-2 border-gray-300 focus:border-indigo-600 outline-none px-4 py-3 lg:py-4 placeholder:text-gray-400 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 text-base"
              placeholder="Choose a username"
              autoComplete="off"
              value={username}
              onChange={handleUsername}
            />
            {usernameError && (
              <p className="text-red-600 text-sm lg:text-sm mt-1.5 lg:mt-2 font-medium">
                {usernameError}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm lg:text-sm font-semibold text-gray-700 mb-1.5 lg:mb-2"
            >
              Email
            </label>
            <input
              required
              type="email"
              id="email"
              className="w-full border-2 border-gray-300 focus:border-indigo-600 outline-none px-4 py-3 lg:py-4 placeholder:text-gray-400 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 text-base"
              placeholder="Enter your email"
              autoComplete="off"
              value={email}
              onChange={handleEmail}
            />
            {emailError && (
              <p className="text-red-600 text-sm lg:text-sm mt-1.5 lg:mt-2 font-medium">
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm lg:text-sm font-semibold text-gray-700 mb-1.5 lg:mb-2"
            >
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              className="w-full border-2 border-gray-300 focus:border-indigo-600 outline-none px-4 py-3 lg:py-4 placeholder:text-gray-400 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 text-base"
              placeholder="Create a password"
              autoComplete="off"
              value={password}
              onChange={handlePassword}
            />
            {passwordError && (
              <p className="text-red-600 text-sm lg:text-sm mt-1.5 lg:mt-2 font-medium">
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 lg:px-8 py-3 lg:py-4 bg-indigo-700 text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-600 focus:ring-offset-2 transition-all duration-200 flex justify-center items-center gap-2 font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-indigo-500 disabled:transform-none disabled:shadow-none"
            onClick={handleSubmit}
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              "Get started free"
            )}
          </button>

          {/* Error Display */}
          {mainError && (
            <div className="w-full bg-red-50 border-2 border-red-200 px-4 lg:px-4 py-3 lg:py-3 text-center">
              <p className="text-red-600 text-sm lg:text-sm font-medium">
                {mainError}
              </p>
            </div>
          )}

          {/* Sign In Link */}
          <div className="text-center text-gray-600 pt-4 lg:pt-4 border-t border-gray-200 w-full">
            <span className="text-gray-500 text-sm lg:text-sm">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline hover:no-underline transition-all duration-200 text-sm lg:text-sm"
            >
              Sign in here
            </Link>
          </div>
        </form>
      </div>

      {/* Right Side - GrindFlow Info */}
      <div className="hidden lg:flex flex-col items-center justify-center gap-6 px-10 relative z-10">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-2xl">
          <span className="text-white font-bold text-3xl">GF</span>
        </div>

        <div className="text-center max-w-lg">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Start building today
          </h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Create your first goal, link habits to it, and start building the
            system that will compound your success over time.
          </p>
        </div>

        <div className="space-y-4 text-left w-full max-w-md">
          <div className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 shadow-sm">
            <div className="w-2.5 h-2.5 bg-indigo-600 flex-shrink-0"></div>
            <span className="text-gray-800 font-medium text-sm">
              1% better every day
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 shadow-sm">
            <div className="w-2.5 h-2.5 bg-indigo-600 flex-shrink-0"></div>
            <span className="text-gray-800 font-medium text-sm">
              Habit-goal linking
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 shadow-sm">
            <div className="w-2.5 h-2.5 bg-indigo-600 flex-shrink-0"></div>
            <span className="text-gray-800 font-medium text-sm">
              Progress compounds
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-300 px-6 py-4 text-center shadow-lg">
          <p className="text-indigo-800 font-semibold text-base italic">
            &quot;Tiny changes, remarkable results&quot;
          </p>
        </div>

        {/* Social Proof */}
        <div className="text-center pt-4">
          <p className="text-gray-500 text-xs mb-2">
            Join 10,000+ builders & students
          </p>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <span className="text-xs">🚀 7-day free trial</span>
            <span className="text-xs">•</span>
            <span className="text-xs">Then $9/mo</span>
            <span className="text-xs">•</span>
            <span className="text-xs">Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"
import { useAuthContext } from "@/context/useAuthContext"
import { loginDataType } from "@/types/authTypes"
import { validateEmail, validatePassword } from "@/utils/authFormValidators"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"

export default function LoginPage() {
  const { authUser, login, isLoggingIn } = useAuthContext()

  if (authUser) {
    redirect("/")
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [mainError, setMainError] = useState("")

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const email = e.target.value
    setEmail(email)
    const error = validateEmail(email)
    setEmailError(error)
    setMainError("")
  }

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const password = e.target.value.trim()
    setPassword(password)
    const error = validatePassword(password)
    setPasswordError(error)
    setMainError("")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (
      email === "" ||
      emailError !== "" ||
      password === "" ||
      passwordError !== ""
    ) {
      setMainError("Fill all the fields required!")
      return
    }
    const data: loginDataType = {
      email,
      password
    }

    await login(data)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center justify-center bg-neutral-800 text-white px-4">
      <form className="w-fit mx-auto flex flex-col items-center gap-4 border-2 border-primary-800 px-8 py-12 rounded-lg shadow-lg bg-neutral-800">
        <h1 className="text-2xl font-semibold mb-2">Welcome back! 👋</h1>
        <div className="w-full">
          <label htmlFor="email" className="hidden">
            Email:
          </label>
          <input
            required
            type="email"
            id="email"
            className="w-full rounded-md border border-white/30 focus:border-primary-800 outline-none px-3 py-2 placeholder:text-neutral-500 min-w-60"
            placeholder="Enter email"
            autoComplete="off"
            value={email}
            onChange={handleEmail}
          />
          {emailError && (
            <p className="text-error text-sm mt-1">{emailError}</p>
          )}
        </div>
        <div className="w-full">
          <label htmlFor="password" className="hidden">
            Password:
          </label>
          <input
            required
            type="password"
            id="password"
            className="w-full rounded-md border border-white/30 focus:border-primary-800 outline-none px-3 py-2 placeholder:text-neutral-500 min-w-60"
            placeholder="Enter password"
            autoComplete="off"
            value={password}
            onChange={handlePassword}
          />
          {passwordError && (
            <p className="text-error text-sm mt-1">{passwordError}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary-800 text-white rounded-full hover:bg-primary-500 focus:ring-2 focus:ring-black focus:outline-none transition-all flex justify-center disabled:bg-primary-500"
          onClick={handleSubmit}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <p className="flex gap-2 items-center mx-auto">
              <Loader2 size={20} className="animate-spin"/> Loading...
            </p>
          ) : (
            "Login"
          )}
        </button>
        {mainError && <p className="text-error text-sm mt-2">{mainError}</p>}
        <span className="text-sm">
          Don&apos;t have an account?
          <Link href={"/signup"} className="underline">
            Signup
          </Link>
        </span>
      </form>
      <div className="hidden lg:flex flex-col items-center justify-center gap-6 px-10">
        <Image
          src={"/logo.png"}
          height={200}
          width={200}
          alt="logo"
          className="rounded"
        />
        <h2 className="text-3xl font-bold text-primary-500 text-center">
          Connect. Chat. Chill.
        </h2>
        <p className="text-center text-neutral-300 text-base max-w-md">
          Welcome to our friendly chat space where you can:
        </p>
        <ul className="text-neutral-400 list-disc pl-6 space-y-1 text-left text-sm">
          <li>Start real-time conversations</li>
          <li>Make new friends easily</li>
          <li>Stay connected with your people</li>
          <li>All in a simple and secure way</li>
        </ul>
        <p className="text-sm italic text-neutral-500 text-center max-w-sm">
        &quot;Great conversations start here 💬&quot;
        </p>
      </div>
    </div>
  )
}

"use client"

import { useAuthContext } from "@/context/useAuthContext"
import { signupDataType } from "@/types/authTypes"
import { validateEmail, validatePassword } from "@/utils/authFormValidators"
import { Loader2 } from "lucide-react"
import Image from "next/image"
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
    if (email==="" || emailError !== "" || password==="" || passwordError !== "" || nameError !== "" || name==="") {
      setMainError("Fill all the fields required!")
      return
    }
    const data: signupDataType = {
      fullName: name.trim(),
      email,
      password
    }

    await signup(data)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 items-center justify-center bg-neutral-800 text-white">
      {/* Sign up form section */}
      <form className="  flex flex-col items-center gap-4 border-2 border-primary-800 px-10 py-14 rounded-sm w-fit mx-auto">
        <h1 className="text-lg">Create an account!</h1>
        <div>
          <label htmlFor="name" className="hidden">
            Name:
          </label>
          <input
            required
            type="text"
            id="name"
            className="rounded-sm border-2 border-white/30 focus-within:border-primary-800 outline-none px-2 py-1.5 placeholder:text-neutral-500 min-w-60"
            placeholder="Enter name"
            autoComplete="off"
            value={name}
            onChange={handleName}
          />
          {nameError && <p className="text-error text-sm">{nameError}</p>}
        </div>
        <div>
          <label htmlFor="email" className="hidden">
            Email:
          </label>
          <input
            required
            type="email"
            id="email"
            className="rounded-sm border-2 border-white/30 focus-within:border-primary-800 outline-none px-2 py-1.5 placeholder:text-neutral-500 min-w-60"
            placeholder="Enter email"
            autoComplete="off"
            value={email}
            onChange={handleEmail}
          />
          {emailError && <p className="text-error text-sm">{emailError}</p>}
        </div>
        <div>
          <label htmlFor="password" className="hidden">
            Password:
          </label>
          <input
            required
            type="password"
            id="password"
            className="rounded-sm border-2 border-white/30 focus-within:border-primary-800 outline-none px-2 py-1.5 placeholder:text-neutral-500 min-w-60"
            placeholder="Enter password"
            autoComplete="off"
            value={password}
            onChange={handlePassword}
          />
          {passwordError && (
            <p className="text-error text-sm">{passwordError}</p>
          )}
        </div>
        <button
          type="submit"
          className=" px-4 py-2 w-full bg-primary-800 text-white rounded-full over:bg-primary-500 focus:ring-2 focus:ring-black focus:outline-none transition-all min-w-[240px] flex justify-center disabled:bg-primary-500"
          onClick={handleSubmit}
          disabled={isSigningUp}
        >
          {isSigningUp ? (
            <p className="flex gap-2 items-center mx-auto">
              <Loader2 size={20} className="animate-spin"/> Loading...
            </p>
          ) : (
            "Signup"
          )}
        </button>
        {mainError && <p className="text-error text-sm mt-1">{mainError}</p>}
        <span>
          Have an account?
          <Link href="/login" className="underline text-sm">
            Login
          </Link>
        </span>
      </form>

      {/* Right side info */}
      <div className="hidden lg:flex flex-col items-center justify-center gap-6 px-10">
        <Image
          src={"/logo.png"}
          height={200}
          width={200}
          alt="logo"
          className="rounded"
        />
        <h2 className="text-3xl font-bold text-primary-500 text-center">
          Join the chat. Make it yours.
        </h2>
        <p className="text-center text-neutral-300 text-base max-w-md">
          Create an account and start chatting with friends, making memories,
          and staying connected in real time.
        </p>
        <ul className="text-neutral-400 list-disc pl-6 space-y-1 text-left text-sm">
          <li>Fast & secure messaging</li>
          <li>Group chats with your people</li>
          <li>Zero distractions, all connection</li>
          <li>Free forever — always</li>
        </ul>
        <p className="text-sm italic text-neutral-500 text-center max-w-sm">
        &quot;The best place to chat, laugh, and vibe ✨&quot;
        </p>
      </div>
    </div>
  )
}

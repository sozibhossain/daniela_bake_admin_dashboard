"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error || "Login failed")
      } else if (result?.ok) {
        toast.success("Login successful!")
        if (rememberMe) {
          localStorage.setItem("email", email)
        }
        // Store access token in localStorage from session
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8 bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to Account</h2>
      <p className="text-gray-400 mb-6 text-sm">Please enter your email and password to continue</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 border border-gray-300 rounded accent-blue-600"
            />
            <span className="text-sm text-gray-600">Remember Me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#5B9FED] hover:bg-[#4A8FDD] text-white h-11 rounded-lg"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
        </Button>
      </form>
    </Card>
  )
}

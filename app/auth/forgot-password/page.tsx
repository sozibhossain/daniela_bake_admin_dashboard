"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { authAPI } from "@/lib/auth-api"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.forgetPassword(email)
      toast.success("OTP sent to your email")
      setStep("otp")
    } catch (error) {
      toast.error("Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.verifyOTP(email, otp)
      toast.success("OTP verified")
      setStep("reset")
    } catch (error) {
      toast.error("Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await authAPI.resetPassword(email, otp, newPassword)
      toast.success("Password reset successful")
      setTimeout(() => (window.location.href = "/auth/login"), 2000)
    } catch (error) {
      toast.error("Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF7F0] py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 bg-white">
          {step === "email" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
              <p className="text-gray-500 mb-6">
                Enter your registered email address, we'll send you a code to reset your password.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#5B9FED] hover:bg-[#4A8FDD] text-white h-10"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                </Button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
              <p className="text-gray-500 mb-6">We have share a code of your registered email address {email}</p>

              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, i) => (
                    <Input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const newOtp = otp.split("")
                        newOtp[i] = e.target.value
                        setOtp(newOtp.join(""))
                      }}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-[#5B9FED] hover:bg-[#4A8FDD] text-white h-10"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                </Button>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-gray-500 mb-6">Create your new password</p>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#5B9FED] hover:bg-[#4A8FDD] text-white h-10"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

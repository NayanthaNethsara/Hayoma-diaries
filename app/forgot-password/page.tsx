"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { Logo } from "@/components/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // BACKEND INTEGRATION: Send password reset email
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      setIsSubmitted(true)
      toast.success("Password reset link sent to your email")
    } catch (error) {
      console.error("Failed to send reset email:", error)
      toast.error("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center md:hidden">
            <Logo />
          </div>
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center">
                <Link href="/login" className="mr-2">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              </div>
              <CardDescription>
                {!isSubmitted
                  ? "Enter your email address and we'll send you a link to reset your password"
                  : "Check your email for a link to reset your password"}
              </CardDescription>
            </CardHeader>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-blue-800 dark:text-blue-200">
                  <p>
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="mt-2 text-sm">If you don't see it in your inbox, please check your spam folder.</p>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setIsSubmitted(false)}>
                  Try another email
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:flex flex-1 relative bg-blue-50 dark:bg-blue-950">
        <div className="absolute top-8 left-8">
          <Logo />
        </div>
        <div className="flex items-center justify-center w-full h-full p-12">
          <div className="max-w-md">
            <div className="relative w-full aspect-square">
              <Image
                src="/dairy-illustration.svg"
                alt="Dairy farm illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-center">Password Recovery</h2>
            <p className="mt-2 text-center text-muted-foreground">
              We'll help you get back into your account in no time
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

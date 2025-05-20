"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(username, password)
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleQuickLogin = async (role: string) => {
    try {
      await login(role, "password")
    } catch (error) {
      console.error("Quick login error:", error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-100 dark:border-gray-700">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold">Login to Hayoma Dairy</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your.username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Quick Access (For Testing)
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleQuickLogin("admin")}
                className="border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-950"
              >
                Admin Login
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickLogin("shop")}
                className="border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-950"
              >
                Shop Login
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickLogin("supplier")}
                className="border-amber-200 hover:bg-amber-50 dark:border-amber-900 dark:hover:bg-amber-950"
              >
                Supplier Login
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickLogin("driver")}
                className="border-purple-200 hover:bg-purple-50 dark:border-purple-900 dark:hover:bg-purple-950"
              >
                Driver Login
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Contact us
            </Link>{" "}
            to get started.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

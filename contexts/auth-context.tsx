"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User, UserRole } from "@/lib/types"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

// Mock users for demo - ensuring all roles are in uppercase
const mockUsers = [
  {
    id: "1",
    username: "admin",
    name: "John Admin",
    email: "admin@hayoma.com",
    role: "ADMIN" as UserRole,
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: "2",
    username: "shop",
    name: "Sarah Shop",
    email: "shop@hayoma.com",
    role: "SHOP" as UserRole,
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: "3",
    username: "supplier",
    name: "Mike Supplier",
    email: "supplier@hayoma.com",
    role: "SUPPLIER" as UserRole,
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: "4",
    username: "driver",
    name: "Dave Driver",
    email: "driver@hayoma.com",
    role: "DRIVER" as UserRole,
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Auto-login based on URL path for demo purposes
  useEffect(() => {
    const checkAutoLogin = () => {
      setIsLoading(true)

      // Check if user is already logged in
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Error parsing user from localStorage:", error)
          localStorage.removeItem("user") // Remove invalid data
          setUser(null) // Set user to null to avoid issues
        }
        setIsLoading(false)
        return
      }

      // Auto-login based on URL path for demo - using uppercase roles
      if (pathname?.includes("/dashboard/admin")) {
        const adminUser = mockUsers.find((u) => u.role === "ADMIN")
        if (adminUser) {
          setUser(adminUser)
          localStorage.setItem("user", JSON.stringify(adminUser))
        }
      } else if (pathname?.includes("/dashboard/shop")) {
        const shopUser = mockUsers.find((u) => u.role === "SHOP")
        if (shopUser) {
          setUser(shopUser)
          localStorage.setItem("user", JSON.stringify(shopUser))
        }
      } else if (pathname?.includes("/dashboard/supplier")) {
        const supplierUser = mockUsers.find((u) => u.role === "SUPPLIER")
        if (supplierUser) {
          setUser(supplierUser)
          localStorage.setItem("user", JSON.stringify(supplierUser))
        }
      } else if (pathname?.includes("/dashboard/driver")) {
        const driverUser = mockUsers.find((u) => u.role === "DRIVER")
        if (driverUser) {
          setUser(driverUser)
          localStorage.setItem("user", JSON.stringify(driverUser))
        }
      }

      setIsLoading(false)
    }

    checkAutoLogin()
  }, [pathname])

  const login = async (username: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user by username (in a real app, this would be a server call)
    const foundUser = mockUsers.find((u) => u.username === username && u.isActive)

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      setIsLoading(false)

      // Update last login time
      foundUser.lastLogin = new Date().toISOString()

      // Redirect to appropriate dashboard
      router.push(`/dashboard/${foundUser.role.toLowerCase()}`)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

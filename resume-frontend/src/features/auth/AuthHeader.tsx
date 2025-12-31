"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ApiError } from "@/lib/api"
import { me, logout, User } from "@/features/auth/authApi"
import Button from "@/components/Button"
import Image from "next/image"

const AuthHeader = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadMe() {
      try {
        const currentUser = await me()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    void loadMe()
  }, [])

  async function handleLogout() {
    try {
      await logout()
    } finally {
      setUser(null)
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-space-bg/40 backdrop-blur">
      <div className="flex w-full items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
          <Image
            src="/logo/strgsh-wide.png"
            alt="STRGSH"
            width={110}
            height={48}
            priority
            className="transition duration-300 drop-shadow-[0_0_10px_rgba(123,201,255,0.35)] hover:drop-shadow-[0_0_20px_rgba(123,201,255,0.75)]"
          />
        </Link>
        <nav className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-white/50">Loading...</span>
          ) : user ? (
            <>
              <span className="text-sm text-white/70">
                {user.username}
              </span>
              <Button onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/login">
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default AuthHeader

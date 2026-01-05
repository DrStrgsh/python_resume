"use client"

import Link from "next/link"
import Image from "next/image"

import Button from "./Button"
import { useAuth } from "@/features/auth/useAuth"

const Header = () => {
  const { user, isLoading, logout, isLoggingOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-space-bg/40 backdrop-blur">
      <div className="flex w-full items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo/strgsh-wide.png"
              alt="STRGSH"
              width={110}
              height={48}
              priority
              className="
                transition duration-300 drop-shadow-[0_0_10px_rgba(123,201,255,0.35)]
                hover:drop-shadow-[0_0_20px_rgba(123,201,255,0.75)]
              "
            />
          </Link>
          <Link href="/projects" className="flex items-center transition-transform duration-300 hover:scale-105">
            <h2>Projects</h2>
          </Link>
          <Link href="/about" className="flex items-center transition-transform duration-300 hover:scale-105">
            <h2>About Me</h2>
          </Link>
        </div>
        <nav className="flex items-center gap-3">
          {isLoading ? (
            <span className="text-sm text-white/50">Loading...</span>
          ) : user ? (
            <>
              <span className="text-sm text-white/70">{user.username}</span>
              <Button onClick={() => logout()} disabled={isLoggingOut}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

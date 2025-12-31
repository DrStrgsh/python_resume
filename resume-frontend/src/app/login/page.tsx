"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, User } from "@/features/auth/authApi"
import Button from "@/components/Button"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const user: User = await login({ username, password })

      router.push("/")
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-space-bg text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-space-primary/30 blur-3xl" />
        <div className="absolute top-40 left-10 h-64 w-64 rounded-full bg-space-secondary/25 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-space-accent/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-md flex-col p-6" >
        <h1 className="text-3xl font-semibold tracking-tight">Login</h1>
        <p className="mt-2 text-sm text-white/70">
          Sign in to your account
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-space-form-glow backdrop-blur"
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-white/80">Username</label>
            <input
              className="w-full rounded border border-white/10 bg-space-main/30 p-2 text-white outline-none placeholder:text-white/40 focus:border-space-secondary/60 focus:ring-2 focus:ring-space-secondary/20"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-white/80">Password</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-space-main/30 p-2 text-white outline-none placeholder:text-white/40 focus:border-space-accent/60 focus:ring-2 focus:ring-space-accent/20"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-space-secondary/30 bg-space-secondary/10 p-2 text-sm text-space-accent">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  )
}

export default LoginPage

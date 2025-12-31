import { api } from "@/lib/api"

export type User = {
  id: number
  username: string
  role: string
}

export type LoginRequest = {
  username: string
  password: string
}

export async function login(payload: LoginRequest): Promise<User> {
  const form = new URLSearchParams()
  form.set("username", payload.username)
  form.set("password", payload.password)

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined")
  }

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form.toString()
  })

  const text = await response.text()

  if (!response.ok) {
    let message = `Login failed with status ${response.status}`
    try {
      const data = text ? JSON.parse(text) : null
      message = data?.detail ?? message
    } catch {
      message = text || message
    }
    throw new Error(message)
  }

  try {
    const data = text ? JSON.parse(text) : null
    return data as User
  } catch {
    throw new Error("Login response is not valid JSON")
  }
}

export function me(): Promise<User> {
  return api<User>({
    method: "GET",
    path: "/auth/me",
    cache: "no-store"
  })
}

export function logout(): Promise<{ ok: true }> {
  return api<{ ok: true }>({
    method: "POST",
    path: "/auth/logout"
  })
}

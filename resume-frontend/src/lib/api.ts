import type { RequestOptions } from "./api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend"

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined")
}

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function extractErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    return err.message
  } else if (err instanceof Error) {
    return err.message
  } else {
    return "Unknown error"
  }
}

function joinUrl(base: string, path: string): string {
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base
  const cleanPath = path.startsWith("/") ? path : `/${path}`

  return `${cleanBase}${cleanPath}`
}

async function request<T>(opts: RequestOptions): Promise<T> {
  const { method = "GET", path, body, headers, cache } = opts

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  }

  const hasJsonBody = body !== undefined && body !== null
  if (hasJsonBody) {
    finalHeaders["Content-Type"] = "application/json"
  }

  const response = await fetch(joinUrl(API_BASE_URL, path), {
    method,
    credentials: "include",
    headers: finalHeaders,
    body: hasJsonBody ? JSON.stringify(body) : undefined,
    cache,
  })

  const text = await response.text()
  let data: unknown = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const errData = data as Record<string, unknown>
    const message =
      (errData?.delail as string) ?? (errData?.message as string) ?? `Request failed with status ${response.status}`

    throw new ApiError(message, response.status, data)
  }

  return data as T
}

const api = {
  request,

  get: <T>(path: string, opts?: Omit<RequestOptions, "path" | "method">) =>
    request<T>({ method: "GET", path, ...opts }),

  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "path" | "method" | "body">) =>
    request<T>({ method: "POST", path, body, ...opts }),

  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "path" | "method" | "body">) =>
    request<T>({ method: "PUT", path, body, ...opts }),

  delete: <T>(path: string, opts?: Omit<RequestOptions, "path" | "method">) =>
    request<T>({ method: "DELETE", path, ...opts }),
}

export default api

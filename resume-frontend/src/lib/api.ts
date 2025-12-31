const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type RequestOptions = {
  method?: HttpMethod
  path: string
  body?: unknown
  headers?: Record<string, string>
  cache?: RequestCache
}

export async function api<T>(opts: RequestOptions): Promise<T> {
  const { method = "GET", path, body, headers, cache } = opts

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache
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
    const obj = data as any
    const message =
      obj?.detail ??
      obj?.message ??
      `Request failed with status ${response.status}`

    throw new ApiError(message, response.status, data)
  }

  return data as T
}

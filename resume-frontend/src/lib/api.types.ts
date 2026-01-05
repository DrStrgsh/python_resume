export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export interface RequestOptions {
  method?: HttpMethod
  path: string
  body?: unknown
  headers?: Record<string, string>
  cache?: RequestCache
}

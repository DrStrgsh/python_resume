import { NextRequest } from "next/server"

type RouteContext = {
  params: Promise<{ path: string[] }>
}

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL ?? "http://localhost:8000"

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params

  return proxy(req, path)
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params

  return proxy(req, path)
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params

  return proxy(req, path)
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params

  return proxy(req, path)
}

async function proxy(req: NextRequest, pathParts: string[]) {
  const targetUrl = new URL(`${FASTAPI_BASE_URL}/${pathParts.join("/")}`)
  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value)
  })

  const requestHeadersObj: Record<string, string> = {}
  req.headers.forEach((value, key) => {
    requestHeadersObj[key] = value
  })

  delete requestHeadersObj["host"]
  delete requestHeadersObj["origin"]
  delete requestHeadersObj["referer"]

  const requestInit: RequestInit = {
    method: req.method,
    headers: requestHeadersObj,
    redirect: "manual",
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    requestInit.body = await req.arrayBuffer()
  }

  const upstream: Response = await fetch(targetUrl, requestInit)

  return upstream
}

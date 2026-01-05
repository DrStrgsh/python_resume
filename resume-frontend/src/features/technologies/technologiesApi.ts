import api from "@/lib/api"
import type { Tech, TechInput } from "./technologies.types"

export async function getTech(): Promise<Tech[]> {
  return api.get<Tech[]>("/technologies")
}

export async function createTech(input: TechInput): Promise<Tech> {
  return api.post<Tech>("/technologies", input, { cache: "no-store" })
}

export async function updateTech(id: number, input: TechInput): Promise<Tech> {
  return api.put<Tech>(`/technologies/${id}`, input, { cache: "no-store" })
}

export async function deleteTech(id: number): Promise<void> {
  return api.delete<void>(`/technologies/${id}`)
}

import api from "@/lib/api"
import type { Project, ProjectInput } from "./projects.types"

export async function getProjects(): Promise<Project[]> {
  return api.get<Project[]>("/projects")
}

export async function createProject(input: ProjectInput): Promise<Project> {
  return api.post<Project>("/projects", input, { cache: "no-store" })
}

export async function updateProject(id: number, input: ProjectInput): Promise<Project> {
  return api.patch<Project>(`/projects/${id}`, input, { cache: "no-store" })
}

export async function deleteProject(id: number): Promise<void> {
  return api.delete<void>(`/projects/${id}`)
}

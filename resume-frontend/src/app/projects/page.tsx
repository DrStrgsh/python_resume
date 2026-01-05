"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

import api, { ApiError, extractErrorMessage } from "@/lib/api"
import Button from "@/components/Button"
import type { Project, ProjectModalMode } from "./project.types"
import ProjectModal from "./ProjectModal"
import { useAuth } from "@/features/auth/useAuth"

export default function ProjectsPage() {
  async function listProjects(): Promise<Project[]> {
    return api.get<Project[]>("/projects")
  }

  const queryClient = useQueryClient()
  const { isAdmin } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ProjectModalMode>("create")
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery<Project[], ApiError>({ queryKey: ["projects"], queryFn: listProjects })

  function openCreate() {
    setModalMode("create")
    setEditingProject(null)
    setIsModalOpen(true)
  }

  function openEdit(project: Project) {
    setModalMode("edit")
    setEditingProject(project)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  async function deleteProject(id: number): Promise<{ message: string }> {
    return api.delete(`/projects/${id}`, { cache: "no-store" })
  }

  const deleteMutation = useMutation<{ message: string }, ApiError, { id: number }>({
    mutationFn: ({ id }) => deleteProject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast.success("Project deleted successfully")
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err))
    },
  })

  async function handleDelete(id: number) {
    await deleteMutation.mutateAsync({ id })
  }

  return (
    <>
      <main className="mx-auto w-full max-w-5xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl uppercase tracking-widest text-white">Projects</h1>
          {isAdmin && (
            <Button onClick={openCreate} disabled={isLoading}>
              + Add
            </Button>
          )}
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          {isLoading && <p className="text-white/60">Loading projects...</p>}
          {isError && (
            <div className="space-y-2">
              <p className="text-sm text-space-accent">Failed to load projects.</p>
              <p className="text-xs text-white/50">{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          )}
          {!isLoading && !isError && (
            <>
              {projects && projects.length > 0 ? (
                <ul className="space-y-3">
                  {projects.map((p) => (
                    <li key={p.id} className="rounded-xl border border-white/10 bg-space-bg/30 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-sm font-semibold text-white">{p.title}</h2>
                          <p className="mt-1 text-justify text-sm text-white/70">{p.description}</p>
                          {p.url && (
                            <div>
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 text-sm text-space-secondary hover:text-space-accent"
                              >
                                {p.url}
                              </a>
                            </div>
                          )}
                          {p.repo_url && (
                            <div>
                              <a
                                href={p.repo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 text-sm text-space-secondary hover:text-space-accent"
                              >
                                Repo: {p.repo_url}
                              </a>
                            </div>
                          )}
                          {p.tags && (
                            <p className="mt-3 flex flex-wrap gap-1">
                              {p.tags.split(",").map((tag, index) => (
                                <span
                                  key={`${tag.trim()}-${index}`}
                                  className="
                                    rounded-sm border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] font-mono
                                    tracking-wider text-white/80 transition-colors
                                    hover:border-space-secondary hover:bg-space-secondary/10 hover:text-white
                                  "
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button onClick={() => openEdit(p)}>Edit</Button>
                            <Button onClick={() => handleDelete(p.id)}>Delete</Button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/60">No projects yet.</p>
              )}
            </>
          )}
        </div>
      </main>
      <ProjectModal
        key={editingProject?.id ?? "new"}
        isOpen={isModalOpen}
        mode={modalMode}
        initialProject={editingProject}
        onClose={closeModal}
      />
    </>
  )
}

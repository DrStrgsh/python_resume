"use client"

import React from "react"
import { useState } from "react"

import ModalShell from "@/components/ModalShell"
import type { ProjectInput, ProjectModalProps } from "./project.types"
import Button from "@/components/Button"
import { useProjectMutations } from "@/features/projects/useProjects"

export default function ProjectModal({ isOpen, mode, initialProject = null, onClose }: ProjectModalProps) {
  function emptyFrom(): ProjectInput {
    return {
      title: "",
      slug: "",
      description: "",
      url: null,
      repo_url: null,
      tags: null,
    }
  }

  const [form, setForm] = useState<ProjectInput>(() => {
    if (mode === "edit" && initialProject) {
      return {
        title: initialProject.title,
        slug: initialProject.slug,
        description: initialProject.description,
        url: initialProject.url,
        repo_url: initialProject.repo_url,
        tags: initialProject.tags,
      }
    }
    return emptyFrom()
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { createProject, updateProject, isCreating, isUpdating } = useProjectMutations({ onClose, setErrorMessage })

  function title() {
    return mode === "create" ? "Create Project" : "Edit Project"
  }

  function normalizeOptional(value: string): string | null {
    const v = value.trim()

    return v === "" ? null : v
  }

  const isSaving = isCreating || isUpdating

  function setField<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.title.trim() || !form.slug.trim() || !form.description.trim()) {
      return setErrorMessage("Title, slug and description are required")
    }

    const payload: ProjectInput = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      url: form.url,
      repo_url: form.repo_url,
      tags: form.tags,
    }

    if (mode === "create") {
      createProject(payload)
      return
    }

    if (!initialProject) {
      setErrorMessage("No project to update")
      return
    }

    updateProject({ id: initialProject.id, input: payload })
  }

  return (
    <ModalShell isOpen={isOpen} title={title()} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/60">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="
                mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none
                focus:border-space-secondary/60
              "
              placeholder="My Project"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              className="
                mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none
                focus:border-space-secondary/60
              "
              placeholder="my-project"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/60">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className="
              mt-1 h-40 w-full resize-none overflow-y-auto rounded-lg border border-white/10 bg-white/5 px-3 py-2
              text-sm text-white outline-none focus:border-space-secondary/60
            "
            placeholder="What is this project about?"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/60">URL</label>
            <input
              value={form.url ?? ""}
              onChange={(e) => setField("url", normalizeOptional(e.target.value))}
              className="
                mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none
                focus:border-space-secondary/60
              "
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Repo URL</label>
            <input
              value={form.repo_url ?? ""}
              onChange={(e) => setField("repo_url", normalizeOptional(e.target.value))}
              className="
                mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none
                focus:border-space-secondary/60
              "
              placeholder="https://github.com/user/repo"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/60">Tags</label>
          <input
            value={form.tags ?? ""}
            onChange={(e) => setField("tags", normalizeOptional(e.target.value))}
            className="
              mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none
              focus:border-space-secondary/60
            "
            placeholder="tag1, tag2, tag3"
          />
        </div>
        {errorMessage && <p className="text-sm text-space-accent">{errorMessage}</p>}
        <div className="flex justify-between items-center gap-3 pt-6">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

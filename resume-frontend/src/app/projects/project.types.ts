export interface Project {
  id: number
  title: string
  slug: string
  description: string
  url: string | null
  repo_url: string | null
  tags: string | null
  created_at: string
  updated_at: string
}

export type ProjectInput = {
  title: string
  slug: string
  description: string
  url: string | null
  repo_url: string | null
  tags: string | null
}

export type ProjectModalMode = "create" | "edit"

export type ProjectModalProps = {
  key: number | string
  isOpen: boolean
  mode: ProjectModalMode
  initialProject?: Project | null
  onClose: () => void
  onSuccess?: () => void
}

export type UpdateProjectProps = {
  id: number
  input: ProjectInput
}

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

export type UpdateProjectProps = {
  id: number
  input: ProjectInput
}

export interface UseProjectMutationsProps {
  onClose?: () => void
  setErrorMessage?: (message: string | null) => void
}

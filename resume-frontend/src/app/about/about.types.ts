export interface Tech {
  id: number
  name: string
  start_year: number
  created_at: string
  updated_at: string
}

export type TechInput = {
  name: string
  start_year: number
}

export type TechModalMode = "create" | "edit"

export type TechModalProps = {
  key: number | string
  isOpen: boolean
  mode: TechModalMode
  initialTech?: Tech | null
  onClose: () => void
  onSuccess?: () => void
}

export type UpdateTechProps = {
  id: number
  input: TechInput
}

export type TechStackProps = {
  technologies: Tech[]
  openEdit: (tech: Tech) => void
}

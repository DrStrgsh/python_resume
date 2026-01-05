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

export type UpdateTechProps = {
  id: number
  input: TechInput
}

export interface UseTechMutationsProps {
  onClose?: () => void
  setErrorMessage?: (message: string | null) => void
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

import { createProject, deleteProject, getProjects, updateProject } from "./projectsApi"
import { extractErrorMessage } from "@/lib/api"
import type { ApiError } from "@/lib/api"
import type { Project, ProjectInput, UpdateProjectProps, UseProjectMutationsProps } from "./projects.types"

export function useProjects() {
  return useQuery<Project[], ApiError>({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProjectMutations({ onClose, setErrorMessage }: UseProjectMutationsProps = {}) {
  const queryClient = useQueryClient()

  const handleError = (err: ApiError) => {
    const message = extractErrorMessage(err)
    toast.error(message)
    setErrorMessage?.(message)
  }

  const handleSuccess = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["projects"] })
    toast.success(message)
    setErrorMessage?.(null)
    onClose?.()
  }

  const createMutation = useMutation<Project, ApiError, ProjectInput>({
    mutationFn: createProject,
    onSuccess: () => handleSuccess("Project created successfully"),
    onError: handleError,
  })

  const updateMutation = useMutation<Project, ApiError, UpdateProjectProps>({
    mutationFn: ({ id, input }) => updateProject(id, input),
    onSuccess: () => handleSuccess("Project updated successfully"),
    onError: handleError,
  })

  const deleteMutation = useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => deleteProject(id),
    onSuccess: () => handleSuccess("Project deleted successfully"),
    onError: handleError,
  })

  return {
    createProject: createMutation.mutate,
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  }
}
